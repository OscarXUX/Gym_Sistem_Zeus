import React, { useState, useEffect, useRef } from 'react';

const THEME_STYLES = {
  amber: {
    border: 'border-amber-500/60 border-l-4 border-l-amber-400 shadow-[0_10px_30px_rgba(0,0,0,0.65)]',
    bg: 'bg-gradient-to-r from-amber-950/85 via-slate-950/95 to-[#070b14]/95',
    badge: 'bg-amber-950/90 text-amber-300 border border-amber-500/50 shadow-sm',
    iconBox: 'bg-gradient-to-br from-amber-900/50 to-amber-950/90 border-2 border-amber-500/60 text-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.3)]',
    progress: 'from-amber-600 to-yellow-400',
    dotActive: 'bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.8)] w-6',
    dotInactive: 'bg-slate-700/80 hover:bg-slate-500 w-2',
    accentText: 'text-amber-400',
    glow: 'bg-amber-500/10'
  },
  red: {
    border: 'border-rose-500/60 border-l-4 border-l-rose-400 shadow-[0_10px_30px_rgba(0,0,0,0.65)]',
    bg: 'bg-gradient-to-r from-rose-950/85 via-slate-950/95 to-[#070b14]/95',
    badge: 'bg-rose-950/90 text-rose-300 border border-rose-500/50 shadow-sm',
    iconBox: 'bg-gradient-to-br from-rose-900/50 to-rose-950/90 border-2 border-rose-500/60 text-rose-400 shadow-[0_0_25px_rgba(244,63,94,0.3)]',
    progress: 'from-rose-600 to-pink-400',
    dotActive: 'bg-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.8)] w-6',
    dotInactive: 'bg-slate-700/80 hover:bg-slate-500 w-2',
    accentText: 'text-rose-400',
    glow: 'bg-rose-500/10'
  },
  blue: {
    border: 'border-sky-500/60 border-l-4 border-l-sky-400 shadow-[0_10px_30px_rgba(0,0,0,0.65)]',
    bg: 'bg-gradient-to-r from-sky-950/85 via-slate-950/95 to-[#070b14]/95',
    badge: 'bg-sky-950/90 text-sky-300 border border-sky-500/50 shadow-sm',
    iconBox: 'bg-gradient-to-br from-sky-900/50 to-sky-950/90 border-2 border-sky-500/60 text-sky-400 shadow-[0_0_25px_rgba(14,165,233,0.3)]',
    progress: 'from-sky-600 to-cyan-400',
    dotActive: 'bg-sky-400 shadow-[0_0_10px_rgba(14,165,233,0.8)] w-6',
    dotInactive: 'bg-slate-700/80 hover:bg-slate-500 w-2',
    accentText: 'text-sky-400',
    glow: 'bg-sky-500/10'
  },
  emerald: {
    border: 'border-emerald-500/60 border-l-4 border-l-emerald-400 shadow-[0_10px_30px_rgba(0,0,0,0.65)]',
    bg: 'bg-gradient-to-r from-emerald-950/85 via-slate-950/95 to-[#070b14]/95',
    badge: 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 shadow-sm',
    iconBox: 'bg-gradient-to-br from-emerald-900/50 to-emerald-950/90 border-2 border-emerald-500/60 text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.3)]',
    progress: 'from-emerald-600 to-teal-400',
    dotActive: 'bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.8)] w-6',
    dotInactive: 'bg-slate-700/80 hover:bg-slate-500 w-2',
    accentText: 'text-emerald-400',
    glow: 'bg-emerald-500/10'
  }
};

const DEFAULT_FALLBACK_NOTICES = [
  {
    id: 'n1',
    badge: 'CÓDIGO OLÍMPICO • HIGIENE DEL SANTUARIO',
    title: 'USO OBLIGATORIO DE TOALLA',
    desc: 'Por higiene y respeto a tus compañeros de entrenamiento, es obligatorio portar toalla personal para limpiar bancos y máquinas al terminar.',
    icon: 'fa-spray-can-sparkles',
    theme: 'amber'
  },
  {
    id: 'n2',
    badge: 'DECRETO SAGRADO • DISCIPLINA OLÍMPICA',
    title: 'DESCARGA TUS BARRAS Y ACOMODA EL EQUIPO',
    desc: 'Si tuviste la fuerza para levantarlo, ten la disciplina de guardarlo. Regresa mancuernas y discos a sus racks en el Templo.',
    icon: 'fa-dumbbell',
    theme: 'blue'
  },
  {
    id: 'n3',
    badge: 'SEGURIDAD DEL OLIMPO • PREVENCIÓN',
    title: 'CALZADO Y VESTIMENTA DEPORTIVA',
    desc: 'Por tu seguridad en sala de pesas, está estrictamente prohibido entrenar descalzo, en sandalias o con calzado no deportivo.',
    icon: 'fa-shoe-prints',
    theme: 'emerald'
  },
  {
    id: 'n4',
    badge: 'HORARIOS DEL SANTUARIO • TEMPLO DE ZEUS',
    title: 'HORARIOS DEL TEMPLO DE ZEUS',
    desc: 'Lunes a Viernes: 6:00 AM – 10:00 PM | Sábados: 7:00 AM – 2:00 PM. ¡Honor, fuerza y disciplina en el Templo de Zeus!',
    icon: 'fa-clock',
    theme: 'amber'
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
    } catch (e) {
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
  const theme = THEME_STYLES[currentNotice.theme] || THEME_STYLES.amber;

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
      className={`relative group flex-1 min-h-0 overflow-hidden rounded-2xl xl:rounded-3xl px-[clamp(1.1rem,2.2vw,2.25rem)] py-[clamp(0.7rem,1.8dvh,1.5rem)] border backdrop-blur-xl transition-all duration-500 flex flex-col justify-center ${theme.bg} ${theme.border}`}
    >
      {/* Luz ambiental decorativa */}
      <div className={`absolute -top-20 -left-20 w-56 h-56 rounded-full blur-3xl pointer-events-none transition-colors duration-500 ${theme.glow}`}></div>

      {/* Contenido Principal Centrado Verticalmente con Alta Presencia */}
      <div className="relative z-10 flex items-center gap-[clamp(1rem,2vw,2rem)] min-w-0 overflow-hidden">
        {/* Caja de Icono Grande y Protagonista */}
        <div
          className={`w-[clamp(3.5rem,min(5.6vw,11.5dvh),6rem)] h-[clamp(3.5rem,min(5.6vw,11.5dvh),6rem)] rounded-2xl flex items-center justify-center shrink-0 text-[clamp(1.45rem,min(2.4vw,4.9dvh),2.5rem)] transition-all duration-500 ${theme.iconBox}`}
        >
          <i className={`fa-solid ${currentNotice.icon || 'fa-bolt-lightning'}`}></i>
        </div>

        {/* Textos del Aviso con Tipografía Grande y Proporcionada */}
        <div className="flex-1 min-w-0 flex flex-col justify-center gap-[clamp(0.25rem,0.8dvh,0.55rem)] overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-2 shrink-0">
            <span
              className={`text-[clamp(10px,min(0.8vw,1.65dvh),13.5px)] font-black uppercase px-3 py-1 rounded-lg tracking-wider inline-flex items-center gap-2 truncate max-w-full ${theme.badge}`}
            >
              <i className="fa-solid fa-circle-exclamation text-[0.9em] shrink-0"></i>
              <span className="truncate">{currentNotice.badge || 'DECRETO SAGRADO DEL OLIMPO'}</span>
            </span>

            {/* Selector de Indicadores / Dots y Controles Táctiles */}
            <div className="flex items-center gap-2 shrink-0 bg-black/60 border border-slate-800/80 px-2.5 py-1 rounded-full">
              {safeNotices.length > 1 && (
                <div className="flex items-center gap-1.5">
                  {safeNotices.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={(e) => handleSelectDot(idx, e)}
                      className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                        idx === currentIndex ? theme.dotActive : theme.dotInactive
                      }`}
                      title={`Ver aviso ${idx + 1}`}
                    />
                  ))}
                </div>
              )}

              {/* Botones de Navegación Manual (Siguiente / Anterior) */}
              <div className="flex items-center gap-1 ml-0.5">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="w-6 h-6 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 flex items-center justify-center text-[10px] cursor-pointer transition-colors"
                  title="Aviso anterior"
                >
                  <i className="fa-solid fa-chevron-left"></i>
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-6 h-6 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 flex items-center justify-center text-[10px] cursor-pointer transition-colors"
                  title="Siguiente aviso"
                >
                  <i className="fa-solid fa-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>

          <h3 className="font-zeus text-[clamp(1.15rem,min(2.15vw,4.4dvh),2.45rem)] font-black text-white leading-[1.12] uppercase tracking-wide line-clamp-2 break-words drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            {currentNotice.title}
          </h3>

          <p className="text-[clamp(0.82rem,min(1.12vw,2.3dvh),1.25rem)] text-slate-200 font-medium leading-snug line-clamp-2 drop-shadow">
            {currentNotice.desc}
          </p>
        </div>
      </div>

      {/* Barra de Progreso de Auto-Rotación */}
      {autoPlay && safeNotices.length > 1 && !isPaused && (
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/60 overflow-hidden">
          <div
            key={progressKey}
            className={`h-full bg-gradient-to-r ${theme.progress}`}
            style={{
              animation: `slideProgress ${duration}ms linear infinite`
            }}
          ></div>
        </div>
      )}
    </div>
  );
}
