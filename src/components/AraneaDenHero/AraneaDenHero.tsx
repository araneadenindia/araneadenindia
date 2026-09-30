import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCms } from '../../cms/CmsContext';
import { EditableField } from '../../cms/components/EditableField/EditableField';
import { EditableMedia } from '../../cms/components/EditableMedia/EditableMedia';
import styles from './AraneaDenHero.module.css';

gsap.registerPlugin(ScrollTrigger);

interface AraneaDenHeroProps {
  isVisible?: boolean;
}

/**
 * AraneaDenHero — Master Cinematic Scroll & Transition System
 * 
 * Rebuilt from scratch into a unified, continuous cinematic flow:
 * 1. PRELOADER dissolves seamlessly into the ready-state framed hero card.
 * 2. FRAMED HERO VIDEO: Surrounded by intentional off-white canvas, sharp contrast,
 *    and no horizontal clipping on any mobile viewport (360px - 440px).
 * 3. FULLSCREEN EXPANSION: As the user scrolls, the surrounding off-white frame collapses,
 *    the wrapper background transitions into obsidian (#070708), and the video expands to 100vh.
 * 4. OUR PASSION REVEAL: Within the same continuous pinned viewport, the video softly recedes
 *    as the chapter bar, masked typography ("WE CRAFT DIGITAL EXPERIENCES."), the official brand seal
 *    (AD Transparent SVG.svg), and the philosophy narrative assemble with filmic precision.
 * 5. SEAMLESS UNPINNING: Smooth release directly into Scene 04 (What We Do) with zero layout cuts,
 *    zero white flashes, and flawless reverse scrubbing.
 */
export const AraneaDenHero: React.FC<AraneaDenHeroProps> = ({ isVisible = true }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const initialOverlayRef = useRef<HTMLDivElement>(null);

  // Passion Stage Refs
  const passionStageRef = useRef<HTMLDivElement>(null);
  const chapterBarRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const line3Ref = useRef<HTMLSpanElement>(null);
  const narrativeColRef = useRef<HTMLDivElement>(null);
  const logoWrapRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLParagraphElement>(null);

  // Automatically detect mobile viewport to load 9:16 portrait video
  const [isMobile, setIsMobile] = useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth <= 768 : false;
  });

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      if (mobile !== isMobile) {
        setIsMobile(mobile);
      }
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

  // Video autoplay
  useEffect(() => {
    if (!isVisible) return;
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {});
    }
  }, [isVisible, isMobile]);

  // Unified Cinematic Scroll-Driven Sequence
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const card = cardRef.current;
    const video = videoRef.current;
    const initialOverlay = initialOverlayRef.current;
    const passionStage = passionStageRef.current;
    const chapterBar = chapterBarRef.current;
    const line1 = line1Ref.current;
    const line2 = line2Ref.current;
    const line3 = line3Ref.current;
    const narrativeCol = narrativeColRef.current;
    const logoWrap = logoWrapRef.current;
    const divider = dividerRef.current;
    const copy = copyRef.current;

    if (!wrapper || !card || !video || !passionStage) return;

    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const mobile = window.innerWidth <= 768;

      // ── Initial State Calibration ──
      const initialClip = mobile ? 'inset(12px 12px round 18px)' : 'inset(20px 24px round 24px)';
      gsap.set(card, {
        clipPath: initialClip,
      });

      gsap.set(wrapper, {
        backgroundColor: '#F8F8F5',
      });

      gsap.set(video, {
        opacity: 1,
      });

      if (initialOverlay) {
        gsap.set(initialOverlay, {
          opacity: 1,
          y: 0,
        });
      }

      gsap.set(passionStage, {
        opacity: 0,
      });

      if (chapterBar) {
        gsap.set(chapterBar, {
          opacity: 0,
          y: -16,
        });
      }

      gsap.set([line1, line2, line3], {
        yPercent: 110,
        opacity: 0,
      });

      if (logoWrap) {
        gsap.set(logoWrap, {
          opacity: 0,
          scale: 0.92,
          y: 16,
        });
      }

      if (divider) {
        gsap.set(divider, {
          scaleX: 0,
          transformOrigin: 'left center',
        });
      }

      if (copy) {
        gsap.set(copy, {
          opacity: 0,
          y: 18,
        });
      }

      // ── Master Pinned Scrub Timeline ──
      const tl = gsap.timeline({
        scrollTrigger: {
          id: 'hero-passion-flow',
          trigger: wrapper,
          start: 'top top',
          end: mobile ? '+=90%' : '+=110%', // Natural, responsive scroll pacing
          pin: true,
          pinSpacing: true,
          scrub: 0.5, // Fluid, immediate scrub response without lag or resistance
          invalidateOnRefresh: true,
        },
      });

      // ==========================================
      // PHASE 1: FRAMED VIDEO -> FULLSCREEN EXPANSION (0.00 -> 0.35)
      // ==========================================

      // 1. Expand card container to full viewport via GPU clip-path (Desktop only)
      if (!isMobile) {
        tl.to(
          card,
          {
            clipPath: 'inset(0px 0px round 0px)',
            ease: 'power1.inOut',
            duration: 0.35,
          },
          0
        );
      }

      // 2. Transition surrounding canvas to obsidian
      tl.to(
        wrapper,
        {
          backgroundColor: '#070708',
          ease: 'power1.inOut',
          duration: 0.35,
        },
        0
      );

      // 3. Fade out initial bottom narrative overlay early
      if (initialOverlay) {
        tl.to(
          initialOverlay,
          {
            opacity: 0,
            y: -24,
            ease: 'power2.in',
            duration: 0.22,
          },
          0
        );
      }

      // 4. Subtle camera push into the 3D brandmark
      tl.to(
        video,
        {
          scale: 1.05,
          ease: 'none',
          duration: 0.35,
        },
        0
      );

      // ==========================================
      // PHASE 2: CINEMATIC DISSOLVE & OUR PASSION REVEAL (0.35 -> 0.70)
      // ==========================================

      // 5. Video recedes into atmospheric backdrop
      tl.to(
        video,
        {
          opacity: 0.10,
          ease: 'power2.inOut',
          duration: 0.30,
        },
        0.35
      );

      // 6. Reveal Passion Stage
      tl.to(
        passionStage,
        {
          opacity: 1,
          ease: 'power2.inOut',
          duration: 0.25,
        },
        0.35
      );


      // 7. Chapter Bar slides in
      if (chapterBar) {
        tl.to(
          chapterBar,
          {
            opacity: 1,
            y: 0,
            ease: 'power3.out',
            duration: 0.20,
          },
          0.40
        );
      }

      // 8. Masked headline lines rise up
      tl.to(
        [line1, line2, line3],
        {
          yPercent: 0,
          opacity: 1,
          stagger: 0.08,
          ease: 'power3.out',
          duration: 0.28,
        },
        0.42
      );

      // ==========================================
      // PHASE 3: BRAND SEAL & NARRATIVE ARCHITECTURE
      // ==========================================

      // 6. Official Brand Seal reveals
      if (logoWrap) {
        tl.to(
          logoWrap,
          {
            opacity: 1,
            scale: 1,
            y: 0,
            ease: 'power3.out',
            duration: 0.20,
          },
          0.48
        );
      }

      // 7. Hairline divider draws across
      if (divider) {
        tl.to(
          divider,
          {
            scaleX: 1,
            ease: 'power2.out',
            duration: 0.18,
          },
          0.55
        );
      }

      // 8. Narrative copy fade in
      if (copy) {
        tl.to(
          copy,
          {
            opacity: 1,
            y: 0,
            ease: 'power3.out',
            duration: 0.20,
          },
          0.60
        );
      }

      // ==========================================
      // PHASE 4: REFINED SETTLE BEFORE UNPIN
      // ==========================================
      if (narrativeCol) {
        tl.to(
          narrativeCol,
          {
            y: -10,
            ease: 'none',
            duration: 0.15,
          },
          0.85
        );
      }
    }, wrapper);

    return () => ctx.revert();
  }, [isMobile]);

  const { activeContent } = useCms();
  const heroData = activeContent.home.hero;

  // Robust Video source & poster: 9:16 portrait on mobile, 16:9 landscape on desktop
  const mediaUrl = heroData?.media?.url;
  const isDefaultOrLocal =
    !mediaUrl ||
    mediaUrl === '/16.9 Ratio Vid FINAL.mp4' ||
    mediaUrl === '/Final Render 16.9.mp4' ||
    mediaUrl === '/Final Render 9.16.mp4' ||
    mediaUrl === '/9.16 Ratio Vid Final.mp4' ||
    mediaUrl === '/hero-16-9.mp4' ||
    mediaUrl === '/hero-9-16.mp4';

  const videoSrc = isDefaultOrLocal
    ? (isMobile ? '/hero-9-16.mp4' : '/hero-16-9.mp4')
    : mediaUrl;

  const posterUrl = heroData?.media?.posterUrl;
  const isDefaultPoster =
    !posterUrl ||
    posterUrl === '/Favicon.png' ||
    posterUrl === '/hero-poster-desktop.jpg' ||
    posterUrl === '/hero-poster-mobile.jpg';

  const posterSrc = isDefaultPoster
    ? (isMobile ? '/hero-poster-mobile.jpg' : '/hero-poster-desktop.jpg')
    : posterUrl;

  // Ensure robust programmatic autoplay across all modern browsers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    const attemptPlay = () => {
      video.muted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay policy handled safely; will resume on first user interaction
        });
      }
    };

    video.load();
    attemptPlay();
    video.addEventListener('loadeddata', attemptPlay);
    video.addEventListener('canplay', attemptPlay);

    return () => {
      video.removeEventListener('loadeddata', attemptPlay);
      video.removeEventListener('canplay', attemptPlay);
    };
  }, [videoSrc]);

  const handleExploreClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const st = ScrollTrigger.getById('hero-passion-flow');
    if (st) {
      // Smoothly navigate directly to the fully-assembled OUR PASSION composition
      const targetScroll = st.start + (st.end - st.start) * 0.78;
      if ((window as any).lenis) {
        (window as any).lenis.scrollTo(targetScroll, { duration: 1.1 });
      } else {
        window.scrollTo({ top: targetScroll, behavior: 'smooth' });
      }
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <div ref={wrapperRef} className={styles.heroWrapper}>
        <section ref={cardRef} className={styles.heroCard} aria-label="Aranea Den — Hero Video & Philosophy">
        {/* 1. Video Canvas Stage */}
        <div className={styles.videoStage} aria-hidden="true">
          <EditableMedia
            mediaPath="home.hero.media"
            mediaLabel="Hero Showcase Video"
            media={heroData.media}
            supportedTypes={['video', 'image']}
          >
            <video
              ref={videoRef}
              className={styles.heroVideo}
              src={videoSrc}
              poster={posterSrc}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              crossOrigin="anonymous"
            />
          </EditableMedia>
          <div className={styles.videoGlow} />
        </div>

        {/* 2. Initial Hero Content Overlay (Bottom Narrative & CTA) */}
        <div ref={initialOverlayRef} className={styles.heroInitialOverlay}>
          <div className={styles.bottomBar}>
            <div>
              <EditableField
                fieldPath="home.hero.headline1"
                fieldLabel="Hero Topline"
                value={heroData.headline1}
              >
                <p className={styles.narrative} style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                  {heroData.headline1 || 'We Weave Your Digital Excellence.'}
                </p>
              </EditableField>
              <EditableField
                fieldPath="home.hero.narrative"
                fieldLabel="Hero Subtitle"
                value={heroData.narrative}
              >
                <p className={styles.narrative} style={{ marginTop: '0.4rem', fontSize: '0.9rem', opacity: 0.8 }}>
                  {heroData.narrative || 'Crafted to help your brand move, stand out, and grow online.'}
                </p>
              </EditableField>
            </div>
            <EditableField
              fieldPath="home.hero.ctaLabel"
              fieldLabel="Explore Button Label"
              value={heroData.ctaLabel}
            >
              <a
                href={heroData.ctaUrl || '#passion'}
                className={styles.ctaButton}
                onClick={handleExploreClick}
                aria-label="Explore Our Passion section"
              >
                {heroData.ctaLabel || 'EXPLORE ↓'}
              </a>
            </EditableField>
          </div>
        </div>

        {/* 3. OUR PASSION Master Stage Overlay */}
        <div ref={passionStageRef} id="passion" className={styles.passionStage} aria-label="Our Passion">
          <div className={styles.ambientGlow} aria-hidden="true" />

          {/* Content Container */}
          <div className={styles.passionContainer}>
            {/* Chapter Header Bar */}
            <div ref={chapterBarRef} className={styles.chapterBar}>
              <div className={styles.chapterLeft}>
                <EditableField
                  fieldPath="home.hero.passionTitle"
                  fieldLabel="Passion Chapter Title"
                  value={heroData.passionTitle}
                >
                  <span className={styles.chapterTitle}>{heroData.passionTitle || 'OUR PASSION'}</span>
                </EditableField>
              </div>
              <div className={styles.chapterRight}>
                <span>2026</span>
              </div>
            </div>

            {/* Asymmetric Dual-Plane Editorial Grid */}
            <div className={styles.editorialGrid}>
              {/* Left Plane: Sculptural Display Headline */}
              <div className={styles.headlineWrap}>
                <h2 className={styles.headline}>
                  <span className={styles.lineMask}>
                    <span ref={line1Ref} className={styles.lineInner}>
                      WE WEAVE
                    </span>
                  </span>
                  <span className={`${styles.lineMask} ${styles.offsetLine}`}>
                    <span ref={line2Ref} className={`${styles.lineInner} ${styles.accentWord}`}>
                      YOUR DIGITAL
                    </span>
                  </span>
                  <span className={styles.lineMask}>
                    <span ref={line3Ref} className={styles.lineInner}>
                      EXCELLENCE.
                    </span>
                  </span>
                </h2>
              </div>

              {/* Right Plane: Brand Seal & Narrative Architecture */}
              <div ref={narrativeColRef} className={styles.narrativeCol}>
                <div ref={logoWrapRef} className={styles.logoWrap}>
                  <img
                    src="/AD Transparent SVG.svg"
                    alt="Aranea Den Brandmark"
                    className={styles.brandLogo}
                    draggable={false}
                  />
                </div>

                <div ref={dividerRef} className={styles.editorialDivider} aria-hidden="true" />

                <EditableField
                  fieldPath="home.hero.passionCopy"
                  fieldLabel="Our Passion Philosophy Narrative"
                  value={heroData.passionCopy}
                  isTextarea={true}
                  isBlock={true}
                >
                  <p ref={copyRef} className={styles.copy}>
                    {heroData.passionCopy ||
                      'At Aranea Den, we believe exceptional digital experiences should be accessible to everyone. We combine creativity, strategy, and technology to deliver high-quality digital solutions at affordable, transparent prices—empowering businesses of every size to build their presence, connect with their audiences, and grow with confidence.'}
                  </p>
                </EditableField>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
  );
};

export default AraneaDenHero;
