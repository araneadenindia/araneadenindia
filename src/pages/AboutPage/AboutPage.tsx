import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import adLogo from '../../assets/AD Transparent SVG.svg';
import { ClienteleSection } from '../../components/ClienteleSection';
import styles from './AboutPage.module.css';

gsap.registerPlugin(ScrollTrigger);

interface DifferencePillar {
  num: string;
  title: string;
  summary: string;
}

const ADVANTAGE_PILLARS: DifferencePillar[] = [
  {
    num: '01',
    title: 'UNCOMPROMISING QUALITY',
    summary: 'Top-tier design fidelity, clean modern architecture, and pixel-perfect polish across every viewport and device.',
  },
  {
    num: '02',
    title: 'ACCESSIBLE EXCELLENCE',
    summary: 'Transparent, affordable pricing models designed to empower startups and growing businesses without excessive agency markups.',
  },
  {
    num: '03',
    title: 'INTEGRATED SPEED & CRAFT',
    summary: 'Zero handoff friction between design and full-stack engineering, delivering faster turnaround and superior performance.',
  },
];

export const AboutPage: React.FC = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const visionRef = useRef<HTMLElement>(null);
  const differenceRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  useEffect(() => {
    document.title = 'ABOUT — ARANEA DEN | Born on 20th July 2025';
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });

    const page = pageRef.current;
    if (!page) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // 01 — Hero Section Entrance
      if (heroRef.current) {
        const badge = heroRef.current.querySelector(`.${styles.foundingBadge}`);
        const heroHeading = heroRef.current.querySelector(`.${styles.heroHeading}`);
        const heroLead = heroRef.current.querySelector(`.${styles.heroLead}`);
        const heroDesc = heroRef.current.querySelector(`.${styles.heroDescription}`);
        const heroActions = heroRef.current.querySelector(`.${styles.heroActionRow}`);
        const visualCard = heroRef.current.querySelector(`.${styles.heroVisualCard}`);

        const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
        if (badge) tl.fromTo(badge, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 });
        if (heroHeading) tl.fromTo(heroHeading, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.4');
        if (heroLead) tl.fromTo(heroLead, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.5');
        if (heroDesc) tl.fromTo(heroDesc, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.5');
        if (heroActions) tl.fromTo(heroActions, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4');
        if (visualCard) tl.fromTo(visualCard, { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 1 }, '-=0.8');
      }

      // 02 — Vision & Mission
      if (visionRef.current) {
        const eyebrow = visionRef.current.querySelector(`.${styles.visionEyebrow}`);
        const heading = visionRef.current.querySelector(`.${styles.visionHeading}`);
        const intro = visionRef.current.querySelector(`.${styles.visionIntro}`);
        const visionCol = visionRef.current.querySelector(`.${styles.visionCol}`);
        const missionCol = visionRef.current.querySelector(`.${styles.missionCol}`);

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: visionRef.current,
            start: 'top 80%',
          },
          defaults: { ease: 'power2.out' },
        });

        if (eyebrow) {
          tl.fromTo(eyebrow, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5 });
        }
        if (heading) {
          tl.fromTo(heading, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.3');
        }
        if (intro) {
          tl.fromTo(intro, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.55 }, '-=0.35');
        }
        if (visionCol) {
          tl.fromTo(visionCol, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.65 }, '-=0.25');
        }
        if (missionCol) {
          tl.fromTo(missionCol, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.65 }, '-=0.45');
        }
      }

      // 03 — The Aranea Advantage (Difference)
      if (differenceRef.current) {
        const intro = differenceRef.current.querySelector(`.${styles.differenceIntro}`);
        const pillars = differenceRef.current.querySelectorAll(`.${styles.pillarBlock}`);

        if (intro) {
          gsap.fromTo(
            intro,
            { opacity: 0, x: -24 },
            {
              opacity: 1,
              x: 0,
              duration: 0.8,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: differenceRef.current,
                start: 'top 80%',
              },
            }
          );
        }

        if (pillars.length) {
          gsap.fromTo(
            pillars,
            { opacity: 0, x: 24 },
            {
              opacity: 1,
              x: 0,
              duration: 0.7,
              stagger: 0.12,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: differenceRef.current,
                start: 'top 75%',
              },
            }
          );
        }
      }


      // 07 — Cinematic CTA
      if (ctaRef.current) {
        const mainBox = ctaRef.current.querySelector(`.${styles.ctaMainBox}`);
        const directCards = ctaRef.current.querySelectorAll(`.${styles.ctaDirectCard}`);

        if (mainBox) {
          gsap.fromTo(
            mainBox,
            { opacity: 0, y: 32 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: ctaRef.current,
                start: 'top 85%',
              },
            }
          );
        }

        if (directCards.length) {
          gsap.fromTo(
            directCards,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: ctaRef.current,
                start: 'top 75%',
              },
            }
          );
        }
      }
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className={styles.aboutPage}>
      <section ref={heroRef} className={styles.heroSection} aria-labelledby="hero-title">
        <div className={styles.container}>
          <div className={styles.heroGrid}>
            <div className={styles.heroContent}>


              <div className={styles.eyebrow}>
                <span className={styles.eyebrowMarker} />
                <span className={styles.eyebrowText}>About US</span>
              </div>

              <h1 id="hero-title" className={styles.heroHeading}>
                WE WEAVE DIGITAL EXPERIENCES.
              </h1>

              <p className={styles.heroLead}>
                We are an innovative creative and technology studio dedicated to crafting impactful digital solutions. We combine strategic thinking, refined design, and robust engineering to help businesses create enduring digital presence.
              </p>

              <p className={styles.heroDescription}>
                Born on 20th July 2025, Aranea Den unites strategy, aesthetics, and code into cohesive ecosystems. Every interaction is designed with intention; every platform engineered for performance.
              </p>

              <div className={styles.heroActionRow}>
                <Link to="/contact" className={styles.primaryBtn}>
                  START A PROJECT
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
                <Link to="/portfolio" className={styles.secondaryBtn}>
                  EXPLORE WORK
                </Link>
              </div>
            </div>

            <div className={styles.heroVisualStage}>
              <div className={styles.heroVisualCard}>
                <div className={styles.heroVisualCardGlow} />
                
                {/* Ambient Rotating Spiderweb Background */}
                <svg
                  className={styles.heroWebSvgBg}
                  viewBox="0 0 500 500"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <circle cx="250" cy="250" r="60" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="3 3" />
                  <circle cx="250" cy="250" r="120" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                  <circle cx="250" cy="250" r="180" stroke="rgba(223,37,49,0.14)" strokeWidth="1" strokeDasharray="4 4" />
                  <circle cx="250" cy="250" r="235" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                  <line x1="250" y1="15" x2="250" y2="485" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                  <line x1="15" y1="250" x2="485" y2="250" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                  <line x1="84" y1="84" x2="416" y2="416" stroke="rgba(223,37,49,0.12)" strokeWidth="1" />
                  <line x1="416" y1="84" x2="84" y2="416" stroke="rgba(223,37,49,0.12)" strokeWidth="1" />
                  <polygon points="250,70 430,250 250,430 70,250" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                  <polygon points="250,130 370,250 250,370 130,250" stroke="rgba(223,37,49,0.15)" strokeWidth="1" />
                </svg>

                {/* Central Studio Brand Seal */}
                <img
                  src={adLogo}
                  alt="Aranea Den Studio Emblem"
                  className={styles.heroLogoSeal}
                  loading="eager"
                />


              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────
          02 — VISION & MISSION (EDITORIAL MINIMAL LAYOUT)
          Balanced two-column architecture with refined typography,
          subtle accents, and generous whitespace
      ───────────────────────────────────────── */}
      <section ref={visionRef} className={styles.visionMissionSection} aria-labelledby="vision-title">
        <div className={styles.container}>
          <div className={styles.visionHeader}>
            <div className={styles.visionEyebrow}>
              <span className={styles.eyebrowMarker} />
              <span className={styles.eyebrowText}>VISION & MISSION</span>
            </div>
            <h2 id="vision-title" className={styles.visionHeading}>
              GUIDED BY PURPOSE
            </h2>
            <p className={styles.visionIntro}>
              Building purposeful digital architectures with computational rigor and creative ambition.
            </p>
          </div>

          <div className={styles.visionGrid}>
            {/* 01 — OUR VISION */}
            <div className={`${styles.visionBlock} ${styles.visionCol}`}>
              <div className={styles.blockDivider}>
                <span className={styles.dividerAccent} />
              </div>

              <div className={styles.blockImageFrame}>
                <img
                  src="/about/vision.jpg"
                  alt="Aranea Den Vision"
                  className={styles.blockImage}
                  loading="lazy"
                />
                <div className={styles.blockImageOverlay} />
              </div>

              <div className={styles.blockMeta}>
                <span className={styles.blockIndex}>01</span>
                <span className={styles.blockSep}>—</span>
                <span className={styles.blockTag}>OUR VISION</span>
              </div>

              <h3 className={styles.blockHeading}>THE WORLD WE ARE BUILDING</h3>

              <p className={styles.blockParagraph}>
                To be recognized globally as a benchmark creative technology studio where imagination meets engineering rigor. We envision a digital landscape where brands do not simply broadcast messages, but build meaningful, enduring ecosystems that enrich user lives and accelerate business growth.
              </p>
            </div>

            {/* 02 — OUR MISSION */}
            <div className={`${styles.visionBlock} ${styles.missionCol}`}>
              <div className={styles.blockDivider}>
                <span className={styles.dividerAccent} />
              </div>

              <div className={styles.blockImageFrame}>
                <img
                  src="/about/mission.jpg"
                  alt="Aranea Den Mission"
                  className={styles.blockImage}
                  loading="lazy"
                />
                <div className={styles.blockImageOverlay} />
              </div>

              <div className={styles.blockMeta}>
                <span className={styles.blockIndex}>02</span>
                <span className={styles.blockSep}>—</span>
                <span className={styles.blockTag}>OUR MISSION</span>
              </div>

              <h3 className={styles.blockHeading}>WHAT WE DO EVERY DAY</h3>

              <p className={styles.blockParagraph}>
                To empower visionary entrepreneurs, forward-thinking institutions, and emerging brands by designing and engineering superior digital products. We bridge the gap between aesthetic beauty and technical precision, delivering measurable competitive advantage with relentless craft.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────
          03 — THE ARANEA ADVANTAGE
          Highlighting digital excellence at affordable prices with best quality
      ───────────────────────────────────────── */}
      <section ref={differenceRef} className={styles.differenceSection} aria-labelledby="diff-title">
        <div className={styles.container}>
          <div className={styles.differenceGrid}>
            <div className={styles.differenceIntro}>
              <div className={styles.eyebrow}>
                <span className={styles.eyebrowMarker} />
                <span className={styles.eyebrowText}>THE ARANEA ADVANTAGE</span>
              </div>
              <h2 id="diff-title" className={styles.differenceHeading}>
                A MORE CONNECTED WAY OF WORKING.
              </h2>
              <p className={styles.differenceLead}>
                We offer digital excellence at accessible, affordable prices with uncompromising quality.
              </p>
              <p className={styles.differenceBody}>
                At Aranea Den, we believe premium digital craftsmanship shouldn't be reserved only for multi-million dollar corporations. We offer industry-leading engineering, award-caliber design, and strategic agility at honest, transparent rates—empowering ambitious brands to achieve best-in-class results with maximum return on investment.
              </p>
            </div>

            <div className={styles.pillarsTrio}>
              {ADVANTAGE_PILLARS.map((pillar) => (
                <div key={pillar.num} className={styles.pillarBlock}>
                  <div className={styles.pillarMarker}>{pillar.num}</div>
                  <div className={styles.pillarText}>
                    <h3 className={styles.pillarTitle}>{pillar.title}</h3>
                    <p className={styles.pillarSummary}>{pillar.summary}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────
          06 — OUR CLIENTELE
          (Universal infinite smooth auto-scroll logo marquee)
      ───────────────────────────────────────── */}
      <ClienteleSection />

      {/* ─────────────────────────────────────────
          07 — INITIATE COLLABORATION (CINEMATIC CTA)
          With striking visual architecture and direct studio connection grid
      ───────────────────────────────────────── */}
      <section ref={ctaRef} className={styles.ctaSection} aria-labelledby="cta-title">
        <div className={styles.ctaGlowBackdrop} />
        <div className={styles.container}>
          <div className={styles.ctaMainBox}>
            <h2 id="cta-title" className={styles.ctaHeading}>
              READY TO WEAVE SOMETHING REMARKABLE?
            </h2>
            <p className={styles.ctaSubtext}>
              Whether launching a new venture, redefining an existing brand, or engineering an enterprise platform, let's create something extraordinary together.
            </p>
            <div className={styles.ctaButtonsRow}>
              <Link to="/contact" className={styles.ctaPrimaryBtn}>
                START A PROJECT
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
              <Link to="/portfolio" className={styles.ctaSecondaryBtn}>
                EXPLORE WORK
              </Link>
            </div>
          </div>

          {/* Cinematic Studio Information Grid */}
          <div className={styles.ctaDirectGrid}>
            <a href="mailto:contact@araneaden.com" className={styles.ctaDirectCard}>
              <span className={styles.ctaDirectLabel}>DIRECT INQUIRIES</span>
              <span className={styles.ctaDirectValue}>contact@araneaden.com</span>
            </a>

            <div className={styles.ctaDirectCard}>
              <span className={styles.ctaDirectLabel}>STUDIO HEADQUARTERS</span>
              <span className={styles.ctaDirectValue}>Hyderabad, Telangana, India</span>
            </div>

            <div className={styles.ctaDirectCard}>
              <span className={styles.ctaDirectLabel}>RESPONSE VELOCITY</span>
              <span className={styles.ctaDirectValue}>&lt; 24 Hours Guaranteed</span>
            </div>

            <Link to="/contact" className={styles.ctaDirectCard}>
              <span className={styles.ctaDirectLabel}>DISCOVERY SESSION</span>
              <span className={styles.ctaDirectValue}>Book a Consultation &rarr;</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
