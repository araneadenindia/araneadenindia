import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
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

      // 02 — Vision & Mission (Editorial story rows reveal)
      if (visionRef.current) {
        const header = visionRef.current.querySelector(`.${styles.visionHeader}`);
        const storyRows = visionRef.current.querySelectorAll(`.${styles.visionStoryRow}`);

        if (header) {
          gsap.fromTo(
            header,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: visionRef.current,
                start: 'top 82%',
              },
            }
          );
        }

        if (storyRows.length) {
          storyRows.forEach((row) => {
            gsap.fromTo(
              row,
              { opacity: 0, y: 30 },
              {
                opacity: 1,
                y: 0,
                duration: 0.85,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: row,
                  start: 'top 82%',
                },
              }
            );
          });
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
              {/* Breadcrumb Navigation matching Services, Portfolio, Contact */}
              <nav className={styles.breadcrumb} aria-label="Breadcrumb">
                <Link to="/" className={styles.breadcrumbLink}>
                  HOME
                </Link>
                <span className={styles.breadcrumbSep}>/</span>
                <span className={styles.breadcrumbActive}>ABOUT</span>
              </nav>

              {/* Eyebrow with crimson square indicator */}
              <div className={styles.heroEyebrow}>
                <span className={styles.eyebrowDot} />
                <span className={styles.eyebrowText}>WHO WE ARE</span>
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

              {/* Stats Counter Row matching Services page */}
              <div className={styles.heroStats}>
                <div className={styles.heroStat}>
                  <span className={styles.statNum}>2025</span>
                  <span className={styles.statLabel}>Founded</span>
                </div>
                <div className={styles.heroStatDivider} />
                <div className={styles.heroStat}>
                  <span className={styles.statNum}>15+</span>
                  <span className={styles.statLabel}>Services</span>
                </div>
                <div className={styles.heroStatDivider} />
                <div className={styles.heroStat}>
                  <span className={styles.statNum}>1</span>
                  <span className={styles.statLabel}>Ecosystem</span>
                </div>
              </div>

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
                <img
                  src="/about/ad-spider-services.jpg"
                  alt="Aranea Den — Creative Technology Studio Ecosystem"
                  className={styles.heroEcosystemImg}
                  loading="eager"
                />
                <div className={styles.heroVisualFrameBorder} aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────
          02 — VISION & MISSION (EDITORIAL REDESIGN)
          Sophisticated editorial architecture with authentic project visuals,
          generous spacing, and storytelling rhythm.
      ───────────────────────────────────────── */}
      <section ref={visionRef} className={styles.visionMissionSection} aria-labelledby="vision-title">
        <div className={styles.container}>
          <div className={styles.visionHeader}>
            <div className={styles.visionEyebrow}>
              <span className={styles.eyebrowMarker} aria-hidden="true" />
              <span className={styles.eyebrowText}>GUIDING PURPOSE</span>
            </div>
            <h2 id="vision-title" className={styles.visionHeading}>
              VISION &amp; MISSION
            </h2>
            <p className={styles.visionIntro}>
              Where computational rigor converges with creative ambition to engineer enduring digital reality.
            </p>
          </div>

          <div className={styles.visionStoryContainer}>
            {/* Story 01 — OUR VISION */}
            <div className={styles.visionStoryRow}>
              <div className={styles.storyTextCol}>
                <div className={styles.storyBadgeRow}>
                  <span className={styles.storyIndex}>01</span>
                  <span className={styles.storyDividerLine} aria-hidden="true" />
                  <span className={styles.storyTag}>OUR VISION</span>
                </div>

                <h3 className={styles.storyHeading}>THE WORLD WE ARE BUILDING</h3>

                <p className={styles.storyParagraph}>
                  To be recognized globally as a benchmark creative technology studio where imagination meets engineering rigor. We envision a digital landscape where brands do not simply broadcast messages, but build meaningful, enduring ecosystems that enrich user lives and accelerate business growth.
                </p>

                <div className={styles.storyPointsList}>
                  <div className={styles.storyPointItem}>
                    <span className={styles.storyPointBullet} aria-hidden="true" />
                    <div className={styles.storyPointContent}>
                      <span className={styles.storyPointTitle}>BOLD CREATIVE HORIZONS</span>
                      <span className={styles.storyPointDesc}>Uniting cinematic visual narrative with high-conversion product strategy.</span>
                    </div>
                  </div>
                  <div className={styles.storyPointItem}>
                    <span className={styles.storyPointBullet} aria-hidden="true" />
                    <div className={styles.storyPointContent}>
                      <span className={styles.storyPointTitle}>LIVING DIGITAL ECOSYSTEMS</span>
                      <span className={styles.storyPointDesc}>Engineering scalable digital architectures that outlast shifting market cycles.</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.storyVisualCol}>
                <div className={styles.cinematicStudioFrame}>
                  <img
                    src="/about/vision.jpg"
                    alt="Aranea Den Vision — Ideas, Design, Technology, Content, Growth"
                    className={styles.cinematicFrameImg}
                    loading="lazy"
                  />
                  <div className={styles.frameBorderOverlay} aria-hidden="true" />
                </div>
              </div>
            </div>

            {/* Story 02 — OUR MISSION */}
            <div className={styles.visionStoryRow}>
              <div className={`${styles.storyVisualCol} ${styles.invertOnMobile}`}>
                <div className={styles.cinematicStudioFrame}>
                  <img
                    src="/about/mission.jpg"
                    alt="Aranea Den Mission — Idea, Design, Develop, Produce, Deliver"
                    className={styles.cinematicFrameImg}
                    loading="lazy"
                  />
                  <div className={styles.frameBorderOverlay} aria-hidden="true" />
                </div>
              </div>

              <div className={styles.storyTextCol}>
                <div className={styles.storyBadgeRow}>
                  <span className={styles.storyIndex}>02</span>
                  <span className={styles.storyDividerLine} aria-hidden="true" />
                  <span className={styles.storyTag}>OUR MISSION</span>
                </div>

                <h3 className={styles.storyHeading}>WHAT WE DO EVERY DAY</h3>

                <p className={styles.storyParagraph}>
                  To empower visionary entrepreneurs, forward-thinking institutions, and emerging brands by designing and engineering superior digital products. We bridge the gap between aesthetic beauty and technical precision, delivering measurable competitive advantage with relentless craft.
                </p>

                <div className={styles.storyPointsList}>
                  <div className={styles.storyPointItem}>
                    <span className={styles.storyPointBullet} aria-hidden="true" />
                    <div className={styles.storyPointContent}>
                      <span className={styles.storyPointTitle}>ZERO-COMPROMISE CRAFT</span>
                      <span className={styles.storyPointDesc}>Pixel-level polish, fluid physics, and intentionality across all viewports.</span>
                    </div>
                  </div>
                  <div className={styles.storyPointItem}>
                    <span className={styles.storyPointBullet} aria-hidden="true" />
                    <div className={styles.storyPointContent}>
                      <span className={styles.storyPointTitle}>MEASURABLE ADVANTAGE</span>
                      <span className={styles.storyPointDesc}>Turning technical rigor and design excellence into real business performance.</span>
                    </div>
                  </div>
                </div>
              </div>
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
