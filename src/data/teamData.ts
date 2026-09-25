export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  shortBio?: string;
  image: string;
  order: number;
  linkedin?: string; // Only populated if authoritative URL provided
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'saikiran-chapa',
    name: 'Sai Kiran Chapa',
    role: 'Founder & CEO',
    bio: "Saikiran Chapa leads Aranea Den with a vision to build a forward-thinking digital studio where strategy, creativity, and technology work together to create meaningful digital experiences. With a focus on innovation and connected thinking, he drives the studio's direction across digital strategy, brand development, design, technology, and digital experiences. His approach brings together creative ideas and practical technology to help businesses build stronger, more distinctive digital identities. Under his leadership, Aranea Den is shaped around the belief that every digital experience should have purpose, clarity, and a meaningful connection with its audience.",
    shortBio: 'Leads Aranea Den with a vision to unite strategy, creativity, and technology to create meaningful digital experiences and build distinctive brands.',
    image: '/team/saikiran-chapa.jpeg',
    order: 1,
  },
  {
    id: 'angle',
    name: 'Angle',
    role: 'Graphic Designer & Video Editor',
    bio: "Creates visually compelling designs and engaging video content that bring Aranea Den's creative vision and brand identity to life.",
    shortBio: "Creates visually compelling designs and engaging video content that bring Aranea Den's creative vision to life.",
    image: '/team/angle.jpeg',
    order: 2,
  },
  {
    id: 'shiva',
    name: 'Shiva',
    role: 'Video Editor',
    bio: "Crafts engaging video content and compelling visual narratives that bring Aranea Den's creative ideas to life.",
    shortBio: "Crafts engaging video content and compelling visual narratives that bring creative ideas to life.",
    image: '/team/shiva.jpeg',
    order: 3,
  },
  {
    id: 'chandu',
    name: 'Chandu',
    role: 'Visuals / Videography',
    bio: "Captures compelling visuals and cinematic footage that bring Aranea Den's creative vision and brand stories to life.",
    shortBio: "Captures compelling visuals and cinematic footage that bring brand stories to life.",
    image: '/team/chandu.jpeg',
    order: 4,
  },
  {
    id: 'surya',
    name: 'Surya',
    role: 'Web & App Developer',
    bio: 'Builds responsive websites and intuitive applications that transform ideas into seamless, engaging digital experiences.',
    shortBio: 'Builds responsive websites and intuitive applications transforming ideas into digital experiences.',
    image: '/team/surya.jpeg',
    order: 5,
  },
  {
    id: 'john',
    name: 'John',
    role: 'FS Developer',
    bio: 'Develops seamless web applications by combining intuitive front-end experiences with robust back-end functionality, bringing ideas to life through technology.',
    shortBio: 'Develops seamless web applications combining intuitive front-end with robust back-end functionality.',
    image: '/team/john.jpeg',
    order: 6,
  },
  {
    id: 'jagruthi',
    name: 'Jagruthi',
    role: 'FS Developer',
    bio: 'Builds dynamic web applications by combining intuitive user interfaces with reliable back-end systems to deliver seamless digital experiences.',
    shortBio: 'Builds dynamic web applications combining intuitive interfaces with reliable back-end systems.',
    image: '/team/jagruthi.jpeg',
    order: 7,
  },
  {
    id: 'pujitha-m',
    name: 'Pujitha M',
    role: 'Social Media Manager',
    bio: "Manages Aranea Den's social media presence, crafting engaging content and building meaningful connections with audiences across digital platforms.",
    shortBio: "Manages social media presence, crafting engaging content and building meaningful digital connections.",
    image: '/team/pujitha-m.jpeg',
    order: 8,
  },
];
