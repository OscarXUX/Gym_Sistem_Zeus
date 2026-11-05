import React from 'react';
import { ZeusEmblem } from '../common/ZeusSvg';

export default function MobileDrawer({ isOpen, onClose, activeTab, onSwitchTab, onOpenNewMember, isConnected }) {
  if (!isOpen) return null;

  const handleSelect = (tabId) => {
    onSwitchTab(tabId);
    onClose();
  };

  const navItems = [
    { section: 'SANTUARIO PRINCIPAL' },
    { id: 'dashboard', label: 'Olimpo Central', icon: 'fa-chart-pie' },
    { id: 'socios', label: 'Directorio de Atletas', icon: 'fa-users' },
    { id: 'guerreros_activos', label: 'Aforo en Vivo (Atletas)', icon: 'fa-user-check' },
    { section: 'CONTROL & ELÍXIRES' },
    { id: 'torniquete', label: 'Portal Sagrado (Relé)', icon: 'fa-door-open' },
    { id: 'tienda', label: 'Néctar & Suplementos (POS)', icon: 'fa-bag-shopping' },
    { id: 'comunicaciones', label: 'Decretos del Olimpo (TV)', icon: 'fa-tv' }
  ];

  return (
    <div className="fixed inset-0 z-50 md:hidden animate-fadeIn">
      {/* Backdrop con desenfoque */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Drawer Content */}
      <aside className="relative w-72 max-w-[84vw] bg-[#090e1a] border-r border-slate-800/80 h-full flex flex-col z-10 shadow-2xl">
        <div className="p-4 flex items-center justify-between border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-sky-500/30 flex items-center justify-center shrink-0 shadow-inner shadow-sky-950/40">
              <ZeusEmblem className="w-6 h-6 drop-shadow-[0_0_8px_rgba(56,189,248,0.6)]" />
            </div>
            <div>
              <p className="text-[10px] text-sky-400 font-bold tracking-wider uppercase">
                Panel Olimpo
              </p>
              <h2 className="font-zeus font-black text-base leading-none text-white mt-0.5">
                ZEUS <span className="text-sky-400">GYM</span>
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
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
            className="w-full min-h-[48px] bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-sm rounded-xl border border-sky-400/40 shadow-lg shadow-sky-950/50 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <i className="fa-solid fa-bolt-lightning text-amber-300"></i>
            <span>Consagrar Atleta</span>
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-thin">
          {navItems.map((item, idx) => {
            if (item.section) {
              return (
                <p key={idx} className="text-slate-500 text-[10px] font-black tracking-wider mt-3 mb-1.5 px-2 uppercase">
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
                    ? 'text-sky-300 bg-sky-500/15 border-sky-400/30 font-bold shadow-[0_0_12px_rgba(56,189,248,0.25)] ring-1 ring-sky-400/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60 border-transparent'
                }`}
              >
                <i className={`fa-solid ${item.icon} w-5 text-center ${isActive ? 'text-sky-400' : 'text-slate-400'}`}></i>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/90">
          <div className="flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=100&q=80"
              alt="Administrador Olimpo"
              className="w-9 h-9 rounded-full border border-sky-500/40 object-cover"
            />
            <div>
              <p className="text-xs font-bold text-white">Recepción del Olimpo</p>
              <p className="text-[10px] text-sky-400/80 font-medium flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full inline-block ${isConnected ? 'bg-emerald-400 shadow-[0_0_6px_#10b981]' : 'bg-rose-500'}`}></span>
                {isConnected ? 'Santuario Conectado' : 'Modo Simulación'}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
