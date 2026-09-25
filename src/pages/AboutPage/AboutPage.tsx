import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import styles from './AboutPage.module.css';

interface Tenet {
  number: string;
  title: string;
  body: string;
}

const TENETS: Tenet[] = [
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
  const heroRef = useRef<HTMLDivElement>(null);
  const tenetsRef = useRef<HTMLDivElement>(null);
  const symbolRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    const ctx = gsap.context(() => {
      // 1. Hero Entrance
      if (heroRef.current) {
        const title = heroRef.current.querySelector(`.${styles.heroTitle}`);
        const lead = heroRef.current.querySelector(`.${styles.heroLead}`);
        const metrics = heroRef.current.querySelectorAll(`.${styles.metricCard}`);

        gsap.fromTo(
          [title, lead],
          { opacity: 0, y: 36 },
          {
            opacity: 1,
            y: 0,
            duration: 1.1,
            stagger: 0.15,
            ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
          }
        );

        if (metrics.length > 0) {
          gsap.fromTo(
            metrics,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.1,
              ease: 'power3.out',
              delay: 0.35,
            }
          );
        }
      }

      // 2. Tenets Staggered ScrollTrigger Elevation
      if (tenetsRef.current) {
        const cards = tenetsRef.current.querySelectorAll(`.${styles.tenetCard}`);
        gsap.fromTo(
          cards,
          { opacity: 0, y: 40, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            stagger: 0.14,
            ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
            scrollTrigger: {
              trigger: tenetsRef.current,
              start: 'top 80%',
            },
          }
        );
      }

      // 3. Symbol Graphic Tensile Parallax
      if (symbolRef.current) {
        const graphic = symbolRef.current.querySelector(`.${styles.symbolGraphic}`);
        const narrative = symbolRef.current.querySelector(`.${styles.symbolNarrative}`);

        if (graphic) {
          gsap.fromTo(
            graphic,
            { opacity: 0, scale: 0.95 },
            {
              opacity: 1,
              scale: 1,
              duration: 1.2,
              ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
              scrollTrigger: {
                trigger: symbolRef.current,
                start: 'top 75%',
              },
            }
          );
        }

        if (narrative) {
          gsap.fromTo(
            narrative,
            { opacity: 0, x: 25 },
            {
              opacity: 1,
              x: 0,
              duration: 1.0,
              ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
              scrollTrigger: {
                trigger: symbolRef.current,
                start: 'top 75%',
              },
            }
          );
        }
      }
    }, page);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className={styles.page}>
      {/* Hero Section */}
      <section ref={heroRef} className={styles.heroSection}>
        <div className={styles.container}>
          <div className={styles.eyebrow}>
            <span className={styles.crimsonMarker} aria-hidden="true" />
            <span className={styles.eyebrowText}>STUDIO GENESIS // ABOUT ARANEA DEN</span>
          </div>

          <h1 className={styles.heroTitle}>
            WE WEAVE DIGITAL EXPERIENCES.
          </h1>

          <p className={styles.heroLead}>
            Aranea Den is an independent creative technology studio founded by Saikiran Chapa.
            We unite strategy, design architecture, and engineering to build digital ecosystems
            that redefine how modern organizations connect with the world.
          </p>

          <div className={styles.metricsGrid}>
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

      {/* Tenets Section */}
      <section className={styles.tenetsSection}>
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
            {TENETS.map((tenet) => (
              <div key={tenet.number} className={styles.tenetCard}>
                <div>
                  <div className={styles.tenetNumber}>TENET // {tenet.number}</div>
                  <h3 className={styles.tenetTitle}>{tenet.title}</h3>
                </div>
                <p className={styles.tenetBody}>{tenet.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Symbol & Founder Narrative */}
      <section ref={symbolRef} className={styles.symbolSection}>
        <div className={styles.container}>
          <div className={styles.splitGrid}>
            {/* Visual Symbol Graphic */}
            <div className={styles.symbolGraphic}>
              <svg className={styles.tensileSvg} viewBox="0 0 400 400" fill="none">
                <circle cx="200" cy="200" r="160" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1.5" />
                <circle cx="200" cy="200" r="110" stroke="rgba(223, 37, 49, 0.4)" strokeWidth="1.5" />
                <circle cx="200" cy="200" r="60" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="1.5" />
                <line x1="40" y1="200" x2="360" y2="200" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1" />
                <line x1="200" y1="40" x2="200" y2="360" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1" />
                <line x1="87" y1="87" x2="313" y2="313" stroke="rgba(223, 37, 49, 0.3)" strokeWidth="1" />
                <line x1="87" y1="313" x2="313" y2="87" stroke="rgba(223, 37, 49, 0.3)" strokeWidth="1" />
                <circle cx="200" cy="200" r="12" fill="var(--color-crimson, #df2531)" />
                <text x="200" y="380" textAnchor="middle" fill="rgba(255, 255, 255, 0.4)" fontSize="11" fontFamily="var(--font-mono)" letterSpacing="3">
                  ARANEA TENSILE MATRIX
                </text>
              </svg>
            </div>

            {/* Narrative & Founder Quote */}
            <div className={styles.symbolNarrative}>
              <div className={styles.eyebrow}>
                <span className={styles.crimsonMarker} aria-hidden="true" />
                <span className={styles.eyebrowText}>THE ORIGIN OF ARANEA</span>
              </div>

              <h2 className={styles.sectionHeadline}>
                DISCIPLINE OVER FRAGMENTATION.
              </h2>

              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '18px', lineHeight: '1.6', color: 'var(--color-text-secondary, #424348)' }}>
                The name Aranea originates from the architectural marvel of the spider’s web:
                an interconnected, tensile structure where every thread reinforces the integrity
                of the entire system. When you touch one strand, the whole network responds.
              </p>

              <div className={styles.founderNote}>
                <p className={styles.founderQuote}>
                  “We do not build generic websites or commoditized software. We engineer living digital ecosystems
                  that elevate brand authority and perform under planetary load.”
                </p>
                <p className={styles.founderSign}>
                  SAIKIRAN CHAPA — FOUNDER & CREATIVE DIRECTOR
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial CTA */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.eyebrow} style={{ justifyContent: 'center' }}>
            <span className={styles.crimsonMarker} aria-hidden="true" />
            <span className={styles.eyebrowText}>NEXT STEPS</span>
          </div>

          <h2 className={styles.ctaHeadline}>
            READY TO WEAVE SOMETHING REMARKABLE?
          </h2>

          <div className={styles.ctaActions}>
            <Link to="/contact" className={styles.primaryBtn}>
              <span>START AN ENGAGEMENT</span>
              <span>→</span>
            </Link>
            <Link to="/services" className={styles.secondaryBtn}>
              <span>EXPLORE CAPABILITIES</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
