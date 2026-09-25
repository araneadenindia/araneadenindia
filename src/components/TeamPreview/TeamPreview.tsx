import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TEAM_MEMBERS } from '../../data/teamData';
import styles from './TeamPreview.module.css';

gsap.registerPlugin(ScrollTrigger);

export const TeamPreview: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const cards = cardsRef.current.filter(Boolean);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from(cards, {
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
        y: 35,
        opacity: 0,
        stagger: 0.08,
        duration: 0.65,
        ease: 'power3.out',
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.section} aria-label="Our Team">
      <div className={styles.container}>
        {/* Header Row */}
        <div className={styles.headerRow}>
          <div className={styles.headerLeft}>
            <div className={styles.eyebrow}>
              <span className={styles.crimsonMarker} aria-hidden="true" />
              <span className={styles.eyebrowText}>THE POWERHOUSE // PEOPLE</span>
            </div>
            <h2 className={styles.heading}>MINDS BEHIND THE CRAFT</h2>
          </div>

          <div className={styles.headerRight}>
            <Link to="/team" className={styles.viewAllBtn} aria-label="Meet the full Aranea Den team">
              <span>MEET THE TEAM</span>
              <span className={styles.btnArrow} aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>

        {/* Compact Team Grid */}
        <div className={styles.teamGrid}>
          {TEAM_MEMBERS.map((member, index) => (
            <div
              key={member.id}
              ref={el => { cardsRef.current[index] = el; }}
              className={styles.memberCard}
            >
              <div className={styles.imageWrap}>
                <img
                  src={member.image}
                  alt={member.name}
                  className={styles.memberImage}
                  loading="lazy"
                />
              </div>
              <div className={styles.cardBody}>
                <div className={styles.nameRow}>
                  <h3 className={styles.memberName}>{member.name}</h3>
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.linkedinLink}
                      aria-label={`${member.name} LinkedIn Profile`}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28Z" />
                      </svg>
                    </a>
                  )}
                </div>
                <p className={styles.memberRole}>{member.role}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile View All CTA */}
        <div className={styles.mobileCtaRow}>
          <Link to="/team" className={styles.viewAllBtn} aria-label="Meet the full Aranea Den team">
            <span>MEET THE TEAM</span>
            <span className={styles.btnArrow} aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TeamPreview;
