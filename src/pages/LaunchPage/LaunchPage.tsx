import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import adLogo from '../../assets/AD Transparent SVG.svg';
import styles from './LaunchPage.module.css';

/**
 * LaunchPage — Standalone Cinematic Studio Launch Experience
 * Inspired by Camille Mormal (https://camillemormal.com/)
 * 
 * SEQUENCE:
 * 1. Deep dark canvas with delicate floating micro-particles.
 * 2. Fine red silk strands progressively weave an architectural spider web.
 * 3. Minimalist spider crest emerges along the thread into the center.
 * 4. Official Aranea Den brandmark reveals with refined opacity & scale.
 * 5. Typographic statement: ARANEA DEN // WE WEAVE DIGITAL EXPERIENCES.
 * 6. Interactive [ ENTER EXPERIENCE ↗ ] with web aperture launch transition.
 */
export const LaunchPage: React.FC = () => {
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const webSvgRef = useRef<SVGSVGElement>(null);
  const ambientGlowRef = useRef<HTMLDivElement>(null);
  const spiderRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const textLockupRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const irisRef = useRef<HTMLDivElement>(null);

  // ── 1. Subtle Floating Micro-Particles Canvas ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // Generate 28 restrained, subtle micro-dust particles
    const particleCount = 28;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.22,
      speedY: (Math.random() - 0.5) * 0.22,
      opacity: Math.random() * 0.35 + 0.15,
      hue: Math.random() > 0.4 ? 'rgba(255, 255, 255,' : 'rgba(223, 37, 49,',
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap edges smoothly
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.hue} ${p.opacity})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // ── 2. Cinematic Startup GSAP Choreography ──
  useEffect(() => {
    document.title = 'ARANEA DEN — Studio Launch Portal';

    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        // Instant graceful presentation for reduced motion
        gsap.set(
          [ambientGlowRef.current, spiderRef.current, logoRef.current, textLockupRef.current, ctaRef.current],
          { opacity: 1, y: 0, scale: 1 }
        );
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // 1. Initial State
      gsap.set(ambientGlowRef.current, { opacity: 0, scale: 0.8 });
      gsap.set(spiderRef.current, { opacity: 0, y: -40, scale: 0.7 });
      gsap.set(logoRef.current, { opacity: 0, scale: 0.92 });
      gsap.set(textLockupRef.current, { opacity: 0, y: 16 });
      gsap.set(ctaRef.current, { opacity: 0, y: 14 });

      // 2. Web Strands Draw-in (strokeDashoffset animation)
      const strands = container.querySelectorAll(`.${styles.webStrand}`);
      const rings = container.querySelectorAll(`.${styles.webRing}`);
      if (strands.length > 0) {
        tl.fromTo(
          strands,
          { strokeDashoffset: 500, opacity: 0 },
          { strokeDashoffset: 0, opacity: 1, duration: 1.6, stagger: 0.05, ease: 'power2.inOut' },
          0.2
        );
      }
      if (rings.length > 0) {
        tl.fromTo(
          rings,
          { strokeDashoffset: 600, opacity: 0 },
          { strokeDashoffset: 0, opacity: 1, duration: 1.8, stagger: 0.08, ease: 'power2.inOut' },
          0.5
        );
      }

      // 3. Central Ambient Crimson Glow fades in
      tl.to(
        ambientGlowRef.current,
        {
          opacity: 1,
          scale: 1,
          duration: 1.8,
          ease: 'power2.out',
        },
        0.8
      );

      // 4. Subtle Spider Descent along the silk strand into center
      tl.to(
        spiderRef.current,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
        },
        1.1
      );

      // 5. Official Logo Reveals
      tl.to(
        logoRef.current,
        {
          opacity: 1,
          scale: 1,
          duration: 1.1,
          ease: 'power3.out',
        },
        1.5
      );

      // 6. Typographic Statement Appears
      tl.to(
        textLockupRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
        },
        1.9
      );

      // 7. [ ENTER EXPERIENCE ↗ ] Button Fades into View
      tl.to(
        ctaRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
        },
        2.2
      );
    }, container);

    return () => ctx.revert();
  }, []);

  // ── 3. Launch Transition on Click or Keyboard Activation ──
  const handleEnterExperience = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    const curtain = curtainRef.current;
    const iris = irisRef.current;
    const webSvg = webSvgRef.current;
    const centerContent = logoRef.current?.parentElement;

    const tl = gsap.timeline({
      onComplete: () => {
        // Seamlessly navigate to existing homepage
        navigate('/');
      },
    });

    // 1. Content and logo gently lift and dissolve
    if (centerContent) {
      tl.to(centerContent, {
        opacity: 0,
        scale: 1.05,
        duration: 0.45,
        ease: 'power2.in',
      });
    }

    // 2. Silk Web expands outward dynamically
    if (webSvg) {
      tl.to(
        webSvg,
        {
          scale: 2.8,
          opacity: 0,
          duration: 0.85,
          ease: 'power3.in',
        },
        0.1
      );
    }

    // 3. Expanding Crimson Iris / Aperture Mask
    if (curtain && iris) {
      tl.to(
        curtain,
        {
          opacity: 1,
          duration: 0.3,
          ease: 'power2.in',
        },
        0.2
      );

      tl.fromTo(
        iris,
        { scale: 0, opacity: 1 },
        {
          scale: 1.8,
          opacity: 0.85,
          duration: 0.9,
          ease: 'cubic-bezier(0.25, 1, 0.5, 1)',
        },
        0.25
      );
    }
  }, [isTransitioning, navigate]);

  return (
    <main ref={containerRef} className={styles.launchContainer} aria-label="Aranea Den Cinematic Launch Screen">
      {/* ── Floating Micro-Dust Particle Canvas ── */}
      <canvas ref={canvasRef} className={styles.particleCanvas} aria-hidden="true" />

      {/* ── Ambient Crimson Center Back-Glow ── */}
      <div ref={ambientGlowRef} className={styles.ambientCenterGlow} aria-hidden="true" />

      {/* ── Symmetrical Architectural Spider Web Canvas ── */}
      <svg
        ref={webSvgRef}
        viewBox="0 0 1000 1000"
        className={styles.webSvgStage}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Concentric Polygonal & Arched Web Rings */}
        <ellipse cx="500" cy="500" rx="90" ry="90" className={styles.webRing} strokeDasharray="600" />
        <ellipse cx="500" cy="500" rx="180" ry="180" className={styles.webRing} strokeDasharray="1200" />
        <ellipse cx="500" cy="500" rx="280" ry="280" className={styles.webRing} strokeDasharray="1800" />
        <ellipse cx="500" cy="500" rx="390" ry="390" className={styles.webRing} strokeDasharray="2500" />
        <ellipse cx="500" cy="500" rx="490" ry="490" className={styles.webRing} strokeDasharray="3100" />

        {/* 12 Radiating Fine Red Silk Strands */}
        <line x1="500" y1="500" x2="500" y2="10" className={styles.webStrand} strokeDasharray="500" />
        <line x1="500" y1="500" x2="745" y2="75" className={styles.webStrand} strokeDasharray="500" />
        <line x1="500" y1="500" x2="925" y2="255" className={styles.webStrand} strokeDasharray="500" />
        <line x1="500" y1="500" x2="990" y2="500" className={styles.webStrand} strokeDasharray="500" />
        <line x1="500" y1="500" x2="925" y2="745" className={styles.webStrand} strokeDasharray="500" />
        <line x1="500" y1="500" x2="745" y2="925" className={styles.webStrand} strokeDasharray="500" />
        <line x1="500" y1="500" x2="500" y2="990" className={styles.webStrand} strokeDasharray="500" />
        <line x1="500" y1="500" x2="255" y2="925" className={styles.webStrand} strokeDasharray="500" />
        <line x1="500" y1="500" x2="75" y2="745" className={styles.webStrand} strokeDasharray="500" />
        <line x1="500" y1="500" x2="10" y2="500" className={styles.webStrand} strokeDasharray="500" />
        <line x1="500" y1="500" x2="75" y2="255" className={styles.webStrand} strokeDasharray="500" />
        <line x1="500" y1="500" x2="255" y2="75" className={styles.webStrand} strokeDasharray="500" />

        {/* Delicate Intersection Micro-Nodes */}
        <circle cx="500" cy="410" r="2.2" className={styles.webIntersectionDot} />
        <circle cx="500" cy="320" r="2.2" className={styles.webIntersectionDot} />
        <circle cx="500" cy="220" r="2.2" className={styles.webIntersectionDot} />
        <circle cx="500" cy="590" r="2.2" className={styles.webIntersectionDot} />
        <circle cx="500" cy="680" r="2.2" className={styles.webIntersectionDot} />
        <circle cx="500" cy="780" r="2.2" className={styles.webIntersectionDot} />
        <circle cx="590" cy="500" r="2.2" className={styles.webIntersectionDot} />
        <circle cx="680" cy="500" r="2.2" className={styles.webIntersectionDot} />
        <circle cx="410" cy="500" r="2.2" className={styles.webIntersectionDot} />
        <circle cx="320" cy="500" r="2.2" className={styles.webIntersectionDot} />
      </svg>

      {/* ── Minimalist Emerging Spider Silhouette at Hub ── */}
      <div ref={spiderRef} className={styles.spiderSilhouetteWrap} aria-hidden="true">
        <svg viewBox="0 0 24 24" className={styles.spiderSvg}>
          <circle cx="12" cy="7" r="2.2" />
          <ellipse cx="12" cy="14" rx="3.2" ry="4.5" />
          <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 10.5 7 L 7 3.5 L 5 1.5" />
            <path d="M 13.5 7 L 17 3.5 L 19 1.5" />
            <path d="M 9.5 11 L 4.5 9 L 2.5 11.5" />
            <path d="M 14.5 11 L 19.5 9 L 21.5 11.5" />
            <path d="M 9.5 14 L 5 16 L 3.5 19.5" />
            <path d="M 14.5 14 L 19 16 L 20.5 19.5" />
            <path d="M 10.5 17 L 7.5 21 L 6.5 23" />
            <path d="M 13.5 17 L 16.5 21 L 17.5 23" />
          </g>
        </svg>
      </div>

      {/* ── Central Brand Showcase ── */}
      <div className={styles.centerContent}>
        {/* Official ARANEA DEN Brand Logo */}
        <div ref={logoRef} className={styles.logoWrap}>
          <div className={styles.logoAura} aria-hidden="true" />
          <img
            src={adLogo}
            alt="Aranea Den"
            className={styles.brandLogo}
            draggable={false}
          />
        </div>

        {/* Typographic Lockup */}
        <div ref={textLockupRef} className={styles.textLockup}>
          <h1 className={styles.brandName}>ARANEA DEN</h1>
          <p className={styles.tagline}>WE WEAVE DIGITAL EXPERIENCES</p>
        </div>

        {/* Minimalist Camille Mormal Style CTA */}
        <div ref={ctaRef} className={styles.ctaWrap}>
          <button
            onClick={handleEnterExperience}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleEnterExperience();
              }
            }}
            className={styles.enterButton}
            aria-label="Enter Aranea Den Experience"
            disabled={isTransitioning}
          >
            <span className={styles.btnBracket}>[</span>
            <span>ENTER EXPERIENCE</span>
            <span className={styles.btnArrow} aria-hidden="true">&nearr;</span>
            <span className={styles.btnBracket}>]</span>
          </button>
        </div>
      </div>

      {/* ── Launch Transition Curtain & Aperture Iris ── */}
      <div ref={curtainRef} className={styles.transitionCurtain} aria-hidden="true">
        <div ref={irisRef} className={styles.expandingIris} />
      </div>
    </main>
  );
};

export default LaunchPage;
