import React from 'react';

export default function MobileDrawer({ isOpen, onClose, activeTab, onSwitchTab, onOpenNewMember, isConnected }) {
  if (!isOpen) return null;

  const handleSelect = (tabId) => {
    onSwitchTab(tabId);
    onClose();
  };

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
    <div className="fixed inset-0 z-50 md:hidden animate-fadeIn">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Drawer Content */}
      <aside className="relative w-72 max-w-[84vw] bg-gradient-to-b from-[#0F1E36] via-[#142646] to-[#0F1E36] border-r-2 border-[#C5A059] h-full flex flex-col z-10 shadow-2xl">
        <div className="p-4 flex items-center justify-between border-b border-[#C5A059]/40 bg-[#091528]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#0F1E36] border border-[#C5A059] flex items-center justify-center shrink-0 shadow-inner">
              <i className="fa-solid fa-bolt-lightning text-[#D4AF37] text-sm animate-pulse"></i>
            </div>
            <div>
              <h2 className="font-cinzel font-black text-sm text-white tracking-widest leading-none">
                GYM <span className="text-[#D4AF37]">ZEUS</span>
              </h2>
              <p className="text-[9px] text-[#C5A059] font-cinzel font-bold tracking-wider uppercase mt-1">
                Olimpo Central
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#0F1E36] border border-[#C5A059]/50 text-[#F3E5AB] flex items-center justify-center cursor-pointer"
          >
            <i className="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>

        <div className="p-3">
          <button
            onClick={() => {
              onOpenNewMember();
              onClose();
            }}
            className="w-full btn-gold-olympus text-[#0F1E36] font-cinzel font-black text-xs py-2.5 rounded-lg flex items-center justify-center gap-2 shadow-md cursor-pointer"
          >
            <i className="fa-solid fa-user-plus text-xs"></i>
            <span>Nuevo Socio</span>
          </button>
        </div>

        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto scrollbar-thin">
          {navItems.map((item, idx) => {
            if (item.section) {
              return (
                <p key={idx} className="text-[#C5A059] text-[9.5px] font-cinzel font-black tracking-wider mt-3 mb-1 px-2 uppercase">
                  {item.section}
                </p>
              );
            }

            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full min-h-[42px] flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-cinzel font-bold text-left transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-gradient-to-r from-[#162A4A] to-[#1E3458] border-[#D4AF37] text-[#F3E5AB] shadow-md ring-1 ring-[#D4AF37]/50'
                    : 'text-[#F3E5AB]/70 hover:text-white hover:bg-[#162A4A]/50 border-transparent'
                }`}
              >
                <i className={`fa-solid ${item.icon} w-5 text-center text-xs ${isActive ? 'text-[#D4AF37]' : 'text-[#C5A059]'}`}></i>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-[#C5A059]/40 bg-[#091528] flex items-center gap-2.5">
          <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-[#10b981]' : 'bg-rose-500'}`}></span>
          <span className="text-[10px] font-cinzel font-bold text-[#F3E5AB]">
            {isConnected ? 'SANTUARIO ONLINE' : 'MODO SIMULACIÓN'}
          </span>
        </div>
      </aside>
    </div>
  );
}
