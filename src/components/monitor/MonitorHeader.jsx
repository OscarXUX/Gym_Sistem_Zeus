import React, { useState, useEffect } from 'react';
import { ZeusEmblem } from '../common/ZeusSvg';
import HeaderSwitch from '../common/HeaderSwitch';

export default function MonitorHeader({
  musicTitle = 'ZEUS EPIC SOUNDTRACK',
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
    <span className="inline-flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-[clamp(10px,min(0.75vw,1.6dvh),13px)] font-black uppercase px-2.5 py-0.5 rounded-full whitespace-nowrap shadow-sm">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span> AFORO FLUIDO
    </span>
  );

  if (todayCounter >= 50) {
    aforoBadge = (
      <span className="inline-flex items-center gap-1.5 bg-rose-950/90 border border-rose-500/60 text-rose-300 text-[clamp(10px,min(0.75vw,1.6dvh),13px)] font-black uppercase px-2.5 py-0.5 rounded-full animate-pulse whitespace-nowrap shadow-sm">
        <i className="fa-solid fa-fire text-amber-400"></i> HORA PICO
      </span>
    );
  } else if (todayCounter >= 35) {
    aforoBadge = (
      <span className="inline-flex items-center gap-1.5 bg-amber-950/80 border border-amber-500/50 text-amber-300 text-[clamp(10px,min(0.75vw,1.6dvh),13px)] font-black uppercase px-2.5 py-0.5 rounded-full whitespace-nowrap shadow-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shrink-0"></span> RITMO INTENSO
      </span>
    );
  }

  return (
    <header className="relative z-30 flex flex-wrap items-center justify-between gap-2 px-[clamp(0.85rem,1.6vw,1.75rem)] py-[clamp(0.4rem,1.05dvh,0.75rem)] bg-[#070b14]/95 border-b border-sky-500/20 shrink-0 w-full backdrop-blur-xl">
      {/* Brand & Equalizer */}
      <div className="flex items-center gap-2.5 md:gap-3.5 min-w-0">
        <div className="flex items-center gap-2.5 bg-sky-500/10 border border-sky-400/40 px-3 py-1 rounded-xl shadow-[0_0_20px_rgba(56,189,248,0.25)] shrink-0">
          <ZeusEmblem className="w-[clamp(1.15rem,min(1.45vw,3dvh),1.6rem)] h-[clamp(1.15rem,min(1.45vw,3dvh),1.6rem)] drop-shadow-[0_0_8px_rgba(56,189,248,0.7)]" />
          <span className="font-zeus text-[clamp(0.78rem,min(1vw,2.1dvh),1.05rem)] font-black text-white tracking-wider whitespace-nowrap">
            ZEUS <span className="text-sky-400">TV</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-2.5 text-[clamp(0.72rem,min(0.88vw,1.85dvh),0.92rem)] font-bold text-slate-200 tracking-wider uppercase truncate bg-slate-900/70 border border-slate-800/90 px-3.5 py-1 rounded-xl min-w-0">
          <i className="fa-solid fa-bolt-lightning text-amber-400 text-[1.1em] shrink-0"></i>
          <span className="truncate max-w-[160px] lg:max-w-[220px] xl:max-w-[280px]">{musicTitle}</span>
          <div className="flex items-end gap-[2px] h-3.5 px-0.5 shrink-0" title="Audio en vivo">
            <span className="eq-bar"></span>
            <span className="eq-bar"></span>
            <span className="eq-bar"></span>
            <span className="eq-bar"></span>
          </div>
        </div>
      </div>

      {/* Aforo Central / Atletas Hoy */}
      <div className="flex items-center gap-2.5 bg-[#090e1a]/80 border border-slate-800/90 px-3.5 py-1 rounded-xl shrink-0 shadow-inner">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-users text-sky-400 text-[clamp(0.72rem,min(0.88vw,1.85dvh),0.92rem)]"></i>
          <span className="text-[clamp(0.68rem,min(0.82vw,1.7dvh),0.85rem)] text-slate-300 font-black uppercase tracking-wider whitespace-nowrap">
            ATLETAS HOY:
          </span>
          <span className="font-zeus text-[clamp(0.9rem,min(1.15vw,2.4dvh),1.2rem)] font-black text-white leading-none">
            {todayCounter}
          </span>
        </div>
        <div className="hidden sm:block h-4 w-[1px] bg-slate-800"></div>
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

        <div className="flex items-center gap-2.5 bg-slate-900/60 border border-slate-800/80 px-3 py-1 rounded-xl">
          <div className="text-right">
            <p className="font-zeus text-[clamp(0.9rem,min(1.25vw,2.6dvh),1.35rem)] font-black text-white leading-tight tracking-wide whitespace-nowrap">
              {clockStr}
            </p>
            <p className="text-[clamp(8.5px,min(0.65vw,1.35dvh),11px)] text-slate-400 uppercase tracking-widest font-black flex items-center justify-end gap-1.5 leading-none mt-0.5 whitespace-nowrap">
              <span
                className={`w-1.5 h-1.5 rounded-full inline-block shrink-0 ${
                  isConnected ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]'
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
