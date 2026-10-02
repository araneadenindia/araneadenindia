// src/admin/AdminApp.tsx
// The complete admin CMS app — rendered strictly at /admin/* routes
import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Navigate, NavLink, useNavigate } from 'react-router-dom';
import { authApi } from './api';
import { AdminLogin } from './pages/AdminLogin';
import { AdminChangePassword } from './pages/AdminChangePassword';
import { AdminDashboard } from './pages/AdminDashboard';
import { WebsitesCMS } from './pages/WebsitesCMS';
import { AppsCMS } from './pages/AppsCMS';
import { ReelsCMS } from './pages/ReelsCMS';
import { ServicesCMS } from './pages/ServicesCMS';
import { ClientsCMS } from './pages/ClientsCMS';
import { AnnouncementsCMS } from './pages/AnnouncementsCMS';
import styles from './AdminApp.module.css';

interface AdminUser {
  username: string;
  mustChangePassword: boolean;
}

// Inline SVG icons for the sidebar
const DashboardIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="9" /><rect x="14" y="3" width="7" height="5" />
    <rect x="14" y="12" width="7" height="9" /><rect x="3" y="16" width="7" height="5" />
  </svg>
);
const WebIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" />
  </svg>
);
const AppIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="3" ry="3" />
    <line x1="12" y1="18" x2="12.01" y2="18" />
  </svg>
);
const ReelIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 10 5 5-5 5" /><rect x="2" y="5" width="14" height="14" rx="2" />
  </svg>
);
const ServiceIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" /><path d="M7 7h.01" />
  </svg>
);
const ClientIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);
const AnnounceIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
  </svg>
);

export const AdminApp: React.FC = () => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const checkSession = useCallback(async () => {
    try {
      const data = await authApi.me();
      setUser({ username: data.username, mustChangePassword: data.mustChangePassword });
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { checkSession(); }, [checkSession]);

  const handleLogin = (userData: AdminUser) => {
    setUser(userData);
    localStorage.setItem('ad_admin_authenticated', 'true');
    sessionStorage.setItem('ad_admin_authenticated', 'true');
    if (userData.mustChangePassword) {
      navigate('/admin/change-password');
    } else {
      navigate('/admin/dashboard');
    }
  };

  const handlePasswordChanged = () => {
    setUser((prev) => (prev ? { ...prev, mustChangePassword: false } : null));
    navigate('/admin/dashboard');
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {}
    localStorage.removeItem('ad_admin_authenticated');
    sessionStorage.removeItem('ad_admin_authenticated');
    setUser(null);
    navigate('/admin/dashboard');
  };

  if (loading) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.loadingSpinner} />
      </div>
    );
  }

  // When not logged in: display the AdminLogin form on /admin/dashboard or /admin/login
  if (!user) {
    return (
      <Routes>
        <Route path="dashboard" element={<AdminLogin onLogin={handleLogin} />} />
        <Route path="login" element={<AdminLogin onLogin={handleLogin} />} />
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    );
  }

  if (user.mustChangePassword) {
    return (
      <Routes>
        <Route path="change-password" element={<AdminChangePassword onChanged={handlePasswordChanged} />} />
        <Route path="*" element={<Navigate to="/admin/change-password" replace />} />
      </Routes>
    );
  }

  return (
    <div className={styles.layout}>
      {/* ── Studio Sidebar ── */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarBrand}>
          <img src="/AD Logo PNG.png" alt="Aranea Den" className={styles.brandLogo} />
          <div>
            <div className={styles.brandTitle}>ARANEA DEN</div>
            <span className={styles.brandLabel}>STUDIO CMS</span>
          </div>
          <button className={styles.mobileLogoutBtn} onClick={handleLogout} title="Log out">
            Log out →
          </button>
        </div>

        <nav className={styles.sidebarNav}>
          <NavLink to="/admin/dashboard" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}>
            <DashboardIcon /> Dashboard
          </NavLink>
          <NavLink to="/admin/websites" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}>
            <WebIcon /> Websites
          </NavLink>
          <NavLink to="/admin/apps" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}>
            <AppIcon /> Apps
          </NavLink>
          <NavLink to="/admin/reels" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}>
            <ReelIcon /> Reels
          </NavLink>
          <NavLink to="/admin/services" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}>
            <ServiceIcon /> Services
          </NavLink>
          <NavLink to="/admin/clients" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}>
            <ClientIcon /> Clients
          </NavLink>
          <NavLink to="/admin/announcements" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}>
            <AnnounceIcon /> Announcements
          </NavLink>
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.adminBadge}>
            <span className={styles.adminPulse} />
            <span className={styles.adminName}>{user.username}</span>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout}>Log out →</button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className={styles.main}>
        <Routes>
          <Route path="dashboard" element={<AdminDashboard username={user.username} />} />
          <Route path="websites" element={<WebsitesCMS />} />
          <Route path="apps" element={<AppsCMS />} />
          <Route path="reels" element={<ReelsCMS />} />
          <Route path="services" element={<ServicesCMS />} />
          <Route path="clients" element={<ClientsCMS />} />
          <Route path="announcements" element={<AnnouncementsCMS />} />
          <Route path="change-password" element={<AdminChangePassword onChanged={handlePasswordChanged} />} />
          <Route path="login" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminApp;
