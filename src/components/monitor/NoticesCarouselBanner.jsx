import React, { useState, useEffect, useRef } from 'react';
import { TempleFrame } from '../common/GreekTempleComponents';

const DEFAULT_FALLBACK_NOTICES = [
  {
    id: 'n1',
    badge: 'CÓDIGO DE HONOR - ZEUS GYM',
    title: 'DESCARGA TUS BARRAS Y ACOMODA EL EQUIPO',
    desc: 'Si tuviste la fuerza para levantarlo, ten la disciplina de guardarlo. Regresa mancuernas y discos a su lugar.',
    icon: 'fa-dumbbell'
  },
  {
    id: 'n2',
    badge: 'CÓDIGO OLÍMPICO • HIGIENE DEL SANTUARIO',
    title: 'USO OBLIGATORIO DE TOALLA PERSONAL',
    desc: 'Por higiene y respeto a tus compañeros de entrenamiento, es obligatorio portar toalla para limpiar bancos y máquinas al terminar.',
    icon: 'fa-spray-can-sparkles'
  },
  {
    id: 'n3',
    badge: 'SEGURIDAD DEL OLIMPO • PREVENCIÓN',
    title: 'CALZADO Y VESTIMENTA DEPORTIVA ADECUADA',
    desc: 'Por tu seguridad en sala de pesas, está estrictamente prohibido entrenar descalzo, en sandalias o con calzado no deportivo.',
    icon: 'fa-shoe-prints'
  },
  {
    id: 'n4',
    badge: 'HORARIOS DEL SANTUARIO • TEMPLO DE ZEUS',
    title: 'HORARIOS DE ENTRENAMIENTO OFICIALES',
    desc: 'Lunes a Viernes: 6:00 AM – 10:00 PM | Sábados: 7:00 AM – 2:00 PM. ¡Honor, fuerza y disciplina en el Templo de Zeus!',
    icon: 'fa-clock'
  }
];

export default function NoticesCarouselBanner({
  notices,
  duration = 6000,
  autoPlay = true
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progressKey, setProgressKey] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const boxRef = useRef(null);

  let parsedNotices = notices;
  if (typeof parsedNotices === 'string') {
    try {
      parsedNotices = JSON.parse(parsedNotices);
    } catch {
      parsedNotices = null;
    }
  }

  const safeNotices = Array.isArray(parsedNotices) && parsedNotices.length > 0
    ? parsedNotices
    : DEFAULT_FALLBACK_NOTICES;

  useEffect(() => {
    if (currentIndex >= safeNotices.length) {
      setCurrentIndex(0);
    }
  }, [safeNotices.length, currentIndex]);

  useEffect(() => {
    if (!autoPlay || safeNotices.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % safeNotices.length);
      setProgressKey((prev) => prev + 1);
    }, duration);

    return () => clearInterval(timer);
  }, [autoPlay, duration, safeNotices.length, isPaused]);

  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.classList.remove('pulse-flash');
      void boxRef.current.offsetWidth;
      boxRef.current.classList.add('pulse-flash');
    }
  }, [currentIndex]);

  const currentNotice = safeNotices[currentIndex] || safeNotices[0] || DEFAULT_FALLBACK_NOTICES[0];

  const handleNext = (e) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % safeNotices.length);
    setProgressKey((prev) => prev + 1);
  };

  const handlePrev = (e) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + safeNotices.length) % safeNotices.length);
    setProgressKey((prev) => prev + 1);
  };

  const handleSelectDot = (idx, e) => {
    if (e) e.stopPropagation();
    setCurrentIndex(idx);
    setProgressKey((prev) => prev + 1);
  };

  return (
    <div
      ref={boxRef}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="flex-1 min-h-0 flex flex-col transition-all duration-300"
    >
      <TempleFrame
        className="h-full shadow-xl"
        innerClassName="bg-olympus-storm text-white flex flex-col justify-between p-3.5 sm:p-4 relative overflow-hidden"
        size="md"
        columnWidth="w-4 sm:w-6 md:w-7"
        topLintel={
          <div className="w-full flex items-center justify-between gap-2 px-1">
            <span className="font-cinzel text-[10px] sm:text-xs font-black text-[#0F1E36] tracking-wider uppercase">
              REGLAMENTO & DISCIPLINA DEL TEMPLO
            </span>
            <span className="text-[10px] text-[#997A2C] font-bold">
              CONVIVENCIA DE ATLETAS
            </span>
          </div>
        }
        bottomLintel={false}
      >
        <div className="relative z-10 flex items-center gap-3 sm:gap-4 h-full">
          {/* Caja con Icono en Relieve Clásico */}
          <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl bg-gradient-to-br from-[#162A4A] to-[#0F1E36] border-2 border-[#C5A059] flex items-center justify-center shrink-0 shadow-lg text-[#F3E5AB]">
            <i className={`fa-solid ${currentNotice.icon || 'fa-dumbbell'} text-xl sm:text-2xl md:text-3xl`}></i>
          </div>

          {/* Textos del Aviso */}
          <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
            <div className="flex items-center justify-between gap-2">
              <span className="bg-[#D4AF37]/20 border border-[#C5A059] text-[#F3E5AB] font-cinzel text-[9px] sm:text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full truncate">
                <i className="fa-solid fa-scroll text-[9px] mr-1 text-[#D4AF37]"></i>
                {currentNotice.badge || 'CÓDIGO DE HONOR - ZEUS GYM'}
              </span>

              {/* Controles de Carrusel (Dots y flechas) */}
              <div className="flex items-center gap-1.5 bg-[#0F1E36]/80 border border-[#C5A059]/60 px-2 py-0.5 rounded-full shrink-0">
                {safeNotices.length > 1 && (
                  <div className="flex items-center gap-1">
                    {safeNotices.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={(e) => handleSelectDot(idx, e)}
                        className={`h-1.5 rounded-full transition-all cursor-pointer ${
                          idx === currentIndex ? 'w-3.5 bg-[#D4AF37]' : 'w-1.5 bg-[#C5A059]/40'
                        }`}
                        title={`Aviso ${idx + 1}`}
                      />
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-0.5 ml-1">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="w-4 h-4 rounded-full text-[#F3E5AB] hover:text-white flex items-center justify-center text-[8px] cursor-pointer"
                    title="Anterior"
                  >
                    <i className="fa-solid fa-chevron-left"></i>
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="w-4 h-4 rounded-full text-[#F3E5AB] hover:text-white flex items-center justify-center text-[8px] cursor-pointer"
                    title="Siguiente"
                  >
                    <i className="fa-solid fa-chevron-right"></i>
                  </button>
                </div>
              </div>
            </div>

            <h3 className="font-cinzel text-base sm:text-lg md:text-xl font-black text-white leading-tight uppercase line-clamp-1 drop-shadow">
              {currentNotice.title}
            </h3>

            <p className="text-xs sm:text-sm text-[#F4F3EF]/90 font-medium leading-snug line-clamp-2 drop-shadow-sm">
              {currentNotice.desc}
            </p>
          </div>
        </div>

        {/* Barra de progreso */}
        {autoPlay && safeNotices.length > 1 && !isPaused && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#0F1E36]/70 overflow-hidden">
            <div
              key={progressKey}
              className="h-full bg-gradient-to-r from-[#C5A059] via-[#F3E5AB] to-[#D4AF37]"
              style={{
                animation: `slideProgress ${duration}ms linear infinite`
              }}
            ></div>
          </div>
        )}
      </TempleFrame>
    </div>
  );
}
