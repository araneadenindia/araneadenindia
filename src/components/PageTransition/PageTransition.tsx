import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './PageTransition.module.css';

interface PageTransitionProps {
  children: React.ReactNode;
}

/**
 * PageTransition — Cinematic Route Preloader & Transition
 * Shows a full-screen branded preloader with ARANEA DEN logo and progress beam
 * on EVERY page navigation across the website.
 */
export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();
  const overlayRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const getRouteLabel = (path: string) => {
    if (path === '/') return 'HOME';
    if (path.startsWith('/services')) return 'SERVICES';
    if (path.startsWith('/about')) return 'ABOUT';
    if (path.startsWith('/team')) return 'TEAM';
    if (path.startsWith('/portfolio')) return 'PORTFOLIO';
    if (path.startsWith('/contact')) return 'CONTACT';
    return 'ARANEA DEN';
  };

  useEffect(() => {
    // Skip initial mount if handled by AraneaDenIntro
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const overlay = overlayRef.current;
    const logo = logoRef.current;
    const progressFill = progressFillRef.current;
    const content = contentRef.current;
    if (!overlay) return;

    setIsTransitioning(true);

    // Reset scroll position immediately while hidden behind the preloader
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          setIsTransitioning(false);
          ScrollTrigger.sort();
          ScrollTrigger.refresh();
        },
      });

      // 1. Overlay displays immediately
      tl.set(overlay, { display: 'flex', opacity: 1 });
      if (progressFill) tl.set(progressFill, { width: '0%' });
      if (logo) tl.set(logo, { opacity: 0, scale: 0.94 });
      if (content) tl.set(content, { opacity: 0 });

      // 2. Logo entrance & crimson beam sweeps across
      if (logo) {
        tl.to(logo, {
          opacity: 1,
          scale: 1,
          duration: 0.25,
          ease: 'power2.out',
        }, 0.04);
      }

      if (progressFill) {
        tl.to(progressFill, {
          width: '100%',
          duration: 0.42,
          ease: 'power3.inOut',
        }, 0.08);
      }

      // 3. Brief visual hold (100ms)
      // 4. Preloader dissolves cleanly
      tl.to(overlay, {
        opacity: 0,
        duration: 0.35,
        ease: 'power2.inOut',
      }, '+=0.10');

      // 5. Content glides in seamlessly
      if (content) {
        tl.to(content, {
          opacity: 1,
          duration: 0.35,
          ease: 'power2.out',
        }, '-=0.25');
      }

      tl.set(overlay, { display: 'none' });
    });

    return () => ctx.revert();
  }, [location.pathname]);

  return (
    <>
      {/* Route-Change Branded Preloader */}
      <div
        ref={overlayRef}
        className={styles.preloaderOverlay}
        style={{ display: 'none', opacity: 0 }}
        aria-hidden={!isTransitioning}
        aria-label="Loading page"
      >
        <div ref={logoRef} className={styles.preloaderStage}>
          <div className={styles.logoWrap}>
            <div className={styles.logoGlow} aria-hidden="true" />
            <img
              src="/AD Transparent SVG.svg"
              alt="Aranea Den"
              className={styles.brandLogo}
              draggable={false}
            />
          </div>

          <div className={styles.trackBeam} aria-hidden="true">
            <div ref={progressFillRef} className={styles.beamFill} />
          </div>

          <div className={styles.preloaderMeta}>
            <span className={styles.metaDot} aria-hidden="true" />
            <span className={styles.metaText}>{getRouteLabel(location.pathname)}</span>
          </div>
        </div>
      </div>

      {/* Dynamic Route Content */}
      <div ref={contentRef} className={styles.pageContent}>
        {children}
      </div>
    </>
  );
};

export default PageTransition;
