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
    <div ref={boxRef} className="flex-[1.15] min-h-0 flex flex-col transition-all duration-300">
      <TempleFrame
        className="h-full shadow-xl"
        innerClassName="bg-olympus-storm text-white flex flex-col justify-between p-3.5 sm:p-5 relative overflow-hidden"
        size="md"
        columnWidth="w-4 sm:w-6 md:w-7"
        topLintel={
          <div className="w-full flex items-center justify-between gap-2 px-1">
            <div className="flex items-center gap-2">
              <span className="bg-[#D4AF37] text-[#0F1E36] font-cinzel text-[10px] sm:text-xs font-black uppercase px-2.5 py-0.5 rounded-full shadow-sm">
                <i className="fa-solid fa-crown text-[9px] mr-1"></i> {badge}
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] text-[#0F1E36] font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-ping"></span>
                CARTELERA OFICIAL EN VIVO
              </span>
            </div>

            {/* Paginación de Promos */}
            {totalPromos > 1 && (
              <div className="flex items-center gap-1 bg-[#0F1E36]/10 px-2 py-0.5 rounded-full">
                {Array.from({ length: totalPromos }).map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onSelectPromo && onSelectPromo(idx)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      idx === currentIndex ? 'w-4 bg-[#D4AF37]' : 'w-1.5 bg-[#997A2C]/40'
                    }`}
                    title={`Promoción ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        }
        bottomLintel={
          <div className="w-full flex items-center justify-between text-[10px] text-[#997A2C] font-bold px-2 py-0.5">
            <span className="font-cinzel tracking-wider">TEMPLO SAGRADO DE ZEUS • OFERTA OFICIAL</span>
            <span className="font-cinzel text-[#0F1E36]">100% LIBRE DE CONTRATO</span>
          </div>
        }
      >
        {/* Rayo Divino Épico en el fondo derecho */}
        <div className="absolute -right-2 sm:right-6 top-1/2 -translate-y-1/2 select-none pointer-events-none opacity-85">
          <svg className="w-24 h-24 sm:w-36 sm:h-36 md:w-44 md:h-44 lightning-glow" viewBox="0 0 100 100" fill="none">
            <path
              d="M58 5 L22 52 L48 52 L36 95 L78 44 L52 44 Z"
              fill="url(#gold-lightning-grad)"
              stroke="#FFF"
              strokeWidth="1.5"
            />
            <defs>
              <linearGradient id="gold-lightning-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="30%" stopColor="#FFF275" />
                <stop offset="70%" stopColor="#FFD700" />
                <stop offset="100%" stopColor="#D4AF37" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Contenido Central del Banner */}
        <div className="relative z-10 max-w-2xl sm:max-w-3xl pr-14 sm:pr-24 flex flex-col justify-center gap-1.5 sm:gap-2">
          <h2 className="font-cinzel text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-wide uppercase leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            {title}
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-[#F4F3EF]/90 font-medium leading-relaxed drop-shadow">
            {desc}
          </p>

          {/* Badges inferiores */}
          <div className="flex flex-wrap items-center gap-2 pt-1.5 sm:pt-2">
            <span className="inline-flex items-center gap-1.5 bg-[#0F1E36]/80 border border-[#C5A059]/70 text-[#F3E5AB] text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full shadow-sm">
              <i className="fa-solid fa-bolt-lightning text-[#FFD700] text-[9px]"></i>
              Activación Inmediata
            </span>
            <span className="inline-flex items-center gap-1.5 bg-[#0F1E36]/80 border border-[#C5A059]/70 text-[#F3E5AB] text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full shadow-sm">
              <i className="fa-solid fa-dumbbell text-[#D4AF37] text-[9px]"></i>
              Acceso Total 1 Pase por Sesión
            </span>
            <span className="inline-flex items-center gap-1.5 bg-[#0F1E36]/80 border border-[#10b981]/60 text-[#34d399] text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full shadow-sm">
              <i className="fa-solid fa-circle-check text-[9px]"></i>
              En venta en recepción
            </span>
          </div>
        </div>

        {/* Barra de progreso de auto-rotación */}
        {isAutoplay && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#0F1E36]/60 overflow-hidden">
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
