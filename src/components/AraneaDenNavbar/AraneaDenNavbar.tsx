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
  { label: 'PORTFOLIO', path: '/portfolio', href: '/portfolio' },
  { label: 'CONTACT', path: '/contact', href: '/contact' },
];

const FULL_MENU_LINKS: NavLink[] = [
  { label: 'HOME', path: '/', href: '/' },
  { label: 'ABOUT', path: '/about', href: '/about' },
  { label: 'SERVICES', path: '/services', href: '/services' },
  { label: 'PORTFOLIO', path: '/portfolio', href: '/portfolio' },
  { label: 'CONTACT', path: '/contact', href: '/contact' },
];

interface SpiderIconProps {
  className?: string;
  isWalking?: boolean;
}

const SpiderIcon: React.FC<SpiderIconProps> = ({ className, isWalking = false }) => (
  <svg
    viewBox="0 0 24 24"
    className={`${className || ''} ${isWalking ? styles.spiderWalking : ''}`}
    fill="currentColor"
    aria-hidden="true"
  >
    {/* Minimalist abdomen (hanging from top) */}
    <ellipse cx="12" cy="8" rx="2.8" ry="3.5" />

    {/* Minimalist head (pointing downwards) */}
    <circle cx="12" cy="13.5" r="1.9" />

    {/* Symmetrical, minimal angled legs - Set 1 (alternating gait) */}
    <g
      className={isWalking ? styles.legSet1 : undefined}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.35"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M 10.5 13.5 L 7.5 16.5 L 6.5 19.5" />
      <path d="M 9.8 8.5 L 5.5 8 L 4 10.5" />
      <path d="M 14 11 L 18 12.5 L 19.5 15" />
      <path d="M 13.8 6.5 L 17 4.5 L 18.5 6" />
    </g>

    {/* Symmetrical, minimal angled legs - Set 2 (opposite phase) */}
    <g
      className={isWalking ? styles.legSet2 : undefined}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.35"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M 13.5 13.5 L 16.5 16.5 L 17.5 19.5" />
      <path d="M 14.2 8.5 L 18.5 8 L 20 10.5" />
      <path d="M 10 11 L 6 12.5 L 4.5 15" />
      <path d="M 10.2 6.5 L 7 4.5 L 5.5 6" />
    </g>
  </svg>
);

export const AraneaDenNavbar: React.FC<AraneaDenNavbarProps> = ({ isVisible: _isVisible = true }) => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [isInHero, setIsInHero] = useState<boolean>(true);
  const [isWalking, setIsWalking] = useState<boolean>(false);
  const [hasWalkingSpider, setHasWalkingSpider] = useState<boolean>(false);

  const navbarRef = useRef<HTMLElement>(null);
  const hamburgerLinesRef = useRef<(HTMLSpanElement | null)[]>([]);
  const desktopNavRef = useRef<HTMLElement>(null);
  const navLinksRef = useRef<{ [key: string]: HTMLElement | null }>({});
  const walkingSpiderRef = useRef<HTMLDivElement>(null);
  const spiderBodyRef = useRef<HTMLDivElement>(null);
  const dropSilkRef = useRef<HTMLDivElement>(null);
  const silkTrailRef = useRef<HTMLDivElement>(null);

  const location = useLocation();
  const currentPath = location.pathname;
  const prevPathRef = useRef<string>(currentPath);

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
      // In Hero Video flow: Navbar sits comfortably inside the framed black card
      gsap.to(navbar, {
        paddingTop: isScrolled ? (isMobile ? 12 : 16) : (isMobile ? 22 : 34),
        paddingBottom: isScrolled ? (isMobile ? 10 : 12) : (isMobile ? 14 : 18),
        backgroundColor: 'transparent',
        backdropFilter: 'none',
        borderBottomColor: 'transparent',
        duration: 0.35,
        ease: 'power2.out',
      });
    } else {
      // On light/white sections (e.g. Services, About, Portfolio, etc.):
      gsap.to(navbar, {
        paddingTop: isScrolled ? (isMobile ? 12 : 14) : (isMobile ? 14 : 18),
        paddingBottom: isScrolled ? (isMobile ? 10 : 12) : (isMobile ? 12 : 14),
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

  const triggerSpiderWalk = useCallback((targetPath: string) => {
    const desktopNav = desktopNavRef.current;
    if (!desktopNav || window.innerWidth <= 768) return;

    const targetEl = navLinksRef.current[targetPath];
    if (!targetEl) return;

    const prevPath = prevPathRef.current;
    prevPathRef.current = targetPath;
    const fromEl = navLinksRef.current[prevPath] || navLinksRef.current['/'] || targetEl;

    const navRect = desktopNav.getBoundingClientRect();
    const fromRect = fromEl.getBoundingClientRect();
    const toRect = targetEl.getBoundingClientRect();

    const startX = (fromRect.left + fromRect.width / 2) - navRect.left;
    const endX = (toRect.left + toRect.width / 2) - navRect.left;

    const container = walkingSpiderRef.current;
    const body = spiderBodyRef.current;
    const dropSilk = dropSilkRef.current;
    const trail = silkTrailRef.current;
    if (!container || !body || !dropSilk) return;

    gsap.killTweensOf([container, body, dropSilk, trail]);

    const currentComputedX = gsap.getProperty(container, 'x') as number;
    const isAlreadyActive = container.style.display === 'flex' && typeof currentComputedX === 'number' && !isNaN(currentComputedX);
    const effectiveStartX = isAlreadyActive ? currentComputedX : startX;

    const effDist = endX - effectiveStartX;
    const isMovingRight = effDist >= 0;

    setHasWalkingSpider(true);

    if (Math.abs(effDist) < 6) {
      container.style.display = 'flex';
      gsap.set(container, { xPercent: -50, x: endX, opacity: 1 });
      gsap.set(body, { rotation: 0, y: 0 });
      gsap.set(dropSilk, { scaleY: 0 });
      setIsWalking(false);

      gsap.to(dropSilk, { scaleY: 1, duration: 0.32, ease: 'power2.out' });
      gsap.to(body, {
        y: 18,
        duration: 0.35,
        ease: 'back.out(1.8)',
        onComplete: () => {
          gsap.to(body, { y: 0, delay: 2.0, duration: 0.35, ease: 'power2.in' });
          gsap.to(dropSilk, { scaleY: 0, delay: 2.0, duration: 0.35, ease: 'power2.in' });
          gsap.to(container, {
            opacity: 0,
            delay: 2.3,
            duration: 0.25,
            onComplete: () => {
              if (container) container.style.display = 'none';
              setHasWalkingSpider(false);
            },
          });
        },
      });
      return;
    }

    const walkDuration = Math.min(Math.max(Math.abs(effDist) / 420, 0.42), 0.85);

    container.style.display = 'flex';
    gsap.set(container, { xPercent: -50, x: effectiveStartX, opacity: 1 });
    gsap.set(body, { rotation: isMovingRight ? 90 : -90, y: 0 });
    gsap.set(dropSilk, { scaleY: 0 });

    if (trail) {
      gsap.set(trail, {
        left: Math.min(effectiveStartX, endX),
        width: 0,
        opacity: 0.6,
      });
    }

    setIsWalking(true);

    gsap.to(container, {
      x: endX,
      duration: walkDuration,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (trail) {
          const curX = gsap.getProperty(container, 'x') as number;
          const minX = Math.min(effectiveStartX, curX);
          const w = Math.abs(curX - effectiveStartX);
          trail.style.left = `${minX}px`;
          trail.style.width = `${w}px`;
        }
      },
      onComplete: () => {
        setIsWalking(false);

        gsap.to(body, {
          rotation: 0,
          duration: 0.2,
          ease: 'power2.out',
          onComplete: () => {
            gsap.to(dropSilk, {
              scaleY: 1,
              duration: 0.32,
              ease: 'power2.out',
            });
            gsap.to(body, {
              y: 18,
              duration: 0.35,
              ease: 'back.out(1.8)',
              onComplete: () => {
                gsap.to(body, {
                  y: 0,
                  delay: 2.0,
                  duration: 0.35,
                  ease: 'power2.in',
                });
                gsap.to(dropSilk, {
                  scaleY: 0,
                  delay: 2.0,
                  duration: 0.35,
                  ease: 'power2.in',
                });
                if (trail) {
                  gsap.to(trail, {
                    opacity: 0,
                    delay: 1.0,
                    duration: 0.5,
                  });
                }
                gsap.to(container, {
                  opacity: 0,
                  delay: 2.3,
                  duration: 0.25,
                  onComplete: () => {
                    if (container) container.style.display = 'none';
                    setHasWalkingSpider(false);
                  },
                });
              },
            });
          },
        });
      },
    });
  }, []);

  // Trigger walk whenever location changes
  useEffect(() => {
    if (prevPathRef.current !== currentPath) {
      triggerSpiderWalk(currentPath);
    }
  }, [currentPath, triggerSpiderWalk]);

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
          <nav
            ref={desktopNavRef}
            className={`${styles.desktopNav}${hasWalkingSpider ? ` ${styles.hasWalkingSpider}` : ''}`}
            aria-label="Primary navigation"
          >
            {/* Red Static Home Icon Link */}
            <Link
              to="/"
              ref={el => { navLinksRef.current['/'] = el; }}
              onClick={() => triggerSpiderWalk('/')}
              className={`${styles.navHomeLink}${isHome ? ` ${styles.activeLink}` : ''}`}
              aria-label="Home"
              title="Home"
            >
              <span className={styles.homeIconWrapper}>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className={styles.staticHomeIcon}
                  aria-hidden="true"
                >
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                </svg>
              </span>
              <div className={styles.hangingSpiderWrapper} aria-hidden="true">
                <span className={styles.silkThread} />
                <SpiderIcon className={styles.hangingSpider} />
              </div>
            </Link>

            {/* Other Section Links */}
            {NAV_LINKS.map(link => {
              const active = isLinkActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  ref={el => { navLinksRef.current[link.path] = el; }}
                  onClick={() => triggerSpiderWalk(link.path)}
                  className={`${styles.navLink}${active ? ` ${styles.activeLink}` : ''}`}
                  aria-current={active ? 'page' : undefined}
                >
                  <span>{link.label}</span>
                  <div className={styles.hangingSpiderWrapper} aria-hidden="true">
                    <span className={styles.silkThread} />
                    <SpiderIcon className={styles.hangingSpider} />
                  </div>
                </Link>
              );
            })}

            {/* Walking Spider Track across Desktop Navigation */}
            <div
              ref={walkingSpiderRef}
              className={styles.walkingSpiderContainer}
              aria-hidden="true"
            >
              <div ref={dropSilkRef} className={styles.walkingSilkThread} />
              <div ref={spiderBodyRef} className={styles.walkingSpiderBody}>
                <SpiderIcon className={styles.walkingSpiderIcon} isWalking={isWalking} />
              </div>
            </div>

            {/* Silk trail left behind the walking spider */}
            <div ref={silkTrailRef} className={styles.silkTrail} aria-hidden="true" />
          </nav>

          {/* Mobile Actions: Red Static Home Icon + Clean Hamburger */}
          <div className={styles.mobileActions}>
            <Link
              to="/"
              className={`${styles.mobileHomeBtn}${isHome ? ` ${styles.activeMobileHome}` : ''}`}
              aria-label="Home"
              title="Home"
            >
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="currentColor"
                className={styles.staticHomeIcon}
                aria-hidden="true"
              >
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
              <div className={styles.hangingSpiderWrapperMobile} aria-hidden="true">
                <span className={styles.silkThread} />
                <SpiderIcon className={styles.hangingSpider} />
              </div>
            </Link>

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
