import React from 'react';

export default function BottomNav({ activeTab, onSwitchTab }) {
  const tabs = [
    { id: 'dashboard', label: 'Inicio', icon: 'fa-chart-pie' },
    { id: 'torniquete', label: 'Portal', icon: 'fa-door-open' },
    { id: 'socios', label: 'Atletas', icon: 'fa-bolt-lightning', isCenterMedallion: true },
    { id: 'tienda', label: 'Néctar', icon: 'fa-bag-shopping' },
    { id: 'comunicaciones', label: 'TV', icon: 'fa-tv' }
  ];

  return (
    <nav className="sticky bottom-0 md:hidden flex items-end justify-around bg-gradient-to-r from-[#0F1E36] via-[#162A4A] to-[#0F1E36] border-t-2 border-[#C5A059] px-2 pb-2 pt-1 shrink-0 z-30 shadow-2xl">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        // Botón Central: Medallón del Rayo Olímpico
        if (tab.isCenterMedallion) {
          return (
            <div key={tab.id} className="relative -mt-6 flex flex-col items-center flex-1 shrink-0">
              <button
                type="button"
                onClick={() => onSwitchTab(tab.id)}
                className="w-14 h-14 flex items-center justify-center transition-all cursor-pointer relative active:scale-95 bg-transparent p-0 border-0 outline-none"
                title="Directorio de Atletas del Olimpo"
              >
                {/* Medallón de Oro */}
                <div
                  className={`w-14 h-14 rounded-full absolute inset-0 transition-all ${
                    isActive
                      ? 'border-2 border-[#F3E5AB] bg-gradient-to-br from-[#F5D77F] via-[#D4AF37] to-[#8C6D1F] shadow-[0_0_20px_rgba(212,175,55,0.7)] animate-pulse'
                      : 'border-2 border-[#C5A059] bg-gradient-to-br from-[#D4AF37] to-[#8C6D1F] shadow-lg'
                  }`}
                ></div>

                {/* Centro con Rayo */}
                <div className="w-10 h-10 rounded-full absolute inset-2 bg-[#0F1E36] border border-[#F3E5AB]/60 flex items-center justify-center shadow-inner">
                  <i className="fa-solid fa-bolt-lightning text-lg text-[#FFD700]"></i>
                </div>
              </button>

              <span
                className={`text-[9px] font-cinzel font-black tracking-tight mt-0.5 leading-none ${
                  isActive ? 'text-[#D4AF37]' : 'text-[#F3E5AB]'
                }`}
              >
                {tab.label}
              </span>
            </div>
          );
        }

        // Botones laterales normales
        return (
          <button
            key={tab.id}
            onClick={() => onSwitchTab(tab.id)}
            className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-lg flex-1 transition-all cursor-pointer ${
              isActive
                ? 'text-[#D4AF37] font-bold'
                : 'text-[#F3E5AB]/70 hover:text-white'
            }`}
          >
            <i className={`fa-solid ${tab.icon} text-base mb-0.5 ${isActive ? 'text-[#D4AF37]' : 'text-[#C5A059]'}`}></i>
            <span className="text-[10px] font-cinzel font-bold tracking-tight">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
