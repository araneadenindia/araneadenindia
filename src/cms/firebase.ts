// src/cms/firebase.ts
// Firebase initialization & Realtime Database sync layer for Aranea Den CMS
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getDatabase, Database, ref, set, get, onValue } from 'firebase/database';
import { CmsContentTree } from './types';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

export const isFirebaseConfigured = (): boolean => {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.databaseURL);
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Database | null = null;

if (isFirebaseConfigured()) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getDatabase(app);
  } catch (err) {
    console.warn('[Firebase] Initialization error:', err);
  }
}

export { auth, db };

/**
 * Subscribe to published website content in Firebase Realtime Database
 */
export function subscribeToPublishedContent(
  onData: (data: CmsContentTree | null) => void,
  onError?: (err: Error) => void
): () => void {
  if (!db) return () => {};
  const publishedRef = ref(db, 'cms/published');

  return onValue(
    publishedRef,
    (snapshot) => {
      if (snapshot.exists()) {
        onData(snapshot.val() as CmsContentTree);
      } else {
        onData(null);
      }
    },
    (err) => {
      console.warn('[Firebase] Error fetching published content:', err);
      if (onError) onError(err);
    }
  );
}

/**
 * Save draft content to Firebase Realtime Database
 */
export async function saveDraftToFirebase(draft: CmsContentTree): Promise<void> {
  if (!db) return;
  const draftRef = ref(db, 'cms/drafts/current');
  const metadataRef = ref(db, 'cms/metadata');

  await set(draftRef, draft);
  await set(metadataRef, {
    version: draft.metadata.version,
    lastSaved: new Date().toISOString(),
    status: 'draft',
  });
}

/**
 * Atomically promote draft to published content in Firebase Realtime Database
 */
export async function publishContentToFirebase(draft: CmsContentTree, author: string = 'Admin'): Promise<void> {
  if (!db) return;
  const now = new Date().toISOString();
  const timestamp = Date.now();

  const publishedContent: CmsContentTree = {
    ...draft,
    metadata: {
      ...draft.metadata,
      version: (draft.metadata.version || 1) + 1,
      lastPublished: now,
      lastSaved: now,
      publishedBy: author,
    },
  };

  // 1. Promote to cms/published
  const publishedRef = ref(db, 'cms/published');
  await set(publishedRef, publishedContent);

  // 2. Archive to cms/history/<timestamp> for rollback
  const historyRef = ref(db, `cms/history/${timestamp}`);
  await set(historyRef, {
    id: String(timestamp),
    publishedAt: now,
    publishedBy: author,
    version: publishedContent.metadata.version,
    content: publishedContent,
  });

  // 3. Update cms/metadata
  const metadataRef = ref(db, 'cms/metadata');
  await set(metadataRef, {
    version: publishedContent.metadata.version,
    lastPublished: now,
    status: 'published',
  });
}

/**
 * Fetch history list from Firebase
 */
export async function fetchHistoryFromFirebase(): Promise<any[]> {
  if (!db) return [];
  const historyRef = ref(db, 'cms/history');
  const snap = await get(historyRef);
  if (!snap.exists()) return [];
  const val = snap.val();
  return Object.values(val).sort((a: any, b: any) => (b.publishedAt || '').localeCompare(a.publishedAt || ''));
}
