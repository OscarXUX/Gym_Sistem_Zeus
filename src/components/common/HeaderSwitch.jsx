import React from 'react';

export default function HeaderSwitch({ currentView, onChangeView }) {
  return (
    <div className="inline-flex items-center bg-stone-900 border border-stone-800 rounded-xl p-0.5 text-[10px] font-bold shrink-0 shadow-inner">
      <button
        type="button"
        onClick={() => onChangeView && onChangeView('admin')}
        className={`px-2 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
          currentView === 'admin'
            ? 'bg-red-600 text-white shadow-[0_0_10px_rgba(220,38,38,0.4)]'
            : 'text-stone-400 hover:text-white'
        }`}
        title="Vista Panel Admin"
      >
        <i className="fa-solid fa-tablet-screen-button text-[10px]"></i>
        <span>Admin</span>
      </button>

      <button
        type="button"
        onClick={() => onChangeView && onChangeView('monitor')}
        className={`px-2 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
          currentView === 'monitor'
            ? 'bg-red-600 text-white shadow-[0_0_10px_rgba(220,38,38,0.4)]'
            : 'text-stone-400 hover:text-white'
        }`}
        title="Cambiar a Monitor TV"
      >
        <i className="fa-solid fa-tv text-[10px]"></i>
        <span>TV</span>
      </button>
    </div>
  );
}
