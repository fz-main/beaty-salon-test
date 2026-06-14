import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const testimonialsData = [
  { id: 1, name: 'Elena Novakova', role: 'Kadeřnictví', text: 'Nejlepší střih, jaký jsem kdy měla! Profesionální přístup a skvělá atmosféra.', avatar: 'https://randomuser.me/api/portraits/women/68.jpg' },
  { id: 2, name: 'Martin Dvorak', role: 'Laserová epilace', text: 'Bezbolestné a rychlé. Po pár sezeních jsem úplně bez chloupků. Doporučuji!', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { id: 3, name: 'Lucie Kralova', role: 'Endosféra', text: 'Výsledky viditelné hned po první proceduře. Moje postava se zlepšila, cítím se skvěle.', avatar: 'https://randomuser.me/api/portraits/women/45.jpg' },
  { id: 4, name: 'Petr Svoboda', role: 'Masáž', text: 'Dokonalá relaxace. Uvolnění celého těla, moc děkuji. Určitě se vrátím.', avatar: 'https://randomuser.me/api/portraits/men/22.jpg' },
  { id: 5, name: 'Jana Horvathova', role: 'Manikúra', text: 'Nádherný design a precizní práce. Moje nehty vypadají jako z časopisu!', avatar: 'https://randomuser.me/api/portraits/women/89.jpg' },
];

const desktopPositions = [
  { top: '12%', left: '8%' }, { top: '18%', left: '85%' }, { top: '45%', left: '5%' }, { top: '52%', left: '90%' }, { top: '78%', left: '15%' },
];

const mobilePositions = [
  { margin: '0 15px 20px 0' }, { margin: '10px 5px 15px 25px' }, { margin: '5px 20px 10px 5px' }, { margin: '15px 5px 25px 10px' }, { margin: '0 10px 5px 20px' },
];

export default function Testimonials() {
  const [activeId, setActiveId] = useState(1);
  const [direction, setDirection] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const activeItem = testimonialsData.find(t => t.id === activeId)!;
  const total = testimonialsData.length;

  const handleAvatarClick = (id: number) => {
    if (id === activeId) return;
    setDirection(id > activeId ? 1 : -1);
    setActiveId(id);
  };

  const next = () => {
    const newId = activeId === total ? 1 : activeId + 1;
    setDirection(1);
    setActiveId(newId);
  };

  const prev = () => {
    const newId = activeId === 1 ? total : activeId - 1;
    setDirection(-1);
    setActiveId(newId);
  };

  // Простая анимация парения с использованием motion-свойств
  const floatingVariants = (index: number) => ({
    initial: { scale: 0, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.4, delay: index * 0.1 },
    },
    hover: { scale: 1.05 },
  });

  return (
    <div className="relative w-full mt-20 mb-16" style={{ minHeight: '550px' }}>
      <div className="text-center mb-8">
        <div className="font-monument text-[9px] tracking-[0.3em] text-[#e5d3b3] uppercase">Co říkají naši klienti</div>
        <div className="font-editorial text-2xl md:text-3xl text-white mt-1">Real stories, real results</div>
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto bg-white/5 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeId}
            initial={{ opacity: 0, y: direction * 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: direction * -20 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <p className="font-montreal text-white/80 text-base leading-relaxed mb-6">{activeItem.text}</p>
            <div className="font-editorial text-xl text-white">{activeItem.name}</div>
            <div className="font-monument text-[10px] text-[#e5d3b3] tracking-wider mt-1">{activeItem.role}</div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex flex-col items-center mt-8 z-10 relative">
        <div className="flex gap-6">
          <button onClick={prev} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition flex items-center justify-center text-white text-xl backdrop-blur-sm">←</button>
          <button onClick={next} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition flex items-center justify-center text-white text-xl backdrop-blur-sm">→</button>
        </div>
        <div className="flex gap-2 mt-4">
          {testimonialsData.map((t) => (
            <button key={t.id} onClick={() => handleAvatarClick(t.id)} className={`w-2 h-2 rounded-full transition-all duration-300 ${t.id === activeId ? 'w-5 bg-[#e5d3b3]' : 'bg-white/40 hover:bg-white/80'}`} />
          ))}
        </div>
      </div>

      {!isMobile ? (
        <div className="absolute inset-0 pointer-events-none z-20">
          {testimonialsData.map((t, idx) => {
            const isActive = t.id === activeId;
            const pos = desktopPositions[idx];
            const size = isActive ? 'w-[90px] h-[90px]' : 'w-[60px] h-[60px]';
            return (
              <motion.div
                key={t.id}
                className="absolute cursor-pointer pointer-events-auto"
                style={{ top: pos.top, left: pos.left, transform: 'translate(-50%, -50%)' }}
                variants={floatingVariants(idx)}
                initial="initial"
                animate="animate"
                whileHover="hover"
                onClick={() => handleAvatarClick(t.id)}
              >
                <div className={`${size} rounded-full overflow-hidden border-2 transition-all duration-300 ${isActive ? 'border-[#e5d3b3] shadow-[0_0_20px_rgba(229,211,179,0.8)]' : 'border-white/30 hover:border-white/60'}`}>
                  <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="relative z-20 mt-10 flex flex-wrap justify-center items-start">
          {testimonialsData.map((t, idx) => {
            const isActive = t.id === activeId;
            const size = isActive ? 'w-[70px] h-[70px]' : 'w-[55px] h-[55px]';
            return (
              <motion.div
                key={t.id}
                className="cursor-pointer"
                style={mobilePositions[idx]}
                variants={floatingVariants(idx)}
                initial="initial"
                animate="animate"
                whileHover="hover"
                onClick={() => handleAvatarClick(t.id)}
              >
                <div className={`${size} rounded-full overflow-hidden border-2 transition-all duration-300 ${isActive ? 'border-[#e5d3b3] shadow-[0_0_15px_rgba(229,211,179,0.6)]' : 'border-white/30'}`}>
                  <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                </div>
                <div className="text-center text-[10px] text-white/60 mt-1">{t.name.split(' ')[0]}</div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
