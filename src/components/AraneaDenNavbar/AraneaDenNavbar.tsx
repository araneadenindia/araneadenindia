import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './AraneaDenNavbar.module.css';
import { MobileMenu } from './MobileMenu';
import { NavLink, AraneaDenNavbarProps } from './types';

gsap.registerPlugin(ScrollTrigger);

const NAV_LINKS: NavLink[] = [
  { label: 'ABOUT', path: '/about', href: '/about' },
  { label: 'SERVICES', path: '/services', href: '/services' },
  { label: 'TEAM', path: '/team', href: '/team' },
  { label: 'PORTFOLIO', path: '/portfolio', href: '/portfolio' },
  { label: 'CONTACT', path: '/contact', href: '/contact' },
];

const FULL_MENU_LINKS: NavLink[] = [
  { label: 'HOME', path: '/', href: '/' },
  { label: 'ABOUT', path: '/about', href: '/about' },
  { label: 'SERVICES', path: '/services', href: '/services' },
  { label: 'TEAM', path: '/team', href: '/team' },
  { label: 'PORTFOLIO', path: '/portfolio', href: '/portfolio' },
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

  // Monitor scroll position relative to the hero & our passion pinned boundary
  useEffect(() => {
    if (!isHome) {
      setIsInHero(false);
      return;
    }

    const checkHeroBounds = () => {
      const st = ScrollTrigger.getById('hero-passion-flow');
      const heroThreshold = st ? st.end - 80 : (window.innerHeight * 1.5);
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

  // Scroll listener for subtle elevation/compact state
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
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
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.1 }
      );
    }, navbar);

    return () => ctx.revert();
  }, []);

  // Adaptive background and padding on scroll or route change
  useEffect(() => {
    const navbar = navbarRef.current;
    if (!navbar) return;
    const isMobile = window.innerWidth <= 768;

    if (isDarkTheme) {
      // While in Hero Video flow: Keep navbar COMPLETELY TRANSPARENT with zero dark rectangle or blur box
      gsap.to(navbar, {
        paddingTop: isScrolled ? (isMobile ? 14 : 20) : (isMobile ? 22 : 34),
        paddingBottom: isScrolled ? (isMobile ? 12 : 16) : (isMobile ? 16 : 22),
        backgroundColor: 'transparent',
        backdropFilter: 'none',
        borderBottomColor: 'transparent',
        duration: 0.35,
        ease: 'power2.out',
      });
    } else {
      gsap.to(navbar, {
        paddingTop: isScrolled ? (isMobile ? 12 : 14) : (isMobile ? 16 : 24),
        paddingBottom: isScrolled ? (isMobile ? 12 : 14) : (isMobile ? 14 : 20),
        backgroundColor: isScrolled ? 'rgba(248, 248, 245, 0.92)' : 'rgba(248, 248, 245, 0)',
        backdropFilter: isScrolled ? 'blur(16px)' : 'blur(0px)',
        borderBottomColor: isScrolled ? 'rgba(11, 11, 12, 0.08)' : 'transparent',
        duration: 0.35,
        ease: 'power2.out',
      });
    }
  }, [isScrolled, isDarkTheme]);

  // Hamburger lines morph to 'X' on mobile menu open
  useEffect(() => {
    const [l1, l2, l3] = hamburgerLinesRef.current;
    if (!l1 || !l2 || !l3) return;

    if (mobileMenuOpen) {
      gsap.to(l1, { rotation: 45, y: 5.5, duration: 0.28, ease: 'power2.out', transformOrigin: 'center' });
      gsap.to(l2, { opacity: 0, scaleX: 0, duration: 0.18, ease: 'power2.in' });
      gsap.to(l3, { rotation: -45, y: -5.5, duration: 0.28, ease: 'power2.out', transformOrigin: 'center' });
    } else {
      gsap.to(l1, { rotation: 0, y: 0, duration: 0.28, ease: 'power2.out' });
      gsap.to(l2, { opacity: 1, scaleX: 1, duration: 0.24, ease: 'power2.out' });
      gsap.to(l3, { rotation: 0, y: 0, duration: 0.28, ease: 'power2.out' });
    }
  }, [mobileMenuOpen]);

  // Close menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const handleMenuToggle = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  const handleMenuClose = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  const isLinkActive = (path: string) => {
    return currentPath === path || (path !== '/' && currentPath.startsWith(path + '/'));
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
          {/* ARANEA DEN Brand Logo on the Left */}
          <Link to="/" className={styles.brand} aria-label="Aranea Den — Home">
            <img
              src="/AD Transparent SVG.svg"
              alt="Aranea Den Logo"
              className={styles.brandLogo}
              draggable={false}
            />
          </Link>

          {/* Desktop Navigation Links on the Right */}
          <nav className={styles.desktopNav} aria-label="Primary navigation">
            {NAV_LINKS.map(link => {
              const active = isLinkActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`${styles.navLink}${active ? ` ${styles.activeLink}` : ''}`}
                  aria-current={active ? 'page' : undefined}
                >
                  {link.label}
                  {active && <span className={styles.activeDot} aria-hidden="true" />}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Hamburger: ONLY 3 clean lines, NO circle, NO bubble */}
          <button
            className={styles.hamburgerBtn}
            onClick={handleMenuToggle}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav"
          >
            <span className={styles.hamburgerLines} aria-hidden="true">
              <span
                ref={el => { hamburgerLinesRef.current[0] = el; }}
                className={styles.line}
              />
              <span
                ref={el => { hamburgerLinesRef.current[1] = el; }}
                className={styles.line}
              />
              <span
                ref={el => { hamburgerLinesRef.current[2] = el; }}
                className={styles.line}
              />
            </span>
          </button>
        </div>
      </header>

      {/* Full-screen Blurred Menu Drawer for Mobile */}
      <div id="mobile-nav">
        <MobileMenu
          isOpen={mobileMenuOpen}
          onClose={handleMenuClose}
          navLinks={FULL_MENU_LINKS}
          currentPath={currentPath}
        />
      </div>
    </>
  );
};

export default AraneaDenNavbar;
