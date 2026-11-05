import React from 'react';
import { ZeusEmblem } from '../common/ZeusSvg';
import HeaderSwitch from '../common/HeaderSwitch';

export default function MobileHeader({
  onToggleDrawer,
  onOpenNewMember,
  isConnected,
  currentView = 'admin',
  onChangeView
}) {
  return (
    <header className="sticky top-0 md:hidden flex items-center justify-between gap-2 px-3.5 py-2.5 backdrop-blur-md bg-[#090e1a]/90 border-b border-slate-800/80 shrink-0 z-30">
      <div className="flex items-center gap-2.5 min-w-0">
        <button
          onClick={onToggleDrawer}
          className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 flex items-center justify-center text-sm transition-colors cursor-pointer shrink-0"
          aria-label="Abrir Menú"
        >
          <i className="fa-solid fa-bars"></i>
        </button>
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-slate-900 border border-sky-500/30 flex items-center justify-center shrink-0 shadow-inner shadow-sky-950/40">
            <ZeusEmblem className="w-5 h-5 drop-shadow-[0_0_8px_rgba(56,189,248,0.6)]" />
          </div>
          <div className="min-w-0">
            <span className="font-zeus font-black text-xs text-white tracking-wider block leading-none truncate">
              ZEUS <span className="text-sky-400">GYM</span>
            </span>
            <span className="text-[9px] text-sky-400/80 font-semibold flex items-center gap-1 mt-0.5">
              <span
                className={`w-1.5 h-1.5 rounded-full inline-block ${
                  isConnected ? 'bg-emerald-400 shadow-[0_0_6px_#10b981]' : 'bg-rose-500'
                }`}
              ></span>
              {isConnected ? 'Olimpo En línea' : 'Simulación'}
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
          className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 active:scale-95 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 border border-sky-400/40 shadow-md shadow-sky-950/50 transition-all cursor-pointer"
          title="Consagrar Nuevo Atleta"
        >
          <i className="fa-solid fa-bolt-lightning text-amber-300 text-[10px]"></i>
          <span className="hidden xs:inline">Atleta</span>
        </button>
      </div>
    </header>
  );
}
