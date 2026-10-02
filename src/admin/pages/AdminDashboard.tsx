// src/admin/pages/AdminDashboard.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  websitesApi,
  appsApi,
  reelsApi,
  servicesApi,
  clientsApi,
  announcementsApi,
} from '../api';
import styles from './AdminDashboard.module.css';

interface AdminDashboardProps {
  username?: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ username = 'Admin' }) => {
  const [counts, setCounts] = useState({
    websites: 0,
    apps: 0,
    reels: 0,
    services: 0,
    clients: 0,
    announcements: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadStats() {
      try {
        const [w, a, r, s, c, ann] = await Promise.allSettled([
          websitesApi.list(),
          appsApi.list(),
          reelsApi.list(),
          servicesApi.list(),
          clientsApi.list(),
          announcementsApi.list(),
        ]);

        if (mounted) {
          setCounts({
            websites: w.status === 'fulfilled' && w.value.data ? w.value.data.length : 0,
            apps: a.status === 'fulfilled' && a.value.data ? a.value.data.length : 0,
            reels: r.status === 'fulfilled' && r.value.data ? r.value.data.length : 0,
            services: s.status === 'fulfilled' && s.value.data ? s.value.data.length : 0,
            clients: c.status === 'fulfilled' && c.value.data ? c.value.data.length : 0,
            announcements: ann.status === 'fulfilled' && ann.value.data ? ann.value.data.length : 0,
          });
        }
      } catch {
        // Fallback default
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadStats();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className={styles.dashboard}>
      {/* ── Studio Header ── */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.badge}>
            <span className={styles.pulsingDot} />
            <span>STUDIO CMS ENVIRONMENT</span>
          </div>
          <h1 className={styles.title}>CMS STUDIO DASHBOARD</h1>
          <p className={styles.subtitle}>
            Welcome back, <strong>{username}</strong>. Secure control center for Aranea Den studio content, portfolio, and digital operations.
          </p>
        </div>

        <div className={styles.headerActions}>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.websiteBtn}
            title="Open the clean public website in a new tab"
          >
            <span>🌐 View Live Website</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>

          <Link to="/admin/change-password" className={styles.secondaryBtn}>
            <span>Change Password</span>
          </Link>
        </div>
      </header>

      {/* ── Quick Stats Grid ── */}
      <div className={styles.statsGrid}>
        <Link to="/admin/websites" className={styles.statCard}>
          <div className={styles.statTop}>
            <span className={styles.statLabel}>Websites</span>
            <div className={styles.statIconWrap}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" />
              </svg>
            </div>
          </div>
          <div className={styles.statValue}>{loading ? '—' : counts.websites}</div>
          <span style={{ fontSize: '11px', color: '#DF2531', fontWeight: 600 }}>Manage projects →</span>
        </Link>

        <Link to="/admin/apps" className={styles.statCard}>
          <div className={styles.statTop}>
            <span className={styles.statLabel}>Mobile Apps</span>
            <div className={styles.statIconWrap}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="5" y="2" width="14" height="20" rx="3" ry="3" />
                <line x1="12" y1="18" x2="12.01" y2="18" />
              </svg>
            </div>
          </div>
          <div className={styles.statValue}>{loading ? '—' : counts.apps}</div>
          <span style={{ fontSize: '11px', color: '#DF2531', fontWeight: 600 }}>Manage apps →</span>
        </Link>

        <Link to="/admin/reels" className={styles.statCard}>
          <div className={styles.statTop}>
            <span className={styles.statLabel}>Reels & Video</span>
            <div className={styles.statIconWrap}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m15 10 5 5-5 5" /><rect x="2" y="5" width="14" height="14" rx="2" />
              </svg>
            </div>
          </div>
          <div className={styles.statValue}>{loading ? '—' : counts.reels}</div>
          <span style={{ fontSize: '11px', color: '#DF2531', fontWeight: 600 }}>Manage reels →</span>
        </Link>

        <Link to="/admin/services" className={styles.statCard}>
          <div className={styles.statTop}>
            <span className={styles.statLabel}>Services</span>
            <div className={styles.statIconWrap}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
              </svg>
            </div>
          </div>
          <div className={styles.statValue}>{loading ? '—' : counts.services}</div>
          <span style={{ fontSize: '11px', color: '#DF2531', fontWeight: 600 }}>Manage services →</span>
        </Link>

        <Link to="/admin/clients" className={styles.statCard}>
          <div className={styles.statTop}>
            <span className={styles.statLabel}>Clients</span>
            <div className={styles.statIconWrap}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </div>
          </div>
          <div className={styles.statValue}>{loading ? '—' : counts.clients}</div>
          <span style={{ fontSize: '11px', color: '#DF2531', fontWeight: 600 }}>Manage clients →</span>
        </Link>

        <Link to="/admin/announcements" className={styles.statCard}>
          <div className={styles.statTop}>
            <span className={styles.statLabel}>Announcements</span>
            <div className={styles.statIconWrap}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
              </svg>
            </div>
          </div>
          <div className={styles.statValue}>{loading ? '—' : counts.announcements}</div>
          <span style={{ fontSize: '11px', color: '#DF2531', fontWeight: 600 }}>Manage announcements →</span>
        </Link>
      </div>

      {/* ── Studio Management Modules ── */}
      <h2 className={styles.sectionTitle}>Studio Content Modules</h2>
      <div className={styles.modulesGrid}>
        <div className={styles.moduleCard}>
          <div>
            <div className={styles.moduleHeader}>
              <div className={styles.moduleIcon}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" />
                </svg>
              </div>
              <div>
                <h3 className={styles.moduleTitle}>Websites Portfolio</h3>
                <p className={styles.moduleDesc}>
                  Manage desktop & web showcase projects, client links, thumbnails, and published status.
                </p>
              </div>
            </div>
          </div>
          <div className={styles.moduleFooter}>
            <span className={styles.moduleCount}>{counts.websites} Items</span>
            <Link to="/admin/websites" className={styles.moduleAction}>
              Configure Websites →
            </Link>
          </div>
        </div>

        <div className={styles.moduleCard}>
          <div>
            <div className={styles.moduleHeader}>
              <div className={styles.moduleIcon}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="5" y="2" width="14" height="20" rx="3" ry="3" />
                  <line x1="12" y1="18" x2="12.01" y2="18" />
                </svg>
              </div>
              <div>
                <h3 className={styles.moduleTitle}>Mobile Applications</h3>
                <p className={styles.moduleDesc}>
                  Curate iOS, Android, and cross-platform native applications, tags, categories, and URLs.
                </p>
              </div>
            </div>
          </div>
          <div className={styles.moduleFooter}>
            <span className={styles.moduleCount}>{counts.apps} Items</span>
            <Link to="/admin/apps" className={styles.moduleAction}>
              Configure Apps →
            </Link>
          </div>
        </div>

        <div className={styles.moduleCard}>
          <div>
            <div className={styles.moduleHeader}>
              <div className={styles.moduleIcon}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m15 10 5 5-5 5" /><rect x="2" y="5" width="14" height="14" rx="2" />
                </svg>
              </div>
              <div>
                <h3 className={styles.moduleTitle}>Reels & Video Media</h3>
                <p className={styles.moduleDesc}>
                  Upload and organize high-resolution video production showcases, reels, and video posters.
                </p>
              </div>
            </div>
          </div>
          <div className={styles.moduleFooter}>
            <span className={styles.moduleCount}>{counts.reels} Items</span>
            <Link to="/admin/reels" className={styles.moduleAction}>
              Configure Reels →
            </Link>
          </div>
        </div>

        <div className={styles.moduleCard}>
          <div>
            <div className={styles.moduleHeader}>
              <div className={styles.moduleIcon}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
                </svg>
              </div>
              <div>
                <h3 className={styles.moduleTitle}>Services Architecture</h3>
                <p className={styles.moduleDesc}>
                  Update capability chapters, digital engineering disciplines, descriptions, and iconography.
                </p>
              </div>
            </div>
          </div>
          <div className={styles.moduleFooter}>
            <span className={styles.moduleCount}>{counts.services} Items</span>
            <Link to="/admin/services" className={styles.moduleAction}>
              Configure Services →
            </Link>
          </div>
        </div>

        <div className={styles.moduleCard}>
          <div>
            <div className={styles.moduleHeader}>
              <div className={styles.moduleIcon}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
              </div>
              <div>
                <h3 className={styles.moduleTitle}>Clientele Archive</h3>
                <p className={styles.moduleDesc}>
                  Manage high-profile client logos, company website links, and industry collaborations.
                </p>
              </div>
            </div>
          </div>
          <div className={styles.moduleFooter}>
            <span className={styles.moduleCount}>{counts.clients} Items</span>
            <Link to="/admin/clients" className={styles.moduleAction}>
              Configure Clients →
            </Link>
          </div>
        </div>

        <div className={styles.moduleCard}>
          <div>
            <div className={styles.moduleHeader}>
              <div className={styles.moduleIcon}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
                </svg>
              </div>
              <div>
                <h3 className={styles.moduleTitle}>Announcements & Events</h3>
                <p className={styles.moduleDesc}>
                  Publish studio headlines, hackathons, registration call-to-actions, and flyers.
                </p>
              </div>
            </div>
          </div>
          <div className={styles.moduleFooter}>
            <span className={styles.moduleCount}>{counts.announcements} Items</span>
            <Link to="/admin/announcements" className={styles.moduleAction}>
              Configure Announcements →
            </Link>
          </div>
        </div>
      </div>

      {/* ── System Status Card ── */}
      <div className={styles.systemCard}>
        <div className={styles.systemInfo}>
          <div className={styles.systemIcon}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div>
            <h4 className={styles.systemTitle}>ARANEA DEN CMS ENGINE</h4>
            <p className={styles.systemSubtitle}>Dedicated Administration Environment — Isolated from Public Experience</p>
          </div>
        </div>

        <div className={styles.systemBadges}>
          <div className={styles.systemBadge}>
            <span className={styles.greenDot} />
            <span>CMS API Active</span>
          </div>
          <div className={styles.systemBadge}>
            <span>Portal Route: /admin/dashboard</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
