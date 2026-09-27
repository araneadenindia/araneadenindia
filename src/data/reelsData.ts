// Authoritative Aranea Den Instagram Reels from official channel @araneaden_
export interface AraneaReel {
  id: string;
  title: string;
  client: string;
  caption: string;
  thumbnail: string;
  videoSrc: string;
  instagramUrl: string;
  aspectRatio: '9:16' | '16:9';
  likes: string;
  tag: string;
}

export const ARANEA_REELS: AraneaReel[] = [
  {
    id: 'reel-1',
    title: 'Startup Potluck — Founder Pitch',
    client: 'Startup Potluck',
    caption: 'Official video coverage and cinematic launch showcase for Startup Potluck in Rajahmundry.',
    thumbnail: '/reels/reel_05.jpg',
    videoSrc: '/reels-videos/startup_potluck_rjy_1786440024_3961264728183160298_74679998814.mp4',
    instagramUrl: 'https://www.instagram.com/araneaden_/reel/DaxbWhTz9hH/',
    aspectRatio: '9:16',
    likes: '142 Likes',
    tag: 'STARTUP PITCH'
  },
  {
    id: 'reel-2',
    title: 'Pelli Kaburulu — Wedding Cinema',
    client: 'Pelli Kaburulu',
    caption: 'Cinematic spiritual and wedding visual production in pristine high definition.',
    thumbnail: '/reels/reel_03.jpg',
    videoSrc: '/reels-videos/pellikaburulu_1787659539_3971495993551412881_38090851276.mp4',
    instagramUrl: 'https://www.instagram.com/araneaden_/reel/DbN2q-4t5qg/',
    aspectRatio: '9:16',
    likes: '185 Likes',
    tag: 'WEDDING CINEMA'
  },
  {
    id: 'reel-3',
    title: 'CEO Expos — Business Summit',
    client: 'CEO Expos',
    caption: 'High-impact conference and executive event media production by AD Imperial Visuals.',
    thumbnail: '/reels/reel_02.jpg',
    videoSrc: '/reels-videos/ceoexpos_1790094616_3991924443449835252_28995625029.mp4',
    instagramUrl: 'https://www.instagram.com/araneaden_/reel/DbTcQycTAG6/',
    aspectRatio: '9:16',
    likes: '247 Likes',
    tag: 'EXECUTIVE EXPO'
  },
  {
    id: 'reel-4',
    title: 'Finance with Veeru — Market Cut',
    client: 'Finance with Veeru',
    caption: 'Engaging social media reel and personal brand cinematography for financial advisory.',
    thumbnail: '/reels/reel_04.jpg',
    videoSrc: '/reels-videos/financewithveeru.in_1789577476_3987584190576710280_80084628249.mp4',
    instagramUrl: 'https://www.instagram.com/araneaden_/reel/Da8L5f_oK88/',
    aspectRatio: '9:16',
    likes: '96 Likes',
    tag: 'FINANCE MEDIA'
  },
  {
    id: 'reel-5',
    title: 'JK Restaurant — Culinary Story',
    client: 'JK Restaurant',
    caption: 'Sensory gastronomy shoot capturing restaurant ambiance, master dining and craft drinks.',
    thumbnail: '/reels/reel_06.jpg',
    videoSrc: '/reels-videos/jkrestaurant_rjy_1778126188_3991526363185666723_29264016244.mp4',
    instagramUrl: 'https://www.instagram.com/araneaden_/reel/DafsnuPTfHo/',
    aspectRatio: '9:16',
    likes: '118 Likes',
    tag: 'HOSPITALITY'
  },
  {
    id: 'reel-6',
    title: 'Aranea Den — Creative Atelier',
    client: 'Aranea Den',
    caption: 'Official studio reel highlighting bespoke digital architecture and high-end video storytelling.',
    thumbnail: '/reels/reel_01.jpg',
    videoSrc: '/reels-videos/araneaden__1785172109_3950625597109830074_67994861925.mp4',
    instagramUrl: 'https://www.instagram.com/araneaden_/reel/DbBc6t9zdI7/',
    aspectRatio: '9:16',
    likes: 'Top Story',
    tag: 'STUDIO CUT'
  },
  {
    id: 'reel-7',
    title: 'Pelli Kaburulu — Sacred Rituals',
    client: 'Pelli Kaburulu',
    caption: 'Authentic ceremonial traditions captured with rich color fidelity and cinematic optics.',
    thumbnail: '/reels/reel_07.jpg',
    videoSrc: '/reels-videos/pellikaburulu_1787939667_3973847582358427833_38090851276.mp4',
    instagramUrl: 'https://www.instagram.com/araneaden_/p/DadHe2zz6aV/',
    aspectRatio: '9:16',
    likes: '164 Likes',
    tag: 'CEREMONY'
  },
  {
    id: 'reel-8',
    title: 'Startup Potluck — Networking Live',
    client: 'Startup Potluck',
    caption: 'Vibrant ecosystem gathering of founders, angel investors, and innovators in Rajahmundry.',
    thumbnail: '/reels/reel_05.jpg',
    videoSrc: '/reels-videos/startup_potluck_rjy_1777890583_3889546957292920248_74679998814.mp4',
    instagramUrl: 'https://www.instagram.com/araneaden_/reel/DaxbWhTz9hH/',
    aspectRatio: '9:16',
    likes: '89 Likes',
    tag: 'NETWORKING'
  },
  {
    id: 'reel-9',
    title: 'Amma Odi School — Campus Life',
    client: 'Amma Odi School',
    caption: 'Inspiring documentary highlight capturing students, learning environments, and cultural activities.',
    thumbnail: '/reels/reel_02.jpg',
    videoSrc: '/reels-videos/ammaodischool_tekkali_1769225624_3816862457185017349_59769473679.mp4',
    instagramUrl: 'https://www.instagram.com/araneaden_/reel/DbTcQycTAG6/',
    aspectRatio: '9:16',
    likes: '210 Likes',
    tag: 'DOCUMENTARY'
  },
  {
    id: 'reel-10',
    title: 'JK Restaurant — Ambiance & Dine',
    client: 'JK Restaurant',
    caption: 'Evening dining atmosphere and artisanal culinary showcase for social media engagement.',
    thumbnail: '/reels/reel_06.jpg',
    videoSrc: '/reels-videos/jkrestaurant_rjy_1779019414_3899015312547507593_29264016244.mp4',
    instagramUrl: 'https://www.instagram.com/araneaden_/reel/DafsnuPTfHo/',
    aspectRatio: '9:16',
    likes: '135 Likes',
    tag: 'DINE & NIGHT'
  }
];
