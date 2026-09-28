// src/admin/pages/AdminChangePassword.tsx
import React, { useState } from 'react';
import { authApi } from '../api';
import loginStyles from './AdminLogin.module.css';

interface Props { onChanged: () => void; }

export const AdminChangePassword: React.FC<Props> = ({ onChanged }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (newPassword !== confirm) { setError('Passwords do not match.'); return; }
    if (newPassword.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setLoading(true);
    try {
      await authApi.changePassword(newPassword);
      onChanged();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to change password.');
    } finally { setLoading(false); }
  };

  return (
    <div className={loginStyles.page}>
      <div className={loginStyles.card}>
        <div className={loginStyles.brand}>
          <img src="/AD Transparent SVG.svg" alt="Aranea Den" className={loginStyles.logo} />
          <h1 className={loginStyles.title}>SET NEW PASSWORD</h1>
          <p className={loginStyles.subtitle}>Required before accessing the CMS</p>
        </div>

        {error && <div className={loginStyles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={loginStyles.form}>
          <div className={loginStyles.field}>
            <label className={loginStyles.label}>New Password</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
              className={loginStyles.input} placeholder="Minimum 8 characters" required />
          </div>
          <div className={loginStyles.field}>
            <label className={loginStyles.label}>Confirm Password</label>
            <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)}
              className={loginStyles.input} placeholder="Repeat password" required />
          </div>
          <button type="submit" className={loginStyles.submitBtn} disabled={loading}>
            {loading ? 'Saving…' : 'SET PASSWORD →'}
          </button>
        </form>
      </div>
    </div>
  );
};
