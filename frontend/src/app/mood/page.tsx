'use client';

import { useEffect, useState } from 'react';

export default function MoodPage() {
  const [mood, setMood] = useState('');
  const [note, setNote] = useState('');
  const [entries, setEntries] = useState([]);
  const [message, setMessage] = useState('');

  const backendUrl = 'http://localhost:4000';
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

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
    <div style={{ maxWidth: 600, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1>Mood Journal</h1>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Your mood"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '0.5rem' }}
        />
        <textarea
          placeholder="Optional note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          style={{ width: '100%', padding: '8px', height: 80, marginBottom: '0.5rem' }}
        />
        <button onClick={handleSubmit} style={{ padding: '8px 16px', backgroundColor: '#6a5acd', color: 'white', border: 'none', borderRadius: '4px' }}>
          Add Entry
        </button>
        {message && <p style={{ marginTop: '0.5rem' }}>{message}</p>}
      </div>

      <hr />

      <h3>Your Entries</h3>
      {entries.length === 0 ? (
        <p>No entries yet.</p>
      ) : (
        <ul>
          {entries.map((entry: any) => (
            <li key={entry.id} style={{ marginBottom: '1rem' }}>
              <strong>{entry.mood}</strong> <br />
              {entry.note && <em>{entry.note}</em>} <br />
              <small>{new Date(entry.created_at).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
