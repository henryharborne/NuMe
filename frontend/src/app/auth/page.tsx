'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  const backendUrl = 'http://localhost:4000'; // Change if needed

  const handleAuth = async () => {
    setMessage('');
    const endpoint = mode === 'login' ? '/api/login' : '/api/signup';

    try {
      const res = await fetch(`${backendUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
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
        // On login success, redirect to dashboard
        router.push('/dashboard');
      }
    } catch (err) {
      setMessage('Network error. Please try again.');
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>{mode === 'login' ? 'Login' : 'Sign Up'}</h2>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        style={{ display: 'block', marginBottom: 10 }}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        style={{ display: 'block', marginBottom: 10 }}
      />
      <button onClick={handleAuth}>
        {mode === 'login' ? 'Login' : 'Sign Up'}
      </button>
      <p style={{ color: 'red' }}>{message}</p>
      <p>
        {mode === 'login' ? 'Need an account?' : 'Already have one?'}{' '}
        <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
          {mode === 'login' ? 'Sign Up' : 'Login'}
        </button>
      </p>
    </div>
  );
}
