// src/admin/AdminApp.tsx
// The complete admin CMS app — rendered at /admin/* routes
import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { authApi } from './api';
import { AdminLogin } from './pages/AdminLogin';
import { AdminChangePassword } from './pages/AdminChangePassword';
import styles from './AdminApp.module.css';

interface AdminUser {
  username: string;
  mustChangePassword: boolean;
}

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
    localStorage.setItem('ad_admin_edit_mode', 'true');
    sessionStorage.setItem('ad_admin_authenticated', 'true');
    if (userData.mustChangePassword) {
      navigate('/admin/change-password');
    } else {
      // PHASE 03: Open the actual website in Admin Edit Mode
      window.location.href = '/';
    }
  };

  const handlePasswordChanged = () => {
    setUser((prev) => (prev ? { ...prev, mustChangePassword: false } : null));
    localStorage.setItem('ad_admin_authenticated', 'true');
    localStorage.setItem('ad_admin_edit_mode', 'true');
    sessionStorage.setItem('ad_admin_authenticated', 'true');
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.loadingSpinner} />
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="login" element={<AdminLogin onLogin={handleLogin} />} />
        <Route path="*" element={<Navigate to="/admin/login" replace />} />
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

  // Authenticated admin accessing /admin route is redirected into live site in edit mode
  return <Navigate to="/" replace />;
};

export default AdminApp;
