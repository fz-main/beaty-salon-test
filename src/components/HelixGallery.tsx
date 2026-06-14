import { useState } from 'react';

const galleryItems = [
  { id: 1, src: 'https://static.wixstatic.com/media/6e5a68_58ff6be540194d249d9df44ad99c2e83~mv2.jpg/v1/fill/w_858,h_566,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/DSC01966_JPG.jpg', alt: 'Interior 1' },
  { id: 2, src: 'https://res.cloudinary.com/dfh97tdty/image/upload/v1781347513/%D0%A1%D0%BD%D0%B8%D0%BC%D0%BE%D0%BA_%D1%8D%D0%BA%D1%80%D0%B0%D0%BD%D0%B0_2026-06-13_134240_irljmw.png', alt: 'Work 1' },
  { id: 3, src: 'https://res.cloudinary.com/dfh97tdty/image/upload/v1781347513/%D0%A1%D0%BD%D0%B8%D0%BC%D0%BE%D0%BA_%D1%8D%D0%BA%D1%80%D0%B0%D0%BD%D0%B0_2026-06-13_133957_fz8rga.png', alt: 'Work 2' },
  { id: 4, src: 'https://res.cloudinary.com/dfh97tdty/image/upload/v1781347513/%D0%A1%D0%BD%D0%B8%D0%BC%D0%BE%D0%BA_%D1%8D%D0%BA%D1%80%D0%B0%D0%BD%D0%B0_2026-06-13_134309_mm1ct8.png', alt: 'Work 3' },
  { id: 5, src: 'https://res.cloudinary.com/dfh97tdty/image/upload/v1781347513/%D0%A1%D0%BD%D0%B8%D0%BC%D0%BE%D0%BA_%D1%8D%D0%BA%D1%80%D0%B0%D0%BD%D0%B0_2026-06-13_134328_mndg3p.png', alt: 'Work 4' },
  { id: 6, src: 'https://res.cloudinary.com/dfh97tdty/image/upload/v1781347513/%D0%A1%D0%BD%D0%B8%D0%BC%D0%BE%D0%BA_%D1%8D%D0%BA%D1%80%D0%B0%D0%BD%D0%B0_2026-06-13_134224_efesrr.png', alt: 'Work 5' },
  { id: 7, src: 'https://res.cloudinary.com/dfh97tdty/image/upload/v1781347513/%D0%A1%D0%BD%D0%B8%D0%BC%D0%BE%D0%BA_%D1%8D%D0%BA%D1%80%D0%B0%D0%BD%D0%B0_2026-06-13_134202_lbbgme.png', alt: 'Work 6' },
];

export default function HelixGallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const total = galleryItems.length;

  const goToNext = () => { if (activeIndex < total - 1) setActiveIndex(activeIndex + 1); };
  const goToPrev = () => { if (activeIndex > 0) setActiveIndex(activeIndex - 1); };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY > 0) goToNext();
    else if (e.deltaY < 0) goToPrev();
  };

  const getCardStyle = (index: number) => {
    let diff = index - activeIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    if (diff === 0) return { transform: 'translateX(0) translateZ(200px) rotateY(0deg)', opacity: 1, filter: 'blur(0px)', zIndex: 5 };
    if (diff === 1 || diff === -total + 1) return { transform: 'translateX(140px) translateZ(50px) rotateY(-30deg)', opacity: 0.6, filter: 'blur(3px)', zIndex: 4 };
    if (diff === -1 || diff === total - 1) return { transform: 'translateX(-140px) translateZ(50px) rotateY(30deg)', opacity: 0.6, filter: 'blur(3px)', zIndex: 4 };
    return { transform: 'translateX(0) translateZ(-200px) rotateY(180deg)', opacity: 0, filter: 'blur(10px)', zIndex: 1 };
  };

  return (
    <div style={{ width: '100%', minHeight: '500px', padding: '40px 0', marginBottom: '20px' }}>
      <div style={{ position: 'relative', width: '100%', height: '400px', perspective: '1000px' }} onWheel={handleWheel}>
        {galleryItems.map((item, idx) => (
          <div key={item.id} style={{ position: 'absolute', width: '240px', height: '340px', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', transition: 'transform 0.6s, filter 0.6s, opacity 0.6s', left: 'calc(50% - 120px)', top: 'calc(50% - 170px)', ...getCardStyle(idx) }}>
            <img src={item.src} alt={item.alt} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}
