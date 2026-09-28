import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import adLogo from '../../assets/AD Transparent SVG.svg';
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
        gsap.fromTo(
          topGridRef.current,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: 'power3.out',
            scrollTrigger: { trigger: footer, start: 'top 85%' },
          }
        );
      }

      // 2. Logo entrance
      if (logoRef.current) {
        gsap.fromTo(
          logoRef.current,
          { opacity: 0, scale: 0.9, y: 20 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: logoRef.current, start: 'top 92%' },
            clearProps: 'transform',
          }
        );
      }

      // 3. Smooth breathing glow on left logo
      if (glowRef.current) {
        gsap.fromTo(
          glowRef.current,
          { opacity: 0.28, scale: 0.92 },
          {
            opacity: 0.72,
            scale: 1.25,
            duration: 2.8,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
          }
        );
      }

      // 4. Bottom row reveal
      if (bottomRef.current) {
        gsap.fromTo(
          bottomRef.current,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.75,
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

        {/* ── Top Grid: Brand / Nav / Services / Connect ── */}
        <div ref={topGridRef} className={styles.topGrid}>

          {/* Left Column: Logo + Tagline */}
          <div className={styles.thesisCol}>
            <div ref={logoRef} className={styles.leftLogoWrap}>
              {/* Smooth breathing red glow behind logo */}
              <div ref={glowRef} className={styles.leftLogoGlow} aria-hidden="true" />
              <Link to="/" className={styles.footerBrandLogoLink} aria-label="Aranea Den Home">
                <img
                  src={adLogo}
                  alt="Aranea Den"
                  className={styles.footerBrandLogo}
                />
              </Link>
            </div>
            {/* Glowing red tagline */}
            <p className={styles.leftTagline}>WE WEAVE YOUR DIGITAL EXCELLENCE.</p>
          </div>

          {/* Right Columns: Nav / Services / Connect */}
          <div className={styles.navColumns}>

            {/* 1. Navigate */}
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

            {/* 2. Services */}
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

            {/* 3. Connect with Red Icons */}
            <div className={styles.navGroup}>
              <h4 className={styles.navHeading}>CONNECT</h4>
              <ul className={styles.navList}>
                <li>
                  <a
                    href="https://www.instagram.com/araneaden_?stkn=MnoxZmk2d3Zmc2sw"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.navLink}
                    aria-label="Instagram"
                  >
                    <span className={styles.socialIcon} aria-hidden="true">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                      </svg>
                    </span>
                    <span>Instagram</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.navLink}
                    aria-label="LinkedIn"
                  >
                    <span className={styles.socialIcon} aria-hidden="true">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28Z"/>
                      </svg>
                    </span>
                    <span>LinkedIn</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/suryarajamandapalli/araneaden"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.navLink}
                    aria-label="GitHub"
                  >
                    <span className={styles.socialIcon} aria-hidden="true">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                      </svg>
                    </span>
                    <span>GitHub</span>
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:contact@araneaden.com"
                    className={styles.navLink}
                    aria-label="Email Aranea Den"
                  >
                    <span className={styles.socialIcon} aria-hidden="true">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                      </svg>
                    </span>
                    <span>contact@araneaden.com</span>
                  </a>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* ── Bottom Legal Row ── */}
        <div ref={bottomRef} className={styles.bottomRow}>
          <div className={styles.legalInfo}>
            <p className={styles.copyright}>© 2026 ARANEA DEN. ALL RIGHTS RESERVED.</p>
            <div className={styles.legalLinks}>
              <Link to="/privacy" className={styles.legalLink}>PRIVACY POLICY</Link>
              <span className={styles.legalDot} aria-hidden="true">&bull;</span>
              <Link to="/terms" className={styles.legalLink}>TERMS OF SERVICE</Link>
            </div>
          </div>
          <p className={styles.tagline}>WE WEAVE YOUR DIGITAL EXCELLENCE.</p>
        </div>

      </div>
    </footer>
  );
};

export default AraneaDenFooter;
