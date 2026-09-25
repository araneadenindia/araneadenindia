import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './AraneaDenFooter.module.css';

gsap.registerPlugin(ScrollTrigger);

export const AraneaDenFooter: React.FC = () => {
  const footerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const topGridRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const ctx = gsap.context(() => {
      // 1. Top grid reveal
      if (topGridRef.current) {
        gsap.fromTo(topGridRef.current,
          { opacity: 0, y: 32 },
          {
            opacity: 1, y: 0, duration: 1.0,
            ease: 'power3.out',
            scrollTrigger: { trigger: footer, start: 'top 85%' },
          }
        );
      }

      // 2. Logo entrance
      if (logoRef.current) {
        gsap.fromTo(logoRef.current,
          { opacity: 0, scale: 0.88, y: 30 },
          {
            opacity: 1, scale: 1, y: 0, duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: { trigger: logoRef.current, start: 'top 90%' },
            clearProps: 'transform',
          }
        );
      }

      // 3. Continuous glow breathing animation on logo
      if (glowRef.current) {
        gsap.fromTo(glowRef.current,
          { opacity: 0.25, scale: 0.9 },
          {
            opacity: 0.65,
            scale: 1.25,
            duration: 2.8,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
          }
        );
      }

      // 4. Bottom row
      if (bottomRef.current) {
        gsap.fromTo(bottomRef.current,
          { opacity: 0 },
          {
            opacity: 1, duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: { trigger: bottomRef.current, start: 'top 98%' },
          }
        );
      }
    }, footer);

    return () => ctx.revert();
  }, []);


  return (
    <footer ref={footerRef} className={styles.footer} role="contentinfo" aria-label="Aranea Den Footer">
      <div className={styles.container}>

        {/* ── Top Grid: Nav / Services / Connect ── */}
        <div ref={topGridRef} className={styles.topGrid}>
          {/* Thesis */}
          <div className={styles.thesisCol}>
            <p className={styles.thesisText}>
              Aranea Den connects strategy, design, and technology to build cohesive digital experiences.
            </p>
            <div className={styles.ctaWrap}>
              <Link to="/contact" className={styles.footerCta} aria-label="Start a project">
                <span>START A PROJECT</span>
                <span className={styles.ctaArrow} aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          {/* Nav columns */}
          <div className={styles.navColumns}>
            <div className={styles.navGroup}>
              <h4 className={styles.navHeading}>NAVIGATE</h4>
              <ul className={styles.navList}>
                <li><Link to="/" className={styles.navLink}>Home</Link></li>
                <li><Link to="/about" className={styles.navLink}>About</Link></li>
                <li><Link to="/services" className={styles.navLink}>Services</Link></li>
                <li><Link to="/team" className={styles.navLink}>Team</Link></li>
                <li><Link to="/portfolio" className={styles.navLink}>Portfolio</Link></li>
                <li><Link to="/contact" className={styles.navLink}>Contact</Link></li>
              </ul>
            </div>

            <div className={styles.navGroup}>
              <h4 className={styles.navHeading}>SERVICES</h4>
              <ul className={styles.navList}>
                <li><Link to="/services/web-development" className={styles.navLink}>Web Development</Link></li>
                <li><Link to="/services/ui-ux-design" className={styles.navLink}>UI / UX Design</Link></li>
                <li><Link to="/services/mobile-development" className={styles.navLink}>Mobile Applications</Link></li>
                <li><Link to="/services/video-production" className={styles.navLink}>Video Production</Link></li>
                <li><Link to="/services/cloud-solutions" className={styles.navLink}>Cloud Solutions</Link></li>
              </ul>
            </div>

            <div className={styles.navGroup}>
              <h4 className={styles.navHeading}>CONNECT</h4>
              <ul className={styles.navList}>
                <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={styles.navLink}>LinkedIn</a></li>
                <li><a href="https://x.com" target="_blank" rel="noopener noreferrer" className={styles.navLink}>X (Twitter)</a></li>
                <li><a href="mailto:contact@araneaden.com" className={styles.navLink}>contact@araneaden.com</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* ── Centered Logo Brand Signature ── */}
        <div className={styles.logoSection}>
          <div ref={logoRef} className={styles.logoWrap}>
            {/* Glow behind logo */}
            <div ref={glowRef} className={styles.logoGlow} aria-hidden="true" />
            <img
              src="/AD Transparent SVG.svg"
              alt="Aranea Den"
              className={styles.footerLogo}
              draggable={false}
            />
          </div>
        </div>

        {/* ── Bottom Legal Row ── */}
        <div ref={bottomRef} className={styles.bottomRow}>
          <p className={styles.copyright}>© 2026 ARANEA DEN. ALL RIGHTS RESERVED.</p>
          <p className={styles.tagline}>WOVEN WITH INTENT.</p>
        </div>

      </div>
    </footer>
  );
};
