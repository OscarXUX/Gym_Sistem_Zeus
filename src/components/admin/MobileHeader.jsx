import React from 'react';
import { CrimsonOmen } from '../common/CrimsonOmenSvg';
import HeaderSwitch from '../common/HeaderSwitch';

export default function MobileHeader({
  onToggleDrawer,
  onOpenNewMember,
  isConnected,
  currentView = 'admin',
  onChangeView
}) {
  return (
    <header className="sticky top-0 md:hidden flex items-center justify-between gap-2 px-3.5 py-2.5 backdrop-blur-md bg-[#111418]/85 border-b border-stone-800/80 shrink-0 z-30">
      <div className="flex items-center gap-2.5 min-w-0">
        <button
          onClick={onToggleDrawer}
          className="w-9 h-9 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-200 flex items-center justify-center text-sm transition-colors cursor-pointer shrink-0"
          aria-label="Abrir Menú"
        >
          <i className="fa-solid fa-bars"></i>
        </button>
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center shrink-0 shadow-inner">
            <CrimsonOmen className="w-4 h-4 text-red-500 gear-spin" />
          </div>
          <div className="min-w-0">
            <span className="font-gears font-black text-xs text-white tracking-wider block leading-none truncate">
              GEARS <span className="text-red-500">GYM</span>
            </span>
            <span className="text-[9px] text-stone-400 font-semibold flex items-center gap-1 mt-0.5">
              <span
                className={`w-1.5 h-1.5 rounded-full inline-block ${
                  isConnected ? 'bg-emerald-400' : 'bg-red-500'
                }`}
              ></span>
              {isConnected ? 'En línea' : 'Local'}
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
          className="bg-red-600 hover:bg-red-500 active:scale-95 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 border border-red-500/40 shadow-md shadow-red-950/40 transition-all cursor-pointer"
          title="Nuevo Socio"
        >
          <i className="fa-solid fa-user-plus text-[10px]"></i>
          <span className="hidden xs:inline">Socio</span>
        </button>
      </div>
    </header>
  );
}
