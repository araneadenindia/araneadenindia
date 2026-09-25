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
    title: 'SkillSync x TechWing Launching Coverage',
    client: 'GGU & TechWing',
    caption: 'Official video coverage and cinematic launch showcase for SkillSync by TechWing at GGU, equipping students with real-world industry skills.',
    thumbnail: '/reels/reel_02.jpg',
    videoSrc: '/9.16 Ratio Vid Final.mp4',
    instagramUrl: 'https://www.instagram.com/araneaden_/reel/DbTcQycTAG6/',
    aspectRatio: '9:16',
    likes: '247 Likes',
    tag: 'MOST POPULAR'
  },
  {
    id: 'reel-2',
    title: 'Sri Venkateswara Swamy Temple Cinematic',
    client: 'Devotional Film',
    caption: 'Cinematic spiritual visual production capturing the sacred deity ornamentation on Tholi Ekadasi in pristine high definition.',
    thumbnail: '/reels/reel_03.jpg',
    videoSrc: '/Vid 1.mp4',
    instagramUrl: 'https://www.instagram.com/sri_venkateswaraswamy_temple/reel/DbN2q-4t5qg/',
    aspectRatio: '9:16',
    likes: '185 Likes',
    tag: 'HIGH IMPACT'
  },
  {
    id: 'reel-3',
    title: 'Rajahmundry 14th Startup Potluck Live Pitch',
    client: 'Startup Potluck',
    caption: 'Media partner video production covering Rajahmundry\'s milestone live startup idea pitch and founder networking ecosystem.',
    thumbnail: '/reels/reel_05.jpg',
    videoSrc: '/9.16 Ratio Vid.mp4',
    instagramUrl: 'https://www.instagram.com/araneaden_/reel/DaxbWhTz9hH/',
    aspectRatio: '9:16',
    likes: '76 Likes',
    tag: 'MEDIA PARTNER'
  },
  {
    id: 'reel-4',
    title: 'Aranea Den 3-Day AI Web Workshop',
    client: 'Aranea Den Academy',
    caption: 'Comprehensive recap of the 3-day AI Web Development workshop, guiding 15 selected builders from architecture to deployment.',
    thumbnail: '/reels/reel_06.jpg',
    videoSrc: '/Vid 1.mp4',
    instagramUrl: 'https://www.instagram.com/araneaden_/reel/DafsnuPTfHo/',
    aspectRatio: '9:16',
    likes: '68 Likes',
    tag: 'WORKSHOP FILM'
  },
  {
    id: 'reel-5',
    title: 'Founder Story — The Journey of Aranea Den',
    client: 'Aranea Den Origin',
    caption: 'Founder Sai Kiran Chapa shares the foundational journey, architectural vision, and mission behind Aranea Den.',
    thumbnail: '/reels/reel_01.jpg',
    videoSrc: '/16.9 Ratio Vid.mp4',
    instagramUrl: 'https://www.instagram.com/araneaden_/reel/DbBc6t9zdI7/',
    aspectRatio: '9:16',
    likes: 'Top Story',
    tag: 'FOUNDER STORY'
  },
  {
    id: 'reel-6',
    title: 'Startup India Digital Solutions Showcase',
    client: 'Startup India Initiative',
    caption: 'Showcase of affordable, high-precision digital products, mobile applications, and software architectures engineered for emerging enterprises.',
    thumbnail: '/reels/reel_04.jpg',
    videoSrc: '/9.16 Ratio Vid Final.mp4',
    instagramUrl: 'https://www.instagram.com/araneaden_/reel/Da8L5f_oK88/',
    aspectRatio: '9:16',
    likes: 'Featured',
    tag: 'STUDIO REEL'
  },
  {
    id: 'reel-7',
    title: 'Design • Develop • Grow Motion Cut',
    client: 'Brand Philosophy',
    caption: 'Core studio brand video highlighting our tripartite discipline: Design, Develop, and Scaled Digital Growth.',
    thumbnail: '/reels/reel_07.jpg',
    videoSrc: '/9.16 Ratio Vid.mp4',
    instagramUrl: 'https://www.instagram.com/araneaden_/p/DadHe2zz6aV/',
    aspectRatio: '9:16',
    likes: 'Brand Cut',
    tag: 'BRAND VISION'
  }
];
