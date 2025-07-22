'use client';

import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import styles from './SleepPage.module.css';

export default function SleepPage() {
  const [entries, setEntries] = useState<{ date: string; hours: number }[]>([]);
  const [date, setDate] = useState('');
  const [hours, setHours] = useState('');
  const [tracking, setTracking] = useState(false);
  const [quality, setQuality] = useState('0');
  const [weeklySleep, setWeeklySleep] = useState<(number | null)[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !hours) return;
    setEntries([...entries, { date, hours: parseFloat(hours) }]);
    setDate('');
    setHours('');
  };

  const handleStartTracking = () => setTracking(true);
  const handleStopTracking = () => setTracking(false);

  const handleUpdateWeeklySleep = () => {
    const sorted = [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const recent = sorted.slice(-7);
    const padded = Array(7).fill(null).map((_, i) => recent[i]?.hours ?? null);
    setWeeklySleep(padded);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Sleep Tracking</h1>

      <div className={styles.widgets}>
        <div className={styles.widget}>
          <h2 className={styles.sectionHeading}>{date || 'Select a date'}</h2>
          <p>Sleep time: Not set</p>
          {!tracking ? (
            <button className={styles.startTracking} onClick={handleStartTracking}>
              Start Tracking
            </button>
          ) : (
            <button className={styles.stopTracking} onClick={handleStopTracking}>
              Stop Tracking
            </button>
          )}
        </div>

        <div className={styles.widget}>
          <h3 className={styles.sectionHeading}>Statistics</h3>
          <div className={styles.stat}>
            <p>Quality</p>
            <p>{quality}%</p>
            <div className={styles.progressBar}>
              <div
                style={{ width: `${parseFloat(quality)}%` }}
                className={styles.progress}
              ></div>
            </div>
          </div>
          <div className={styles.stat}>
            <p>Duration</p>
            <p>{hours || '0'} hours</p>
            <div className={styles.progressBar}>
              <div
                style={{
                  width: `${(parseFloat(hours || '0') / 8) * 100}%`,
                }}
                className={styles.progress}
              ></div>
            </div>
          </div>
        </div>

        <div className={styles.widget}>
          <h3 className={styles.sectionHeading}>Weekly Sleep</h3>

          {weeklySleep.filter(v => v !== null).length > 0 ? (
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={200}>
              <LineChart
                data={weeklySleep.map((h, i) => ({ day: `Day ${i + 1}`, hours: h }))}
                margin={{ top: 10, right: 20, left: 10, bottom: 30 }} 
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="day"
                  interval={0}
                  tick={{ fontSize: 12 }}
                  height={40}
                  tickMargin={10} 
                />
                <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="hours"
                  stroke="#6c63ff"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  isAnimationActive={false}
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>

            </div>
          ) : (
            <p className={styles.placeholder}>No weekly data yet. Click below to update.</p>
          )}

          <button className={styles.button} onClick={handleUpdateWeeklySleep}>
            Update Weekly Sleep
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.label}>
          Date:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className={styles.input}
            aria-label="Select date"
          />
        </label>
        <label className={styles.label}>
          Hours Slept:
          <input
            type="number"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            required
            min="0"
            max="24"
            step="0.1"
            className={styles.input}
            aria-label="Enter hours slept"
          />
        </label>
        <button type="submit" className={styles.button}>
          Log Sleep
        </button>
      </form>

      <h2 className={styles.sectionHeading}>Logged Entries</h2>
      <ul className={styles.entries}>
        {entries.length === 0 ? (
          <li className={styles.entry}>No entries logged yet.</li>
        ) : (
          entries.map((entry, i) => (
            <li key={i} className={styles.entry}>
              {entry.date || 'No date'}: {entry.hours || '0'} hours
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

