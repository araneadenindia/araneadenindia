// src/admin/pages/AdminLogin.tsx
import React, { useState } from 'react';
import { authApi } from '../api';
import styles from './AdminLogin.module.css';

interface Props {
  onLogin: (user: { username: string; mustChangePassword: boolean }) => void;
}

export const AdminLogin: React.FC<Props> = ({ onLogin }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await authApi.login(username.trim(), password);
      onLogin({ username: username.trim(), mustChangePassword: data.mustChangePassword });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <img src="/AD Transparent SVG.svg" alt="Aranea Den" className={styles.logo} />
          <h1 className={styles.title}>ARANEA DEN</h1>
          <p className={styles.subtitle}>Content Management System</p>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={styles.input}
              placeholder="admin"
              autoComplete="username"
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Signing in…' : 'SIGN IN →'}
          </button>
        </form>

        <p className={styles.footer}>Access restricted to authorized administrators only.</p>
      </div>
    </div>
  );
};
