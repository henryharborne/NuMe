  'use client';

  import { useState, useEffect } from 'react';
  import Link from 'next/link';
  import styles from './AIRecommendations.module.css';

  type AnalysisResult = {
    sentiment?: string;
    themes?: string[];
    affirmation?: string;
    summary?: string; 
  };

  export default function AIRecommendationsPage() {
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeAnalysis, setActiveAnalysis] = useState<string | null>(null);

  const handleAnalysisRequest = async (type: string) => {
    setIsLoading(true);
    setError('');
    setAnalysis(null);
    setActiveAnalysis(type);

    try {
      let endpoint = '';
      if (type === 'mood') {
        endpoint = '/api/analyze/mood';
      } else {
        throw new Error(`Analysis not yet implemented for ${type}.`);
      }

      // 3. Make the fetch request to your backend
      const response = await fetch(endpoint); // This is a GET request

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to get ${type} analysis.`);
      }

      const data: AnalysisResult = await response.json();
      setAnalysis(data); // 4. Update the state with the analysis from the API

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false); // 5. Stop the loading indicator
    }
  };

    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <Link href="/dashboard" className={styles.backButton}>
            &larr;
          </Link>
          <div className={styles.titleContainer}>
            <h1>AI Recommendations</h1>
            <p>Click a button below to have an AI analyze your entries!</p>
          </div>
        </header>

        <div className={styles.buttonGrid}>
          <button className={styles.cardButton} onClick={() => handleAnalysisRequest('sleep')}>
            <span className={styles.emoji}>🛌</span>
            <h3>Sleep Tracking</h3>
          </button>
          <button className={styles.cardButton} onClick={() => handleAnalysisRequest('meal')}>
            <span className={styles.emoji}>🍽️</span>
            <h3>Meal Logging</h3>
          </button>
          <button className={styles.cardButton} onClick={() => handleAnalysisRequest('mood')}>
            <span className={styles.emoji}>😊</span>
            <h3>Mood Journal</h3>
          </button>
        </div>

        <main className={styles.resultsArea}>
          {isLoading ? (
            <div className={styles.loadingState}>
              <div className={styles.spinner}></div>
              <p>Analyzing your {activeAnalysis} data...</p>
            </div>
          ) : error ? (
            <p className={styles.errorText}>{error}</p>
          ) : analysis ? (
            <div className={styles.analysisResult}>
              <h3>AI Insights</h3>
              <p>{analysis.summary}</p>
              {analysis.affirmation && (
                <div className={styles.affirmationBox}>
                  <strong>A Gentle Affirmation:</strong>
                  <p>"{analysis.affirmation}"</p>
                </div>
              )}
            </div>
          ) : (
            <p className={styles.placeholderText}>Your analysis will appear here.</p>
          )}
        </main>
      </div>
    );
  }
