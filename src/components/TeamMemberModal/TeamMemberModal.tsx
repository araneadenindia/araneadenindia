import React, { useEffect, useCallback, useMemo } from 'react';
import { TeamMember } from '../../data/teamData';
import styles from './TeamMemberModal.module.css';

interface TeamMemberModalProps {
  member: TeamMember | null;
  onClose: () => void;
}

export const TeamMemberModal: React.FC<TeamMemberModalProps> = ({ member, onClose }) => {
  // Close on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (member) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [member, handleKeyDown]);

  // Generate rich architectural 360-degree spiderweb geometry (32 spokes, 20 concentric polygon rings, dew nodes, and spiral weaves)
  const webGeometry = useMemo(() => {
    const cx = 1000;
    const cy = 1000;
    const spokeCount = 32;
    const maxRadius = 1420;

    // 20 concentric radii smoothly expanding from center core to outer corners
    const radii = [
      40, 75, 115, 160, 210, 265, 325, 390, 460, 535,
      615, 700, 790, 885, 985, 1090, 1200, 1315, 1430, 1550
    ];

    // Radial Spokes reaching all screen corners
    const spokes: { x1: number; y1: number; x2: number; y2: number; isCrimson: boolean }[] = [];
    for (let i = 0; i < spokeCount; i++) {
      const angle = (i * 2 * Math.PI) / spokeCount;
      const x2 = cx + maxRadius * Math.cos(angle);
      const y2 = cy + maxRadius * Math.sin(angle);
      spokes.push({
        x1: cx,
        y1: cy,
        x2,
        y2,
        isCrimson: i % 4 === 0,
      });
    }

    // Concentric Polygon Web Rings & Dew Drop Intersections
    const rings: { points: string; isCrimson: boolean; opacity: number; strokeWidth: number }[] = [];
    const dewNodes: { cx: number; cy: number; r: number }[] = [];

    radii.forEach((r, rIdx) => {
      const pts: string[] = [];
      const isAccentRing = rIdx % 3 === 0 || rIdx === radii.length - 1;

      for (let i = 0; i < spokeCount; i++) {
        const angle = (i * 2 * Math.PI) / spokeCount;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);

        // Glowing dew drops at key intersections
        if (isAccentRing && i % 2 === 0 && r > 100 && r < 1300) {
          dewNodes.push({ cx: x, cy: y, r: rIdx > 8 ? 3 : 2.2 });
        }
      }

      rings.push({
        points: pts.join(' '),
        isCrimson: isAccentRing,
        opacity: isAccentRing ? 0.9 : 0.45,
        strokeWidth: isAccentRing ? 1.5 : 0.85,
      });
    });

    // 4 Organic Spiral Arcs weaving outward across the web
    const spiralStrands: string[] = [];
    for (let s = 0; s < 4; s++) {
      const offset = (s * Math.PI) / 2;
      let d = '';
      for (let step = 0; step <= 50; step++) {
        const t = step / 50;
        const rad = 60 + t * 1400;
        const theta = offset + t * Math.PI * 3.2;
        const sx = cx + rad * Math.cos(theta);
        const sy = cy + rad * Math.sin(theta);
        d += step === 0 ? `M ${sx.toFixed(1)} ${sy.toFixed(1)}` : ` L ${sx.toFixed(1)} ${sy.toFixed(1)}`;
      }
      spiralStrands.push(d);
    }

    return { spokes, rings, dewNodes, spiralStrands };
  }, []);

  if (!member) return null;

  return (
    <div
      className={`${styles.overlay} ${member ? styles.open : ''}`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${member.name} Details`}
    >
      {/* ── Complete Full-Bleed Architectural Spiderweb in Background ── */}
      <div className={styles.webBackground} aria-hidden="true">
        {/* Layer 1: Primary Rotating Master Web */}
        <svg
          viewBox="0 0 2000 2000"
          className={`${styles.webSvg} ${styles.webSvgPrimary}`}
          fill="none"
          stroke="currentColor"
        >
          {/* Radial Spokes */}
          {webGeometry.spokes.map((s, idx) => (
            <line
              key={`spoke-${idx}`}
              x1={s.x1}
              y1={s.y1}
              x2={s.x2}
              y2={s.y2}
              stroke={s.isCrimson ? 'var(--color-crimson, #df2531)' : 'rgba(255, 255, 255, 0.22)'}
              strokeWidth={s.isCrimson ? 1.6 : 0.9}
              opacity={s.isCrimson ? 0.85 : 0.4}
            />
          ))}

          {/* Concentric Geometric Rings */}
          {webGeometry.rings.map((r, idx) => (
            <polygon
              key={`ring-${idx}`}
              points={r.points}
              stroke={r.isCrimson ? 'var(--color-crimson, #df2531)' : 'rgba(223, 37, 49, 0.42)'}
              strokeWidth={r.strokeWidth}
              opacity={r.opacity}
            />
          ))}

          {/* Spiral Silk Weaves */}
          {webGeometry.spiralStrands.map((d, idx) => (
            <path
              key={`spiral-${idx}`}
              d={d}
              stroke="var(--color-crimson, #df2531)"
              strokeWidth="0.85"
              strokeDasharray="4 6"
              opacity="0.32"
            />
          ))}

          {/* Dew Drop Nodes */}
          {webGeometry.dewNodes.map((n, idx) => (
            <circle
              key={`dew-${idx}`}
              cx={n.cx}
              cy={n.cy}
              r={n.r}
              fill="var(--color-crimson, #df2531)"
              opacity="0.75"
            />
          ))}

          {/* Center Silk Core */}
          <circle cx="1000" cy="1000" r="16" fill="var(--color-crimson, #df2531)" opacity="0.9" />
          <circle cx="1000" cy="1000" r="7" fill="#FFFFFF" />
        </svg>

        {/* Layer 2: Counter-Rotating Secondary Diamond Matrix */}
        <svg
          viewBox="0 0 2000 2000"
          className={`${styles.webSvg} ${styles.webSvgSecondary}`}
          fill="none"
          stroke="currentColor"
        >
          {[160, 320, 480, 640, 820, 1020, 1240, 1480].map((r, idx) => (
            <polygon
              key={`diamond-${idx}`}
              points={`1000,${1000 - r} ${1000 + r},1000 1000,${1000 + r} ${1000 - r},1000`}
              stroke="var(--color-crimson, #df2531)"
              strokeWidth="0.75"
              opacity={0.28 - idx * 0.02}
              strokeDasharray="5 7"
            />
          ))}
        </svg>
      </div>

      {/* ── Glass Modal Window ── */}
      <div
        className={styles.modalCard}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button with Smooth Rotation on Hover */}
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close details"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Member Portrait */}
        <div className={styles.portraitWrap}>
          <img
            src={member.image || (member as any).media?.url || (member.id ? `/team/${member.id}.jpeg` : '/team/saikiran-chapa.jpeg')}
            alt={member.name}
            className={styles.portrait}
          />
          <div className={styles.portraitGlow} aria-hidden="true" />
        </div>

        {/* Content Info */}
        <div className={styles.contentWrap}>
          {/* Eyebrow Role */}
          <div className={styles.roleEyebrow}>
            <span className={styles.crimsonSquare} aria-hidden="true" />
            <span className={styles.roleText}>{member.role}</span>
          </div>

          {/* Member Name */}
          <h2 className={styles.name}>{member.name}</h2>

          {/* Biography */}
          <p className={styles.bio}>{member.bio}</p>

          {/* Social Profiles */}
          <div className={styles.socialRow}>
            {member.linkedin && (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialBtn}
                aria-label={`${member.name} LinkedIn Profile`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28Z" />
                </svg>
                <span>LinkedIn</span>
              </a>
            )}

            {member.instagram && (
              <a
                href={member.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialBtn}
                aria-label={`${member.name} Instagram Profile`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
                <span>Instagram</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberModal;
