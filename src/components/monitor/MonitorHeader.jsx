import React, { useState, useEffect } from 'react';
import { CrimsonOmen } from '../common/CrimsonOmenSvg';
import HeaderSwitch from '../common/HeaderSwitch';

export default function MonitorHeader({
  musicTitle = 'HEAVY WORKOUT MIX',
  todayCounter = 42,
  isConnected,
  currentView = 'monitor',
  onChangeView
}) {
  const [clockStr, setClockStr] = useState('12:00 PM');

  useEffect(() => {
    const update = () => {
      setClockStr(new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }));
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  let aforoBadge = (
    <span className="inline-flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 text-[clamp(10px,min(0.75vw,1.6dvh),13px)] font-black uppercase px-2.5 py-0.5 rounded-full whitespace-nowrap">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span> AFORO FLUIDO
    </span>
  );

  if (todayCounter >= 50) {
    aforoBadge = (
      <span className="inline-flex items-center gap-1.5 bg-rose-950/90 border border-rose-500/60 text-rose-400 text-[clamp(10px,min(0.75vw,1.6dvh),13px)] font-black uppercase px-2.5 py-0.5 rounded-full animate-pulse whitespace-nowrap">
        <i className="fa-solid fa-fire text-amber-400"></i> HORA PICO
      </span>
    );
  } else if (todayCounter >= 35) {
    aforoBadge = (
      <span className="inline-flex items-center gap-1.5 bg-amber-950/80 border border-amber-500/50 text-amber-400 text-[clamp(10px,min(0.75vw,1.6dvh),13px)] font-black uppercase px-2.5 py-0.5 rounded-full whitespace-nowrap">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shrink-0"></span> RITMO MEDIO
      </span>
    );
  }

  return (
    <header className="relative z-30 flex flex-wrap items-center justify-between gap-2 px-[clamp(0.85rem,1.6vw,1.75rem)] py-[clamp(0.4rem,1.05dvh,0.75rem)] bg-stone-950/95 border-b border-red-600/40 shrink-0 w-full backdrop-blur-md">
      {/* Brand & Equalizer */}
      <div className="flex items-center gap-2.5 md:gap-3.5 min-w-0">
        <div className="flex items-center gap-2.5 bg-red-600/20 border border-red-500/80 px-3 py-1 rounded-xl shadow-[0_0_15px_rgba(220,38,38,0.3)] shrink-0">
          <CrimsonOmen className="w-[clamp(1.15rem,min(1.45vw,3dvh),1.6rem)] h-[clamp(1.15rem,min(1.45vw,3dvh),1.6rem)] text-red-500" />
          <span className="font-gears text-[clamp(0.78rem,min(1vw,2.1dvh),1.05rem)] font-black text-white tracking-wider whitespace-nowrap">
            GEARS <span className="text-red-500">TV</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-2.5 text-[clamp(0.72rem,min(0.88vw,1.85dvh),0.92rem)] font-bold text-stone-200 tracking-wider uppercase truncate bg-stone-900/70 border border-stone-800/90 px-3.5 py-1 rounded-xl min-w-0">
          <i className="fa-brands fa-youtube text-red-500 text-[1.1em] shrink-0"></i>
          <span className="truncate max-w-[160px] lg:max-w-[220px] xl:max-w-[280px]">{musicTitle}</span>
          <div className="flex items-end gap-[2px] h-3.5 px-0.5 shrink-0" title="Audio en vivo">
            <span className="eq-bar"></span>
            <span className="eq-bar"></span>
            <span className="eq-bar"></span>
            <span className="eq-bar"></span>
          </div>
        </div>
      </div>

      {/* Aforo Central / Guerreros Hoy */}
      <div className="flex items-center gap-2.5 bg-black/70 border border-stone-800/90 px-3.5 py-1 rounded-xl shrink-0 shadow-inner">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-users text-red-500 text-[clamp(0.72rem,min(0.88vw,1.85dvh),0.92rem)]"></i>
          <span className="text-[clamp(0.68rem,min(0.82vw,1.7dvh),0.85rem)] text-stone-300 font-black uppercase tracking-wider whitespace-nowrap">
            GUERREROS HOY:
          </span>
          <span className="font-gears text-[clamp(0.9rem,min(1.15vw,2.4dvh),1.2rem)] font-black text-white leading-none">
            {todayCounter}
          </span>
        </div>
        <div className="hidden sm:block h-4 w-[1px] bg-stone-800"></div>
        <div className="hidden sm:block">{aforoBadge}</div>
      </div>

      {/* Controles Derechos: Selector de Vistas + Reloj y Estado */}
      <div className="flex items-center gap-2.5 md:gap-3.5 shrink-0">
        {onChangeView && (
          <div className="flex items-center shrink-0">
            <HeaderSwitch
              currentView={currentView}
              onChangeView={onChangeView}
              isEmbedded
            />
          </div>
        )}

        <div className="flex items-center gap-2.5 bg-stone-900/60 border border-stone-800/80 px-3 py-1 rounded-xl">
          <div className="text-right">
            <p className="font-gears text-[clamp(0.9rem,min(1.25vw,2.6dvh),1.35rem)] font-black text-white leading-tight tracking-wide whitespace-nowrap">
              {clockStr}
            </p>
            <p className="text-[clamp(8.5px,min(0.65vw,1.35dvh),11px)] text-stone-400 uppercase tracking-widest font-black flex items-center justify-end gap-1.5 leading-none mt-0.5 whitespace-nowrap">
              <span
                className={`w-1.5 h-1.5 rounded-full inline-block shrink-0 ${
                  isConnected ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse' : 'bg-red-500'
                }`}
              ></span>
              <span>{isConnected ? 'ONLINE' : 'OFFLINE'}</span>
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
