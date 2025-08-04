'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './Mood.module.css';

export default function MoodPage() {
  const [mood, setMood] = useState('');
  const [note, setNote] = useState('');
  const [entries, setEntries] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const backendUrl = 'http://localhost:4000';
  const userId =
    typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

  const fetchEntries = async () => {
    if (!userId) return;
    const res = await fetch(`${backendUrl}/api/mood-journal/${userId}`);
    const data = await res.json();
    setEntries(data.data || []);
  };

  const handleSubmit = async () => {
    if (!mood.trim()) {
      setMessage('Please enter a mood.');
      return;
    }

    const res = await fetch(`${backendUrl}/api/mood-journal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, mood, note }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage('Mood saved!');
      setMood('');
      setNote('');
      fetchEntries(); // refresh list
    } else {
      setMessage(data.error || 'Failed to save mood.');
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  return (
    <div className={styles.container}>
      <Link href="/dashboard" className={styles.backButton}>
        &larr;
      </Link>

      <header className={styles.title}>Mood Journal</header>

      <div className={styles.form}>
        <input
          type="text"
          className={styles.input}
          placeholder="Your mood"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
        />
        <textarea
          className={styles.input}
          placeholder="Optional note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <button onClick={handleSubmit} className={styles.button}>
          Add Entry
        </button>
        {message && <p className={styles.message}>{message}</p>}
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionHeading}>Your Entries</h3>
        {entries.length === 0 ? (
          <p className={styles.noEntries}>No entries yet.</p>
        ) : (
          <ul className={styles.entries}>
            {entries.map((entry) => (
              <li key={entry.id} className={styles.entry}>
                <strong>{entry.mood}</strong>
                {entry.note && <div><em>{entry.note}</em></div>}
                <small>{new Date(entry.created_at).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
