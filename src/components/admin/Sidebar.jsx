import React, { useState } from 'react';
import { CrimsonOmen } from '../common/CrimsonOmenSvg';
import HeaderSwitch from '../common/HeaderSwitch';

export default function Sidebar({
  activeTab,
  onSwitchTab,
  onOpenNewMember,
  isConnected,
  currentView = 'admin',
  onChangeView
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { section: 'PRINCIPAL' },
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-pie' },
    { id: 'socios', label: 'Socios', icon: 'fa-users' },
    { id: 'guerreros_activos', label: 'Aforo en Vivo', icon: 'fa-user-check' },
    { section: 'CONTROL Y POS' },
    { id: 'torniquete', label: 'Puerta / Relé', icon: 'fa-door-open' },
    { id: 'tienda', label: 'Arsenal (POS)', icon: 'fa-bag-shopping' },
    { id: 'comunicaciones', label: 'Configurar TV', icon: 'fa-sliders' }
  ];

  return (
    <aside
      className={`hidden md:flex flex-col bg-[#0c0e12]/95 backdrop-blur-xl border-r border-stone-800/80 h-full shrink-0 z-20 transition-all duration-300 ${
        isCollapsed ? 'w-[76px]' : 'w-[240px] lg:w-[256px]'
      }`}
    >
      {/* Brand Header */}
      <div className="px-3.5 py-3 flex items-center justify-between gap-2 border-b border-stone-800/80 h-[64px]">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center shrink-0 shadow-inner">
            <CrimsonOmen className="w-5 h-5 text-red-500 gear-spin" />
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <p className="text-[9px] text-stone-400 font-bold tracking-wider uppercase truncate">
                Recepción
              </p>
              <h1 className="font-gears font-black text-sm leading-none text-white tracking-wider mt-0.5 truncate">
                GEARS <span className="text-red-500">GYM</span>
              </h1>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="w-7 h-7 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
          title={isCollapsed ? 'Expandir menú' : 'Colapsar menú'}
        >
          <i className={`fa-solid ${isCollapsed ? 'fa-angles-right' : 'fa-angles-left'} text-[11px]`}></i>
        </button>
      </div>

      {/* Selector compacto de Vista (Admin / Monitor TV) integrado sin tapar nada */}
      {onChangeView && (
        <div className="px-3 pt-3 flex justify-center">
          {isCollapsed ? (
            <button
              type="button"
              onClick={() => onChangeView('monitor')}
              className="w-full py-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-400 hover:text-white flex items-center justify-center text-xs cursor-pointer transition-colors"
              title="Abrir Monitor TV"
            >
              <i className="fa-solid fa-tv"></i>
            </button>
          ) : (
            <div className="w-full flex items-center justify-between bg-stone-900/80 border border-stone-800/80 rounded-xl px-2.5 py-1.5 shadow-inner">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Vista</span>
              <HeaderSwitch currentView={currentView} onChangeView={onChangeView} />
            </div>
          )}
        </div>
      )}

      {/* Botón Compacto: Nuevo Socio */}
      <div className="px-3 pt-2.5 pb-1">
        <button
          type="button"
          onClick={onOpenNewMember}
          className={`w-full py-2 bg-red-600 hover:bg-red-500 active:scale-[0.99] text-white font-bold text-xs rounded-xl border border-red-500/40 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-red-950/50 ${
            isCollapsed ? 'px-0' : 'px-3'
          }`}
          title="Registrar Nuevo Socio"
        >
          <i className="fa-solid fa-user-plus text-xs"></i>
          {!isCollapsed && <span>Nuevo Socio</span>}
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto scrollbar-thin">
        {navItems.map((item, idx) => {
          if (item.section) {
            if (isCollapsed) {
              return <div key={idx} className="my-2 border-t border-stone-800/80"></div>;
            }
            return (
              <p
                key={idx}
                className="text-stone-500 text-[10px] font-black tracking-widest px-3 pt-2.5 pb-1 uppercase"
              >
                {item.section}
              </p>
            );
          }

          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSwitchTab(item.id)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full min-h-[42px] flex items-center gap-3 px-3 py-2 text-xs sm:text-sm rounded-xl transition-all cursor-pointer border ${
                isCollapsed ? 'justify-center' : 'text-left'
              } ${
                isActive
                  ? 'text-white font-bold bg-stone-900/90 border-stone-700/80 shadow-[0_0_12px_rgba(220,38,38,0.25)] ring-1 ring-red-500/30'
                  : 'text-stone-400 hover:text-stone-100 hover:bg-stone-900/60 border-transparent'
              }`}
            >
              <i
                className={`fa-solid ${item.icon} w-5 text-center text-sm ${
                  isActive ? 'text-red-500' : 'text-stone-400'
                }`}
              ></i>
              {!isCollapsed && <span className="truncate">{item.label}</span>}
              {!isCollapsed && isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(220,38,38,0.8)]"></span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Estado del Sistema */}
      <div className="p-3 border-t border-stone-800/80 bg-black/60">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative shrink-0">
              <img
                src="https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=100&q=80"
                alt="Admin"
                className="w-8 h-8 rounded-full border border-stone-700 object-cover"
              />
              <span
                className={`w-2 h-2 rounded-full absolute -bottom-0.5 -right-0.5 border border-stone-900 ${
                  isConnected ? 'bg-emerald-400' : 'bg-red-500'
                }`}
              ></span>
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">Recepción</p>
                <p className="text-[10px] text-stone-400 font-medium truncate">
                  {isConnected ? 'Sincronizado' : 'Modo local'}
                </p>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <button
              onClick={() => onSwitchTab('comunicaciones')}
              className="w-7 h-7 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Configurar Monitor TV"
            >
              <i className="fa-solid fa-sliders text-xs"></i>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
