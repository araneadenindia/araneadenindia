// src/cms/components/AdminToolbar/CmsFloatingTrigger.tsx
import React from 'react';
import { useCms } from '../../CmsContext';
import styles from './CmsFloatingTrigger.module.css';

export const CmsFloatingTrigger: React.FC = () => {
  const { isAdmin, isEditMode, setEditMode, setIsLoginModalOpen } = useCms();

  const handleClick = () => {
    if (!isAdmin) {
      setIsLoginModalOpen(true);
    } else {
      setEditMode(!isEditMode);
    }
  };

  return (
    <button
      type="button"
      className={`${styles.trigger} ${isAdmin && isEditMode ? styles.active : ''}`}
      onClick={handleClick}
      title={
        !isAdmin
          ? 'Open Aranea CMS Login (Ctrl+Shift+E)'
          : isEditMode
          ? 'Toggle Admin Edit Mode Off'
          : 'Toggle Admin Edit Mode On'
      }
      aria-label="CMS Admin Mode Switch"
    >
      <span className={styles.dot} aria-hidden="true" />
      <span className={styles.text}>
        {!isAdmin ? '⚡ CMS' : isEditMode ? 'EDITING: ON' : 'EDITING: OFF'}
      </span>
    </button>
  );
};
