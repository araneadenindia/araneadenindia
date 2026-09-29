// src/cms/defaultContent.ts
// Authoritative default content mirroring existing site data
import { CmsContentTree } from './types';
import { ALL_SERVICES } from '../data/servicesData';
import { PORTFOLIO_WEBSITES } from '../data/portfolioData';
import { ARANEA_REELS } from '../data/reelsData';
import { TEAM_MEMBERS } from '../data/teamData';

export const INITIAL_DEFAULT_CONTENT: CmsContentTree = {
  metadata: {
    version: 1,
    lastSaved: new Date().toISOString(),
    lastPublished: new Date().toISOString(),
    publishedBy: 'System Default',
  },
  home: {
    hero: {
      headline1: 'WE WEAVE YOUR',
      headline2: 'DIGITAL EXCELLENCE.',
      narrative: 'Crafted to help your brand move, stand out, and grow online.',
      ctaLabel: 'EXPLORE ↓',
      ctaUrl: '#passion',
      media: {
        type: 'video',
        url: '/16.9 Ratio Vid FINAL.mp4',
        posterUrl: '/Favicon.png',
        alt: 'Aranea Den Studio Showreel',
      },
      passionTitle: 'WE WEAVE DIGITAL EXPERIENCES.',
      passionNarrative:
        'We are an innovative creative and technology studio dedicated to crafting impactful digital solutions. We combine strategic thinking, refined design, and robust engineering to help businesses create enduring digital presence.',
    },
    announcements: {
      eyebrow: 'LATEST UPDATES // 2026',
      title: 'ANNOUNCEMENTS & HAPPENINGS',
      items: [
        {
          id: 'ann-1',
          title: 'District Youth Festival – 2026',
          eventDate: '29 SEPTEMBER 2026',
          buttonTitle: 'Register Now',
          buttonLink: 'https://forms.gle/JSXfFGGESx6U2Mhr8',
          media: {
            type: 'image',
            url: '/announcements/district-youth-festival-2026.jpg',
            alt: 'District Youth Festival 2026',
          },
        },
        {
          id: 'ann-2',
          title: 'Sriyasjaan Creative Collaboration',
          eventDate: '24 SEPTEMBER 2026',
          buttonTitle: 'Register Now',
          buttonLink: 'https://forms.gle/JSXfFGGESx6U2Mhr8',
          media: {
            type: 'image',
            url: '/portfolio-thumbs/sriyasjaan.jpg',
            alt: 'Sriyasjaan Collaboration',
          },
        },
        {
          id: 'ann-3',
          title: 'Aranea Code Nexus Hackathon',
          eventDate: '08 OCTOBER 2026',
          buttonTitle: 'Register Now',
          buttonLink: 'https://forms.gle/JSXfFGGESx6U2Mhr8',
          media: {
            type: 'image',
            url: '/portfolio-thumbs/thor.jpg',
            alt: 'Aranea Code Nexus Hackathon',
          },
        },
      ],
    },
    philosophy: {
      title: 'THE ARANEA ECOSYSTEM',
      body: 'Disciplines do not live in silos. From high-throughput web engineering to cinematic brand media, we connect strategy, craft, and technology into an enduring digital presence.',
    },
    marqueeText: [
      'WE WEAVE DIGITAL EXPERIENCES',
      'HIGH-CONCURRENCY WEB PLATFORMS',
      'BESPOKE UI / UX ARCHITECTURE',
      'CINEMATIC BRAND MEDIA',
      'FULL-STACK CREATIVE TECHNOLOGY',
    ],
    testimonials: {
      eyebrow: 'VOICES OF OUR CLIENTS',
      title: 'WHAT PARTNERS SAY ABOUT ARANEA DEN',
      items: [
        {
          id: 't-1',
          quote:
            'Aranea Den completely elevated our digital presence with unmatched precision and speed. The execution was flawless.',
          author: 'Pooja Productions',
          role: 'Executive Team',
        },
        {
          id: 't-2',
          quote:
            'Their architectural precision and design depth turned our vision into a premier digital platform in record time.',
          author: 'Meghana Builders',
          role: 'Managing Director',
        },
        {
          id: 't-3',
          quote:
            'The aesthetic polish and technical rigor Aranea Den brought to our brand gave us a measurable advantage in our market.',
          author: 'Thor Indian Cuisine',
          role: 'Founder',
        },
      ],
    },
    clients: {
      eyebrow: 'SELECT COLLABORATORS',
      title: 'TRUSTED BY FORWARD-THINKING BRANDS',
      items: [
        { id: 'c-1', name: 'Makaan Infrastructure', media: { type: 'image', url: '/clientele/makaan-infrastructure.png' } },
        { id: 'c-2', name: 'Meghana Builders', media: { type: 'image', url: '/clientele/meghana-builders.webp' } },
        { id: 'c-3', name: 'Pooja Productions', media: { type: 'image', url: '/clientele/pooja-productions.png' } },
        { id: 'c-4', name: 'P&P Connekts', media: { type: 'image', url: '/clientele/pp-connekts.png' } },
        { id: 'c-5', name: 'Thor Indian Cuisine', media: { type: 'image', url: '/clientele/thor-cuisine.png' } },
        { id: 'c-6', name: 'NRI 360', media: { type: 'image', url: '/clientele/nri-360.png' } },
      ],
    },
    cta: {
      headline: 'READY TO WEAVE SOMETHING EXCEPTIONAL?',
      subheadline: 'Tell us about your next project, milestone, or digital flagship.',
      buttonLabel: 'START A CONVERSATION →',
      buttonUrl: '/contact',
    },
  },
  about: {
    hero: {
      breadcrumb: 'ABOUT',
      eyebrow: 'WHO WE ARE',
      heading: 'WE WEAVE DIGITAL EXPERIENCES.',
      lead: 'We are an innovative creative and technology studio dedicated to crafting impactful digital solutions. We combine strategic thinking, refined design, and robust engineering to help businesses create enduring digital presence.',
      stats: {
        founded: '2025',
        services: '15+',
        ecosystem: '1',
      },
      cta1Label: 'START A PROJECT',
      cta1Url: '/contact',
      cta2Label: 'EXPLORE WORK',
      cta2Url: '/portfolio',
    },
    vision: {
      eyebrow: '01 —— OUR VISION',
      heading: 'WHERE WE ARE GOING',
      body: 'To redefine how modern businesses inhabit the digital world — replacing fragmented templates with bespoke, high-performance web ecosystems and cinematic storytelling that command authority and endure over time.',
      media: {
        type: 'image',
        url: '/about/vision.jpg',
        alt: 'Aranea Den Studio Architecture & Vision',
      },
    },
    mission: {
      eyebrow: '02 —— OUR MISSION',
      heading: 'WHAT WE DO EVERY DAY',
      body: 'To empower visionary entrepreneurs, forward-thinking institutions, and emerging brands by designing and engineering superior digital products. We bridge the gap between aesthetic beauty and technical precision, delivering measurable competitive advantage with relentless craft.',
      media: {
        type: 'image',
        url: '/about/mission.jpg',
        alt: 'Aranea Den Craft & Mission in Action',
      },
    },
    pillars: [
      {
        id: 'p-1',
        title: 'ZERO-COMPROMISE CRAFT',
        description: 'Pixel-level polish, fluid physics, and intentionality across all viewports.',
      },
      {
        id: 'p-2',
        title: 'MEASURABLE ADVANTAGE',
        description: 'Turning technical rigor and design excellence into real business performance.',
      },
      {
        id: 'p-3',
        title: 'FULL-CYCLE CAPABILITY',
        description: 'Zero handoff friction between design and full-stack engineering, delivering faster turnaround.',
      },
    ],
  },
  services: {
    hero: {
      breadcrumb: 'SERVICES',
      eyebrow: 'COMPREHENSIVE CAPABILITIES',
      heading: 'WHAT WE DO',
      lead: 'From digital products and brand experiences to content, campaigns, and emerging technology — we connect every discipline to help businesses move forward.',
      stats: {
        servicesCount: '15',
        disciplinesCount: '4',
        studioCount: '1',
      },
    },
    items: ALL_SERVICES.map((s) => ({
      id: s.id,
      number: s.number,
      title: s.title,
      category: s.category,
      categorySlug: s.categorySlug,
      badge: s.badge,
      description: s.description,
      detailedCopy: s.detailedCopy,
      deliverables: s.deliverables,
      media: {
        type: 'image',
        url: s.image,
        alt: s.title,
      },
      featured: s.featured,
      actionLabel: s.actionLabel || 'EXPLORE SERVICE →',
      actionUrl: s.actionUrl || `/contact?service=${s.id}`,
    })),
  },
  portfolio: {
    hero: {
      breadcrumb: 'PORTFOLIO',
      eyebrow: 'OUR WORK',
      heading: 'A COLLECTION OF DIGITAL EXPERIENCES.',
      lead: 'Websites, applications, and visual stories crafted by Aranea Den.',
    },
    websites: PORTFOLIO_WEBSITES.map((w) => ({
      id: w.id,
      number: w.number,
      title: w.title,
      domain: w.domain,
      url: w.url,
      category: w.category,
      filterCategory: w.filterCategory,
      metaDescription: w.metaDescription,
      tags: w.tags,
      media: {
        type: 'image',
        url: w.thumbnail,
        alt: w.title,
      },
      year: w.year,
      featuredOnHome: w.featuredOnHome,
    })),
    apps: [
      {
        id: 'app-1',
        name: 'ARANEA MOBILE OS',
        client: 'Aranea Den Atelier',
        platform: 'iOS / Swift & React Native',
        category: 'MOBILE ECOSYSTEM & TELEMETRY',
        description: 'Tactile companion application engineered with micro-interactions and biometric security.',
        tags: ['SwiftUI', 'Offline-First SQLite', 'Biometrics', 'Haptics'],
        media: {
          type: 'image',
          url: '/services/ad-mobile-development.jpg',
          alt: 'Aranea Mobile OS',
        },
        year: '2026',
        status: 'In Development',
      },
      {
        id: 'app-2',
        name: 'THOR MOBILE ORDERS',
        client: 'Thor Indian Cuisine',
        platform: 'iOS & Android Native',
        category: 'HOSPITALITY & LIVE ORDERING',
        description: 'High-speed table reservations, instant kitchen telemetry, and synchronized curbside pickup.',
        tags: ['React Native', 'Live Orders', 'Push Notifications', 'Memphis TN'],
        media: {
          type: 'image',
          url: '/services/02-mobile-app-development.jpg',
          alt: 'Thor Mobile Orders',
        },
        url: 'https://thor-indian-cuisinse.firebaseapp.com',
        year: '2025',
        status: 'Private Beta',
      },
      {
        id: 'app-3',
        name: 'NRI360 MOBILE CONCIERGE',
        client: 'NRI360 Global',
        platform: 'Cross-Platform Mobile',
        category: 'GLOBAL CONCIERGE & HEALTHCARE',
        description: 'Real-time property monitoring, senior family healthcare check-ins, and direct encrypted concierge chat.',
        tags: ['Flutter', 'Encrypted Chat', '100+ Cities', 'Legal Telemetry'],
        media: {
          type: 'image',
          url: '/services/ad-ui-ux-design.jpg',
          alt: 'NRI360 Mobile Concierge',
        },
        url: 'https://nri360degrees.com',
        year: '2026',
        status: 'Production',
      },
      {
        id: 'app-4',
        name: 'IMPERIAL VISUALS MEDIA SUITE',
        client: 'AD Imperial Visuals',
        platform: 'iOS / iPadOS & Android',
        category: 'PORTABLE 4K MEDIA ARCHIVE',
        description: 'Sensory vertical media showcase, client proofing suite, and instant social reel deployment.',
        tags: ['Video Player', 'ProRes Delivery', 'Color Fidelity', 'Studio Suite'],
        media: {
          type: 'image',
          url: '/services/ui-ux-design.jpg',
          alt: 'AD Imperial Visuals',
        },
        year: '2026',
        status: 'Internal Release',
      },
    ],
    reels: ARANEA_REELS.map((r) => ({
      id: r.id,
      title: r.title,
      client: r.client,
      caption: r.caption,
      media: {
        type: 'video',
        url: r.videoSrc,
        posterUrl: r.thumbnail,
        alt: r.title,
      },
      instagramUrl: r.instagramUrl,
      aspectRatio: r.aspectRatio,
      likes: r.likes,
      tag: r.tag,
    })),
  },
  team: {
    hero: {
      breadcrumb: 'TEAM',
      eyebrow: 'THE POWERHOUSE',
      heading: 'MEET THE MINDS BEHIND ARANEA DEN.',
      lead: 'A multidisciplinary team of designers, engineers, directors, and strategists united by a shared obsession with craft.',
    },
    members: TEAM_MEMBERS.map((m) => ({
      id: m.id,
      name: m.name,
      role: m.role,
      bio: m.bio,
      shortBio: m.shortBio,
      media: {
        type: 'image',
        url: m.image,
        alt: m.name,
      },
      order: m.order,
      linkedin: m.linkedin,
      instagram: m.instagram,
    })),
  },
  contact: {
    hero: {
      breadcrumb: 'CONTACT',
      heading: "LET'S TALK.",
      lead: "Have a project in mind? Tell us what you need, and let's create something meaningful together.",
    },
    phone: '+91 8106574159',
    email: 'contact@araneaden.com',
    address: 'Hyderabad Studio · Est. 2025',
  },
};
