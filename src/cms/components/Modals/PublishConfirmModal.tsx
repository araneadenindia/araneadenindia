// src/cms/components/Modals/PublishConfirmModal.tsx
import React, { useState, useMemo } from 'react';
import { useCms } from '../../CmsContext';
import { CmsContentTree } from '../../types';
import styles from './PublishConfirmModal.module.css';

function validateDraft(content: CmsContentTree): string[] {
  const errors: string[] = [];
  if (!content) {
    errors.push('Content draft is empty.');
    return errors;
  }
  if (!content.home?.hero?.headline1?.trim()) {
    errors.push('Hero headline 1 cannot be empty.');
  }
  if (!content.home?.hero?.media?.url?.trim()) {
    errors.push('Hero media URL is required.');
  }
  return errors;
}

export const PublishConfirmModal: React.FC = () => {
  const { isPublishModalOpen, setIsPublishModalOpen, publishChanges, draftContent } = useCms();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);

  const validationErrors = useMemo(() => validateDraft(draftContent), [draftContent]);
  const isValid = validationErrors.length === 0;

  if (!isPublishModalOpen) return null;

  const handleConfirm = async () => {
    if (!isValid) return;
    setIsSubmitting(true);
    setPublishError(null);
    try {
      await publishChanges();
      setIsPublishModalOpen(false);
    } catch (err: any) {
      setPublishError(err?.message || 'Publication failed. Please try again.');
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
            {(draftContent.metadata?.version || 1) + 1}).
          </p>
          <p>
            All website visitors will immediately see your latest edits. An immutable snapshot will automatically be archived in revision history for instant rollback if needed.
          </p>

          {!isValid ? (
            <div className={styles.warningBox} style={{ borderColor: '#FF4455', color: '#FFAAAA' }}>
              <span>✕</span>
              <div>
                <strong>Cannot publish due to validation errors:</strong>
                <ul style={{ margin: '6px 0 0 16px', padding: 0 }}>
                  {validationErrors.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className={styles.warningBox}>
              <span>⚠️</span>
              <span>This action will atomically promote draft to live production content in real time.</span>
            </div>
          )}

          {publishError && (
            <div style={{ color: '#FF7788', fontSize: '12px', marginTop: '10px' }}>
              {publishError}
            </div>
          )}
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
            disabled={isSubmitting || !isValid}
            style={{ opacity: isValid ? 1 : 0.5, cursor: isValid ? 'pointer' : 'not-allowed' }}
          >
            {isSubmitting ? 'PUBLISHING…' : 'CONFIRM & PUSH CHANGES →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublishConfirmModal;
