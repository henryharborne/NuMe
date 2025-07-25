'use client';

import { useState } from 'react';
import styles from './Settings.module.css';

export default function SettingsPage() {
  const [newUsername, setNewUsername] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const backendUrl = 'http://localhost:4000';
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

  const updateUsername = async () => {
    setMessage('');
    const res = await fetch(`${backendUrl}/api/settings/username`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, newUsername }),
    });

    const data = await res.json();
    setMessage(res.ok ? 'Username updated successfully' : data.error || 'Failed to update username');
  };

  const updatePassword = async () => {
    setMessage('');
    const res = await fetch(`${backendUrl}/api/settings/password`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, oldPassword, newPassword }),
    });

    const data = await res.json();
    setMessage(res.ok ? 'Password updated successfully' : data.error || 'Failed to update password');
  };

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <h3>Change Username</h3>
        <input
          type="text"
          placeholder="New username"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
          className={styles.input}
        />
        <button onClick={updateUsername} className={styles.button}>
          Update Username
        </button>
      </div>

      <div className={styles.section}>
        <h3>Change Password</h3>
        <input
          type="password"
          placeholder="Current password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className={styles.input}
        />
        <input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className={styles.input}
        />
        <button onClick={updatePassword} className={styles.button}>
          Update Password
        </button>
      </div>

      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
}
