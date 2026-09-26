import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './TermsPage.module.css';

export const TermsPage: React.FC = () => {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });

    const ctx = gsap.context(() => {
      gsap.from(`.${styles.clauseCard}`, {
        y: 25,
        opacity: 0,
        stagger: 0.1,
        duration: 0.7,
        ease: 'power2.out',
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className={styles.page}>
      {/* Hero Header */}
      <section className={styles.heroSection} aria-label="Terms of Service Hero">
        <div className={styles.container}>
          <div className={styles.eyebrow}>
            <span className={styles.crimsonMarker} aria-hidden="true" />
            <span className={styles.eyebrowText}>LEGAL & ENGAGEMENTS // 2026</span>
          </div>

          <h1 className={styles.heroTitle}>TERMS OF SERVICE</h1>

          <p className={styles.heroLead}>
            The operational framework, intellectual property standards, and professional terms
            governing client partnerships and digital craft produced by Aranea Den.
          </p>
        </div>
      </section>

      {/* Main Content Stage */}
      <section className={styles.contentSection} aria-label="Terms Clauses">
        <div className={styles.container}>
          <div className={styles.legalGrid}>
            {/* Table of Contents Sticky Rail */}
            <aside className={styles.tocCol} aria-label="Table of Contents">
              <span className={styles.tocTitle}>SECTIONS</span>
              <a href="#engagement" className={styles.tocLink}>01 // Scope & Engagement</a>
              <a href="#intellectual-property" className={styles.tocLink}>02 // Intellectual Property</a>
              <a href="#deliverables" className={styles.tocLink}>03 // Deliverables & QA</a>
              <a href="#confidentiality" className={styles.tocLink}>04 // Confidentiality & NDA</a>
              <a href="#liability" className={styles.tocLink}>05 // Warranties & Liability</a>
              <a href="#jurisdiction" className={styles.tocLink}>06 // Governance & Law</a>
            </aside>

            {/* Clauses */}
            <div className={styles.clauseList}>
              <article id="engagement" className={styles.clauseCard}>
                <span className={styles.clauseNumber}>SECTION 01</span>
                <h2 className={styles.clauseHeading}>SCOPE & ENGAGEMENT FRAMEWORK</h2>
                <p className={styles.clauseText}>
                  All services rendered by Aranea Den—including Web Development, UI/UX Design, Mobile Architecture,
                  Cloud Engineering, and Cinematic Media Production—are executed under definitive Statement of Work (SOW)
                  documents that specify deliverables, milestones, and timelines.
                </p>
                <p className={styles.clauseText}>
                  Any modifications or architectural extensions to project scope are managed via mutual written Change Orders.
                </p>
              </article>

              <article id="intellectual-property" className={styles.clauseCard}>
                <span className={styles.clauseNumber}>SECTION 02</span>
                <h2 className={styles.clauseHeading}>INTELLECTUAL PROPERTY & TRANSFER</h2>
                <p className={styles.clauseText}>
                  Upon completion of all milestone compensations, full ownership of bespoke design assets, frontend codebases,
                  and application architectures created exclusively for the client transfers entirely to the client.
                </p>
                <p className={styles.clauseText}>
                  Aranea Den retains ownership of pre-existing proprietary design libraries, boilerplate modules, and internal
                  frameworks, granting the client a perpetual, worldwide, royalty-free license to utilize such components within the delivered system.
                </p>
              </article>

              <article id="deliverables" className={styles.clauseCard}>
                <span className={styles.clauseNumber}>SECTION 03</span>
                <h2 className={styles.clauseHeading}>DELIVERABLES & ACCEPTANCE</h2>
                <p className={styles.clauseText}>
                  Each delivery undergoes rigorous cross-browser verification, performance profiling, and QA benchmarks.
                  Clients are provided standard 14-day review cycles to verify milestone conformity against approved specifications.
                </p>
              </article>

              <article id="confidentiality" className={styles.clauseCard}>
                <span className={styles.clauseNumber}>SECTION 04</span>
                <h2 className={styles.clauseHeading}>MUTUAL CONFIDENTIALITY</h2>
                <p className={styles.clauseText}>
                  Both parties agree to treat all non-public technical specifications, trade secrets, roadmaps, and business
                  models as strictly confidential. Standard mutual non-disclosure agreements remain enforceable indefinitely.
                </p>
              </article>

              <article id="liability" className={styles.clauseCard}>
                <span className={styles.clauseNumber}>SECTION 05</span>
                <h2 className={styles.clauseHeading}>LIMITATION OF LIABILITY</h2>
                <p className={styles.clauseText}>
                  While we architect for maximum resilience and uptime, Aranea Den is not liable for indirect, incidental, or
                  consequential damages resulting from third-party hosting outages, upstream API changes, or unauthorized third-party tampering.
                </p>
              </article>

              <article id="jurisdiction" className={styles.clauseCard}>
                <span className={styles.clauseNumber}>SECTION 06</span>
                <h2 className={styles.clauseHeading}>GOVERNANCE & JURISDICTION</h2>
                <p className={styles.clauseText}>
                  These Terms of Service and all related client agreements are governed by applicable commercial laws.
                  Any dispute not resolved amicably shall be submitted to binding arbitration.
                </p>
                <div className={styles.contactBanner}>
                  <p className={styles.contactBannerText}>
                    For contractual inquiries, master service agreements, or vendor compliance:{' '}
                    <a href="mailto:legal@araneaden.com" className={styles.mailLink}>
                      legal@araneaden.com
                    </a>
                  </p>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsPage;
