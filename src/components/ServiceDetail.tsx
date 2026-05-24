import { motion } from 'framer-motion';
import type { Service } from '../data/services';

const MASTERS: Record<string, { name: string; role: string; exp: string; bio: string; avatar: string }> = {
  cosmetology: {
    name: 'Kristýna Nováková',
    role: 'Senior Cosmetologist',
    exp: '8 years experience',
    bio: 'Specializes in advanced skin regeneration and anti-aging treatments. Certified in microcurrent therapy and peptide protocols from Paris.',
    avatar: 'KN'
  },
  massage: {
    name: 'Tereza Horáková',
    role: 'Body Sculpt Specialist',
    exp: '6 years experience',
    bio: 'Expert in lymphatic drainage and body contouring. Trained at the prestigious Institute of Aesthetic Medicine in Vienna.',
    avatar: 'TH'
  },
  rituals: {
    name: 'Veronika Marková',
    role: 'Spa Ritual Curator',
    exp: '10 years experience',
    bio: 'Creates immersive sensory journeys using rare botanical ingredients. Studied aromatherapy and holistic wellness in Bali and Thailand.',
    avatar: 'VM'
  },
  laser: {
    name: 'Ing. Petra Svobodová',
    role: 'Laser Therapy Expert',
    exp: '7 years experience',
    bio: 'Certified laser technician with specialization in skin resurfacing and pigmentation correction. Regular speaker at European aesthetic conferences.',
    avatar: 'PS'
  },
  peel: {
    name: 'Michaela Čermáková',
    role: 'Chemical Peel Specialist',
    exp: '5 years experience',
    bio: 'Expert in custom acid formulations for all skin types. Trained in advanced chemical exfoliation techniques at the Milan Aesthetic Academy.',
    avatar: 'MČ'
  }
};

interface ServiceDetailProps {
  activeService: Service;
  onBack: () => void;
}

export default function ServiceDetail({ activeService, onBack }: ServiceDetailProps) {
  const master = MASTERS[activeService.id] || MASTERS.cosmetology;

  return (
    <motion.div
      key="detail"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="absolute inset-0 pointer-events-auto overflow-y-auto"
      style={{ touchAction: 'pan-y' }}
    >
      {/* Back button — не перекрывает хедер */}
      <button
        onClick={onBack}
        className="fixed top-16 md:top-20 left-4 md:left-8 font-monument text-[10px] md:text-xs tracking-widest hover:text-[#e5d3b3] transition-colors z-50 flex items-center gap-3 group bg-black/60 px-3 py-2 rounded-full backdrop-blur-sm"
      >
        <span className="w-4 h-[1px] bg-white group-hover:bg-[#e5d3b3] transition-colors" />
        Back
      </button>

      <div className="min-h-full px-4 md:px-16 pt-24 pb-16 flex flex-col gap-8 max-w-7xl mx-auto">

        {/* SERVICE CARD */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-start">

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="glass-panel p-6 md:p-10 rounded-3xl"
          >
            <h4 className="font-monument text-[10px] md:text-xs tracking-[0.25em] text-[#e5d3b3] mb-3 md:mb-4">
              {activeService.subtitle}
            </h4>
            <h2 className="text-4xl md:text-7xl font-editorial mb-4 md:mb-6 leading-[0.9]">
              {activeService.title}
            </h2>
            <p className="font-montreal text-sm md:text-base text-[#a3a3a3] leading-relaxed mb-6 md:mb-10">
              {activeService.desc}
            </p>
            <div className="flex flex-wrap items-center gap-4 md:gap-6 border-t border-white/10 pt-5">
              <div>
                <div className="font-monument text-[8px] text-[#a3a3a3] mb-1 tracking-widest">Duration</div>
                <div className="font-editorial text-lg md:text-2xl">{activeService.time}</div>
              </div>
              <div>
                <div className="font-monument text-[8px] text-[#a3a3a3] mb-1 tracking-widest">Investment</div>
                <div className="font-editorial text-lg md:text-2xl text-[#e5d3b3]">{activeService.price}</div>
              </div>
              <button className="w-full md:w-auto mt-2 md:mt-0 md:ml-auto px-6 py-3 bg-white text-black font-monument text-[10px] tracking-widest rounded-full hover:bg-[#e5d3b3] transition-colors">
                Reserve
              </button>
            </div>
          </motion.div>

          {/* Video */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="rounded-3xl overflow-hidden relative shadow-2xl"
            style={{ aspectRatio: '9/16', maxHeight: '70vh' }}
          >
            <video
              autoPlay muted loop playsInline preload="auto"
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src={activeService.video} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </motion.div>
        </div>

        {/* MASTER BLOCK */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="glass-panel rounded-3xl p-6 md:p-10 flex flex-col md:flex-row items-start md:items-center gap-6"
        >
          {/* Avatar */}
          <div className="shrink-0">
            <div
              className="w-20 h-20 md:w-28 md:h-28 rounded-2xl flex items-center justify-center text-xl md:text-2xl font-editorial font-bold"
              style={{ background: 'linear-gradient(135deg, #2a2a2a, #1a1a1a)', border: '1px solid rgba(229,211,179,0.2)', color: '#e5d3b3' }}
            >
              {master.avatar}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="font-monument text-[9px] tracking-[0.25em] text-[#e5d3b3] mb-1">Your specialist</div>
            <h3 className="font-editorial text-2xl md:text-4xl mb-1">{master.name}</h3>
            <div className="font-montreal text-sm text-[#a3a3a3] mb-3">{master.role} · {master.exp}</div>
            <p className="font-montreal text-sm md:text-base text-[#a3a3a3] leading-relaxed max-w-xl">{master.bio}</p>
          </div>

          {/* Badge */}
          <div className="shrink-0 hidden md:flex flex-col items-center gap-2 px-6 py-4 rounded-2xl" style={{ border: '1px solid rgba(229,211,179,0.15)' }}>
            <div className="font-monument text-[8px] tracking-widest text-[#a3a3a3]">Certified</div>
            <div className="text-[#e5d3b3] text-2xl">✦</div>
            <div className="font-monument text-[8px] tracking-widest text-[#a3a3a3]">Expert</div>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
