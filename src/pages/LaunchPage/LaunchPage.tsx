import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import adLogo from '../../assets/AD Transparent SVG.svg';
import styles from './LaunchPage.module.css';

const PLEATS_COUNT = 8;
const pleatIndices = Array.from({ length: PLEATS_COUNT }, (_, i) => i);

/**
 * LaunchPage — Spartan / Minimal Cinematic Launch Portal
 * Features:
 * - Lightweight cinematic 3D curtain preloader using CSS 3D transforms & GSAP
 * - Two elegant noir black 3D curtains with realistic accordion pleats opening from center (1–1.5s)
 * - Official AD Transparent SVG logo revealed with subtle crimson red glow
 * - Tiny red spider-dust particles drifting in deep black space
 * - Seamless transition into launch portal content (heading, tagline, enter button)
 * - Full preservation of existing launch page interaction & route transition
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

  // 3D Dual Curtain Refs
  const curtainLeftRef = useRef<HTMLDivElement>(null);
  const curtainRightRef = useRef<HTMLDivElement>(null);
  const curtainSeamRef = useRef<HTMLDivElement>(null);
  const curtainSealRef = useRef<HTMLDivElement>(null);

  // ── 1. Red Spider-Dust Particles (Canvas 2D, Lightweight & Cinematic) ──
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

    // Tiny amount of crimson spider-dust particles for premium cinematic touch
    const particles = Array.from({ length: 26 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.3 + 0.6,
      vx: (Math.random() - 0.5) * 0.22,
      vy: -Math.random() * 0.3 - 0.08, // gentle upward floating drift
      baseAlpha: Math.random() * 0.5 + 0.3,
      pulseSpeed: Math.random() * 0.025 + 0.015,
      phase: Math.random() * Math.PI * 2,
      color: Math.random() > 0.3 ? '#DF2531' : '#FF4D5A',
    }));

    const loop = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.shadowBlur = 8;
      ctx.shadowColor = 'rgba(223, 37, 49, 0.75)';

      particles.forEach((p) => {
        p.x += p.vx + Math.sin(p.phase) * 0.2;
        p.y += p.vy;
        p.phase += p.pulseSpeed;

        if (p.y < -10) {
          p.y = h + 10;
          p.x = Math.random() * w;
        }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;

        const currentAlpha = Math.max(
          0.1,
          Math.min(1, p.baseAlpha + Math.sin(p.phase) * 0.25)
        );

        ctx.globalAlpha = currentAlpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();
      animId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  // ── 2. Cinematic 3D Curtain Opening Sequence on Load ──
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
        gsap.set(curtainLeftRef.current, { xPercent: -105, scaleX: 0.65 });
        gsap.set(curtainRightRef.current, { xPercent: 105, scaleX: 0.65 });
        gsap.set([curtainSeamRef.current, curtainSealRef.current], { opacity: 0 });
        return;
      }

      // Initial Closed State: 3D Curtains shut at center
      gsap.set(curtainLeftRef.current, { xPercent: 0, scaleX: 1 });
      gsap.set(curtainRightRef.current, { xPercent: 0, scaleX: 1 });
      gsap.set(curtainSeamRef.current, { opacity: 1, scaleY: 1 });
      gsap.set(curtainSealRef.current, { opacity: 1, scale: 1 });

      // Official Logo is centered behind curtains, glowing subtly in red
      gsap.set(logoRef.current, { opacity: 0.9, scale: 0.95 });
      gsap.set(ambientGlowRef.current, { opacity: 0.6 });

      // Rest of the launch portal content hidden initially
      gsap.set([webSvgRef.current, textGroupRef.current, buttonRef.current], {
        opacity: 0,
        y: 16,
      });

      const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' } });

      // Step 1: Laser Seam Pulse (0.2s)
      tl.to(
        curtainSeamRef.current,
        {
          boxShadow: '0 0 28px rgba(223, 37, 49, 1), 0 0 54px rgba(223, 37, 49, 0.85)',
          duration: 0.25,
          yoyo: true,
          repeat: 1,
        },
        0.05
      );

      // Step 2: Center seal fades out as curtain parts
      tl.to(
        curtainSealRef.current,
        {
          opacity: 0,
          scale: 0.8,
          duration: 0.35,
          ease: 'power2.in',
        },
        0.2
      );

      tl.to(
        curtainSeamRef.current,
        {
          opacity: 0,
          scaleY: 0.4,
          duration: 0.35,
        },
        0.25
      );

      // Step 3: Two 3D curtains open smoothly from the center (~1.25s, completed within 1–1.5s)
      // Left curtain slides and folds in 3D perspective
      tl.to(
        curtainLeftRef.current,
        {
          xPercent: -105,
          scaleX: 0.65,
          duration: 1.25,
          ease: 'power3.inOut',
        },
        0.2
      );

      // Right curtain slides and folds in 3D perspective
      tl.to(
        curtainRightRef.current,
        {
          xPercent: 105,
          scaleX: 0.65,
          duration: 1.25,
          ease: 'power3.inOut',
        },
        0.2
      );

      // 3D pleat depth accentuation as curtains draw open
      const pleats = container.querySelectorAll(`.${styles.curtainPleat}`);
      if (pleats.length) {
        tl.to(
          pleats,
          {
            scaleX: 0.88,
            duration: 1.25,
            ease: 'power3.inOut',
          },
          0.2
        );
      }

      // Step 4: Reveal official logo with glowing red presence
      tl.to(
        logoRef.current,
        {
          opacity: 1,
          scale: 1,
          duration: 0.9,
          ease: 'power2.out',
        },
        0.6
      );

      tl.to(
        ambientGlowRef.current,
        {
          opacity: 1,
          duration: 1.0,
          ease: 'power2.out',
        },
        0.6
      );

      // Step 5: After curtains open and logo is briefly revealed, transition smoothly into existing launch page content
      tl.to(
        webSvgRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power2.out',
        },
        1.45
      );

      tl.to(
        textGroupRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: 'power3.out',
        },
        1.55
      );

      tl.to(
        buttonRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          ease: 'power3.out',
        },
        1.7
      );
    }, container);

    return () => ctx.revert();
  }, []);

  // ── 3. Cinematic 3D Curtain Launch Transition to Homepage (/) ──
  const handleEnterExperience = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    const left = curtainLeftRef.current;
    const right = curtainRightRef.current;
    const seam = curtainSeamRef.current;
    const content = containerRef.current?.querySelector(`.${styles.centerComposition}`);
    const web = webSvgRef.current;
    const container = containerRef.current;

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
          scale: 0.95,
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

    // Curtains sweep back to center in 3D
    if (left && right) {
      tl.to(
        left,
        {
          xPercent: 0,
          scaleX: 1,
          duration: 0.75,
          ease: 'power3.inOut',
        },
        0.1
      );

      tl.to(
        right,
        {
          xPercent: 0,
          scaleX: 1,
          duration: 0.75,
          ease: 'power3.inOut',
        },
        0.1
      );
    }

    if (container) {
      const pleats = container.querySelectorAll(`.${styles.curtainPleat}`);
      if (pleats.length) {
        tl.to(
          pleats,
          {
            scaleX: 1,
            duration: 0.75,
            ease: 'power3.inOut',
          },
          0.1
        );
      }
    }

    // Seam flashes crimson burst when curtains meet
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
      {/* Red Spider-Dust Canvas */}
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
        {/* 1. Official ARANEA DEN Logo (glowing subtly in red) */}
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

      {/* ── 3D Dual Cinematic Curtains ── */}
      <div className={styles.curtainContainer} aria-hidden="true">
        {/* Left Curtain 3D Panel */}
        <div ref={curtainLeftRef} className={styles.curtainLeft}>
          {pleatIndices.map((i) => (
            <div key={`left-pleat-${i}`} className={styles.curtainPleat}>
              <div className={styles.pleatFold} />
              <div className={styles.pleatShadow} />
              <div className={styles.pleatHighlight} />
            </div>
          ))}
        </div>

        {/* Right Curtain 3D Panel */}
        <div ref={curtainRightRef} className={styles.curtainRight}>
          {pleatIndices.map((i) => (
            <div key={`right-pleat-${i}`} className={styles.curtainPleat}>
              <div className={styles.pleatFold} />
              <div className={styles.pleatShadow} />
              <div className={styles.pleatHighlight} />
            </div>
          ))}
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
