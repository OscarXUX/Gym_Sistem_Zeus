import React, { useState } from 'react';
import HeaderSwitch from '../common/HeaderSwitch';
import { GreekColumn } from '../common/GreekTempleComponents';

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
    { id: 'tienda', label: 'Néctar (POS)', icon: 'fa-bag-shopping' },
    { id: 'comunicaciones', label: 'Configurar TV', icon: 'fa-sliders' }
  ];

  return (
    <div className="hidden md:flex h-full shrink-0 z-20">
      <aside
        className={`flex flex-col bg-gradient-to-b from-[#0F1E36] via-[#142646] to-[#0F1E36] h-full transition-all duration-300 shadow-2xl ${
          isCollapsed ? 'w-[76px]' : 'w-[230px] lg:w-[250px]'
        }`}
      >
        {/* Brand Header */}
        <div className="px-3.5 py-3 flex items-center justify-between gap-2 border-b border-[#C5A059]/40 h-[64px] bg-[#091528]">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#162A4A] to-[#0F1E36] border border-[#C5A059] flex items-center justify-center shrink-0 shadow-md">
              <i className="fa-solid fa-bolt-lightning text-[#D4AF37] text-sm animate-pulse"></i>
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <h1 className="font-cinzel font-black text-sm text-white tracking-widest leading-none truncate flex items-center gap-1">
                  GYM <span className="text-[#D4AF37]">ZEUS</span>
                </h1>
                <p className="text-[9px] text-[#C5A059] font-cinzel font-bold tracking-wider uppercase mt-1">
                  Olimpo Central
                </p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsCollapsed((prev) => !prev)}
            className="w-7 h-7 rounded-lg bg-[#0F1E36] hover:bg-[#162A4A] border border-[#C5A059]/50 text-[#F3E5AB] flex items-center justify-center transition-colors cursor-pointer shrink-0"
            title={isCollapsed ? 'Expandir menú' : 'Colapsar menú'}
          >
            <i className={`fa-solid ${isCollapsed ? 'fa-angles-right' : 'fa-angles-left'} text-[10px]`}></i>
          </button>
        </div>

        {/* Selector de Vista (Admin / TV) */}
        {onChangeView && (
          <div className="px-3 pt-3 flex justify-center">
            {isCollapsed ? (
              <button
                type="button"
                onClick={() => onChangeView('monitor')}
                className="w-full py-2 rounded-xl bg-[#091528] hover:bg-[#162A4A] border border-[#C5A059] text-[#F3E5AB] flex items-center justify-center text-xs cursor-pointer transition-colors"
                title="Abrir Monitor TV"
              >
                <i className="fa-solid fa-tv text-[#D4AF37]"></i>
              </button>
            ) : (
              <div className="w-full flex items-center justify-between bg-[#091528] border border-[#C5A059]/70 rounded-xl px-2.5 py-1.5 shadow-inner">
                <span className="text-[10px] font-cinzel font-black text-[#D4AF37] uppercase tracking-wider">
                  VISTA
                </span>
                <HeaderSwitch currentView={currentView} onChangeView={onChangeView} />
              </div>
            )}
          </div>
        )}

        {/* Botón Primario: Consagrar Atleta */}
        <div className="px-3 pt-2.5 pb-1">
          <button
            type="button"
            onClick={onOpenNewMember}
            className={`w-full py-2 btn-gold-olympus active:scale-[0.99] text-[#0F1E36] font-cinzel font-black text-xs rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-md ${
              isCollapsed ? 'px-0' : 'px-3'
            }`}
            title="Registrar Nuevo Socio"
          >
            <i className="fa-solid fa-user-plus text-xs"></i>
            {!isCollapsed && <span>Nuevo Socio</span>}
          </button>
        </div>

        {/* Navegación del Templo */}
        <nav className="flex-1 px-2.5 py-2 space-y-1 overflow-y-auto scrollbar-thin">
          {navItems.map((item, idx) => {
            if (item.section) {
              if (isCollapsed) {
                return <div key={idx} className="my-2 border-t border-[#C5A059]/30"></div>;
              }
              return (
                <p
                  key={idx}
                  className="text-[#C5A059] text-[9.5px] font-cinzel font-black tracking-widest px-3 pt-2 pb-0.5 uppercase"
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
                className={`w-full min-h-[38px] flex items-center gap-3 px-3 py-2 text-xs sm:text-sm rounded-lg transition-all cursor-pointer font-cinzel font-bold border ${
                  isCollapsed ? 'justify-center' : 'text-left'
                } ${
                  isActive
                    ? 'bg-gradient-to-r from-[#162A4A] to-[#1E3458] border-[#D4AF37] text-[#F3E5AB] shadow-md ring-1 ring-[#D4AF37]/50'
                    : 'text-[#F3E5AB]/70 hover:text-white hover:bg-[#162A4A]/50 border-transparent'
                }`}
              >
                <i
                  className={`fa-solid ${item.icon} w-5 text-center text-xs ${
                    isActive ? 'text-[#D4AF37]' : 'text-[#C5A059]'
                  }`}
                ></i>
                {!isCollapsed && <span className="truncate">{item.label}</span>}
                {!isCollapsed && isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#D4AF37] shadow-[0_0_8px_rgba(212,175,55,0.9)]"></span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Pie de Sidebar: Estado de Conexión */}
        <div className="p-3 border-t border-[#C5A059]/40 bg-[#091528] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-[#10b981] shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-rose-500'
              }`}
            ></span>
            {!isCollapsed && (
              <span className="text-[10px] font-cinzel font-bold text-[#F3E5AB]">
                {isConnected ? 'SANTUARIO ONLINE' : 'OFFLINE'}
              </span>
            )}
          </div>
        </div>
      </aside>

      {/* COLUMNA GRIEGA VERTICAL REAL FLANQUEANDO EL SIDEBAR (RÉPLICA DE LA IMAGEN 2) */}
      <GreekColumn size="md" width="w-3.5 sm:w-4.5" className="h-full border-r border-[#C5A059]/60 shadow-lg" />
    </div>
  );
}
