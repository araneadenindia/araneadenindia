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
        url: '/hero-16-9.mp4',
        posterUrl: '/hero-poster-desktop.jpg',
        alt: 'Aranea Den Studio Showreel',
      },
      passionTitle: 'WE WEAVE DIGITAL EXPERIENCES.',
      passionNarrative:
        'We are an innovative creative and technology studio dedicated to crafting impactful digital solutions. We combine strategic thinking, refined design, and robust engineering to help businesses create enduring digital presence.',
      passionCopy:
        'At Aranea Den, we believe exceptional digital experiences should be accessible to everyone. We combine creativity, strategy, and technology to deliver high-quality digital solutions at affordable, transparent prices—empowering businesses of every size to build their presence, connect with their audiences, and grow with confidence.',
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
    whatWeDo: {
      eyebrow: 'DISCIPLINES // 04',
      title: 'WHAT WE DO',
      items: [
        {
          id: 'web-dev',
          number: '01',
          slug: 'web-development',
          name: 'WEB DEVELOPMENT',
          description:
            'Engineered for speed, durability, and computational elegance. We construct bespoke web platforms, web applications, and immersive digital flagships using clean architecture and modern rendering pipelines.',
          imageSrc: '/services/ad-web-development.jpg',
        },
        {
          id: 'mobile-app',
          number: '02',
          slug: 'mobile-development',
          name: 'MOBILE APP DEVELOPMENT',
          description:
            'Fluid native iOS and Android applications designed with tactile micro-interactions, uncompromising speed, and resilient offline-first architecture that seamlessly scale to millions of users.',
          imageSrc: '/services/ad-mobile-development.jpg',
        },
        {
          id: 'ui-ux',
          number: '03',
          slug: 'ui-ux-design',
          name: 'UI / UX DESIGN',
          description:
            'Disciplined design systems founded on structural harmony, typographic precision, and intuitive user psychology. We eliminate friction to create interfaces that feel natural, deliberate, and authoritative.',
          imageSrc: '/services/ad-ui-ux-design.jpg',
        },
        {
          id: 'digital-marketing',
          number: '04',
          slug: 'digital-marketing',
          name: 'DIGITAL MARKETING',
          description:
            'Data-driven growth architectures engineered for measurable market expansion. We deploy algorithmic audience modeling, precision conversion tracking, and high-velocity campaign systems that scale revenue.',
          imageSrc: '/services/03-digital-marketing.jpg',
        },
        {
          id: 'reels-production',
          number: '05',
          slug: 'ad-imperial-visuals',
          name: 'REELS — AD IMPERIAL VISUALS',
          description:
            'Sensory vertical cinematography designed to stop thumbs in milliseconds. We direct high-impact reels, short-form master narratives, and color-graded brand vignettes tailored for digital distribution.',
          imageSrc: '/services/11-ad-imperial-visuals.jpg',
        },
        {
          id: 'video-production',
          number: '06',
          slug: 'video-production',
          name: 'VIDEO PRODUCTION',
          description:
            'Cinematic storytelling crafted with studio-grade optics, dynamic lighting, and precise color science. From commercial brand films to high-fidelity event documentation, we deliver compelling visuals.',
          imageSrc: '/services/09-video-editing.jpg',
        },
        {
          id: 'live-streaming',
          number: '07',
          slug: 'live-streaming-broadcasting',
          name: 'LIVE STREAMING & BROADCASTING',
          description:
            'Zero-fail multi-camera broadcasting infrastructure for global product keynotes, leadership summits, and cultural events with redundant encoding and real-time audio telemetry.',
          imageSrc: '/services/ad-live-streaming.jpg',
        },
        {
          id: 'iot-prototyping',
          number: '08',
          slug: 'iot-prototyping',
          name: 'IOT & SMART HARDWARE PROTOTYPING',
          description:
            'Bridging physical environments with intelligent computing. We prototype interconnected IoT telemetry, embedded microcontroller circuits, and sensor-driven hardware solutions.',
          imageSrc: '/services/12-iot-prototyping.jpg',
        },
      ],
    },
    philosophy: {
      eyebrow: 'THE ARANEA ECOSYSTEM',
      title: 'A CONNECTED APPROACH TO DIGITAL EXCELLENCE',
      subtitle:
        'Disciplines do not live in silos. From high-throughput web engineering to cinematic brand media, we connect strategy, craft, and technology into an enduring digital presence.',
      stages: [
        {
          number: '01',
          name: 'STRATEGY',
          summary: 'Understand the business, identify opportunities, and define a clear digital direction.',
        },
        {
          number: '02',
          name: 'DESIGN',
          summary: 'Create intuitive, distinctive experiences that connect with people.',
        },
        {
          number: '03',
          name: 'BUILD',
          summary: 'Develop scalable websites, applications, and digital solutions with precision.',
        },
        {
          number: '04',
          name: 'GROW',
          summary: 'Improve performance, strengthen visibility, and evolve through continuous refinement.',
        },
      ],
    },
    marqueeText: [
      'WE WEAVE YOUR DIGITAL EXCELLENCE',
      'HIGH-CONCURRENCY WEB PLATFORMS',
      'BESPOKE UI / UX ARCHITECTURE',
      'CINEMATIC BRAND MEDIA',
      'FULL-STACK CREATIVE TECHNOLOGY',
    ],
    experiences: {
      eyebrow: 'CASE STUDIES // 2026',
      title: 'AD EXPERIENCES SHOWCASE',
      subtitle: 'Editorial deep-dives into recent flagships, high-traffic systems, and cinematic digital productions.',
      items: [
        {
          id: 'exp-pooja',
          client: 'Pooja Productions',
          tag: 'FILM & ENTERTAINMENT PLATFORM',
          title: 'Pooja Productions — Editorial Film Platform & Streaming Archive',
          matter:
            'Architected an ultra-responsive, editorial-grade web platform and streaming preview portal for award-winning film production house Pooja Productions. The platform was engineered with custom video player pipelines, adaptive bitrate previews, and a monolithic archival architecture that balances cinematic immersion with sub-second page loads. Every interaction, from typography scaling to poster depth shaders, was designed to honor the artistry of high-caliber Indian cinema.',
          imageSrc: '/portfolio-thumbs/pooja.jpg',
          linkUrl: 'https://poojaproductions.com',
          isExternal: true,
        },
        {
          id: 'exp-ceo-expos',
          client: 'CEO Expos',
          tag: 'EXECUTIVE CONFERENCES & SUMMITS',
          title: 'CEO Expos — National Exhibition Digital Infrastructure & Summit Media',
          matter:
            'Engineered the full-stack digital operational engine and attendee acquisition funnel for India’s premier franchise and business expositions. The system powers real-time exhibitor booth bookings, multi-tier visitor registration, dynamic pass generation, and multi-camera live telecast integrations across major convention centers in Andhra Pradesh. Delivered a scalable, edge-cached web architecture paired with on-ground technical production.',
          imageSrc: '/portfolio-thumbs/creators.jpg',
          linkUrl: 'https://creatorseventsorganization.vercel.app/',
          isExternal: true,
        },
        {
          id: 'exp-meghana',
          client: 'Meghana Builders',
          tag: 'CIVIL INFRASTRUCTURE & REAL ESTATE',
          title: 'Meghana Builders — Architectural Landmark Platform & Property Showcase',
          matter:
            'Designed and developed a monumental landmark property platform for one of Hyderabad’s premier civil engineering and infrastructure firms. Crafted bespoke 3D spatial layout showcases, dynamic property spec sheets, interactive floor plan telemetry, and an encrypted client inquiry pipeline. Built with Next.js and optimized for effortless navigation across commercial and residential developments.',
          imageSrc: '/portfolio-thumbs/meghana.jpg',
          linkUrl: 'https://meghanabuilders.com',
          isExternal: true,
        },
        {
          id: 'exp-jk-restaurant',
          client: 'JK Restaurant',
          tag: 'CULINARY BRANDING & SOCIAL GROWTH',
          title: 'JK Restaurant — Sensory Gastronomy Branding & Digital Ordering Ecosystem',
          matter:
            'Developed a synchronized digital ordering platform and culinary brand narrative for Rajahmundry’s premier dining landmark. The solution incorporates high-definition visual menu engineering, localized table reservation pipelines, instant kitchen telemetry, and geo-targeted social acquisition funnels that drove substantial footfall growth across East Godavari.',
          imageSrc: '/portfolio-thumbs/cornercraft.jpg',
          linkUrl: 'https://instagram.com/jkrestaurant',
          isExternal: true,
        },
      ],
    },
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
      eyebrow: 'OUR CLIENTELE',
      title: 'TRUSTED BY VISIONARY BRANDS',
      subtitle: 'Partnering with ambitious teams across technology, luxury, commerce, and media.',
      items: [
        { id: 'c-1', name: 'Meghana Builders', src: '/clientele/meghana-builders.webp', url: 'https://meghanabuilders.com' },
        { id: 'c-2', name: 'Pooja Productions', src: '/clientele/pooja-productions.png', url: 'https://poojaproductions.com' },
        { id: 'c-3', name: 'Makaan Infrastructure', src: '/clientele/makaan-infrastructure.png', url: 'https://makaaninfra.com' },
        { id: 'c-4', name: 'P&P Connekts', src: '/clientele/pp-connekts.png', url: 'https://pandpconnektss.web.app' },
        { id: 'c-5', name: 'Thor Indian Cuisine', src: '/clientele/thor-cuisine.png', url: 'https://thor-indian-cuisinse.firebaseapp.com' },
        { id: 'c-6', name: 'NRI 360', src: '/clientele/nri-360.png', url: 'https://nri360degrees.com' },
        { id: 'c-7', name: 'Viraj Academy', src: '/clientele/viraj-academy.png', url: 'https://virajedu.com' },
        { id: 'c-8', name: 'ISHOOTS', src: '/clientele/ishoots.jpg', url: 'https://ishoots.com' },
        { id: 'c-9', name: 'Sriya & Janak', src: '/clientele/sriya-janak.jpg', url: 'https://sriyasjaan.com' },
      ],
    },
    cta: {
      eyebrow: 'ENGAGEMENTS',
      line1: 'LET’S WEAVE',
      line2: 'SOMETHING',
      line3: 'REMARKABLE.',
      subtext: 'Transform your business objectives into a cohesive, high-performance digital experience. Let’s start the conversation.',
      buttonLabel: 'START A PROJECT',
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
      image: m.image,
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
    whatsappNumber: '918106574159',
  },
  footer: {
    tagline: 'WE WEAVE YOUR DIGITAL EXCELLENCE.',
    copyright: '© 2026 ARANEA DEN. ALL RIGHTS RESERVED.',
    email: 'contact@araneaden.com',
    phone: '+91 8106574159',
    instagramUrl: 'https://www.instagram.com/araneaden_?stkn=MnoxZmk2d3Zmc2sw',
    linkedinUrl: 'https://linkedin.com',
    githubUrl: 'https://github.com/suryarajamandapalli/araneaden',
  },
};
