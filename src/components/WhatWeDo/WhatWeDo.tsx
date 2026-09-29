import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './WhatWeDo.module.css';
import { VideoProductionVisual } from './ServiceVisuals';
import { ARANEA_REELS } from '../../data/reelsData';

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────
   DATA TYPES
───────────────────────────────────────── */
interface ServiceChapter {
  id: string;
  number: string;
  slug: string;
  name: string;
  description: string;
  imageSrc?: string;
  visualComponent?: React.ReactNode;
}

/* ─────────────────────────────────────────
   8 SERVICES DATA
───────────────────────────────────────── */
const SERVICES_DATA: ServiceChapter[] = [
  {
    id: 'web-dev',
    number: '01',
    slug: 'web-development',
    name: 'WEB DEVELOPMENT',
    description:
      'Engineered for speed, durability, and computational elegance. We construct bespoke web platforms, web applications, and immersive digital flagships using clean architecture and modern rendering pipelines.',
    imageSrc: '/services/ad-web-development.jpg',
  },
  {
    id: 'mobile-app',
    number: '02',
    slug: 'mobile-development',
    name: 'MOBILE APP DEVELOPMENT',
    description:
      'Fluid native iOS and Android applications designed with tactile micro-interactions, uncompromising speed, and resilient offline-first architecture that seamlessly scale to millions of users.',
    imageSrc: '/services/ad-mobile-development.jpg',
  },
  {
    id: 'ui-ux',
    number: '03',
    slug: 'ui-ux-design',
    name: 'UI / UX DESIGN',
    description:
      'Disciplined design systems founded on structural harmony, typographic precision, and intuitive user psychology. We eliminate friction to create interfaces that feel natural, deliberate, and authoritative.',
    imageSrc: '/services/ad-ui-ux-design.jpg',
  },
  {
    id: 'digital-marketing',
    number: '04',
    slug: 'digital-marketing',
    name: 'DIGITAL MARKETING',
    description:
      'Data-informed growth strategies and omnichannel digital marketing that turn attention into sustained momentum. Every campaign is measured against real revenue and brand equity impact.',
    imageSrc: '/services/ad-digital-marketing.jpg',
  },
  {
    id: 'video-prod',
    number: '05',
    slug: 'video-production',
    name: 'VIDEO PRODUCTION',
    description:
      'High-impact cinematic reels, commercial brand films, and visual storytelling by AD Imperial Visuals engineered for viral reach and commanding brand presence.',
    visualComponent: <VideoProductionVisual />,
  },
  {
    id: 'graphic-design',
    number: '06',
    slug: 'graphic-design',
    name: 'GRAPHIC DESIGN',
    description:
      'Editorial poster design, custom typographic identities, and iconic brand visuals engineered with aesthetic rigor to command authority across print and digital media.',
    imageSrc: '/services/ad-graphic-design.jpg',
  },
  {
    id: 'software-hardware-solutions',
    number: '07',
    slug: 'software-hardware-solutions',
    name: 'SOFTWARE / HARDWARE SOLUTIONS',
    description:
      'Custom software architectures, rapid hardware prototyping, intensive hands-on workshops, and hackathon incubation that transform visionary concepts into high-performance realities.',
    imageSrc: '/services/ad-software-solutions.jpg',
  },
  {
    id: 'iot-hardware',
    number: '08',
    slug: 'iot-hardware-solutions',
    name: 'IOT / HARDWARE SOLUTIONS',
    description:
      'Industrial IoT systems, smart connected hardware, embedded sensor telemetry, and ultra-low latency edge computing built for high reliability and scalable real-world deployment.',
    imageSrc: '/services/ad-iot-hardware.jpg',
  },
];

/* ─────────────────────────────────────────
   CLEAN REEL CARD COMPONENT (Cinematic Video Card — Image-2 Inspired)
───────────────────────────────────────── */
interface CleanReelCardProps {
  reel: (typeof ARANEA_REELS)[0];
  isActive?: boolean;
}

const CleanReelCard: React.FC<CleanReelCardProps> = ({ reel, isActive = true }) => {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Strict browser autoplay policy requires muted & playsInline
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    if (!isActive) {
      video.pause();
      return;
    }

    const startPlayback = () => {
      video.muted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsVideoLoaded(true))
          .catch(() => {
            // Browser autoplay policy handled safely
          });
      }
    };

    // Autoplay immediately on mount or when active
    startPlayback();

    video.addEventListener('loadeddata', startPlayback);
    video.addEventListener('canplay', startPlayback);

    const el = cardRef.current;
    if (!el) return;

    // Pause when card is scrolled far out of view, resume when back in view
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!isActive) return;
        if (entry.isIntersecting) {
          video.muted = true;
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      {
        rootMargin: '120px 60px 120px 60px',
        threshold: 0.05,
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      video.removeEventListener('loadeddata', startPlayback);
      video.removeEventListener('canplay', startPlayback);
    };
  }, [isActive, reel.videoSrc]);

  return (
    <a
      ref={cardRef}
      href={reel.instagramUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.reelCard}
      aria-label={`${reel.client} - ${reel.title}`}
    >
      <div className={styles.reelMedia}>
        <img
          src={reel.thumbnail}
          alt={reel.client || reel.title}
          loading="lazy"
          className={`${styles.reelPoster} ${isVideoLoaded ? styles.posterHidden : ''}`}
        />

        <video
          ref={videoRef}
          src={reel.videoSrc}
          poster={reel.thumbnail}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          crossOrigin="anonymous"
          className={styles.reelVideo}
          onPlaying={() => setIsVideoLoaded(true)}
        />

        {/* Small curved ambient red bloom & shadow at bottom left (Inspired by Image 2) */}
        <div className={styles.cleanReelOverlay}>
          <svg viewBox="0 0 24 24" fill="currentColor" className={styles.cleanReelInstaIcon} aria-hidden="true">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
          <span className={styles.cleanReelLabel}>{reel.client || reel.title}</span>
        </div>
      </div>
    </a>
  );
};

/* ─────────────────────────────────────────
   SMOOTH REEL MARQUEE (Ultra-Smooth 60FPS Continuous Scroll)
───────────────────────────────────────── */
interface SmoothReelMarqueeProps {
  isMobile?: boolean;
  isActive?: boolean;
}

const SmoothReelMarquee: React.FC<SmoothReelMarqueeProps> = ({ isMobile = false, isActive = true }) => {
  const scrollTrackRef = useRef<HTMLDivElement>(null);
  // Duplicate reels to create seamless continuous marquee loop
  const marqueeReels = useMemo(() => [...ARANEA_REELS, ...ARANEA_REELS], []);

  return (
    <div className={`${styles.reelGalleryOuter} ${isMobile ? styles.mobileReelGallery : ''}`}>
      <div className={styles.reelGalleryViewport}>
        <div ref={scrollTrackRef} className={styles.reelTrack}>
          {marqueeReels.map((reel, idx) => (
            <div key={`${reel.id}-${idx}`} className={styles.reelCardWrapper}>
              <CleanReelCard reel={reel} isActive={isActive} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
export const WhatWeDo: React.FC = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [mobileActiveIndex, setMobileActiveIndex] = useState(0);
  const mobileCardsRef = useRef<(HTMLElement | null)[]>([]);
  const mobileNavTrackRef = useRef<HTMLDivElement>(null);

  // Direct click on service in directory (Desktop)
  const handleServiceClick = useCallback((index: number) => {
    setActiveIndex(index);

    const st = ScrollTrigger.getById('services-pin');
    if (st) {
      const targetProgress = (index + 0.5) / SERVICES_DATA.length;
      const targetScroll = st.start + (st.end - st.start) * targetProgress;
      if ((window as any).lenis) {
        (window as any).lenis.scrollTo(targetScroll, { duration: 0.8 });
      } else {
        window.scrollTo({ top: targetScroll, behavior: 'smooth' });
      }
    }
  }, []);

  // Desktop GSAP Pinning & Sync
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const section = sectionRef.current;
    if (!wrapper || !section) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const mm = gsap.matchMedia();

    mm.add('(min-width: 769px)', () => {
      const trigger = ScrollTrigger.create({
        id: 'services-pin',
        trigger: wrapper,
        start: 'top top',
        end: '+=120%',
        pin: section,
        pinSpacing: true,
        anticipatePin: 1,
        scrub: 0.4,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const progress = self.progress;
          const idx = Math.min(Math.floor(progress * SERVICES_DATA.length), SERVICES_DATA.length - 1);
          setActiveIndex(idx);

          // GPU-accelerated Progress Bar (Zero Reflow)
          if (progressBarRef.current) {
            const scale = Math.max(0.125, progress);
            progressBarRef.current.style.transform = `scaleX(${scale})`;
          }
        },
      });

      // Pause continuous marquee when WhatWeDo section leaves viewport to save GPU/CPU cycles
      const pauseTrigger = ScrollTrigger.create({
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        onEnter: () => section.classList.remove(styles.isPaused),
        onLeave: () => section.classList.add(styles.isPaused),
        onEnterBack: () => section.classList.remove(styles.isPaused),
        onLeaveBack: () => section.classList.add(styles.isPaused),
      });

      return () => {
        trigger.kill();
        pauseTrigger.kill();
      };
    });

    return () => {
      mm.revert();
    };
  }, []);

  // Subtle card entrance reveal when activeIndex changes (Desktop)
  useEffect(() => {
    cardsRef.current.forEach((card, idx) => {
      if (!card) return;
      if (idx === activeIndex) {
        gsap.fromTo(
          card,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out', clearProps: 'transform' }
        );
      }
    });
  }, [activeIndex]);

  // Synchronize active mobile card on scroll
  useEffect(() => {
    const cards = mobileCardsRef.current;
    if (!cards || cards.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = cards.findIndex((el) => el === entry.target);
            if (idx !== -1) {
              setMobileActiveIndex(idx);
            }
          }
        });
      },
      {
        rootMargin: '-20% 0px -50% 0px',
        threshold: 0.1,
      }
    );

    cards.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  // Smoothly center the active pill in the horizontal sticky track
  useEffect(() => {
    const track = mobileNavTrackRef.current;
    if (!track) return;
    const activePill = track.children[mobileActiveIndex] as HTMLElement;
    if (activePill) {
      const trackWidth = track.clientWidth;
      const pillLeft = activePill.offsetLeft;
      const pillWidth = activePill.clientWidth;
      track.scrollTo({
        left: pillLeft - trackWidth / 2 + pillWidth / 2,
        behavior: 'smooth',
      });
    }
  }, [mobileActiveIndex]);

  // Click on pill to smoothly scroll directly to that service card
  const scrollToMobileCard = useCallback((index: number) => {
    setMobileActiveIndex(index);
    const card = mobileCardsRef.current[index];
    if (card) {
      const yOffset = -118; // sticky navbar + sticky pill bar offset
      const y = card.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, []);

  const activeService = SERVICES_DATA[activeIndex];

  return (
    <div ref={wrapperRef} className={styles.servicesWrapper}>
      <section ref={sectionRef} id="services" className={styles.servicesSection} aria-label="What We Do">
        {/* Delicate Architectural Light Red Web on Right Side */}
        <div className={styles.rightSideWeb} aria-hidden="true">
          <svg viewBox="0 0 700 700" fill="none" preserveAspectRatio="xMaxYMid slice" className={styles.webSvg}>
            <defs>
              <linearGradient id="serviceWebGrad" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#DF2531" stopOpacity="0.26" />
                <stop offset="55%" stopColor="#DF2531" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#DF2531" stopOpacity="0.02" />
              </linearGradient>
              <filter id="webNodeGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#DF2531" floodOpacity="0.5" />
              </filter>
            </defs>

            {/* Apex anchor at upper right corner */}
            <circle cx="620" cy="80" r="3.5" fill="#DF2531" filter="url(#webNodeGlow)" />
            <circle cx="620" cy="80" r="12" stroke="rgba(223, 37, 49, 0.2)" strokeWidth="0.8" />
            <circle cx="620" cy="80" r="24" stroke="rgba(223, 37, 49, 0.1)" strokeWidth="0.5" strokeDasharray="3 4" />

            {/* Primary Radial Spokes radiating inward & down */}
            <path d="M 620 80 Q 480 90, 80 140" stroke="url(#serviceWebGrad)" strokeWidth="1" />
            <path d="M 620 80 Q 420 180, 50 320" stroke="url(#serviceWebGrad)" strokeWidth="1.2" />
            <path d="M 620 80 Q 380 300, 110 520" stroke="url(#serviceWebGrad)" strokeWidth="1.1" />
            <path d="M 620 80 Q 420 420, 240 680" stroke="url(#serviceWebGrad)" strokeWidth="1.2" />
            <path d="M 620 80 Q 520 480, 440 700" stroke="url(#serviceWebGrad)" strokeWidth="0.9" />
            <path d="M 620 80 Q 640 380, 620 700" stroke="url(#serviceWebGrad)" strokeWidth="0.8" />
            <path d="M 620 80 Q 670 180, 700 320" stroke="url(#serviceWebGrad)" strokeWidth="0.8" />

            {/* Transverse Catenary Connecting Curves */}
            <path d="M 620 130 Q 580 120, 540 100 Q 560 85, 600 80" stroke="rgba(223, 37, 49, 0.16)" strokeWidth="0.85" />
            <path d="M 580 200 Q 520 170, 440 130 Q 480 100, 560 90" stroke="rgba(223, 37, 49, 0.18)" strokeWidth="0.9" />
            <path d="M 520 310 Q 430 250, 310 180 Q 380 130, 490 110" stroke="rgba(223, 37, 49, 0.16)" strokeWidth="0.95" />
            <path d="M 440 450 Q 330 360, 190 250 Q 280 180, 420 140" stroke="rgba(223, 37, 49, 0.14)" strokeWidth="1" />
            <path d="M 340 590 Q 220 470, 90 350 Q 180 260, 340 200" stroke="rgba(223, 37, 49, 0.12)" strokeWidth="0.9" />

            {/* Dew nodes at intersection points */}
            <circle cx="540" cy="100" r="1.8" fill="#DF2531" opacity="0.65" />
            <circle cx="440" cy="130" r="2" fill="#DF2531" opacity="0.6" />
            <circle cx="310" cy="180" r="2.2" fill="#DF2531" opacity="0.55" />
            <circle cx="190" cy="250" r="2" fill="#DF2531" opacity="0.5" />
            <circle cx="430" cy="250" r="1.8" fill="#DF2531" opacity="0.5" />
          </svg>
        </div>

        <div className={styles.container}>
          {/* Top Header Bar */}
          <div className={styles.topBar}>
            <div className={styles.eyebrow}>
              <span className={styles.marker} aria-hidden="true" />
              <span className={styles.eyebrowText}>SERVICES</span>
            </div>
            <div className={styles.chapterTracker}>
              <span>SERVICE {activeService.number} / 08</span>
            </div>
          </div>

          {/* ── DESKTOP STAGE: Left Navigation | Right Split Card with Visual ── */}
          <div className={styles.stageGrid}>
            {/* Left Column: Interactive Service Directory */}
            <nav className={styles.navCol} aria-label="Services List">
              {SERVICES_DATA.map((srv, idx) => (
                <button
                  key={srv.id}
                  type="button"
                  onClick={() => handleServiceClick(idx)}
                  className={`${styles.navItem} ${idx === activeIndex ? styles.active : ''}`}
                  aria-selected={idx === activeIndex}
                  role="tab"
                >
                  <span className={styles.navLine} aria-hidden="true" />
                  <span className={styles.navLinkContent}>
                    <span className={styles.navNumber}>{srv.number}</span>
                    <span className={styles.navTitle}>{srv.name}</span>
                  </span>
                </button>
              ))}
            </nav>

            {/* Right Column: Active Service Display */}
            <div className={styles.cardCol}>
              {SERVICES_DATA.map((srv, idx) => {
                const isCurrent = idx === activeIndex;
                const isVideoProd = srv.id === 'video-prod';

                return (
                  <div
                    key={srv.id}
                    ref={(el) => {
                      cardsRef.current[idx] = el;
                    }}
                    className={`${styles.serviceCard} ${isVideoProd ? styles.serviceCardMedia : ''} ${
                      isCurrent ? styles.cardActive : ''
                    }`}
                  >
                    {isVideoProd ? (
                      /* Service 05: Dedicated Video Production Media Panel (Continuous 60FPS Reel Marquee) */
                      <div className={styles.mediaPanel}>
                        <div className={styles.mediaPanelHeader}>
                          <div className={styles.mediaPanelTitleGroup}>
                            <span className={styles.cardNumber}>SERVICE {srv.number}</span>
                            <h3 className={styles.mediaTitle}>
                              <img
                                src="/AD Transparent SVG.svg"
                                alt="Aranea Den"
                                className={styles.mediaTitleLogo}
                              />
                              <span>Imperial Visuals</span>
                            </h3>
                          </div>
                          <Link to={`/services/${srv.slug}`} className={styles.exploreLink}>
                            EXPLORE FULL SERVICE &rarr;
                          </Link>
                        </div>

                        {/* Ultra-Smooth 60FPS Continuous Reel Marquee */}
                        <SmoothReelMarquee isActive={isCurrent} />
                      </div>
                    ) : (
                      /* Services 01-04, 06-08: Split Layout (Text Left + Bespoke Visual Right) */
                      <div className={styles.cardInnerSplit}>
                        <div className={styles.cardContentCol}>
                          <div className={styles.cardHeaderGroup}>
                            <span className={styles.cardNumber}>SERVICE {srv.number}</span>
                            <h3 className={styles.cardTitle}>{srv.name}</h3>
                            <p className={styles.cardDescription}>{srv.description}</p>
                          </div>
                          <Link to={`/services/${srv.slug}`} className={styles.exploreLink}>
                            EXPLORE FULL SERVICE &rarr;
                          </Link>
                        </div>

                        {/* Visual Stage on Right */}
                        <div className={styles.cardVisualCol}>
                          {srv.imageSrc ? (
                            <div className={styles.imageContainer}>
                              <img
                                src={srv.imageSrc}
                                alt={srv.name}
                                className={styles.cardVisualImage}
                                loading={idx === 0 ? 'eager' : 'lazy'}
                              />
                              <div className={styles.imageOverlayGlow} aria-hidden="true" />
                            </div>
                          ) : (
                            srv.visualComponent
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── MOBILE EDITORIAL STREAM: Engaging, Luxury Vertical Cards & Sticky Nav ── */}
          <div className={styles.mobileStream}>
            {/* Sticky Category Pill Bar */}
            <div className={styles.mobileNavSticky}>
              <div className={styles.mobileNavPillTrack} ref={mobileNavTrackRef}>
                {SERVICES_DATA.map((srv, idx) => (
                  <button
                    key={srv.id}
                    type="button"
                    className={`${styles.mobileNavPill} ${
                      idx === mobileActiveIndex ? styles.mobileNavPillActive : ''
                    }`}
                    onClick={() => scrollToMobileCard(idx)}
                    aria-label={`Jump to ${srv.name}`}
                  >
                    <span className={styles.mobileNavPillNum}>{srv.number}</span>
                    <span className={styles.mobileNavPillText}>{srv.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 8 Full Editorial Service Cards */}
            <div className={styles.mobileCardsList}>
              {SERVICES_DATA.map((srv, idx) => {
                const isVideoProd = srv.id === 'video-prod';

                return (
                  <article
                    key={srv.id}
                    id={`mobile-service-${idx}`}
                    ref={(el) => {
                      mobileCardsRef.current[idx] = el;
                    }}
                    className={`${styles.mobileCard} ${isVideoProd ? styles.mobileCardVideoProd : ''}`}
                  >
                    <div className={styles.mobileCardHeader}>
                      <span className={styles.mobileCardNumber}>
                        SERVICE {srv.number} / 08
                      </span>
                      <h3 className={styles.mobileCardTitle}>
                        {isVideoProd ? (
                          <span className={styles.mobileTitleWithLogo}>
                            <img
                              src="/AD Transparent SVG.svg"
                              alt="Aranea Den"
                              className={styles.mediaTitleLogo}
                            />
                            <span>Imperial Visuals</span>
                          </span>
                        ) : (
                          srv.name
                        )}
                      </h3>
                      <p className={styles.mobileCardDescription}>{srv.description}</p>
                    </div>

                    {/* Visual Showcase */}
                    <div className={styles.mobileCardVisualContainer}>
                      {isVideoProd ? (
                        <SmoothReelMarquee isMobile={true} />
                      ) : srv.imageSrc ? (
                        <img
                          src={srv.imageSrc}
                          alt={srv.name}
                          className={styles.mobileVisualImage}
                          loading="lazy"
                        />
                      ) : (
                        <div className={styles.mobileVisualWrapper}>
                          {srv.visualComponent}
                        </div>
                      )}
                    </div>

                    <div className={styles.mobileCardFooter}>
                      <Link to={`/services/${srv.slug}`} className={styles.exploreLink}>
                        EXPLORE FULL SERVICE &rarr;
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          {/* Desktop Progress Bar */}
          <div className={styles.bottomProgress}>
            <div ref={progressBarRef} className={styles.progressBar} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default WhatWeDo;
