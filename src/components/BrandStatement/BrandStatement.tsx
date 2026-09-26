import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './BrandStatement.module.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * Our Passion — World-Class Editorial Creative Studio Scene
 * Philosophy: LESS IS MORE, BUT LESS DOES NOT MEAN EMPTY.
 * - Deep-black obsidian atmosphere with living atmospheric warmth
 * - Asymmetric, layered editorial composition (not a basic centered block)
 * - Sequenced masked typography: WE CRAFT / DIGITAL / EXPERIENCES.
 * - Restrained crimson luminescence and specular brand seal (AD Transparent SVG.svg)
 * - Multi-plane scroll-driven parallax depth
 */
export const BrandStatement: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const ambientGlowRef = useRef<HTMLDivElement>(null);
  const ambientGlowSecRef = useRef<HTMLDivElement>(null);
  const chapterBarRef = useRef<HTMLDivElement>(null);
  const headlineWrapRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const line3Ref = useRef<HTMLSpanElement>(null);
  const narrativeColRef = useRef<HTMLDivElement>(null);
  const logoWrapRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLParagraphElement>(null);
  const metaBadgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Respect reduced motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // 1. Initial State for Masked Entrance Reveal
      gsap.set([line1Ref.current, line2Ref.current, line3Ref.current], {
        yPercent: 115,
        opacity: 0,
      });

      gsap.set(chapterBarRef.current, {
        opacity: 0,
        y: -18,
      });

      gsap.set(logoWrapRef.current, {
        opacity: 0,
        scale: 0.94,
        y: 16,
      });

      gsap.set(dividerRef.current, {
        scaleX: 0,
        transformOrigin: 'left center',
      });

      gsap.set([copyRef.current, metaBadgeRef.current], {
        opacity: 0,
        y: 20,
      });

      // 2. Choreographed Entrance Reveal Timeline
      const revealTl = gsap.timeline({
        scrollTrigger: {
          id: 'passion-cinematic-reveal',
          trigger: section,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      });

      revealTl
        // Step A: Chapter header slides into place
        .to(chapterBarRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
        })
        // Step B: Masked headline lines rise up with film-grade stagger
        .to(
          [line1Ref.current, line2Ref.current, line3Ref.current],
          {
            yPercent: 0,
            opacity: 1,
            duration: 1.05,
            stagger: 0.14,
            ease: 'power4.out',
          },
          '-=0.55'
        )
        // Step C: Logo seal reveals with specular soft focus
        .to(
          logoWrapRef.current,
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
          },
          '-=0.75'
        )
        // Step D: Glowing hairline divider draws across
        .to(
          dividerRef.current,
          {
            scaleX: 1,
            duration: 0.85,
            ease: 'power2.out',
          },
          '-=0.6'
        )
        // Step E: Narrative copy & studio beacon badge fade in
        .to(
          [copyRef.current, metaBadgeRef.current],
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power3.out',
          },
          '-=0.65'
        );

      // 3. Multi-Plane Parallax Depth Scrub (Differential Movement)
      // Left headline & right column glide at distinct speeds as you scroll
      if (headlineWrapRef.current && narrativeColRef.current) {
        gsap.to(headlineWrapRef.current, {
          y: -40,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        });

        gsap.to(narrativeColRef.current, {
          y: 25,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.4,
          },
        });
      }

      // Subtle atmospheric glow drift
      if (ambientGlowRef.current) {
        gsap.to(ambientGlowRef.current, {
          yPercent: 20,
          scale: 1.1,
          opacity: 0.9,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="passion"
      className={styles.section}
      aria-label="Our Passion"
    >
      {/* Restrained subtle atmospheric crimson warmth */}
      <div ref={ambientGlowRef} className={styles.ambientGlow} aria-hidden="true" />
      <div ref={ambientGlowSecRef} className={styles.ambientGlowSecondary} aria-hidden="true" />

      <div ref={containerRef} className={styles.container}>
        {/* 1. Architectural Chapter Header Bar */}
        <div ref={chapterBarRef} className={styles.chapterBar}>
          <div className={styles.chapterLeft}>
            <span className={styles.chapterTitle}>OUR PASSION</span>
          </div>
          <div className={styles.chapterRight}>
            <span>2026</span>
          </div>
        </div>

        {/* 2. Asymmetric Dual-Plane Editorial Grid */}
        <div className={styles.editorialGrid}>
          {/* Left Plane: Sculptural Headline Monolith */}
          <div ref={headlineWrapRef} className={styles.headlineWrap}>
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
                alt="Aranea Den"
                className={styles.brandLogo}
                draggable={false}
              />
            </div>

            <div ref={dividerRef} className={styles.editorialDivider} aria-hidden="true" />

            <p ref={copyRef} className={styles.copy}>
              At Aranea Den, we believe that exceptional digital flagships are built
              from the convergence of strategic clarity, architectural precision,
              and cinematic craft.
            </p>

            <div ref={metaBadgeRef} className={styles.metaBadge}>
              <span className={styles.metaPulseDot} aria-hidden="true" />
              <span className={styles.metaBadgeText}>STUDIO ETHOS // IMMERSIVE WEB</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandStatement;

