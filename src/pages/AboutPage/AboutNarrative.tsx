import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './AboutPage.module.css';

gsap.registerPlugin(ScrollTrigger);

interface Pillar {
  number: string;
  title: string;
  body: string;
}

const NARRATIVE_PILLARS: Pillar[] = [
  {
    number: '01',
    title: 'WHO WE ARE',
    body: 'Aranea Den is an independent creative technology studio. We reject the fragmented model of disconnected agencies and siloed vendors, weaving strategy, interface architecture, and high-velocity engineering into a singular digital organism.',
  },
  {
    number: '02',
    title: 'OUR MISSION',
    body: 'To engineer digital flagships and systems that command undeniable authority, operate with sixty-frames-per-second computational rigor, and elevate ambitious brands to the undisputed summit of their industries.',
  },
  {
    number: '03',
    title: 'OUR APPROACH',
    body: 'Inspired by the tensile perfection of the spider’s web, we construct living digital ecosystems where every strand reinforces the whole. Strategy directs design, design informs code, and code accelerates compounding growth.',
  },
];

export const AboutNarrative: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const pillarsRef = useRef<(HTMLDivElement | null)[]>([]);
  const founderCardRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // 1. Header Reveal
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 1.0,
            ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
            scrollTrigger: {
              trigger: headerRef.current,
              start: 'top 85%',
            },
          }
        );
      }

      // 2. Pillars Staggered Reveal
      if (pillarsRef.current.length > 0) {
        gsap.fromTo(
          pillarsRef.current,
          { opacity: 0, y: 36, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            stagger: 0.14,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: pillarsRef.current[0],
              start: 'top 85%',
            },
          }
        );
      }

      // 3. Founder Card Reveal
      if (founderCardRef.current) {
        gsap.fromTo(
          founderCardRef.current,
          { opacity: 0, x: 28 },
          {
            opacity: 1,
            x: 0,
            duration: 1.0,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: founderCardRef.current,
              start: 'top 82%',
            },
          }
        );
      }

      // 4. CTA Reveal
      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current,
          { opacity: 0, y: 30 },
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
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.narrativeSection} aria-label="About Aranea Den — Vision and Leadership">
      <div className={styles.narrativeContainer}>

        {/* ── Section Header ── */}
        <div ref={headerRef} className={styles.narrativeHeader}>
          <div className={styles.eyebrow}>
            <span className={styles.crimsonMarker} aria-hidden="true" />
            <span className={styles.eyebrowText}>STUDIO GENESIS // PURPOSE & LEADERSHIP</span>
          </div>

          <h2 className={styles.narrativeHeadline}>
            THE ARCHITECTURE OF INTERCONNECTION.
          </h2>

          <p className={styles.narrativeLead}>
            Aranea Den was forged to bridge the gap between creative artistry and computational precision.
            Every interface, line of code, and digital touchpoint is woven to perform seamlessly as one.
          </p>
        </div>

        {/* ── Split Grid: 3 Pillars on Left, Founder on Right ── */}
        <div className={styles.narrativeSplitGrid}>

          {/* Left Column: 3 Pillars */}
          <div className={styles.pillarsColumn}>
            {NARRATIVE_PILLARS.map((pillar, idx) => (
              <div
                key={pillar.number}
                ref={el => { pillarsRef.current[idx] = el; }}
                className={styles.pillarItem}
              >
                <div className={styles.pillarHeader}>
                  <span className={styles.pillarNumber}>{pillar.number}</span>
                  <span className={styles.pillarDivider} aria-hidden="true" />
                  <h3 className={styles.pillarTitle}>{pillar.title}</h3>
                </div>
                <p className={styles.pillarBody}>{pillar.body}</p>
              </div>
            ))}
          </div>

          {/* Right Column: Founder & Creative Director Showcase */}
          <div ref={founderCardRef} className={styles.founderColumn}>
            <div className={styles.founderCard}>
              <div className={styles.founderGlowRing} aria-hidden="true" />

              {/* Founder Image Frame */}
              <div className={styles.founderImageWrap}>
                <img
                  src="/team/saikiran-chapa.jpeg"
                  alt="Saikiran Chapa — Founder & Creative Director"
                  className={styles.founderImage}
                  loading="lazy"
                />
                <div className={styles.founderImageOverlay} />
              </div>

              {/* Founder Meta & Quote */}
              <div className={styles.founderDetails}>
                <div className={styles.founderRoleBadge}>
                  <span className={styles.founderDot} />
                  <span>STUDIO LEADERSHIP</span>
                </div>

                <h3 className={styles.founderName}>SAIKIRAN CHAPA</h3>
                <p className={styles.founderRole}>FOUNDER & CREATIVE DIRECTOR</p>

                <blockquote className={styles.founderQuote}>
                  “True digital excellence is not what you add, but the mathematical harmony you achieve
                  when strategy, design, and computational rigor become one.”
                </blockquote>

                {/* Verified LinkedIn Button */}
                <div className={styles.founderSocialWrap}>
                  <a
                    href="https://www.linkedin.com/in/saikiranchapa/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.founderLinkedIn}
                    aria-label="Connect with Saikiran Chapa on LinkedIn"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28Z"/>
                    </svg>
                    <span>CONNECT ON LINKEDIN</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ── Closing Call To Action ── */}
        <div ref={ctaRef} className={styles.aboutCtaStrip}>
          <div className={styles.ctaGlow} aria-hidden="true" />
          <div className={styles.ctaContent}>
            <div className={styles.eyebrow} style={{ justifyContent: 'center' }}>
              <span className={styles.crimsonMarker} aria-hidden="true" />
              <span className={styles.eyebrowText}>INITIATE COLLABORATION</span>
            </div>

            <h2 className={styles.ctaHeadline}>
              READY TO WEAVE SOMETHING REMARKABLE?
            </h2>

            <p className={styles.ctaSub}>
              Let’s connect strategy, design, and computational engineering for your brand.
            </p>

            <div className={styles.ctaButtonRow}>
              <Link to="/contact" className={styles.ctaPrimaryBtn} aria-label="Start a project with Aranea Den">
                <span>START A PROJECT</span>
                <span className={styles.ctaArrow} aria-hidden="true">&rarr;</span>
              </Link>
              <Link to="/services" className={styles.ctaSecondaryBtn} aria-label="Explore Aranea Den services">
                <span>EXPLORE CAPABILITIES</span>
                <span className={styles.ctaArrow} aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default AboutNarrative;
