// src/cms/components/EditableCollection/EditableCollection.tsx
// Repeatable collection manager providing + ADD, ⧉ Duplicate, and 🗑 Delete actions in Admin Edit Mode
import React from 'react';
import { useCms } from '../../CmsContext';
import styles from './EditableCollection.module.css';

interface EditableCollectionProps<T> {
  collectionPath: string;
  itemTypeLabel: string;
  items: T[];
  createDefaultItem: () => T;
  renderItem: (item: T, index: number) => React.ReactNode;
  containerClassName?: string;
  onEditItem?: (item: T, index: number) => void;
}

export function EditableCollection<T extends { id?: string | number; title?: string; name?: string }>({
  collectionPath,
  itemTypeLabel,
  items,
  createDefaultItem,
  renderItem,
  containerClassName = '',
  onEditItem,
}: EditableCollectionProps<T>): React.ReactElement {
  const { isAdmin, isEditMode, isPreviewMode, addCollectionItem, duplicateCollectionItem, removeCollectionItem } =
    useCms();

  const canEdit = isAdmin && isEditMode && !isPreviewMode;

  if (!canEdit) {
    return (
      <div className={containerClassName}>
        {items.map((item, index) => (
          <React.Fragment key={item.id || index}>
            {renderItem(item, index)}
          </React.Fragment>
        ))}
      </div>
    );
  }

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newItem = createDefaultItem();
    addCollectionItem(collectionPath, newItem);
  };

  const handleDuplicate = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    duplicateCollectionItem(collectionPath, index);
  };

  const handleDelete = (e: React.MouseEvent, index: number, item: T) => {
    e.preventDefault();
    e.stopPropagation();
    const label = item.title || item.name || `${itemTypeLabel} #${index + 1}`;
    const confirmed = window.confirm(`Are you sure you want to remove "${label}" from this section?`);
    if (confirmed) {
      removeCollectionItem(collectionPath, index);
    }
  };

  return (
    <div className={styles.collectionWrapper}>
      <div className={containerClassName}>
        {items.map((item, index) => (
          <div key={item.id || index} className={styles.itemWrapper}>
            {renderItem(item, index)}

            {canEdit && (
              <div className={styles.itemActionBar} aria-label={`${itemTypeLabel} actions`}>
                {onEditItem && (
                  <button
                    type="button"
                    className={styles.actionBtn}
                    onClick={() => onEditItem(item, index)}
                    title={`Edit ${itemTypeLabel}`}
                  >
                    ✎ EDIT
                  </button>
                )}
                <button
                  type="button"
                  className={styles.actionBtn}
                  onClick={(e) => handleDuplicate(e, index)}
                  title={`Duplicate ${itemTypeLabel}`}
                >
                  ⧉ DUPLICATE
                </button>
                <button
                  type="button"
                  className={`${styles.actionBtn} ${styles.deleteBtn}`}
                  onClick={(e) => handleDelete(e, index, item)}
                  title={`Delete ${itemTypeLabel}`}
                >
                  🗑 REMOVE
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {canEdit && (
        <div className={styles.addBar}>
          <button type="button" className={styles.addBtn} onClick={handleAdd}>
            <span className={styles.plusIcon}>+</span>
            <span>ADD {itemTypeLabel.toUpperCase()}</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default EditableCollection;
