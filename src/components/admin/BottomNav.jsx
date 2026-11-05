import React from 'react';

export default function BottomNav({ activeTab, onSwitchTab }) {
  const tabs = [
    { id: 'dashboard', label: 'Inicio', icon: 'fa-chart-pie' },
    { id: 'torniquete', label: 'Puerta', icon: 'fa-door-open' },
    { id: 'socios', label: 'Socios', icon: 'fa-users', isCenterGear: true },
    { id: 'tienda', label: 'Arsenal', icon: 'fa-bag-shopping' },
    { id: 'comunicaciones', label: 'Monitor TV', icon: 'fa-tv' }
  ];

  return (
    <nav className="sticky bottom-0 md:hidden flex items-end justify-around backdrop-blur-md bg-[#111418]/90 border-t border-stone-800/80 px-2 pb-1.5 pt-1 shrink-0 z-30">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        // Botón Central (Socios) encerrado en Engranaje Mecánico Símétrico Sobresaliente
        if (tab.isCenterGear) {
          return (
            <div key={tab.id} className="relative -mt-6 flex flex-col items-center flex-1 shrink-0">
              <button
                type="button"
                onClick={() => onSwitchTab(tab.id)}
                className="w-16 h-16 flex items-center justify-center transition-all cursor-pointer relative active:scale-95 bg-transparent p-0 border-0 outline-none"
                title="Directorio de Socios"
              >
                {/* SVG del Engranaje Gears con 12 Dientes 100% Simétricos */}
                <svg
                  viewBox="0 0 100 100"
                  style={{
                    transformOrigin: '50% 50%',
                    animationDuration: '24s'
                  }}
                  className={`w-16 h-16 absolute inset-0 pointer-events-none transition-all origin-center ${
                    isActive
                      ? 'gear-spin drop-shadow-[0_0_12px_rgba(220,38,38,0.75)]'
                      : 'drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]'
                  }`}
                >
                  {/* Corona de 12 Dientes Mecánicos Calculados Trigonométricamente */}
                  <path
                    fill={isActive ? '#dc2626' : '#262626'}
                    stroke={isActive ? '#ef4444' : '#44403c'}
                    strokeWidth="2"
                    strokeLinejoin="round"
                    d="M44.52,15.43 L46.23,2.15 L53.77,2.15 L55.48,15.43 L62.54,17.32 L70.66,6.68 L77.19,10.44 L72.03,22.80 L77.20,27.97 L89.56,22.81 L93.32,29.34 L82.68,37.46 L84.57,44.52 L97.85,46.23 L97.85,53.77 L84.57,55.48 L82.68,62.54 L93.32,70.66 L89.56,77.19 L77.20,72.03 L72.03,77.20 L77.19,89.56 L70.66,93.32 L62.54,82.68 L55.48,84.57 L53.77,97.85 L46.23,97.85 L44.52,84.57 L37.46,82.68 L29.34,93.32 L22.81,89.56 L27.97,77.20 L22.80,72.03 L10.44,77.19 L6.68,70.66 L17.32,62.54 L15.43,55.48 L2.15,53.77 L2.15,46.23 L15.43,44.52 L17.32,37.46 L6.68,29.34 L10.44,22.81 L22.80,27.97 L27.97,22.80 L22.81,10.44 L29.34,6.68 L37.46,17.32 Z"
                  />
                  {/* Bisel Circular Interior */}
                  <circle
                    cx="50"
                    cy="50"
                    r="31"
                    fill={isActive ? '#b91c1c' : '#171717'}
                    stroke={isActive ? '#fca5a5' : '#525252'}
                    strokeWidth="2"
                  />
                  {/* Núcleo Central */}
                  <circle
                    cx="50"
                    cy="50"
                    r="23"
                    fill={isActive ? '#991b1b' : '#0a0a0a'}
                  />
                </svg>

                {/* Icono de Socios Centrado en el Núcleo */}
                <i
                  className={`fa-solid ${tab.icon} text-base sm:text-lg relative z-10 transition-transform ${
                    isActive ? 'text-white scale-110' : 'text-stone-300'
                  }`}
                ></i>
              </button>

              <span
                className={`text-[9px] font-black tracking-tight -mt-1 leading-none ${
                  isActive ? 'text-red-400 font-bold' : 'text-stone-400'
                }`}
              >
                {tab.label}
              </span>
            </div>
          );
        }

        // Botones normales
        return (
          <button
            key={tab.id}
            onClick={() => onSwitchTab(tab.id)}
            className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl flex-1 transition-all cursor-pointer ${
              isActive
                ? 'text-red-500 font-bold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <i className={`fa-solid ${tab.icon} text-base mb-0.5 ${isActive ? 'text-red-500' : 'text-stone-400'}`}></i>
            <span className="text-[10px] font-semibold tracking-tight">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
