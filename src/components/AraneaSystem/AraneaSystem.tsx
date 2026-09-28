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
    <defs>
      <linearGradient id="spiderDarkMetalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3A3C4A" />
        <stop offset="50%" stopColor="#1C1D24" />
        <stop offset="100%" stopColor="#0B0B0E" />
      </linearGradient>
      <linearGradient id="spiderCrimsonChassis" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF3B47" />
        <stop offset="35%" stopColor="#DF2531" />
        <stop offset="85%" stopColor="#6E0911" />
        <stop offset="100%" stopColor="#250305" />
      </linearGradient>
      <filter id="spiderLaserGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="0" stdDeviation="1.8" floodColor="#FF3847" floodOpacity="0.9" />
      </filter>
    </defs>

    {/* Background Legs (Dark titanium alloy with ruby reflection) */}
    <g
      className={styles.bgLegSet}
      fill="none"
      stroke="#551219"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.6"
    >
      <path d="M 23 14 L 27 6 L 31 10 L 33 22" />
      <path d="M 20 13.5 L 23 4.5 L 26 7.5 L 29 22" />
      <path d="M 16 13.5 L 14 4.5 L 10 8.5 L 7 22" />
      <path d="M 13 14 L 8 6 L 3 11 L 1 22" />
    </g>

    {/* Spinneret Silk Node / Luminous Laser Port */}
    <circle cx="2" cy="12.5" r="1.1" fill="#FF3847" filter="url(#spiderLaserGlow)" />

    {/* Spider Abdomen (Sculpted Dark Crimson Metallic Carapace) */}
    <path
      d="M 15 12.5 C 15 8.5, 9.5 6, 4.5 8 C 1.5 9.5, 1 13.5, 3.5 15.5 C 6.5 17.5, 12 17, 15 12.5 Z"
      fill="url(#spiderCrimsonChassis)"
      stroke="rgba(255, 255, 255, 0.15)"
      strokeWidth="0.4"
    />
    {/* Abdomen High-Gloss Metal Specular Highlight */}
    <ellipse cx="7.5" cy="10" rx="3.2" ry="1.4" fill="rgba(255, 255, 255, 0.45)" transform="rotate(-15 7.5 10)" />

    {/* Cephalothorax (Dark Titanium Armor Plate) */}
    <path
      d="M 14.5 13 C 15 9.5, 20 9, 23 11.2 C 24.5 12.2, 24.5 15, 23 16 C 20.5 17, 16 16.5, 14.5 13 Z"
      fill="url(#spiderDarkMetalGrad)"
      stroke="#DF2531"
      strokeWidth="0.5"
    />

    {/* Glowing Cybernetic Ocular Sensor / Laser Eye */}
    <circle cx="22.2" cy="12.2" r="0.8" fill="#FF4D5A" filter="url(#spiderLaserGlow)" />

    {/* Chelicerae / Metal Pedipalps */}
    <path
      d="M 23 13 Q 26 14.5, 27 17"
      fill="none"
      stroke="#FF3847"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <path
      d="M 22.5 12 Q 25 13, 26.5 15.5"
      fill="none"
      stroke="#DF2531"
      strokeWidth="1"
      strokeLinecap="round"
    />

    {/* Foreground Articulated Metal Legs (Polished Crimson Chrome) */}
    <g
      className={styles.fgLegSet1}
      fill="none"
      stroke="#DF2531"
      strokeWidth="1.35"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M 22 14 L 26 7 L 30 11 L 32 23" />
      <path d="M 16 13.5 L 14 5 L 9 9 L 6 23" />
    </g>

    <g
      className={styles.fgLegSet2}
      fill="none"
      stroke="#DF2531"
      strokeWidth="1.35"
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

  // Generate subtle, elegant, architectural generative spider-web geometry
  const bgWebData = useMemo(() => {
    // Structural Anchor Apex (off-center upper third)
    const apexX = 940;
    const apexY = 190;

    // 8 Primary Tensile Cables draping outward with natural organic catenary sag
    const strandConfigs = [
      { endX: 80, endY: 210, sagX: 480, sagY: 240, isAccent: false },
      { endX: 60, endY: 520, sagX: 440, sagY: 410, isAccent: false },
      { endX: 220, endY: 820, sagX: 520, sagY: 600, isAccent: true }, // subtle warm crimson accent strand
      { endX: 640, endY: 890, sagX: 760, sagY: 630, isAccent: false },
      { endX: 1120, endY: 890, sagX: 1050, sagY: 620, isAccent: false },
      { endX: 1540, endY: 740, sagX: 1320, sagY: 530, isAccent: false },
      { endX: 1580, endY: 340, sagX: 1350, sagY: 280, isAccent: false },
      { endX: 1400, endY: 80, sagX: 1180, sagY: 110, isAccent: false },
    ];

    const spokes = strandConfigs.map((s, idx) => ({
      id: `spoke-${idx}`,
      d: `M ${apexX} ${apexY} Q ${s.sagX} ${s.sagY}, ${s.endX} ${s.endY}`,
      isAccent: s.isAccent,
    }));

    // 5 Delicate Transverse Silk Arcs bridging between structural cables
    const arcFractions = [0.18, 0.36, 0.54, 0.74, 0.92];
    let spiralD = '';
    const dewNodes: { cx: number; cy: number; r: number; stepFraction: number }[] = [];

    arcFractions.forEach((f, arcIdx) => {
      // Interpolate points on each spoke at fraction f using quadratic bezier formula
      const arcPoints = strandConfigs.map((s) => {
        const t = f;
        const mt = 1 - t;
        const px = mt * mt * apexX + 2 * mt * t * s.sagX + t * t * s.endX;
        const py = mt * mt * apexY + 2 * mt * t * s.sagY + t * t * s.endY;
        return { x: px, y: py };
      });

      // Chain the points with subtle inward catenary curves between adjacent strands
      for (let j = 0; j < arcPoints.length - 1; j++) {
        const p1 = arcPoints[j];
        const p2 = arcPoints[j + 1];
        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2;
        const sagFactor = 0.08;
        const cpx = midX + (apexX - midX) * sagFactor;
        const cpy = midY + (apexY - midY) * sagFactor;

        if (j === 0) {
          spiralD += `${spiralD ? ' ' : ''}M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`;
        }
        spiralD += ` Q ${cpx.toFixed(1)} ${cpy.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
      }

      // Add 4 minimal, restrained connection micro-nodes
      if (arcIdx === 1 || arcIdx === 3) {
        const pA = arcPoints[2];
        const pB = arcPoints[5];
        dewNodes.push({
          cx: Number(pA.x.toFixed(1)),
          cy: Number(pA.y.toFixed(1)),
          r: 1.6,
          stepFraction: f,
        });
        dewNodes.push({
          cx: Number(pB.x.toFixed(1)),
          cy: Number(pB.y.toFixed(1)),
          r: 1.4,
          stepFraction: f,
        });
      }
    });

    return { spokes, spiralD, dewNodes, apexX, apexY };
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
        const spiderScale = 0.65;
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

            // 2. Cybernetic Metal Spider Traversal & Dynamic Growth (GROW GROW GROW GROW)
            if (spiderDesktopRef.current) {
              const spiderLeft = Math.min(100, Math.max(0, p * 100));
              // Dynamic scale growth: from sleek 0.85 at Strategy to monumental 2.65 at GROW!
              const currentScale = 0.85 + p * 1.80;
              spiderDesktopRef.current.style.opacity = '1';
              spiderDesktopRef.current.style.left = `${spiderLeft}%`;
              spiderDesktopRef.current.style.transform = `translate(-50%, 0) scale(${currentScale.toFixed(3)})`;
              spiderDesktopRef.current.style.transformOrigin = 'bottom center';

              if (p > 0.005) {
                spiderDesktopRef.current.classList.add(styles.isWalking);
                if (walkTimerRef.current) {
                  clearTimeout(walkTimerRef.current);
                }
                walkTimerRef.current = setTimeout(() => {
                  spiderDesktopRef.current?.classList.remove(styles.isWalking);
                }, 140);
              } else {
                spiderDesktopRef.current.classList.remove(styles.isWalking);
              }
            }

            // 3. Continuous Silk Weaving
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

            // Dew drops appear as the silk reaches them (Cached & Diffed)
            for (let i = 0; i < dewNodes.length; i++) {
              const shouldBeActive = p >= dewNodes[i].fraction;
              if (dewNodes[i].active !== shouldBeActive) {
                dewNodes[i].active = shouldBeActive;
                dewNodes[i].el.style.opacity = shouldBeActive ? '0.75' : '0';
              }
            }

            // 4. Weaving Tip Micro-Accent
            if (weavingTipRef.current) {
              if (p > 0.02 && p < 0.98) {
                const tipX = bgWebData.apexX + (p - 0.5) * 350;
                const tipY = bgWebData.apexY + p * 200;
                weavingTipRef.current.setAttribute('cx', tipX.toFixed(1));
                weavingTipRef.current.setAttribute('cy', tipY.toFixed(1));
                weavingTipRef.current.style.opacity = '0.4';
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

            // Spider Movement & Dynamic Growth on Mobile Vertical Rail (GROW GROW GROW GROW)
            if (spiderMobileRef.current) {
              const spiderTop = Math.min(100, Math.max(0, p * 100));
              const currentScale = 0.85 + p * 1.80;
              spiderMobileRef.current.style.opacity = '1';
              spiderMobileRef.current.style.top = `${spiderTop}%`;
              spiderMobileRef.current.style.transform = `translate(0, -50%) rotate(90deg) scale(${currentScale.toFixed(3)})`;
              spiderMobileRef.current.style.transformOrigin = 'center center';

              if (p > 0.005) {
                spiderMobileRef.current.classList.add(styles.isWalking);
                if (walkTimerRef.current) {
                  clearTimeout(walkTimerRef.current);
                }
                walkTimerRef.current = setTimeout(() => {
                  spiderMobileRef.current?.classList.remove(styles.isWalking);
                }, 140);
              } else {
                spiderMobileRef.current.classList.remove(styles.isWalking);
              }
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
        {/* ── REFINED ARCHITECTURAL GENERATIVE SILK INSTALLATION ── */}
        <div className={styles.bgWebContainer} aria-hidden="true">
          <svg
            ref={bgWebSvgRef}
            viewBox="0 0 1600 900"
            preserveAspectRatio="xMidYMid slice"
            className={styles.bgWebSvg}
          >
            <defs>
              {/* Luminous Neon Crimson Glow Filter */}
              <filter id="darkNeonGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#DF2531" floodOpacity="0.85" />
              </filter>
              <filter id="softCrimsonGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#DF2531" floodOpacity="0.6" />
              </filter>
              {/* Radiant Silk Weave Laser Gradient */}
              <linearGradient id="silkWeaveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#DF2531" stopOpacity="0.95" />
                <stop offset="50%" stopColor="#FF4D5A" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#9E0C17" stopOpacity="0.5" />
              </linearGradient>
            </defs>

            {/* Central Architectural Apex Anchor (Glowing ruby core with concentric metallic rings) */}
            <circle cx={bgWebData.apexX} cy={bgWebData.apexY} r="3" fill="#DF2531" filter="url(#darkNeonGlow)" />
            <circle cx={bgWebData.apexX} cy={bgWebData.apexY} r="10" fill="none" stroke="rgba(223, 37, 49, 0.45)" strokeWidth="0.85" />
            <circle cx={bgWebData.apexX} cy={bgWebData.apexY} r="22" fill="none" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.5" strokeDasharray="3 4" />

            {/* Primary Structural Tensile Cables (Organic catenary curves) */}
            {bgWebData.spokes.map((spoke) => (
              <path
                key={spoke.id}
                className="bg-web-spoke"
                d={spoke.d}
                stroke={spoke.isAccent ? 'rgba(223, 37, 49, 0.45)' : 'rgba(255, 255, 255, 0.12)'}
                strokeWidth={spoke.isAccent ? '1.2' : '0.8'}
                filter={spoke.isAccent ? 'url(#softCrimsonGlow)' : undefined}
                fill="none"
              />
            ))}

            {/* Base Transverse Silk Drape Curves */}
            <path
              className="bg-spiral-base"
              d={bgWebData.spiralD}
              stroke="rgba(255, 255, 255, 0.07)"
              strokeWidth="0.7"
              fill="none"
            />

            {/* Active Drawing Silk Weave Strand */}
            <path
              ref={spiralPathRef}
              className="bg-spiral-strand"
              d={bgWebData.spiralD}
              pathLength="1000"
              strokeDasharray="1000"
              strokeDashoffset="1000"
              stroke="url(#silkWeaveGrad)"
              strokeWidth="1.3"
              filter="url(#softCrimsonGlow)"
              fill="none"
            />

            {/* Subtle Structural Connection Micro-Nodes */}
            {bgWebData.dewNodes.map((dew, dIdx) => (
              <circle
                key={`dew-${dIdx}`}
                className="bg-spiral-dew"
                data-fraction={dew.stepFraction}
                cx={dew.cx}
                cy={dew.cy}
                r={dew.r}
                fill={dIdx === 0 ? '#FF3847' : '#DF2531'}
                filter="url(#softCrimsonGlow)"
                opacity={dIdx === 0 ? '0.85' : '0'}
              />
            ))}

            {/* Weaving Tip Micro-Accent */}
            <circle
              ref={weavingTipRef}
              cx={bgWebData.apexX}
              cy={bgWebData.apexY}
              r="2.5"
              fill="#FF4D5A"
              filter="url(#darkNeonGlow)"
              opacity="0"
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
            {/* Horizontal Timeline Track: Clean hairline with growing Navbar Walking Spider */}
            <div className={styles.timelineTrack} aria-hidden="true">
              <div className={styles.timelineBaseLine} />
              <div ref={desktopProgressRef} className={styles.timelineProgressBar} />

              {/* Small Navbar 3D Spider: Refined jewel accent on timeline */}
              <div
                ref={spiderDesktopRef}
                className={styles.timelineSpider}
                style={{
                  left: '0%',
                  opacity: 1,
                  transform: 'translate(-50%, 0) scale(0.85)',
                  transformOrigin: 'bottom center',
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

            {/* 4 Connected Philosophy Process Columns */}
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
                    {/* Subtle Top Accent Indicator */}
                    <div className={styles.stageIndicator} aria-hidden="true" />

                    {/* Stage Number */}
                    <div className={styles.stageMeta}>
                      <span className={styles.stageNumber}>{stage.number}</span>
                    </div>

                    {/* Stage Title in Solid Dark Charcoal */}
                    <h3 className={styles.stageName}>{stage.name}</h3>

                    {/* Stage Description in High Contrast Muted Slate */}
                    <p className={styles.stageSummary}>{stage.summary}</p>
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
                  top: '0%',
                  opacity: 1,
                  transform: 'translate(0, -50%) rotate(90deg) scale(0.85)',
                  transformOrigin: 'center center',
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
