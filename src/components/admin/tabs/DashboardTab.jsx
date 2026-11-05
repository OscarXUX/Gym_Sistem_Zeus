import React, { useState, useEffect } from 'react';

const QUICK_NECTAR_BUTTONS = [
  { id: 'p1', name: 'Agua Sagrada 1L', price: 20, icon: 'fa-bottle-water', color: 'text-sky-400' },
  { id: 'p2', name: 'Rayo Divino (Pre)', price: 35, icon: 'fa-bolt-lightning', color: 'text-amber-400' },
  { id: 'p3', name: 'Ambrosía Proteica', price: 30, icon: 'fa-jar', color: 'text-blue-400' },
  { id: 'p4', name: 'Néctar Electrolitos', price: 15, icon: 'fa-wine-bottle', color: 'text-purple-400' }
];

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
  const [timeStr, setTimeStr] = useState('12:00 PM');
  const [dateStr, setDateStr] = useState('');
  const [isTvModalOpen, setIsTvModalOpen] = useState(false);
  const [isTurnstileModalOpen, setIsTurnstileModalOpen] = useState(false);

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

  const pct = Math.min(100, Math.round((todayCash / (dailyGoal || 2500)) * 100));

  return (
    <div className="w-full max-w-6xl mx-auto p-3 sm:p-5 space-y-4 animate-fadeIn overflow-x-hidden">
      {/* CABECERA COMPACTA CON ESTADOS TÁCTILES ESTILO APPLE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-800/80 pb-3">
        <div>
          <h2 className="text-lg sm:text-2xl font-black text-white flex items-center gap-2">
            <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-sky-500/15 border border-sky-400/30 flex items-center justify-center text-sky-400 text-xs sm:text-sm shrink-0 shadow-[0_0_12px_rgba(56,189,248,0.3)]">
              <i className="fa-solid fa-bolt-lightning text-amber-300"></i>
            </span>
            <span>Templo de Zeus • Olimpo Central</span>
          </h2>
          <p className="text-slate-400 text-[11px] sm:text-xs mt-0.5">
            Recepción del Olimpo • Control de acceso sagrado, corte de tesorería y aforo de atletas
          </p>
        </div>

        {/* ICONOS DE ESTADO RÁPIDO EN CABECERA: TV, PORTAL SAGRADO Y CORTE */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto flex-wrap">
          {/* Botón Estado Monitor TV */}
          <button
            type="button"
            onClick={() => setIsTvModalOpen(true)}
            className="h-9 px-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-sky-500/50 text-slate-300 flex items-center gap-2 cursor-pointer transition-all shadow-sm"
            title="Ver estado del Monitor del Olimpo (TV)"
          >
            <div className="relative">
              <i className="fa-solid fa-tv text-xs text-sky-400"></i>
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 absolute -top-0.5 -right-0.5 animate-ping"></span>
            </div>
            <span className="text-[11px] font-bold">Monitor TV</span>
          </button>

          {/* Botón Estado Torniquete / Portal */}
          <button
            type="button"
            onClick={() => setIsTurnstileModalOpen(true)}
            className={`h-9 px-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all shadow-sm ${
              isTurnstileLocked
                ? 'bg-rose-950/60 border-rose-500 text-rose-300 shadow-rose-900/40'
                : 'bg-slate-900/90 hover:bg-slate-800 border-slate-800 hover:border-emerald-500/50 text-slate-300'
            }`}
            title="Ver estado del Portal Sagrado"
          >
            <div className="relative">
              <i className={`fa-solid ${isTurnstileLocked ? 'fa-lock text-rose-400' : 'fa-door-open text-emerald-400'} text-xs`}></i>
              <span className={`w-1.5 h-1.5 rounded-full absolute -top-0.5 -right-0.5 ${isTurnstileLocked ? 'bg-rose-500 animate-ping' : 'bg-emerald-400'}`}></span>
            </div>
            <span className="text-[11px] font-bold">
              {isTurnstileLocked ? 'Bloqueado' : 'Portal'}
            </span>
          </button>

          {/* Botón Corte de Caja */}
          {onOpenCashCut && (
            <button
              type="button"
              onClick={onOpenCashCut}
              className="h-9 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-95 text-white font-black text-xs flex items-center gap-1.5 shadow-md shadow-emerald-950/40 cursor-pointer transition-all border border-emerald-400/30"
              title="Abrir Corte de Caja"
            >
              <i className="fa-solid fa-cash-register text-xs"></i>
              <span>Corte</span>
            </button>
          )}
        </div>
      </div>

      {/* TIRA DE FECHA, HORA Y META COMPACTA */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 bg-slate-900/70 border border-slate-800/80 rounded-xl px-3 py-2 text-xs backdrop-blur-md">
        <div className="flex items-center gap-2 text-slate-300 font-semibold">
          <i className="fa-regular fa-clock text-sky-400 text-xs"></i>
          <span className="font-zeus text-sm font-black text-white">{timeStr}</span>
          <span className="text-slate-600">•</span>
          <span className="text-[11px] text-slate-400 uppercase tracking-wider font-bold truncate">{dateStr}</span>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2 border-t sm:border-t-0 border-slate-800/60 pt-1.5 sm:pt-0">
          <span className="text-[11px] text-slate-400">
            Meta diaria: <strong className="font-zeus text-white">${dailyGoal.toLocaleString('es-MX')}</strong>
          </span>
          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            {pct}%
          </span>
        </div>
      </div>

      {/* SECCIÓN HERO: TOTAL CAJA (HERO) Y RAYO VELOZ (COBRAR VISITA HERO) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
        {/* HERO 1: TOTAL EN CAJA HOY */}
        <div
          onClick={onOpenCashCut}
          className="bg-gradient-to-br from-emerald-950/50 via-slate-900/90 to-[#070b14] border-2 border-emerald-500/40 hover:border-emerald-400 p-4 sm:p-5 rounded-2xl relative overflow-hidden group cursor-pointer transition-all shadow-xl shadow-emerald-950/20"
          title="Toca para ver Corte de Caja completo"
        >
          <i className="fa-solid fa-sack-dollar absolute -right-3 -bottom-3 text-7xl sm:text-8xl text-emerald-500/10 group-hover:text-emerald-500/20 transition-all pointer-events-none"></i>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] sm:text-[11px] text-emerald-400 uppercase font-black tracking-widest flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Tesorería del Olimpo Hoy (SQLite)
            </span>
            <span className="text-[10px] text-slate-400 group-hover:text-emerald-300 font-bold transition-colors">
              Ver desglose <i className="fa-solid fa-chevron-right text-[9px] ml-0.5"></i>
            </span>
          </div>
          <p className="font-zeus text-2xl sm:text-4xl font-black text-emerald-400 mt-1">
            ${todayCash.toLocaleString('es-MX')}
          </p>
          <div className="flex items-center gap-3 mt-3 pt-2.5 border-t border-emerald-900/40 text-[10px] text-slate-400 flex-wrap">
            <span>Membresías: <strong className="text-white">${cashBreakdown.memberships.toLocaleString('es-MX')}</strong></span>
            <span>•</span>
            <span>Rayos Veloz: <strong className="text-white">${cashBreakdown.visits.toLocaleString('es-MX')}</strong></span>
            <span>•</span>
            <span>Néctar & Supl: <strong className="text-white">${cashBreakdown.store.toLocaleString('es-MX')}</strong></span>
          </div>
        </div>

        {/* HERO 2: RAYO VELOZ — PASE DE VISITA ($60) */}
        <button
          type="button"
          onClick={onRegisterVisit}
          className="bg-gradient-to-br from-amber-500 via-amber-600 to-amber-800 hover:from-amber-400 hover:to-amber-700 border-2 border-amber-300/80 p-4 sm:p-5 rounded-2xl flex items-center justify-between gap-3 text-left transition-all active:scale-[0.98] shadow-xl shadow-amber-950/40 cursor-pointer group"
        >
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <i className="fa-solid fa-bolt-lightning text-amber-200 text-xs animate-bounce"></i>
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-amber-200">
                Pase de 1-Toque
              </span>
            </div>
            <h3 className="font-zeus text-xl sm:text-3xl font-black text-white leading-tight flex items-center gap-2">
              <span>Rayo Veloz — Pase de Visita</span>
            </h3>
            <p className="text-xs text-amber-100 font-bold mt-1 flex items-center gap-1">
              <i className="fa-solid fa-door-open text-[11px]"></i> Registra en caja y libera portal sagrado
            </p>
          </div>

          <div className="shrink-0 bg-black/40 border border-amber-200/50 px-3.5 py-2.5 rounded-xl text-center group-hover:scale-105 transition-transform shadow-lg">
            <span className="font-zeus text-xl sm:text-2xl font-black text-amber-300 block leading-none drop-shadow">
              +${quickVisitPrice}
            </span>
            <span className="text-[9px] font-bold text-amber-200 uppercase tracking-wider">MXN</span>
          </div>
        </button>
      </div>

      {/* TARJETAS SECUNDARIAS COMPACTAS: ACCESOS Y ATLETAS */}
      <div className="grid grid-cols-2 gap-3 w-full">
        {/* ACCESOS HOY */}
        <div className="bg-slate-900/60 border border-slate-800 p-3 sm:p-4 rounded-xl flex items-center justify-between backdrop-blur-md">
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider">
              Accesos al Santuario Hoy
            </p>
            <p className="font-zeus text-xl sm:text-2xl font-black text-white mt-0.5">
              {todayEntries}
            </p>
            <span className="text-[9px] text-sky-400 font-bold block mt-0.5">
              <i className="fa-solid fa-bolt-lightning mr-0.5 text-amber-300"></i> Sincronizado
            </span>
          </div>
          <div className="flex flex-col gap-1 shrink-0">
            <button
              type="button"
              onClick={() => onAdjustCounter && onAdjustCounter(1)}
              className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 flex items-center justify-center text-xs font-black cursor-pointer transition-colors"
              title="Sumar 1 al contador"
            >
              +
            </button>
            <button
              type="button"
              onClick={() => onAdjustCounter && onAdjustCounter(-1)}
              className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 flex items-center justify-center text-xs font-black cursor-pointer transition-colors"
              title="Restar 1 al contador"
            >
              -
            </button>
          </div>
        </div>

        {/* ATLETAS REGISTRADOS */}
        <div
          onClick={() => onSwitchTab('socios')}
          className="bg-slate-900/60 border border-slate-800 hover:border-sky-500/50 p-3 sm:p-4 rounded-xl flex items-center justify-between cursor-pointer group transition-all backdrop-blur-md"
          title="Ir al directorio de atletas"
        >
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider">
              Atletas Registrados
            </p>
            <p className="font-zeus text-xl sm:text-2xl font-black text-white mt-0.5">
              {activeMembers}
            </p>
            <span className="text-[9px] text-sky-400 font-bold block mt-0.5 group-hover:underline">
              <i className="fa-solid fa-users mr-0.5"></i> Ver Atletas
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 group-hover:text-sky-300 transition-colors shrink-0">
            <i className="fa-solid fa-chevron-right text-xs"></i>
          </div>
        </div>
      </div>

      {/* BARRA DE PROGRESO DE META */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 sm:p-4 space-y-2 backdrop-blur-md">
        <div className="flex justify-between items-center text-xs">
          <span className="font-zeus font-black text-slate-300 uppercase flex items-center gap-1.5">
            <i className="fa-solid fa-bullseye text-sky-400"></i> Progreso de Meta Sagrada Diaria
          </span>
          <button
            type="button"
            onClick={onEditDailyGoal}
            className="text-[10px] bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-colors"
          >
            <i className="fa-solid fa-pen mr-1"></i> Editar Meta
          </button>
        </div>
        <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-sky-500 via-blue-500 to-emerald-400 transition-all duration-500 shadow-[0_0_10px_rgba(56,189,248,0.5)]"
            style={{ width: `${pct}%` }}
          ></div>
        </div>
      </div>

      {/* SECCIÓN INFERIOR: PORTAL SAGRADO (REGISTRO EN VIVO) + NÉCTAR DEL OLIMPO 1-TOQUE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 w-full">
        {/* Portal Sagrado — Registro en Vivo */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 sm:p-4 space-y-3 backdrop-blur-md">
          <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
            <h3 className="font-zeus text-xs sm:text-sm font-black text-white uppercase flex items-center gap-2">
              <i className="fa-solid fa-door-open text-sky-400"></i>
              Portal Sagrado — Registro en Vivo
            </h3>
            <button
              onClick={() => onSwitchTab('torniquete')}
              className="text-[11px] text-sky-400 font-bold hover:text-sky-300 transition-colors cursor-pointer"
            >
              Ver Portal <i className="fa-solid fa-arrow-right text-[10px] ml-0.5"></i>
            </button>
          </div>
          <div className="space-y-1.5">
            {(!accessFeed || accessFeed.length === 0) ? (
              <p className="text-xs text-slate-500 italic py-3 text-center">Esperando lecturas de acceso al santuario...</p>
            ) : (
              accessFeed.slice(0, 4).map((entry, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-2 rounded-lg border text-xs ${
                    entry.isDenial
                      ? 'bg-rose-950/20 border-rose-900/40 text-rose-300'
                      : 'bg-emerald-950/20 border-emerald-900/40 text-emerald-300'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${entry.isDenial ? 'bg-rose-500' : 'bg-emerald-500'}`}></span>
                    <span className="font-bold text-white truncate">{entry.name}</span>
                  </div>
                  <span className="font-zeus text-[10px] shrink-0 ml-2">{entry.time}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Néctar del Olimpo (1-Toque) */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 sm:p-4 space-y-3 backdrop-blur-md">
          <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
            <h3 className="font-zeus text-xs sm:text-sm font-black text-white uppercase flex items-center gap-2">
              <i className="fa-solid fa-bolt-lightning text-amber-400"></i>
              Néctar del Olimpo (1-Toque)
            </h3>
            <button
              onClick={() => onSwitchTab('tienda')}
              className="text-[11px] text-sky-400 hover:text-sky-300 font-bold transition-colors cursor-pointer"
            >
              Ver Néctar <i className="fa-solid fa-arrow-right text-[10px] ml-0.5"></i>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {QUICK_NECTAR_BUTTONS.map((btn) => {
              const live = arsenalItems.find((x) => x.id === btn.id);
              const stock = live ? live.stock : 20;
              return (
                <button
                  key={btn.id}
                  type="button"
                  onClick={() => onSellProduct && onSellProduct(btn.id, btn.name, btn.price)}
                  className="bg-slate-800/80 hover:bg-slate-800 active:scale-95 border border-slate-700 hover:border-sky-400/60 p-2.5 rounded-xl flex flex-col justify-between text-left transition-all cursor-pointer shadow-sm group"
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <i className={`fa-solid ${btn.icon} ${btn.color} text-sm group-hover:scale-110 transition-transform`}></i>
                    <span className="font-zeus text-xs font-black text-emerald-400">${btn.price}</span>
                  </div>
                  <p className="text-xs font-bold text-white leading-tight truncate">{btn.name}</p>
                  <span className="text-[9px] text-slate-400 mt-0.5">Stock: {stock}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* MODAL ESTADO MONITOR TV (SE ABRE AL TOCAR EL ICONO SUPERIOR) */}
      {isTvModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 animate-fadeIn">
          <div className="bg-[#090e1a] border border-slate-800 rounded-2xl p-5 w-full max-w-md shadow-2xl relative space-y-4">
            <button
              type="button"
              onClick={() => setIsTvModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-base cursor-pointer"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-950/80 border border-sky-500/50 flex items-center justify-center text-sky-400 text-lg">
                <i className="fa-solid fa-tv"></i>
              </div>
              <div>
                <h3 className="font-zeus text-base font-black text-white">Monitor del Olimpo</h3>
                <p className="text-xs text-slate-400">Pantalla Kiosco de Recepción (21.5")</p>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Estado de Sincronización:</span>
                <span className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping"></span>
                  En Línea y Conectado
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Resolución Óptima:</span>
                <span className="text-xs font-bold text-white">1080p Full HD</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Contenido en Transmisión:</span>
                <span className="text-xs font-bold text-amber-300">Decretos + Cartelera Olímpica</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setIsTvModalOpen(false);
                  onSwitchTab('comunicaciones');
                }}
                className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 py-2.5 px-3 rounded-xl text-xs font-bold cursor-pointer transition-colors text-center"
              >
                <i className="fa-solid fa-sliders mr-1 text-sky-400"></i> Configurar TV
              </button>
              <button
                type="button"
                onClick={() => setIsTvModalOpen(false)}
                className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white py-2.5 px-3 rounded-xl text-xs font-bold cursor-pointer transition-colors text-center"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ESTADO TORNIQUETE (SE ABRE AL TOCAR EL ICONO SUPERIOR) */}
      {isTurnstileModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 animate-fadeIn">
          <div className="bg-[#090e1a] border border-slate-800 rounded-2xl p-5 w-full max-w-md shadow-2xl relative space-y-4">
            <button
              type="button"
              onClick={() => setIsTurnstileModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-base cursor-pointer"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center text-lg ${
                isTurnstileLocked
                  ? 'bg-rose-950/80 border-rose-500/50 text-rose-400'
                  : 'bg-emerald-950/80 border-emerald-500/50 text-emerald-400'
              }`}>
                <i className={`fa-solid ${isTurnstileLocked ? 'fa-lock' : 'fa-door-open'}`}></i>
              </div>
              <div>
                <h3 className="font-zeus text-base font-black text-white">Portal Sagrado del Olimpo</h3>
                <p className="text-xs text-slate-400">Relevador 2 Canales (Entrada / Salida)</p>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Estado del Sistema:</span>
                <span className={`text-xs font-bold flex items-center gap-1.5 ${
                  isTurnstileLocked ? 'text-rose-400' : 'text-emerald-400'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${isTurnstileLocked ? 'bg-rose-500 animate-ping' : 'bg-emerald-400'}`}></span>
                  {isTurnstileLocked ? 'BLOQUEO ACTIVO' : 'Armado y Listo'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Lector Biométrico:</span>
                <span className="text-xs font-bold text-white">Canal 1 (Entrada)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Pulsador / Control:</span>
                <span className="text-xs font-bold text-white">Canal 2 (Salida)</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">
                Simular Lectura de Huella hacia Monitor del Olimpo
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => onEmitScan && onEmitScan('active')}
                  className="bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/60 text-emerald-300 text-[11px] font-bold py-2 rounded-lg cursor-pointer transition-colors"
                >
                  Activo
                </button>
                <button
                  type="button"
                  onClick={() => onEmitScan && onEmitScan('warning')}
                  className="bg-amber-950/60 hover:bg-amber-900 border border-amber-500/60 text-amber-300 text-[11px] font-bold py-2 rounded-lg cursor-pointer transition-colors"
                >
                  Aviso 3d
                </button>
                <button
                  type="button"
                  onClick={() => onEmitScan && onEmitScan('expired')}
                  className="bg-rose-950/60 hover:bg-rose-900 border border-rose-500/60 text-rose-300 text-[11px] font-bold py-2 rounded-lg cursor-pointer transition-colors"
                >
                  Vencido
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setIsTurnstileModalOpen(false);
                  onSwitchTab('torniquete');
                }}
                className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 py-2.5 px-3 rounded-xl text-xs font-bold cursor-pointer transition-colors text-center"
              >
                <i className="fa-solid fa-sliders mr-1 text-sky-400"></i> Panel Portal
              </button>
              <button
                type="button"
                onClick={() => setIsTurnstileModalOpen(false)}
                className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white py-2.5 px-3 rounded-xl text-xs font-bold cursor-pointer transition-colors text-center"
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
