import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { STAGES, SERVICES } from './data/services';
import type { Service } from './data/services';
import { translations } from './lib/i18n';
import type { Lang } from './lib/i18n';
import ThreeScene from './components/ThreeScene';
import ServiceDetail from './components/ServiceDetail';
import MenuButton from './components/MenuButton';

export default function App() {
  const [lang, setLang] = useState<Lang>('cs');
  const t = translations[lang];

  const [stage, setStage] = useState(STAGES.INTRO);
  const [activeService, setActiveService] = useState<Service | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [transitionUrl, setTransitionUrl] = useState('');
  const [bgVideoUrl, setBgVideoUrl] = useState('');
  const bgVideoRef = useRef<HTMLVideoElement>(null);

  const showCard = useCallback(() => {
    setShowTransition(false);
    if (bgVideoRef.current) {
      const v = bgVideoRef.current;
      v.currentTime = v.duration || 99999;
      v.pause();
    }
    setStage(STAGES.SERVICE_DETAIL);
  }, []);

  const handleServiceClick = (service: Service) => {
    setActiveService(service);
    setTransitionUrl(service.transition);
    setBgVideoUrl(service.transition);
    setShowTransition(true);
  };

  const handleBack = () => {
    setIsTransitioning(true);
    setBgVideoUrl('');
    setStage(STAGES.MENU);
    setTimeout(() => {
      setActiveService(null);
      setIsTransitioning(false);
    }, 600);
  };

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (stage === STAGES.INTRO && e.deltaY > 0) setStage(STAGES.MENU);
      else if (stage === STAGES.MENU && e.deltaY < 0) setStage(STAGES.INTRO);
    };
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => { touchStartY = e.touches[0].clientY; };
    const handleTouchEnd = (e: TouchEvent) => {
      const deltaY = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(deltaY) > 50) {
        if (stage === STAGES.INTRO && deltaY > 0) setStage(STAGES.MENU);
        else if (stage === STAGES.MENU && deltaY < 0) setStage(STAGES.INTRO);
      }
    };
    window.addEventListener('wheel', handleWheel);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [stage]);

  const letterVariants: any = {
    hidden: { opacity: 0, y: 50, filter: 'blur(10px)' },
    visible: (i: number) => ({
      opacity: 1, y: 0, filter: 'blur(0px)',
      transition: { delay: i * 0.05, duration: 0.8 }
    })
  };

  const langs: Lang[] = ['cs', 'en', 'de'];

  return (
    <div className="w-screen h-screen bg-[#0a0a0a] text-[#f8f5f2] overflow-hidden relative selection:bg-[#e5d3b3] selection:text-black">

      {/* PARTICLES */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <ThreeScene stage={stage} activeService={activeService} isTransitioning={isTransitioning} onServiceClick={handleServiceClick} />
      </div>

      {/* ДЕВУШКА — фон меню */}
      {(stage === STAGES.MENU || stage === STAGES.SERVICE_DETAIL) && (
        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{ opacity: stage === STAGES.MENU && !showTransition ? 1 : 0, transition: 'opacity 2s ease' }}
        >
          <video autoPlay muted loop playsInline className="w-full h-full object-cover object-top">
            <source src="https://res.cloudinary.com/dfh97tdty/video/upload/v1779623634/8956058-uhd_3840_2160_24fps_1_orgyze.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/75" />
        </div>
      )}

      {/* ФОНОВОЕ ВИДЕО ПЕРЕХОДА */}
      {bgVideoUrl && stage === STAGES.SERVICE_DETAIL && (
        <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden" style={{ transform: 'scale(1.15)' }}>
          <video ref={bgVideoRef} src={bgVideoUrl} muted playsInline className="w-full h-full object-cover" style={{ filter: 'blur(20px)' }} />
          <div className="absolute inset-0 bg-black/70" />
        </div>
      )}

      {/* ВИДЕО-ПЕРЕХОД */}
      <AnimatePresence>
        {showTransition && transitionUrl && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
            className="absolute inset-0 z-[20] pointer-events-none">
            <TransitionVideo url={transitionUrl} onEnded={showCard} bgVideoRef={bgVideoRef} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* UI */}
      <div className="absolute inset-0 z-10 pointer-events-none">

        {/* HEADER */}
        <header className="absolute top-0 left-0 w-full px-6 py-5 md:px-8 md:py-8 flex justify-between items-center z-50 mix-blend-difference">
          <div className="font-monument text-[10px] md:text-xs tracking-[0.2em]">Kosmetika Nebeská</div>
          <div className="flex items-center gap-3 md:gap-4 pointer-events-auto">
            {/* Lang switcher */}
            <div className="flex items-center gap-1">
              {langs.map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`font-monument text-[9px] md:text-[10px] tracking-wider px-2 py-1 rounded-full transition-all ${
                    lang === l ? 'bg-white text-black' : 'text-white/60 hover:text-white'
                  }`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <div className="font-montreal text-[10px] md:text-xs uppercase tracking-widest">Prague</div>
          </div>
        </header>

        <AnimatePresence mode="wait">

          {/* INTRO */}
          {stage === STAGES.INTRO && (
            <motion.div key="intro"
              exit={{ opacity: 0, filter: 'blur(20px)', scale: 1.1 }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              className="absolute inset-0 flex flex-col items-center justify-center px-4"
            >
              <div className="overflow-hidden flex flex-wrap justify-center">
                {'NEBESKÁ'.split('').map((char, i) => (
                  <motion.span key={i} custom={i} variants={letterVariants} initial="hidden" animate="visible"
                    className="text-[16vw] sm:text-[14vw] md:text-[12vw] font-editorial leading-none tracking-tighter">
                    {char}
                  </motion.span>
                ))}
              </div>
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 1 }}
                className="font-montreal text-[11px] md:text-sm text-[#a3a3a3] tracking-widest uppercase mt-4 text-center">
                {t.tagline}
              </motion.p>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 2 }}
                className="absolute bottom-8 md:bottom-12 flex flex-col items-center">
                <span className="font-montreal text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-[#a3a3a3] mb-3 md:mb-4">{t.scrollToEnter}</span>
                <div className="w-[1px] h-10 md:h-12 bg-white/20 overflow-hidden relative">
                  <motion.div animate={{ y: ['-100%', '100%'] }} transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                    className="absolute inset-0 bg-white" />
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* MENU */}
          {stage === STAGES.MENU && !isTransitioning && !showTransition && (
            <motion.div key="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.8 }}
              className="absolute inset-0 pointer-events-auto"
            >
              {/* Mobile + Tablet */}
              <div className="flex lg:hidden flex-col items-center justify-center h-full gap-5 px-8">
                {SERVICES.map((srv) => (
                  <MenuButton key={srv.id} service={{ ...srv, title: t.services[srv.id as keyof typeof t.services]?.title || srv.title }}
                    onClick={() => handleServiceClick(srv)} enterLabel={t.enterModule} />
                ))}
              </div>
              {/* Desktop */}
              <div className="hidden lg:block w-full h-full">
                {[
                  { srv: SERVICES[0], pos: 'absolute top-[18%] left-[8%]' },
                  { srv: SERVICES[1], pos: 'absolute top-[18%] right-[8%]' },
                  { srv: SERVICES[2], pos: 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' },
                  { srv: SERVICES[3], pos: 'absolute bottom-[18%] left-[8%]' },
                  { srv: SERVICES[4], pos: 'absolute bottom-[18%] right-[8%]' },
                ].map(({ srv, pos }) => (
                  <div key={srv.id} className={pos}>
                    <MenuButton service={{ ...srv, title: t.services[srv.id as keyof typeof t.services]?.title || srv.title }}
                      onClick={() => handleServiceClick(srv)} enterLabel={t.enterModule} />
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* SERVICE DETAIL */}
          {stage === STAGES.SERVICE_DETAIL && activeService && !isTransitioning && (
            <ServiceDetail key="detail" activeService={activeService} onBack={handleBack} lang={lang} t={t} />
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

function TransitionVideo({ url, onEnded, bgVideoRef }: {
  url: string; onEnded: () => void; bgVideoRef: React.RefObject<HTMLVideoElement | null>;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (bgVideoRef.current) { bgVideoRef.current.currentTime = 0; bgVideoRef.current.play().catch(() => {}); }
    video.play().catch(() => onEnded());
  }, [onEnded, bgVideoRef]);
  const handleTimeUpdate = () => {
    if (ref.current && bgVideoRef.current) bgVideoRef.current.currentTime = ref.current.currentTime;
  };
  return <video ref={ref} src={url} muted playsInline onEnded={onEnded} onTimeUpdate={handleTimeUpdate} className="w-full h-full object-cover" />;
}
