// src/cms/components/Modals/HistoryModal.tsx
import React, { useState } from 'react';
import { useCms } from '../../CmsContext';
import styles from './HistoryModal.module.css';

export const HistoryModal: React.FC = () => {
  const { isHistoryModalOpen, setIsHistoryModalOpen, historyList, rollbackToVersion } = useCms();
  const [restoringId, setRestoringId] = useState<string | null>(null);

  if (!isHistoryModalOpen) return null;

  const handleRollback = async (item: any) => {
    const confirmed = window.confirm(
      `Are you sure you want to rollback the live website to Version ${item.version} (published on ${new Date(
        item.publishedAt
      ).toLocaleString()})?`
    );
    if (!confirmed) return;

    setRestoringId(item.id);
    try {
      await rollbackToVersion(item);
      setIsHistoryModalOpen(false);
    } finally {
      setRestoringId(null);
    }
  };

  return (
    <div className={styles.overlay} onClick={() => !restoringId && setIsHistoryModalOpen(false)}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className={styles.header}>
          <h2 className={styles.title}>PUBLISHED REVISION HISTORY</h2>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={() => setIsHistoryModalOpen(false)}
            disabled={Boolean(restoringId)}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className={styles.list}>
          {historyList.length === 0 ? (
            <div className={styles.emptyState}>No previous revisions found in history.</div>
          ) : (
            historyList.map((item) => (
              <div key={item.id} className={styles.itemCard}>
                <div className={styles.meta}>
                  <span className={styles.versionBadge}>VERSION {item.version}</span>
                  <span className={styles.dateText}>{new Date(item.publishedAt).toLocaleString()}</span>
                  <span className={styles.authorText}>Published by {item.publishedBy || 'Admin'}</span>
                </div>
                <button
                  type="button"
                  className={styles.rollbackBtn}
                  onClick={() => handleRollback(item)}
                  disabled={restoringId === item.id}
                >
                  {restoringId === item.id ? 'RESTORING…' : 'RESTORE VERSION ↺'}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
