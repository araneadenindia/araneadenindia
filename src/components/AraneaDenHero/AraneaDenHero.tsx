import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
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
      const initialPad = mobile ? 12 : 20;
      const initialRadius = mobile ? 18 : 24;

      // ── Initial State Calibration ──
      gsap.set(wrapper, {
        paddingTop: initialPad,
        paddingBottom: initialPad,
        paddingLeft: mobile ? initialPad : 24,
        paddingRight: mobile ? initialPad : 24,
        backgroundColor: '#F8F8F5',
      });

      gsap.set(card, {
        borderRadius: initialRadius,
        height: mobile ? 'calc(100dvh - 24px)' : 'calc(100dvh - 40px)',
        boxShadow: '0 12px 48px rgba(0, 0, 0, 0.14)',
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

      // 1. Collapse frame padding
      tl.to(
        wrapper,
        {
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0,
          backgroundColor: '#070708',
          ease: 'power1.inOut',
          duration: 0.35,
        },
        0
      );

      // 2. Expand card container to full viewport
      tl.to(
        card,
        {
          height: '100vh',
          borderRadius: 0,
          boxShadow: '0 0 0 rgba(0, 0, 0, 0)',
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
          opacity: 0.12,
          filter: 'brightness(0.65) contrast(1.05) saturate(1.1) blur(6px)',
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

  // Video source: 9:16 portrait on mobile, 16:9 landscape on desktop
  const videoSrc = isMobile ? '/9.16 Ratio Vid Final.mp4' : '/16.9 Ratio Vid FINAL.mp4';

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
          <video
            ref={videoRef}
            key={videoSrc}
            className={styles.heroVideo}
            src={videoSrc}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
          />
          <div className={styles.videoGlow} />
        </div>

        {/* 2. Initial Hero Content Overlay (Bottom Narrative & CTA) */}
        <div ref={initialOverlayRef} className={styles.heroInitialOverlay}>
          <div className={styles.bottomBar}>
            <div>
              <p className={styles.narrative} style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                We Weave Your Digital Excellence.
              </p>
              <p className={styles.narrative} style={{ marginTop: '0.4rem', fontSize: '0.9rem', opacity: 0.8 }}>
                Crafted to help your brand move, stand out, and grow online.
              </p>
            </div>
            <a
              href="#passion"
              className={styles.ctaButton}
              onClick={handleExploreClick}
              aria-label="Explore Our Passion section"
            >
              EXPLORE &darr;
            </a>
          </div>
        </div>

        {/* 3. OUR PASSION Master Stage Overlay */}
        <div ref={passionStageRef} id="passion" className={styles.passionStage} aria-label="Our Passion">
          <div className={styles.ambientGlow} aria-hidden="true" />

          <div className={styles.passionContainer}>
            {/* Chapter Header Bar */}
            <div ref={chapterBarRef} className={styles.chapterBar}>
              <div className={styles.chapterLeft}>
                <span className={styles.chapterTitle}>OUR PASSION</span>
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

                <p ref={copyRef} className={styles.copy}>
                  At Aranea Den, we reject the disposable nature of modern web design.
                  We view digital flagships as architectural monuments — engineered with
                  structural precision, cinematic resonance, and profound aesthetic intent.
                  Every interface is sculpted to captivate, endure, and elevate your brand above the noise.
                </p>
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
