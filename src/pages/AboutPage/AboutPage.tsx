import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './AboutPage.module.css';

gsap.registerPlugin(ScrollTrigger);

interface Tenet {
  number: string;
  title: string;
  body: string;
}

const FOUR_TENETS: Tenet[] = [
  {
    number: '01',
    title: 'DISCIPLINARY COHESION',
    body: 'We reject the model of isolated vendors and fragmented handoffs. Strategy, visual architecture, interface craft, and deep computational engineering must be woven together simultaneously to achieve undeniable power.',
  },
  {
    number: '02',
    title: 'MATHEMATICAL RESTRAINT',
    body: 'Inspired by modern Swiss editorial principles, we build with deliberate typographic hierarchy, proportional pacing, and geometric rhythm. True elegance is not what you add, but what you refine until nothing superfluous remains.',
  },
  {
    number: '03',
    title: 'ENGINEERING RIGOR',
    body: 'A beautiful surface over a slow, fragile core is a failure. We architect web platforms and applications with uncompromising performance: sixty frames per second interactions, resilient cloud pipelines, and zero bloat.',
  },
  {
    number: '04',
    title: 'LASTING HUMAN RESONANCE',
    body: 'Technology is merely the loom; the fabric is human connection. Every micro-interaction, transition, and brand touchpoint exists to cultivate trust, authority, and emotional connection between brands and their audiences.',
  },
];

export const AboutPage: React.FC = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const leadRef = useRef<HTMLParagraphElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);
  const tenetsRef = useRef<HTMLDivElement>(null);
  const originRef = useRef<HTMLDivElement>(null);
  const founderRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = 'ABOUT — ARANEA DEN | We Weave Your Digital Experiences';
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });

    const page = pageRef.current;
    if (!page) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // 1. Introduction Headline & Lead Reveal
      if (headlineRef.current && leadRef.current) {
        gsap.fromTo(
          [headlineRef.current, leadRef.current],
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 1.05,
            stagger: 0.15,
            ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
            delay: 0.1,
          }
        );
      }

      // 2. Metrics Elevation
      if (metricsRef.current) {
        const cards = metricsRef.current.querySelectorAll(`.${styles.metricCard}`);
        gsap.fromTo(
          cards,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: metricsRef.current,
              start: 'top 88%',
            },
          }
        );
      }

      // 3. Tenets 2x2 Grid Reveal
      if (tenetsRef.current) {
        const cards = tenetsRef.current.querySelectorAll(`.${styles.tenetCard}`);
        gsap.fromTo(
          cards,
          { opacity: 0, y: 34, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            stagger: 0.12,
            ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
            scrollTrigger: {
              trigger: tenetsRef.current,
              start: 'top 82%',
            },
          }
        );
      }

      // 4. Origin Section Reveal
      if (originRef.current) {
        const illustration = originRef.current.querySelector(`.${styles.webIllustrationCard}`);
        const content = originRef.current.querySelector(`.${styles.originContent}`);

        if (illustration) {
          gsap.fromTo(
            illustration,
            { opacity: 0, scale: 0.96 },
            {
              opacity: 1,
              scale: 1,
              duration: 1.1,
              ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
              scrollTrigger: {
                trigger: originRef.current,
                start: 'top 80%',
              },
            }
          );
        }

        if (content) {
          gsap.fromTo(
            content,
            { opacity: 0, x: 24 },
            {
              opacity: 1,
              x: 0,
              duration: 1.0,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: originRef.current,
                start: 'top 80%',
              },
            }
          );
        }
      }

      // 5. Founder Card Reveal
      if (founderRef.current) {
        gsap.fromTo(
          founderRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.95,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: founderRef.current,
              start: 'top 85%',
            },
          }
        );
      }

      // 6. CTA Reveal
      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current,
          { opacity: 0, y: 26 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: ctaRef.current,
              start: 'top 88%',
            },
          }
        );
      }
    }, page);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className={styles.aboutPage}>

      {/* ── SECTION 1 — INTRODUCTION ── */}
      <section className={styles.introSection} aria-label="Introduction & Studio Genesis">
        <div className={styles.container}>
          <div className={styles.eyebrow}>
            <span className={styles.crimsonMarker} aria-hidden="true" />
            <span className={styles.eyebrowText}>STUDIO GENESIS // ABOUT ARANEA DEN</span>
          </div>

          <h1 ref={headlineRef} className={styles.headline}>
            WE WEAVE YOUR DIGITAL EXPERIENCES.
          </h1>

          <p ref={leadRef} className={styles.introLead}>
            Aranea Den is an independent creative technology studio. We unite strategy, design architecture,
            and high-performance computational engineering to build digital flagships and living software
            ecosystems that redefine how ambitious organizations connect with the world.
          </p>
        </div>
      </section>

      {/* ── SECTION 2 — STUDIO METRICS ROW ── */}
      <section className={styles.metricsSection} aria-label="Studio Capabilities and Standards">
        <div className={styles.container}>
          <div ref={metricsRef} className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <span className={styles.metricValue}>08</span>
              <span className={styles.metricLabel}>CONNECTED DISCIPLINES</span>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.metricValue}>100%</span>
              <span className={styles.metricLabel}>BESPOKE ARCHITECTURE</span>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.metricValue}>60 FPS</span>
              <span className={styles.metricLabel}>COMPUTATIONAL RIGOR</span>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.metricValue}>GLOBAL</span>
              <span className={styles.metricLabel}>STUDIO COLLABORATION</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3 — OUR FOUR TENETS ── */}
      <section className={styles.tenetsSection} aria-label="The Four Tenets of Our Craft">
        <div className={styles.container}>
          <div className={styles.tenetsHeader}>
            <div className={styles.eyebrow}>
              <span className={styles.crimsonMarker} aria-hidden="true" />
              <span className={styles.eyebrowText}>FOUNDATIONAL VALUES</span>
            </div>
            <h2 className={styles.sectionHeadline}>
              THE FOUR TENETS OF OUR CRAFT.
            </h2>
          </div>

          <div ref={tenetsRef} className={styles.tenetsGrid}>
            {FOUR_TENETS.map((tenet) => (
              <div key={tenet.number} className={styles.tenetCard}>
                <div>
                  <div className={styles.tenetTop}>
                    <span className={styles.tenetNumber}>TENET // {tenet.number}</span>
                    <span className={styles.tenetIndicator} aria-hidden="true" />
                  </div>
                  <h3 className={styles.tenetTitle}>{tenet.title}</h3>
                </div>
                <p className={styles.tenetBody}>{tenet.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 4 — THE ORIGIN OF ARANEA (BALANCED 2-COLUMN) ── */}
      <section ref={originRef} className={styles.originSection} aria-label="The Origin of Aranea">
        <div className={styles.container}>
          <div className={styles.originSplitGrid}>

            {/* Left: Contained Light Card with Refined Spider-Web Illustration */}
            <div className={styles.webIllustrationCard}>
              <svg
                viewBox="0 0 360 360"
                className={styles.webSvgContained}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                {/* Concentric Architectural Web Rings */}
                <ellipse cx="180" cy="180" rx="145" ry="145" stroke="rgba(11, 11, 12, 0.08)" strokeWidth="1.2" />
                <ellipse cx="180" cy="180" rx="110" ry="110" stroke="rgba(223, 37, 49, 0.28)" strokeWidth="1.2" strokeDasharray="3 3" />
                <ellipse cx="180" cy="180" rx="75" ry="75" stroke="rgba(11, 11, 12, 0.12)" strokeWidth="1.2" />
                <ellipse cx="180" cy="180" rx="40" ry="40" stroke="rgba(223, 37, 49, 0.35)" strokeWidth="1.2" />

                {/* 12 Radiating Tensile Filaments */}
                <line x1="35" y1="180" x2="325" y2="180" stroke="rgba(11, 11, 12, 0.1)" strokeWidth="1.2" />
                <line x1="180" y1="35" x2="180" y2="325" stroke="rgba(11, 11, 12, 0.1)" strokeWidth="1.2" />
                <line x1="77" y1="77" x2="283" y2="283" stroke="rgba(223, 37, 49, 0.2)" strokeWidth="1.2" />
                <line x1="77" y1="283" x2="283" y2="77" stroke="rgba(223, 37, 49, 0.2)" strokeWidth="1.2" />

                {/* Tangent Polygonal Connector Lines */}
                <polygon
                  points="180,70 258,102 290,180 258,258 180,290 102,258 70,180 102,102"
                  stroke="rgba(223, 37, 49, 0.3)"
                  strokeWidth="1.1"
                />

                {/* Central Crimson Nucleus Anchor */}
                <circle cx="180" cy="180" r="16" fill="rgba(223, 37, 49, 0.08)" />
                <circle cx="180" cy="180" r="8" fill="var(--color-crimson, #df2531)" />
                <circle cx="180" cy="180" r="3" fill="#FFFFFF" />

                {/* Peripheral Anchor Nodes */}
                <circle cx="180" cy="35" r="3" fill="var(--color-crimson, #df2531)" />
                <circle cx="180" cy="325" r="3" fill="var(--color-crimson, #df2531)" />
                <circle cx="35" cy="180" r="3" fill="var(--color-crimson, #df2531)" />
                <circle cx="325" cy="180" r="3" fill="var(--color-crimson, #df2531)" />
              </svg>
            </div>

            {/* Right: Editorial Narrative */}
            <div className={styles.originContent}>
              <div className={styles.eyebrow}>
                <span className={styles.crimsonMarker} aria-hidden="true" />
                <span className={styles.eyebrowText}>THE ORIGIN OF ARANEA</span>
              </div>

              <h2 className={styles.originHeadline}>
                DISCIPLINE OVER FRAGMENTATION.
              </h2>

              <p className={styles.originParagraph}>
                The name Aranea originates from the architectural marvel of the spider’s web:
                an interconnected, tensile structure where every thread reinforces the integrity
                of the entire system. When you touch one strand, the whole network responds.
              </p>

              <p className={styles.originParagraph}>
                We do not operate as an assembly of disconnected specialists. We build cohesive digital
                ecosystems where strategy, interface design, computational engineering, motion, and cloud
                infrastructure reinforce one another into a singular experience.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── SECTION 5 — FOUNDER'S EDITORIAL QUOTE ── */}
      <section ref={founderRef} className={styles.founderSection} aria-label="Founder Direction">
        <div className={styles.container}>
          <div className={styles.founderQuoteCard}>
            <div className={styles.founderPortraitWrap}>
              <img
                src="/team/saikiran-chapa.jpeg"
                alt="Saikiran Chapa — Founder & Creative Director"
                className={styles.founderPortrait}
                loading="lazy"
              />
            </div>

            <div className={styles.quoteContent}>
              <blockquote className={styles.quoteText}>
                “We do not build generic websites or commoditized software. We engineer living digital ecosystems
                that elevate brand authority and perform under planetary load.”
              </blockquote>

              <div className={styles.founderMeta}>
                <span className={styles.founderName}>SAIKIRAN CHAPA</span>
                <span style={{ color: 'rgba(11, 11, 12, 0.25)' }}>/</span>
                <span className={styles.founderRole}>FOUNDER & CREATIVE DIRECTOR</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 6 — EDITORIAL CALL TO ACTION ── */}
      <section ref={ctaRef} className={styles.ctaSection} aria-label="Next Steps & Collaboration">
        <div className={styles.container}>
          <div className={styles.ctaContainer}>
            <div className={styles.eyebrow} style={{ justifyContent: 'center' }}>
              <span className={styles.crimsonMarker} aria-hidden="true" />
              <span className={styles.eyebrowText}>INITIATE COLLABORATION</span>
            </div>

            <h2 className={styles.ctaHeadline}>
              READY TO WEAVE SOMETHING REMARKABLE?
            </h2>

            <p className={styles.ctaSubtitle}>
              Let’s discuss how our connected disciplines can accelerate your brand’s digital presence.
            </p>

            <div className={styles.ctaButtons}>
              <Link to="/contact" className={styles.primaryCta} aria-label="Start an engagement">
                <span>START AN ENGAGEMENT</span>
                <span className={styles.arrow} aria-hidden="true">&rarr;</span>
              </Link>
              <Link to="/services" className={styles.secondaryCta} aria-label="Explore capabilities">
                <span>EXPLORE CAPABILITIES</span>
                <span className={styles.arrow} aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;
