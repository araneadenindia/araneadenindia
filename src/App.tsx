import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { PreloaderProvider, usePreloader } from './context/PreloaderContext';
import { SmoothScrollProvider, useSmoothScroll } from './context/SmoothScrollContext';
import { UniversalPreloader } from './components/UniversalPreloader';
import { AraneaDenNavbar } from './components/AraneaDenNavbar';
import { AraneaDenFooter } from './components/AraneaDenFooter';
import { BackToTop } from './components/BackToTop';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { CurtainOpener } from './components/CurtainOpener';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { LaunchPage } from './pages/LaunchPage';
import { ServicesPage } from './pages/ServicesPage';
import { TeamPage } from './pages/TeamPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { AdminApp } from './admin/AdminApp';

import './styles/globals.css';

/**
 * AppContent Component
 * Connected to PreloaderContext and SmoothScroll for unified 3D preloader orchestration and fluid scrolling
 */
const AppContent: React.FC = () => {
  const { isActive, mode, finishPreloader, isInitialIntroComplete } = usePreloader();
  const { lenis } = useSmoothScroll();
  const location = useLocation();

  const isLaunchPage = location.pathname === '/launch';
  const isAdminPage = location.pathname.startsWith('/admin');
  const isFromCurtainLaunch =
    (location.state as any)?.fromCurtainLaunch ||
    sessionStorage.getItem('aranea_curtain_launch') === 'true';

  // If arriving from the /launch curtain transition, bypass standard preloader to reveal via physical curtains
  useEffect(() => {
    if (isFromCurtainLaunch && location.pathname === '/') {
      finishPreloader();
      sessionStorage.removeItem('aranea_curtain_launch');
    }
  }, [isFromCurtainLaunch, location.pathname, finishPreloader]);

  // Halt smooth scroll when preloader is actively screening or on admin routes; resume & recalibrate upon dismissal
  useEffect(() => {
    if (!lenis) return;
    if (isAdminPage || (isActive && !isFromCurtainLaunch)) {
      lenis.stop();
    } else {
      lenis.start();
      lenis.resize();
      ScrollTrigger.refresh();
    }
  }, [isActive, isFromCurtainLaunch, lenis, isAdminPage]);

  // On route change: reset scroll to top and clear any lingering orphaned pin-spacers or nodes
  useEffect(() => {
    const main = document.querySelector('main');
    if (main) {
      const orphans = main.querySelectorAll(':scope > #collective-network, :scope > .pin-spacer');
      orphans.forEach((el) => el.remove());
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }
  }, [location.pathname, lenis]);

  if (isAdminPage) {
    return (
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
      </Routes>
    );
  }

  return (
    <div
      style={{
        minHeight: '100dvh',
        backgroundColor: 'var(--color-black, #0B0B0C)',
        color: 'var(--color-text-primary, #0B0B0C)',
        position: 'relative',
      }}
    >
      {/* Cinematic Curtain Opener when arriving from /launch */}
      {isFromCurtainLaunch && location.pathname === '/' && <CurtainOpener />}

      {/* The Single Universal Cinematic 3D Preloader (Bypassed on standalone /launch or curtain transition) */}
      {!isLaunchPage && !isFromCurtainLaunch && (
        <UniversalPreloader
          isActive={isActive}
          mode={mode}
          onComplete={finishPreloader}
        />
      )}

      {/* Global Editorial Navigation (Hidden on standalone /launch portal) */}
      {!isLaunchPage && <AraneaDenNavbar isVisible={isInitialIntroComplete || isFromCurtainLaunch} />}

      {/* Multi-Page Dynamic Route Engine */}
      <main
        style={{
          minHeight: '100dvh',
          position: 'relative',
          backgroundColor: isLaunchPage ? '#0B0B0E' : 'var(--color-bg-primary, #F7F7F4)',
        }}
      >
        <Routes>
          {/* Primary Experience Routes */}
          <Route path="/" element={<HomePage isVisible={isInitialIntroComplete} />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/launch" element={<LaunchPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/web-development" element={<ServicesPage />} />
          <Route path="/services/mobile-development" element={<ServicesPage />} />
          <Route path="/services/ui-ux-design" element={<ServicesPage />} />
          <Route path="/services/digital-marketing" element={<ServicesPage />} />
          <Route path="/services/video-production" element={<ServicesPage />} />
          <Route path="/services/graphic-design" element={<ServicesPage />} />
          <Route path="/services/seo" element={<ServicesPage />} />
          <Route path="/services/cloud-solutions" element={<ServicesPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/admin/*" element={<AdminApp />} />

          {/* Legacy & Fallback Redirects */}
          <Route path="/work" element={<Navigate to="/portfolio" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Global Editorial Footer (Hidden on standalone /launch portal) */}
      {!isLaunchPage && <AraneaDenFooter />}

      {/* Floating Back To Top Indicator (Hidden on standalone /launch portal) */}
      {!isLaunchPage && <BackToTop />}
    </div>
  );
};

/**
 * Root Application Component
 * Multi-Page Creative Technology Architecture for Aranea Den
 */
export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <PreloaderProvider>
        <SmoothScrollProvider>
          <AppContent />
        </SmoothScrollProvider>
      </PreloaderProvider>
    </BrowserRouter>
  );
};

export default App;
