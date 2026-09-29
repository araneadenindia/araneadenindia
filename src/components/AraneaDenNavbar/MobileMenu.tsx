import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { MobileMenuProps } from './types';
import styles from './MobileMenu.module.css';

/**
 * MobileMenu — Full-Screen Navigation Drawer with Heavy Background Blur
 * Usable on mobile and tablet viewport states.
 */
export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  navLinks,
  currentPath,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<HTMLLIElement[]>([]);
  const ctaRef = useRef<HTMLDivElement>(null);
  const firstFocusRef = useRef<HTMLAnchorElement | null>(null);
  const prevActiveRef = useRef<Element | null>(null);

  const setItemRef = (el: HTMLLIElement | null, index: number) => {
    if (el) itemRefs.current[index] = el;
  };

  // ── OPEN animation ──────────────────────────────────────────────
  useEffect(() => {
    const overlay = overlayRef.current;
    const inner = innerRef.current;
    const items = itemRefs.current;
    const cta = ctaRef.current;

    if (!overlay || !inner || !cta) return;

    if (isOpen) {
      prevActiveRef.current = document.activeElement;
      overlay.style.visibility = 'visible';

      const ctx = gsap.context(() => {
        const tl = gsap.timeline();

        // 1. Fade in overlay with backdrop blur
        tl.to(overlay, {
          opacity: 1,
          duration: 0.40,
          ease: 'power2.out',
        }, 0);

        // 2. Slide in inner container
        tl.fromTo(inner,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.45, ease: 'cubic-bezier(0.16, 1, 0.3, 1)' },
          0.04
        );

        // 3. Stagger nav items upward
        tl.to(items, {
          opacity: 1,
          y: 0,
          duration: 0.45,
          ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
          stagger: 0.055,
        }, 0.10);

        // 4. CTA slides in
        tl.to(cta, {
          opacity: 1,
          y: 0,
          duration: 0.40,
          ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
        }, 0.35);

        tl.call(() => {
          firstFocusRef.current?.focus();
        });
      }, overlay);

      return () => ctx.revert();
    } else {
      // ── CLOSE animation ──────────────────────────────────────
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          onComplete: () => {
            if (overlay) {
              overlay.style.visibility = 'hidden';
            }
            if (prevActiveRef.current instanceof HTMLElement) {
              prevActiveRef.current.focus();
            }
          }
        });

        tl.to(items, {
          opacity: 0,
          y: -10,
          duration: 0.20,
          ease: 'power2.in',
          stagger: 0.03,
        }, 0);

        tl.to(cta, {
          opacity: 0,
          y: -8,
          duration: 0.18,
          ease: 'power2.in',
        }, 0.05);

        tl.to(overlay, {
          opacity: 0,
          duration: 0.30,
          ease: 'power2.inOut',
        }, 0.10);
      }, overlay);

      return () => ctx.revert();
    }
  }, [isOpen]);

  // ── Keyboard accessibility (Escape + Focus Trap) ─────────────────
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // ── Body scroll lock ────────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <div
      ref={overlayRef}
      className={`${styles.overlay}${isOpen ? ` ${styles.open}` : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
    >
      <div ref={innerRef} className={styles.inner}>
        {/* Top Header inside overlay */}
        <div className={styles.menuTopBar}>
          <img src="/AD Transparent SVG.svg" alt="Aranea Den" className={styles.menuLogo} />
          <button
            onClick={onClose}
            className={styles.closeBtn}
            aria-label="Close navigation menu"
          >
            <span className={styles.closeIcon}>✕</span>
          </button>
        </div>

        <div className={styles.hairline} aria-hidden="true" />

        {/* Nav list */}
        <nav aria-label="Full-screen navigation">
          <ul className={styles.navList} role="list">
            {navLinks.map((link, index) => {
              const isActive = currentPath === link.path ||
                (link.path !== '/' && currentPath.startsWith(link.path));

              return (
                <li
                  key={link.path}
                  ref={(el) => setItemRef(el, index)}
                  className={styles.navItem}
                >
                  <Link
                    to={link.path}
                    className={`${styles.navItemLink}${isActive ? ` ${styles.active}` : ''}`}
                    onClick={onClose}
                    aria-current={isActive ? 'page' : undefined}
                    ref={index === 0 ? firstFocusRef : undefined}
                  >
                    <span className={styles.linkLabelWrapper}>
                      <span>{link.label}</span>
                      {isActive && (
                        <span className={styles.activeDot} aria-hidden="true" />
                      )}
                    </span>
                    <span className={styles.navItemArrow} aria-hidden="true">→</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Primary CTA — CONTACT & Social Icons */}
        <div ref={ctaRef} className={styles.ctaSection}>
          <Link
            to="/contact"
            className={styles.mobileCta}
            onClick={onClose}
            aria-label="Contact Aranea Den"
          >
            <span className={styles.mobileCtaLabel}>CONTACT US</span>
            <span className={styles.mobileCtaArrow} aria-hidden="true">→</span>
          </Link>

          {/* Red Social Icons */}
          <div className={styles.mobileSocialRow} aria-label="Social Profiles">
            <a
              href="https://www.instagram.com/araneaden_?stkn=MnoxZmk2d3Zmc2sw"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mobileSocialBtn}
              aria-label="Instagram"
              title="Instagram"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>

            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mobileSocialBtn}
              aria-label="LinkedIn"
              title="LinkedIn"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28Z" />
              </svg>
            </a>

            <a
              href="https://github.com/suryarajamandapalli/araneaden"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mobileSocialBtn}
              aria-label="GitHub"
              title="GitHub"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
