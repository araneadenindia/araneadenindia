// src/cms/CmsContext.tsx
// Core React Context for Live Visual CMS: Admin Edit Mode, Drafts, and Publishing
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { CmsContentTree } from './types';
import { INITIAL_DEFAULT_CONTENT } from './defaultContent';
import { cmsStorage, HistoryItem } from './cmsStorage';
import { authApi } from '../admin/api';

export type CmsStatus = 'saved' | 'unsaved' | 'saving' | 'publishing' | 'published' | 'error';

interface CmsContextValue {
  isAdmin: boolean;
  isEditMode: boolean;
  isPreviewMode: boolean;
  status: CmsStatus;
  statusMessage: string;
  activeContent: CmsContentTree;
  draftContent: CmsContentTree;
  publishedContent: CmsContentTree;
  historyList: HistoryItem[];
  isPublishModalOpen: boolean;
  isHistoryModalOpen: boolean;
  setEditMode: (val: boolean) => void;
  setPreviewMode: (val: boolean) => void;
  setIsPublishModalOpen: (val: boolean) => void;
  setIsHistoryModalOpen: (val: boolean) => void;
  updateField: (path: string, value: any) => void;
  updateCollectionItem: (collectionPath: string, index: number, updatedItem: any) => void;
  addCollectionItem: (collectionPath: string, newItem: any) => void;
  duplicateCollectionItem: (collectionPath: string, index: number) => void;
  removeCollectionItem: (collectionPath: string, index: number) => void;
  saveDraft: () => Promise<void>;
  publishChanges: () => Promise<void>;
  rollbackToVersion: (historyItem: HistoryItem) => Promise<void>;
  refreshHistory: () => Promise<void>;
  logout: () => Promise<void>;
}

const CmsContext = createContext<CmsContextValue | null>(null);

// Helper to set nested object properties via dot-notation path
function setNestedValue(obj: any, path: string, value: any): any {
  const parts = path.split('.');
  const newObj = JSON.parse(JSON.stringify(obj));
  let current = newObj;

  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (!current[part]) current[part] = {};
    current = current[part];
  }

  current[parts[parts.length - 1]] = value;
  return newObj;
}

export const CmsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return sessionStorage.getItem('ad_admin_authenticated') === 'true';
  });
  const [isEditMode, setIsEditMode] = useState<boolean>(() => {
    return sessionStorage.getItem('ad_admin_authenticated') === 'true';
  });
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  const [status, setStatus] = useState<CmsStatus>('saved');
  const [statusMessage, setStatusMessage] = useState<string>('All changes saved');

  const [publishedContent, setPublishedContent] = useState<CmsContentTree>(INITIAL_DEFAULT_CONTENT);
  const [draftContent, setDraftContent] = useState<CmsContentTree>(INITIAL_DEFAULT_CONTENT);
  const [historyList, setHistoryList] = useState<HistoryItem[]>([]);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  // 1. Check session against /api/auth/me on mount
  useEffect(() => {
    let isMounted = true;
    authApi
      .me()
      .then((data) => {
        if (isMounted && data.ok) {
          setIsAdmin(true);
          sessionStorage.setItem('ad_admin_authenticated', 'true');
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsAdmin(false);
          setIsEditMode(false);
          sessionStorage.removeItem('ad_admin_authenticated');
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Load published and draft content on mount
  useEffect(() => {
    let isMounted = true;

    async function loadContent() {
      const pub = await cmsStorage.getPublishedContent();
      const draft = await cmsStorage.getDraftContent();
      if (isMounted) {
        setPublishedContent(pub);
        setDraftContent(draft);
      }
    }

    loadContent();

    // Subscribe to live published updates
    const unsubscribe = cmsStorage.subscribeToPublished((newPub) => {
      if (isMounted) {
        setPublishedContent(newPub);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // 3. Load revision history
  const refreshHistory = useCallback(async () => {
    const list = await cmsStorage.getHistory();
    setHistoryList(list);
  }, []);

  useEffect(() => {
    if (isAdmin) {
      refreshHistory();
    }
  }, [isAdmin, refreshHistory]);

  // Determine active content tree
  const activeContent = useMemo(() => {
    if (isAdmin && isEditMode) {
      return draftContent;
    }
    return publishedContent;
  }, [isAdmin, isEditMode, draftContent, publishedContent]);

  // 4. Content update mutation handlers
  const updateField = useCallback((path: string, value: any) => {
    setDraftContent((prev) => {
      const updated = setNestedValue(prev, path, value);
      return updated;
    });
    setStatus('unsaved');
    setStatusMessage('Unsaved draft changes');
  }, []);

  const updateCollectionItem = useCallback((collectionPath: string, index: number, updatedItem: any) => {
    setDraftContent((prev) => {
      const newObj = JSON.parse(JSON.stringify(prev));
      const parts = collectionPath.split('.');
      let target = newObj;
      for (const p of parts) {
        target = target[p];
      }
      if (Array.isArray(target) && target[index]) {
        target[index] = updatedItem;
      }
      return newObj;
    });
    setStatus('unsaved');
    setStatusMessage('Unsaved draft changes');
  }, []);

  const addCollectionItem = useCallback((collectionPath: string, newItem: any) => {
    setDraftContent((prev) => {
      const newObj = JSON.parse(JSON.stringify(prev));
      const parts = collectionPath.split('.');
      let target = newObj;
      for (const p of parts) {
        target = target[p];
      }
      if (Array.isArray(target)) {
        target.push(newItem);
      }
      return newObj;
    });
    setStatus('unsaved');
    setStatusMessage('New item added to draft');
  }, []);

  const duplicateCollectionItem = useCallback((collectionPath: string, index: number) => {
    setDraftContent((prev) => {
      const newObj = JSON.parse(JSON.stringify(prev));
      const parts = collectionPath.split('.');
      let target = newObj;
      for (const p of parts) {
        target = target[p];
      }
      if (Array.isArray(target) && target[index]) {
        const itemToClone = target[index];
        const cloned = {
          ...JSON.parse(JSON.stringify(itemToClone)),
          id: `${itemToClone.id || 'item'}-copy-${Date.now().toString().slice(-4)}`,
          title: itemToClone.title ? `${itemToClone.title} (Copy)` : itemToClone.name ? `${itemToClone.name} (Copy)` : undefined,
          name: itemToClone.name ? `${itemToClone.name} (Copy)` : undefined,
        };
        target.splice(index + 1, 0, cloned);
      }
      return newObj;
    });
    setStatus('unsaved');
    setStatusMessage('Item duplicated in draft');
  }, []);

  const removeCollectionItem = useCallback((collectionPath: string, index: number) => {
    setDraftContent((prev) => {
      const newObj = JSON.parse(JSON.stringify(prev));
      const parts = collectionPath.split('.');
      let target = newObj;
      for (const p of parts) {
        target = target[p];
      }
      if (Array.isArray(target)) {
        target.splice(index, 1);
      }
      return newObj;
    });
    setStatus('unsaved');
    setStatusMessage('Item removed from draft');
  }, []);

  // 5. Save Draft
  const saveDraft = useCallback(async () => {
    setStatus('saving');
    setStatusMessage('Saving draft…');
    try {
      await cmsStorage.saveDraft(draftContent);
      setStatus('saved');
      setStatusMessage('Draft saved successfully');
    } catch (err) {
      setStatus('error');
      setStatusMessage('Failed to save draft');
    }
  }, [draftContent]);

  // 6. Push Changes (Publish)
  const publishChanges = useCallback(async () => {
    setStatus('publishing');
    setStatusMessage('Publishing changes live…');
    try {
      const published = await cmsStorage.publish(draftContent, 'Studio Admin');
      setPublishedContent(published);
      setDraftContent(published);
      setStatus('published');
      setStatusMessage(`Live website updated (v${published.metadata.version})`);
      await refreshHistory();
    } catch (err) {
      setStatus('error');
      setStatusMessage('Failed to publish changes');
    }
  }, [draftContent, refreshHistory]);

  // 7. Rollback
  const rollbackToVersion = useCallback(async (historyItem: HistoryItem) => {
    setStatus('publishing');
    setStatusMessage(`Restoring v${historyItem.version}…`);
    try {
      const restored = await cmsStorage.rollback(historyItem);
      setPublishedContent(restored);
      setDraftContent(restored);
      setStatus('published');
      setStatusMessage(`Restored to version ${historyItem.version}`);
      await refreshHistory();
    } catch (err) {
      setStatus('error');
      setStatusMessage('Rollback failed');
    }
  }, [refreshHistory]);

  // 8. Logout
  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {}
    setIsAdmin(false);
    setIsEditMode(false);
    setIsPreviewMode(false);
    sessionStorage.removeItem('ad_admin_authenticated');
  }, []);

  const value: CmsContextValue = {
    isAdmin,
    isEditMode,
    isPreviewMode,
    status,
    statusMessage,
    activeContent,
    draftContent,
    publishedContent,
    historyList,
    isPublishModalOpen,
    isHistoryModalOpen,
    setEditMode: setIsEditMode,
    setPreviewMode: setIsPreviewMode,
    setIsPublishModalOpen,
    setIsHistoryModalOpen,
    updateField,
    updateCollectionItem,
    addCollectionItem,
    duplicateCollectionItem,
    removeCollectionItem,
    saveDraft,
    publishChanges,
    rollbackToVersion,
    refreshHistory,
    logout,
  };

  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>;
};

export const useCms = (): CmsContextValue => {
  const ctx = useContext(CmsContext);
  if (!ctx) {
    throw new Error('useCms must be used within a CmsProvider');
  }
  return ctx;
};
