import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './AraneaSystem.module.css';

gsap.registerPlugin(ScrollTrigger);

interface PhilosophyStage {
  number: string;
  name: string;
  summary: string;
}

const PHILOSOPHY_STAGES: PhilosophyStage[] = [
  {
    number: '01',
    name: 'STRATEGY',
    summary: 'Understand the business, identify opportunities, and define a clear digital direction.',
  },
  {
    number: '02',
    name: 'DESIGN',
    summary: 'Create intuitive, distinctive experiences that connect with people.',
  },
  {
    number: '03',
    name: 'BUILD',
    summary: 'Develop scalable websites, applications, and digital solutions with precision.',
  },
  {
    number: '04',
    name: 'GROW',
    summary: 'Improve performance, strengthen visibility, and evolve through continuous refinement.',
  },
];

/* ─────────────────────────────────────────
   NAVBAR 3D WALKING SPIDER
   - Delicate, side-view 3D spider matching AraneaDenNavbar
   - Idle resting state by default; scuttles only while scrolling
   - Emerges unborn from the left and grows as progress advances
───────────────────────────────────────── */
const NavbarSpiderWalking: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 36 24"
    width="24"
    height="16"
    className={`${className || ''} ${styles.spiderWalkingSide}`}
    aria-hidden="true"
  >
    {/* 3D Depth Layer 1: Background Legs (darker crimson, 0.55 opacity for stereoscopic depth) */}
    <g
      className={styles.bgLegSet}
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
    <circle cx="2" cy="12.5" r="1.1" fill="#df2531" />

    {/* Spider Body - 3D side profile */}
    {/* Abdomen (arched, tilted up at back) */}
    <path
      d="M 15 12.5 C 15 8.5, 9.5 6, 4.5 8 C 1.5 9.5, 1 13.5, 3.5 15.5 C 6.5 17.5, 12 17, 15 12.5 Z"
      fill="#df2531"
    />
    {/* Abdomen 3D specular highlight */}
    <ellipse cx="7.5" cy="10.5" rx="3.5" ry="1.8" fill="rgba(255, 255, 255, 0.45)" transform="rotate(-15 7.5 10.5)" />

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
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <path
      d="M 22.5 12 Q 25 13, 26.5 15.5"
      fill="none"
      stroke="#ff4a58"
      strokeWidth="1.0"
      strokeLinecap="round"
    />

    {/* 3D Depth Layer 2: Foreground Legs (vivid bright crimson, sharp joint articulation) */}
    <g
      className={styles.fgLegSet1}
      fill="none"
      stroke="#df2531"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M 22 14 L 26 7 L 30 11 L 32 23" />
      <path d="M 16 13.5 L 14 5 L 9 9 L 6 23" />
    </g>

    <g
      className={styles.fgLegSet2}
      fill="none"
      stroke="#df2531"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M 19 13.5 L 22 5 L 25 8 L 27 23" />
      <path d="M 14 14 L 9 7 L 4 12 L 2 23" />
    </g>
  </svg>
);

export const AraneaSystem: React.FC = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);

  // Background Spiral Web refs
  const bgWebSvgRef = useRef<SVGSVGElement>(null);
  const spiralPathRef = useRef<SVGPathElement>(null);
  const weavingTipRef = useRef<SVGCircleElement>(null);

  // Desktop refs
  const desktopStagesRef = useRef<HTMLDivElement>(null);
  const desktopProgressRef = useRef<HTMLDivElement>(null);
  const spiderDesktopRef = useRef<HTMLDivElement>(null);
  const stageColsRef = useRef<(HTMLButtonElement | null)[]>([]);

  // Mobile refs
  const mobileStagesRef = useRef<HTMLDivElement>(null);
  const mobileProgressRef = useRef<HTMLDivElement>(null);
  const spiderMobileRef = useRef<HTMLDivElement>(null);
  const mobileStageColsRef = useRef<(HTMLDivElement | null)[]>([]);

  const [activeStage, setActiveStage] = useState(0);
  const [reachedStageIndex, setReachedStageIndex] = useState(0);
  const [mobileActiveStage, setMobileActiveStage] = useState(0);
  const [mobileReachedIndex, setMobileReachedIndex] = useState(0);

  // Walk debounce timer: spider stops walking when scroll stops
  const walkTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Generate authentic continuous SPIRAL spiderweb geometry
  const bgWebData = useMemo(() => {
    const cx = 800;
    const cy = 380;
    const spokeCount = 24;
    const maxRadius = 1250;

    // 24 Radial Spokes
    const spokes: { id: string; d: string; isAccent: boolean }[] = [];
    for (let i = 0; i < spokeCount; i++) {
      const angle = (i * 2 * Math.PI) / spokeCount;
      const x2 = cx + maxRadius * Math.cos(angle);
      const y2 = cy + maxRadius * Math.sin(angle);
      spokes.push({
        id: `spoke-${i}`,
        d: `M ${cx} ${cy} L ${x2.toFixed(1)} ${y2.toFixed(1)}`,
        isAccent: i % 4 === 0,
      });
    }

    // 14 Full Revolutions of Continuous Organic Spiral Silk Strand
    const revolutions = 14;
    const totalSteps = revolutions * spokeCount; // 336 steps
    const rStart = 32;
    const rEnd = 1200;
    const deltaAngle = (2 * Math.PI) / spokeCount;

    let spiralD = '';
    const dewNodes: { cx: number; cy: number; r: number; stepFraction: number }[] = [];

    for (let k = 0; k < totalSteps; k++) {
      const theta1 = k * deltaAngle;
      const t1 = k / totalSteps;
      const r1 = rStart + t1 * (rEnd - rStart);
      const p1x = cx + r1 * Math.cos(theta1);
      const p1y = cy + r1 * Math.sin(theta1);

      const theta2 = (k + 1) * deltaAngle;
      const t2 = (k + 1) / totalSteps;
      const r2 = rStart + t2 * (rEnd - rStart);
      const p2x = cx + r2 * Math.cos(theta2);
      const p2y = cy + r2 * Math.sin(theta2);

      // Catenary sag curve toward center
      const thetaMid = (theta1 + theta2) / 2;
      const rMid = ((r1 + r2) / 2) * 0.94;
      const cpx = cx + rMid * Math.cos(thetaMid);
      const cpy = cy + rMid * Math.sin(thetaMid);

      if (k === 0) {
        spiralD += `M ${p1x.toFixed(1)} ${p1y.toFixed(1)}`;
      }
      spiralD += ` Q ${cpx.toFixed(1)} ${cpy.toFixed(1)}, ${p2x.toFixed(1)} ${p2y.toFixed(1)}`;

      // Dew drop nodes at spoke intersections on accent revolutions
      const revIndex = Math.floor(k / spokeCount);
      if (revIndex % 2 === 0 && k % 3 === 0 && r1 > 60) {
        dewNodes.push({
          cx: Number(p1x.toFixed(1)),
          cy: Number(p1y.toFixed(1)),
          r: revIndex > 7 ? 2.4 : 1.8,
          stepFraction: t1,
        });
      }
    }

    return { spokes, spiralD, dewNodes };
  }, []);

  // Click on stage column on desktop
  const handleStageClick = useCallback((index: number) => {
    setActiveStage(index);
    setReachedStageIndex(index);
    const st = ScrollTrigger.getById('philosophy-pin');
    if (st) {
      const targetProgress = index / (PHILOSOPHY_STAGES.length - 1);
      const targetScroll = st.start + (st.end - st.start) * targetProgress;
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    } else {
      const targetPercent = (index / (PHILOSOPHY_STAGES.length - 1)) * 100;
      if (desktopProgressRef.current) {
        gsap.to(desktopProgressRef.current, {
          width: `${targetPercent}%`,
          duration: 0.35,
          ease: 'power2.out',
        });
      }
      if (spiderDesktopRef.current) {
        spiderDesktopRef.current.classList.add(styles.isWalking);
        const spiderScale = 0.40 + (index / 3) * 0.82;
        gsap.to(spiderDesktopRef.current, {
          left: `${targetPercent}%`,
          scale: spiderScale,
          opacity: 1,
          duration: 0.35,
          ease: 'power2.out',
          onComplete: () => {
            spiderDesktopRef.current?.classList.remove(styles.isWalking);
          },
        });
      }
    }
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const wrapper = wrapperRef.current;
    if (!section || !wrapper) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      if (desktopProgressRef.current) desktopProgressRef.current.style.width = '100%';
      if (mobileProgressRef.current) mobileProgressRef.current.style.height = '100%';
      if (spiralPathRef.current) spiralPathRef.current.style.strokeDashoffset = '0';
      if (spiderDesktopRef.current) {
        spiderDesktopRef.current.style.opacity = '1';
        spiderDesktopRef.current.style.left = '100%';
        spiderDesktopRef.current.style.transform = 'translate(-50%, 0) scale(1.22)';
      }
      setReachedStageIndex(3);
      setMobileReachedIndex(3);
      return;
    }

    const ctx = gsap.context(() => {
      // 1. Reveal header
      if (headerRef.current) {
        gsap.fromTo(
          [eyebrowRef.current, headlineRef.current, subtextRef.current],
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: wrapper,
              start: 'top 80%',
            },
          }
        );
      }

      const mm = gsap.matchMedia();

      // DESKTOP GSAP SCROLL EXPERIENCE (min-width: 769px)
      // PINNED: User scrolls through Stage 01 to 04 with spider birth/growth & spiral web weaving
      mm.add('(min-width: 769px)', () => {
        // Pre-cache SVG elements once (eliminates 120+ querySelectorAll calls per second during scrub)
        const spokeNodes = bgWebSvgRef.current
          ? Array.from(bgWebSvgRef.current.querySelectorAll<SVGPathElement>('.bg-web-spoke'))
          : [];
        const dewNodes = bgWebSvgRef.current
          ? Array.from(bgWebSvgRef.current.querySelectorAll<SVGCircleElement>('.bg-spiral-dew')).map((el) => ({
              el,
              fraction: Number(el.getAttribute('data-fraction') || 0),
              active: false,
            }))
          : [];

        const pinTrigger = ScrollTrigger.create({
          id: 'philosophy-pin',
          trigger: wrapper,
          start: 'top top',
          end: '+=130%',
          pin: section,
          pinSpacing: true,
          anticipatePin: 1,
          scrub: 0.45,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress; // 0.0 to 1.0

            // 1. Progress line
            if (desktopProgressRef.current) {
              const targetWidth = Math.min(100, Math.max(0, p * 100));
              desktopProgressRef.current.style.width = `${targetWidth}%`;
            }

            // 2. Spider Birth from the left & Growing across timeline
            if (spiderDesktopRef.current) {
              if (p <= 0.005) {
                // Not born yet (completely invisible)
                spiderDesktopRef.current.style.opacity = '0';
                spiderDesktopRef.current.style.left = '-24px';
                spiderDesktopRef.current.style.transform = 'translate(-50%, 0) scale(0)';
                spiderDesktopRef.current.classList.remove(styles.isWalking);
              } else if (p <= 0.04) {
                // Birth phase: hatches and emerges from imaginary space onto the track
                const birthT = p / 0.04;
                const birthLeft = -24 + birthT * 24; // -24px to 0px
                const birthScale = 0.38 * birthT;
                spiderDesktopRef.current.style.opacity = `${birthT}`;
                spiderDesktopRef.current.style.left = `${birthLeft}px`;
                spiderDesktopRef.current.style.transform = `translate(-50%, 0) scale(${birthScale.toFixed(3)})`;
                spiderDesktopRef.current.classList.add(styles.isWalking);
              } else {
                // Walking & Growing phase
                const progressAlongLine = ((p - 0.04) / 0.96) * 100;
                const spiderLeft = Math.min(100, Math.max(0, progressAlongLine));
                // Grows dramatically from tiny newborn (0.40) to massive fully grown spider (3.2×)
                const spiderScale = 0.40 + p * 2.8;

                spiderDesktopRef.current.style.opacity = '1';
                spiderDesktopRef.current.style.left = `${spiderLeft}%`;
                spiderDesktopRef.current.style.transform = `translate(-50%, 0) scale(${spiderScale.toFixed(3)})`;
                spiderDesktopRef.current.classList.add(styles.isWalking);
              }

              // Debounce stop: spider stops walking when user stops scrolling
              if (walkTimerRef.current) {
                clearTimeout(walkTimerRef.current);
              }
              walkTimerRef.current = setTimeout(() => {
                spiderDesktopRef.current?.classList.remove(styles.isWalking);
              }, 140);
            }

            // 3. Continuous Spiral Web Weaving (spins spirally outward)
            if (spiralPathRef.current) {
              const spiralOffset = 1000 * (1 - Math.min(1, Math.max(0, p)));
              spiralPathRef.current.style.strokeDashoffset = `${spiralOffset}`;
            }

            // Spokes draw outward (Zero DOM Query)
            const spokeProgress = Math.min(1, Math.max(0, p * 1.35));
            const spokeOffset = 1000 * (1 - spokeProgress);
            for (let i = 0; i < spokeNodes.length; i++) {
              spokeNodes[i].style.strokeDashoffset = `${spokeOffset}`;
            }

            // Dew drops appear as the spiral reaches them (Cached & Diffed)
            for (let i = 0; i < dewNodes.length; i++) {
              const shouldBeActive = p >= dewNodes[i].fraction;
              if (dewNodes[i].active !== shouldBeActive) {
                dewNodes[i].active = shouldBeActive;
                dewNodes[i].el.style.opacity = shouldBeActive ? '0.75' : '0';
              }
            }

            // 4. Weaving Tip Cursor spins around the spiral head
            if (weavingTipRef.current) {
              if (p > 0.02 && p < 0.98) {
                const currentAngle = p * 14 * 2 * Math.PI;
                const currentR = 32 + p * (1200 - 32);
                const tipX = 800 + currentR * Math.cos(currentAngle);
                const tipY = 380 + currentR * Math.sin(currentAngle);
                weavingTipRef.current.setAttribute('cx', tipX.toFixed(1));
                weavingTipRef.current.setAttribute('cy', tipY.toFixed(1));
                weavingTipRef.current.style.opacity = '1';
              } else {
                weavingTipRef.current.style.opacity = '0';
              }
            }

            // 5. Stage Progression (Numbers & Accents turn red, text remains readable black)
            let reached = 0;
            if (p >= 0.88) {
              reached = 3;
            } else if (p >= 0.58) {
              reached = 2;
            } else if (p >= 0.25) {
              reached = 1;
            } else {
              reached = 0;
            }
            setReachedStageIndex(reached);

            let active = 0;
            if (p >= 0.82) {
              active = 3;
            } else if (p >= 0.48) {
              active = 2;
            } else if (p >= 0.18) {
              active = 1;
            } else {
              active = 0;
            }
            setActiveStage(active);
          },
        });

        // Entrance of stage columns
        const cols = stageColsRef.current.filter(Boolean);
        if (cols.length > 0) {
          gsap.fromTo(
            cols,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.08,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: wrapper,
                start: 'top 78%',
              },
            }
          );
        }

        return () => {
          pinTrigger.kill();
        };
      });

      // MOBILE GSAP SCROLL EXPERIENCE (max-width: 768px)
      mm.add('(max-width: 768px)', () => {
        const mobileContainer = mobileStagesRef.current;
        if (!mobileContainer) return;

        ScrollTrigger.create({
          trigger: mobileContainer,
          start: 'top 78%',
          end: 'bottom 55%',
          scrub: 0.3,
          onUpdate: (self) => {
            const p = self.progress;

            if (mobileProgressRef.current) {
              const targetHeight = Math.min(100, Math.max(0, p * 100));
              mobileProgressRef.current.style.height = `${targetHeight}%`;
            }

            // Spider Birth & Growth on Mobile Vertical Rail
            if (spiderMobileRef.current) {
              if (p <= 0.005) {
                spiderMobileRef.current.style.opacity = '0';
                spiderMobileRef.current.style.top = '-20px';
                spiderMobileRef.current.style.transform = 'translate(0, -50%) rotate(90deg) scale(0)';
                spiderMobileRef.current.classList.remove(styles.isWalking);
              } else if (p <= 0.04) {
                const birthT = p / 0.04;
                const birthTop = -20 + birthT * 20;
                const birthScale = 0.38 * birthT;
                spiderMobileRef.current.style.opacity = `${birthT}`;
                spiderMobileRef.current.style.top = `${birthTop}px`;
                spiderMobileRef.current.style.transform = `translate(0, -50%) rotate(90deg) scale(${birthScale.toFixed(3)})`;
                spiderMobileRef.current.classList.add(styles.isWalking);
              } else {
                const progressAlongRail = ((p - 0.04) / 0.96) * 100;
                const spiderTop = Math.min(100, Math.max(0, progressAlongRail));
                const spiderScale = 0.40 + p * 2.8;

                spiderMobileRef.current.style.opacity = '1';
                spiderMobileRef.current.style.top = `${spiderTop}%`;
                spiderMobileRef.current.style.transform = `translate(0, -50%) rotate(90deg) scale(${spiderScale.toFixed(3)})`;
                spiderMobileRef.current.classList.add(styles.isWalking);
              }

              if (walkTimerRef.current) {
                clearTimeout(walkTimerRef.current);
              }
              walkTimerRef.current = setTimeout(() => {
                spiderMobileRef.current?.classList.remove(styles.isWalking);
              }, 140);
            }

            // Spiral Weave on Mobile
            if (spiralPathRef.current) {
              const spiralOffset = 1000 * (1 - Math.min(1, Math.max(0, p)));
              spiralPathRef.current.style.strokeDashoffset = `${spiralOffset}`;
            }

            let reached = 0;
            if (p >= 0.88) {
              reached = 3;
            } else if (p >= 0.58) {
              reached = 2;
            } else if (p >= 0.25) {
              reached = 1;
            } else {
              reached = 0;
            }
            setMobileReachedIndex(reached);

            let active = 0;
            if (p >= 0.82) {
              active = 3;
            } else if (p >= 0.48) {
              active = 2;
            } else if (p >= 0.18) {
              active = 1;
            } else {
              active = 0;
            }
            setMobileActiveStage(active);
          },
        });

        const mobileCols = mobileStageColsRef.current.filter(Boolean);
        mobileCols.forEach((item) => {
          gsap.fromTo(
            item,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: item,
                start: 'top 88%',
              },
            }
          );
        });
      });
    }, wrapper);

    return () => {
      ctx.revert();
      if (walkTimerRef.current) {
        clearTimeout(walkTimerRef.current);
      }
    };
  }, []);

  return (
    <div ref={wrapperRef} className={styles.systemWrapper}>
      <section ref={sectionRef} id="philosophy" className={styles.section} aria-label="Our Philosophy">
        {/* ── IMMERSIVE ARCHITECTURAL BACKGROUND SPIDERWEB (Woven Spirally) ── */}
        <div className={styles.bgWebContainer} aria-hidden="true">
          <svg
            ref={bgWebSvgRef}
            viewBox="0 0 1600 900"
            preserveAspectRatio="xMidYMid slice"
            className={styles.bgWebSvg}
          >
            <defs>
              <filter id="bgDewGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="rgba(223, 37, 49, 0.6)" />
              </filter>

              {/* Delicate Spiral Silk Gradient */}
              <linearGradient id="spiralSilkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#df2531" stopOpacity="0.35" />
                <stop offset="50%" stopColor="#df2531" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#df2531" stopOpacity="0.28" />
              </linearGradient>
            </defs>

            {/* Central Nexus Core Anchor */}
            <circle cx="800" cy="380" r="4.5" fill="#df2531" opacity="0.85" />
            <circle cx="800" cy="380" r="14" fill="none" stroke="rgba(223, 37, 49, 0.35)" strokeWidth="1" />

            {/* Radial Spokes (Draw outward from center to bounds) */}
            {bgWebData.spokes.map((spoke) => (
              <path
                key={spoke.id}
                className="bg-web-spoke"
                d={spoke.d}
                pathLength="1000"
                strokeDasharray="1000"
                strokeDashoffset="1000"
                stroke={spoke.isAccent ? 'rgba(223, 37, 49, 0.18)' : 'rgba(11, 11, 12, 0.05)'}
                strokeWidth={spoke.isAccent ? '1.1' : '0.75'}
                fill="none"
              />
            ))}

            {/* Continuous Spiral Silk Strand (Woven spirally from center outward) */}
            <path
              ref={spiralPathRef}
              className="bg-spiral-strand"
              d={bgWebData.spiralD}
              pathLength="1000"
              strokeDasharray="1000"
              strokeDashoffset="1000"
              stroke="url(#spiralSilkGrad)"
              strokeWidth="1.2"
              fill="none"
            />

            {/* Dew Drops appearing as spiral weaves past intersections */}
            {bgWebData.dewNodes.map((dew, dIdx) => (
              <circle
                key={`dew-${dIdx}`}
                className="bg-spiral-dew"
                data-fraction={dew.stepFraction}
                cx={dew.cx}
                cy={dew.cy}
                r={dew.r}
                fill="#df2531"
                opacity="0"
                filter="url(#bgDewGlow)"
              />
            ))}

            {/* Active Silk Weaving Tip (Spins around the spiral leading edge) */}
            <circle
              ref={weavingTipRef}
              cx="800"
              cy="380"
              r="3.5"
              fill="#df2531"
              opacity="0"
              filter="url(#bgDewGlow)"
            />
          </svg>
        </div>

        <div className={styles.container}>
          {/* Eyebrow Label */}
          <div ref={eyebrowRef} className={styles.eyebrow}>
            <span className={styles.marker} aria-hidden="true" />
            <span className={styles.eyebrowText}>OUR PHILOSOPHY</span>
          </div>

          {/* Master Editorial Header */}
          <div ref={headerRef} className={styles.headerBlock}>
            <h2 ref={headlineRef} className={styles.headline}>
              Connecting Ideas, Design, and Technology.
            </h2>
            <p ref={subtextRef} className={styles.subtext}>
              We bring strategy, creativity, and technology together to create meaningful digital experiences.
            </p>
          </div>

          {/* ── DESKTOP CONTINUOUS EDITORIAL COMPOSITION ── */}
          <div ref={desktopStagesRef} className={styles.desktopComposition}>
            {/* Horizontal Timeline Track: Clean line with growing Navbar Walking Spider */}
            <div className={styles.timelineTrack} aria-hidden="true">
              <div className={styles.timelineBaseLine} />
              <div ref={desktopProgressRef} className={styles.timelineProgressBar} />

              {/* Small Navbar 3D Spider: Unborn at first, emerges from left, walks while scrolling, and grows */}
              <div
                ref={spiderDesktopRef}
                className={styles.timelineSpider}
                style={{
                  left: '-24px',
                  opacity: 0,
                  transform: 'translate(-50%, 0) scale(0)',
                }}
              >
                <NavbarSpiderWalking />
              </div>

              <div className={styles.timelineNodes}>
                {PHILOSOPHY_STAGES.map((_, idx) => (
                  <div
                    key={idx}
                    className={`${styles.timelineNode} ${idx <= reachedStageIndex ? styles.nodeActive : ''}`}
                  />
                ))}
              </div>
            </div>

            {/* 4 Connected Philosophy Columns with Solid Black High-Contrast Typography */}
            <div className={styles.stagesRow}>
              {PHILOSOPHY_STAGES.map((stage, idx) => {
                const isCurrent = idx === activeStage;
                const isReached = idx <= reachedStageIndex;

                return (
                  <button
                    key={stage.number}
                    ref={(el) => {
                      stageColsRef.current[idx] = el;
                    }}
                    type="button"
                    className={`${styles.stageCol} ${isReached ? styles.stageReached : ''} ${
                      isCurrent ? styles.stageActive : ''
                    }`}
                    onClick={() => handleStageClick(idx)}
                    aria-label={`${stage.number} ${stage.name}`}
                  >
                    {/* Stage Number (Turns Red as you scroll) */}
                    <div className={styles.stageMeta}>
                      <span className={styles.stageNumber}>{stage.number}</span>
                    </div>

                    {/* Stage Title in Universal Mokoto Font (Solid BLACK for 100% readability) */}
                    <h3 className={styles.stageName}>{stage.name}</h3>

                    {/* Stage Description in Universal Body Font (High contrast dark slate) */}
                    <p className={styles.stageSummary}>{stage.summary}</p>

                    {/* Accent Baseline */}
                    <div className={styles.stageAccentBar} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── MOBILE VERTICAL EDITORIAL COMPOSITION ── */}
          <div ref={mobileStagesRef} className={styles.mobileComposition}>
            {/* Vertical Progress Rail with Growing Navbar Walking Spider on Side */}
            <div className={styles.mobileRail} aria-hidden="true">
              <div className={styles.mobileRailTrack} />
              <div ref={mobileProgressRef} className={styles.mobileRailProgress} />
              <div
                ref={spiderMobileRef}
                className={styles.mobileSpider}
                style={{
                  top: '-20px',
                  opacity: 0,
                  transform: 'translate(0, -50%) rotate(90deg) scale(0)',
                }}
              >
                <NavbarSpiderWalking />
              </div>
            </div>

            {/* Vertically Stacked Philosophy Stages with Solid Black Typography */}
            <div className={styles.mobileStagesList}>
              {PHILOSOPHY_STAGES.map((stage, idx) => {
                const isCurrent = idx === mobileActiveStage;
                const isReached = idx <= mobileReachedIndex;

                return (
                  <div
                    key={stage.number}
                    ref={(el) => {
                      mobileStageColsRef.current[idx] = el;
                    }}
                    className={`${styles.mobileStageItem} ${isReached ? styles.mobileStageReached : ''} ${
                      isCurrent ? styles.mobileStageActive : ''
                    }`}
                  >
                    <div className={styles.mobileStageIndicator} aria-hidden="true">
                      <span
                        className={`${styles.mobileNode} ${isReached ? styles.mobileNodeActive : ''}`}
                      />
                    </div>
                    <div className={styles.mobileStageContent}>
                      <div className={styles.mobileStageMeta}>
                        <span className={styles.mobileStageNumber}>{stage.number}</span>
                      </div>
                      <h3 className={styles.mobileStageName}>{stage.name}</h3>
                      <p className={styles.mobileStageSummary}>{stage.summary}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AraneaSystem;
