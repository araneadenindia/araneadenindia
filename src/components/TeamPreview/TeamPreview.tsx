import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TEAM_MEMBERS, TeamMember } from '../../data/teamData';
import { TeamMemberModal } from '../TeamMemberModal';
import styles from './TeamPreview.module.css';

gsap.registerPlugin(ScrollTrigger);

export const TeamPreview: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const founderWrapRef = useRef<HTMLDivElement>(null);
  const founderImgRef = useRef<HTMLImageElement>(null);
  const galleryItemsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const founder = TEAM_MEMBERS.find((m) => m.id === 'saikiran-chapa') || TEAM_MEMBERS[0];
  const collectiveMembers = TEAM_MEMBERS.filter((m) => m.id !== 'saikiran-chapa');

  // Specific asymmetrical layout classes for each collective member
  const getColClass = (id: string) => {
    switch (id) {
      case 'angle':
        return styles.colAngle;
      case 'shiva':
        return styles.colShiva;
      case 'chandu':
        return styles.colChandu;
      case 'surya':
        return styles.colSurya;
      case 'john':
        return styles.colJohn;
      case 'jagruthi':
        return styles.colJagruthi;
      case 'pujitha-m':
        return styles.colPujitha;
      default:
        return '';
    }
  };

  const handleOpenMember = useCallback((member: TeamMember) => {
    setSelectedMember(member);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // 1. Header reveal
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current.children,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: headerRef.current,
              start: 'top 82%',
            },
          }
        );
      }

      // 2. Founder Showcase reveal + subtle portrait parallax
      if (founderWrapRef.current) {
        gsap.fromTo(
          founderWrapRef.current,
          { opacity: 0, y: 36 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: founderWrapRef.current,
              start: 'top 80%',
            },
          }
        );

        if (founderImgRef.current) {
          gsap.fromTo(
            founderImgRef.current,
            { yPercent: -4, scale: 1.06 },
            {
              yPercent: 4,
              scale: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: founderWrapRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.6,
              },
            }
          );
        }
      }

      // 3. Staggered gallery entrances
      const items = galleryItemsRef.current.filter(Boolean);
      if (items.length > 0) {
        gsap.fromTo(
          items,
          { opacity: 0, y: 36 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.09,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: items[0],
              start: 'top 82%',
            },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="team" className={styles.section} aria-label="Our Team">
      <div className={styles.container}>
        {/* ── 1. Editorial Header / Intro ── */}
        <div ref={headerRef} className={styles.headerBlock}>
          <div className={styles.eyebrow}>
            <span className={styles.crimsonMarker} aria-hidden="true" />
            <span className={styles.eyebrowText}>THE POWERHOUSE</span>
          </div>

          <div className={styles.titleRow}>
            <h2 className={styles.heading}>MINDS BEHIND THE CRAFT</h2>

            <div className={styles.headerIntro}>
              <p className={styles.introText}>
                We are strategists, designers, engineers, and visual storytellers. Every digital
                experience we build is handcrafted with purpose, precision, and an obsession with
                lasting impact.
              </p>
              <Link to="/team" className={styles.meetAllBtn} aria-label="Meet the full Aranea Den team">
                <span>MEET ALL 8 SPECIALISTS</span>
                <span className={styles.btnArrow} aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ── 2. Primary Feature: Founder & CEO ── */}
        <div ref={founderWrapRef} className={styles.founderFeature}>
          {/* Large Cinematic Portrait */}
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
            aria-label={`View details for ${founder.name}, ${founder.role}`}
          >
            <img
              ref={founderImgRef}
              src={founder.image}
              alt={founder.name}
              className={styles.founderImage}
              loading="lazy"
            />
            <div className={styles.founderGlow} aria-hidden="true" />
          </div>

          {/* Founder Info Lockup */}
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
                <span>EXPLORE VISION & BIO</span>
                <span aria-hidden="true">↗</span>
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

        {/* ── 3. Collective Editorial Subheader ── */}
        <div className={styles.subSectionHeader}>
          <div className={styles.subSectionTitleWrap}>
            <span className={styles.subSectionLabel}>THE COLLECTIVE</span>
            <h4 className={styles.subSectionTitle}>CREATIVE & ENGINEERING DISCIPLINE</h4>
          </div>
          <p className={styles.subSectionDesc}>
            Specialized craft across brand aesthetics, video motion, full-stack architecture, and
            digital momentum.
          </p>
        </div>

        {/* ── 4. Asymmetrical Magazine Portrait Showcase ── */}
        <div className={styles.asymGallery}>
          {collectiveMembers.map((member, index) => {
            const colClass = getColClass(member.id);

            return (
              <button
                key={member.id}
                ref={(el) => {
                  galleryItemsRef.current[index] = el;
                }}
                type="button"
                className={`${styles.memberItem} ${colClass}`}
                onClick={() => handleOpenMember(member)}
                aria-label={`View ${member.name}, ${member.role}`}
              >
                {/* Portrait Crop */}
                <div className={styles.memberMedia}>
                  <img
                    src={member.image}
                    alt={member.name}
                    className={styles.memberPhoto}
                    loading="lazy"
                  />
                  <div className={styles.memberGlow} aria-hidden="true" />
                  <div className={styles.memberHoverTag} aria-hidden="true">
                    <span style={{ fontSize: 13, lineHeight: 1 }}>↗</span>
                  </div>
                </div>

                {/* Editorial Caption Info */}
                <div className={styles.memberCaption}>
                  {member.linkedin && (
                    <div className={captionMetaClass(styles)}>
                      <span
                        className={styles.memberSocialIcon}
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(member.linkedin, '_blank', 'noopener,noreferrer');
                        }}
                        role="link"
                        tabIndex={0}
                        aria-label={`${member.name} LinkedIn`}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28Z" />
                        </svg>
                      </span>
                    </div>
                  )}
                  <h5 className={styles.memberName}>{member.name}</h5>
                  <p className={styles.memberRole}>{member.role}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Interactive Web Backdrop Modal (Complete Rotating Architectural Web) ── */}
      <TeamMemberModal
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
      />
    </section>
  );
};

// Helper for class name
function captionMetaClass(s: Record<string, string>) {
  return s.captionMeta || '';
}

export default TeamPreview;
