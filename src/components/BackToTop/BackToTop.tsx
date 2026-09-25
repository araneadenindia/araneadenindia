import React, { useEffect, useState } from 'react';
import { usePreloader } from '../../context/PreloaderContext';
import styles from './BackToTop.module.css';

export const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { triggerAscend } = usePreloader();

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolledPast = window.scrollY > 450;
          setIsVisible(scrolledPast);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleAscentToTop = () => {
    triggerAscend();
  };

  return (
    <button
      onClick={handleAscentToTop}
      className={`${styles.backToTop} ${isVisible ? styles.visible : ''}`}
      aria-label="Back to top"
      title="Return to top"
    >
      <svg className={styles.arrowIcon} viewBox="0 0 16 16" fill="none">
        <path
          d="M8 12.5V3.5M8 3.5L3.5 8M8 3.5L12.5 8"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
};

export default BackToTop;
