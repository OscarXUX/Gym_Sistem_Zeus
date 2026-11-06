import React from 'react';
import HeaderSwitch from '../common/HeaderSwitch';

export default function MobileHeader({
  onToggleDrawer,
  onOpenNewMember,
  isConnected,
  currentView = 'admin',
  onChangeView
}) {
  return (
    <header className="sticky top-0 md:hidden flex items-center justify-between gap-2 px-3 py-2 bg-gradient-to-r from-[#0F1E36] via-[#162A4A] to-[#0F1E36] border-b-2 border-[#C5A059] shrink-0 z-30 shadow-md">
      <div className="flex items-center gap-2 min-w-0">
        <button
          onClick={onToggleDrawer}
          className="w-8 h-8 rounded-lg bg-[#091528] border border-[#C5A059]/60 text-[#F3E5AB] flex items-center justify-center text-xs transition-colors cursor-pointer shrink-0"
          aria-label="Abrir Menú"
        >
          <i className="fa-solid fa-bars"></i>
        </button>
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-[#091528] border border-[#C5A059] flex items-center justify-center shrink-0 shadow-inner">
            <i className="fa-solid fa-bolt-lightning text-[#D4AF37] text-xs"></i>
          </div>
          <div className="min-w-0">
            <span className="font-cinzel font-black text-xs text-white tracking-widest block leading-none truncate">
              GYM <span className="text-[#D4AF37]">ZEUS</span>
            </span>
            <span className="text-[9px] text-[#C5A059] font-cinzel font-bold flex items-center gap-1 mt-0.5">
              <span
                className={`w-1.5 h-1.5 rounded-full inline-block ${
                  isConnected ? 'bg-[#10b981]' : 'bg-rose-500'
                }`}
              ></span>
              {isConnected ? 'Olimpo Online' : 'Simulación'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {onChangeView && (
          <HeaderSwitch currentView={currentView} onChangeView={onChangeView} />
        )}
        <button
          onClick={onOpenNewMember}
          className="btn-gold-olympus active:scale-95 text-[#0F1E36] text-[10px] font-cinzel font-black px-2.5 py-1.5 rounded-lg flex items-center gap-1 shadow-sm transition-all cursor-pointer"
          title="Consagrar Nuevo Atleta"
        >
          <i className="fa-solid fa-user-plus text-[9px]"></i>
          <span className="hidden xs:inline">Nuevo</span>
        </button>
      </div>
    </header>
  );
}
