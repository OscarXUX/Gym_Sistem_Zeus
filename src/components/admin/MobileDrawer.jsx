import React from 'react';
import { CrimsonOmen } from '../common/CrimsonOmenSvg';

export default function MobileDrawer({ isOpen, onClose, activeTab, onSwitchTab, onOpenNewMember, isConnected }) {
  if (!isOpen) return null;

  const handleSelect = (tabId) => {
    onSwitchTab(tabId);
    onClose();
  };

  const navItems = [
    { section: 'PRINCIPAL' },
    { id: 'dashboard', label: 'Dashboard General', icon: 'fa-chart-pie' },
    { id: 'socios', label: 'Directorio de Socios', icon: 'fa-users' },
    { id: 'guerreros_activos', label: 'Aforo en Vivo', icon: 'fa-user-check' },
    { section: 'CONTROL Y MÓDULOS' },
    { id: 'torniquete', label: 'Control Puerta / Relé', icon: 'fa-door-open' },
    { id: 'tienda', label: 'Arsenal (POS Ventas)', icon: 'fa-bag-shopping' },
    { id: 'comunicaciones', label: 'Configurar Monitor TV', icon: 'fa-tv' }
  ];

  return (
    <div className="fixed inset-0 z-50 md:hidden animate-fadeIn">
      {/* Backdrop con desenfoque */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Drawer Content */}
      <aside className="relative w-72 max-w-[84vw] bg-[#111418] border-r border-stone-800/80 h-full flex flex-col z-10 shadow-2xl">
        <div className="p-4 flex items-center justify-between border-b border-stone-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center shrink-0 shadow-inner">
              <CrimsonOmen className="w-6 h-6 text-red-500 gear-spin" />
            </div>
            <div>
              <p className="text-[10px] text-stone-400 font-bold tracking-wider uppercase">
                Panel Admin
              </p>
              <h2 className="font-gears font-black text-base leading-none text-white mt-0.5">
                GEARS <span className="text-red-500">GYM</span>
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="px-4 pt-4 pb-1">
          <button
            onClick={() => {
              onOpenNewMember();
              onClose();
            }}
            className="w-full min-h-[48px] bg-red-600 hover:bg-red-500 text-white font-bold text-sm rounded-xl border border-red-500/40 shadow-lg shadow-red-950/40 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <i className="fa-solid fa-user-plus"></i>
            <span>Nuevo Socio</span>
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-thin">
          {navItems.map((item, idx) => {
            if (item.section) {
              return (
                <p key={idx} className="text-stone-500 text-[10px] font-black tracking-wider mt-3 mb-1.5 px-2 uppercase">
                  {item.section}
                </p>
              );
            }

            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full min-h-[46px] flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-left transition-all cursor-pointer border ${
                  isActive
                    ? 'text-white bg-stone-900/90 border-stone-700/80 font-bold shadow-[0_0_12px_rgba(220,38,38,0.25)] ring-1 ring-red-500/30'
                    : 'text-stone-400 hover:text-white hover:bg-stone-900/60 border-transparent'
                }`}
              >
                <i className={`fa-solid ${item.icon} w-5 text-center ${isActive ? 'text-red-500' : 'text-stone-400'}`}></i>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-stone-800/80 bg-black/60">
          <div className="flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=100&q=80"
              alt="Comandante"
              className="w-9 h-9 rounded-full border border-stone-700 object-cover"
            />
            <div>
              <p className="text-xs font-bold text-white">Recepción GEARS</p>
              <p className="text-[10px] text-stone-400 font-medium flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full inline-block ${isConnected ? 'bg-emerald-400' : 'bg-red-500'}`}></span>
                {isConnected ? 'Sistema Conectado' : 'Modo Local'}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
