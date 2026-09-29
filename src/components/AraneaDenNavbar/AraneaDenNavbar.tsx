import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePreloader } from '../../context/PreloaderContext';
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

interface SpiderWalking3DIconProps {
  className?: string;
  isWalking?: boolean;
}

const SpiderWalking3DIcon: React.FC<SpiderWalking3DIconProps> = ({ className, isWalking = false }) => (
  <svg
    viewBox="0 0 36 24"
    className={`${className || ''} ${isWalking ? styles.spiderWalkingSide : ''}`}
    aria-hidden="true"
  >
    {/* 3D Depth Layer 1: Background Legs (darker crimson, 0.55 opacity for stereoscopic depth) */}
    <g
      className={isWalking ? styles.bgLegSet : undefined}
      fill="none"
      stroke="#7A1016"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.55"
    >
      <path d="M 23 14 L 27 6 L 31 10 L 33 22" />
      <path d="M 20 13.5 L 23 4.5 L 26 7.5 L 29 22" />
      <path d="M 16 13.5 L 14 4.5 L 10 8.5 L 7 22" />
      <path d="M 13 14 L 8 6 L 3 11 L 1 22" />
    </g>

    {/* Spinneret Silk Node at rear tip of abdomen */}
    <circle cx="2" cy="12.5" r="1.2" fill="#df2531" />

    {/* Spider Body - 3D side profile */}
    {/* Abdomen (arched, tilted up at back) */}
    <path
      d="M 15 12.5 C 15 8.5, 9.5 6, 4.5 8 C 1.5 9.5, 1 13.5, 3.5 15.5 C 6.5 17.5, 12 17, 15 12.5 Z"
      fill="#df2531"
    />
    {/* Abdomen 3D specular highlight */}
    <ellipse cx="7.5" cy="10.5" rx="3.5" ry="1.8" fill="rgba(255, 255, 255, 0.4)" transform="rotate(-15 7.5 10.5)" />

    {/* Cephalothorax (head & thorax) */}
    <path
      d="M 14.5 13 C 15 10, 20 9.5, 23 11.5 C 24.5 12.5, 24.5 15, 23 16 C 20.5 17, 16 16.5, 14.5 13 Z"
      fill="#b81622"
    />

    {/* Chelicerae / Pedipalps (front feelers) */}
    <path
      d="M 23 13 Q 26 14.5, 27 17"
      fill="none"
      stroke="#df2531"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
    <path
      d="M 22.5 12 Q 25 13, 26.5 15.5"
      fill="none"
      stroke="#ff4a58"
      strokeWidth="1.1"
      strokeLinecap="round"
    />

    {/* 3D Depth Layer 2: Foreground Legs (vivid bright crimson, sharp joint articulation) */}
    <g
      className={isWalking ? styles.fgLegSet1 : undefined}
      fill="none"
      stroke="#df2531"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M 22 14 L 26 7 L 30 11 L 32 23" />
      <path d="M 16 13.5 L 14 5 L 9 9 L 6 23" />
    </g>

    <g
      className={isWalking ? styles.fgLegSet2 : undefined}
      fill="none"
      stroke="#df2531"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M 19 13.5 L 22 5 L 25 8 L 27 23" />
      <path d="M 14 14 L 9 7 L 4 12 L 2 23" />
    </g>
  </svg>
);

export const AraneaDenNavbar: React.FC<AraneaDenNavbarProps> = ({ isVisible: _isVisible = true }) => {
  const { isActive: isPreloaderActive } = usePreloader();
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [isInHero, setIsInHero] = useState<boolean>(true);
  const [isWalking, setIsWalking] = useState<boolean>(false);
  const [walkingDirection, setWalkingDirection] = useState<'left' | 'right'>('right');
  const [isHanging, setIsHanging] = useState<boolean>(false);
  const [isMobileWalking, setIsMobileWalking] = useState<boolean>(false);
  const [mobileWalkingDirection, setMobileWalkingDirection] = useState<'left' | 'right'>('right');
  const [isMobileHanging, setIsMobileHanging] = useState<boolean>(false);
  const [hasWalkingSpider, setHasWalkingSpider] = useState<boolean>(false);

  const navbarRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const hamburgerLinesRef = useRef<(HTMLSpanElement | null)[]>([]);
  const desktopNavRef = useRef<HTMLElement>(null);
  const navLinksRef = useRef<{ [key: string]: HTMLElement | null }>({});
  const walkingSpiderRef = useRef<HTMLDivElement>(null);
  const spiderBodyRef = useRef<HTMLDivElement>(null);
  const dropSilkRef = useRef<HTMLDivElement>(null);
  const mobileWalkingSpiderRef = useRef<HTMLDivElement>(null);
  const mobileSpiderBodyRef = useRef<HTMLDivElement>(null);
  const mobileDropSilkRef = useRef<HTMLDivElement>(null);

  const location = useLocation();
  const currentPath = location.pathname;
  const lastFromPathRef = useRef<string>(currentPath);
  const pendingTargetRef = useRef<{ from: string; target: string } | null>(null);
  const isPreloaderActiveRef = useRef<boolean>(isPreloaderActive);

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

  const triggerSpiderWalk = useCallback((targetPath: string, fromPathOverride?: string) => {
    const isMobile = window.innerWidth <= 768;

    // ── MOBILE VIEW ANIMATION ────────────────────────────────────
    if (isMobile) {
      const innerEl = innerRef.current;
      const mContainer = mobileWalkingSpiderRef.current;
      const mBody = mobileSpiderBodyRef.current;
      const mDropSilk = mobileDropSilkRef.current;
      if (!innerEl || !mContainer || !mBody || !mDropSilk) return;

      gsap.killTweensOf([mContainer, mBody, mDropSilk]);

      const innerRect = innerEl.getBoundingClientRect();
      const mobileTargets: { [key: string]: number } = {
        '/': 0.16,
        '/about': 0.36,
        '/services': 0.54,
        '/portfolio': 0.72,
        '/contact': 0.88,
      };

      const fromPath = fromPathOverride || lastFromPathRef.current;
      const startFrac = mobileTargets[fromPath] ?? 0.2;
      const endFrac = mobileTargets[targetPath] ?? 0.54;

      const startX = startFrac * innerRect.width;
      const endX = endFrac * innerRect.width;
      const effDist = endX - startX;
      const isMovingRight = effDist >= 0;
      const navbarBottom = innerRect.height; // Exact bottom line of the mobile navbar

      setMobileWalkingDirection(isMovingRight ? 'right' : 'left');
      setIsMobileWalking(true);
      setIsMobileHanging(false);
      mContainer.style.display = 'block';

      gsap.set(mDropSilk, {
        top: navbarBottom,
        height: 20,
        scaleY: 0,
        transformOrigin: 'top center',
      });

      if (Math.abs(effDist) < 10) {
        gsap.set(mContainer, { xPercent: -50, x: endX, opacity: 1 });
        gsap.set(mBody, { y: navbarBottom });
        setIsMobileWalking(false);
        setIsMobileHanging(true);

        gsap.to(mDropSilk, { scaleY: 1, duration: 0.35, ease: 'power2.out' });
        gsap.to(mBody, {
          y: navbarBottom + 20,
          duration: 0.38,
          ease: 'back.out(1.8)',
          onComplete: () => {
            gsap.to(mBody, { y: navbarBottom, delay: 1.8, duration: 0.35, ease: 'power2.in' });
            gsap.to(mDropSilk, { scaleY: 0, delay: 1.8, duration: 0.35, ease: 'power2.in' });
            gsap.to(mContainer, {
              opacity: 0,
              delay: 2.15,
              duration: 0.25,
              onComplete: () => {
                if (mContainer) mContainer.style.display = 'none';
              },
            });
          },
        });
        return;
      }

      const walkDuration = Math.min(Math.max(Math.abs(effDist) / 140, 0.7), 1.3);

      gsap.set(mContainer, { xPercent: -50, x: startX, opacity: 1 });
      // Walk above the top rail cleanly (y: -20px)
      gsap.set(mBody, { y: -20 });

      // 1. Walk across top rail of mobile navbar
      gsap.to(mContainer, {
        x: endX,
        duration: walkDuration,
        ease: 'power1.inOut',
        onComplete: () => {
          setIsMobileWalking(false);
          setIsMobileHanging(true);

          // 2. Scurry down to the bottom line of the mobile navbar
          gsap.to(mBody, {
            y: navbarBottom,
            duration: 0.18,
            ease: 'power1.inOut',
            onComplete: () => {
              // 3. Drop down on silk thread FROM bottom line of mobile navbar!
              gsap.to(mDropSilk, {
                scaleY: 1,
                duration: 0.35,
                ease: 'power2.out',
              });
              gsap.to(mBody, {
                y: navbarBottom + 20,
                duration: 0.38,
                ease: 'back.out(1.8)',
                onComplete: () => {
                  // 4. Hang and sway for 1.8s
                  gsap.to(mBody, {
                    y: navbarBottom,
                    delay: 1.8,
                    duration: 0.35,
                    ease: 'power2.in',
                  });
                  gsap.to(mDropSilk, {
                    scaleY: 0,
                    delay: 1.8,
                    duration: 0.35,
                    ease: 'power2.in',
                  });
                  gsap.to(mContainer, {
                    opacity: 0,
                    delay: 2.15,
                    duration: 0.25,
                    onComplete: () => {
                      if (mContainer) mContainer.style.display = 'none';
                    },
                  });
                },
              });
            },
          });
        },
      });
      return;
    }

    // ── DESKTOP VIEW ANIMATION ───────────────────────────────────
    const desktopNav = desktopNavRef.current;
    if (!desktopNav) return;

    const targetEl = navLinksRef.current[targetPath];
    if (!targetEl) return;

    const fromPath = fromPathOverride || lastFromPathRef.current;
    const fromEl = navLinksRef.current[fromPath] || navLinksRef.current['/'] || targetEl;

    const navRect = desktopNav.getBoundingClientRect();
    const fromRect = fromEl.getBoundingClientRect();
    const toRect = targetEl.getBoundingClientRect();

    const startX = (fromRect.left + fromRect.width / 2) - navRect.left;
    const endX = (toRect.left + toRect.width / 2) - navRect.left;
    // Precisely the bottom line of the nav item!
    const navItemBottom = toRect.bottom - navRect.top;

    const container = walkingSpiderRef.current;
    const body = spiderBodyRef.current;
    const dropSilk = dropSilkRef.current;
    if (!container || !body || !dropSilk) return;

    gsap.killTweensOf([container, body, dropSilk]);

    const effDist = endX - startX;
    const isMovingRight = effDist >= 0;

    setHasWalkingSpider(true);
    setWalkingDirection(isMovingRight ? 'right' : 'left');
    setIsWalking(true);
    setIsHanging(false);

    // Anchor the silk thread strictly at the bottom line of the nav item!
    gsap.set(dropSilk, {
      top: navItemBottom,
      height: 20,
      scaleY: 0,
      transformOrigin: 'top center',
    });

    if (Math.abs(effDist) < 6) {
      container.style.display = 'block';
      gsap.set(container, { xPercent: -50, x: endX, opacity: 1 });
      gsap.set(body, { y: navItemBottom });
      setIsWalking(false);
      setIsHanging(true);

      // Drop down strictly from the bottom line of the nav item
      gsap.to(dropSilk, { scaleY: 1, duration: 0.35, ease: 'power2.out' });
      gsap.to(body, {
        y: navItemBottom + 20,
        duration: 0.38,
        ease: 'back.out(1.8)',
        onComplete: () => {
          gsap.to(body, { y: navItemBottom, delay: 1.8, duration: 0.35, ease: 'power2.in' });
          gsap.to(dropSilk, { scaleY: 0, delay: 1.8, duration: 0.35, ease: 'power2.in' });
          gsap.to(container, {
            opacity: 0,
            delay: 2.15,
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

    const walkDuration = Math.min(Math.max(Math.abs(effDist) / 180, 0.85), 1.5);

    container.style.display = 'block';
    gsap.set(container, { xPercent: -50, x: startX, opacity: 1 });
    // Walk above the top rail cleanly (y: -22px) with ample clearance over text
    gsap.set(body, { y: -22 });

    // 1. Walk across top of navbar
    gsap.to(container, {
      x: endX,
      duration: walkDuration,
      ease: 'power1.inOut',
      onComplete: () => {
        setIsWalking(false);
        setIsHanging(true);

        // 2. Scurry down to the bottom line of the nav item
        gsap.to(body, {
          y: navItemBottom,
          duration: 0.18,
          ease: 'power1.inOut',
          onComplete: () => {
            // 3. Drop down on silk thread FROM the bottom line of the nav item!
            gsap.to(dropSilk, {
              scaleY: 1,
              duration: 0.35,
              ease: 'power2.out',
            });
            gsap.to(body, {
              y: navItemBottom + 20,
              duration: 0.38,
              ease: 'back.out(1.8)',
              onComplete: () => {
                // 4. Hold hanging for 1.9s, then climb back up to bottom line
                gsap.to(body, {
                  y: navItemBottom,
                  delay: 1.9,
                  duration: 0.35,
                  ease: 'power2.in',
                });
                gsap.to(dropSilk, {
                  scaleY: 0,
                  delay: 1.9,
                  duration: 0.35,
                  ease: 'power2.in',
                });
                gsap.to(container, {
                  opacity: 0,
                  delay: 2.25,
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

  // Track location changes: queue target path when navigating to another page
  useEffect(() => {
    if (lastFromPathRef.current !== currentPath) {
      const from = lastFromPathRef.current;
      const target = currentPath;
      lastFromPathRef.current = target;
      pendingTargetRef.current = { from, target };

      // Fallback: If preloader is not triggered (already inactive/instant), trigger walk after brief delay
      const fallbackTimer = setTimeout(() => {
        if (!isPreloaderActiveRef.current && pendingTargetRef.current) {
          const p = pendingTargetRef.current;
          pendingTargetRef.current = null;
          triggerSpiderWalk(p.target, p.from);
        }
      }, 180);

      return () => clearTimeout(fallbackTimer);
    }
  }, [currentPath, triggerSpiderWalk]);

  // When preloader finishes (isActive goes from true -> false), trigger spider walk!
  useEffect(() => {
    if (isPreloaderActiveRef.current && !isPreloaderActive) {
      const p = pendingTargetRef.current;
      if (p) {
        pendingTargetRef.current = null;
        // Brief delay (100ms) after preloader dissolves so the page is visible before spider starts crawling
        const timer = setTimeout(() => {
          triggerSpiderWalk(p.target, p.from);
        }, 100);
        return () => clearTimeout(timer);
      }
    }
    isPreloaderActiveRef.current = isPreloaderActive;
  }, [isPreloaderActive, triggerSpiderWalk]);

  return (
    <>
      <header
        ref={navbarRef}
        className={`${styles.navbar} ${isDarkTheme ? styles.darkTheme : styles.lightTheme}${
          isScrolled ? ` ${styles.scrolled}` : ''
        }`}
        role="banner"
      >
        <div ref={innerRef} className={styles.inner}>
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
                {isHanging ? (
                  <SpiderIcon className={styles.walkingSpiderIcon} />
                ) : (
                  <SpiderWalking3DIcon
                    className={`${styles.walkingSpiderIcon3D} ${walkingDirection === 'left' ? styles.facingLeft : ''}`}
                    isWalking={isWalking}
                  />
                )}
              </div>
            </div>
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

          {/* Mobile Walking Spider Track */}
          <div
            ref={mobileWalkingSpiderRef}
            className={styles.mobileWalkingSpiderContainer}
            aria-hidden="true"
          >
            <div ref={mobileDropSilkRef} className={styles.mobileWalkingSilkThread} />
            <div ref={mobileSpiderBodyRef} className={styles.mobileWalkingSpiderBody}>
              {isMobileHanging ? (
                <SpiderIcon className={styles.walkingSpiderIcon} />
              ) : (
                <SpiderWalking3DIcon
                  className={`${styles.walkingSpiderIcon3D} ${mobileWalkingDirection === 'left' ? styles.facingLeft : ''}`}
                  isWalking={isMobileWalking}
                />
              )}
            </div>
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
