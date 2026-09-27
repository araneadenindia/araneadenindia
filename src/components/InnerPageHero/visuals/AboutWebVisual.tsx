import React from 'react';
import styles from '../InnerPageHero.module.css';

/**
 * AboutWebVisual
 * Minimalist, elegant geometric spider-web rosette in dark red & charcoal hairlines.
 */
export const AboutWebVisual: React.FC = () => {
  const cx = 70;
  const cy = 70;
  const spokeCount = 8;
  const rings = [22, 42, 60];

  // 8 radial spokes
  const spokes = Array.from({ length: spokeCount }, (_, i) => {
    const angle = (i * 2 * Math.PI) / spokeCount;
    return {
      x2: cx + Math.cos(angle) * 62,
      y2: cy + Math.sin(angle) * 62,
    };
  });

  // Concentric octagons
  const octagons = rings.map((r) => {
    const points = Array.from({ length: spokeCount }, (_, i) => {
      const angle = (i * 2 * Math.PI) / spokeCount;
      return `${(cx + Math.cos(angle) * r).toFixed(1)},${(cy + Math.sin(angle) * r).toFixed(1)}`;
    }).join(' ');
    return points;
  });

  return (
    <svg
      viewBox="0 0 140 140"
      className={styles.visualSvg}
      aria-hidden="true"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Radial filaments */}
      {spokes.map((s, idx) => (
        <line
          key={`spoke-${idx}`}
          x1={cx}
          y1={cy}
          x2={s.x2}
          y2={s.y2}
          stroke="rgba(11, 11, 12, 0.18)"
          strokeWidth="0.85"
        />
      ))}

      {/* Concentric geometric web rings */}
      {octagons.map((pts, idx) => (
        <polygon
          key={`oct-${idx}`}
          points={pts}
          stroke="rgba(11, 11, 12, 0.18)"
          strokeWidth="0.85"
        />
      ))}

      {/* Center crimson core */}
      <circle cx={cx} cy={cy} r="7.5" stroke="#8A141A" strokeWidth="0.75" strokeDasharray="1.5 2" opacity="0.7" />
      <circle cx={cx} cy={cy} r="2.5" fill="#8A141A" />
    </svg>
  );
};
