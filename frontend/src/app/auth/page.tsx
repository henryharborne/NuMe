'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Auth.module.css';

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  const backendUrl = 'http://localhost:4000';

  const handleAuth = async () => {
    setMessage('');
    const endpoint = mode === 'login' ? '/api/login' : '/api/signup';

    const body =
      mode === 'login'
        ? { email, password }
        : { email, password, username };

    try {
      const res = await fetch(`${backendUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || 'An error occurred');
        return;
      }

      if (mode === 'signup') {
        setMessage('Account created! Please log in.');
        setMode('login');
      } else {
        // Store user ID for settings use later
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('email', data.email);
        router.push('/dashboard');
      }
    } catch (err) {
      setMessage('Network error. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>
          {mode === 'login' ? 'Login' : 'Sign Up'}
        </h2>

        {mode === 'signup' && (
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className={styles.input}
          />
        )}

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className={styles.input}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className={styles.input}
        />

        <button onClick={handleAuth} className={styles.button}>
          {mode === 'login' ? 'Login' : 'Sign Up'}
        </button>

        {message && <p className={styles.error}>{message}</p>}

        <p className={styles.toggleText}>
          {mode === 'login' ? 'Need an account?' : 'Already have one?'}{' '}
          <button
            onClick={() =>
              setMode(mode === 'login' ? 'signup' : 'login')
            }
            className={styles.toggle}
          >
            {mode === 'login' ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}
