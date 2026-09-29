// src/cms/components/AdminToolbar/AdminToolbar.tsx
// Fixed top red toolbar for Aranea Den Admin Edit Mode
import React, { useEffect } from 'react';
import { useCms } from '../../CmsContext';
import styles from './AdminToolbar.module.css';

export const AdminToolbar: React.FC = () => {
  const {
    isAdmin,
    isEditMode,
    isPreviewMode,
    status,
    statusMessage,
    setEditMode,
    setPreviewMode,
    saveDraft,
    setIsPublishModalOpen,
    setIsHistoryModalOpen,
    logout,
  } = useCms();

  // Offset page body down by 42px while toolbar is visible so existing navbar sits seamlessly below
  useEffect(() => {
    if (isAdmin) {
      document.body.style.paddingTop = '42px';
      return () => {
        document.body.style.paddingTop = '0px';
      };
    }
  }, [isAdmin]);

  if (!isAdmin) return null;

  return (
    <aside className={styles.toolbar} aria-label="Admin Edit Mode Toolbar">
      <div className={styles.leftSection}>
        <div className={styles.brandBadge}>
          <span className={styles.brandDot} aria-hidden="true" />
          <span>ARANEA DEN CMS</span>
        </div>

        {/* Edit Mode Master Switch */}
        <button
          type="button"
          className={`${styles.btn} ${isEditMode ? styles.btnEditActive : styles.btnSecondary}`}
          onClick={() => setEditMode(!isEditMode)}
          title="Toggle In-Place Visual Editing On/Off"
        >
          <span>{isEditMode ? '● EDITING: ON' : '○ EDITING: OFF'}</span>
        </button>

        <div className={styles.statusIndicator}>
          <span className={styles.statusText}>
            {status === 'saving' && 'Saving draft…'}
            {status === 'publishing' && 'Publishing live…'}
            {status === 'unsaved' && '● Unsaved changes'}
            {status === 'saved' && '✓ Draft saved'}
            {status === 'published' && '✓ Published live'}
            {status === 'error' && (statusMessage || '✕ Error')}
          </span>
        </div>
      </div>

      <div className={styles.rightSection}>
        {/* Revision History */}
        <button
          type="button"
          className={`${styles.btn} ${styles.btnSecondary}`}
          onClick={() => setIsHistoryModalOpen(true)}
          title="View published version history & rollback"
        >
          <span>HISTORY</span>
        </button>

        {/* Save Draft */}
        <button
          type="button"
          className={`${styles.btn} ${styles.btnSecondary}`}
          onClick={saveDraft}
          disabled={status === 'saving' || status === 'publishing'}
          title="Save draft without publishing publicly"
        >
          <span>SAVE DRAFT</span>
        </button>

        {/* Preview Toggle */}
        <button
          type="button"
          className={`${styles.btn} ${styles.btnSecondary} ${isPreviewMode ? styles.btnPreviewActive : ''}`}
          onClick={() => setPreviewMode(!isPreviewMode)}
          title={isPreviewMode ? 'Exit preview and return to edit controls' : 'Preview draft without editing outlines'}
        >
          <span>{isPreviewMode ? 'EXIT PREVIEW' : 'PREVIEW'}</span>
        </button>

        {/* Push Changes Button */}
        <button
          type="button"
          className={`${styles.btn} ${styles.btnPush}`}
          onClick={() => setIsPublishModalOpen(true)}
          disabled={status === 'publishing'}
          title="Publish current draft live to website visitors"
        >
          <span className={styles.pulsingDot} aria-hidden="true" />
          <span>PUBLISH LIVE</span>
        </button>

        {/* Logout */}
        <button
          type="button"
          className={`${styles.btn} ${styles.btnLogout}`}
          onClick={logout}
          title="Log out of admin mode"
        >
          <span>LOGOUT →</span>
        </button>
      </div>
    </aside>
  );
};
