import React from 'react';

export default function CommanderToastAlert({ alert, onClose }) {
  if (!alert || !alert.visible) return null;

  return (
    <div className="absolute top-0 left-0 right-0 z-[100] promo-banner bg-gradient-to-r from-red-900 via-red-600 to-red-900 border-b-4 border-red-500 p-4 md:p-6 shadow-2xl flex items-center justify-between animate-slideInDown">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-black/50 border-2 border-white/20 flex items-center justify-center shrink-0">
          <i className="fa-solid fa-bullhorn text-2xl text-white animate-bounce"></i>
        </div>
        <div>
          <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-white/70 mb-0.5">
            Mensaje del Comandante
          </p>
          <h2 className="font-gears text-xl md:text-3xl font-black text-white leading-none">
            {alert.title || 'NUEVA PROMOCIÓN'}
          </h2>
          <p className="text-sm md:text-base font-bold text-white/90 mt-1">
            {alert.msg || 'Revisa el banner central.'}
          </p>
        </div>
      </div>
      <button
        onClick={onClose}
        className="bg-black/20 hover:bg-black/40 text-white rounded-full w-10 h-10 flex items-center justify-center shrink-0 transition-colors cursor-pointer"
      >
        <i className="fa-solid fa-xmark"></i>
      </button>
    </div>
  );
}
