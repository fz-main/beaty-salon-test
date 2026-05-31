import { motion, AnimatePresence } from 'framer-motion';
import type { Service } from '../data/services';
import type { Lang, Translations } from '../lib/i18n';

interface ServiceDetailProps {
  activeService: Service;
  onBack: () => void;
  lang?: Lang;
  t: Translations;
}

export default function ServiceDetail({ activeService, onBack, lang: _lang, t }: ServiceDetailProps) {
  const srvT = t.services[activeService.id as keyof typeof t.services];
  const mastersT = (t.masters[activeService.id as keyof typeof t.masters] as unknown) as Array<{ name: string; role: string; exp: string; photo?: string }>;

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
      <button
        onClick={onBack}
        className="fixed top-4 right-4 md:top-6 md:right-8 font-monument text-[10px] tracking-widest hover:text-[#e5d3b3] transition-colors z-[60] flex items-center gap-2 bg-black/80 px-4 py-2 rounded-full backdrop-blur-sm pointer-events-auto"
      >
        <span className="w-3 h-[1px] bg-white group-hover:bg-[#e5d3b3] transition-colors" />
        {t.back}
      </button>

      <div className="min-h-full px-4 md:px-16 pt-20 md:pt-28 pb-16 flex flex-col gap-6 md:gap-8 max-w-7xl mx-auto">

        {/* Mobile: stacked, Desktop: side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-10 items-start">

          {/* Video — on mobile comes first, smaller */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.1 }}
            className="rounded-2xl md:rounded-3xl overflow-hidden relative shadow-2xl md:order-2"
            style={{ aspectRatio: '16/9', maxHeight: '30vh' }}
          >
            <video autoPlay muted loop playsInline preload="auto" className="absolute inset-0 w-full h-full object-cover">
              <source src={activeService.video} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </motion.div>

          {/* Info card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="glass-panel p-5 md:p-10 rounded-2xl md:rounded-3xl md:order-1"
          >
            <h4 className="font-monument text-[9px] md:text-xs tracking-[0.25em] text-[#e5d3b3] mb-2 md:mb-4">
              {srvT?.subtitle}
            </h4>
            <h2 className="text-3xl md:text-7xl font-editorial mb-3 md:mb-6 leading-[0.9]">
              {srvT?.title}
            </h2>
            <p className="font-montreal text-sm text-[#a3a3a3] leading-relaxed mb-5 md:mb-10">
              {srvT?.desc}
            </p>
            <div className="flex flex-wrap items-center gap-4 border-t border-white/10 pt-4">
              <div>
                <div className="font-monument text-[8px] text-[#a3a3a3] mb-1 tracking-widest">{t.duration}</div>
                <div className="font-editorial text-lg md:text-2xl">{activeService.time}</div>
              </div>
              <div>
                <div className="font-monument text-[8px] text-[#a3a3a3] mb-1 tracking-widest">{t.investment}</div>
                <div className="font-editorial text-lg md:text-2xl text-[#e5d3b3]">{activeService.price}</div>
              </div>
              <button
                onClick={() => window.open('https://n1315340.alteg.io/company/1258605/personal/menu?o=', '_blank')}
                className="w-full md:w-auto mt-1 md:mt-0 md:ml-auto px-5 py-2.5 bg-white text-black font-monument text-[10px] tracking-widest rounded-full hover:bg-[#e5d3b3] transition-colors"
              >
                {t.reserve}
              </button>
            </div>
          </motion.div>
        </div>

        {/* MASTERS */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
          className="glass-panel rounded-2xl md:rounded-3xl p-5 md:p-10"
        >
          <div className="font-monument text-[9px] tracking-[0.25em] text-[#e5d3b3] mb-4">{t.yourSpecialist}</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.isArray(mastersT) && mastersT.map((m, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="shrink-0 w-12 h-12 md:w-16 md:h-16 overflow-hidden rounded-xl">
                  {m.photo ? (
                    <img src={m.photo} alt={m.name}
                      className="w-full h-full object-cover object-top"
                      style={{ border: '1px solid rgba(229,211,179,0.2)' }} />
                  ) : (
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl flex items-center justify-center text-base font-editorial font-bold"
                      style={{ background: 'linear-gradient(135deg, #2a2a2a, #1a1a1a)', border: '1px solid rgba(229,211,179,0.2)', color: '#e5d3b3' }}>
                      {m.name.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                  )}
                </div>
                <div>
                  <div className="font-editorial text-base md:text-lg leading-tight">{m.name}</div>
                  <div className="font-montreal text-[10px] text-[#a3a3a3]">{m.role}</div>
                  <div className="font-monument text-[8px] text-[#e5d3b3] tracking-wider">{m.exp}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>

      <AnimatePresence />
    </motion.div>
  );
}
