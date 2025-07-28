  'use client';

  import { useState } from 'react';
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

      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // MAKE FETCH REQUEST HERE
      
      // Placeholder response
      if (type === 'mood') {
        setAnalysis({
          summary: "PLACEHOLDER MOOD RESPONSE",
          affirmation: "Insert affirmation"
        });
      } else if (type === 'sleep') {
        setAnalysis({
          summary: "PLACEHOLDER SLEEP RESPONSE",
          affirmation: "Insert affirmation"
        });
      } else {
        setAnalysis({
          summary: 'PLACEHOLDER MEAL RESPONSE',
          affirmation: "Insert affirmation"
        });
      }
      setIsLoading(false);
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
