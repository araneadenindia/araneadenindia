import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import styles from './ServicesPage.module.css';

interface DetailedDiscipline {
  number: string;
  category: string;
  name: string;
  description: string;
  deliverables: string[];
}

const DISCIPLINES: DetailedDiscipline[] = [
  {
    number: '01',
    category: 'COMPUTATIONAL ENGINEERING',
    name: 'WEB DEVELOPMENT',
    description:
      'We engineer bespoke web applications, enterprise platforms, and digital flagships built on modern component architecture. From headless content management systems to high-concurrency microservices, our code is written for planetary scale, rigorous accessibility, and effortless velocity.',
    deliverables: ['Next.js & Vite', 'Headless CMS', 'High-Throughput APIs', 'WebGL Motion Choreography', 'Performance Tuning'],
  },
  {
    number: '02',
    category: 'MOBILE PLATFORMS',
    name: 'MOBILE APP DEVELOPMENT',
    description:
      'Fluid iOS and Android experiences built with tactile responsiveness, native capabilities, and offline-first resilience. We focus on low-latency state synchronization, frictionless onboarding flows, and zero-compromise platform fidelity.',
    deliverables: ['React Native Architecture', 'Native iOS / Swift', 'Native Android / Kotlin', 'Offline Sync Engines', 'Push Infrastructure'],
  },
  {
    number: '03',
    category: 'DESIGN ARCHITECTURE',
    name: 'UI / UX DESIGN',
    description:
      'Rooted in structural harmony and human behavior, our design systems eliminate friction and clarify complexity. We develop scalable token systems, rigorous typographic scales, and micro-interaction choreographies that transform software into an intuitive extension of thought.',
    deliverables: ['Design Systems & Tokens', 'Interaction Prototyping', 'User Journey Architecture', 'Micro-Interactions', 'Usability Telemetry'],
  },
  {
    number: '04',
    category: 'GROWTH ARCHITECTURE',
    name: 'DIGITAL MARKETING',
    description:
      'Data-driven performance campaigns and strategic positioning that turn passive observers into devoted advocates. We build closed-loop analytics architectures and multi-touch attribution systems to ensure every marketing dollar directly compounds brand equity.',
    deliverables: ['Performance Campaigns', 'Growth Modeling', 'Funnel Optimization', 'Brand Positioning', 'Multi-Touch Attribution'],
  },
  {
    number: '05',
    category: 'MOTION & CINEMATICS',
    name: 'VIDEO PRODUCTION',
    description:
      'Cinematic motion design, 3D computer graphics, and brand narrative films that capture attention in high-velocity media landscapes. We direct, produce, and edit visual stories with obsessive color grading and synchronized acoustic choreography.',
    deliverables: ['Cinematic Brand Films', '3D Motion Design', 'Product Walkthroughs', 'Color Grading & VFX', 'Acoustic Sound Design'],
  },
  {
    number: '06',
    category: 'BRAND IDENTITY',
    name: 'GRAPHIC DESIGN',
    description:
      'Distinctive visual identities, bespoke logomarks, and authoritative brand guideline systems. We establish visual languages that cut through commercial noise, defining how modern enterprises present themselves across physical and digital mediums.',
    deliverables: ['Visual Identity Systems', 'Typographic Systems', 'Brand Stylebooks', 'Packaging Design', 'Collateral & Editorial'],
  },
  {
    number: '07',
    category: 'SEARCH INTELLIGENCE',
    name: 'SEO SERVICES',
    description:
      'Semantic structure, structured schema engineering, and technical indexing pipelines that secure long-term organic authority. We optimize Core Web Vitals, information architecture, and topical depth to command high-intent search real estate.',
    deliverables: ['Technical SEO Audits', 'Core Web Vitals Tuning', 'Structured Schema Graph', 'Topical Authority Strategy', 'Semantic Indexing'],
  },
  {
    number: '08',
    category: 'INFRASTRUCTURE & RESILIENCE',
    name: 'CLOUD SOLUTIONS',
    description:
      'Enterprise cloud infrastructure engineered for fault tolerance, automated scalability, and continuous global delivery. We implement automated CI/CD pipelines, container orchestration, and multi-region edge caches to ensure absolute uptime.',
    deliverables: ['AWS / GCP Cloud', 'Docker & Kubernetes', 'Automated CI/CD', 'Edge Compute & Caching', 'Hardened Security'],
  },
];

const LIFECYCLE_STEPS = [
  {
    step: 'PHASE 01',
    title: 'DISCOVERY & ARCHITECTURE',
    text: 'We deconstruct business requirements, map user mental models, and formulate the technological and brand blueprint.',
  },
  {
    step: 'PHASE 02',
    title: 'SYSTEMS DESIGN & PROTOTYPE',
    text: 'Crafting the typographic hierarchy, tactile component systems, and interactive prototypes with real motion data.',
  },
  {
    step: 'PHASE 03',
    title: 'COMPUTATIONAL ENGINEERING',
    text: 'Building with disciplined Next.js, Vite, and cloud services under rigorous testing and performance profiling.',
  },
  {
    step: 'PHASE 04',
    title: 'DEPLOYMENT & SCALE',
    text: 'Global edge release, search indexing, telemetry monitoring, and continuous iterative optimization.',
  },
];

export const ServicesPage: React.FC = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const processRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    const ctx = gsap.context(() => {
      // 1. Hero text reveal
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

      // 2. Disciplines staggered scroll elevation
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll(`.${styles.disciplineCard}`);
        cards.forEach((card) => {
          gsap.fromTo(
            card,
            { opacity: 0, y: 36 },
            {
              opacity: 1,
              y: 0,
              duration: 0.85,
              ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
              scrollTrigger: {
                trigger: card,
                start: 'top 82%',
              },
            }
          );
        });
      }

      // 3. Process Steps Stagger
      if (processRef.current) {
        const steps = processRef.current.querySelectorAll(`.${styles.processCard}`);
        gsap.fromTo(
          steps,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            stagger: 0.12,
            ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
            scrollTrigger: {
              trigger: processRef.current,
              start: 'top 80%',
            },
          }
        );
      }
    }, page);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className={styles.page}>
      {/* Hero Section */}
      <section ref={heroRef} className={styles.heroSection}>
        <div className={styles.container}>
          <div className={styles.eyebrow}>
            <span className={styles.crimsonMarker} aria-hidden="true" />
            <span className={styles.eyebrowText}>CAPABILITIES & ARCHITECTURE // SERVICES</span>
          </div>

          <h1 className={styles.heroTitle}>
            EIGHT CONNECTED DISCIPLINES.
          </h1>

          <p className={styles.heroLead}>
            We do not operate as an assembly of disconnected specialists. We build cohesive digital
            ecosystems where strategy, interface design, computational engineering, motion, and cloud
            infrastructure reinforce one another into a singular experience.
          </p>
        </div>
      </section>

      {/* Disciplines Catalogue */}
      <section className={styles.catalogueSection}>
        <div className={styles.container}>
          <div ref={cardsRef} className={styles.disciplinesList}>
            {DISCIPLINES.map((discipline) => (
              <div key={discipline.number} className={styles.disciplineCard}>
                <div className={styles.cardIndexArea}>
                  <span className={styles.cardIndex}>{discipline.number}</span>
                  <span className={styles.cardCategory}>{discipline.category}</span>
                </div>

                <div className={styles.cardMainArea}>
                  <h2 className={styles.cardName}>{discipline.name}</h2>
                  <p className={styles.cardDescription}>{discipline.description}</p>
                </div>

                <div className={styles.deliverablesList}>
                  <h3 className={styles.deliverablesHeading}>DELIVERABLES & STACK</h3>
                  <div className={styles.tagsContainer}>
                    {discipline.deliverables.map((item) => (
                      <span key={item} className={styles.deliverablePill}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Lifecycle Section */}
      <section ref={processRef} className={styles.processSection}>
        <div className={styles.container}>
          <div className={styles.eyebrow}>
            <span className={styles.crimsonMarker} aria-hidden="true" />
            <span className={styles.eyebrowText}>ENGAGEMENT METHODOLOGY</span>
          </div>

          <h2 className={styles.sectionHeadline}>
            FROM BLUEPRINT TO PLANETARY SCALE.
          </h2>

          <div className={styles.processGrid}>
            {LIFECYCLE_STEPS.map((step) => (
              <div key={step.step} className={styles.processCard}>
                <div className={styles.processStep}>{step.step}</div>
                <h3 className={styles.processTitle}>{step.title}</h3>
                <p className={styles.processText}>{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.eyebrow} style={{ justifyContent: 'center' }}>
            <span className={styles.crimsonMarker} aria-hidden="true" />
            <span className={styles.eyebrowText}>DISCUSS ARCHITECTURE</span>
          </div>

          <h2 className={styles.ctaHeadline}>
            HAVE A SYSTEM TO CONSTRUCT?
          </h2>

          <Link to="/contact" className={styles.primaryBtn}>
            <span>START A PROJECT</span>
            <span>→</span>
          </Link>
        </div>
      </section>
    </div>
  );
};
