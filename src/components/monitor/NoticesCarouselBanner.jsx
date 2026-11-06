import React, { useState, useEffect, useRef } from 'react';
import { TempleFrame } from '../common/GreekTempleComponents';

const DEFAULT_FALLBACK_NOTICES = [
  {
    id: 'n1',
    badge: 'CÓDIGO DE HONOR - REGLAS',
    title: 'DESCARGA TUS BARRAS Y ACOMODA EL EQUIPO',
    desc: 'Si tuviste la fuerza para levantarlo, ten la disciplina de guardarlo. Regresa mancuernas y discos a sus racks.',
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

  const safeNotices =
    Array.isArray(parsedNotices) && parsedNotices.length > 0
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

  const currentNotice =
    safeNotices[currentIndex] || safeNotices[0] || DEFAULT_FALLBACK_NOTICES[0];

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
        className="h-full"
        innerClassName="bg-olympus-storm text-white flex flex-col justify-center px-4 sm:px-6 py-3 relative overflow-hidden"
        size="md"
        columnWidth="w-4 sm:w-6 md:w-7"
        topLintel={null}
        bottomLintel={null}
        showClouds={true}
      >
        {/* Rayos volumétricos en primer plano derecho */}
        <div className="absolute right-6 top-1 select-none pointer-events-none z-[2] opacity-85">
          <svg className="w-20 h-20 sm:w-28 sm:h-28 lightning-volumetric" viewBox="0 0 100 100" fill="none">
            <path
              d="M62 6 L34 46 L54 46 L42 88 L78 40 L57 40 Z"
              fill="url(#notice-bolt-grad)"
              stroke="#FFF"
              strokeWidth="1.2"
            />
            <defs>
              <linearGradient id="notice-bolt-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="40%" stopColor="#FFF275" />
                <stop offset="100%" stopColor="#D4AF37" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="relative z-10 flex items-center gap-3.5 sm:gap-5 h-full">
          {/* Medallón Cuadrado con Relieve 3D para Ícono */}
          <div
            className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#1B3156] via-[#11203A] to-[#0A1324] border-2 border-[#C5A059] flex items-center justify-center shrink-0 text-[#F3E5AB]"
            style={{
              boxShadow:
                '0 8px 20px rgba(0, 0, 0, 0.45), inset 0 1.5px 1px rgba(255, 255, 255, 0.25), inset 0 -2px 4px rgba(0, 0, 0, 0.5)'
            }}
          >
            <i className={`fa-solid ${currentNotice.icon || 'fa-dumbbell'} text-xl sm:text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]`}></i>
          </div>

          {/* Textos del Decreto */}
          <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
            <div className="flex items-center justify-between gap-2">
              <span className="pill-gold-3d font-cinzel text-[9px] sm:text-[10.5px] font-black uppercase px-2.5 py-0.5 rounded-full truncate tracking-wider inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0B1528]"></span>
                <span>{currentNotice.badge || 'CÓDIGO DE HONOR - REGLAS'}</span>
              </span>

              {/* Controles de Carrusel Glassmorphism */}
              <div className="olympus-card--glass flex items-center gap-1.5 px-2.5 py-0.5 rounded-full shrink-0">
                {safeNotices.length > 1 && (
                  <div className="flex items-center gap-1">
                    {safeNotices.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={(e) => handleSelectDot(idx, e)}
                        className={`h-1.5 rounded-full transition-all cursor-pointer ${
                          idx === currentIndex
                            ? 'w-3.5 bg-[#D4AF37] shadow-[0_0_6px_#FFD700]'
                            : 'w-1.5 bg-white/35 hover:bg-white/60'
                        }`}
                        title={`Aviso ${idx + 1}`}
                      />
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-1 ml-1">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="w-4 h-4 rounded-full bg-white/10 hover:bg-white/25 text-[#F3E5AB] hover:text-white flex items-center justify-center text-[8px] cursor-pointer transition-colors"
                    title="Anterior"
                  >
                    <i className="fa-solid fa-chevron-left"></i>
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="w-4 h-4 rounded-full bg-white/10 hover:bg-white/25 text-[#F3E5AB] hover:text-white flex items-center justify-center text-[8px] cursor-pointer transition-colors"
                    title="Siguiente"
                  >
                    <i className="fa-solid fa-chevron-right"></i>
                  </button>
                </div>
              </div>
            </div>

            <h3 className="font-cinzel text-base sm:text-lg md:text-xl font-black text-white leading-tight uppercase line-clamp-1 drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)]">
              {currentNotice.title}
            </h3>

            <p className="text-xs sm:text-sm text-[#F4F2EB]/95 font-medium leading-snug line-clamp-2 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              {currentNotice.desc}
            </p>
          </div>
        </div>

        {/* Barra de progreso */}
        {autoPlay && safeNotices.length > 1 && !isPaused && (
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#0B1528]/70 overflow-hidden z-20">
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
