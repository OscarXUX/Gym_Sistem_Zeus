import React, { useState, useEffect } from 'react';
import HeaderSwitch from '../common/HeaderSwitch';

export default function MonitorHeader({
  musicTitle = 'HEAVY WORKOUT MIX',
  todayCounter = 42,
  isConnected,
  isSystemLocked = false,
  currentView = 'monitor',
  onChangeView,
  onTriggerSimulation
}) {
  const [clockStr, setClockStr] = useState('07:40 p.m.');
  const [isSimOpen, setIsSimOpen] = useState(false);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const formatted = now
        .toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
        .toLowerCase();
      setClockStr(formatted);
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  let aforoBadge = (
    <span className="pill-gold-3d inline-flex items-center gap-1.5 text-[clamp(9.5px,min(0.72vw,1.5dvh),11.5px)] font-cinzel font-black uppercase px-2.5 py-0.5 rounded-full whitespace-nowrap">
      <span className="w-1.5 h-1.5 rounded-full bg-[#0B1528] shrink-0"></span>
      <span>AFORO ÓPTIMO</span>
    </span>
  );

  if (todayCounter >= 50) {
    aforoBadge = (
      <span className="inline-flex items-center gap-1.5 bg-[#3B0A14] border border-[#EF4444] text-[#FCA5A5] text-[clamp(9.5px,min(0.72vw,1.5dvh),11.5px)] font-cinzel font-black uppercase px-2.5 py-0.5 rounded-full animate-pulse whitespace-nowrap shadow-sm">
        <i className="fa-solid fa-fire text-amber-400"></i> HORA PICO
      </span>
    );
  } else if (todayCounter >= 35) {
    aforoBadge = (
      <span className="inline-flex items-center gap-1.5 bg-[#2A1E0B] border border-[#F59E0B] text-[#FDE68A] text-[clamp(9.5px,min(0.72vw,1.5dvh),11.5px)] font-cinzel font-black uppercase px-2.5 py-0.5 rounded-full whitespace-nowrap shadow-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shrink-0"></span> RITMO INTENSO
      </span>
    );
  }

  return (
    <header className="relative z-40 flex flex-wrap items-center justify-between gap-2 px-3 sm:px-5 py-2 bg-gradient-to-r from-[#0B1528] via-[#142646] to-[#0B1528] border-b-2 border-[#C5A059] shrink-0 w-full shadow-[0_6px_20px_rgba(9,18,36,0.45)]">
      {/* Izquierda: Brand & Equalizer */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* Pill 1: ZEUS TV */}
        <div className="olympus-card--glass flex items-center gap-2 px-3.5 py-1.5 rounded-full shrink-0 border-[#C5A059]">
          <i className="fa-solid fa-bolt-lightning text-[#FFD700] text-sm animate-pulse"></i>
          <span className="font-cinzel text-xs sm:text-sm font-black text-white tracking-wider whitespace-nowrap">
            ZEUS <span className="text-[#D4AF37]">TV</span>
          </span>
        </div>

        {/* Pill 2: Music & Live Equalizer */}
        <div className="olympus-card--glass hidden md:flex items-center gap-2.5 text-xs font-bold text-[#F3E5AB] tracking-wide uppercase truncate px-3.5 py-1.5 rounded-full min-w-0">
          <i className="fa-solid fa-music text-[#D4AF37] text-xs shrink-0"></i>
          <span className="truncate max-w-[140px] lg:max-w-[190px] xl:max-w-[240px] font-cinzel text-[11px] text-white">
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

      {/* Centro: Aforo Central / Guerreros Hoy */}
      <div className="olympus-card--glass flex items-center gap-2.5 px-3.5 py-1 rounded-full shrink-0 border-[#C5A059]/80">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-users text-[#D4AF37] text-xs"></i>
          <span className="text-[10.5px] sm:text-[11px] text-[#F3E5AB] font-cinzel font-bold tracking-wider whitespace-nowrap">
            ATLETAS HOY:
          </span>
          <span className="font-cinzel text-sm sm:text-base font-black text-white leading-none">
            {todayCounter}
          </span>
        </div>
        <div className="h-3.5 w-[1px] bg-[#C5A059]/50"></div>
        <div>{aforoBadge}</div>
      </div>

      {/* Derecha: Simulador Olimpo Reubicado (Pilar 4.3) + Selector de Vistas + Reloj */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 relative">
        {/* Botón Simulador Olimpo en Topbar (Jamás tapa las tarjetas de suplementos) */}
        {onTriggerSimulation && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsSimOpen((prev) => !prev)}
              className="olympus-card--glass hover:border-[#D4AF37] px-3 py-1.5 rounded-full flex items-center gap-1.5 text-[#F3E5AB] font-cinzel font-black text-[10.5px] tracking-wider uppercase cursor-pointer transition-all"
              title="Controles de Simulación del Olimpo (Teclas A, W, E, V, O, L)"
            >
              <i className="fa-solid fa-bolt-lightning text-[#FFD700] text-xs animate-pulse"></i>
              <span className="hidden sm:inline">Simulador Olimpo</span>
              <span className="sm:hidden">Sim</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
            </button>

            {isSimOpen && (
              <div
                onMouseLeave={() => setIsSimOpen(false)}
                className="absolute right-0 top-full mt-2 w-72 sm:w-80 rounded-2xl bg-[#0B1528]/95 backdrop-blur-xl border-2 border-[#D4AF37] p-3 shadow-[0_20px_50px_rgba(0,0,0,0.75)] z-50 space-y-2.5 animate-fadeIn"
              >
                <div className="flex items-center justify-between border-b border-[#C5A059]/30 pb-1.5">
                  <div className="flex items-center gap-1.5 text-[#F3E5AB] font-cinzel font-black text-xs uppercase tracking-wider">
                    <i className="fa-solid fa-bolt-lightning text-[#FFD700]"></i>
                    <span>Simulador Olimpo</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsSimOpen(false)}
                    className="w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center text-[10px] cursor-pointer"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => onTriggerSimulation('active')}
                    className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-200 font-bold transition-all cursor-pointer active:scale-95"
                  >
                    <span className="truncate">⚡ Activo</span>
                    <kbd className="text-[10px] font-mono bg-black/60 px-1.5 py-0.5 rounded text-emerald-400 border border-emerald-500/30">
                      A
                    </kbd>
                  </button>

                  <button
                    type="button"
                    onClick={() => onTriggerSimulation('warning')}
                    className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-amber-950/80 hover:bg-amber-900 border border-amber-500/50 text-amber-200 font-bold transition-all cursor-pointer active:scale-95"
                  >
                    <span className="truncate">⚠️ Aviso</span>
                    <kbd className="text-[10px] font-mono bg-black/60 px-1.5 py-0.5 rounded text-amber-400 border border-amber-500/30">
                      W
                    </kbd>
                  </button>

                  <button
                    type="button"
                    onClick={() => onTriggerSimulation('expired')}
                    className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-500/50 text-rose-200 font-bold transition-all cursor-pointer active:scale-95"
                  >
                    <span className="truncate">🚫 Vencido</span>
                    <kbd className="text-[10px] font-mono bg-black/60 px-1.5 py-0.5 rounded text-rose-400 border border-rose-500/30">
                      E
                    </kbd>
                  </button>

                  <button
                    type="button"
                    onClick={() => onTriggerSimulation('visit')}
                    className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-sky-950/80 hover:bg-sky-900 border border-sky-500/50 text-sky-200 font-bold transition-all cursor-pointer active:scale-95"
                  >
                    <span className="truncate">⚡ Visita $60</span>
                    <kbd className="text-[10px] font-mono bg-black/60 px-1.5 py-0.5 rounded text-sky-400 border border-sky-500/30">
                      V
                    </kbd>
                  </button>

                  <button
                    type="button"
                    onClick={() => onTriggerSimulation('gate')}
                    className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold transition-all cursor-pointer active:scale-95"
                  >
                    <span className="truncate">🔓 Puerta</span>
                    <kbd className="text-[10px] font-mono bg-black/60 px-1.5 py-0.5 rounded text-slate-300 border border-slate-600">
                      O
                    </kbd>
                  </button>

                  <button
                    type="button"
                    onClick={() => onTriggerSimulation('lockdown')}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl border font-bold transition-all cursor-pointer active:scale-95 ${
                      isSystemLocked
                        ? 'bg-rose-900 border-rose-400 text-white shadow-[0_0_12px_rgba(244,63,94,0.6)] animate-pulse'
                        : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                  >
                    <span className="truncate">{isSystemLocked ? '🔒 Bloqueado' : '🛡️ Bloqueo'}</span>
                    <kbd className="text-[10px] font-mono bg-black/60 px-1.5 py-0.5 rounded text-amber-300 border border-slate-600">
                      L
                    </kbd>
                  </button>
                </div>

                <div className="flex items-center justify-between pt-1.5 border-t border-[#C5A059]/30 text-[11px] text-slate-300">
                  <button
                    type="button"
                    onClick={() => onTriggerSimulation('fullscreen')}
                    className="hover:text-white cursor-pointer flex items-center gap-1"
                  >
                    <i className="fa-solid fa-expand text-[#D4AF37]"></i> Pantalla (F)
                  </button>
                  <button
                    type="button"
                    onClick={() => onTriggerSimulation('view')}
                    className="hover:text-white cursor-pointer flex items-center gap-1 text-[#F3E5AB]"
                  >
                    <i className="fa-solid fa-repeat text-[#D4AF37]"></i> Admin (M)
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {onChangeView && (
          <div className="flex items-center shrink-0">
            <HeaderSwitch currentView={currentView} onChangeView={onChangeView} />
          </div>
        )}

        <div className="olympus-card--glass flex items-center gap-2 px-3.5 py-1 rounded-full border-[#C5A059]">
          <div className="text-right">
            <p className="font-cinzel text-xs sm:text-sm font-black text-white leading-tight tracking-wider whitespace-nowrap">
              {clockStr}
            </p>
          </div>
          <span
            className={`w-2 h-2 rounded-full inline-block shrink-0 ${
              isConnected
                ? 'bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.85)] animate-pulse'
                : 'bg-[#EF4444]'
            }`}
            title={isConnected ? 'Sistema en línea' : 'Desconectado'}
          ></span>
        </div>
      </div>
    </header>
  );
}
