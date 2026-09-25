import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './StatementMarquee.module.css';

// 8 statement repetitions ensuring seamless 50% loop
const MARQUEE_ITEMS = Array.from({ length: 8 }, (_, i) => ({
  id: `statement-${i}`,
  text: 'WE CRAFT DIGITAL EXPERIENCES',
}));

export const StatementMarquee: React.FC = () => {
  const tickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ticker = tickerRef.current;
    if (!ticker) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Buttery-smooth, hardware-accelerated linear translation (zero twitching / zero FPS drop)
    const tween = gsap.to(ticker, {
      xPercent: -50,
      ease: 'none',
      duration: 24,
      repeat: -1,
    });

    return () => {
      tween.kill();
    };
  }, []);

  return (
    <section className={styles.section} aria-label="Brand Statement Marquee">
      <div className={styles.inner}>
        <div ref={tickerRef} className={styles.ticker}>
          {MARQUEE_ITEMS.map((item) => (
            <div key={item.id} className={styles.statementItem}>
              {/* Crisp Red Glowing Brand Emblem */}
              <div className={styles.glowingEmblem} aria-hidden="true">
                <img
                  src="/AD Transparent SVG.svg"
                  alt="Aranea Den Brandmark"
                  className={styles.glowingLogo}
                  loading="lazy"
                />
              </div>

              {/* High-Performance Red Glow Typography */}
              <span className={styles.glowingText}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatementMarquee;
