// src/cms/components/EditableField/EditableField.tsx
// Pure pass-through component ensuring zero visual CMS footprint on public website
import React from 'react';

interface EditableFieldProps {
  fieldPath?: string;
  fieldLabel?: string;
  value?: string;
  isTextarea?: boolean;
  isBlock?: boolean;
  children: React.ReactNode;
}

export const EditableField: React.FC<EditableFieldProps> = ({ children }) => {
  return <>{children}</>;
};
