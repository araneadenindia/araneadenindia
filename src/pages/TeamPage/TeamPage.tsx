import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TEAM_MEMBERS, TeamMember } from '../../data/teamData';
import { TeamMemberModal } from '../../components/TeamMemberModal';
import styles from './TeamPage.module.css';

gsap.registerPlugin(ScrollTrigger);

export const TeamPage: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const founderCardRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const founder = TEAM_MEMBERS.find(m => m.id === 'saikiran-chapa') || TEAM_MEMBERS[0];
  const collectiveMembers = TEAM_MEMBERS.filter(m => m.id !== 'saikiran-chapa');

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Hero entrance
      if (heroRef.current) {
        gsap.from(heroRef.current.children, {
          y: 35,
          opacity: 0,
          stagger: 0.12,
          duration: 0.8,
          ease: 'power3.out',
        });
      }

      // Founder entrance
      if (founderCardRef.current) {
        gsap.from(founderCardRef.current, {
          scrollTrigger: {
            trigger: founderCardRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
          y: 40,
          opacity: 0,
          duration: 0.75,
          ease: 'power3.out',
        });
      }

      // Collective cards stagger
      const cards = cardsRef.current.filter(Boolean);
      if (cards.length > 0) {
        gsap.from(cards, {
          scrollTrigger: {
            trigger: cards[0],
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
          y: 40,
          opacity: 0,
          stagger: 0.1,
          duration: 0.7,
          ease: 'power3.out',
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className={styles.page}>
      {/* ── 1. Page Header ── */}
      <section className={styles.heroSection}>
        <div className={styles.container}>
          <div ref={heroRef}>
            <div className={styles.eyebrow}>
              <span className={styles.crimsonMarker} aria-hidden="true" />
              <span className={styles.eyebrowText}>THE POWERHOUSE</span>
            </div>
            <h1 className={styles.heroTitle}>WEAVERS OF DIGITAL REALMS.</h1>
            <p className={styles.heroLead}>
              Great digital experiences are never made from isolated pieces. Strategy shapes the direction.
              Design creates the connection. Technology brings it to life. Meet the multidisciplinary collective
              behind Aranea Den.
            </p>
          </div>
        </div>
      </section>

      {/* ── 2. Leadership Feature (Founder & CEO) ── */}
      <section className={styles.founderSection} aria-label="Leadership">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionEyebrow}>LEADERSHIP & DIRECTION</span>
            <h2 className={styles.sectionTitle}>VISIONARY STEWARDSHIP</h2>
          </div>

          <div
            ref={founderCardRef}
            className={styles.founderCard}
            onClick={() => setSelectedMember(founder)}
            role="button"
            tabIndex={0}
            aria-label={`View profile for ${founder.name}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setSelectedMember(founder);
              }
            }}
          >
            <div className={styles.founderImageWrap}>
              <img
                src={founder.image}
                alt={founder.name}
                className={styles.founderImage}
              />
            </div>
            <div className={styles.founderContent}>
              <div className={styles.founderNameRow}>
                <div>
                  <h3 className={styles.founderName}>{founder.name}</h3>
                  <p className={styles.founderRole}>{founder.role}</p>
                </div>
                {founder.linkedin && (
                  <a
                    href={founder.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.linkedinIconLink}
                    aria-label={`${founder.name} LinkedIn Profile`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28Z" />
                    </svg>
                  </a>
                )}
              </div>
              <p className={styles.founderBio}>{founder.bio}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. The Powerhouse Collective Grid ── */}
      <section className={styles.collectiveSection} aria-label="The Powerhouse Collective">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionEyebrow}>THE POWERHOUSE</span>
            <h2 className={styles.sectionTitle}>CRAFT SPECIALISTS</h2>
          </div>

          <div className={styles.teamGrid}>
            {collectiveMembers.map((member, index) => (
              <div
                key={member.id}
                ref={el => { cardsRef.current[index] = el; }}
                className={styles.memberCard}
                onClick={() => setSelectedMember(member)}
                role="button"
                tabIndex={0}
                aria-label={`View profile for ${member.name}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedMember(member);
                  }
                }}
              >
                <div className={styles.memberImageWrap}>
                  <img
                    src={member.image}
                    alt={member.name}
                    className={styles.memberImage}
                    loading="lazy"
                  />
                </div>
                <div className={styles.memberBody}>
                  <div className={styles.memberNameRow}>
                    <h3 className={styles.memberName}>{member.name}</h3>
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.linkedinIconLink}
                        aria-label={`${member.name} LinkedIn Profile`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28Z" />
                        </svg>
                      </a>
                    )}
                  </div>
                  <p className={styles.memberRole}>{member.role}</p>
                  <p className={styles.memberBio}>{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Closing CTA Band ── */}
      <section className={styles.ctaBand} aria-label="Work With Our Team">
        <div className={styles.container}>
          <h2 className={styles.ctaHeading}>WANT TO BUILD TOGETHER?</h2>
          <p className={styles.ctaSubtext}>
            We partner with visionary founders, enterprises, and innovators to craft digital flagships.
            Let's discuss how our collective can accelerate your vision.
          </p>
          <Link to="/contact" className={styles.ctaBtn}>
            <span>START A CONVERSATION</span>
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </section>

      {/* ── 5. Spider Web Team Member Modal ── */}
      <TeamMemberModal
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
      />
    </div>
  );
};

export default TeamPage;
