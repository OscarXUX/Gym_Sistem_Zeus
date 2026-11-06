import React from 'react';

export default function CommanderToastAlert({ alert, onClose }) {
  if (!alert || !alert.visible) return null;

  return (
    <div className="absolute top-0 left-0 right-0 z-[100] promo-banner bg-gradient-to-r from-[#0F1E36] via-[#162A4A] to-[#0F1E36] border-b-4 border-[#D4AF37] p-4 md:p-6 shadow-2xl flex items-center justify-between animate-slideInDown">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-[#091528] border-2 border-[#D4AF37] flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(212,175,55,0.4)]">
          <i className="fa-solid fa-bolt-lightning text-2xl text-[#FFD700] animate-pulse"></i>
        </div>
        <div>
          <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-[#F3E5AB] mb-0.5 font-cinzel">
            DECRETO SAGRADO • LA VOZ DE ZEUS
          </p>
          <h2 className="font-cinzel text-xl md:text-3xl font-black text-white leading-none tracking-wide drop-shadow-md">
            {alert.title || 'NUEVO DECRETO DEL OLIMPO'}
          </h2>
          <p className="text-sm md:text-base font-bold text-[#F4F3EF] mt-1">
            {alert.msg || 'Revisa la cartelera del templo.'}
          </p>
        </div>
      </div>
      <button
        onClick={onClose}
        className="bg-white/10 hover:bg-white/20 text-[#F3E5AB] hover:text-white rounded-full w-10 h-10 flex items-center justify-center shrink-0 transition-colors cursor-pointer border border-[#C5A059]"
        title="Cerrar notificación"
      >
        <i className="fa-solid fa-xmark"></i>
      </button>
    </div>
  );
}
