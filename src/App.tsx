import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { STAGES, SERVICES } from './data/services';
import type { Service } from './data/services';
import ThreeScene from './components/ThreeScene';
import ServiceDetail from './components/ServiceDetail';
import MenuButton from './components/MenuButton';

export default function App() {
  const [stage, setStage] = useState(STAGES.INTRO);
  const [activeService, setActiveService] = useState<Service | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [transitionUrl, setTransitionUrl] = useState('');
  const [frozenFrame, setFrozenFrame] = useState<string>('');

  const captureFrame = useCallback((video: HTMLVideoElement) => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 1920;
      canvas.height = video.videoHeight || 1080;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        setFrozenFrame(canvas.toDataURL('image/jpeg', 0.85));
      }
    } catch {}
  }, []);

  const showCard = useCallback((video?: HTMLVideoElement) => {
    if (video) captureFrame(video);
    setShowTransition(false);
    setStage(STAGES.SERVICE_DETAIL);
  }, [captureFrame]);

  const handleServiceClick = (service: Service) => {
    setActiveService(service);
    setTransitionUrl(service.transition);
    setFrozenFrame('');
    setShowTransition(true);
  };

  const handleBack = () => {
    setIsTransitioning(true);
    setFrozenFrame('');
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

  return (
    <div className="w-screen h-screen bg-[#0a0a0a] text-[#f8f5f2] overflow-hidden relative selection:bg-[#e5d3b3] selection:text-black">

      {/* PARTICLES */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <ThreeScene stage={stage} activeService={activeService} isTransitioning={isTransitioning} onServiceClick={handleServiceClick} />
      </div>

      {/* ФОНОВОЕ ВИДЕО МЕНЮ — очень сильно затемнено */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: stage === STAGES.MENU && !showTransition ? 1 : 0 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 z-[1] pointer-events-none"
      >
        <video autoPlay muted loop playsInline className="w-full h-full object-cover object-top">
          <source src="https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-womans-face-with-closed-eyes-and-glitter-39487-large.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/55" />
      </motion.div>

      {/* ВИДЕО-ПЕРЕХОД */}
      <AnimatePresence>
        {showTransition && transitionUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-[20] pointer-events-none"
          >
            <TransitionVideo url={transitionUrl} onEnded={showCard} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* UI */}
      <div className="absolute inset-0 z-10 pointer-events-none">

        <header className="absolute top-0 left-0 w-full px-6 py-5 md:px-8 md:py-8 flex justify-between items-center z-50 mix-blend-difference">
          <div className="font-monument text-[10px] md:text-xs tracking-[0.2em]">Kosmetika Nebeská</div>
          <div className="font-montreal text-[10px] md:text-xs uppercase tracking-widest">Prague</div>
        </header>

        <AnimatePresence mode="wait">

          {stage === STAGES.INTRO && (
            <motion.div
              key="intro"
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
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 2 }}
                className="absolute bottom-8 md:bottom-12 flex flex-col items-center">
                <span className="font-montreal text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-[#a3a3a3] mb-3 md:mb-4">Scroll to enter</span>
                <div className="w-[1px] h-10 md:h-12 bg-white/20 overflow-hidden relative">
                  <motion.div animate={{ y: ['-100%', '100%'] }} transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                    className="absolute inset-0 bg-white" />
                </div>
              </motion.div>
            </motion.div>
          )}

          {stage === STAGES.MENU && !isTransitioning && !showTransition && (
            <motion.div key="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.8 }}
              className="absolute inset-0 pointer-events-auto"
            >
              <div className="flex md:hidden flex-col items-center justify-center h-full gap-6 px-4">
                {SERVICES.map((srv) => (
                  <MenuButton key={srv.id} service={srv} onClick={() => handleServiceClick(srv)} />
                ))}
              </div>
              <div className="hidden md:block w-full h-full">
                <div className="absolute top-[18%] left-[8%]">
                  <MenuButton service={SERVICES[0]} onClick={() => handleServiceClick(SERVICES[0])} />
                </div>
                <div className="absolute top-[18%] right-[8%]">
                  <MenuButton service={SERVICES[1]} onClick={() => handleServiceClick(SERVICES[1])} />
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <MenuButton service={SERVICES[2]} onClick={() => handleServiceClick(SERVICES[2])} />
                </div>
                <div className="absolute bottom-[18%] left-[8%]">
                  <MenuButton service={SERVICES[3]} onClick={() => handleServiceClick(SERVICES[3])} />
                </div>
                <div className="absolute bottom-[18%] right-[8%]">
                  <MenuButton service={SERVICES[4]} onClick={() => handleServiceClick(SERVICES[4])} />
                </div>
              </div>
            </motion.div>
          )}

          {stage === STAGES.SERVICE_DETAIL && activeService && !isTransitioning && (
            <ServiceDetail
              key="detail"
              activeService={activeService}
              onBack={handleBack}
              frozenFrame={frozenFrame}
            />
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

function TransitionVideo({ url, onEnded }: { url: string; onEnded: (v: HTMLVideoElement) => void }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    video.play().catch(() => onEnded(video));
  }, [onEnded]);

  return (
    <video
      ref={ref}
      src={url}
      muted
      playsInline
      onEnded={(e) => onEnded(e.currentTarget)}
      className="w-full h-full object-cover"
    />
  );
}
