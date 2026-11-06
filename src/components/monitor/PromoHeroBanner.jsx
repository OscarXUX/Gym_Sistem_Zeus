import React, { useEffect, useRef } from 'react';
import { TempleFrame } from '../common/GreekTempleComponents';

export default function PromoHeroBanner({
  badge = 'PROMO DESTACADA DEL MES',
  title = 'MENSUALIDAD ZEUS - $400 MXN',
  desc = 'Acceso total durante 30 días de entrenamiento sin límites en el Templo del Olimpo.',
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
    <div ref={boxRef} className="flex-[1.18] min-h-0 flex flex-col transition-all duration-300">
      <TempleFrame
        className="h-full"
        innerClassName="bg-olympus-storm text-white flex flex-col justify-between px-4 sm:px-6 py-3 sm:py-4 relative overflow-hidden"
        size="md"
        columnWidth="w-4 sm:w-6 md:w-7"
        topLintel={null}
        bottomLintel={null}
        showClouds={true}
      >
        {/* ================================================================ */}
        {/* PLANO 3 (PRIMER PLANO): RAYO DORADO CON RESPLANDOR VOLUMÉTRICO   */}
        {/* ================================================================ */}
        <div className="absolute right-2 sm:right-8 top-1/2 -translate-y-1/2 select-none pointer-events-none z-[2]">
          <svg
            className="w-24 h-24 sm:w-36 sm:h-36 md:w-44 md:h-44 lightning-glow lightning-volumetric"
            viewBox="0 0 100 100"
            fill="none"
          >
            <path
              d="M58 4 L24 51 L48 51 L35 96 L79 43 L53 43 Z"
              fill="url(#gold-lightning-grad)"
              stroke="#FFFFFF"
              strokeWidth="1.5"
            />
            {/* Destello secundario superior */}
            <path
              d="M22 12 L12 28 L20 28 L16 42 L30 24 L21 24 Z"
              fill="url(#gold-lightning-grad)"
              opacity="0.75"
            />
            <defs>
              <linearGradient id="gold-lightning-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="30%" stopColor="#FFF59D" />
                <stop offset="68%" stopColor="#FFD700" />
                <stop offset="100%" stopColor="#D4AF37" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* ================================================================ */}
        {/* FILA SUPERIOR DENTRO DEL CIELO AZUL: BADGES Y PAGINACIÓN         */}
        {/* ================================================================ */}
        <div className="relative z-10 w-full flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Badge Oro Imperial 3D */}
            <span className="pill-gold-3d font-cinzel text-[9.5px] sm:text-[11px] font-black uppercase px-3 py-0.5 rounded-full tracking-wider inline-flex items-center gap-1.5">
              <i className="fa-solid fa-crown text-[9px]"></i>
              <span>{badge}</span>
            </span>

            {/* Badge Glassmorphism Cartelera en Vivo */}
            <span className="olympus-card--glass hidden sm:inline-flex items-center gap-1.5 text-[9.5px] sm:text-[10.5px] text-[#F3E5AB] font-cinzel font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981] animate-ping"></span>
              <span>CARTELERA OFICIAL EN VIVO</span>
            </span>
          </div>

          {/* Paginación de Promos dentro del cielo tormentoso */}
          {totalPromos > 1 && (
            <div className="olympus-card--glass flex items-center gap-1.5 px-2.5 py-1 rounded-full shrink-0">
              {Array.from({ length: totalPromos }).map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSelectPromo && onSelectPromo(idx)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    idx === currentIndex
                      ? 'w-4 bg-[#D4AF37] shadow-[0_0_8px_#FFD700]'
                      : 'w-1.5 bg-white/40 hover:bg-white/70'
                  }`}
                  title={`Promoción ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* ================================================================ */}
        {/* CONTENIDO CENTRAL DEL BANNER (TÍTULO CLAMP SIN "MXN" HUÉRFANO)   */}
        {/* ================================================================ */}
        <div className="relative z-10 max-w-3xl pr-12 sm:pr-24 flex flex-col justify-center gap-1 my-auto py-1">
          <h2
            className="font-cinzel font-black text-white tracking-wide uppercase leading-tight drop-shadow-[0_3px_10px_rgba(0,0,0,0.85)]"
            style={{ fontSize: 'clamp(1.5rem, 2.2vw, 2.2rem)' }}
          >
            {title}
          </h2>

          <p className="text-xs sm:text-sm text-[#F4F2EB]/95 font-medium leading-snug drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)] max-w-2xl">
            {desc}
          </p>
        </div>

        {/* ================================================================ */}
        {/* PILLS INFERIORES CON GLASSMORPHISM (.olympus-card--glass)        */}
        {/* ================================================================ */}
        <div className="relative z-10 flex flex-wrap items-center gap-2 pt-1">
          <span className="olympus-card--glass inline-flex items-center gap-1.5 text-[#F3E5AB] text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full">
            <i className="fa-solid fa-bolt-lightning text-[#FFD700] text-[9px]"></i>
            <span>Activación Inmediata</span>
          </span>
          <span className="olympus-card--glass inline-flex items-center gap-1.5 text-[#F3E5AB] text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full">
            <i className="fa-solid fa-dumbbell text-[#D4AF37] text-[9px]"></i>
            <span>Acceso Total Pesas y Cardio</span>
          </span>
          <span className="olympus-card--glass inline-flex items-center gap-1.5 border-[#10B981]/50 text-[#34D399] text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
            <span>En venta en recepción</span>
          </span>
        </div>

        {/* Barra de progreso de auto-rotación sutil */}
        {isAutoplay && (
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#0B1528]/70 overflow-hidden z-20">
            <div
              key={progressKey}
              className="h-full bg-gradient-to-r from-[#D4AF37] via-[#FFF275] to-[#D4AF37]"
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
