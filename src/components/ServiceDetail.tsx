import { motion } from 'framer-motion';
import type { Service } from '../data/services';

interface ServiceDetailProps {
  activeService: Service;
  onBack: () => void;
  transitionUrl?: string;
}

export default function ServiceDetail({ activeService, onBack, transitionUrl }: ServiceDetailProps) {
  return (
    <motion.div
      key="detail"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="absolute inset-0 pointer-events-auto flex items-center justify-center p-6 md:p-24"
    >
      {/* Фон — последний кадр перехода размытый */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {transitionUrl ? (
          <video
            src={transitionUrl}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover scale-110"
            style={{ filter: 'blur(18px)', transform: 'scale(1.15)' }}
          />
        ) : (
          <video
            src="/beaty-salon-test/videos/service-bg.mp4.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover scale-110"
            style={{ filter: 'blur(18px)', transform: 'scale(1.15)' }}
          />
        )}
        <div className="absolute inset-0 bg-black/65" />
      </div>

      <button
        onClick={onBack}
        className="absolute top-20 md:top-24 left-4 md:left-8 font-monument text-[10px] md:text-xs tracking-widest hover:text-[#e5d3b3] transition-colors z-50 flex items-center gap-3 md:gap-4 group bg-black/50 md:bg-transparent px-3 py-2 md:p-0 rounded-full md:rounded-none backdrop-blur-sm md:backdrop-blur-none"
      >
        <span className="w-4 md:w-8 h-[1px] bg-white group-hover:bg-[#e5d3b3] transition-colors" />
        Back
      </button>

      <div
        className="w-full h-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center mt-16 md:mt-0 overflow-y-auto md:overflow-visible pb-8 md:pb-0 pointer-events-auto relative z-10"
        style={{ touchAction: 'pan-y' }}
      >
        {/* Text Content */}
        <div className="glass-panel p-6 md:p-12 rounded-3xl order-2 md:order-1">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h4 className="font-monument text-[10px] md:text-xs tracking-[0.25em] text-[#e5d3b3] mb-3 md:mb-5">
              {activeService.subtitle}
            </h4>
            <h2 className="text-4xl md:text-8xl font-editorial mb-4 md:mb-8 leading-[0.9]">
              {activeService.title}
            </h2>
            <p className="font-montreal text-sm md:text-base text-[#a3a3a3] leading-relaxed mb-8 md:mb-12">
              {activeService.desc}
            </p>
            <div className="flex flex-wrap items-center gap-6 md:gap-8 border-t border-white/10 pt-6 md:pt-8">
              <div>
                <div className="font-monument text-[8px] md:text-[10px] text-[#a3a3a3] mb-1 tracking-widest">Duration</div>
                <div className="font-editorial text-xl md:text-2xl">{activeService.time}</div>
              </div>
              <div>
                <div className="font-monument text-[8px] md:text-[10px] text-[#a3a3a3] mb-1 tracking-widest">Investment</div>
                <div className="font-editorial text-xl md:text-2xl text-[#e5d3b3]">{activeService.price}</div>
              </div>
              <button className="w-full md:w-auto mt-2 md:mt-0 md:ml-auto px-8 py-4 bg-white text-black font-monument text-[10px] tracking-widest rounded-full hover:bg-[#e5d3b3] transition-colors">
                Reserve
              </button>
            </div>
          </motion.div>
        </div>

        {/* Video Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, filter: 'blur(20px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1, delay: 0.4 }}
          className="w-full aspect-square md:aspect-[3/4] rounded-3xl overflow-hidden relative shadow-2xl order-1 md:order-2"
        >
          <video
            autoPlay muted loop playsInline
            className="absolute inset-0 w-full h-full object-cover scale-105"
          >
            <source src={activeService.video} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </motion.div>
      </div>
    </motion.div>
  );
}
