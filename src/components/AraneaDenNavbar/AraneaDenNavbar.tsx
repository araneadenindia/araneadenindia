import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './AraneaDenNavbar.module.css';
import { MobileMenu } from './MobileMenu';
import { NavLink, AraneaDenNavbarProps } from './types';

gsap.registerPlugin(ScrollTrigger);

// Core Navigation Links per user specification:
// Logo on the left; SERVICES, PORTFOLIO, CONTACT on the right.
const NAV_LINKS: NavLink[] = [
  { label: 'SERVICES', path: '/services', href: '/services' },
  { label: 'PORTFOLIO', path: '/portfolio', href: '/portfolio' },
  { label: 'CONTACT', path: '/contact', href: '/contact' },
];

const FULL_MENU_LINKS: NavLink[] = [
  { label: 'HOME', path: '/', href: '/' },
  { label: 'SERVICES', path: '/services', href: '/services' },
  { label: 'PORTFOLIO', path: '/portfolio', href: '/portfolio' },
  { label: 'CONTACT', path: '/contact', href: '/contact' },
];

export const AraneaDenNavbar: React.FC<AraneaDenNavbarProps> = ({ isVisible: _isVisible = true }) => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [isInHero, setIsInHero] = useState<boolean>(true);

  const navbarRef = useRef<HTMLElement>(null);
  const hamburgerLinesRef = useRef<(HTMLSpanElement | null)[]>([]);

  const location = useLocation();
  const currentPath = location.pathname;
  const isHome = currentPath === '/';

  // Monitor scroll position relative to the hero boundary on home page
  useEffect(() => {
    if (!isHome) {
      setIsInHero(false);
      return;
    }

    const checkHeroBounds = () => {
      const st = ScrollTrigger.getById('hero-passion-flow');
      const heroThreshold = st ? st.end - 80 : (window.innerHeight * 1.2);
      setIsInHero(window.scrollY < heroThreshold);
    };

    window.addEventListener('scroll', checkHeroBounds, { passive: true });
    window.addEventListener('resize', checkHeroBounds, { passive: true });
    checkHeroBounds();
    return () => {
      window.removeEventListener('scroll', checkHeroBounds);
      window.removeEventListener('resize', checkHeroBounds);
    };
  }, [isHome]);

  const isDarkTheme = isHome && isInHero;

  // Scroll listener for compact elevation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Entrance animation on mount
  useEffect(() => {
    const navbar = navbarRef.current;
    if (!navbar) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        navbar,
        { opacity: 0, y: -8 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', delay: 0.08 }
      );
    }, navbar);

    return () => ctx.revert();
  }, []);

  // Hamburger lines morph to 'X' on mobile menu open
  useEffect(() => {
    const [l1, l2] = hamburgerLinesRef.current;
    if (!l1 || !l2) return;

    if (mobileMenuOpen) {
      gsap.to(l1, { rotation: 45, y: 4, duration: 0.25, ease: 'power2.out', transformOrigin: 'center' });
      gsap.to(l2, { rotation: -45, y: -4, duration: 0.25, ease: 'power2.out', transformOrigin: 'center' });
    } else {
      gsap.to(l1, { rotation: 0, y: 0, duration: 0.25, ease: 'power2.out' });
      gsap.to(l2, { rotation: 0, y: 0, duration: 0.25, ease: 'power2.out' });
    }
  }, [mobileMenuOpen]);

  // Close menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isLinkActive = (path: string): boolean => {
    if (path === '/') return currentPath === '/';
    return currentPath === path || currentPath.startsWith(`${path}/`);
  };

  return (
    <>
      <header
        ref={navbarRef}
        className={`${styles.navbar} ${isDarkTheme ? styles.darkTheme : styles.lightTheme}${
          isScrolled ? ` ${styles.scrolled}` : ''
        }`}
        role="banner"
      >
        <div className={styles.inner}>
          {/* Official ARANEA DEN Logo on the left */}
          <Link to="/" className={styles.brand} aria-label="Aranea Den — Home">
            <img
              src="/AD Transparent SVG.svg"
              alt="Aranea Den"
              className={styles.brandLogo}
              draggable={false}
            />
          </Link>

          {/* Desktop Navigation on the right: SERVICES, PORTFOLIO, CONTACT */}
          <nav className={styles.desktopNav} aria-label="Primary navigation">
            {NAV_LINKS.map((link) => {
              const active = isLinkActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`${styles.navLink}${active ? ` ${styles.activeLink}` : ''}`}
                  aria-current={active ? 'page' : undefined}
                >
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Mobile Minimal Hamburger Button */}
          <button
            className={styles.hamburgerBtn}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav"
          >
            <span className={styles.hamburgerLines} aria-hidden="true">
              <span
                ref={(el) => { hamburgerLinesRef.current[0] = el; }}
                className={styles.line}
              />
              <span
                ref={(el) => { hamburgerLinesRef.current[1] = el; }}
                className={styles.line}
              />
            </span>
          </button>
        </div>
      </header>

      {/* Clean Mobile Navigation Drawer */}
      <div id="mobile-nav">
        <MobileMenu
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          navLinks={FULL_MENU_LINKS}
          currentPath={currentPath}
        />
      </div>
    </>
  );
};

export default AraneaDenNavbar;
