'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './Dashboard.module.css';

export default function DashboardPage() {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const userId = localStorage.getItem('userId');

    if (!userId) return;

    // Fetch username from backend
    fetch(`http://localhost:4000/api/user-info`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.username) setUsername(data.username);
      });
  }, []);

  return (
    <div className={styles.container}>
      {/* top nav bar */}
      <div className={styles.topNav}>
        <h1 className={styles.title}>NuMe Dashboard</h1>
        <div className={styles.avatar}>
          {username ? username[0].toUpperCase() : 'U'}
        </div>
      </div>

      {/* greeting */}
      <div className={styles.greeting}>
        <h2>Welcome {username || 'User'}!</h2>
      </div>

      {/* dashboard icons / features */}
      <div className={styles.sectionGrid}>
        <Link href="/sleep" className={styles.sectionCard}>
          <span className={styles.emoji}>🛌</span>
          <h3>Sleep Tracking</h3>
        </Link>
        <Link href="/meals" className={styles.sectionCard}>
          <span className={styles.emoji}>🍽️</span>
          <h3>Meal Logging</h3>
        </Link>
        <Link href="/mood" className={styles.sectionCard}>
          <span className={styles.emoji}>😊</span>
          <h3>Mood Journal</h3>
        </Link>
        <Link href="/ai" className={styles.sectionCard}>
          <span className={styles.emoji}>🤖</span>
          <h3>AI Recommendations</h3>
        </Link>
        <Link href="/settings" className={styles.sectionCard}>
          <span className={styles.emoji}>⚙️</span>
          <h3>Settings</h3>
        </Link>
        <Link href="/logout" className={styles.sectionCard}>
          <span className={styles.emoji}>🚪</span>
          <h3>Logout</h3>
        </Link>
      </div>
    </div>
  );
}