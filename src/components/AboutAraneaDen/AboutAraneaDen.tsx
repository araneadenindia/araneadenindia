import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import styles from './AboutAraneaDen.module.css';

export const AboutAraneaDen: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const statementRef = useRef<HTMLHeadingElement>(null);
  const narrativeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // 1. Big Statement reveal
      if (statementRef.current) {
        gsap.fromTo(statementRef.current,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 1.05,
            ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
            scrollTrigger: {
              trigger: statementRef.current,
              start: 'top 82%',
            },
          }
        );
      }

      // 2. Narrative Column staggered arrival
      const narrativeItems = narrativeRef.current?.children;
      if (narrativeItems && narrativeItems.length > 0) {
        gsap.fromTo(narrativeItems,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.12,
            ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
            scrollTrigger: {
              trigger: narrativeRef.current,
              start: 'top 80%',
            },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about" className={styles.section} aria-label="About Aranea Den">
      <div className={styles.container}>
        {/* Eyebrow Label */}
        <div className={styles.eyebrow}>
          <span className={styles.crimsonMarker} aria-hidden="true" />
          <span className={styles.eyebrowText}>ABOUT ARANEA DEN</span>
        </div>

        {/* Editorial Split Layout */}
        <div className={styles.splitGrid}>
          {/* Left Column: Big Statement */}
          <div className={styles.statementCol}>
            <h2 ref={statementRef} className={styles.bigStatement}>
              Identity is rooted in the idea of connection. The web represents how we bring different
              disciplines together to create complete digital experiences.
            </h2>
          </div>

          {/* Right Column: Narrative & Action */}
          <div ref={narrativeRef} className={styles.narrativeCol}>
            <p className={styles.paragraph}>
              Great digital experiences are never made from isolated pieces. From brand and web to apps,
              campaigns, and cloud infrastructure, we connect every element with purposeful execution.
            </p>
            <p className={styles.paragraph}>
              Founded by Saikiran Chapa, Aranea Den works with emerging brands and established organizations
              seeking distinctive digital presence, cohesive systems, and lasting impact.
            </p>

            <div className={styles.ctaWrap}>
              <Link to="/about" className={styles.aboutLink} aria-label="Learn more about Aranea Den">
                <span>ABOUT ARANEA DEN</span>
                <span className={styles.arrow} aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
