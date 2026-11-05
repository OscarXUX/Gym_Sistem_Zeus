import React, { useState, useEffect } from 'react';

const QUICK_ARSENAL_BUTTONS = [
  { id: 'p1', name: 'Agua 1L', price: 20, icon: 'fa-bottle-water', color: 'text-blue-400' },
  { id: 'p2', name: 'Pre-Entreno Hype', price: 35, icon: 'fa-bolt', color: 'text-rose-500' },
  { id: 'p3', name: 'Proteína Whey', price: 30, icon: 'fa-jar', color: 'text-amber-400' },
  { id: 'p4', name: 'Electrolitos', price: 15, icon: 'fa-wine-bottle', color: 'text-purple-400' }
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
      {/* CABECERA COMPACTA CON ESTADOS TÁCTILES */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-stone-800/80 pb-3">
        <div>
          <h2 className="text-lg sm:text-2xl font-black text-white flex items-center gap-2">
            <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-red-950/70 border border-red-600/50 flex items-center justify-center text-red-500 text-xs sm:text-sm shrink-0">
              <i className="fa-solid fa-chart-pie"></i>
            </span>
            <span>Base de Operaciones</span>
          </h2>
          <p className="text-stone-400 text-[11px] sm:text-xs mt-0.5">
            Recepción GEARS • Control biométrico, corte de caja y aforo en vivo
          </p>
        </div>

        {/* ICONOS DE ESTADO RÁPIDO EN CABECERA: TV, TORNIQUETE Y CORTE (ABREN MODAL AL TOCAR) */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto flex-wrap">
          {/* Botón Estado Monitor TV */}
          <button
            type="button"
            onClick={() => setIsTvModalOpen(true)}
            className="h-9 px-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 hover:border-emerald-600/60 text-stone-300 flex items-center gap-2 cursor-pointer transition-all shadow-sm"
            title="Ver estado de la Pantalla Monitor TV"
          >
            <div className="relative">
              <i className="fa-solid fa-tv text-xs text-emerald-400"></i>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 absolute -top-0.5 -right-0.5 animate-ping"></span>
            </div>
            <span className="text-[11px] font-bold">Monitor TV</span>
          </button>

          {/* Botón Estado Torniquete / Puerta */}
          <button
            type="button"
            onClick={() => setIsTurnstileModalOpen(true)}
            className={`h-9 px-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all shadow-sm ${
              isTurnstileLocked
                ? 'bg-rose-950/60 border-rose-600 text-rose-300 shadow-rose-900/40'
                : 'bg-stone-900 hover:bg-stone-800 border-stone-800 hover:border-emerald-600/60 text-stone-300'
            }`}
            title="Ver estado del Torniquete / Puerta"
          >
            <div className="relative">
              <i className={`fa-solid ${isTurnstileLocked ? 'fa-lock text-rose-400' : 'fa-door-open text-emerald-400'} text-xs`}></i>
              <span className={`w-1.5 h-1.5 rounded-full absolute -top-0.5 -right-0.5 ${isTurnstileLocked ? 'bg-rose-500 animate-ping' : 'bg-emerald-400'}`}></span>
            </div>
            <span className="text-[11px] font-bold">
              {isTurnstileLocked ? 'Bloqueado' : 'Puerta'}
            </span>
          </button>

          {/* Botón Corte de Caja */}
          {onOpenCashCut && (
            <button
              type="button"
              onClick={onOpenCashCut}
              className="h-9 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-black text-xs flex items-center gap-1.5 shadow-md shadow-emerald-950/40 cursor-pointer transition-all"
              title="Abrir Corte de Caja"
            >
              <i className="fa-solid fa-cash-register text-xs"></i>
              <span>Corte</span>
            </button>
          )}
        </div>
      </div>

      {/* TIRA DE FECHA, HORA Y META COMPACTA (100% RESPONSIVE SIN SOBRESALIR) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 bg-[#0a0a0a] border border-stone-800/80 rounded-xl px-3 py-2 text-xs">
        <div className="flex items-center gap-2 text-stone-300 font-semibold">
          <i className="fa-regular fa-clock text-red-500 text-xs"></i>
          <span className="font-gears text-sm font-black text-white">{timeStr}</span>
          <span className="text-stone-600">•</span>
          <span className="text-[11px] text-stone-400 uppercase tracking-wider font-bold truncate">{dateStr}</span>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2 border-t sm:border-t-0 border-stone-800/60 pt-1.5 sm:pt-0">
          <span className="text-[11px] text-stone-400">
            Meta diaria: <strong className="font-gears text-white">${dailyGoal.toLocaleString('es-MX')}</strong>
          </span>
          <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            {pct}%
          </span>
        </div>
      </div>

      {/* SECCIÓN HERO: TOTAL CAJA (HERO) Y COBRAR VISITA (HERO) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
        {/* HERO 1: TOTAL EN CAJA HOY */}
        <div
          onClick={onOpenCashCut}
          className="bg-gradient-to-br from-emerald-950/40 via-stone-900/90 to-[#0a0a0a] border-2 border-emerald-600/50 hover:border-emerald-500 p-4 sm:p-5 rounded-2xl relative overflow-hidden group cursor-pointer transition-all shadow-xl shadow-emerald-950/20"
          title="Toca para ver Corte de Caja completo"
        >
          <i className="fa-solid fa-sack-dollar absolute -right-3 -bottom-3 text-7xl sm:text-8xl text-emerald-500/10 group-hover:text-emerald-500/20 transition-all pointer-events-none"></i>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] sm:text-[11px] text-emerald-400 uppercase font-black tracking-widest flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Total en Caja Hoy (SQLite)
            </span>
            <span className="text-[10px] text-stone-400 group-hover:text-emerald-400 font-bold transition-colors">
              Ver desglose <i className="fa-solid fa-chevron-right text-[9px] ml-0.5"></i>
            </span>
          </div>
          <p className="font-gears text-2xl sm:text-4xl font-black text-emerald-400 mt-1">
            ${todayCash.toLocaleString('es-MX')}
          </p>
          <div className="flex items-center gap-3 mt-3 pt-2.5 border-t border-emerald-900/40 text-[10px] text-stone-400 flex-wrap">
            <span>Membresías: <strong className="text-white">${cashBreakdown.memberships.toLocaleString('es-MX')}</strong></span>
            <span>•</span>
            <span>Visitas: <strong className="text-white">${cashBreakdown.visits.toLocaleString('es-MX')}</strong></span>
            <span>•</span>
            <span>Arsenal: <strong className="text-white">${cashBreakdown.store.toLocaleString('es-MX')}</strong></span>
          </div>
        </div>

        {/* HERO 2: COBRAR VISITA RÁPIDA (LIBERA PUERTA) */}
        <button
          type="button"
          onClick={onRegisterVisit}
          className="bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 hover:from-amber-500 hover:to-amber-800 border-2 border-amber-400 p-4 sm:p-5 rounded-2xl flex items-center justify-between gap-3 text-left transition-all active:scale-[0.98] shadow-xl shadow-amber-950/40 cursor-pointer group"
        >
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <i className="fa-solid fa-bolt text-amber-200 text-xs animate-bounce"></i>
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-amber-200">
                Cobro Rápido en 1-Toque
              </span>
            </div>
            <h3 className="font-gears text-xl sm:text-3xl font-black text-white leading-tight">
              Cobrar Visita
            </h3>
            <p className="text-xs text-amber-100 font-bold mt-1 flex items-center gap-1">
              <i className="fa-solid fa-door-open text-[11px]"></i> Registra en caja y libera torniquete
            </p>
          </div>

          <div className="shrink-0 bg-black/40 border border-amber-300/40 px-3.5 py-2.5 rounded-xl text-center group-hover:scale-105 transition-transform">
            <span className="font-gears text-xl sm:text-2xl font-black text-amber-300 block leading-none">
              +${quickVisitPrice}
            </span>
            <span className="text-[9px] font-bold text-amber-200 uppercase tracking-wider">MXN</span>
          </div>
        </button>
      </div>

      {/* TARJETAS SECUNDARIAS COMPACTAS: ACCESOS Y SOCIOS */}
      <div className="grid grid-cols-2 gap-3 w-full">
        {/* ACCESOS HOY */}
        <div className="bg-[#0a0a0a] border border-stone-800 p-3 sm:p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-[10px] text-stone-400 uppercase font-black tracking-wider">
              Accesos Hoy
            </p>
            <p className="font-gears text-xl sm:text-2xl font-black text-white mt-0.5">
              {todayEntries}
            </p>
            <span className="text-[9px] text-amber-400 font-bold block mt-0.5">
              <i className="fa-solid fa-fire mr-0.5"></i> Sincronizado
            </span>
          </div>
          <div className="flex flex-col gap-1 shrink-0">
            <button
              type="button"
              onClick={() => onAdjustCounter && onAdjustCounter(1)}
              className="w-7 h-7 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-800 flex items-center justify-center text-xs font-black cursor-pointer"
              title="Sumar 1 al contador"
            >
              +
            </button>
            <button
              type="button"
              onClick={() => onAdjustCounter && onAdjustCounter(-1)}
              className="w-7 h-7 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-800 flex items-center justify-center text-xs font-black cursor-pointer"
              title="Restar 1 al contador"
            >
              -
            </button>
          </div>
        </div>

        {/* GUERREROS REGISTRADOS */}
        <div
          onClick={() => onSwitchTab('socios')}
          className="bg-[#0a0a0a] border border-stone-800 hover:border-stone-700 p-3 sm:p-4 rounded-xl flex items-center justify-between cursor-pointer group transition-all"
          title="Ir al directorio de socios"
        >
          <div>
            <p className="text-[10px] text-stone-400 uppercase font-black tracking-wider">
              Socios Registrados
            </p>
            <p className="font-gears text-xl sm:text-2xl font-black text-white mt-0.5">
              {activeMembers}
            </p>
            <span className="text-[9px] text-rose-400 font-bold block mt-0.5 group-hover:underline">
              <i className="fa-solid fa-users mr-0.5"></i> Ver Socios
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-400 group-hover:text-white transition-colors shrink-0">
            <i className="fa-solid fa-chevron-right text-xs"></i>
          </div>
        </div>
      </div>

      {/* BARRA DE PROGRESO DE META */}
      <div className="bg-[#0a0a0a] border border-stone-800 rounded-xl p-3 sm:p-4 space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="font-gears font-black text-stone-300 uppercase flex items-center gap-1.5">
            <i className="fa-solid fa-bullseye text-red-500"></i> Progreso de Meta Diaria
          </span>
          <button
            type="button"
            onClick={onEditDailyGoal}
            className="text-[10px] bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 px-2 py-0.5 rounded font-bold cursor-pointer"
          >
            <i className="fa-solid fa-pen mr-1"></i> Editar Meta
          </button>
        </div>
        <div className="w-full h-2 bg-stone-900 rounded-full overflow-hidden border border-stone-800">
          <div
            className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-emerald-500 transition-all duration-500"
            style={{ width: `${pct}%` }}
          ></div>
        </div>
      </div>

      {/* SECCIÓN INFERIOR: RADAR RECIENTE DE ACCESOS + POS ARSENAL 1-TOQUE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 w-full">
        {/* Radar Reciente de Accesos */}
        <div className="bg-[#0a0a0a] border border-stone-800 rounded-xl p-3.5 sm:p-4 space-y-3">
          <div className="flex justify-between items-center border-b border-stone-800/80 pb-2">
            <h3 className="font-gears text-xs sm:text-sm font-black text-white uppercase flex items-center gap-2">
              <i className="fa-solid fa-tower-observation text-red-500"></i>
              Radar Reciente de Accesos
            </h3>
            <button
              onClick={() => onSwitchTab('torniquete')}
              className="text-[11px] text-red-400 font-bold hover:text-white transition-colors cursor-pointer"
            >
              Ver Torniquete <i className="fa-solid fa-arrow-right text-[10px] ml-0.5"></i>
            </button>
          </div>
          <div className="space-y-1.5">
            {(!accessFeed || accessFeed.length === 0) ? (
              <p className="text-xs text-stone-500 italic py-3 text-center">Esperando lecturas de acceso...</p>
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
                  <span className="font-gears text-[10px] shrink-0 ml-2">{entry.time}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* POS Arsenal 1-Toque */}
        <div className="bg-[#0a0a0a] border border-stone-800 rounded-xl p-3.5 sm:p-4 space-y-3">
          <div className="flex justify-between items-center border-b border-stone-800/80 pb-2">
            <h3 className="font-gears text-xs sm:text-sm font-black text-white uppercase flex items-center gap-2">
              <i className="fa-solid fa-bolt text-amber-400"></i>
              POS Arsenal (1-Toque)
            </h3>
            <button
              onClick={() => onSwitchTab('tienda')}
              className="text-[11px] text-stone-400 hover:text-white font-bold transition-colors cursor-pointer"
            >
              Ir a Tienda <i className="fa-solid fa-arrow-right text-[10px] ml-0.5"></i>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {QUICK_ARSENAL_BUTTONS.map((btn) => {
              const live = arsenalItems.find((x) => x.id === btn.id);
              const stock = live ? live.stock : 20;
              return (
                <button
                  key={btn.id}
                  type="button"
                  onClick={() => onSellProduct && onSellProduct(btn.id, btn.name, btn.price)}
                  className="bg-stone-900/80 hover:bg-stone-800 active:scale-95 border border-stone-800 hover:border-emerald-500/60 p-2.5 rounded-xl flex flex-col justify-between text-left transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <i className={`fa-solid ${btn.icon} ${btn.color} text-sm`}></i>
                    <span className="font-gears text-xs font-black text-emerald-400">${btn.price}</span>
                  </div>
                  <p className="text-xs font-bold text-white leading-tight truncate">{btn.name}</p>
                  <span className="text-[9px] text-stone-400 mt-0.5">Stock: {stock}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* MODAL ESTADO MONITOR TV (SE ABRE AL TOCAR EL ICONO SUPERIOR) */}
      {isTvModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 animate-fadeIn">
          <div className="bg-[#0a0a0a] border border-stone-800 rounded-2xl p-5 w-full max-w-md shadow-2xl relative space-y-4">
            <button
              type="button"
              onClick={() => setIsTvModalOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white text-base cursor-pointer"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-600/50 flex items-center justify-center text-emerald-400 text-lg">
                <i className="fa-solid fa-tv"></i>
              </div>
              <div>
                <h3 className="font-gears text-base font-black text-white">Monitor TV</h3>
                <p className="text-xs text-stone-400">Pantalla de Recepción (21.5")</p>
              </div>
            </div>

            <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-stone-400">Estado de Conexión:</span>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  En Línea y Sincronizado
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-stone-400">Resolución Óptima:</span>
                <span className="text-xs font-bold text-white">1080p Full HD</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-stone-400">Contenido Activo:</span>
                <span className="text-xs font-bold text-amber-400">Avisos + Cartelera</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setIsTvModalOpen(false);
                  onSwitchTab('comunicaciones');
                }}
                className="bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 py-2.5 px-3 rounded-xl text-xs font-bold cursor-pointer transition-colors text-center"
              >
                <i className="fa-solid fa-sliders mr-1 text-red-500"></i> Configurar TV
              </button>
              <button
                type="button"
                onClick={() => setIsTvModalOpen(false)}
                className="bg-red-600 hover:bg-red-500 text-white py-2.5 px-3 rounded-xl text-xs font-bold cursor-pointer transition-colors text-center"
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
          <div className="bg-[#0a0a0a] border border-stone-800 rounded-2xl p-5 w-full max-w-md shadow-2xl relative space-y-4">
            <button
              type="button"
              onClick={() => setIsTurnstileModalOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white text-base cursor-pointer"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center text-lg ${
                isTurnstileLocked
                  ? 'bg-rose-950/80 border-rose-600/50 text-rose-500'
                  : 'bg-emerald-950/80 border-emerald-600/50 text-emerald-400'
              }`}>
                <i className={`fa-solid ${isTurnstileLocked ? 'fa-lock' : 'fa-door-open'}`}></i>
              </div>
              <div>
                <h3 className="font-gears text-base font-black text-white">Torniquete & Puerta</h3>
                <p className="text-xs text-stone-400">Control Relé 2 Canales (Entrada / Salida)</p>
              </div>
            </div>

            <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-stone-400">Estado del Sistema:</span>
                <span className={`text-xs font-bold flex items-center gap-1.5 ${
                  isTurnstileLocked ? 'text-rose-400' : 'text-emerald-400'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${isTurnstileLocked ? 'bg-rose-500 animate-ping' : 'bg-emerald-400'}`}></span>
                  {isTurnstileLocked ? 'BLOQUEO ACTIVO' : 'Armado y Listo'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-stone-400">Lector Biométrico:</span>
                <span className="text-xs font-bold text-white">Canal 1 (Entrada)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-stone-400">Pulsador / Control:</span>
                <span className="text-xs font-bold text-white">Canal 2 (Salida)</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-black uppercase text-stone-400 block tracking-wider">
                Simular Lectura de Huella hacia Pantalla TV
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => onEmitScan && onEmitScan('active')}
                  className="bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800/60 text-emerald-300 text-[11px] font-bold py-2 rounded-lg cursor-pointer transition-colors"
                >
                  Activo
                </button>
                <button
                  type="button"
                  onClick={() => onEmitScan && onEmitScan('warning')}
                  className="bg-amber-950/60 hover:bg-amber-900 border border-amber-800/60 text-amber-300 text-[11px] font-bold py-2 rounded-lg cursor-pointer transition-colors"
                >
                  Aviso 3d
                </button>
                <button
                  type="button"
                  onClick={() => onEmitScan && onEmitScan('expired')}
                  className="bg-rose-950/60 hover:bg-rose-900 border border-rose-800/60 text-rose-300 text-[11px] font-bold py-2 rounded-lg cursor-pointer transition-colors"
                >
                  Vencido
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-stone-800">
              <button
                type="button"
                onClick={() => {
                  setIsTurnstileModalOpen(false);
                  onSwitchTab('torniquete');
                }}
                className="bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 py-2.5 px-3 rounded-xl text-xs font-bold cursor-pointer transition-colors text-center"
              >
                <i className="fa-solid fa-sliders mr-1 text-red-500"></i> Panel Puerta
              </button>
              <button
                type="button"
                onClick={() => setIsTurnstileModalOpen(false)}
                className="bg-red-600 hover:bg-red-500 text-white py-2.5 px-3 rounded-xl text-xs font-bold cursor-pointer transition-colors text-center"
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
