import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './AboutPage.module.css';

gsap.registerPlugin(ScrollTrigger);

interface BrandValue {
  id: string;
  line1: string;
  line2: string;
  icon: React.ReactNode;
}

const BRAND_VALUES: BrandValue[] = [
  {
    id: 'creative',
    line1: 'CREATIVE',
    line2: 'IDEAS',
    icon: (
      /* Glowing Lightbulb with radiant filaments */
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-1 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
        <path d="M9 18h6" />
        <path d="M10 22h4" />
      </svg>
    ),
  },
  {
    id: 'strategic',
    line1: 'STRATEGIC',
    line2: 'APPROACH',
    icon: (
      /* Concentric Target with Bullseye Arrow */
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: 'quality',
    line1: 'QUALITY',
    line2: 'ASSURED',
    icon: (
      /* Shield with Centered Verified Checkmark */
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    id: 'results',
    line1: 'RESULTS',
    line2: 'DRIVEN',
    icon: (
      /* Fast Ascent Rocket Ship */
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
      </svg>
    ),
  },
];

export const AboutBrandValues: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        itemsRef.current,
        { opacity: 0, y: 30, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className={styles.brandValuesStrip} role="region" aria-label="Aranea Den Brand Core Values">
      <div className={styles.valuesInner}>
        {BRAND_VALUES.map((val, idx) => (
          <React.Fragment key={val.id}>
            <div
              ref={el => { itemsRef.current[idx] = el; }}
              className={styles.valueItem}
            >
              {/* Neon Line Icon with Ground Reflection */}
              <div className={styles.valueIconWrap}>
                <div className={styles.valueIconGlow} aria-hidden="true" />
                <span className={styles.valueIcon}>{val.icon}</span>
              </div>

              {/* Two-Line Clean White Typography */}
              <div className={styles.valueText}>
                <span className={styles.valLine}>{val.line1}</span>
                <span className={styles.valLine}>{val.line2}</span>
              </div>

              {/* Sub-Floor Optical Light Reflection Pool */}
              <div className={styles.floorReflection} aria-hidden="true" />
            </div>

            {/* Vertical Hairline Divider between values */}
            {idx < BRAND_VALUES.length - 1 && (
              <div className={styles.valueDivider} aria-hidden="true" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default AboutBrandValues;
