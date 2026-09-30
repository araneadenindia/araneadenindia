// src/cms/components/AdminToolbar/AdminToolbar.tsx
import React, { useEffect } from 'react';

export const AdminToolbar: React.FC = () => {
  useEffect(() => {
    document.documentElement.style.setProperty('--cms-admin-offset', '0px');
    document.body.classList.remove('has-cms-admin-toolbar');
  }, []);

  return null;
};
