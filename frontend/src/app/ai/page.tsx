'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './AIRecommendations.module.css'

export default function AIChatPage() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAskAI = async () => {
    if (!input.trim()) return;

    setIsLoading(true);
    setError('');
    setResponse('');

    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to get AI response.');
      }

      const data = await res.json();
      setResponse(data.reply);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred.');
    } finally {
      setIsLoading(false);
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
          <p>Ask anything and get an AI generated response!</p>
        </div>
      </header>

      <main className={styles.chatArea}>
        <textarea
          className={styles.textarea}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your question here..."
          rows={3}
        />
        <button
          className={styles.askButton}
          onClick={handleAskAI}
          disabled={isLoading}
        >
          {isLoading ? 'Thinking...' : 'Ask AI'}
        </button>

        {error && <p className={styles.errorText}>{error}</p>}

        {response && (
          <div className={styles.responseBox}>
            <h3>AI says:</h3>
            <p>{response}</p>
          </div>
        )}
      </main>
    </div>
  );
}
