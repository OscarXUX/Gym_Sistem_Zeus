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
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-landmark-dome' },
    { id: 'socios', label: 'Socios', icon: 'fa-users' },
    { id: 'guerreros_activos', label: 'Aforo en Vivo', icon: 'fa-user-check' },
    { section: 'CONTROL Y POS' },
    { id: 'torniquete', label: 'Puerta / Relé', icon: 'fa-door-open' },
    { id: 'tienda', label: 'Néctar (POS)', icon: 'fa-bag-shopping' },
    { id: 'comunicaciones', label: 'Configurar TV', icon: 'fa-sliders' }
  ];

  return (
    <div className="hidden md:flex h-full shrink-0 z-30 select-none">
      <aside
        className={`flex flex-col bg-gradient-to-b from-[#0B1528] via-[#0F1E36] to-[#0B1528] h-full transition-all duration-300 border-r-2 border-[#C5A059] shadow-[8px_0_25px_rgba(9,18,36,0.45)] ${
          isCollapsed ? 'w-[84px]' : 'w-[248px] lg:w-[264px]'
        }`}
      >
        {/* ================================================================ */}
        {/* CABECERA ÉPICA DEL SIDEBAR: GYM ⚡ ZEUS EN RELIEVE DORADO        */}
        {/* ================================================================ */}
        <div className="px-3 pt-4 pb-3 flex flex-col items-center justify-center relative border-b border-[#C5A059]/40 bg-gradient-to-b from-[#091224] to-[#0F1E36]">
          <button
            type="button"
            onClick={() => setIsCollapsed((prev) => !prev)}
            className="absolute top-2.5 right-2.5 w-6 h-6 rounded-md bg-[#162A4A]/80 hover:bg-[#1E3458] border border-[#C5A059]/60 text-[#F3E5AB] flex items-center justify-center transition-colors cursor-pointer"
            title={isCollapsed ? 'Expandir menú' : 'Colapsar menú'}
          >
            <i
              className={`fa-solid ${
                isCollapsed ? 'fa-angles-right' : 'fa-angles-left'
              } text-[9px]`}
            ></i>
          </button>

          {isCollapsed ? (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#162A4A] to-[#0B1528] border-2 border-[#D4AF37] flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.4)] mt-4">
              <i className="fa-solid fa-bolt-lightning text-[#FFD700] text-lg"></i>
            </div>
          ) : (
            <div className="text-center flex flex-col items-center">
              <div className="flex items-center justify-center gap-1 leading-none">
                <span className="font-cinzel font-black text-base tracking-[0.2em] text-gold-gradient">
                  GYM
                </span>
                <i className="fa-solid fa-bolt-lightning text-[#FFD700] text-base drop-shadow-[0_0_8px_rgba(255,215,0,0.85)]"></i>
              </div>
              <h1 className="font-cinzel font-black text-3xl tracking-[0.12em] text-gold-gradient leading-none mt-0.5">
                ZEUS
              </h1>
            </div>
          )}
        </div>

        {/* ================================================================ */}
        {/* TARJETA DE MÁRMOL PARA SELECTOR DE VISTA (ADMIN / TV)            */}
        {/* ================================================================ */}
        {onChangeView && (
          <div className="px-3 py-2.5 bg-[#0B1528]">
            {isCollapsed ? (
              <button
                type="button"
                onClick={() => onChangeView('monitor')}
                className="w-full py-2 rounded-xl olympus-card--marble text-[#0F1E36] flex items-center justify-center text-xs cursor-pointer transition-transform hover:scale-105"
                title="Abrir Monitor TV"
              >
                <i className="fa-solid fa-tv text-[#0F1E36]"></i>
              </button>
            ) : (
              <div className="w-full olympus-card--marble rounded-xl px-3 py-2 flex items-center justify-between">
                <span className="text-[11px] font-cinzel font-black text-[#0F1E36] uppercase tracking-wider">
                  VISTA
                </span>
                <HeaderSwitch currentView={currentView} onChangeView={onChangeView} />
              </div>
            )}
          </div>
        )}

        {/* ================================================================ */}
        {/* PÓRTICO DE NAVEGACIÓN FLANQUEADO POR 2 COLUMNAS JÓNICAS 3D       */}
        {/* ================================================================ */}
        <div className="flex-1 min-h-0 flex flex-row items-stretch relative overflow-hidden">
          {/* Columna Griega Izquierda con Sombra Proyectada */}
          <GreekColumn
            size="sm"
            side="left"
            width={isCollapsed ? 'w-2' : 'w-3.5 sm:w-4'}
            className="h-full shrink-0"
          />

          {/* Cuerpo Central del Menú */}
          <div className="flex-1 min-w-0 flex flex-col justify-between bg-gradient-to-b from-[#0F1E36] via-[#142646] to-[#0B1528] overflow-y-auto scrollbar-thin">
            <div>
              {/* Botón Primario: Nuevo Socio */}
              <div className="px-2.5 pt-2.5 pb-1">
                <button
                  type="button"
                  onClick={onOpenNewMember}
                  className={`w-full py-2 btn-gold-olympus text-xs rounded-lg flex items-center justify-center gap-2 cursor-pointer ${
                    isCollapsed ? 'px-0' : 'px-3'
                  }`}
                  title="Consagrar Nuevo Atleta"
                >
                  <i className="fa-solid fa-user-plus text-xs"></i>
                  {!isCollapsed && <span>Nuevo Socio</span>}
                </button>
              </div>

              {/* Lista de Secciones del Templo */}
              <nav className="px-2 py-2 space-y-1">
                {navItems.map((item, idx) => {
                  if (item.section) {
                    if (isCollapsed) {
                      return (
                        <div key={idx} className="my-2 border-t border-[#C5A059]/35"></div>
                      );
                    }
                    return (
                      <div
                        key={idx}
                        className="pt-2 pb-1 px-2 border-b border-[#C5A059]/30 mb-1"
                      >
                        <p className="text-[#D4AF37] text-[9.5px] font-cinzel font-black tracking-[0.14em] uppercase">
                          {item.section}
                        </p>
                      </div>
                    );
                  }

                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onSwitchTab(item.id)}
                      title={isCollapsed ? item.label : undefined}
                      className={`w-full min-h-[38px] flex items-center gap-2.5 px-2.5 py-2 text-xs sm:text-[13px] rounded-lg transition-all cursor-pointer font-body font-bold border ${
                        isCollapsed ? 'justify-center' : 'text-left'
                      } ${
                        isActive
                          ? 'bg-gradient-to-r from-[#1E3458] via-[#162A4A] to-[#0F1E36] border-[#D4AF37] text-white shadow-[0_4px_12px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.2)]'
                          : 'text-slate-200/85 hover:text-white hover:bg-[#162A4A]/60 border-transparent'
                      }`}
                    >
                      <i
                        className={`fa-solid ${item.icon} w-4 text-center text-xs ${
                          isActive ? 'text-[#FFD700]' : 'text-[#C5A059]'
                        }`}
                      ></i>
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
                      {!isCollapsed && isActive && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#FFD700] shadow-[0_0_8px_#FFD700]"></span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Pie de Estado de Conexión dentro del pórtico */}
            <div className="p-2.5 border-t border-[#C5A059]/35 bg-[#091224]/90 flex items-center justify-center sm:justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isConnected
                      ? 'bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.85)]'
                      : 'bg-[#EF4444]'
                  }`}
                ></span>
                {!isCollapsed && (
                  <span className="text-[9.5px] font-cinzel font-bold text-[#F3E5AB] tracking-wider">
                    {isConnected ? 'OLIMPO ONLINE' : 'OFFLINE'}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Columna Griega Derecha con Sombra Proyectada */}
          <GreekColumn
            size="sm"
            side="right"
            width={isCollapsed ? 'w-2' : 'w-3.5 sm:w-4'}
            className="h-full shrink-0"
          />
        </div>
      </aside>
    </div>
  );
}
