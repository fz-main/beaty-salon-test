import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { STAGES, SERVICES } from './data/services';
import type { Service } from './data/services';
import { translations } from './lib/i18n';
import type { Lang } from './lib/i18n';
import ThreeScene from './components/ThreeScene';
import ServiceDetail from './components/ServiceDetail';
import MenuButton from './components/MenuButton';

// Dummy component for transition video – replace with your actual implementation if needed
function TransitionVideo({ url, onEnded, bgVideoRef }: {
  url: string; onEnded: () => void; bgVideoRef: React.RefObject<HTMLVideoElement | null>;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const bgVideo = bgVideoRef.current;
    if (bgVideo) {
      bgVideo.currentTime = 0;
      bgVideo.play().catch(() => {});
    }
    video.play().then(() => {}).catch(() => onEnded()); // Added a fallback for playback errors
  }, [url, onEnded, bgVideoRef]); // Added url to dependencies

  const handleTimeUpdate = () => {
    const video = ref.current;
    const bgVideo = bgVideoRef.current;
    if (video && bgVideo) {
      bgVideo.currentTime = video.currentTime;
    }
  };

  return <video ref={ref} src={url} muted playsInline onEnded={onEnded} onTimeUpdate={handleTimeUpdate} className="w-full h-full object-cover" />;
}


export default function App() {
  const [lang, setLang] = useState<Lang>('cs');
  const t = translations[lang];

  const [stage, setStage] = useState(STAGES.INTRO);
  const lastScrollTime = useRef(0);
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
    // Ensure we only set transition URL if it exists to avoid errors
    setTransitionUrl(service.transition || '');
    // Use the transition video as background for the service detail stage
    setBgVideoUrl(service.transition || '');
    // Show the transition overlay
    if (service.transition) { // Only show transition if a URL is provided
      setShowTransition(true);
    } else {
      // If no transition video, directly move to service detail
      setStage(STAGES.SERVICE_DETAIL);
    }
  };

  const handleBack = () => {
    setIsTransitioning(true);
    setBgVideoUrl(''); // Clear background video
    setStage(STAGES.MENU);
    setTimeout(() => {
      setActiveService(null);
      setIsTransitioning(false);
    }, 600);
  };

  useEffect(() => {
    const COOLDOWN = 2500;
    const handleWheel = (e: WheelEvent) => {
      const now = Date.now();
      if (now - lastScrollTime.current < COOLDOWN) return;
      if (stage === STAGES.INTRO && e.deltaY > 0) { setStage(STAGES.MENU); lastScrollTime.current = now; }
      else if (stage === STAGES.MENU && e.deltaY < 0) { setStage(STAGES.INTRO); lastScrollTime.current = now; }
      else if (stage === STAGES.MENU && e.deltaY > 0) { setStage(STAGES.ABOUT); lastScrollTime.current = now; }
      else if (stage === STAGES.ABOUT && e.deltaY < 0) { setStage(STAGES.MENU); lastScrollTime.current = now; }
    };
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => { touchStartY = e.touches[0].clientY; };
    const handleTouchEnd = (e: TouchEvent) => {
      const now = Date.now();
      if (now - lastScrollTime.current < COOLDOWN) return;
      const deltaY = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(deltaY) > 50) {
        if (stage === STAGES.INTRO && deltaY > 0) { setStage(STAGES.MENU); lastScrollTime.current = now; }
        else if (stage === STAGES.MENU && deltaY < 0) { setStage(STAGES.INTRO); lastScrollTime.current = now; }
        else if (stage === STAGES.MENU && deltaY > 0) { setStage(STAGES.ABOUT); lastScrollTime.current = now; }
        else if (stage === STAGES.ABOUT && deltaY < 0) { setStage(STAGES.MENU); lastScrollTime.current = now; }
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

      {/* BACKGROUND FOR MENU AND SERVICE DETAIL STAGES */}
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

      {/* BACKGROUND VIDEO FOR TRANSITION */}
      {bgVideoUrl && stage === STAGES.SERVICE_DETAIL && (
        <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden" style={{ transform: 'scale(1.15)' }}>
          <video ref={bgVideoRef} src={bgVideoUrl} muted playsInline className="w-full h-full object-cover" style={{ filter: 'blur(20px)' }} />
          <div className="absolute inset-0 bg-black/70" />
        </div>
      )}

      {/* TRANSITION VIDEO OVERLAY */}
      <AnimatePresence>
        {showTransition && transitionUrl && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
            className="absolute inset-0 z-[20] pointer-events-none">
            <TransitionVideo url={transitionUrl} onEnded={showCard} bgVideoRef={bgVideoRef} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* UI ELEMENTS */}
      <div className="absolute inset-0 z-10 pointer-events-none">

        {/* HEADER */}
        <header className="absolute top-0 left-0 w-full px-6 py-5 md:px-8 md:py-8 flex justify-between items-center z-50 mix-blend-difference">
          {/* Removed brand name "Salon Beauty Art" */}
          <div className="font-monument text-[10px] md:text-xs tracking-[0.2em]"></div>
          <div className="flex items-center gap-3 md:gap-4 pointer-events-auto">
            {/* ABOUT BUTTON - only for mobile, in header */}
            {stage === STAGES.MENU && (
              <button
                onClick={() => setStage(STAGES.ABOUT)}
                className="lg:hidden font-monument text-[9px] tracking-widest text-white/60 hover:text-[#e5d3b3] transition-colors uppercase"
              >
                {t.aboutLabel}
              </button>
            )}
            {/* Language switcher */}
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
            {/* Removed city name "Prague" */}
            <div className="font-montreal text-[10px] md:text-xs uppercase tracking-widest"></div>
          </div>
        </header>

        <AnimatePresence mode="wait">

          {/* INTRO STAGE */}
          {stage === STAGES.INTRO && (
            <motion.div key="intro"
              exit={{ opacity: 0, filter: 'blur(20px)', scale: 1.1 }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              className="absolute inset-0 flex flex-col items-center justify-center px-4"
            >
              <div className="overflow-hidden flex flex-wrap justify-center">
                {''.split('').map((char, i) => ( // Replaced "BEAUTY ART" with a placeholder
                  <motion.span key={i} custom={i} variants={letterVariants} initial="hidden" animate="visible"
                    className="text-[16vw] sm:text-[14vw] md:text-[12vw] font-editorial leading-none tracking-tighter">
                    {char}
                  </motion.span>
                ))}
              </div>
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 1 }}
                className="font-montreal text-[11px] md:text-sm text-white tracking-widest uppercase mt-4 text-center">
                {t.tagline}
              </motion.p>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 2 }}
                className="absolute bottom-8 md:bottom-12 flex flex-col items-center">
                <span className="font-montreal text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-white mb-3 md:mb-4">{t.scrollToEnter}</span>
                <div className="w-[1px] h-10 md:h-12 bg-white/20 overflow-hidden relative">
                  <motion.div animate={{ y: ['-100%', '100%'] }} transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                    className="absolute inset-0 bg-white" />
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* MENU STAGE */}
          {stage === STAGES.MENU && !isTransitioning && !showTransition && (
            <motion.div key="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.8 }}
              className="absolute inset-0 pointer-events-auto"
            >
              {/* Desktop Contacts - Hidden */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 1 }}
                className="absolute bottom-28 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6 pointer-events-auto z-10"
                style={{ display: 'none' }}
              >
              </motion.div>

              {/* Discover Scroll Hint - Bottom Center */}
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 flex-col items-center pointer-events-auto z-10 cursor-pointer" style={{ display: "none" }}
                onClick={() => setStage(STAGES.ABOUT)}
              >
                <span className="font-monument text-[8px] uppercase tracking-[0.3em] text-white mb-2">{t.aboutLabel}</span>
                <div className="w-[1px] h-8 bg-white/20 overflow-hidden relative">
                  <motion.div animate={{ y: ["-100%", "100%"] }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    className="absolute inset-0 bg-[#e5d3b3]" />
                </div>
              </motion.div>

              {/* Mobile + Tablet Layout */}
              <div className="flex lg:hidden flex-col h-full">
                <div className="flex flex-col items-center justify-center flex-1 gap-5 px-8 pt-16 pb-4 overflow-y-auto">
                  {SERVICES.map((srv) => (
                    <MenuButton key={srv.id} service={{ ...srv, title: t.services[srv.id as keyof typeof t.services]?.title || srv.title }}
                      onClick={() => handleServiceClick(srv)} enterLabel={t.enterModule} />
                  ))}
                </div>
                {/* Mobile Contacts Section - Removed */}
                <div className="flex flex-col items-center gap-1 text-center px-6 py-5"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="font-monument text-[8px] tracking-[0.25em] text-[#e5d3b3] uppercase mb-1"></div>
                  </div>
              </div>
              {/* Desktop Layout */}
              <div className="hidden lg:block w-full h-full">
                {[
                  { srv: SERVICES[0], pos: 'absolute top-[15%] left-[8%]' },
                  { srv: SERVICES[1], pos: 'absolute top-[15%] right-[8%]' },
                  { srv: SERVICES[2], pos: 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' },
                  { srv: SERVICES[3], pos: 'absolute bottom-[15%] left-[8%]' },
                  { srv: SERVICES[4], pos: 'absolute bottom-[15%] right-[8%]' },
                  { srv: SERVICES[5], pos: 'absolute bottom-[4%] left-1/2 -translate-x-1/2' },
                ].map(({ srv, pos }) => (
                  <div key={srv.id} className={pos}>
                    <MenuButton service={{ ...srv, title: t.services[srv.id as keyof typeof t.services]?.title || srv.title }}
                      onClick={() => handleServiceClick(srv)} enterLabel={t.enterModule} />
                  </div>
                ))}
              </div>

            </motion.div>
          )}

          {/* ABOUT STAGE */}
          {stage === STAGES.ABOUT && (
            <motion.div key="about"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 60 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="absolute inset-0 pointer-events-auto overflow-y-auto flex flex-col px-6 py-20"
            >
              <button
                onClick={() => setStage(STAGES.MENU)}
                className="fixed top-16 md:top-20 left-4 md:left-8 font-monument text-[10px] md:text-xs tracking-widest hover:text-[#e5d3b3] transition-colors z-50 flex items-center gap-3 group bg-black/60 px-3 py-2 rounded-full backdrop-blur-sm"
              >
                <span className="w-4 h-[1px] bg-white group-hover:bg-[#e5d3b3] transition-colors" />
                {t.back}
              </button>

              <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
                {/* Photo */}
                <motion.div
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1.2, delay: 0.2, ease: 'easeOut' }}
                  className="flex justify-center"
                >
                  {/* Replaced specific image with a generic placeholder */}
                  <img
                    src="/placeholder-image.png" // Use a generic placeholder image
                    alt="Placeholder"
                    className="w-36 md:w-80 object-contain drop-shadow-2xl"
                  />
                </motion.div>

                {/* Text */}
                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1.2, delay: 0.4, ease: 'easeOut' }}
                >
                  <div className="font-monument text-[9px] tracking-[0.3em] text-[#e5d3b3] mb-4 uppercase">{t.aboutLabel}</div>
                  {/* Replaced owner name with generic title */}
                  <h2 className="font-editorial text-4xl md:text-5xl mb-2 leading-tight">{t.ownerName}</h2>
                  {/* Replaced founder info with generic placeholder */}
                  <div className="font-montreal text-xs text-white tracking-widest mb-6">{'Founder · Since 2001 · Salon since 2012'}</div>
                  <div className="border-t border-white/10 pt-6 flex flex-col gap-4">
                    <p className="font-montreal text-sm text-white leading-relaxed">
                      {t.aboutBio}
                    </p>
                    <p className="font-montreal text-sm leading-relaxed" style={{ color: '#e5d3b3' }}>
                      {t.aboutMotto}
                    </p>
                    <div className="font-monument text-[9px] tracking-widest text-white mt-2">
                      {t.aboutServices}
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Contacts Section at Bottom of About Page - Removed */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 1 }}
                className="w-full mt-10 pointer-events-auto"
                style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div className="px-6 md:px-12 py-5 flex flex-col items-center gap-1 text-center">
                  <div className="font-monument text-[9px] tracking-[0.25em] text-[#e5d3b3] uppercase mb-1"></div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* SERVICE DETAIL STAGE */}
          {stage === STAGES.SERVICE_DETAIL && activeService && !isTransitioning && (
            <ServiceDetail key="detail" activeService={activeService} onBack={handleBack} lang={lang} t={t} />
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

