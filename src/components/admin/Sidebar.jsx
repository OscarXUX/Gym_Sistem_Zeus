import React, { useState } from 'react';
import { ZeusEmblem } from '../common/ZeusSvg';
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
    { section: 'SANTUARIO PRINCIPAL' },
    { id: 'dashboard', label: 'Olimpo Central', icon: 'fa-chart-pie' },
    { id: 'socios', label: 'Atletas', icon: 'fa-users' },
    { id: 'guerreros_activos', label: 'Aforo en Vivo (Atletas)', icon: 'fa-user-check' },
    { section: 'CONTROL & ELÍXIRES' },
    { id: 'torniquete', label: 'Portal Sagrado', icon: 'fa-door-open' },
    { id: 'tienda', label: 'Néctar & Suplementos', icon: 'fa-bag-shopping' },
    { id: 'comunicaciones', label: 'Decretos del Olimpo', icon: 'fa-sliders' }
  ];

  return (
    <aside
      className={`hidden md:flex flex-col bg-[#090e1a]/95 backdrop-blur-xl border-r border-slate-800/80 h-full shrink-0 z-20 transition-all duration-300 ${
        isCollapsed ? 'w-[76px]' : 'w-[240px] lg:w-[256px]'
      }`}
    >
      {/* Brand Header */}
      <div className="px-3.5 py-3 flex items-center justify-between gap-2 border-b border-slate-800/80 h-[64px]">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-slate-900 border border-sky-500/30 flex items-center justify-center shrink-0 shadow-inner shadow-sky-950/40">
            <ZeusEmblem className="w-6 h-6 drop-shadow-[0_0_10px_rgba(56,189,248,0.5)]" />
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <p className="text-[9px] text-sky-400 font-bold tracking-wider uppercase truncate">
                Olimpo Central
              </p>
              <h1 className="font-zeus font-black text-sm leading-none text-white tracking-wider mt-0.5 truncate">
                ZEUS <span className="text-sky-400">GYM</span>
              </h1>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="w-7 h-7 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
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
              className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-xs cursor-pointer transition-colors"
              title="Abrir Monitor TV"
            >
              <i className="fa-solid fa-tv text-sky-400"></i>
            </button>
          ) : (
            <div className="w-full flex items-center justify-between bg-slate-900/80 border border-slate-800/80 rounded-xl px-2.5 py-1.5 shadow-inner">
              <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">Vista</span>
              <HeaderSwitch currentView={currentView} onChangeView={onChangeView} />
            </div>
          )}
        </div>
      )}

      {/* Botón Compacto: Consagrar Atleta */}
      <div className="px-3 pt-2.5 pb-1">
        <button
          type="button"
          onClick={onOpenNewMember}
          className={`w-full py-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 active:scale-[0.99] text-white font-bold text-xs rounded-xl border border-sky-400/40 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-sky-950/50 ${
            isCollapsed ? 'px-0' : 'px-3'
          }`}
          title="Consagrar Nuevo Atleta"
        >
          <i className="fa-solid fa-bolt-lightning text-amber-300 text-xs drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]"></i>
          {!isCollapsed && <span>Consagrar Atleta</span>}
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto scrollbar-thin">
        {navItems.map((item, idx) => {
          if (item.section) {
            if (isCollapsed) {
              return <div key={idx} className="my-2 border-t border-slate-800/80"></div>;
            }
            return (
              <p
                key={idx}
                className="text-slate-500 text-[10px] font-black tracking-widest px-3 pt-2.5 pb-1 uppercase"
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
                  ? 'text-sky-300 font-bold bg-sky-500/15 border-sky-400/30 shadow-[0_0_15px_rgba(56,189,248,0.25)] ring-1 ring-sky-400/30'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60 border-transparent'
              }`}
            >
              <i
                className={`fa-solid ${item.icon} w-5 text-center text-sm ${
                  isActive ? 'text-sky-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.6)]' : 'text-slate-400'
                }`}
              ></i>
              {!isCollapsed && <span className="truncate">{item.label}</span>}
              {!isCollapsed && isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.9)]"></span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Estado del Sistema */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/80">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative shrink-0">
              <img
                src="https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=100&q=80"
                alt="Administrador Olimpo"
                className="w-8 h-8 rounded-full border border-sky-500/40 object-cover"
              />
              <span
                className={`w-2 h-2 rounded-full absolute -bottom-0.5 -right-0.5 border border-slate-900 ${
                  isConnected ? 'bg-emerald-400 shadow-[0_0_6px_#10b981]' : 'bg-rose-500'
                }`}
              ></span>
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">Recepción del Olimpo</p>
                <p className="text-[10px] text-sky-400/80 font-medium truncate">
                  {isConnected ? 'Santuario Conectado' : 'Modo Simulación'}
                </p>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <button
              onClick={() => onSwitchTab('comunicaciones')}
              className="w-7 h-7 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Decretos del Olimpo"
            >
              <i className="fa-solid fa-sliders text-xs"></i>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
