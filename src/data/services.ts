export const STAGES = {
  INTRO: 0,
  MENU: 1,
  SERVICE_DETAIL: 2,
  ABOUT: 3
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
    id: 'permanent',
    title: 'Permanent Makeup',
    subtitle: 'Perfect Symmetry',
    desc: 'Effortless beauty every morning. Brows, lips and eyes crafted with hypoallergenic pigments for a natural, lasting result.',
    video: 'https://res.cloudinary.com/dfh97tdty/video/upload/v1780060556/makeup_iak5zv.mp4',
    transition: 'https://res.cloudinary.com/dfh97tdty/video/upload/v1780046244/-1663827547266895989_wgu30i.mp4',
    price: 'od 3,000 CZK',
    time: '90 min',
    position: [-10, 0, -10],
    color: '#e5d3b3'
  },
  {
    id: 'manicure',
    title: 'Manicure',
    subtitle: 'Art in Every Detail',
    desc: 'From classic to sculptured nails — premium materials, lasting designs and a personal touch in every service.',
    video: 'https://res.cloudinary.com/dfh97tdty/video/upload/v1780060556/manicure_aqzped.mp4',
    transition: 'https://res.cloudinary.com/dfh97tdty/video/upload/v1780046244/7987876687881110766_dy68dl.mp4',
    price: 'od 600 CZK',
    time: '60 min',
    position: [10, 0, -10],
    color: '#d4c5b0'
  },
  {
    id: 'pedicure',
    title: 'Pedicure',
    subtitle: 'Elegance in Every Step',
    desc: 'Complete foot care combining health and beauty. Classic, spa and gel options by experienced specialists.',
    video: 'https://res.cloudinary.com/dfh97tdty/video/upload/v1780060555/pedicure_oe4qkd.mp4',
    transition: 'https://res.cloudinary.com/dfh97tdty/video/upload/v1780056600/transition3_qygv31.mp4',
    price: 'od 900 CZK',
    time: '60 min',
    position: [-10, 0, 10],
    color: '#c4a77d'
  },
  {
    id: 'cosmetology',
    title: 'Cosmetology',
    subtitle: 'Skin Renewal',
    desc: 'Professional skin care tailored to your needs — cleansing, hydration, anti-aging and corrective treatments.',
    video: 'https://res.cloudinary.com/dfh97tdty/video/upload/v1779635403/202605241806_nuyvnz.mp4',
    transition: 'https://res.cloudinary.com/dfh97tdty/video/upload/v1779519696/transition1_qhqff4.mp4',
    price: 'od 1,500 CZK',
    time: '60 min',
    position: [10, 0, 10],
    color: '#f8f5f2'
  },
  {
    id: 'depilation',
    title: 'Depilation',
    subtitle: 'Smooth Perfection',
    desc: 'Gentle and effective hair removal for all body zones. Silky smooth results with minimal discomfort.',
    video: 'https://res.cloudinary.com/dfh97tdty/video/upload/v1779635551/09ed51bc94f60ed3d62475a0689cc7ab_t4_kb0pdq.mp4',
    transition: 'https://res.cloudinary.com/dfh97tdty/video/upload/v1780046245/6023027278841651810_agyz8i.mp4',
    price: 'od 300 CZK',
    time: '30 min',
    position: [0, 0, -15],
    color: '#a3a3a3'
  },
  {
    id: 'massage',
    title: 'Massage',
    subtitle: 'Body & Soul',
    desc: 'Relaxing and therapeutic massage techniques to release tension, restore balance and revitalize the body.',
    video: 'https://res.cloudinary.com/dfh97tdty/video/upload/v1779635467/fefba50b4ae23a4f1addb6ffe426ef86_720w_nej3zd.mp4',
    transition: 'https://res.cloudinary.com/dfh97tdty/video/upload/v1780046243/5920464878404581476_pw2vgf.mp4',
    price: 'od 800 CZK',
    time: '60 min',
    position: [0, 0, 15],
    color: '#d4c5b0'
  }
];
