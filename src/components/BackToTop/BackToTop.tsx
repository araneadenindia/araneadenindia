import React, { useEffect, useState, useRef } from 'react';
import styles from './BackToTop.module.css';

/**
 * Arachnid Back to Top Component
 * - Styled as a circular obsidian badge with crimson border
 * - Features an upward-pointing spider silhouette as the directional icon
 * - Hover causes subtle arachnid leg motion and glowing aura
 * - Click triggers a silk thread ascent animation and smooth scroll to apex
 */
export const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAscending, setIsAscending] = useState(false);
  const threadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Visible once user has scrolled past 400px
          const scrolledPast = window.scrollY > 400;
          setIsVisible(scrolledPast);
          if (!scrolledPast && !isAscending) {
            setIsAscending(false);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isAscending]);

  const handleAscent = () => {
    if (isAscending) return;
    setIsAscending(true);

    // Smooth fluid scroll to apex
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

    // Reset after climb completes
    setTimeout(() => {
      setIsAscending(false);
      setIsVisible(false);
    }, 850);
  };

  return (
    <div className={styles.container}>
      {/* Upward Silk Thread */}
      <div
        ref={threadRef}
        className={`${styles.silkThread} ${isAscending ? styles.threadActive : ''}`}
        style={{
          height: isAscending ? '100vh' : '0px',
        }}
        aria-hidden="true"
      />

      {/* Spider Badge Button */}
      <button
        onClick={handleAscent}
        className={`${styles.backToTop} ${isVisible ? styles.visible : ''} ${
          isAscending ? styles.ascending : ''
        }`}
        aria-label="Weave back to apex"
        title="Weave back to top"
      >
        <span className={styles.badgeTooltip} aria-hidden="true">
          Top
        </span>

        {/* Upward-pointing Spider Crest */}
        <svg
          viewBox="0 0 24 24"
          className={styles.spiderSvg}
          fill="currentColor"
          aria-hidden="true"
        >
          {/* Head pointing straight UP */}
          <circle cx="12" cy="7.5" r="2.2" />

          {/* Abdomen / Thorax */}
          <ellipse cx="12" cy="14" rx="3.3" ry="4.4" />

          {/* Front Pair of Upward-reaching Legs */}
          <g
            className={styles.legPair1}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.45"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M 10.5 7 L 7.5 4 L 6 1.5" />
            <path d="M 13.5 7 L 16.5 4 L 18 1.5" />
          </g>

          {/* Mid-Upper Angled Legs */}
          <g
            className={styles.legPair2}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.45"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M 9.5 11 L 5 9.5 L 3 11.5" />
            <path d="M 14.5 11 L 19 9.5 L 21 11.5" />
          </g>

          {/* Mid-Lower Angled Legs */}
          <g
            className={styles.legPair3}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.45"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M 9.5 14 L 5.5 15.5 L 4 19" />
            <path d="M 14.5 14 L 18.5 15.5 L 20 19" />
          </g>

          {/* Back Trailing Legs */}
          <g
            className={styles.legPair4}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.45"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M 10.5 17 L 8 20.5 L 7 23" />
            <path d="M 13.5 17 L 16 20.5 L 17 23" />
          </g>
        </svg>
      </button>
    </div>
  );
};

export default BackToTop;
