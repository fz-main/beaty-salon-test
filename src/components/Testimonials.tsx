import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const testimonials = [
  { id: 1, name: 'Elena Novakova', role: 'Kadeřnictví', text: 'Nejlepší střih, jaký jsem kdy měla! Profesionální přístup a skvělá atmosféra.', photo: 'https://randomuser.me/api/portraits/women/68.jpg' },
  { id: 2, name: 'Martin Dvorak', role: 'Laserová epilace', text: 'Bezbolestné a rychlé. Po pár sezeních jsem úplně bez chloupků. Doporučuji!', photo: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { id: 3, name: 'Lucie Kralova', role: 'Endosféra', text: 'Výsledky viditelné hned po první proceduře. Moje postava se zlepšila, cítím se skvěle.', photo: 'https://randomuser.me/api/portraits/women/45.jpg' },
  { id: 4, name: 'Petr Svoboda', role: 'Masáž', text: 'Dokonalá relaxace. Uvolnění celého těla, moc děkuji. Určitě se vrátím.', photo: 'https://randomuser.me/api/portraits/men/22.jpg' },
  { id: 5, name: 'Jana Horvathova', role: 'Manikúra', text: 'Nádherný design a precizní práce. Moje nehty vypadají jako z časopisu!', photo: 'https://randomuser.me/api/portraits/women/89.jpg' }
];

const positions = [
  { top: '12%', left: '8%' },
  { top: '18%', left: '85%' },
  { top: '45%', left: '3%' },
  { top: '55%', left: '90%' },
  { top: '78%', left: '15%' },
];

export default function Testimonials() {
  const [activeId, setActiveId] = useState(1);
  const [direction, setDirection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeTestimonial = testimonials.find(t => t.id === activeId)!;

  const handleAvatarClick = (id: number) => {
    if (id === activeId) return;
    setDirection(id > activeId ? 1 : -1);
    setActiveId(id);
  };

  const next = () => {
    const nextId = activeId === 5 ? 1 : activeId + 1;
    setDirection(1);
    setActiveId(nextId);
  };

  const prev = () => {
    const prevId = activeId === 1 ? 5 : activeId - 1;
    setDirection(-1);
    setActiveId(prevId);
  };

  // Анимация парения для аватаров
  const floatingAnimation = (index: number) => ({
    y: [0, -10, 0, 10, 0],
    x: [0, 8, 0, -8, 0],
    transition: {
      duration: 8 + (index % 3),
      repeat: Infinity,
      repeatType: 'mirror' as const,
      ease: 'easeInOut',
      delay: index * 0.8,
    },
  });

  return (
    <div ref={containerRef} className="relative w-full min-h-[600px] flex flex-col items-center justify-center py-16">
      {/* Центральная карточка отзыва */}
      <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeId}
            initial={{ opacity: 0, y: direction * 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: direction * -20 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <p className="font-montreal text-white/80 text-base leading-relaxed mb-6">
              {activeTestimonial.text}
            </p>
            <div className="font-editorial text-xl text-white">{activeTestimonial.name}</div>
            <div className="font-monument text-[10px] text-[#e5d3b3] tracking-wider mt-1">
              {activeTestimonial.role}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Стрелки и индикаторы (центрированы) */}
      <div className="flex flex-col items-center mt-8 z-10">
        <div className="flex gap-6">
          <button
            onClick={prev}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition flex items-center justify-center text-white text-xl"
          >
            ←
          </button>
          <button
            onClick={next}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition flex items-center justify-center text-white text-xl"
          >
            →
          </button>
        </div>
        <div className="flex gap-3 mt-4">
          {testimonials.map((t) => (
            <button
              key={t.id}
              onClick={() => handleAvatarClick(t.id)}
              className={`transition-all duration-300 rounded-full ${
                t.id === activeId ? 'w-6 h-2 bg-[#e5d3b3]' : 'w-2 h-2 bg-white/40 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Плавающие аватары (абсолютное позиционирование, z-index выше) */}
      <div className="hidden md:block absolute inset-0 pointer-events-none z-20">
        {testimonials.map((t, idx) => {
          const isActive = t.id === activeId;
          const size = isActive ? 'w-[90px] h-[90px]' : 'w-[60px] h-[60px]';
          const pos = positions[idx] || { top: '50%', left: '50%' };
          return (
            <motion.div
              key={t.id}
              className="absolute cursor-pointer pointer-events-auto"
              style={{ top: pos.top, left: pos.left, transform: 'translate(-50%, -50%)' }}
              animate={floatingAnimation(idx)}
              whileHover={{ scale: 1.1 }}
              onClick={() => handleAvatarClick(t.id)}
            >
              <div
                className={`${size} rounded-full overflow-hidden border-2 transition-all duration-300 ${
                  isActive
                    ? 'border-[#e5d3b3] shadow-[0_0_20px_rgba(229,211,179,0.8)]'
                    : 'border-white/30 hover:border-white/60 hover:shadow-[0_0_10px_rgba(229,211,179,0.4)]'
                }`}
              >
                <img src={t.photo} alt={t.name} className="w-full h-full object-cover" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Мобильная адаптация: сетка под карточкой */}
      <div className="md:hidden w-full mt-10 z-10">
        <div className="flex flex-wrap justify-center gap-4">
          {testimonials.map((t) => (
            <button
              key={t.id}
              onClick={() => handleAvatarClick(t.id)}
              className={`flex flex-col items-center gap-1 transition-all duration-300 ${
                t.id === activeId ? 'scale-110' : 'opacity-70 hover:opacity-100'
              }`}
            >
              <div
                className={`w-14 h-14 rounded-full overflow-hidden border-2 ${
                  t.id === activeId ? 'border-[#e5d3b3] shadow-[0_0_10px_rgba(229,211,179,0.5)]' : 'border-white/30'
                }`}
              >
                <img src={t.photo} alt={t.name} className="w-full h-full object-cover" />
              </div>
              <span className="text-[10px] text-white/80 font-montreal">{t.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
