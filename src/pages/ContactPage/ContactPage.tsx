import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import styles from './ContactPage.module.css';

const DISCIPLINES_LIST = [
  'Web Development',
  'Mobile App Development',
  'UI / UX Design',
  'Digital Marketing',
  'Video Production',
  'Graphic Design',
  'SEO Services',
  'Cloud Solutions',
];

const BUDGET_TIERS = [
  '$15,000 – $30,000',
  '$30,000 – $60,000',
  '$60,000 – $120,000',
  '$120,000+',
];

export const ContactPage: React.FC = () => {
  const [selectedDisciplines, setSelectedDisciplines] = useState<string[]>([]);
  const [selectedBudget, setSelectedBudget] = useState<string>('$30,000 – $60,000');
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    timeline: '',
    message: '',
  });

  const pageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const coordRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    const ctx = gsap.context(() => {
      // 1. Hero emergence
      if (heroRef.current) {
        const title = heroRef.current.querySelector(`.${styles.heroTitle}`);
        const lead = heroRef.current.querySelector(`.${styles.heroLead}`);

        gsap.fromTo(
          [title, lead],
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 1.05,
            stagger: 0.15,
            ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
          }
        );
      }

      // 2. Stage split arrival
      if (formRef.current && coordRef.current) {
        gsap.fromTo(
          [formRef.current, coordRef.current],
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.95,
            stagger: 0.15,
            ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
            delay: 0.2,
          }
        );
      }
    }, page);

    return () => ctx.revert();
  }, []);

  const toggleDiscipline = (disc: string) => {
    setSelectedDisciplines((prev) =>
      prev.includes(disc) ? prev.filter((d) => d !== disc) : [...prev, disc]
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div ref={pageRef} className={styles.page}>
      {/* Hero Section */}
      <section ref={heroRef} className={styles.heroSection}>
        <div className={styles.container}>
          <div className={styles.eyebrow}>
            <span className={styles.crimsonMarker} aria-hidden="true" />
            <span className={styles.eyebrowText}>ENGAGEMENTS & INQUIRIES // CONTACT</span>
          </div>

          <h1 className={styles.heroTitle}>
            LET'S BUILD.
          </h1>

          <p className={styles.heroLead}>
            We partner with visionary founders, enterprises, and innovators to craft digital flagships
            and systems. Define your scope below or connect with our leadership directly.
          </p>
        </div>
      </section>

      {/* Interactive Form & Coordinates Stage */}
      <section className={styles.stageSection}>
        <div className={styles.container}>
          <div className={styles.splitGrid}>
            {/* Form Column */}
            <div ref={formRef} className={styles.formCol}>
              {submitted ? (
                <div className={styles.successMessage}>
                  <span className={styles.formSectionTitle}>TRANSMISSION RECEIVED</span>
                  <h2 className={styles.successTitle}>THANK YOU, {formData.name || 'PARTNER'}.</h2>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '16px', lineHeight: '1.6', color: '#424348' }}>
                    Your project brief has been routed to our direct leadership team. We will review
                    your objectives and respond within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {/* Step 1: Disciplines */}
                  <div className={styles.formSectionTitle}>01 // SELECT REQUIRED DISCIPLINES</div>
                  <div className={styles.disciplineSelectGrid}>
                    {DISCIPLINES_LIST.map((disc) => (
                      <button
                        type="button"
                        key={disc}
                        className={`${styles.selectPill} ${
                          selectedDisciplines.includes(disc) ? styles.active : ''
                        }`}
                        onClick={() => toggleDiscipline(disc)}
                      >
                        {disc}
                      </button>
                    ))}
                  </div>

                  {/* Step 2: Budget */}
                  <div className={styles.formSectionTitle}>02 // PROJECTED INVESTMENT TIER</div>
                  <div className={styles.budgetGrid}>
                    {BUDGET_TIERS.map((tier) => (
                      <button
                        type="button"
                        key={tier}
                        className={`${styles.budgetOption} ${
                          selectedBudget === tier ? styles.active : ''
                        }`}
                        onClick={() => setSelectedBudget(tier)}
                      >
                        {tier}
                      </button>
                    ))}
                  </div>

                  {/* Step 3: Contact Fields */}
                  <div className={styles.formSectionTitle}>03 // PROJECT & CONTACT DETAILS</div>
                  <div className={styles.fieldsGrid}>
                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>YOUR NAME *</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className={styles.inputField}
                        placeholder="Ada Lovelace"
                      />
                    </div>

                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>WORK EMAIL *</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className={styles.inputField}
                        placeholder="ada@enterprise.com"
                      />
                    </div>

                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>ORGANIZATION / COMPANY</label>
                      <input
                        type="text"
                        name="organization"
                        value={formData.organization}
                        onChange={handleChange}
                        className={styles.inputField}
                        placeholder="Venture or Enterprise Name"
                      />
                    </div>

                    <div className={styles.fieldGroup}>
                      <label className={styles.fieldLabel}>TARGET LAUNCH TIMELINE</label>
                      <input
                        type="text"
                        name="timeline"
                        value={formData.timeline}
                        onChange={handleChange}
                        className={styles.inputField}
                        placeholder="e.g. Q3 2026, 8-12 weeks"
                      />
                    </div>

                    <div className={`${styles.fieldGroup} ${styles.fullField}`}>
                      <label className={styles.fieldLabel}>PROJECT OVERVIEW & CHALLENGE *</label>
                      <textarea
                        name="message"
                        required
                        value={formData.message}
                        onChange={handleChange}
                        className={styles.textareaField}
                        placeholder="Tell us about your brand challenge, current architecture, and desired outcomes..."
                      />
                    </div>
                  </div>

                  <button type="submit" className={styles.submitBtn}>
                    <span>SUBMIT PROJECT INQUIRY</span>
                    <span>→</span>
                  </button>
                </form>
              )}
            </div>

            {/* Coordinates & Intelligence Column */}
            <div ref={coordRef} className={styles.coordCol}>
              <div className={styles.coordBlock}>
                <span className={styles.coordLabel}>DIRECT INQUIRY</span>
                <h3 className={styles.coordHeading}>STUDIO INBOX</h3>
                <a href="mailto:contact@areneaden.com" className={styles.coordLink}>
                  contact@areneaden.com
                </a>
              </div>

              <div className={styles.coordBlock}>
                <span className={styles.coordLabel}>STUDIO LEADERSHIP</span>
                <h3 className={styles.coordHeading}>FOUNDER & DIRECTION</h3>
                <p className={styles.coordText}>
                  Saikiran Chapa
                  <br />
                  Founder & Creative Technologist
                </p>
              </div>

              <div className={styles.coordBlock}>
                <span className={styles.coordLabel}>OPERATIONAL MODEL</span>
                <h3 className={styles.coordHeading}>GLOBAL ARCHITECTURE</h3>
                <p className={styles.coordText}>
                  Operating as a distributed, high-calibre collective across IST, UTC, and EST timezones.
                  Guaranteed response window &lt; 24 hours on business days.
                </p>
              </div>

              <div className={styles.coordBlock}>
                <span className={styles.coordLabel}>ENGAGEMENT CADENCE</span>
                <h3 className={styles.coordHeading}>COLLABORATION</h3>
                <p className={styles.coordText}>
                  We intentionally limit our concurrent client engagements to maintain deep focus,
                  obsessive typographic care, and engineering precision for every partner.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
