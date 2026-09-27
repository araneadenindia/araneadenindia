import React from 'react';
import styles from '../InnerPageHero.module.css';

/**
 * ServicesWebVisual
 * Minimalist 8-fold radial web cluster with dark red nodes.
 */
export const ServicesWebVisual: React.FC = () => {
  const cx = 70;
  const cy = 70;
  const spokeCount = 8;
  const outerR = 58;
  const innerR = 30;

  // 8 radial spokes & outer node coordinates
  const nodes = Array.from({ length: spokeCount }, (_, i) => {
    const angle = (i * 2 * Math.PI) / spokeCount - Math.PI / 2;
    return {
      x: cx + Math.cos(angle) * outerR,
      y: cy + Math.sin(angle) * outerR,
      innerX: cx + Math.cos(angle) * innerR,
      innerY: cy + Math.sin(angle) * innerR,
    };
  });

  const outerPoints = nodes.map((n) => `${n.x.toFixed(1)},${n.y.toFixed(1)}`).join(' ');
  const innerPoints = nodes.map((n) => `${n.innerX.toFixed(1)},${n.innerY.toFixed(1)}`).join(' ');

  return (
    <svg
      viewBox="0 0 140 140"
      className={styles.visualSvg}
      aria-hidden="true"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 8 radial silk rays */}
      {nodes.map((n, idx) => (
        <line
          key={`spoke-${idx}`}
          x1={cx}
          y1={cy}
          x2={n.x}
          y2={n.y}
          stroke="rgba(11, 11, 12, 0.18)"
          strokeWidth="0.85"
        />
      ))}

      {/* Inner subtle connecting polygon */}
      <polygon
        points={innerPoints}
        stroke="rgba(11, 11, 12, 0.14)"
        strokeWidth="0.85"
        strokeDasharray="2 2"
      />

      {/* Outer structural web polygon */}
      <polygon
        points={outerPoints}
        stroke="rgba(11, 11, 12, 0.22)"
        strokeWidth="0.85"
      />

      {/* Subtle nodes on the outer perimeter */}
      {nodes.map((n, idx) => (
        <circle
          key={`node-${idx}`}
          cx={n.x}
          cy={n.y}
          r="1.8"
          fill="#8A141A"
        />
      ))}

      {/* Central deep crimson hub */}
      <circle cx={cx} cy={cy} r="6.5" stroke="#8A141A" strokeWidth="0.75" opacity="0.6" />
      <circle cx={cx} cy={cy} r="2.5" fill="#8A141A" />
    </svg>
  );
};
