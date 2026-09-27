import React from 'react';
import styles from '../InnerPageHero.module.css';

/**
 * ContactWebVisual
 * Minimalist convergent collaboration nexus in dark red & charcoal hairlines.
 */
export const ContactWebVisual: React.FC = () => {
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
      {/* Concentric subtle resonance arcs */}
      <circle cx={cx} cy={cy} r="54" stroke="rgba(11, 11, 12, 0.12)" strokeWidth="0.85" />
      <circle cx={cx} cy={cy} r="32" stroke="rgba(11, 11, 12, 0.14)" strokeWidth="0.85" strokeDasharray="2 3" />

      {/* Axis guidelines */}
      <line x1="22" y1={cy} x2="118" y2={cy} stroke="rgba(11, 11, 12, 0.14)" strokeWidth="0.85" />
      <line x1={cx} y1="22" x2={cx} y2="118" stroke="rgba(11, 11, 12, 0.14)" strokeWidth="0.85" />

      {/* Convergent silk filament pair from opposite corners */}
      <line
        x1="26"
        y1="26"
        x2={cx}
        y2={cy}
        stroke="#8A141A"
        strokeWidth="1.1"
      />
      <line
        x1="114"
        y1="114"
        x2={cx}
        y2={cy}
        stroke="#8A141A"
        strokeWidth="1.1"
      />

      {/* Terminal anchor beads */}
      <circle cx="26" cy="26" r="2" fill="#8A141A" />
      <circle cx="114" cy="114" r="2" fill="#8A141A" />

      {/* Central luminous collaboration nexus */}
      <circle cx={cx} cy={cy} r="8" stroke="#8A141A" strokeWidth="0.75" opacity="0.6" />
      <circle cx={cx} cy={cy} r="3" fill="#8A141A" />
    </svg>
  );
};
