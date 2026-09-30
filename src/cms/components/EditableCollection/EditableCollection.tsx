// src/cms/components/EditableCollection/EditableCollection.tsx
// Pure collection renderer for public website
import React from 'react';

interface EditableCollectionProps<T> {
  collectionPath?: string;
  itemTypeLabel?: string;
  items: T[];
  createDefaultItem?: () => T;
  renderItem: (item: T, index: number) => React.ReactNode;
  containerClassName?: string;
  onEditItem?: (item: T, index: number) => void;
}

export function EditableCollection<T extends { id?: string | number }>({
  items,
  renderItem,
  containerClassName = '',
}: EditableCollectionProps<T>): React.ReactElement {
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
