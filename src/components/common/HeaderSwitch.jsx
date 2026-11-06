import React from 'react';

export default function HeaderSwitch({ currentView, onChangeView }) {
  return (
    <div className="inline-flex items-center bg-[#0F1E36] border border-[#C5A059] rounded-lg p-0.5 text-[11px] font-bold shrink-0 shadow-md">
      <button
        type="button"
        onClick={() => onChangeView && onChangeView('admin')}
        className={`px-3 py-1 rounded-[6px] transition-all flex items-center gap-1.5 cursor-pointer font-cinzel ${
          currentView === 'admin'
            ? 'bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#0F1E36] font-black shadow-[0_2px_8px_rgba(212,175,55,0.4)]'
            : 'text-[#F3E5AB]/70 hover:text-white'
        }`}
        title="Vista Panel Administrativo del Olimpo"
      >
        <i className="fa-solid fa-landmark text-[10px]"></i>
        <span>Admin</span>
      </button>

      <button
        type="button"
        onClick={() => onChangeView && onChangeView('monitor')}
        className={`px-3 py-1 rounded-[6px] transition-all flex items-center gap-1.5 cursor-pointer font-cinzel ${
          currentView === 'monitor'
            ? 'bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#0F1E36] font-black shadow-[0_2px_8px_rgba(212,175,55,0.4)]'
            : 'text-[#F3E5AB]/70 hover:text-white'
        }`}
        title="Cambiar a Monitor TV Kiosco"
      >
        <i className="fa-solid fa-tv text-[10px]"></i>
        <span>TV</span>
      </button>
    </div>
  );
}
