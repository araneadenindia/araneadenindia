import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './PrivacyPage.module.css';

export const PrivacyPage: React.FC = () => {
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
      <section className={styles.heroSection} aria-label="Privacy Policy Hero">
        <div className={styles.container}>
          <div className={styles.eyebrow}>
            <span className={styles.crimsonMarker} aria-hidden="true" />
            <span className={styles.eyebrowText}>LEGAL & TRANSPARENCY // 2026</span>
          </div>

          <h1 className={styles.heroTitle}>PRIVACY POLICY</h1>

          <p className={styles.heroLead}>
            Our commitment to digital integrity, computational privacy, and transparent stewardship
            over the information you entrust to Aranea Den.
          </p>
        </div>
      </section>

      {/* Main Content Stage */}
      <section className={styles.contentSection} aria-label="Privacy Clauses">
        <div className={styles.container}>
          <div className={styles.legalGrid}>
            {/* Table of Contents Sticky Rail */}
            <aside className={styles.tocCol} aria-label="Table of Contents">
              <span className={styles.tocTitle}>SECTIONS</span>
              <a href="#data-collection" className={styles.tocLink}>01 // Data Collection</a>
              <a href="#usage-purpose" className={styles.tocLink}>02 // Use of Information</a>
              <a href="#third-party" className={styles.tocLink}>03 // Infrastructure & Security</a>
              <a href="#cookies-analytics" className={styles.tocLink}>04 // Telemetry & Cookies</a>
              <a href="#client-rights" className={styles.tocLink}>05 // Your Inherent Rights</a>
              <a href="#updates" className={styles.tocLink}>06 // Revisions & Contact</a>
            </aside>

            {/* Clauses */}
            <div className={styles.clauseList}>
              <article id="data-collection" className={styles.clauseCard}>
                <span className={styles.clauseNumber}>SECTION 01</span>
                <h2 className={styles.clauseHeading}>INFORMATION WE COLLECT</h2>
                <p className={styles.clauseText}>
                  We collect information that you explicitly provide when engaging with our agency,
                  initiating project inquiries, or submitting contact forms. This typically includes your
                  name, corporate email, organization name, project scope parameters, and budget expectations.
                </p>
                <p className={styles.clauseText}>
                  We intentionally limit automatic telemetry to anonymous technical metrics required for
                  rendering integrity, browser compatibility, and network performance.
                </p>
              </article>

              <article id="usage-purpose" className={styles.clauseCard}>
                <span className={styles.clauseNumber}>SECTION 02</span>
                <h2 className={styles.clauseHeading}>PURPOSE & USE OF DATA</h2>
                <p className={styles.clauseText}>
                  Any data gathered is strictly utilized to communicate architectural proposals, deliver
                  bespoke engineering services, fulfill client contracts, and continually refine our digital
                  flagship implementations.
                </p>
                <p className={styles.clauseText}>
                  Aranea Den does not sell, license, or monetize your contact or business information to third-party data brokers under any circumstances.
                </p>
              </article>

              <article id="third-party" className={styles.clauseCard}>
                <span className={styles.clauseNumber}>SECTION 03</span>
                <h2 className={styles.clauseHeading}>SECURITY & INFRASTRUCTURE</h2>
                <p className={styles.clauseText}>
                  We implement enterprise-grade cryptographic standards, SSL/TLS transmission encryption,
                  and isolated cloud architectures to safeguard all client communication and proprietary assets.
                </p>
                <p className={styles.clauseText}>
                  Access to project repositories, deployment pipelines, and confidential deliverables is
                  strictly partitioned based on role-based authentication protocols.
                </p>
              </article>

              <article id="cookies-analytics" className={styles.clauseCard}>
                <span className={styles.clauseNumber}>SECTION 04</span>
                <h2 className={styles.clauseHeading}>COOKIES & CLIENT STORAGE</h2>
                <p className={styles.clauseText}>
                  Our digital flagships use minimal session storage and performance cookies solely to preserve
                  session states, remember UI preferences (such as reduced motion), and ensure instantaneous page navigation.
                </p>
                <p className={styles.clauseText}>
                  You may configure your browser to decline cookies without compromising core site readability.
                </p>
              </article>

              <article id="client-rights" className={styles.clauseCard}>
                <span className={styles.clauseNumber}>SECTION 05</span>
                <h2 className={styles.clauseHeading}>YOUR LEGAL RIGHTS</h2>
                <p className={styles.clauseText}>
                  You retain the right to request full disclosure, correction, or permanent deletion of any personal
                  or business data stored within our internal archives, subject to active contractual or statutory retention rules.
                </p>
              </article>

              <article id="updates" className={styles.clauseCard}>
                <span className={styles.clauseNumber}>SECTION 06</span>
                <h2 className={styles.clauseHeading}>CONTACT & INQUIRIES</h2>
                <p className={styles.clauseText}>
                  For inquiries regarding data governance, non-disclosure agreements, or this Privacy Policy, please
                  contact our privacy stewardship team:
                </p>
                <div className={styles.contactBanner}>
                  <p className={styles.contactBannerText}>
                    <strong>Aranea Den Data Privacy Office:</strong>{' '}
                    <a href="mailto:privacy@araneaden.com" className={styles.mailLink}>
                      privacy@araneaden.com
                    </a>{' '}
                    or via{' '}
                    <a href="mailto:contact@araneaden.com" className={styles.mailLink}>
                      contact@araneaden.com
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

export default PrivacyPage;
