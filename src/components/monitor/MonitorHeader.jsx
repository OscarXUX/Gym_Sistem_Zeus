import React, { useState, useEffect } from 'react';
import HeaderSwitch from '../common/HeaderSwitch';

export default function MonitorHeader({
  musicTitle = 'HEAVY WORKOUT MIX',
  todayCounter = 42,
  isConnected,
  currentView = 'monitor',
  onChangeView
}) {
  const [clockStr, setClockStr] = useState('07:40 p.m.');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const formatted = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase();
      setClockStr(formatted);
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  let aforoBadge = (
    <span className="inline-flex items-center gap-1.5 bg-[#0b241b] border border-[#10b981]/60 text-[#34d399] text-[clamp(10px,min(0.75vw,1.6dvh),12px)] font-bold uppercase px-2.5 py-0.5 rounded-full whitespace-nowrap shadow-sm">
      <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse shrink-0"></span> AFORO ÓPTIMO
    </span>
  );

  if (todayCounter >= 50) {
    aforoBadge = (
      <span className="inline-flex items-center gap-1.5 bg-[#2c1015] border border-[#f43f5e]/60 text-[#fb7185] text-[clamp(10px,min(0.75vw,1.6dvh),12px)] font-bold uppercase px-2.5 py-0.5 rounded-full animate-pulse whitespace-nowrap shadow-sm">
        <i className="fa-solid fa-fire text-amber-400"></i> HORA PICO
      </span>
    );
  } else if (todayCounter >= 35) {
    aforoBadge = (
      <span className="inline-flex items-center gap-1.5 bg-[#2a1e0b] border border-[#d97706]/60 text-[#fbbf24] text-[clamp(10px,min(0.75vw,1.6dvh),12px)] font-bold uppercase px-2.5 py-0.5 rounded-full whitespace-nowrap shadow-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shrink-0"></span> RITMO INTENSO
      </span>
    );
  }

  return (
    <header className="relative z-30 flex flex-wrap items-center justify-between gap-2 px-3 sm:px-6 py-2 bg-gradient-to-r from-[#0F1E36] via-[#142646] to-[#0F1E36] border-b-2 border-[#C5A059] shrink-0 w-full shadow-lg">
      {/* Brand & Equalizer */}
      <div className="flex items-center gap-2.5 md:gap-3.5 min-w-0">
        {/* Pill 1: ZEUS TV */}
        <div className="flex items-center gap-2 bg-[#091528] border border-[#C5A059] px-3.5 py-1.5 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.4)] shrink-0">
          <i className="fa-solid fa-bolt-lightning text-[#D4AF37] text-sm animate-pulse"></i>
          <span className="font-cinzel text-xs sm:text-sm font-black text-white tracking-wider whitespace-nowrap">
            ZEUS <span className="text-[#D4AF37]">TV</span>
          </span>
        </div>

        {/* Pill 2: Music & Live Equalizer */}
        <div className="hidden md:flex items-center gap-2.5 text-xs font-bold text-[#F3E5AB] tracking-wide uppercase truncate bg-[#091528] border border-[#C5A059]/70 px-3.5 py-1.5 rounded-full min-w-0 shadow-inner">
          <i className="fa-solid fa-music text-[#D4AF37] text-xs shrink-0"></i>
          <span className="truncate max-w-[150px] lg:max-w-[200px] xl:max-w-[260px] font-cinzel text-[11px] text-white">
            {musicTitle}
          </span>
          <div className="flex items-end gap-[2px] h-3.5 px-0.5 shrink-0" title="Audio en vivo">
            <span className="eq-bar"></span>
            <span className="eq-bar"></span>
            <span className="eq-bar"></span>
            <span className="eq-bar"></span>
          </div>
        </div>
      </div>

      {/* Aforo Central / Atletas Hoy */}
      <div className="flex items-center gap-3 bg-[#091528] border border-[#C5A059]/80 px-4 py-1.5 rounded-full shrink-0 shadow-md">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-users text-[#D4AF37] text-xs"></i>
          <span className="text-[11px] text-[#F3E5AB] font-cinzel font-bold tracking-wider whitespace-nowrap">
            GUERREROS HOY:
          </span>
          <span className="font-cinzel text-sm sm:text-base font-black text-white leading-none">
            {todayCounter}
          </span>
        </div>
        <div className="h-3.5 w-[1px] bg-[#C5A059]/50"></div>
        <div>{aforoBadge}</div>
      </div>

      {/* Controles Derechos: Selector de Vistas + Reloj */}
      <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
        {onChangeView && (
          <div className="flex items-center shrink-0">
            <HeaderSwitch
              currentView={currentView}
              onChangeView={onChangeView}
            />
          </div>
        )}

        <div className="flex items-center gap-2 bg-[#091528] border border-[#C5A059] px-3.5 py-1 rounded-full shadow-md">
          <div className="text-right">
            <p className="font-cinzel text-xs sm:text-sm font-black text-white leading-tight tracking-wider whitespace-nowrap">
              {clockStr}
            </p>
          </div>
          <span
            className={`w-2 h-2 rounded-full inline-block shrink-0 ${
              isConnected ? 'bg-[#10b981] shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse' : 'bg-rose-500'
            }`}
            title={isConnected ? 'Sistema en línea' : 'Desconectado'}
          ></span>
        </div>
      </div>
    </header>
  );
}
