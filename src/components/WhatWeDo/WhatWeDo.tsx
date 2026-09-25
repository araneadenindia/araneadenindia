import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './WhatWeDo.module.css';
import {
  WebDevVisual,
  MobileAppVisual,
  UiUxVisual,
  DigitalMarketingVisual,
  GraphicDesignVisual,
  SeoServicesVisual,
  CloudSolutionsVisual,
} from './ServiceVisuals';

import { ARANEA_REELS } from '../../data/reelsData';

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────
   DATA TYPES
───────────────────────────────────────── */
export interface ReelEntry {
  id: string;
  title: string;
  client?: string;
  label: '16:9' | '9:16';
  thumbnail: string;
  videoSrc: string;
  aspectRatio: '16:9' | '9:16';
  externalUrl: string;
  likes?: string;
  tag?: string;
}

interface ServiceChapter {
  id: string;
  number: string;
  slug: string;
  name: string;
  description?: string;
  visualComponent?: React.ReactNode;
  reels?: ReelEntry[];
}

/* ─────────────────────────────────────────
   OFFICIAL REELS FOR SERVICE 05 (VIDEO PRODUCTION)
   Curated from official @araneaden_ Instagram channel
───────────────────────────────────────── */
const VIDEO_PRODUCTION_REELS: ReelEntry[] = ARANEA_REELS.map((reel) => ({
  id: reel.id,
  title: reel.title,
  client: reel.client,
  label: reel.aspectRatio,
  thumbnail: reel.thumbnail,
  videoSrc: reel.videoSrc,
  aspectRatio: reel.aspectRatio,
  externalUrl: reel.instagramUrl,
  likes: reel.likes,
  tag: reel.tag,
}));

/* ─────────────────────────────────────────
   8 SERVICES DATA — CLEANSED OF UNWANTED TAGS & LABELS
───────────────────────────────────────── */
const SERVICES_DATA: ServiceChapter[] = [
  {
    id: 'web-dev',
    number: '01',
    slug: 'web-development',
    name: 'WEB DEVELOPMENT',
    description:
      'Engineered for speed, durability, and computational elegance. We construct bespoke web platforms, web applications, and immersive digital flagships using clean architecture and modern rendering pipelines.',
    visualComponent: <WebDevVisual />,
  },
  {
    id: 'mobile-app',
    number: '02',
    slug: 'mobile-development',
    name: 'MOBILE APP DEVELOPMENT',
    description:
      'Fluid native iOS and Android applications designed with tactile micro-interactions, uncompromising speed, and resilient offline-first architecture that seamlessly scale to millions of users.',
    visualComponent: <MobileAppVisual />,
  },
  {
    id: 'ui-ux',
    number: '03',
    slug: 'ui-ux-design',
    name: 'UI / UX DESIGN',
    description:
      'Disciplined design systems founded on structural harmony, typographic precision, and intuitive user psychology. We eliminate friction to create interfaces that feel natural, deliberate, and authoritative.',
    visualComponent: <UiUxVisual />,
  },
  {
    id: 'digital-marketing',
    number: '04',
    slug: 'digital-marketing',
    name: 'DIGITAL MARKETING',
    description:
      'Data-informed growth strategies and omnichannel digital marketing that turn attention into sustained momentum. Every campaign is measured against real revenue and brand equity impact.',
    visualComponent: <DigitalMarketingVisual />,
  },
  {
    id: 'video-prod',
    number: '05',
    slug: 'video-production',
    name: 'VIDEO PRODUCTION',
    reels: VIDEO_PRODUCTION_REELS, // ONLY Service 05 has reels
  },
  {
    id: 'graphic-design',
    number: '06',
    slug: 'graphic-design',
    name: 'GRAPHIC DESIGN',
    description:
      'Timeless brand visual identities, custom typographic systems, and comprehensive design languages that distinguish ambitious enterprises from the crowded sea of conformity.',
    visualComponent: <GraphicDesignVisual />,
  },
  {
    id: 'seo-services',
    number: '07',
    slug: 'seo',
    name: 'SEO SERVICES',
    description:
      'Semantic structure, deep technical indexing, and authority-building content pipelines that cement top-tier organic visibility and sustainable market share in search algorithms.',
    visualComponent: <SeoServicesVisual />,
  },
  {
    id: 'cloud-solutions',
    number: '08',
    slug: 'cloud-solutions',
    name: 'CLOUD SOLUTIONS',
    description:
      'Mission-critical cloud infrastructure designed for zero downtime, automated scaling, robust security, and planetary edge distribution to support rapid organizational scale.',
    visualComponent: <CloudSolutionsVisual />,
  },
];

/* ─────────────────────────────────────────
   REEL CARD COMPONENT
   Displays authentic Instagram reel with video autoplay, likes, client tag & link
───────────────────────────────────────── */
interface ReelCardProps {
  reel: ReelEntry;
  onCardClick: (reel: ReelEntry) => void;
}

const ReelCard: React.FC<ReelCardProps> = ({ reel, onCardClick }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.defaultMuted = true;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {});
    }
  }, []);

  const handleClick = useCallback(() => {
    onCardClick(reel);
  }, [reel, onCardClick]);

  return (
    <div
      className={styles.reelCard}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') handleClick();
      }}
      aria-label={`${reel.title} - ${reel.likes || ''}`}
    >
      <div className={styles.reelMedia}>
        <video
          ref={videoRef}
          src={reel.videoSrc}
          poster={reel.thumbnail}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className={styles.reelVideo}
        />
        <div className={styles.reelBackdropOverlay} />

        {/* Top Badges: Tag & Likes */}
        <div className={styles.reelTopBadges}>
          <span className={styles.reelBadge}>{reel.tag || reel.label}</span>
          {reel.likes && (
            <span className={styles.reelLikesBadge}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              {reel.likes}
            </span>
          )}
        </div>

        {/* Centered Play Accent */}
        <div className={styles.reelPlayBtn} aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>

        {/* Bottom Editorial Content */}
        <div className={styles.reelTitleOverlay}>
          {reel.client && <div className={styles.reelClient}>{reel.client}</div>}
          <div className={styles.reelTitleText}>{reel.title}</div>
          <div className={styles.reelInstaHint}>
            <span>WATCH REEL</span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   REEL GALLERY (Video Production — Official Reels)
   Infinite Seamless Marquee Glide + Drag/Touch + Stepper Arrows
───────────────────────────────────────── */
interface ReelGalleryProps {
  reels: ReelEntry[];
  visible: boolean;
  isMobile?: boolean;
}

const ReelGallery: React.FC<ReelGalleryProps> = ({ reels, visible, isMobile = false }) => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const isInteracting = useRef(false);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Drag tracking
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  const dragDistance = useRef(0);

  // Tripled reels for seamless infinite wrapping
  const repeatedReels = useMemo(() => [...reels, ...reels, ...reels], [reels]);

  // Set initial scroll position to 1 set width so backward scroll works immediately
  useEffect(() => {
    if (viewportRef.current && trackRef.current) {
      const singleSetWidth = trackRef.current.scrollWidth / 3;
      if (singleSetWidth > 0 && viewportRef.current.scrollLeft === 0) {
        viewportRef.current.scrollLeft = singleSetWidth;
      }
    }
  }, [reels]);

  // Continuous infinite glide
  useEffect(() => {
    if (!visible) return;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    let animId: number;
    // Brisk cinematic speed as requested by user
    const speed = isMobile ? 1.2 : 1.45;

    const glide = () => {
      if (!isInteracting.current && viewportRef.current && trackRef.current) {
        const vp = viewportRef.current;
        const tr = trackRef.current;
        const singleSetWidth = tr.scrollWidth / 3;

        if (singleSetWidth > 10) {
          vp.scrollLeft += speed;
          if (vp.scrollLeft >= singleSetWidth * 2) {
            vp.scrollLeft -= singleSetWidth;
          } else if (vp.scrollLeft <= 0) {
            vp.scrollLeft += singleSetWidth;
          }
        }
      }
      animId = requestAnimationFrame(glide);
    };

    animId = requestAnimationFrame(glide);
    return () => cancelAnimationFrame(animId);
  }, [visible, isMobile]);

  const pauseInteraction = useCallback(() => {
    isInteracting.current = true;
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = null;
    }
  }, []);

  const resumeInteractionDelayed = useCallback((delayMs = 1800) => {
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }
    resumeTimeoutRef.current = setTimeout(() => {
      isInteracting.current = false;
    }, delayMs);
  }, []);

  // Stepper arrow buttons
  const handleScrollPrev = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      pauseInteraction();
      if (viewportRef.current) {
        viewportRef.current.scrollBy({ left: isMobile ? -220 : -320, behavior: 'smooth' });
      }
      resumeInteractionDelayed(2400);
    },
    [isMobile, pauseInteraction, resumeInteractionDelayed]
  );

  const handleScrollNext = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      pauseInteraction();
      if (viewportRef.current) {
        viewportRef.current.scrollBy({ left: isMobile ? 220 : 320, behavior: 'smooth' });
      }
      resumeInteractionDelayed(2400);
    },
    [isMobile, pauseInteraction, resumeInteractionDelayed]
  );

  // Mobile Touch Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    pauseInteraction();
    isDragging.current = true;
    startX.current = e.touches[0].clientX;
    dragDistance.current = 0;
    if (viewportRef.current) {
      scrollLeftStart.current = viewportRef.current.scrollLeft;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current || !viewportRef.current) return;
    const currentX = e.touches[0].clientX;
    const deltaX = currentX - startX.current;
    dragDistance.current = Math.abs(deltaX);
    viewportRef.current.scrollLeft = scrollLeftStart.current - deltaX;
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
    resumeInteractionDelayed(2000);
  };

  // Desktop Pointer / Mouse Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    pauseInteraction();
    isDragging.current = true;
    startX.current = e.clientX;
    dragDistance.current = 0;
    if (viewportRef.current) {
      scrollLeftStart.current = viewportRef.current.scrollLeft;
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !viewportRef.current) return;
    const currentX = e.clientX;
    const deltaX = currentX - startX.current;
    dragDistance.current = Math.abs(deltaX);
    viewportRef.current.scrollLeft = scrollLeftStart.current - deltaX;
  };

  const handleMouseUp = () => {
    if (isDragging.current) {
      isDragging.current = false;
      resumeInteractionDelayed(2000);
    }
  };

  const handleReelClick = useCallback((reel: ReelEntry) => {
    if (dragDistance.current < 8 && reel.externalUrl) {
      window.open(reel.externalUrl, '_blank', 'noopener,noreferrer');
    }
  }, []);

  return (
    <div className={styles.reelGalleryOuter}>
      {/* Mobile / Compact Reel Header Indicator */}
      {isMobile && (
        <div className={styles.reelHeader}>
          <span className={styles.reelHeaderCount}>{reels.length} MOTION REELS</span>
          <span className={styles.reelHeaderHint}>&lsaquo; SWIPE OR TAP ARROWS &rsaquo;</span>
        </div>
      )}

      {/* Floating Stepper Navigation Buttons */}
      <button
        type="button"
        className={`${styles.reelNavBtn} ${styles.reelNavPrev}`}
        onClick={handleScrollPrev}
        aria-label="Previous Reel"
      >
        &#8249;
      </button>

      <button
        type="button"
        className={`${styles.reelNavBtn} ${styles.reelNavNext}`}
        onClick={handleScrollNext}
        aria-label="Next Reel"
      >
        &#8250;
      </button>

      <div
        ref={viewportRef}
        className={styles.reelGalleryViewport}
        onMouseEnter={pauseInteraction}
        onMouseLeave={() => resumeInteractionDelayed(1000)}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div ref={trackRef} className={styles.reelTrack}>
          {repeatedReels.map((reel, index) => (
            <div
              key={`${reel.id}-${index}`}
              className={`${styles.reelCardWrapper} ${
                reel.aspectRatio === '16:9' ? styles.landscapeWrapper : styles.portraitWrapper
              }`}
            >
              <ReelCard reel={reel} onCardClick={handleReelClick} />
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
        end: '+=110%', // Smooth, natural scroll distance
        pin: section,
        pinSpacing: true,
        anticipatePin: 1,
        scrub: 0.4, // Responsive scrub without heavy drag
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const progress = self.progress;
          const idx = Math.min(Math.floor(progress * SERVICES_DATA.length), SERVICES_DATA.length - 1);
          setActiveIndex(idx);

          // Progress bar
          if (progressBarRef.current) {
            const barWidth = Math.max(12.5, progress * 100);
            progressBarRef.current.style.width = `${barWidth}%`;
          }
        },
      });

      return () => {
        trigger.kill();
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
                const isVideoProd = srv.id === 'video-prod' && srv.reels;

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
                      /* Service 05: Video Production — Simplified, Reel-focused */
                      <div className={styles.mediaPanel}>
                        <div className={styles.mediaPanelHeader}>
                          <div className={styles.mediaPanelTitleGroup}>
                            <span className={styles.cardNumber}>SERVICE {srv.number}</span>
                            <h3 className={styles.mediaTitle}>{srv.name}</h3>
                          </div>
                          <Link to={`/services/${srv.slug}`} className={styles.exploreLink}>
                            EXPLORE FULL SERVICE &rarr;
                          </Link>
                        </div>

                        {/* 10-Reel Horizontal Gallery */}
                        <ReelGallery reels={srv.reels!} visible={isCurrent} />
                      </div>
                    ) : (
                      /* Standard Services 01-04, 06-08: Split Layout (Text + Bespoke Visual) */
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

                        {/* Visual Stage */}
                        <div className={styles.cardVisualCol}>
                          {srv.visualComponent}
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
                const isVideoProd = srv.id === 'video-prod' && srv.reels;
                return (
                  <article
                    key={srv.id}
                    id={`mobile-service-${idx}`}
                    ref={(el) => {
                      mobileCardsRef.current[idx] = el;
                    }}
                    className={`${styles.mobileCard} ${
                      isVideoProd ? styles.mobileCardVideoProd : ''
                    }`}
                  >
                    <div className={styles.mobileCardHeader}>
                      <span className={styles.mobileCardNumber}>
                        SERVICE {srv.number} / 08
                      </span>
                      <h3 className={styles.mobileCardTitle}>{srv.name}</h3>
                      <p className={styles.mobileCardDescription}>{srv.description}</p>
                    </div>

                    {/* Visual Showcase */}
                    <div className={styles.mobileCardVisualContainer}>
                      {isVideoProd ? (
                        <ReelGallery reels={srv.reels!} visible={true} isMobile={true} />
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
