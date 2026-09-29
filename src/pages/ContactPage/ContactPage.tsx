import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './ContactPage.module.css';

gsap.registerPlugin(ScrollTrigger);

export const SERVICES_LIST = [
  'Web Development',
  'UI / UX Design',
  'Mobile App Development',
  'Videography',
  'Photography',
  'Video Editing',
  'Poster & Graphic Design',
  'Digital Marketing',
  'Social Media Management',
  'Meta / Google / Instagram Ads',
  'Google Business Listing',
  'Reels — AD Imperial Visuals',
  'Live Streaming & Broadcasting',
  'IoT Prototyping',
  'Hackathons & Updates',
  'Workshops & Training',
  'Other',
];

const SERVICE_PARAM_MAP: Record<string, string> = {
  'web-development': 'Web Development',
  'web-architecture-engineering': 'Web Development',
  'mobile-development': 'Mobile App Development',
  'mobile-app-development': 'Mobile App Development',
  'ui-ux-design': 'UI / UX Design',
  'ui-ux': 'UI / UX Design',
  'digital-marketing': 'Digital Marketing',
  'video-production': 'Videography',
  'videography': 'Videography',
  'photography': 'Photography',
  'video-editing': 'Video Editing',
  'graphic-design': 'Poster & Graphic Design',
  'poster-graphic-design': 'Poster & Graphic Design',
  'social-media-management': 'Social Media Management',
  'meta-google-instagram-ads': 'Meta / Google / Instagram Ads',
  'google-business-profile': 'Google Business Listing',
  'google-business-listing': 'Google Business Listing',
  'reels-production': 'Reels — AD Imperial Visuals',
  'ad-imperial-visuals': 'Reels — AD Imperial Visuals',
  'live-streaming-broadcasting': 'Live Streaming & Broadcasting',
  'live-streaming': 'Live Streaming & Broadcasting',
  'broadcasting': 'Live Streaming & Broadcasting',
  'iot-prototyping': 'IoT Prototyping',
  'iot-hardware-solutions': 'IoT Prototyping',
  'software-hardware-solutions': 'Web Development',
  'hackathons-updates': 'Hackathons & Updates',
  'hackathons': 'Hackathons & Updates',
  'workshops-training': 'Workshops & Training',
  'workshops': 'Workshops & Training',
};

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
    label: 'Call Us',
    display: '+91 8106574159',
    actionText: 'Call Now',
    href: 'tel:+918106574159',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
  {
    id: 'email',
    label: 'Email Us',
    display: 'contact@araneaden.com',
    actionText: 'Send Email',
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
    label: 'WhatsApp',
    display: '+91 8106574159',
    actionText: 'Start Chat',
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
    label: 'Instagram',
    display: '@araneaden_',
    actionText: 'Follow Us',
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
    label: 'YouTube',
    display: '@araneaden_',
    actionText: 'Watch Work',
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
    label: 'LinkedIn',
    display: 'Aranea Den',
    actionText: 'Connect',
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
    label: 'Location',
    display: 'Hyderabad, India',
    actionText: 'View on Maps',
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
  const location = useLocation();

  const [selectedServices, setSelectedServices] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const serviceParam = params.get('service');
      if (serviceParam) {
        const normalized = serviceParam.toLowerCase().trim();
        const matched =
          SERVICE_PARAM_MAP[normalized] ||
          SERVICES_LIST.find((s) => s.toLowerCase() === normalized) ||
          SERVICES_LIST.find((s) => s.toLowerCase().includes(normalized) || normalized.includes(s.toLowerCase().replace(/[^a-z0-9]+/g, '-')));
        if (matched) return [matched];
      }
    }
    return ['Web Development'];
  });
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalError, setModalError] = useState('');

  const pageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const modalCardRef = useRef<HTMLDivElement>(null);

  // Keyboard accessibility and scroll lock for Modal
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';

      if (modalCardRef.current) {
        gsap.fromTo(
          modalCardRef.current,
          { opacity: 0, scale: 0.96, y: 16 },
          { opacity: 1, scale: 1, y: 0, duration: 0.25, ease: 'power2.out' }
        );
      }

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsModalOpen(false);
        }
      };
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isModalOpen]);

  // Handle URL query changes (e.g. navigation via Link /contact?service=...)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const serviceParam = params.get('service');
    if (serviceParam) {
      const normalized = serviceParam.toLowerCase().trim();
      const matched =
        SERVICE_PARAM_MAP[normalized] ||
        SERVICES_LIST.find((s) => s.toLowerCase() === normalized) ||
        SERVICES_LIST.find((s) => s.toLowerCase().includes(normalized) || normalized.includes(s.toLowerCase().replace(/[^a-z0-9]+/g, '-')));

      if (matched) {
        setSelectedServices([matched]);
        // Smoothly scroll down to form
        setTimeout(() => {
          if (formRef.current) {
            formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 150);
      }
    }
  }, [location.search]);

  // Page entrance animations
  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    const ctx = gsap.context(() => {
      if (heroRef.current) {
        gsap.fromTo(
          heroRef.current.querySelectorAll(`.${styles.heroContent} > *`),
          { opacity: 0, y: 22 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.1,
            ease: 'power3.out',
          }
        );
      }

      if (formRef.current) {
        gsap.fromTo(
          formRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: formRef.current,
              start: 'top 85%',
            },
          }
        );
      }

      if (panelRef.current) {
        const items = panelRef.current.querySelectorAll(`.${styles.contactItem}`);
        gsap.fromTo(
          items,
          { opacity: 0, x: 20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            stagger: 0.07,
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
      if (next.length > 0) {
        if (errors.services) setErrors((e) => ({ ...e, services: '' }));
        if (modalError) setModalError('');
      }
      return next;
    });
  };

  const clearAllServices = () => {
    setSelectedServices([]);
  };

  const handleModalConfirm = () => {
    if (selectedServices.length === 0) {
      setModalError('Please select at least one service to continue.');
      return;
    }
    setModalError('');
    setIsModalOpen(false);
    if (errors.services) {
      setErrors((prev) => ({ ...prev, services: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (selectedServices.length === 0) {
      newErrors.services = 'Please select at least one service.';
    }

    if (!name.trim()) {
      newErrors.name = 'Please enter your name.';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters.';
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (!phone.trim()) {
      newErrors.phone = 'Please enter your phone number.';
    } else if (cleanPhone.length < 8) {
      newErrors.phone = 'Please enter a valid phone number.';
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
      newErrors.note = 'Please provide a little more detail about your project.';
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

    // Open WhatsApp in a new tab/application
    window.open(waUrl, '_blank', 'noopener,noreferrer');

    setSubmittedData({
      message: waMessage,
      waUrl,
    });
  };

  return (
    <div ref={pageRef} className={styles.page}>
      {/* ─────────────────────────────────────────────────────────────
          01 — HERO SECTION
          ───────────────────────────────────────────────────────────── */}
      <section ref={heroRef} className={styles.heroSection}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            {/* Clean Breadcrumb Navigation */}
            <nav className={styles.breadcrumb} aria-label="Breadcrumb">
              <a href="/" className={styles.breadcrumbLink}>Home</a>
              <span className={styles.breadcrumbSeparator}>/</span>
              <span className={styles.breadcrumbActive}>Contact</span>
            </nav>

            <h1 className={styles.heroTitle}>LET&apos;S TALK.</h1>

            <p className={styles.heroSubtitle}>
              Have a project in mind? Tell us what you need, and let&apos;s create
              something meaningful together.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          02 — MAIN TWO-COLUMN CONTACT SECTION
          ───────────────────────────────────────────────────────────── */}
      <section className={styles.mainSection}>
        <div className={styles.container}>
          <div className={styles.splitGrid}>
            {/* ── LEFT COLUMN — PROJECT INQUIRY FORM ── */}
            <div ref={formRef} className={styles.formCol}>
              {submittedData ? (
                <div className={styles.whatsappPromptBox}>
                  <h2 className={styles.promptTitle}>CONTINUE IN WHATSAPP</h2>

                  <p className={styles.promptInstruction}>
                    We have formatted your project brief. Click below to continue in
                    WhatsApp and chat directly with our team at{' '}
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
                      <span>CONTINUE TO WHATSAPP</span>
                      <span aria-hidden="true">→</span>
                    </a>

                    <button
                      type="button"
                      className={styles.editInquiryBtn}
                      onClick={() => setSubmittedData(null)}
                    >
                      <span>EDIT DETAILS ↺</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className={styles.formCard}>
                  <div className={styles.formHeader}>
                    <h2 className={styles.formTitle}>Tell Us About Your Project</h2>
                    <p className={styles.formSubtitle}>
                      Fill in your details below and we&apos;ll reach out to discuss your vision.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} noValidate>
                    {/* SERVICES SELECTION */}
                    <div className={styles.serviceFieldGroup}>
                      <label className={styles.fieldLabel}>
                        Services Needed *
                      </label>

                      {/* Prominent Red Button */}
                      <button
                        type="button"
                        className={styles.selectServicesBtn}
                        onClick={() => {
                          setIsModalOpen(true);
                          setModalError('');
                        }}
                        aria-haspopup="dialog"
                        aria-expanded={isModalOpen}
                      >
                        <span className={styles.btnActionText}>
                          {selectedServices.length === 0
                            ? 'SELECT SERVICES +'
                            : `SELECT SERVICES (${selectedServices.length})`}
                        </span>
                        {selectedServices.length > 0 && (
                          <span className={styles.btnEditHint}>EDIT SERVICES ✎</span>
                        )}
                      </button>

                      {/* Selected Services Tags Display */}
                      {selectedServices.length > 0 && (
                        <div className={styles.selectedTagsList}>
                          {selectedServices.map((service) => (
                            <span key={service} className={styles.serviceTag}>
                              <span className={styles.serviceTagDot} />
                              <span>{service}</span>
                              <button
                                type="button"
                                className={styles.tagRemoveBtn}
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
                        <div className={styles.fieldError}>
                          <span>⚠</span>
                          <span>{errors.services}</span>
                        </div>
                      )}
                    </div>

                    {/* NAME & PHONE */}
                    <div className={styles.inputsRow}>
                      <div className={styles.inputGroup}>
                        <label htmlFor="contact-name" className={styles.fieldLabel}>
                          Your Name *
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
                          placeholder="Your full name"
                          className={`${styles.inputField} ${
                            errors.name ? styles.inputError : ''
                          }`}
                        />
                        {errors.name && (
                          <div className={styles.fieldError}>
                            <span>⚠</span>
                            <span>{errors.name}</span>
                          </div>
                        )}
                      </div>

                      <div className={styles.inputGroup}>
                        <label htmlFor="contact-phone" className={styles.fieldLabel}>
                          Phone Number *
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
                            placeholder="Phone number"
                            className={`${styles.inputField} ${
                              errors.phone ? styles.inputError : ''
                            }`}
                          />
                        </div>
                        {errors.phone && (
                          <div className={styles.fieldError}>
                            <span>⚠</span>
                            <span>{errors.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* EMAIL ADDRESS */}
                    <div className={styles.fullRow}>
                      <div className={styles.inputGroup}>
                        <label htmlFor="contact-email" className={styles.fieldLabel}>
                          Email Address *
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
                          placeholder="your.email@company.com"
                          className={`${styles.inputField} ${
                            errors.email ? styles.inputError : ''
                          }`}
                        />
                        {errors.email && (
                          <div className={styles.fieldError}>
                            <span>⚠</span>
                            <span>{errors.email}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* PROJECT DETAILS / NOTE */}
                    <div className={styles.fullRow}>
                      <div className={styles.inputGroup}>
                        <label htmlFor="contact-note" className={styles.fieldLabel}>
                          Project Details *
                        </label>
                        <textarea
                          id="contact-note"
                          required
                          value={note}
                          onChange={(e) => {
                            setNote(e.target.value);
                            if (errors.note) setErrors((prev) => ({ ...prev, note: '' }));
                          }}
                          placeholder="Tell us briefly about your project, timeline, budget, or goals..."
                          className={`${styles.textareaField} ${
                            errors.note ? styles.inputError : ''
                          }`}
                        />
                        {errors.note && (
                          <div className={styles.fieldError}>
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

            {/* ── RIGHT COLUMN — DIRECT CONTACT & SOCIAL CHANNELS ── */}
            <aside ref={panelRef} className={styles.contactPanel} aria-label="Direct Contact">
              <div className={styles.contactPanelHeader}>
                <h2 className={styles.panelHeading}>Get in Touch</h2>
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
                        <span className={styles.itemLabel}>{item.label}</span>
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
          03 — CLEAN SERVICE SELECTION MODAL
          Clean, centered, dark modal with backdrop blur & checklist
          ───────────────────────────────────────────────────────────── */}
      {isModalOpen && (
        <div
          className={`${styles.modalOverlay} ${styles.modalOverlayActive}`}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsModalOpen(false);
            }
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="services-modal-title"
        >
          <div ref={modalCardRef} className={styles.modalCard}>
            {/* Modal Header */}
            <div className={styles.modalHeader}>
              <div>
                <h3 id="services-modal-title" className={styles.modalTitle}>
                  Select Your Services
                </h3>
                <p className={styles.modalSubtitle}>
                  Choose one or more disciplines for your project
                </p>
              </div>

              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setIsModalOpen(false)}
                aria-label="Close service selector"
              >
                ✕
              </button>
            </div>

            {/* Modal Body: Compact Checklist */}
            <div className={styles.modalServicesBody}>
              {modalError && (
                <div className={styles.modalValidationNotice}>
                  ⚠ {modalError}
                </div>
              )}

              <div className={styles.modalServicesGrid}>
                {SERVICES_LIST.map((service) => {
                  const isSelected = selectedServices.includes(service);
                  return (
                    <button
                      key={service}
                      type="button"
                      className={`${styles.serviceOption} ${
                        isSelected ? styles.serviceOptionSelected : ''
                      }`}
                      onClick={() => toggleService(service)}
                      aria-pressed={isSelected}
                    >
                      <span className={styles.serviceOptionText}>{service}</span>
                      <span className={styles.serviceCheckIndicator} aria-hidden="true">
                        {isSelected ? '✓' : ''}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className={styles.modalFooter}>
              <div className={styles.modalFooterLeft}>
                <span className={styles.modalSelectedCount}>
                  {selectedServices.length}{' '}
                  {selectedServices.length === 1 ? 'service' : 'services'} selected
                </span>
                {selectedServices.length > 0 && (
                  <button
                    type="button"
                    className={styles.modalClearBtn}
                    onClick={clearAllServices}
                  >
                    Clear all
                  </button>
                )}
              </div>

              <button
                type="button"
                className={styles.modalContinueBtn}
                onClick={handleModalConfirm}
              >
                <span>CONTINUE</span>
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactPage;
