import React, { useEffect, useRef } from 'react';
import { CrimsonOmen } from '../common/CrimsonOmenSvg';

export default function PromoHeroBanner({
  badge = 'PROMO GEARS DEL MES',
  title = 'PROMO DÚO 2 X $700 MXN',
  desc = 'Entrena con tu compañero de escuadrón. ¡Cero excusas en la legión GEARS GYM!',
  progressKey,
  duration = 10000,
  isAutoplay = true,
  currentIndex = 0,
  totalPromos = 4,
  onSelectPromo
}) {
  const boxRef = useRef(null);

  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.classList.remove('pulse-flash');
      void boxRef.current.offsetWidth; // trigger reflow
      boxRef.current.classList.add('pulse-flash');
    }
  }, [title, desc, badge]);

  return (
    <div
      ref={boxRef}
      className="relative flex-[1.15] min-h-0 overflow-hidden flex flex-row items-center justify-between gap-[clamp(1rem,2.2vw,2.5rem)] bg-gradient-to-r from-black/95 via-stone-950/92 to-red-950/40 border-l-4 border-l-red-600 border border-stone-800/90 px-[clamp(1.1rem,2.2vw,2.25rem)] py-[clamp(0.75rem,2dvh,1.6rem)] rounded-2xl xl:rounded-3xl backdrop-blur-md shadow-[0_10px_35px_rgba(0,0,0,0.75)] transition-all duration-300"
    >
      {/* Resplandor ambiental decorativo */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-red-600/12 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 right-12 w-56 h-56 bg-red-600/12 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 flex-1 min-w-0 flex flex-col justify-center gap-[clamp(0.35rem,1.05dvh,0.75rem)] h-full overflow-hidden">
        {/* Fila superior: Badges + Indicador de cartelera */}
        <div className="flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex flex-wrap items-center gap-2.5 min-w-0">
            <span className="bg-gradient-to-r from-red-600 to-rose-600 text-white text-[clamp(10px,min(0.82vw,1.7dvh),14px)] font-black uppercase px-3 py-1 rounded-lg tracking-wider inline-flex items-center gap-2 shadow-md shadow-red-600/30 border border-red-400/30 truncate max-w-full">
              <i className="fa-solid fa-skull text-[0.9em] shrink-0"></i>
              <span className="truncate">{badge}</span>
              <i className="fa-solid fa-skull text-[0.9em] shrink-0"></i>
            </span>

            <span className="text-[clamp(10px,min(0.78vw,1.6dvh),13px)] text-stone-200 font-extrabold uppercase tracking-widest hidden sm:inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1 rounded-lg whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.9)] animate-pulse shrink-0"></span>
              CARTELERA OFICIAL EN VIVO
            </span>
          </div>

          {/* Indicador de promoción activa */}
          {totalPromos > 1 && (
            <div className="hidden md:flex items-center gap-1.5 bg-black/60 border border-stone-800 px-2.5 py-1 rounded-full shrink-0">
              {Array.from({ length: totalPromos }).map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSelectPromo && onSelectPromo(idx)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === currentIndex
                      ? 'w-6 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]'
                      : 'w-2 bg-stone-700 hover:bg-stone-500'
                  }`}
                  title={`Promoción ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Título Principal Grande y Contundente */}
        <h2 className="font-gears text-[clamp(1.35rem,min(2.7vw,5.6dvh),3.35rem)] font-black text-white leading-[1.1] uppercase tracking-wide line-clamp-2 break-words drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)]">
          {title}
        </h2>

        {/* Descripción con alta presencia visual */}
        <p className="text-[clamp(0.85rem,min(1.18vw,2.45dvh),1.35rem)] text-stone-200 font-medium leading-snug line-clamp-2 max-w-4xl">
          {desc}
        </p>

        {/* Barra táctica inferior de beneficios para cohesión visual */}
        <div className="hidden sm:flex flex-wrap items-center gap-2.5 pt-[clamp(0.2rem,0.6dvh,0.45rem)] shrink-0">
          <span className="inline-flex items-center gap-1.5 bg-stone-900/90 border border-stone-700/70 text-stone-300 text-[clamp(9.5px,min(0.75vw,1.55dvh),12.5px)] font-bold px-2.5 py-1 rounded-lg">
            <i className="fa-solid fa-bolt text-amber-400"></i>
            Activación inmediata
          </span>
          <span className="inline-flex items-center gap-1.5 bg-stone-900/90 border border-stone-700/70 text-stone-300 text-[clamp(9.5px,min(0.75vw,1.55dvh),12.5px)] font-bold px-2.5 py-1 rounded-lg">
            <i className="fa-solid fa-dumbbell text-red-400"></i>
            Acceso total a pesas y cardio
          </span>
          <span className="inline-flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-[clamp(9.5px,min(0.75vw,1.55dvh),12.5px)] font-bold px-2.5 py-1 rounded-lg">
            <i className="fa-solid fa-circle-check text-emerald-400"></i>
            Sin costo de inscripción
          </span>
        </div>
      </div>

      {/* Emblema Lateral Grande con Anillo Táctico */}
      <div className="hidden sm:flex items-center justify-center shrink-0 relative z-10">
        <div className="w-[clamp(4.25rem,min(7.8vw,16dvh),8.75rem)] h-[clamp(4.25rem,min(7.8vw,16dvh),8.75rem)] rounded-full bg-gradient-to-b from-red-950/60 to-black/85 border-2 border-red-500/35 flex items-center justify-center shadow-[0_0_40px_rgba(220,38,38,0.3)]">
          <CrimsonOmen className="w-[74%] h-[74%] text-red-500 gear-spin drop-shadow-[0_0_20px_rgba(225,29,72,0.65)]" />
        </div>
      </div>

      {/* Barra de Progreso de Auto-Rotación */}
      {isAutoplay && (
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-stone-900/90 overflow-hidden">
          <div
            key={progressKey}
            className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-amber-500"
            style={{
              animation: `slideProgress ${duration}ms linear infinite`
            }}
          ></div>
        </div>
      )}

      <style>{`
        @keyframes slideProgress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}
