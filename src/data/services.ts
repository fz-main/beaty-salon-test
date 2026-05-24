export const STAGES = {
  INTRO: 0,
  MENU: 1,
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
    video: 'https://res.cloudinary.com/dfh97tdty/video/upload/v1779635403/202605241806_nuyvnz.mp4',
    transition: '/beaty-salon-test/videos/transition1.mp4',
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
    video: 'https://res.cloudinary.com/dfh97tdty/video/upload/v1779635467/fefba50b4ae23a4f1addb6ffe426ef86_720w_nej3zd.mp4',
    transition: '/beaty-salon-test/videos/transition2.mp4',
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
    video: 'https://res.cloudinary.com/dfh97tdty/video/upload/v1779635491/f0e8b99fc99b7c9f01c9f70e3d33f861_720w_fkq57v.mp4',
    transition: '/beaty-salon-test/videos/transition3.mp4',
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
    video: 'https://res.cloudinary.com/dfh97tdty/video/upload/v1779635507/d02b9d2dcaba4e0dcfb26760572a78f5_t4_d0pqst.mp4',
    transition: '/beaty-salon-test/videos/transition4.mp4',
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
    video: 'https://res.cloudinary.com/dfh97tdty/video/upload/v1779635551/09ed51bc94f60ed3d62475a0689cc7ab_t4_kb0pdq.mp4',
    transition: '/beaty-salon-test/videos/transition5.mp4',
    price: '2,100 CZK',
    time: '60 min',
    position: [0, 0, -15],
    color: '#a3a3a3'
  }
];
