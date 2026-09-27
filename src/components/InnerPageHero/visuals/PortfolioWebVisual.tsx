import React from 'react';
import styles from '../InnerPageHero.module.css';

/**
 * PortfolioWebVisual
 * Minimalist geometric catenary web lattice in dark red & charcoal hairlines.
 */
export const PortfolioWebVisual: React.FC = () => {
  const cx = 70;
  const cy = 70;

  return (
    <svg
      viewBox="0 0 140 140"
      className={styles.visualSvg}
      aria-hidden="true"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Subtle guide circles */}
      <circle cx={cx} cy={cy} r="56" stroke="rgba(11, 11, 12, 0.14)" strokeWidth="0.85" />
      <circle cx={cx} cy={cy} r="32" stroke="rgba(11, 11, 12, 0.12)" strokeWidth="0.85" strokeDasharray="2 3" />

      {/* Axis crosshairs */}
      <line x1="20" y1={cy} x2="120" y2={cy} stroke="rgba(11, 11, 12, 0.16)" strokeWidth="0.85" />
      <line x1={cx} y1="20" x2={cx} y2="120" stroke="rgba(11, 11, 12, 0.16)" strokeWidth="0.85" />

      {/* 4 catenary hyperbolic web curves */}
      <path
        d="M 28 70 Q 70 70 70 28"
        stroke="rgba(11, 11, 12, 0.22)"
        strokeWidth="0.9"
      />
      <path
        d="M 70 28 Q 70 70 112 70"
        stroke="rgba(11, 11, 12, 0.22)"
        strokeWidth="0.9"
      />
      <path
        d="M 112 70 Q 70 70 70 112"
        stroke="rgba(11, 11, 12, 0.22)"
        strokeWidth="0.9"
      />
      <path
        d="M 70 112 Q 70 70 28 70"
        stroke="rgba(11, 11, 12, 0.22)"
        strokeWidth="0.9"
      />

      {/* Cardinal perimeter beads */}
      <circle cx="70" cy="28" r="1.8" fill="#8A141A" />
      <circle cx="112" cy="70" r="1.8" fill="#8A141A" />
      <circle cx="70" cy="112" r="1.8" fill="#8A141A" />
      <circle cx="28" cy="70" r="1.8" fill="#8A141A" />

      {/* Center deep crimson focal node */}
      <circle cx={cx} cy={cy} r="7.5" stroke="#8A141A" strokeWidth="0.75" opacity="0.6" />
      <circle cx={cx} cy={cy} r="2.5" fill="#8A141A" />
    </svg>
  );
};
