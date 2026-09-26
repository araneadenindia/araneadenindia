import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import adLogo from '../../assets/AD Transparent SVG.svg';
import styles from './LaunchPage.module.css';

/**
 * LaunchPage — Spartan / Minimal Cinematic Launch Portal
 * Philosophy: LESS IS MORE.
 * 
 * 1. Deep charcoal background (#0B0B0E).
 * 2. Subtle ambient red glow & faint architectural web background.
 * 3. Official Aranea Den logo centered.
 * 4. Crisp typography: ARANEA DEN // WE WEAVE DIGITAL EXPERIENCES.
 * 5. Minimal button: ENTER EXPERIENCE →
 */
export const LaunchPage: React.FC = () => {
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const webSvgRef = useRef<SVGSVGElement>(null);
  const ambientGlowRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const textGroupRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  // Dual Curtain Refs
  const curtainLeftRef = useRef<HTMLDivElement>(null);
  const curtainRightRef = useRef<HTMLDivElement>(null);
  const curtainSeamRef = useRef<HTMLDivElement>(null);
  const curtainSealRef = useRef<HTMLDivElement>(null);

  // ── 1. Subtle, Calm Micro-Dust Particles ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const onResize = () => {
      if (!canvas) return;
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize, { passive: true });

    // Only 18 gentle micro-dust particles
    const particles = Array.from({ length: 18 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.0 + 0.4,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      alpha: Math.random() * 0.25 + 0.1,
    }));

    const loop = () => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  // ── 2. Cinematic Curtain Opening Sequence on Load ──
  useEffect(() => {
    document.title = 'ARANEA DEN — Studio Launch Portal';

    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(
          [webSvgRef.current, ambientGlowRef.current, logoRef.current, textGroupRef.current, buttonRef.current],
          { opacity: 1, y: 0, scale: 1 }
        );
        gsap.set(curtainLeftRef.current, { xPercent: -100 });
        gsap.set(curtainRightRef.current, { xPercent: 100 });
        gsap.set([curtainSeamRef.current, curtainSealRef.current], { opacity: 0 });
        return;
      }

      // Initial Curtain Closed State
      gsap.set(curtainLeftRef.current, { xPercent: 0 });
      gsap.set(curtainRightRef.current, { xPercent: 0 });
      gsap.set([curtainSeamRef.current, curtainSealRef.current], { opacity: 1, scale: 1 });

      const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' } });

      // Step 1: Laser Seam Pulse (0.35s beat)
      tl.to(
        curtainSeamRef.current,
        {
          boxShadow: '0 0 24px rgba(223, 37, 49, 1), 0 0 48px rgba(223, 37, 49, 0.7)',
          duration: 0.35,
          yoyo: true,
          repeat: 1,
        },
        0.05
      );

      // Step 2: Seal and laser seam fade out as curtains part
      tl.to(
        [curtainSealRef.current, curtainSeamRef.current],
        {
          opacity: 0,
          scale: 0.88,
          duration: 0.45,
          ease: 'power2.in',
        },
        0.35
      );

      // Step 3: Dual Curtains majestically slide open!
      tl.to(
        curtainLeftRef.current,
        {
          xPercent: -100,
          duration: 1.3,
          ease: 'power3.inOut',
        },
        0.45
      );

      tl.to(
        curtainRightRef.current,
        {
          xPercent: 100,
          duration: 1.3,
          ease: 'power3.inOut',
        },
        0.45
      );

      // Step 4: Web and ambient glow reveal as curtains part
      tl.fromTo(
        [webSvgRef.current, ambientGlowRef.current],
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1.1,
          ease: 'power2.out',
        },
        0.75
      );

      // Step 5: Official logo reveals with scale ease
      tl.fromTo(
        logoRef.current,
        { opacity: 0, scale: 0.94 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.95,
          ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
        },
        0.95
      );

      // Step 6: Typography reveals
      tl.fromTo(
        textGroupRef.current,
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: 'power3.out',
        },
        1.15
      );

      // Step 7: Enter Experience button reveals
      tl.fromTo(
        buttonRef.current,
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          ease: 'power3.out',
        },
        1.35
      );
    }, container);

    return () => ctx.revert();
  }, []);

  // ── 3. Cinematic Curtain Launch Transition to Homepage (/) ──
  const handleEnterExperience = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    const left = curtainLeftRef.current;
    const right = curtainRightRef.current;
    const seam = curtainSeamRef.current;
    const content = containerRef.current?.querySelector(`.${styles.centerComposition}`);
    const web = webSvgRef.current;

    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem('aranea_curtain_launch', 'true');
        navigate('/', { state: { fromCurtainLaunch: true } });
      },
    });

    // Content gently contracts
    if (content) {
      tl.to(
        content,
        {
          opacity: 0.2,
          scale: 0.94,
          y: -8,
          duration: 0.5,
          ease: 'power2.in',
        },
        0
      );
    }

    // Web lines flash crimson
    if (web) {
      tl.to(
        web,
        {
          opacity: 0.75,
          filter: 'drop-shadow(0 0 16px rgba(223, 37, 49, 0.85))',
          duration: 0.45,
        },
        0
      );
    }

    // Dual Curtains sweep inward to close at center!
    if (left && right) {
      tl.to(
        left,
        {
          xPercent: 0,
          duration: 0.75,
          ease: 'power3.inOut',
        },
        0.1
      );

      tl.to(
        right,
        {
          xPercent: 0,
          duration: 0.75,
          ease: 'power3.inOut',
        },
        0.1
      );
    }

    // Seam flashes brilliant laser burst when curtains meet
    if (seam) {
      tl.fromTo(
        seam,
        { opacity: 0, scaleY: 0.2 },
        {
          opacity: 1,
          scaleY: 1,
          duration: 0.25,
          ease: 'power2.out',
        },
        0.7
      );
    }
  }, [isTransitioning, navigate]);

  return (
    <main ref={containerRef} className={styles.launchContainer} aria-label="Aranea Den Cinematic Launch Screen">
      {/* Calm Micro-Dust Canvas */}
      <canvas ref={canvasRef} className={styles.particleCanvas} aria-hidden="true" />

      {/* Subtle Red Ambient Glow Behind Logo */}
      <div ref={ambientGlowRef} className={styles.ambientGlow} aria-hidden="true" />

      {/* Faint Architectural Spider-Web Pattern */}
      <svg
        ref={webSvgRef}
        viewBox="0 0 800 800"
        className={styles.webBackground}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Concentric Subtle Rings */}
        <ellipse cx="400" cy="400" rx="100" ry="100" className={styles.webRing} />
        <ellipse cx="400" cy="400" rx="200" ry="200" className={styles.webRing} />
        <ellipse cx="400" cy="400" rx="310" ry="310" className={styles.webRing} />

        {/* Faint Radiating Strands */}
        <line x1="400" y1="400" x2="400" y2="40" className={styles.webPath} />
        <line x1="400" y1="400" x2="655" y2="145" className={styles.webPath} />
        <line x1="400" y1="400" x2="760" y2="400" className={styles.webPath} />
        <line x1="400" y1="400" x2="655" y2="655" className={styles.webPath} />
        <line x1="400" y1="400" x2="400" y2="760" className={styles.webPath} />
        <line x1="400" y1="400" x2="145" y2="655" className={styles.webPath} />
        <line x1="400" y1="400" x2="40" y2="400" className={styles.webPath} />
        <line x1="400" y1="400" x2="145" y2="145" className={styles.webPath} />
      </svg>

      {/* ── Central Vertically-Centered Composition ── */}
      <div className={styles.centerComposition}>
        {/* 1. Official ARANEA DEN Logo */}
        <div ref={logoRef} className={styles.logoWrap}>
          <img
            src={adLogo}
            alt="Aranea Den"
            className={styles.officialLogo}
            draggable={false}
          />
        </div>

        {/* 2. Brand Name & Tagline */}
        <div ref={textGroupRef} className={styles.textGroup}>
          <h1 className={styles.brandHeading}>ARANEA DEN</h1>
          <p className={styles.tagline}>WE WEAVE DIGITAL EXPERIENCES.</p>
        </div>

        {/* 3. Enter Experience Button */}
        <div ref={buttonRef} className={styles.buttonWrap}>
          <button
            onClick={handleEnterExperience}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleEnterExperience();
              }
            }}
            className={styles.enterButton}
            aria-label="Enter Experience"
            disabled={isTransitioning}
          >
            <span>ENTER EXPERIENCE</span>
            <span className={styles.arrow} aria-hidden="true">&rarr;</span>
          </button>
        </div>
      </div>

      {/* ── Dual Cinematic Curtains ── */}
      <div className={styles.curtainContainer} aria-hidden="true">
        {/* Left Curtain Panel */}
        <div ref={curtainLeftRef} className={styles.curtainLeft}>
          <div className={styles.curtainTexture} />
          <div className={styles.curtainRib} />
        </div>

        {/* Right Curtain Panel */}
        <div ref={curtainRightRef} className={styles.curtainRight}>
          <div className={styles.curtainTexture} />
          <div className={styles.curtainRib} />
        </div>

        {/* Center Crimson Seam / Laser Thread */}
        <div ref={curtainSeamRef} className={styles.curtainSeam} />

        {/* Center Monogram Seal on Seam */}
        <div ref={curtainSealRef} className={styles.curtainSeal}>
          <img src={adLogo} alt="" className={styles.sealLogo} />
        </div>
      </div>
    </main>
  );
};

export default LaunchPage;
