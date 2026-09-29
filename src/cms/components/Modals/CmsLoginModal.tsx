// src/cms/components/Modals/CmsLoginModal.tsx
import React, { useState } from 'react';
import { useCms } from '../../CmsContext';
import styles from './CmsLoginModal.module.css';

export const CmsLoginModal: React.FC = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, login } = useCms();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isLoginModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = login(password);
    if (!success) {
      setError('Invalid admin credentials. Please try again.');
    } else {
      setPassword('');
    }
  };

  return (
    <div className={styles.overlay} onClick={() => setIsLoginModalOpen(false)}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <button
          type="button"
          className={styles.closeBtn}
          onClick={() => setIsLoginModalOpen(false)}
          aria-label="Close"
        >
          ✕
        </button>

        <div className={styles.brand}>
          <img src="/AD Transparent SVG.svg" alt="Aranea Den" className={styles.logo} />
          <h2 className={styles.title}>ARANEA DEN CMS</h2>
          <p className={styles.subtitle}>Direct In-Place Visual Editor</p>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Admin Password</label>
            <input
              type="password"
              className={styles.input}
              placeholder="Enter master admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              required
            />
          </div>

          <button type="submit" className={styles.submitBtn}>
            ENTER EDIT MODE →
          </button>
        </form>

        <p className={styles.hint}>
          Shortcut: Press <kbd style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 5px', borderRadius: '3px' }}>Ctrl + Shift + E</kbd> anywhere to toggle.
        </p>
      </div>
    </div>
  );
};
