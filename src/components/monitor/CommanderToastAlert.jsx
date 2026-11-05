import React from 'react';

export default function CommanderToastAlert({ alert, onClose }) {
  if (!alert || !alert.visible) return null;

  return (
    <div className="absolute top-0 left-0 right-0 z-[100] promo-banner bg-gradient-to-r from-sky-950 via-sky-700 to-indigo-950 border-b-4 border-amber-400 p-4 md:p-6 shadow-[0_15px_40px_rgba(56,189,248,0.35)] flex items-center justify-between animate-slideInDown backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-black/60 border-2 border-amber-400/50 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(251,191,36,0.4)]">
          <i className="fa-solid fa-bolt-lightning text-2xl text-amber-300 animate-pulse"></i>
        </div>
        <div>
          <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-amber-300/90 mb-0.5 flex items-center gap-1.5">
            <span>Decreto del Olimpo • La Voz de Zeus</span>
          </p>
          <h2 className="font-zeus text-xl md:text-3xl font-black text-white leading-none tracking-wide drop-shadow-md">
            {alert.title || 'NUEVO DECRETO DEL OLIMPO'}
          </h2>
          <p className="text-sm md:text-base font-bold text-sky-100 mt-1">
            {alert.msg || 'Revisa la cartelera del santuario.'}
          </p>
        </div>
      </div>
      <button
        onClick={onClose}
        className="bg-white/10 hover:bg-white/20 text-white rounded-full w-10 h-10 flex items-center justify-center shrink-0 transition-colors cursor-pointer border border-white/10"
        title="Cerrar notificación"
      >
        <i className="fa-solid fa-xmark"></i>
      </button>
    </div>
  );
}
