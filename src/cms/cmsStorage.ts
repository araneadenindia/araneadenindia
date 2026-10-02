// src/cms/cmsStorage.ts
// Unified storage manager supporting Firebase Realtime Database with local resilient fallback
import { CmsContentTree } from './types';
import { INITIAL_DEFAULT_CONTENT } from './defaultContent';
import {
  isFirebaseConfigured,
  subscribeToPublishedContent,
  saveDraftToFirebase,
  publishContentToFirebase,
  fetchHistoryFromFirebase,
} from './firebase';

const LOCAL_DRAFT_KEY = 'aranea_cms_draft_v1';
const LOCAL_PUBLISHED_KEY = 'aranea_cms_published_v1';
const LOCAL_HISTORY_KEY = 'aranea_cms_history_v1';

export interface HistoryItem {
  id: string;
  publishedAt: string;
  publishedBy: string;
  version: number;
  content: CmsContentTree;
}

function sanitizeContent(content: CmsContentTree): CmsContentTree {
  if (!content) return content;

  // Sanitize hero video
  if (content.home?.hero?.media) {
    const heroMedia = content.home.hero.media;
    if (
      !heroMedia?.url ||
      heroMedia.url === '/16.9 Ratio Vid FINAL.mp4' ||
      heroMedia.url === '/Final Render 16.9.mp4' ||
      heroMedia.url === '/Final Render 9.16.mp4' ||
      heroMedia.url === '/9.16 Ratio Vid Final.mp4'
    ) {
      content.home.hero.media = {
        type: 'video',
        url: '/hero-16-9.mp4',
        posterUrl: '/hero-poster-desktop.jpg',
        alt: heroMedia?.alt || 'Aranea Den Studio Showreel',
      };
    }
  }

  // Sanitize announcements items
  if (!content.home?.announcements?.items || content.home.announcements.items.length < 5) {
    if (!content.home) content.home = {} as any;
    if (!content.home.announcements) content.home.announcements = {} as any;
    content.home.announcements.items = JSON.parse(JSON.stringify(INITIAL_DEFAULT_CONTENT.home.announcements.items));
  }
  if (content.home?.whatWeDo) {
    if (!content.home.whatWeDo.eyebrow || content.home.whatWeDo.eyebrow === 'DISCIPLINES // 04') {
      content.home.whatWeDo.eyebrow = 'SERVICES';
    }
  }
  if (content.home?.whatWeDo?.items) {
    const serviceImgMap: Record<string, string> = {
      '/services/08-digital-marketing.jpg': '/services/03-digital-marketing.jpg',
      '/services/05-reels-production.jpg': '/services/11-ad-imperial-visuals.jpg',
      '/services/video-production.jpg': '/services/09-video-editing.jpg',
      '/services/live-broadcasting.jpg': '/services/ad-live-streaming.jpg',
      '/services/04-iot-prototyping.jpg': '/services/12-iot-prototyping.jpg',
    };
    content.home.whatWeDo.items.forEach((item: any) => {
      if (item.imageSrc && serviceImgMap[item.imageSrc]) {
        item.imageSrc = serviceImgMap[item.imageSrc];
      }
    });
  }

  // Sanitize experiences case study images
  if (content.home?.experiences?.items) {
    content.home.experiences.items.forEach((item: any) => {
      if (item.imageSrc === '/portfolio-thumbs/jk-restaurant.jpg') {
        item.imageSrc = '/portfolio-thumbs/cornercraft.jpg';
      }
    });
  }

  // Sanitize team member images
  if (content.team?.members) {
    content.team.members.forEach((m: any) => {
      if (!m.image) {
        m.image = m.media?.url || (m.id ? `/team/${m.id}.jpeg` : '/team/saikiran-chapa.jpeg');
      }
      if (!m.media) {
        m.media = {
          type: 'image',
          url: m.image,
          alt: m.name,
        };
      }
    });
  }

  return content;
}

export const cmsStorage = {
  /**
   * Load initial published content (from Firebase or local storage/default)
   */
  async getPublishedContent(): Promise<CmsContentTree> {
    if (typeof window === 'undefined') return INITIAL_DEFAULT_CONTENT;

    // Check local storage published copy
    try {
      const stored = localStorage.getItem(LOCAL_PUBLISHED_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return sanitizeContent(parsed);
      }
    } catch (e) {
      console.warn('[CMS] Failed to read published content from local storage:', e);
    }

    return INITIAL_DEFAULT_CONTENT;
  },

  /**
   * Load current draft content (for Admin Edit Mode)
   */
  async getDraftContent(): Promise<CmsContentTree> {
    if (typeof window === 'undefined') return INITIAL_DEFAULT_CONTENT;

    try {
      const stored = localStorage.getItem(LOCAL_DRAFT_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return sanitizeContent(parsed);
      }
    } catch (e) {
      console.warn('[CMS] Failed to read draft content from local storage:', e);
    }

    // Default to published content if no draft exists
    return await this.getPublishedContent();
  },

  /**
   * Save draft content
   */
  async saveDraft(draft: CmsContentTree): Promise<void> {
    const updatedDraft: CmsContentTree = {
      ...draft,
      metadata: {
        ...draft.metadata,
        lastSaved: new Date().toISOString(),
      },
    };

    try {
      localStorage.setItem(LOCAL_DRAFT_KEY, JSON.stringify(updatedDraft));
    } catch (e) {
      console.warn('[CMS] Local draft storage warning:', e);
    }

    if (isFirebaseConfigured()) {
      await saveDraftToFirebase(updatedDraft);
    }
  },

  /**
   * Atomically publish draft changes to live website
   */
  async publish(draft: CmsContentTree, author: string = 'Admin'): Promise<CmsContentTree> {
    const now = new Date().toISOString();
    const newVersion = (draft.metadata.version || 1) + 1;

    const publishedContent: CmsContentTree = {
      ...draft,
      metadata: {
        ...draft.metadata,
        version: newVersion,
        lastPublished: now,
        lastSaved: now,
        publishedBy: author,
      },
    };

    // 1. Save locally
    try {
      localStorage.setItem(LOCAL_PUBLISHED_KEY, JSON.stringify(publishedContent));
      localStorage.setItem(LOCAL_DRAFT_KEY, JSON.stringify(publishedContent));

      // Append to local history
      const existingHistory: HistoryItem[] = JSON.parse(localStorage.getItem(LOCAL_HISTORY_KEY) || '[]');
      existingHistory.unshift({
        id: String(Date.now()),
        publishedAt: now,
        publishedBy: author,
        version: newVersion,
        content: publishedContent,
      });
      // Keep up to 20 history snapshots
      localStorage.setItem(LOCAL_HISTORY_KEY, JSON.stringify(existingHistory.slice(0, 20)));
    } catch (e) {
      console.warn('[CMS] Local publish storage warning:', e);
    }

    // 2. Publish to Firebase Realtime Database if configured
    if (isFirebaseConfigured()) {
      await publishContentToFirebase(draft, author);
    }

    return publishedContent;
  },

  /**
   * Fetch revision history for rollback
   */
  async getHistory(): Promise<HistoryItem[]> {
    if (isFirebaseConfigured()) {
      try {
        const firebaseHistory = await fetchHistoryFromFirebase();
        if (firebaseHistory.length > 0) return firebaseHistory;
      } catch (err) {
        console.warn('[CMS] Error fetching history from Firebase, falling back to local:', err);
      }
    }

    try {
      const stored = localStorage.getItem(LOCAL_HISTORY_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {}

    return [];
  },

  /**
   * Rollback content to a past published version
   */
  async rollback(historyItem: HistoryItem): Promise<CmsContentTree> {
    const restoredContent: CmsContentTree = {
      ...historyItem.content,
      metadata: {
        ...historyItem.content.metadata,
        lastSaved: new Date().toISOString(),
        lastPublished: new Date().toISOString(),
        publishedBy: `Rollback to v${historyItem.version}`,
      },
    };

    await this.publish(restoredContent, `Rollback to v${historyItem.version}`);
    return restoredContent;
  },

  /**
   * Subscribe to live updates
   */
  subscribeToPublished(onUpdate: (content: CmsContentTree) => void): () => void {
    if (isFirebaseConfigured()) {
      return subscribeToPublishedContent((data) => {
        if (data) onUpdate(data);
      });
    }

    // Window storage event listener for cross-tab sync
    const handleStorage = (e: StorageEvent) => {
      if (e.key === LOCAL_PUBLISHED_KEY && e.newValue) {
        try {
          onUpdate(JSON.parse(e.newValue));
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  },
};
