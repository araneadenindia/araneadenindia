import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PreloaderProvider, usePreloader } from './context/PreloaderContext';
import { SmoothScrollProvider, useSmoothScroll } from './context/SmoothScrollContext';
import { UniversalPreloader } from './components/UniversalPreloader';
import { AraneaDenNavbar } from './components/AraneaDenNavbar';
import { AraneaDenFooter } from './components/AraneaDenFooter';
import { BackToTop } from './components/BackToTop';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { TeamPage } from './pages/TeamPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { ContactPage } from './pages/ContactPage';

import './styles/globals.css';

/**
 * AppContent Component
 * Connected to PreloaderContext and SmoothScroll for unified 3D preloader orchestration and fluid scrolling
 */
const AppContent: React.FC = () => {
  const { isActive, mode, finishPreloader, isInitialIntroComplete } = usePreloader();
  const { lenis } = useSmoothScroll();

  // Halt smooth scroll when preloader is actively screening; resume & recalibrate upon dismissal
  useEffect(() => {
    if (!lenis) return;
    if (isActive) {
      lenis.stop();
    } else {
      lenis.start();
      lenis.resize();
      ScrollTrigger.refresh();
    }
  }, [isActive, lenis]);

  return (
    <div
      style={{
        minHeight: '100dvh',
        backgroundColor: 'var(--color-bg-primary, #F8F8F5)',
        color: 'var(--color-text-primary, #0B0B0C)',
        position: 'relative',
      }}
    >
      {/* The Single Universal Cinematic 3D Preloader */}
      <UniversalPreloader
        isActive={isActive}
        mode={mode}
        onComplete={finishPreloader}
      />

      {/* Global Editorial Navigation */}
      <AraneaDenNavbar isVisible={isInitialIntroComplete} />

      {/* Multi-Page Dynamic Route Engine */}
      <main
        style={{
          minHeight: '100dvh',
          position: 'relative',
        }}
      >
        <Routes>
          {/* Primary Experience Routes */}
          <Route path="/" element={<HomePage isVisible={isInitialIntroComplete} />} />
          <Route path="/about" element={<AboutPage />} />
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

          {/* Legacy & Fallback Redirects */}
          <Route path="/work" element={<Navigate to="/portfolio" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Global Editorial Footer with Scroll Scrub Wordmark */}
      <AraneaDenFooter />

      {/* Floating Back To Top Indicator */}
      <BackToTop />
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
