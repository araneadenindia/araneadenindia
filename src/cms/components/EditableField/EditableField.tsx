// src/cms/components/EditableField/EditableField.tsx
import React, { useState } from 'react';
import { useCms } from '../../CmsContext';
import styles from './EditableField.module.css';

interface EditableFieldProps {
  fieldPath: string;
  fieldLabel: string;
  value: string;
  isTextarea?: boolean;
  isBlock?: boolean;
  children: React.ReactNode;
}

export const EditableField: React.FC<EditableFieldProps> = ({
  fieldPath,
  fieldLabel,
  value,
  isTextarea = false,
  isBlock = false,
  children,
}) => {
  const { isAdmin, isEditMode, isPreviewMode, updateField } = useCms();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draftValue, setDraftValue] = useState(value);

  const canEdit = isAdmin && isEditMode && !isPreviewMode;

  if (!canEdit) {
    return <>{children}</>;
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDraftValue(value);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    updateField(fieldPath, draftValue);
    setIsModalOpen(false);
  };

  return (
    <>
      <div
        className={`${styles.editableWrapper} ${isBlock ? styles.blockWrapper : ''} ${styles.editMode}`}
        onClick={handleClick}
        title={`Click to edit ${fieldLabel}`}
      >
        {children}
        <span className={styles.editBadge} aria-hidden="true">
          ✎ EDIT {fieldLabel.toUpperCase()}
        </span>
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()} role="dialog">
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>EDIT {fieldLabel}</h3>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setIsModalOpen(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className={styles.modalBody}>
              <div>
                <label className={styles.label}>{fieldLabel}</label>
                {isTextarea ? (
                  <textarea
                    className={`${styles.input} ${styles.textarea}`}
                    value={draftValue}
                    onChange={(e) => setDraftValue(e.target.value)}
                    autoFocus
                  />
                ) : (
                  <input
                    type="text"
                    className={styles.input}
                    value={draftValue}
                    onChange={(e) => setDraftValue(e.target.value)}
                    autoFocus
                  />
                )}
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button type="button" className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>
                CANCEL
              </button>
              <button type="button" className={styles.saveBtn} onClick={handleSave}>
                APPLY CHANGES
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditableField;
