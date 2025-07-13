'use client';
import { useState } from 'react';

export default function SleepPage() {
  const [entries, setEntries] = useState<{ date: string; hours: number }[]>([]);
  const [date, setDate] = useState('');
  const [hours, setHours] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !hours) return;

    setEntries([...entries, { date, hours: parseFloat(hours) }]);
    setDate('');
    setHours('');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Sleep Tracking</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <label>
          Date:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            style={{ marginLeft: '0.5rem', marginRight: '1rem' }}
          />
        </label>
        <label>
          Hours Slept:
          <input
            type="number"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            required
            min="0"
            max="24"
            step="0.1"
            style={{ marginLeft: '0.5rem', marginRight: '1rem' }}
          />
        </label>
        <button type="submit">Log Sleep</button>
      </form>

      <h2>Logged Entries</h2>
      <ul>
        {entries.map((entry, i) => (
          <li key={i}>
            {entry.date}: {entry.hours} hours
          </li>
        ))}
      </ul>
    </div>
  );
}