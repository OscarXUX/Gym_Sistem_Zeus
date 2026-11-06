import React, { useState, useEffect } from 'react';

const QUICK_NECTAR_BUTTONS = [
  { id: 'p1', name: 'Agua Sagrada 1L', price: 20, icon: 'fa-bottle-water', color: 'text-sky-600' },
  { id: 'p2', name: 'Rayo Divino (Pre)', price: 35, icon: 'fa-bolt-lightning', color: 'text-amber-500' },
  { id: 'p3', name: 'Ambrosía Proteica', price: 30, icon: 'fa-jar', color: 'text-blue-600' },
  { id: 'p4', name: 'Néctar Electrolitos', price: 15, icon: 'fa-wine-bottle', color: 'text-purple-600' }
];

function LiveClockDisplay() {
  const [timeStr, setTimeStr] = useState('12:00 PM');
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }));
      setDateStr(now.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 text-slate-700 font-semibold">
      <i className="fa-regular fa-clock text-[#C5A059] text-sm"></i>
      <span className="font-cinzel text-sm font-black text-[#0F1E36]">{timeStr}</span>
      <span className="text-[#C5A059]">•</span>
      <span className="text-[11px] text-slate-600 uppercase tracking-wider font-bold truncate">{dateStr}</span>
    </div>
  );
}

export default function DashboardTab({
  todayCash = 0,
  todayEntries = 0,
  activeMembers = 0,
  dailyGoal = 2500,
  quickVisitPrice = 60,
  cashBreakdown = { memberships: 0, visits: 0, store: 0 },
  isTurnstileLocked = false,
  accessFeed = [],
  arsenalItems = [],
  onAdjustCounter,
  onRegisterVisit,
  onEditDailyGoal,
  onEmitScan,
  onSellProduct,
  onSwitchTab,
  onOpenCashCut
}) {
  const [isTvModalOpen, setIsTvModalOpen] = useState(false);
  const [isTurnstileModalOpen, setIsTurnstileModalOpen] = useState(false);

  const pct = Math.min(100, Math.round((todayCash / (dailyGoal || 2500)) * 100));

  return (
    <div className="w-full max-w-6xl mx-auto p-3 sm:p-5 space-y-4 animate-fadeIn overflow-x-hidden font-body text-slate-800">
      {/* ================================================================ */}
      {/* CABECERA TEMPLO DEL OLIMPO                                       */}
      {/* ================================================================ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-[#C5A059]/40 pb-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black font-cinzel text-[#0F1E36] flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0F1E36] to-[#162A4A] border border-[#C5A059] flex items-center justify-center text-[#D4AF37] text-sm shrink-0 shadow-md">
              <i className="fa-solid fa-bolt-lightning text-[#FFD700]"></i>
            </span>
            <span>Templo de Zeus • Olimpo Central</span>
          </h2>
          <p className="text-slate-600 text-xs mt-0.5 font-medium">
            Recepción del Olimpo • Control de acceso sagrado, corte de tesorería y aforo de atletas
          </p>
        </div>

        {/* ACCIONES DE CABECERA: TV, PORTAL SAGRADO Y CORTE */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {/* Botón Estado Monitor TV */}
          <button
            type="button"
            onClick={() => setIsTvModalOpen(true)}
            className="h-9 px-3 rounded-xl bg-[#FAF9F5] hover:bg-[#F3EFE6] border border-[#C5A059] text-[#0F1E36] flex items-center gap-2 cursor-pointer transition-all shadow-sm font-bold text-xs"
            title="Ver estado del Monitor del Olimpo (TV)"
          >
            <div className="relative">
              <i className="fa-solid fa-tv text-xs text-[#0F1E36]"></i>
              <span className="w-2 h-2 rounded-full bg-emerald-500 absolute -top-1 -right-1 animate-ping"></span>
            </div>
            <span>Monitor TV</span>
          </button>

          {/* Botón Estado Torniquete / Portal */}
          <button
            type="button"
            onClick={() => setIsTurnstileModalOpen(true)}
            className={`h-9 px-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-all shadow-sm font-bold text-xs ${
              isTurnstileLocked
                ? 'bg-rose-100 border-rose-400 text-rose-800 shadow-rose-200'
                : 'bg-[#FAF9F5] hover:bg-[#F3EFE6] border-[#C5A059] text-[#0F1E36]'
            }`}
            title="Ver estado del Portal Sagrado"
          >
            <div className="relative">
              <i className={`fa-solid ${isTurnstileLocked ? 'fa-lock text-rose-600' : 'fa-door-open text-emerald-600'} text-xs`}></i>
              <span className={`w-2 h-2 rounded-full absolute -top-1 -right-1 ${isTurnstileLocked ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'}`}></span>
            </div>
            <span>{isTurnstileLocked ? 'Bloqueado' : 'Portal Sagrado'}</span>
          </button>

          {/* Botón Corte de Caja */}
          {onOpenCashCut && (
            <button
              type="button"
              onClick={onOpenCashCut}
              className="h-9 px-4 rounded-xl btn-gold-olympus font-cinzel font-black text-xs flex items-center gap-2 cursor-pointer transition-all"
              title="Abrir Corte de Caja"
            >
              <i className="fa-solid fa-cash-register text-xs text-[#0F1E36]"></i>
              <span>Corte de Caja</span>
            </button>
          )}
        </div>
      </div>

      {/* ================================================================ */}
      {/* TIRA DE FECHA, HORA Y META COMPACTA                              */}
      {/* ================================================================ */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 bg-[#FAF9F5] border border-[#C5A059] rounded-xl px-4 py-2.5 text-xs shadow-sm">
        <LiveClockDisplay />

        <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 border-[#C5A059]/30 pt-1.5 sm:pt-0">
          <span className="text-[11px] text-slate-600">
            Meta diaria: <strong className="font-cinzel font-black text-[#0F1E36]">${dailyGoal.toLocaleString('es-MX')}</strong>
          </span>
          <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-cinzel">
            {pct}%
          </span>
        </div>
      </div>

      {/* ================================================================ */}
      {/* SECCIÓN HERO: TOTAL CAJA Y RAYO VELOZ                             */}
      {/* ================================================================ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {/* HERO 1: TOTAL EN CAJA HOY */}
        <div
          onClick={onOpenCashCut}
          className="bg-[#FAF9F5] border-2 border-[#C5A059] hover:border-[#B8860B] p-4 sm:p-5 rounded-2xl relative overflow-hidden group cursor-pointer transition-all shadow-md flex flex-col justify-between"
          title="Toca para ver Corte de Caja completo"
        >
          {/* Adorno marca de agua */}
          <i className="fa-solid fa-sack-dollar absolute -right-3 -bottom-3 text-7xl sm:text-8xl text-[#C5A059]/10 group-hover:text-[#C5A059]/20 transition-all pointer-events-none"></i>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] sm:text-[11px] text-[#0F1E36] uppercase font-black font-cinzel tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Tesorería del Olimpo Hoy (SQLite)
              </span>
              <span className="text-[10px] text-[#997A2C] group-hover:text-[#0F1E36] font-bold transition-colors flex items-center gap-1">
                Ver desglose <i className="fa-solid fa-chevron-right text-[9px]"></i>
              </span>
            </div>
            <p className="font-cinzel text-3xl sm:text-4xl font-black text-[#0F1E36] mt-1">
              ${todayCash.toLocaleString('es-MX')}
            </p>
          </div>

          <div className="flex items-center gap-3 mt-4 pt-3 border-t border-[#C5A059]/30 text-[11px] text-slate-600 flex-wrap font-medium">
            <span>Membresías: <strong className="text-[#0F1E36] font-bold">${cashBreakdown.memberships.toLocaleString('es-MX')}</strong></span>
            <span className="text-[#C5A059]">•</span>
            <span>Rayos Veloz: <strong className="text-[#0F1E36] font-bold">${cashBreakdown.visits.toLocaleString('es-MX')}</strong></span>
            <span className="text-[#C5A059]">•</span>
            <span>Néctar & Supl: <strong className="text-[#0F1E36] font-bold">${cashBreakdown.store.toLocaleString('es-MX')}</strong></span>
          </div>
        </div>

        {/* HERO 2: RAYO VELOZ — PASE DE VISITA ($60) */}
        <button
          type="button"
          onClick={onRegisterVisit}
          className="bg-gradient-to-br from-[#0F1E36] via-[#162A4A] to-[#1F3A60] hover:from-[#162A4A] hover:to-[#254675] border-2 border-[#C5A059] p-4 sm:p-5 rounded-2xl flex items-center justify-between gap-3 text-left transition-all active:scale-[0.98] shadow-lg cursor-pointer group text-white relative overflow-hidden"
        >
          {/* Relámpago de fondo */}
          <i className="fa-solid fa-bolt-lightning absolute right-24 -bottom-4 text-8xl text-amber-400/10 group-hover:text-amber-400/20 transition-all pointer-events-none"></i>

          <div className="min-w-0 z-10">
            <div className="flex items-center gap-1.5 mb-1">
              <i className="fa-solid fa-bolt-lightning text-[#FFD700] text-xs animate-bounce"></i>
              <span className="text-[10px] sm:text-[11px] font-black uppercase font-cinzel tracking-wider text-[#F3E5AB]">
                Pase de 1-Toque
              </span>
            </div>
            <h3 className="font-cinzel text-xl sm:text-2xl font-black text-white leading-tight flex items-center gap-2">
              <span>Rayo Veloz — Pase de Visita</span>
            </h3>
            <p className="text-xs text-[#F3E5AB]/90 font-medium mt-1 flex items-center gap-1.5">
              <i className="fa-solid fa-door-open text-[11px] text-[#FFD700]"></i> Registra en caja y libera portal sagrado
            </p>
          </div>

          <div className="shrink-0 bg-gradient-to-b from-[#FAF9F5] to-[#EBE7DF] border-2 border-[#C5A059] px-4 py-2.5 rounded-xl text-center group-hover:scale-105 transition-transform shadow-md z-10">
            <span className="font-cinzel text-xl sm:text-2xl font-black text-[#0F1E36] block leading-none">
              +${quickVisitPrice}
            </span>
            <span className="text-[9px] font-bold text-[#997A2C] uppercase tracking-wider block mt-0.5">MXN</span>
          </div>
        </button>
      </div>

      {/* ================================================================ */}
      {/* TARJETAS SECUNDARIAS COMPACTAS: ACCESOS Y ATLETAS                */}
      {/* ================================================================ */}
      <div className="grid grid-cols-2 gap-3 w-full">
        {/* ACCESOS HOY */}
        <div className="bg-[#FAF9F5] border border-[#C5A059] p-3.5 sm:p-4 rounded-xl flex items-center justify-between shadow-sm">
          <div>
            <p className="text-[10px] text-slate-500 uppercase font-black font-cinzel tracking-wider">
              Accesos al Santuario Hoy
            </p>
            <p className="font-cinzel text-2xl sm:text-3xl font-black text-[#0F1E36] mt-0.5">
              {todayEntries}
            </p>
            <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">
              <i className="fa-solid fa-bolt-lightning mr-1 text-[#D4AF37]"></i> Sincronizado
            </span>
          </div>
          <div className="flex flex-col gap-1 shrink-0">
            <button
              type="button"
              onClick={() => onAdjustCounter && onAdjustCounter(1)}
              className="w-7 h-7 rounded-lg bg-[#EAE7DC] hover:bg-[#DCD8CC] text-[#0F1E36] border border-[#C5A059] flex items-center justify-center text-xs font-black cursor-pointer transition-colors"
              title="Sumar 1 al contador"
            >
              +
            </button>
            <button
              type="button"
              onClick={() => onAdjustCounter && onAdjustCounter(-1)}
              className="w-7 h-7 rounded-lg bg-[#EAE7DC] hover:bg-[#DCD8CC] text-[#0F1E36] border border-[#C5A059] flex items-center justify-center text-xs font-black cursor-pointer transition-colors"
              title="Restar 1 al contador"
            >
              -
            </button>
          </div>
        </div>

        {/* ATLETAS REGISTRADOS */}
        <div
          onClick={() => onSwitchTab('socios')}
          className="bg-[#FAF9F5] border border-[#C5A059] hover:border-[#0F1E36] p-3.5 sm:p-4 rounded-xl flex items-center justify-between cursor-pointer group transition-all shadow-sm"
          title="Ir al directorio de atletas"
        >
          <div>
            <p className="text-[10px] text-slate-500 uppercase font-black font-cinzel tracking-wider">
              Atletas Registrados
            </p>
            <p className="font-cinzel text-2xl sm:text-3xl font-black text-[#0F1E36] mt-0.5">
              {activeMembers}
            </p>
            <span className="text-[10px] text-[#0F1E36] font-bold block mt-0.5 group-hover:underline">
              <i className="fa-solid fa-users mr-1 text-[#C5A059]"></i> Ver Atletas
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-[#EAE7DC] border border-[#C5A059] flex items-center justify-center text-[#0F1E36] group-hover:bg-[#0F1E36] group-hover:text-[#F3E5AB] transition-colors shrink-0">
            <i className="fa-solid fa-chevron-right text-xs"></i>
          </div>
        </div>
      </div>

      {/* ================================================================ */}
      {/* BARRA DE PROGRESO DE META                                        */}
      {/* ================================================================ */}
      <div className="bg-[#FAF9F5] border border-[#C5A059] rounded-xl p-3.5 sm:p-4 space-y-2 shadow-sm">
        <div className="flex justify-between items-center text-xs">
          <span className="font-cinzel font-black text-[#0F1E36] uppercase flex items-center gap-2">
            <i className="fa-solid fa-bullseye text-[#C5A059]"></i> Progreso de Meta Sagrada Diaria
          </span>
          <button
            type="button"
            onClick={onEditDailyGoal}
            className="text-[11px] bg-[#FAF9F5] hover:bg-[#F3EFE6] border border-[#C5A059] text-[#0F1E36] px-3 py-1 rounded-lg font-bold cursor-pointer transition-colors"
          >
            <i className="fa-solid fa-pen mr-1 text-[#997A2C]"></i> Editar Meta
          </button>
        </div>
        <div className="w-full h-2.5 bg-[#EAE7DC] rounded-full overflow-hidden border border-[#C5A059]/40">
          <div
            className="h-full bg-gradient-to-r from-[#C5A059] via-[#D4AF37] to-[#10B981] transition-all duration-500 shadow-sm"
            style={{ width: `${pct}%` }}
          ></div>
        </div>
      </div>

      {/* ================================================================ */}
      {/* SECCIÓN INFERIOR: PORTAL SAGRADO + NÉCTAR DEL OLIMPO 1-TOQUE     */}
      {/* ================================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
        {/* Portal Sagrado — Registro en Vivo */}
        <div className="bg-[#FAF9F5] border border-[#C5A059] rounded-xl p-4 space-y-3 shadow-sm">
          <div className="flex justify-between items-center border-b border-[#C5A059]/30 pb-2.5">
            <h3 className="font-cinzel text-xs sm:text-sm font-black text-[#0F1E36] uppercase flex items-center gap-2">
              <i className="fa-solid fa-door-open text-[#C5A059]"></i>
              Portal Sagrado — Registro en Vivo
            </h3>
            <button
              onClick={() => onSwitchTab('torniquete')}
              className="text-[11px] text-[#0F1E36] font-bold hover:text-[#997A2C] transition-colors cursor-pointer"
            >
              Ver Portal <i className="fa-solid fa-arrow-right text-[10px] ml-0.5"></i>
            </button>
          </div>
          <div className="space-y-1.5">
            {(!accessFeed || accessFeed.length === 0) ? (
              <p className="text-xs text-slate-500 italic py-4 text-center">Esperando lecturas de acceso al santuario...</p>
            ) : (
              accessFeed.slice(0, 4).map((entry, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-2.5 rounded-lg border text-xs ${
                    entry.isDenial
                      ? 'bg-rose-50 border-rose-300 text-rose-800'
                      : 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${entry.isDenial ? 'bg-rose-600' : 'bg-emerald-600'}`}></span>
                    <span className="font-bold text-[#0F1E36] truncate">{entry.name}</span>
                  </div>
                  <span className="font-cinzel text-[10px] font-bold text-slate-500 shrink-0 ml-2">{entry.time}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Néctar del Olimpo (1-Toque) */}
        <div className="bg-[#FAF9F5] border border-[#C5A059] rounded-xl p-4 space-y-3 shadow-sm">
          <div className="flex justify-between items-center border-b border-[#C5A059]/30 pb-2.5">
            <h3 className="font-cinzel text-xs sm:text-sm font-black text-[#0F1E36] uppercase flex items-center gap-2">
              <i className="fa-solid fa-bolt-lightning text-[#D4AF37]"></i>
              Néctar del Olimpo (1-Toque)
            </h3>
            <button
              onClick={() => onSwitchTab('tienda')}
              className="text-[11px] text-[#0F1E36] hover:text-[#997A2C] font-bold transition-colors cursor-pointer"
            >
              Ver Néctar <i className="fa-solid fa-arrow-right text-[10px] ml-0.5"></i>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {QUICK_NECTAR_BUTTONS.map((btn) => {
              const live = arsenalItems.find((x) => x.id === btn.id);
              const stock = live ? live.stock : 20;
              return (
                <button
                  key={btn.id}
                  type="button"
                  onClick={() => onSellProduct && onSellProduct(btn.id, btn.name, btn.price)}
                  className="bg-white hover:bg-[#F3EFE6] active:scale-95 border border-[#C5A059] p-3 rounded-xl flex flex-col justify-between text-left transition-all cursor-pointer shadow-sm group"
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <i className={`fa-solid ${btn.icon} ${btn.color} text-sm group-hover:scale-110 transition-transform`}></i>
                    <span className="font-cinzel text-xs font-black text-[#0F1E36]">${btn.price}</span>
                  </div>
                  <p className="text-xs font-bold text-[#0F1E36] leading-tight truncate">{btn.name}</p>
                  <span className="text-[10px] text-slate-500 mt-0.5">Stock: {stock}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ================================================================ */}
      {/* MODAL ESTADO MONITOR TV                                          */}
      {/* ================================================================ */}
      {isTvModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-3 animate-fadeIn">
          <div className="bg-[#FAF9F5] border-2 border-[#C5A059] rounded-2xl p-6 w-full max-w-md shadow-2xl relative space-y-4">
            <button
              type="button"
              onClick={() => setIsTvModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-[#0F1E36] text-base cursor-pointer"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0F1E36] to-[#162A4A] border border-[#C5A059] flex items-center justify-center text-[#D4AF37] text-lg shadow-sm">
                <i className="fa-solid fa-tv"></i>
              </div>
              <div>
                <h3 className="font-cinzel text-base font-black text-[#0F1E36]">Monitor del Olimpo</h3>
                <p className="text-xs text-slate-600">Pantalla Kiosco de Recepción (21.5")</p>
              </div>
            </div>

            <div className="bg-white border border-[#C5A059]/40 rounded-xl p-3.5 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Estado de Sincronización:</span>
                <span className="font-bold text-emerald-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  En Línea y Conectado
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Resolución Óptima:</span>
                <span className="font-bold text-[#0F1E36]">1080p Full HD</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Contenido en Transmisión:</span>
                <span className="font-bold text-[#997A2C]">Decretos + Cartelera Olímpica</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setIsTvModalOpen(false);
                  onSwitchTab('comunicaciones');
                }}
                className="bg-white hover:bg-[#F3EFE6] text-[#0F1E36] border border-[#C5A059] py-2.5 px-3 rounded-xl text-xs font-bold cursor-pointer transition-colors text-center"
              >
                <i className="fa-solid fa-sliders mr-1 text-[#997A2C]"></i> Configurar TV
              </button>
              <button
                type="button"
                onClick={() => setIsTvModalOpen(false)}
                className="btn-navy-olympus py-2.5 px-3 rounded-xl text-xs font-bold cursor-pointer transition-colors text-center"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* MODAL ESTADO TORNIQUETE                                          */}
      {/* ================================================================ */}
      {isTurnstileModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-3 animate-fadeIn">
          <div className="bg-[#FAF9F5] border-2 border-[#C5A059] rounded-2xl p-6 w-full max-w-md shadow-2xl relative space-y-4">
            <button
              type="button"
              onClick={() => setIsTurnstileModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-[#0F1E36] text-base cursor-pointer"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-xl border flex items-center justify-center text-lg ${
                isTurnstileLocked
                  ? 'bg-rose-100 border-rose-400 text-rose-700'
                  : 'bg-emerald-100 border-emerald-400 text-emerald-700'
              }`}>
                <i className={`fa-solid ${isTurnstileLocked ? 'fa-lock' : 'fa-door-open'}`}></i>
              </div>
              <div>
                <h3 className="font-cinzel text-base font-black text-[#0F1E36]">Portal Sagrado del Olimpo</h3>
                <p className="text-xs text-slate-600">Relevador 2 Canales (Entrada / Salida)</p>
              </div>
            </div>

            <div className="bg-white border border-[#C5A059]/40 rounded-xl p-3.5 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Estado del Sistema:</span>
                <span className={`font-bold flex items-center gap-1.5 ${
                  isTurnstileLocked ? 'text-rose-700' : 'text-emerald-700'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${isTurnstileLocked ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'}`}></span>
                  {isTurnstileLocked ? 'BLOQUEO ACTIVO' : 'Armado y Listo'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Lector Biométrico:</span>
                <span className="font-bold text-[#0F1E36]">Canal 1 (Entrada)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Pulsador / Control:</span>
                <span className="font-bold text-[#0F1E36]">Canal 2 (Salida)</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-black uppercase text-slate-600 block tracking-wider font-cinzel">
                Simular Lectura de Huella hacia Monitor del Olimpo
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => onEmitScan && onEmitScan('active')}
                  className="bg-emerald-100 hover:bg-emerald-200 border border-emerald-400 text-emerald-900 text-xs font-bold py-2 rounded-lg cursor-pointer transition-colors"
                >
                  Activo
                </button>
                <button
                  type="button"
                  onClick={() => onEmitScan && onEmitScan('warning')}
                  className="bg-amber-100 hover:bg-amber-200 border border-amber-400 text-amber-900 text-xs font-bold py-2 rounded-lg cursor-pointer transition-colors"
                >
                  Aviso 3d
                </button>
                <button
                  type="button"
                  onClick={() => onEmitScan && onEmitScan('expired')}
                  className="bg-rose-100 hover:bg-rose-200 border border-rose-400 text-rose-900 text-xs font-bold py-2 rounded-lg cursor-pointer transition-colors"
                >
                  Vencido
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#C5A059]/30">
              <button
                type="button"
                onClick={() => {
                  setIsTurnstileModalOpen(false);
                  onSwitchTab('torniquete');
                }}
                className="bg-white hover:bg-[#F3EFE6] text-[#0F1E36] border border-[#C5A059] py-2.5 px-3 rounded-xl text-xs font-bold cursor-pointer transition-colors text-center"
              >
                <i className="fa-solid fa-sliders mr-1 text-[#997A2C]"></i> Panel Portal
              </button>
              <button
                type="button"
                onClick={() => setIsTurnstileModalOpen(false)}
                className="btn-navy-olympus py-2.5 px-3 rounded-xl text-xs font-bold cursor-pointer transition-colors text-center"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
