import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { MobileMenuProps } from './types';
import styles from './MobileMenu.module.css';

/**
 * MobileMenu — Full-Screen Navigation Drawer with Heavy Background Blur
 * Usable on both mobile and desktop collapsed navbar state.
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
                    <span>{link.label}</span>
                    <span className={styles.navItemArrow} aria-hidden="true">→</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Primary CTA — CONTACT */}
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
        </div>
      </div>
    </div>
  );
};
