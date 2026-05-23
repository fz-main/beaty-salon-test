export const STAGES = {
  INTRO: 0,
  MENU: 1,
  TRANSITION: 3,
  SERVICE_DETAIL: 2
};

export interface Service {
  id: string;
  title: string;
  subtitle: string;
  desc: string;
  video: string;
  transition: string;
  price: string;
  time: string;
  position: [number, number, number];
  color: string;
}

export const SERVICES: Service[] = [
  {
    id: 'cosmetology',
    title: 'Cosmetology',
    subtitle: 'Cellular Renewal',
    desc: 'Deep cellular regeneration using advanced peptides and micro-currents. A complete reset for your skin architecture.',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-woman-applying-cream-on-her-face-41373-large.mp4',
    transition: '/videos/transition1.mp4',
    price: '2,500 CZK',
    time: '90 min',
    position: [-10, 0, -10],
    color: '#e5d3b3'
  },
  {
    id: 'massage',
    title: 'Body Sculpt',
    subtitle: 'Lymphatic Drainage',
    desc: 'Precision sculpting and deep tissue release. Restores natural flow and contours the body silhouette.',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-hands-massaging-a-persons-back-22963-large.mp4',
    transition: '/videos/transition2.mp4',
    price: '1,800 CZK',
    time: '60 min',
    position: [10, 0, -10],
    color: '#d4c5b0'
  },
  {
    id: 'rituals',
    title: 'Spa Rituals',
    subtitle: 'Sensory Journey',
    desc: 'Immersive sensory experiences using rare botanical extracts and flowing textures to melt away tension.',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-pouring-water-in-a-bucket-with-flowers-33214-large.mp4',
    transition: '/videos/transition3.mp4',
    price: '3,200 CZK',
    time: '120 min',
    position: [-10, 0, 10],
    color: '#c4a77d'
  },
  {
    id: 'laser',
    title: 'Laser Therapy',
    subtitle: 'Precision Resurfacing',
    desc: 'Advanced light therapy for flawless texture, targeting pigmentation and stimulating deep collagen production.',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-beautician-treating-the-face-of-a-patient-42635-large.mp4',
    transition: '/videos/transition4.mp4',
    price: '4,500 CZK',
    time: '45 min',
    position: [10, 0, 10],
    color: '#f8f5f2'
  },
  {
    id: 'peel',
    title: 'Chemical Peels',
    subtitle: 'Ethereal Glow',
    desc: 'Custom-blended acids to gently dissolve impurities, revealing an impossibly smooth, glass-like complexion.',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-dripping-essential-oil-into-a-small-bottle-43420-large.mp4',
    transition: '/videos/transition5.mp4',
    price: '2,100 CZK',
    time: '60 min',
    position: [0, 0, -15],
    color: '#a3a3a3'
  }
];
