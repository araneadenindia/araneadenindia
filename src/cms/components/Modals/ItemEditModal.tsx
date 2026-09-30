// src/cms/components/Modals/ItemEditModal.tsx
import React, { useState } from 'react';
import styles from './ItemEditModal.module.css';

export interface FieldConfig {
  key: string;
  label: string;
  type?: 'text' | 'textarea' | 'media';
  placeholder?: string;
}

interface ItemEditModalProps {
  isOpen: boolean;
  title: string;
  initialData: Record<string, any>;
  fields: FieldConfig[];
  onSave: (data: Record<string, any>) => void;
  onClose: () => void;
}

export const ItemEditModal: React.FC<ItemEditModalProps> = ({
  isOpen,
  title,
  initialData,
  fields,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({ ...initialData });

  React.useEffect(() => {
    if (isOpen) {
      setFormData({ ...initialData });
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} role="dialog">
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.body}>
            {fields.map((f) => (
              <div key={f.key} className={styles.field}>
                <label className={styles.label}>{f.label}</label>
                {f.type === 'textarea' ? (
                  <textarea
                    value={formData[f.key] || ''}
                    onChange={(e) => handleChange(f.key, e.target.value)}
                    placeholder={f.placeholder}
                    className={`${styles.input} ${styles.textarea}`}
                  />
                ) : (
                  <input
                    type="text"
                    value={formData[f.key] || ''}
                    onChange={(e) => handleChange(f.key, e.target.value)}
                    placeholder={f.placeholder}
                    className={styles.input}
                  />
                )}
              </div>
            ))}
          </div>

          <div className={styles.footer}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              CANCEL
            </button>
            <button type="submit" className={styles.saveBtn}>
              APPLY CHANGES →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
