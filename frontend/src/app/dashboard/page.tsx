'use client';
import Link from 'next/link';
import styles from './Dashboard.module.css';

export default function DashboardPage() {
  return (
    <div className={styles.container}>
      {/* top nav bar*/}
      <div className={styles.topNav}>
        <h1 className={styles.title}>NuMe Dashboard</h1>
        <div className={styles.avatar}>T</div>
      </div>

      {/* greeting - update with user's name FIXME */}
      <div className={styles.greeting}>
        <h2>Welcome Test User!</h2>
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
