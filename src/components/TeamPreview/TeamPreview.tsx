import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TEAM_MEMBERS, TeamMember } from '../../data/teamData';
import { TeamMemberModal } from '../TeamMemberModal';
import styles from './TeamPreview.module.css';

gsap.registerPlugin(ScrollTrigger);

interface MemberNodeConfig {
  member: TeamMember;
  gridX: number; // 0-100% on desktop
  gridY: number; // 0-100% on desktop
  connectionX: number; // SVG viewBox 1000x680
  connectionY: number;
}

export const TeamPreview: React.FC = () => {
  const collectiveSectionRef = useRef<HTMLElement>(null);
  const networkStageRef = useRef<HTMLDivElement>(null);

  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [hoveredMemberId, setHoveredMemberId] = useState<string | null>(null);

  // Founder & CEO
  const founder = TEAM_MEMBERS.find((m) => m.id === 'saikiran-chapa') || TEAM_MEMBERS[0];

  // The 7 collective craft members configured in symmetrical mathematical geometry around the Founder
  const surroundingMembers: MemberNodeConfig[] = useMemo(() => {
    const getMember = (id: string) => TEAM_MEMBERS.find((m) => m.id === id) || TEAM_MEMBERS[0];

    return [
      {
        member: getMember('shiva'),
        gridX: 50.0,
        gridY: 10.3,
        connectionX: 500,
        connectionY: 176,
      },
      {
        member: getMember('angle'),
        gridX: 24.0,
        gridY: 18.4,
        connectionX: 308,
        connectionY: 167,
      },
      {
        member: getMember('chandu'),
        gridX: 76.0,
        gridY: 18.4,
        connectionX: 692,
        connectionY: 167,
      },
      {
        member: getMember('surya'),
        gridX: 7.5,
        gridY: 52.2,
        connectionX: 143,
        connectionY: 344,
      },
      {
        member: getMember('pujitha-m'),
        gridX: 92.5,
        gridY: 52.2,
        connectionX: 857,
        connectionY: 344,
      },
      {
        member: getMember('john'),
        gridX: 33.5,
        gridY: 72.1,
        connectionX: 403,
        connectionY: 406,
      },
      {
        member: getMember('jagruthi'),
        gridX: 66.5,
        gridY: 72.1,
        connectionX: 597,
        connectionY: 406,
      },
    ];
  }, []);

  // Clean, Symmetrical Spider-Web Geometry (16 radial spokes, 8 concentric catenary rings centered at 500, 285)
  const webGeometry = useMemo(() => {
    const cx = 500;
    const cy = 285;
    const spokeCount = 16;
    const radii = [105, 160, 220, 285, 355, 430, 515, 610];

    // 16 structural radial spokes radiating outward from Founder perimeter
    const spokes: { x1: number; y1: number; x2: number; y2: number }[] = [];
    for (let i = 0; i < spokeCount; i++) {
      const angle = (i * 2 * Math.PI) / spokeCount;
      spokes.push({
        x1: parseFloat((cx + 72 * Math.cos(angle)).toFixed(1)),
        y1: parseFloat((cy + 72 * Math.sin(angle)).toFixed(1)),
        x2: parseFloat((cx + 640 * Math.cos(angle)).toFixed(1)),
        y2: parseFloat((cy + 640 * Math.sin(angle)).toFixed(1)),
      });
    }

    // 8 concentric catenary rings with smooth, consistent 6% inward dips
    const rings: { d: string; isAccent: boolean; ringClass: string }[] = [];
    radii.forEach((r, rIdx) => {
      let d = '';
      const isAccent = rIdx === 2 || rIdx === 5 || rIdx === radii.length - 1;

      for (let i = 0; i < spokeCount; i++) {
        const a0 = (i * 2 * Math.PI) / spokeCount;
        const a1 = ((i + 1) * 2 * Math.PI) / spokeCount;
        const aMid = (a0 + a1) / 2;
        const x0 = cx + r * Math.cos(a0);
        const y0 = cy + r * Math.sin(a0);
        const x1 = cx + r * Math.cos(a1);
        const y1 = cy + r * Math.sin(a1);
        const sag = 0.06;
        const xc = cx + r * (1 - sag) * Math.cos(aMid);
        const yc = cy + r * (1 - sag) * Math.sin(aMid);

        if (i === 0) {
          d += `M ${x0.toFixed(1)},${y0.toFixed(1)}`;
        }
        d += ` Q ${xc.toFixed(1)},${yc.toFixed(1)} ${x1.toFixed(1)},${y1.toFixed(1)}`;
      }

      rings.push({
        d,
        isAccent,
        ringClass: `tier${rIdx + 1}`,
      });
    });

    return { spokes, rings };
  }, []);

  // Direct Radial Red Lines: Connecting CEO perimeter strictly to each team member (no member-to-member cross lines)
  const radialLines = useMemo(() => {
    const cx = 500;
    const cy = 285;
    const rCeo = 74.5;

    return surroundingMembers.map((item) => {
      const dx = item.connectionX - cx;
      const dy = item.connectionY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const ux = dx / dist;
      const uy = dy / dist;

      const startX = cx + rCeo * ux;
      const startY = cy + rCeo * uy;

      return {
        id: item.member.id,
        path: `M ${startX.toFixed(1)},${startY.toFixed(1)} L ${item.connectionX},${item.connectionY}`,
        dotX: item.connectionX,
        dotY: item.connectionY,
      };
    });
  }, [surroundingMembers]);

  const collectiveMembers = useMemo(() => {
    return TEAM_MEMBERS.filter((m) => m.id !== 'saikiran-chapa');
  }, []);

  const handleOpenMember = useCallback((member: TeamMember) => {
    setSelectedMember(member);
  }, []);

  useEffect(() => {
    const collectiveSection = collectiveSectionRef.current;
    if (!collectiveSection) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth <= 900;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion || isMobile) {
        gsap.set(`.${styles.memberNode}`, { opacity: 1, scale: 1 });
        gsap.set(`.${styles.webRadialLine}`, { opacity: 0.85, strokeWidth: 1.6 });
        gsap.set(`.${styles.connectionDot}`, { opacity: 1, scale: 1 });
        gsap.set(`.${styles.webConcentricArc}`, { opacity: 1 });
        return;
      }

      // Initial State: All surrounding members are HIDDEN at start!
      // Founder and the clean spider-web are visible at first
      gsap.set(`.${styles.memberNode}`, { opacity: 0, scale: 0.86 });
      gsap.set(`.${styles.webRadialLine}`, {
        opacity: 0.18,
        strokeWidth: 1,
      });
      gsap.set(`.${styles.connectionDot}`, {
        opacity: 0.18,
        scale: 0.8,
        transformOrigin: 'center',
      });
      gsap.set(`.${styles.webConcentricArc}`, {
        opacity: 0.8,
      });

      // ── MASTER ONE-BY-ONE SCROLL TIMELINE ──
      // Pinned at full 100vh; scrolling smoothly unrolls each member connected directly to CEO!
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: collectiveSection,
          start: 'top top',
          end: '+=1500',
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
        },
      });

      // 1. Initial Founder Anchor (0.00 - 0.12)
      tl.addLabel('founder', 0);
      tl.fromTo(
        `.${styles.founderRing}`,
        { scale: 0.88, opacity: 0.6 },
        { scale: 1, opacity: 1, duration: 0.12, ease: 'power2.out' },
        'founder'
      );

      // 2. Member 1: SHIVA (Top Center) (0.12 - 0.24)
      tl.addLabel('member_shiva', 0.12);
      tl.to('.line_shiva, .dot_shiva', { opacity: 1, strokeWidth: 1.6, scale: 1, duration: 0.12, ease: 'power2.out' }, 'member_shiva');
      tl.to('.card_shiva', { opacity: 1, scale: 1, duration: 0.12, ease: 'power2.out' }, 'member_shiva');

      // 3. Member 2: ANGLE (Top Left) (0.24 - 0.36)
      tl.addLabel('member_angle', 0.24);
      tl.to('.line_angle, .dot_angle', { opacity: 1, strokeWidth: 1.6, scale: 1, duration: 0.12, ease: 'power2.out' }, 'member_angle');
      tl.to('.card_angle', { opacity: 1, scale: 1, duration: 0.12, ease: 'power2.out' }, 'member_angle');

      // 4. Member 3: CHANDU (Top Right) (0.36 - 0.48)
      tl.addLabel('member_chandu', 0.36);
      tl.to('.line_chandu, .dot_chandu', { opacity: 1, strokeWidth: 1.6, scale: 1, duration: 0.12, ease: 'power2.out' }, 'member_chandu');
      tl.to('.card_chandu', { opacity: 1, scale: 1, duration: 0.12, ease: 'power2.out' }, 'member_chandu');

      // 5. Member 4: SURYA (Mid Left) (0.48 - 0.61)
      tl.addLabel('member_surya', 0.48);
      tl.to('.line_surya, .dot_surya', { opacity: 1, strokeWidth: 1.6, scale: 1, duration: 0.12, ease: 'power2.out' }, 'member_surya');
      tl.to('.card_surya', { opacity: 1, scale: 1, duration: 0.12, ease: 'power2.out' }, 'member_surya');

      // 6. Member 5: PUJITHA M (Mid Right) (0.61 - 0.74)
      tl.addLabel('member_pujitha', 0.61);
      tl.to('.line_pujitha, .line_pujitha_m, .line_pujitha-m, .dot_pujitha, .dot_pujitha_m, .dot_pujitha-m', { opacity: 1, strokeWidth: 1.6, scale: 1, duration: 0.12, ease: 'power2.out' }, 'member_pujitha');
      tl.to('.card_pujitha_m, .card_pujitha-m', { opacity: 1, scale: 1, duration: 0.12, ease: 'power2.out' }, 'member_pujitha');

      // 7. Member 6: JOHN (Bottom Left) (0.74 - 0.87)
      tl.addLabel('member_john', 0.74);
      tl.to('.line_john, .dot_john', { opacity: 1, strokeWidth: 1.6, scale: 1, duration: 0.12, ease: 'power2.out' }, 'member_john');
      tl.to('.card_john', { opacity: 1, scale: 1, duration: 0.12, ease: 'power2.out' }, 'member_john');

      // 8. Member 7: JAGRUTHI (Bottom Right) (0.87 - 1.00)
      tl.addLabel('member_jagruthi', 0.87);
      tl.to('.line_jagruthi, .dot_jagruthi', { opacity: 1, strokeWidth: 1.6, scale: 1, duration: 0.12, ease: 'power2.out' }, 'member_jagruthi');
      tl.to('.card_jagruthi', { opacity: 1, scale: 1, duration: 0.12, ease: 'power2.out' }, 'member_jagruthi');
    }, collectiveSection);

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* ════════════════════════════════════════════════════════════
          PART 1: FOUNDER & CEO SPOTLIGHT (RESTORED AS IT WAS)
          ════════════════════════════════════════════════════════════ */}
      <section id="team" className={styles.section} aria-label="Our Leadership">
        <div className={styles.container}>
          <div className={styles.headerBlock}>
            <div className={styles.eyebrow}>
              <span className={styles.crimsonMarker} aria-hidden="true" />
              <span className={styles.eyebrowText}>THE POWERHOUSE // STUDIO TALENT</span>
            </div>

            <div className={styles.titleRow}>
              <h2 className={styles.mainHeading}>MINDS BEHIND THE CRAFT</h2>
              <p className={styles.headingSub}>
                A multidisciplinary collective of strategists, designers, and engineers united by a
                singular discipline: building meaningful digital experiences with architectural purpose.
              </p>
            </div>
          </div>

          {/* Primary Feature: Founder & CEO Spotlight Card */}
          <div className={styles.founderFeature}>
            <div
              className={styles.founderMedia}
              onClick={() => handleOpenMember(founder)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleOpenMember(founder);
                }
              }}
              aria-label={`View full details for ${founder.name}, ${founder.role}`}
            >
              <img
                src={founder.image}
                alt={founder.name}
                className={styles.founderImage}
                loading="lazy"
              />
              <div className={styles.founderGlow} aria-hidden="true" />
            </div>

            <div className={styles.founderInfo}>
              <div className={styles.founderMeta}>
                <span className={styles.founderRoleBadge}>{founder.role}</span>
              </div>

              <h3 className={styles.founderName}>{founder.name}</h3>

              <blockquote className={styles.founderQuote}>
                “Under his leadership, Aranea Den is shaped around the belief that every digital
                experience should have purpose, clarity, and a meaningful connection with its audience.”
              </blockquote>

              <p className={styles.founderBio}>
                Saikiran Chapa leads Aranea Den with a vision to build a forward-thinking digital
                studio where strategy, creativity, and technology work together to create meaningful
                digital experiences and build distinctive brand identities.
              </p>

              <div className={styles.founderActions}>
                <button
                  type="button"
                  className={styles.exploreBioBtn}
                  onClick={() => handleOpenMember(founder)}
                  aria-label={`Explore full bio for ${founder.name}`}
                >
                  <span>EXPLORE VISION &amp; BIO</span>
                  <span aria-hidden="true">&rarr;</span>
                </button>

                {founder.linkedin && (
                  <a
                    href={founder.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.founderSocialBtn}
                    aria-label={`${founder.name} LinkedIn Profile`}
                    title="LinkedIn"
                  >
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28Z" />
                    </svg>
                  </a>
                )}

                {founder.instagram && (
                  <a
                    href={founder.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.founderSocialBtn}
                    aria-label={`${founder.name} Instagram Profile`}
                    title="Instagram"
                  >
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          PART 2: THE COLLECTIVE — 100VH SPIDER-WEB TEAM NETWORK
          (One-by-one scroll reveal, clean header, authentic catenary web)
          ════════════════════════════════════════════════════════════ */}
      <section
        ref={collectiveSectionRef}
        id="collective-network"
        className={styles.collectiveSection}
        aria-label="The Collective Team Network"
      >
        <div className={styles.collectiveContainer}>
          {/* Clean Subheader: Only Eyebrow & Title */}
          <div className={styles.collectiveHeader}>
            <h3 className={styles.collectiveTitle}>
              <br />
              THE<br />POWERHOUSE
            </h3>
          </div>

          {/* Desktop Direct CEO-to-Team Spider-Web Network Stage */}
          <div ref={networkStageRef} className={styles.networkStage}>
            {/* SVG Authentic Spider-Web Layer (Concentric Catenary Arcs + Radial Spokes + Direct CEO Lines) */}
            <svg
              className={styles.svgWebLayer}
              viewBox="0 0 1000 680"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {/* 1. Structural Radial Spokes (Silvery-Crimson Silk Threads) */}
              {webGeometry.spokes.map((spoke, idx) => (
                <line
                  key={`spoke-${idx}`}
                  x1={spoke.x1}
                  y1={spoke.y1}
                  x2={spoke.x2}
                  y2={spoke.y2}
                  className={styles.webBackgroundSpoke}
                />
              ))}

              {/* 2. Concentric Symmetrical Catenary Web Rings (12 Tiers with Inward Sag Dips) */}
              {webGeometry.rings.map((ring, idx) => (
                <path
                  key={`ring-${idx}`}
                  d={ring.d}
                  className={`${styles.webConcentricArc} ${ring.isAccent ? styles.webConcentricAccent : ''} ${ring.ringClass}`}
                  pathLength="1"
                />
              ))}

              {/* 3. Direct CEO-to-Team Radial Red Silk Lines & Engineered Connection Pins */}
              {radialLines.map((line) => (
                <g key={`radial-group-${line.id}`}>
                  <path
                    d={line.path}
                    className={`${styles.webRadialLine} line_${line.id} line_${line.id.replace(/-/g, '_')} ${
                      hoveredMemberId === line.id ? styles.webRadialLineActive : ''
                    }`}
                    pathLength="1"
                  />
                  <circle
                    cx={line.dotX}
                    cy={line.dotY}
                    r="3.5"
                    className={`${styles.connectionDot} dot_${line.id} dot_${line.id.replace(/-/g, '_')} ${
                      hoveredMemberId === line.id ? styles.connectionDotActive : ''
                    }`}
                  />
                </g>
              ))}

            </svg>

            {/* Center Founder Portrait Node */}
            <button
              type="button"
              className={styles.founderCircleNode}
              onClick={() => handleOpenMember(founder)}
              aria-label={`View full profile for ${founder.name}, ${founder.role}`}
            >
              <div className={styles.founderRing}>
                <img
                  src={founder.image}
                  alt={founder.name}
                  className={styles.founderImg}
                  loading="eager"
                />
                <div className={styles.founderConcentricRings} aria-hidden="true" />
              </div>

              <div className={styles.founderCircleLabel}>
                <h4 className={styles.founderCircleName}>{founder.name}</h4>
                <p className={styles.founderCircleRole}>{founder.role}</p>
              </div>
            </button>

            {/* The Seven Symmetrical Team Member Cards (Unified Self-Contained Cards with Zero Tooltips) */}
            {surroundingMembers.map((item) => {
              const { member, gridX, gridY } = item;

              return (
                <div
                  key={member.id}
                  className={`${styles.memberNode} card_${member.id} card_${member.id.replace(/-/g, '_')}`}
                  style={{
                    left: `${gridX}%`,
                    top: `${gridY}%`,
                  }}
                  onMouseEnter={() => setHoveredMemberId(member.id)}
                  onMouseLeave={() => setHoveredMemberId(null)}
                  onClick={() => handleOpenMember(member)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleOpenMember(member);
                    }
                  }}
                  aria-label={`View profile for ${member.name}, ${member.role}`}
                >
                  <div className={styles.memberCardFrame}>
                    <div className={styles.memberImageWrapper}>
                      <img
                        src={member.image}
                        alt={member.name}
                        className={styles.memberImg}
                        loading="eager"
                      />
                      <div className={styles.hoverActionOverlay} aria-hidden="true">
                        <span className={styles.moreInfoBtn}>
                          More Info
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </div>

                    <div className={styles.memberCardFooter}>
                      <div className={styles.memberNameRow}>
                        <span className={styles.memberName}>{member.name}</span>
                        {member.linkedin && (
                          <a
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.socialIconBtn}
                            onClick={(e) => e.stopPropagation()}
                            aria-label={`${member.name} LinkedIn Profile`}
                            title="LinkedIn"
                          >
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28Z" />
                            </svg>
                          </a>
                        )}
                      </div>
                      <span className={styles.memberRole}>{member.role}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dedicated Mobile Network Layout */}
          <div className={styles.mobileNetworkStage}>
            <button
              type="button"
              className={styles.mobileFounder}
              onClick={() => handleOpenMember(founder)}
              aria-label={`View full profile for ${founder.name}, ${founder.role}`}
            >
              <div className={styles.mobileFounderRing}>
                <img
                  src={founder.image}
                  alt={founder.name}
                  className={styles.mobileFounderImg}
                  loading="eager"
                />
              </div>
              <div className={styles.founderCircleLabel}>
                <h4 className={styles.founderCircleName}>{founder.name}</h4>
                <p className={styles.founderCircleRole}>{founder.role}</p>
              </div>
            </button>

            <div className={styles.mobileGrid}>
              {collectiveMembers.map((member) => (
                <button
                  key={`mobile-${member.id}`}
                  type="button"
                  className={styles.mobileMemberCard}
                  onClick={() => handleOpenMember(member)}
                  aria-label={`View profile for ${member.name}, ${member.role}`}
                >
                  <div className={styles.mobileCardFrame}>
                    <div className={styles.mobileImageWrapper}>
                      <img
                        src={member.image}
                        alt={member.name}
                        className={styles.mobileCardImg}
                        loading="eager"
                      />
                    </div>
                    <div className={styles.memberCardFooter}>
                    <div className={styles.memberNameRow}>
                      <span className={styles.memberName}>{member.name}</span>
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.socialIconBtn}
                          onClick={(e) => e.stopPropagation()}
                          aria-label={`${member.name} LinkedIn Profile`}
                          title="LinkedIn"
                        >
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28Z" />
                          </svg>
                        </a>
                      )}
                    </div>
                    <span className={styles.memberRole}>{member.role}</span>
                  </div>
                </div>
              </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Member Modal */}
      <TeamMemberModal member={selectedMember} onClose={() => setSelectedMember(null)} />
    </>
  );
};

export default TeamPreview;
