import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './ContactPage.module.css';

gsap.registerPlugin(ScrollTrigger);

export const INNER_SERVICES = [
  'Web Development',
  'UI / UX Design',
  'Mobile App Development',
  'Videography',
  'Photography',
  'Video Editing',
  'Poster & Graphic Design',
  'Digital Marketing',
];

export const OUTER_SERVICES = [
  'Social Media Management',
  'Meta / Google / Instagram Ads',
  'Google Business Listing',
  'Reels — AD Imperial Visuals',
  'IoT Prototyping',
  'Hackathons & Updates',
  'Workshops & Training',
  'Other',
];

export const MOBILE_LEFT_SERVICES = INNER_SERVICES;
export const MOBILE_RIGHT_SERVICES = OUTER_SERVICES;
export const SERVICES_LIST = [...INNER_SERVICES, ...OUTER_SERVICES];

const WEB_NODES = [
  ...INNER_SERVICES.map((name, i) => {
    const angle = -90 + i * 45;
    const rad = (angle * Math.PI) / 180;
    const r = 25;
    return {
      name,
      x: +(50 + r * Math.cos(rad)).toFixed(2),
      y: +(50 + r * Math.sin(rad)).toFixed(2),
    };
  }),
  ...OUTER_SERVICES.map((name, i) => {
    const angle = -67.5 + i * 45;
    const rad = (angle * Math.PI) / 180;
    const r = 42;
    return {
      name,
      x: +(50 + r * Math.cos(rad)).toFixed(2),
      y: +(50 + r * Math.sin(rad)).toFixed(2),
    };
  }),
];

const POLYGON_ANGLES = Array.from({ length: 16 }, (_, i) => -90 + i * 22.5);
const POLYGON_RINGS = [15, 25, 34, 42].map((r) =>
  POLYGON_ANGLES.map((a) => {
    const rad = (a * Math.PI) / 180;
    return `${(50 + r * Math.cos(rad)).toFixed(2)},${(50 + r * Math.sin(rad)).toFixed(2)}`;
  }).join(' ')
);

const COUNTRY_CODES = [
  { code: '+91', country: 'IN (+91)' },
  { code: '+1', country: 'US (+1)' },
  { code: '+44', country: 'UK (+44)' },
  { code: '+971', country: 'UAE (+971)' },
  { code: '+65', country: 'SG (+65)' },
  { code: '+61', country: 'AU (+61)' },
  { code: '+49', country: 'DE (+49)' },
  { code: '+1', country: 'CA (+1)' },
];

interface ContactItem {
  id: string;
  number: string;
  label: string;
  display: string;
  actionText: string;
  href: string;
  isExternal?: boolean;
  icon: React.ReactNode;
}

const CONTACT_METHODS: ContactItem[] = [
  {
    id: 'phone',
    number: '01',
    label: 'CALL US',
    display: '+91 8106574159',
    actionText: 'CALL NOW',
    href: 'tel:+918106574159',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
  {
    id: 'email',
    number: '02',
    label: 'EMAIL US',
    display: 'contact@araneaden.com',
    actionText: 'SEND EMAIL',
    href: 'mailto:contact@araneaden.com',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
  {
    id: 'whatsapp',
    number: '03',
    label: 'WHATSAPP',
    display: 'Chat with us',
    actionText: 'MESSAGE ON WHATSAPP',
    href: 'https://wa.me/918106574159',
    isExternal: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.79 14.12c-.24.68-1.39 1.3-1.92 1.38-.49.07-1.12.1-3.23-.77-2.69-1.12-4.41-3.87-4.54-4.05-.14-.17-1.09-1.46-1.09-2.78 0-1.32.69-1.96.93-2.22.25-.26.54-.33.72-.33.18 0 .36 0 .52.01.17.01.39-.06.61.47.23.54.78 1.92.85 2.06.07.14.11.3.02.48-.09.18-.14.29-.28.46-.14.17-.3.37-.43.5-.14.14-.29.3-.13.58.17.28.74 1.22 1.58 1.98 1.09.97 2 1.27 2.29 1.41.28.14.45.12.62-.07.17-.19.72-.84.91-1.13.19-.29.38-.24.64-.15.26.1 1.66.78 1.94.92.29.14.48.21.55.33.07.12.07.72-.17 1.4z" />
      </svg>
    ),
  },
  {
    id: 'instagram',
    number: '04',
    label: 'INSTAGRAM',
    display: 'Instagram',
    actionText: 'FOLLOW US',
    href: 'https://www.instagram.com/araneaden_',
    isExternal: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    id: 'youtube',
    number: '05',
    label: 'YOUTUBE',
    display: 'YouTube',
    actionText: 'WATCH OUR WORK',
    href: 'https://www.youtube.com/@araneaden_',
    isExternal: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    id: 'linkedin',
    number: '06',
    label: 'LINKEDIN',
    display: 'LinkedIn',
    actionText: 'CONNECT WITH US',
    href: 'https://www.linkedin.com/company/araneaden',
    isExternal: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28Z" />
      </svg>
    ),
  },
  {
    id: 'location',
    number: '07',
    label: 'LOCATION',
    display: 'HYDERABAD, INDIA',
    actionText: 'VIEW ON MAPS',
    href: 'https://maps.google.com/?q=Hyderabad,+India',
    isExternal: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
];

export const ContactPage: React.FC = () => {
  const [selectedServices, setSelectedServices] = useState<string[]>([
    'Web Development',
  ]);
  const [name, setName] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedData, setSubmittedData] = useState<{
    message: string;
    waUrl: string;
  } | null>(null);

  const pageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const [isWebModalOpen, setIsWebModalOpen] = useState(false);
  const [modalError, setModalError] = useState('');
  const modalOverlayRef = useRef<HTMLDivElement>(null);
  const spiderHubRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isWebModalOpen) {
      document.body.style.overflow = 'hidden';

      const ctx = gsap.context(() => {
        // Overlay fade in
        if (modalOverlayRef.current) {
          gsap.fromTo(
            modalOverlayRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.28, ease: 'power2.out' }
          );
        }

        // Center spider anchor pop
        if (spiderHubRef.current) {
          gsap.fromTo(
            spiderHubRef.current,
            { scale: 0.4, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.38, ease: 'back.out(2)' }
          );
        }

        // Web lines draw/fade outward
        const lines = modalOverlayRef.current?.querySelectorAll('line');
        if (lines && lines.length > 0) {
          gsap.fromTo(
            lines,
            { opacity: 0, scale: 0.85, transformOrigin: 'center center' },
            { opacity: 1, scale: 1, duration: 0.35, ease: 'power2.out', delay: 0.04 }
          );
        }

        // Text labels staggered reveal
        const labels = modalOverlayRef.current?.querySelectorAll(
          `.${styles.minimalTextLabel}, .${styles.mobileLabelLeft}, .${styles.mobileLabelRight}`
        );
        if (labels && labels.length > 0) {
          gsap.fromTo(
            labels,
            { opacity: 0, scale: 0.92 },
            { opacity: 1, scale: 1, duration: 0.32, stagger: 0.018, ease: 'power2.out', delay: 0.08 }
          );
        }
      });

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsWebModalOpen(false);
        }
      };
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        ctx.revert();
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isWebModalOpen]);

  const handleConfirm = () => {
    if (selectedServices.length === 0) {
      setModalError('Please select at least one service on the web.');
      return;
    }
    setModalError('');
    setIsWebModalOpen(false);
    if (errors.services) {
      setErrors((prev) => ({ ...prev, services: '' }));
    }
  };

  const clearAllServices = () => {
    setSelectedServices([]);
  };

  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    const ctx = gsap.context(() => {
      // 1. Hero entrance
      if (heroRef.current) {
        gsap.fromTo(
          heroRef.current.querySelectorAll(`.${styles.heroContent} > *`),
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power3.out',
          }
        );
      }

      // 2. Form card entrance
      if (formRef.current) {
        gsap.fromTo(
          formRef.current,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: formRef.current,
              start: 'top 85%',
            },
          }
        );
      }

      // 3. Contact panel items entrance
      if (panelRef.current) {
        const items = panelRef.current.querySelectorAll(`.${styles.contactItem}`);
        gsap.fromTo(
          items,
          { opacity: 0, x: 20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.65,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: panelRef.current,
              start: 'top 85%',
            },
          }
        );
      }
    }, page);

    return () => ctx.revert();
  }, []);

  const toggleService = (service: string) => {
    setSelectedServices((prev) => {
      const next = prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service];
      if (next.length > 0 && errors.services) {
        setErrors((e) => ({ ...e, services: '' }));
      }
      return next;
    });
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (selectedServices.length === 0) {
      newErrors.services = 'Please select at least one service.';
    }

    if (!name.trim()) {
      newErrors.name = 'Please enter your full name.';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters.';
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (!phone.trim()) {
      newErrors.phone = 'Please enter your phone number.';
    } else if (cleanPhone.length < 8) {
      newErrors.phone = 'Please enter a valid phone number (at least 8-10 digits).';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Please enter your email address.';
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!note.trim()) {
      newErrors.note = 'Please tell us briefly about your project.';
    } else if (note.trim().length < 5) {
      newErrors.note = 'Please provide a little more detail about your inquiry.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const fullPhone = `${countryCode} ${phone.trim()}`;
    const servicesText = selectedServices.join(', ');

    const waMessage =
      `NEW PROJECT INQUIRY — ARANEA DEN\n\n` +
      `Name: ${name.trim()}\n` +
      `Phone: ${fullPhone}\n` +
      `Email: ${email.trim()}\n` +
      `Selected Services: ${servicesText}\n` +
      `Project Note: ${note.trim()}`;

    const targetNumber = '918106574159';
    const waUrl = `https://wa.me/${targetNumber}?text=${encodeURIComponent(waMessage)}`;

    // Open WhatsApp in new tab / application
    window.open(waUrl, '_blank', 'noopener,noreferrer');

    setSubmittedData({
      message: waMessage,
      waUrl,
    });
  };

  return (
    <div ref={pageRef} className={styles.page}>
      {/* ─────────────────────────────────────────────────────────────
          01 — COMPACT HERO SECTION
          ───────────────────────────────────────────────────────────── */}
      <section ref={heroRef} className={styles.heroSection}>
        {/* Subtle Minimal Arachnid Web SVG Backdrop */}


        <div className={styles.container}>
          <div className={styles.heroContent}>
            {/* Breadcrumb Navigation */}


            {/* Supporting Text */}
            <p className={styles.heroSupportingText}>
              Have a project in mind? Tell us what you need, and let's create
              something meaningful together.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          02 — MAIN TWO-COLUMN CONTACT SECTION
          ───────────────────────────────────────────────────────────── */}
      <section className={styles.mainContactSection}>
        <div className={styles.container}>
          <div className={styles.splitLayout}>
            {/* ── LEFT SIDE — PROJECT INQUIRY FORM ── */}
            <div ref={formRef} className={styles.formCol}>
              {submittedData ? (
                <div className={styles.whatsappPromptBox}>
                  <div className={styles.promptStatusRow}>
                    <span className={styles.promptStatusDot} />
                    <span className={styles.promptStatusText}>
                      READY FOR WHATSAPP TRANSMISSION
                    </span>
                  </div>

                  <h2 className={styles.promptTitle}>CONTINUE IN WHATSAPP</h2>

                  <p className={styles.promptInstruction}>
                    We have formatted your project brief. Click below to continue in
                    WhatsApp and deliver your inquiry directly to our direct desk at{' '}
                    <strong>+91 8106574159</strong>.
                  </p>

                  <div className={styles.inquiryPreviewCard}>
                    {submittedData.message}
                  </div>

                  <div className={styles.promptActionsRow}>
                    <a
                      href={submittedData.waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.openWaBtn}
                    >
                      <span>OPEN WHATSAPP NOW</span>
                      <span aria-hidden="true">→</span>
                    </a>

                    <button
                      type="button"
                      className={styles.editInquiryBtn}
                      onClick={() => setSubmittedData(null)}
                    >
                      <span>EDIT INQUIRY DETAILS ↺</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className={styles.formCard}>
                  <div className={styles.formHeader}>
                    <span className={styles.formHeaderTag}>PROJECT INTAKE</span>
                    <h2 className={styles.formHeaderTitle}>TELL US ABOUT YOUR SCOPE</h2>
                  </div>

                  <form onSubmit={handleSubmit} noValidate>
                    {/* 1. SELECT SERVICE */}
                    <div className={styles.serviceSelectSection}>
                      <label className={styles.fieldLabel}>
                        1. SELECT SERVICE *
                      </label>

                      {/* Prominent Red Button */}
                      <button
                        type="button"
                        className={styles.selectServiceTriggerBtn}
                        onClick={() => {
                          setIsWebModalOpen(true);
                          setModalError('');
                        }}
                        aria-haspopup="dialog"
                        aria-expanded={isWebModalOpen}
                      >
                        <span className={styles.triggerBtnLabel}>
                          {selectedServices.length === 0
                            ? 'SELECT SERVICES +'
                            : `${selectedServices.length} ${selectedServices.length === 1 ? 'SERVICE' : 'SERVICES'} SELECTED`}
                        </span>
                        {selectedServices.length > 0 && (
                          <span className={styles.triggerEditBadge}>[✎ EDIT]</span>
                        )}
                      </button>

                      {/* Clean & Compact Selected Services List */}
                      {selectedServices.length > 0 && (
                        <div className={styles.selectedServicesDisplay}>
                          {selectedServices.map((service) => (
                            <span key={service} className={styles.selectedServicePill}>
                              <span className={styles.pillDot} />
                              <span>{service}</span>
                              <button
                                type="button"
                                className={styles.pillRemoveBtn}
                                onClick={() => toggleService(service)}
                                aria-label={`Remove ${service}`}
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      )}

                      {errors.services && (
                        <div className={styles.errorText}>
                          <span>⚠</span>
                          <span>{errors.services}</span>
                        </div>
                      )}
                    </div>

                    {/* 2. NAME & PHONE */}
                    <div className={styles.inputsRow}>
                      <div className={styles.inputGroup}>
                        <label htmlFor="contact-name" className={styles.fieldLabel}>
                          2. YOUR NAME *
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          required
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value);
                            if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                          }}
                          placeholder="Enter your full name"
                          className={`${styles.inputField} ${
                            errors.name ? styles.inputError : ''
                          }`}
                        />
                        {errors.name && (
                          <div className={styles.errorText}>
                            <span>⚠</span>
                            <span>{errors.name}</span>
                          </div>
                        )}
                      </div>

                      <div className={styles.inputGroup}>
                        <label htmlFor="contact-phone" className={styles.fieldLabel}>
                          3. PHONE NUMBER *
                        </label>
                        <div className={styles.phoneInputWrapper}>
                          <select
                            value={countryCode}
                            onChange={(e) => setCountryCode(e.target.value)}
                            className={styles.countryCodeSelect}
                            aria-label="Country Code"
                          >
                            {COUNTRY_CODES.map((c, i) => (
                              <option key={`${c.code}-${i}`} value={c.code}>
                                {c.country}
                              </option>
                            ))}
                          </select>
                          <input
                            id="contact-phone"
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => {
                              setPhone(e.target.value);
                              if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
                            }}
                            placeholder="Enter your phone number"
                            className={`${styles.inputField} ${
                              errors.phone ? styles.inputError : ''
                            }`}
                          />
                        </div>
                        {errors.phone && (
                          <div className={styles.errorText}>
                            <span>⚠</span>
                            <span>{errors.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 4. EMAIL ADDRESS */}
                    <div className={styles.fullRow}>
                      <div className={styles.inputGroup}>
                        <label htmlFor="contact-email" className={styles.fieldLabel}>
                          4. EMAIL ADDRESS *
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                          }}
                          placeholder="Enter your email address"
                          className={`${styles.inputField} ${
                            errors.email ? styles.inputError : ''
                          }`}
                        />
                        {errors.email && (
                          <div className={styles.errorText}>
                            <span>⚠</span>
                            <span>{errors.email}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 5. PROJECT NOTE */}
                    <div className={styles.fullRow}>
                      <div className={styles.inputGroup}>
                        <label htmlFor="contact-note" className={styles.fieldLabel}>
                          5. PROJECT NOTE *
                        </label>
                        <textarea
                          id="contact-note"
                          required
                          value={note}
                          onChange={(e) => {
                            setNote(e.target.value);
                            if (errors.note) setErrors((prev) => ({ ...prev, note: '' }));
                          }}
                          placeholder="Tell us briefly about your project, requirements, or ideas..."
                          className={`${styles.textareaField} ${
                            errors.note ? styles.inputError : ''
                          }`}
                        />
                        {errors.note && (
                          <div className={styles.errorText}>
                            <span>⚠</span>
                            <span>{errors.note}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* SUBMIT BUTTON */}
                    <button type="submit" className={styles.submitBtn}>
                      <span>SEND INQUIRY</span>
                      <span className={styles.submitBtnArrow} aria-hidden="true">
                        →
                      </span>
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* ── RIGHT SIDE — CONTACT INFORMATION PANEL ── */}
            <aside ref={panelRef} className={styles.contactPanel} aria-label="Contact Information">
              <div className={styles.contactPanelHeader}>
                <h2 className={styles.panelHeading}>GET IN TOUCH</h2>
                <p className={styles.panelSubtext}>
                  Choose the way that works best for you.
                </p>
              </div>

              <div className={styles.contactList}>
                {CONTACT_METHODS.map((item) => (
                  <a
                    key={item.id}
                    href={item.href}
                    target={item.isExternal ? '_blank' : undefined}
                    rel={item.isExternal ? 'noopener noreferrer' : undefined}
                    className={styles.contactItem}
                    aria-label={`${item.label}: ${item.display}`}
                  >
                    <div className={styles.contactItemLeft}>
                      <div className={styles.iconCircle}>
                        {item.icon}
                      </div>
                      <div className={styles.contactItemMeta}>
                        <span className={styles.itemLabel}>
                          {item.number} — {item.label}
                        </span>
                        <span className={styles.itemDisplay}>{item.display}</span>
                      </div>
                    </div>

                    <div className={styles.itemAction}>
                      <span>{item.actionText}</span>
                      <span aria-hidden="true">→</span>
                    </div>
                  </a>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          03 — MINIMAL SPIDER WEB MODAL — "LESS IS MORE"
          ───────────────────────────────────────────────────────────── */}
      {isWebModalOpen && (
        <div
          ref={modalOverlayRef}
          className={`${styles.minimalWebOverlay} ${styles.minimalWebOverlayActive}`}
          onClick={(e) => {
            if (e.target === modalOverlayRef.current) {
              setIsWebModalOpen(false);
            }
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Select Services Spider Web"
        >
          {/* Top Bar: Subtle Close Button */}
          <div className={styles.minimalTopBar}>
            <button
              type="button"
              className={styles.minimalCloseBtn}
              onClick={() => setIsWebModalOpen(false)}
              aria-label="Close service web selector"
            >
              ✕
            </button>
          </div>

          {/* 1. Desktop Radial Spider Web (>= 768px) */}
          <div className={styles.desktopWebContainer}>
            {/* SVG Silk Canvas */}
            <svg className={styles.webSvgCanvas} viewBox="0 0 100 100">
              {/* Concentric Spider Web Polygon Rings */}
              {POLYGON_RINGS.map((pts, i) => (
                <polygon
                  key={i}
                  points={pts}
                  className={styles.webPolygonRing}
                />
              ))}

              {/* Radial Silk Lines */}
              {WEB_NODES.map((node) => {
                const isSelected = selectedServices.includes(node.name);
                return (
                  <line
                    key={node.name}
                    x1="50"
                    y1="50"
                    x2={node.x}
                    y2={node.y}
                    className={`${styles.silkLine} ${
                      isSelected ? styles.silkLineActive : ''
                    }`}
                  />
                );
              })}
            </svg>

            {/* Central Spider Anchor */}
            <div ref={spiderHubRef} className={styles.centerSpiderAnchor}>
              <img
                src="/AD Transparent SVG.svg"
                alt="Aranea Den"
                className={styles.centerSpiderLogo}
              />
            </div>

            {/* Simple, Clickable Text Labels Directly on the Web */}
            {WEB_NODES.map((node) => {
              const isSelected = selectedServices.includes(node.name);
              return (
                <button
                  key={node.name}
                  type="button"
                  className={`${styles.minimalTextLabel} ${
                    isSelected ? styles.minimalTextLabelActive : ''
                  }`}
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  onClick={() => {
                    toggleService(node.name);
                    if (modalError) setModalError('');
                  }}
                  aria-pressed={isSelected}
                >
                  {isSelected && <span className={styles.labelDot} />}
                  <span>{node.name}</span>
                </button>
              );
            })}
          </div>

          {/* 2. Mobile Simplified Spine Web (< 768px) */}
          <div className={styles.mobileWebContainer}>
            {MOBILE_LEFT_SERVICES.map((leftService, i) => {
              const rightService = MOBILE_RIGHT_SERVICES[i];
              const isLeftSelected = selectedServices.includes(leftService);
              const isRightSelected = selectedServices.includes(rightService);
              const isKnotActive = isLeftSelected || isRightSelected;

              return (
                <div key={i} className={styles.mobileWebRow}>
                  {/* Left Service Text Label */}
                  <button
                    type="button"
                    className={`${styles.mobileLabelLeft} ${
                      isLeftSelected ? styles.mobileLabelLeftActive : ''
                    }`}
                    onClick={() => {
                      toggleService(leftService);
                      if (modalError) setModalError('');
                    }}
                    aria-pressed={isLeftSelected}
                  >
                    {isLeftSelected ? `• ${leftService}` : leftService}
                  </button>

                  {/* Center Silk Spine Knot */}
                  <div className={styles.mobileSpineCenter}>
                    <div className={styles.mobileSpineLine} />
                    <div
                      className={`${styles.mobileSpineKnot} ${
                        isKnotActive ? styles.mobileSpineKnotActive : ''
                      }`}
                    />
                  </div>

                  {/* Right Service Text Label */}
                  <button
                    type="button"
                    className={`${styles.mobileLabelRight} ${
                      isRightSelected ? styles.mobileLabelRightActive : ''
                    }`}
                    onClick={() => {
                      toggleService(rightService);
                      if (modalError) setModalError('');
                    }}
                    aria-pressed={isRightSelected}
                  >
                    {isRightSelected ? `${rightService} •` : rightService}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Bottom Actions Bar */}
          <div>
            {modalError && (
              <div className={styles.modalValidationNotice}>
                ⚠ {modalError}
              </div>
            )}
            <div className={styles.modalBottomControls}>
              <button
                type="button"
                className={styles.modalClearBtn}
                onClick={clearAllServices}
              >
                CLEAR
              </button>

              <span className={styles.modalCountBadge}>
                {selectedServices.length} {selectedServices.length === 1 ? 'SERVICE' : 'SERVICES'} SELECTED
              </span>

              <button
                type="button"
                className={styles.modalConfirmBtn}
                onClick={handleConfirm}
              >
                CONFIRM SELECTION →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactPage;
