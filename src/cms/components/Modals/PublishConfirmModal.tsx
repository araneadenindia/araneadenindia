// src/cms/components/Modals/PublishConfirmModal.tsx
import React, { useState } from 'react';
import { useCms } from '../../CmsContext';
import styles from './PublishConfirmModal.module.css';

export const PublishConfirmModal: React.FC = () => {
  const { isPublishModalOpen, setIsPublishModalOpen, publishChanges, draftContent } = useCms();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isPublishModalOpen) return null;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await publishChanges();
      setIsPublishModalOpen(false);
    } catch {
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={() => !isSubmitting && setIsPublishModalOpen(false)}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className={styles.header}>
          <h2 className={styles.title}>PUSH CHANGES LIVE?</h2>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={() => setIsPublishModalOpen(false)}
            disabled={isSubmitting}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className={styles.body}>
          <p>
            You are about to publish your current draft content to the live public website (target version v
            {(draftContent.metadata.version || 1) + 1}).
          </p>
          <p>
            All website visitors will immediately see your latest edits. A snapshot will automatically be archived in revision history for instant rollback if needed.
          </p>
          <div className={styles.warningBox}>
            <span>⚠️</span>
            <span>This action will update the public website content in real time.</span>
          </div>
        </div>

        <div className={styles.footer}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={() => setIsPublishModalOpen(false)}
            disabled={isSubmitting}
          >
            CANCEL
          </button>
          <button
            type="button"
            className={styles.confirmBtn}
            onClick={handleConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'PUBLISHING…' : 'CONFIRM & PUSH CHANGES →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublishConfirmModal;
