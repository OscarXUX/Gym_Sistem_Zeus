import React from 'react';

export default function BottomNav({ activeTab, onSwitchTab }) {
  const tabs = [
    { id: 'dashboard', label: 'Inicio', icon: 'fa-chart-pie' },
    { id: 'torniquete', label: 'Portal', icon: 'fa-door-open' },
    { id: 'socios', label: 'Atletas', icon: 'fa-bolt-lightning', isCenterMedallion: true },
    { id: 'tienda', label: 'Néctar', icon: 'fa-bag-shopping' },
    { id: 'comunicaciones', label: 'Decretos', icon: 'fa-tv' }
  ];

  return (
    <nav className="sticky bottom-0 md:hidden flex items-end justify-around backdrop-blur-md bg-[#090e1a]/95 border-t border-slate-800/80 px-2 pb-1.5 pt-1 shrink-0 z-30">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        // Botón Central: Medallón del Rayo Olímpico (Olympian Lightning Aegis Medallion)
        if (tab.isCenterMedallion) {
          return (
            <div key={tab.id} className="relative -mt-6 flex flex-col items-center flex-1 shrink-0">
              <button
                type="button"
                onClick={() => onSwitchTab(tab.id)}
                className="w-16 h-16 flex items-center justify-center transition-all cursor-pointer relative active:scale-95 bg-transparent p-0 border-0 outline-none group"
                title="Directorio de Atletas del Olimpo"
              >
                {/* Halo Celestial Pulsante */}
                <div
                  className={`w-16 h-16 rounded-full absolute inset-0 transition-all pointer-events-none ${
                    isActive
                      ? 'border-2 border-sky-400/80 bg-gradient-to-tr from-sky-950 via-slate-900 to-amber-950/80 shadow-[0_0_24px_rgba(56,189,248,0.5)] ring-2 ring-sky-400/40 animate-pulse'
                      : 'border-2 border-sky-500/30 bg-slate-900/90 shadow-[0_4px_12px_rgba(0,0,0,0.8)]'
                  }`}
                ></div>

                {/* Aro Sagrado Interior */}
                <div className="w-12 h-12 rounded-full absolute inset-2 border border-amber-400/40 bg-gradient-to-br from-sky-900/40 to-slate-950 flex items-center justify-center shadow-inner">
                  {/* Rayo Divino de Zeus en Oro Brillante */}
                  <i
                    className={`fa-solid fa-bolt-lightning text-xl relative z-10 transition-transform ${
                      isActive
                        ? 'text-amber-300 scale-110 drop-shadow-[0_0_12px_rgba(251,191,36,0.9)]'
                        : 'text-amber-400/80 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]'
                    }`}
                  ></i>
                </div>
              </button>

              <span
                className={`text-[9px] font-black tracking-tight -mt-1 leading-none ${
                  isActive ? 'text-sky-400 font-bold drop-shadow' : 'text-slate-400'
                }`}
              >
                {tab.label}
              </span>
            </div>
          );
        }

        // Botones laterales normales estilo Apple cápsula
        return (
          <button
            key={tab.id}
            onClick={() => onSwitchTab(tab.id)}
            className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl flex-1 transition-all cursor-pointer ${
              isActive
                ? 'text-sky-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <i className={`fa-solid ${tab.icon} text-base mb-0.5 ${isActive ? 'text-sky-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.6)]' : 'text-slate-400'}`}></i>
            <span className="text-[10px] font-semibold tracking-tight">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
