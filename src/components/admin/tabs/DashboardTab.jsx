import React, { useState, useEffect } from 'react';
import { OlympusCard, TempleFrame } from '../../common/GreekTempleComponents';

const QUICK_NECTAR_BUTTONS = [
  {
    id: 'p1',
    name: 'Agua Sagrada 1L',
    price: 20,
    icon: 'fa-bottle-water',
    iconBg: 'bg-gradient-to-br from-[#0284C7] to-[#0369A1] border-[#38BDF8] text-white'
  },
  {
    id: 'p2',
    name: 'Rayo Divino (Pre)',
    price: 35,
    icon: 'fa-bolt-lightning',
    iconBg: 'bg-gradient-to-br from-[#E11D48] to-[#9F1239] border-[#FB7185] text-white'
  },
  {
    id: 'p3',
    name: 'Ambrosía Proteica',
    price: 30,
    icon: 'fa-jar',
    iconBg: 'bg-gradient-to-br from-[#D4AF37] to-[#997A2C] border-[#F3E5AB] text-[#0B1528]'
  },
  {
    id: 'p4',
    name: 'Néctar Electrolitos',
    price: 15,
    icon: 'fa-wine-bottle',
    iconBg: 'bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] border-[#C4B5FD] text-white'
  }
];

function LiveClockDisplay() {
  const [timeStr, setTimeStr] = useState('12:00 PM');
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }));
      setDateStr(
        now.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 text-slate-700 font-semibold">
      <div className="w-6 h-6 rounded-full bg-[#0F1E36] border border-[#D4AF37] flex items-center justify-center text-[#F3E5AB] text-[10px] shadow-inner">
        <i className="fa-regular fa-clock"></i>
      </div>
      <span className="font-cinzel text-sm font-black text-[#0F1E36]">{timeStr}</span>
      <span className="text-[#C5A059]">•</span>
      <span className="text-[11px] text-slate-600 uppercase tracking-wider font-bold truncate">
        {dateStr}
      </span>
    </div>
  );
}

export default function DashboardTab({
  todayCash = 0,
  todayEntries = 0,
  activeMembers = 0,
  members = [],
  dailyGoal = 2500,
  quickVisitPrice = 60,
  cashBreakdown = { memberships: 0, visits: 0, store: 0 },
  isTurnstileLocked = false,
  isDoorOpen = false,
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
  const expiringOrExpiredCount = Array.isArray(members)
    ? members.filter((m) => m.status === 'warning' || m.status === 'expired' || m.days <= 3).length
    : 2;

  return (
    <div className="w-full max-w-6xl mx-auto p-3 sm:p-5 space-y-4 animate-fadeIn overflow-x-hidden font-body text-[#0F1E36]">
      {/* ================================================================ */}
      {/* CABECERA TEMPLO DEL OLIMPO                                       */}
      {/* ================================================================ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-[#C5A059]/60 pb-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black font-cinzel text-[#0F1E36] flex items-center gap-2.5">
            <span
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0B1528] via-[#162A4A] to-[#0F1E36] border-2 border-[#D4AF37] flex items-center justify-center text-[#FFD700] text-sm shrink-0"
              style={{
                boxShadow:
                  '0 6px 14px rgba(9,18,36,0.3), inset 0 2px 4px rgba(255,255,255,0.2)'
              }}
            >
              <i className="fa-solid fa-bolt-lightning"></i>
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
            className="h-9 px-3.5 rounded-xl olympus-card--marble hover:border-[#D4AF37] text-[#0F1E36] flex items-center gap-2 cursor-pointer transition-all font-bold text-xs active:translate-y-0.5"
            title="Ver estado del Monitor del Olimpo (TV)"
          >
            <div className="relative">
              <i className="fa-solid fa-tv text-xs text-[#0F1E36]"></i>
              <span className="w-2 h-2 rounded-full bg-[#10B981] absolute -top-1 -right-1 animate-ping"></span>
            </div>
            <span>Monitor TV</span>
          </button>

          {/* Botón Estado Torniquete / Portal Polimórfico */}
          <button
            type="button"
            onClick={() => setIsTurnstileModalOpen(true)}
            data-biometric-state={
              isTurnstileLocked ? 'denied' : isDoorOpen ? 'granted' : 'idle'
            }
            className={`h-9 px-3.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all font-bold text-xs active:translate-y-0.5 ${
              isTurnstileLocked
                ? 'bg-rose-100 border-rose-500 text-rose-900'
                : 'olympus-card--marble text-[#0F1E36]'
            }`}
            title="Ver estado del Portal Sagrado"
          >
            <div className="relative">
              <i
                className={`fa-solid ${
                  isTurnstileLocked
                    ? 'fa-lock text-rose-600'
                    : 'fa-door-open text-[#0D9488]'
                } text-xs`}
              ></i>
              <span
                className={`w-2 h-2 rounded-full absolute -top-1 -right-1 ${
                  isTurnstileLocked ? 'bg-rose-500 animate-ping' : 'bg-[#10B981]'
                }`}
              ></span>
            </div>
            <span>{isTurnstileLocked ? 'Bloqueado' : 'Portal Sagrado'}</span>
          </button>

          {/* Botón Táctil 3D Corte de Caja */}
          {onOpenCashCut && (
            <button
              type="button"
              onClick={onOpenCashCut}
              className="h-9 px-4 rounded-xl btn-gold-olympus text-xs flex items-center gap-2 cursor-pointer"
              title="Abrir Corte de Caja"
            >
              <i className="fa-solid fa-cash-register text-xs text-[#0B1528]"></i>
              <span>Corte de Caja</span>
            </button>
          )}
        </div>
      </div>

      {/* ================================================================ */}
      {/* TIRA DE FECHA, HORA Y META COMPACTA (.olympus-card--marble)      */}
      {/* ================================================================ */}
      <OlympusCard
        variant="marble"
        className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 px-4 py-2.5 text-xs"
      >
        <LiveClockDisplay />

        <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 border-[#C5A059]/35 pt-1.5 sm:pt-0">
          <span className="text-[11px] text-slate-600 font-semibold">
            Meta diaria:{' '}
            <strong className="font-cinzel font-black text-[#0F1E36]">
              ${dailyGoal.toLocaleString('es-MX')}
            </strong>
          </span>
          <span className="text-[10.5px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#0D9488] border border-emerald-400 font-cinzel shadow-xs">
            {pct}%
          </span>
        </div>
      </OlympusCard>

      {/* ================================================================ */}
      {/* PILAR 5.1: 4 TARJETAS KPI EN MÁRMOL CON BORDE SUPERIOR DORADO    */}
      {/* E ÍCONO EN MEDALLÓN CON SOMBRA INTERNA                           */}
      {/* ================================================================ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5 w-full">
        {/* KPI 1: Ingresos en Caja Hoy */}
        <OlympusCard
          variant="marble"
          onClick={onOpenCashCut}
          className="border-t-[3.5px] border-t-[#D4AF37] p-3.5 sm:p-4 flex items-center justify-between gap-2 cursor-pointer hover:-translate-y-0.5"
          title="Ver desglose de ingresos en tesorería"
        >
          <div className="min-w-0">
            <p className="text-[10px] text-slate-600 uppercase font-black font-cinzel tracking-wider truncate">
              Ingresos Hoy
            </p>
            <p className="font-cinzel text-2xl sm:text-3xl font-black text-[#0F1E36] mt-0.5 leading-none">
              ${todayCash.toLocaleString('es-MX')}
            </p>
            <span
              className="text-[10px] font-extrabold block mt-1.5"
              style={{ color: '#0D9488' }}
            >
              <i className="fa-solid fa-circle-check mr-1"></i>Corte SQLite Activo
            </span>
          </div>
          {/* Ícono en Medallón con Sombra Interna */}
          <div
            className="w-11 h-11 rounded-full bg-gradient-to-br from-[#FFFFFF] via-[#F4F2EB] to-[#DFD9C8] border-2 border-[#D4AF37] flex items-center justify-center text-[#0F1E36] shrink-0"
            style={{
              boxShadow:
                'inset 0 3px 6px rgba(15,30,54,0.22), 0 4px 10px rgba(212,175,55,0.3)'
            }}
          >
            <i className="fa-solid fa-sack-dollar text-base text-[#AA8220]"></i>
          </div>
        </OlympusCard>

        {/* KPI 2: Socios Activos */}
        <OlympusCard
          variant="marble"
          onClick={() => onSwitchTab('socios')}
          className="border-t-[3.5px] border-t-[#D4AF37] p-3.5 sm:p-4 flex items-center justify-between gap-2 cursor-pointer hover:-translate-y-0.5"
          title="Ir al directorio de socios"
        >
          <div className="min-w-0">
            <p className="text-[10px] text-slate-600 uppercase font-black font-cinzel tracking-wider truncate">
              Socios Activos
            </p>
            <p className="font-cinzel text-2xl sm:text-3xl font-black text-[#0F1E36] mt-0.5 leading-none">
              {activeMembers}
            </p>
            <span className="text-[10px] text-[#0F1E36] font-bold block mt-1.5">
              <i className="fa-solid fa-users mr-1 text-[#D4AF37]"></i>Ver Directorio
            </span>
          </div>
          <div
            className="w-11 h-11 rounded-full bg-gradient-to-br from-[#FFFFFF] via-[#F4F2EB] to-[#DFD9C8] border-2 border-[#D4AF37] flex items-center justify-center text-[#0F1E36] shrink-0"
            style={{
              boxShadow:
                'inset 0 3px 6px rgba(15,30,54,0.22), 0 4px 10px rgba(212,175,55,0.3)'
            }}
          >
            <i className="fa-solid fa-id-card-clip text-base text-[#0F1E36]"></i>
          </div>
        </OlympusCard>

        {/* KPI 3: Visitas / Accesos de Hoy */}
        <OlympusCard
          variant="marble"
          className="border-t-[3.5px] border-t-[#D4AF37] p-3.5 sm:p-4 flex items-center justify-between gap-2"
        >
          <div className="min-w-0">
            <p className="text-[10px] text-slate-600 uppercase font-black font-cinzel tracking-wider truncate">
              Visitas de Hoy
            </p>
            <p className="font-cinzel text-2xl sm:text-3xl font-black text-[#0F1E36] mt-0.5 leading-none">
              {todayEntries}
            </p>
            <div className="flex items-center gap-1 mt-1.5">
              <button
                type="button"
                onClick={() => onAdjustCounter && onAdjustCounter(1)}
                className="px-2 py-0.5 rounded bg-[#EAE6DC] hover:bg-[#D5CFC0] border border-[#C5A059] text-[10px] font-cinzel font-black text-[#0F1E36] cursor-pointer"
                title="Sumar 1"
              >
                +1
              </button>
              <button
                type="button"
                onClick={() => onAdjustCounter && onAdjustCounter(-1)}
                className="px-2 py-0.5 rounded bg-[#EAE6DC] hover:bg-[#D5CFC0] border border-[#C5A059] text-[10px] font-cinzel font-black text-[#0F1E36] cursor-pointer"
                title="Restar 1"
              >
                -1
              </button>
            </div>
          </div>
          <div
            className="w-11 h-11 rounded-full bg-gradient-to-br from-[#FFFFFF] via-[#F4F2EB] to-[#DFD9C8] border-2 border-[#D4AF37] flex items-center justify-center text-[#0D9488] shrink-0"
            style={{
              boxShadow:
                'inset 0 3px 6px rgba(15,30,54,0.22), 0 4px 10px rgba(212,175,55,0.3)'
            }}
          >
            <i className="fa-solid fa-person-walking-arrow-right text-base"></i>
          </div>
        </OlympusCard>

        {/* KPI 4: Vencimientos / Alertas */}
        <OlympusCard
          variant="marble"
          onClick={() => onSwitchTab('socios')}
          className="border-t-[3.5px] border-t-[#D4AF37] p-3.5 sm:p-4 flex items-center justify-between gap-2 cursor-pointer hover:-translate-y-0.5"
          title="Ver membresías por vencer o vencidas"
        >
          <div className="min-w-0">
            <p className="text-[10px] text-slate-600 uppercase font-black font-cinzel tracking-wider truncate">
              Vencimientos
            </p>
            <p className="font-cinzel text-2xl sm:text-3xl font-black text-[#E11D48] mt-0.5 leading-none">
              {expiringOrExpiredCount}
            </p>
            <span className="text-[10px] text-[#B45309] font-bold block mt-1.5">
              <i className="fa-solid fa-clock mr-1 text-[#F59E0B]"></i>Por renovar
            </span>
          </div>
          <div
            className="w-11 h-11 rounded-full bg-gradient-to-br from-[#FFFFFF] via-[#F4F2EB] to-[#DFD9C8] border-2 border-[#D4AF37] flex items-center justify-center text-[#E11D48] shrink-0"
            style={{
              boxShadow:
                'inset 0 3px 6px rgba(15,30,54,0.22), 0 4px 10px rgba(212,175,55,0.3)'
            }}
          >
            <i className="fa-solid fa-bell text-base"></i>
          </div>
        </OlympusCard>
      </div>

      {/* ================================================================ */}
      {/* SECCIÓN HERO: DESGLOSE TESORERÍA Y PASE DE VISITA TEMPLE         */}
      {/* ================================================================ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {/* HERO 1: DESGLOSE DE TESORERÍA Y META DIARIA */}
        <OlympusCard
          variant="marble"
          onClick={onOpenCashCut}
          className="p-4 sm:p-5 flex flex-col justify-between cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#0F1E36] uppercase font-black font-cinzel tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
              Desglose de Tesorería del Olimpo
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEditDailyGoal();
              }}
              className="text-[11px] bg-white hover:bg-[#F4F2EB] border border-[#C5A059] text-[#0F1E36] px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-colors shadow-xs"
            >
              <i className="fa-solid fa-pen mr-1 text-[#997A2C]"></i>Meta
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 my-2">
            <div className="bg-white/90 border border-[#DCD7C9] rounded-xl p-2.5 text-center shadow-inner">
              <span className="text-[9.5px] font-cinzel font-bold text-slate-500 uppercase block">
                Membresías
              </span>
              <span className="font-cinzel text-base sm:text-lg font-black text-[#0F1E36]">
                ${cashBreakdown.memberships.toLocaleString('es-MX')}
              </span>
            </div>
            <div className="bg-white/90 border border-[#DCD7C9] rounded-xl p-2.5 text-center shadow-inner">
              <span className="text-[9.5px] font-cinzel font-bold text-slate-500 uppercase block">
                Visitas
              </span>
              <span className="font-cinzel text-base sm:text-lg font-black text-[#0F1E36]">
                ${cashBreakdown.visits.toLocaleString('es-MX')}
              </span>
            </div>
            <div className="bg-white/90 border border-[#DCD7C9] rounded-xl p-2.5 text-center shadow-inner">
              <span className="text-[9.5px] font-cinzel font-bold text-slate-500 uppercase block">
                Suplementos
              </span>
              <span
                className="font-cinzel text-base sm:text-lg font-black"
                style={{ color: '#0D9488' }}
              >
                ${cashBreakdown.store.toLocaleString('es-MX')}
              </span>
            </div>
          </div>

          {/* Barra de Progreso de Meta */}
          <div className="space-y-1 pt-1">
            <div className="flex justify-between text-[10.5px] font-bold text-slate-600">
              <span>Progreso de Meta (${dailyGoal.toLocaleString('es-MX')})</span>
              <span className="font-cinzel font-black text-[#0D9488]">{pct}%</span>
            </div>
            <div className="w-full h-2.5 bg-[#EAE6DC] rounded-full overflow-hidden border border-[#C5A059]/60 shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#10B981] transition-all duration-500"
                style={{ width: `${pct}%` }}
              ></div>
            </div>
          </div>
        </OlympusCard>

        {/* HERO 2: RAYO VELOZ — PASE DE VISITA CON TEMPLE FRAME Y CIELO DE 3 PLANOS */}
        <div
          onClick={onRegisterVisit}
          className="cursor-pointer group transition-transform active:scale-[0.99]"
        >
          <TempleFrame
            className="h-full"
            innerClassName="bg-olympus-storm text-white p-4 sm:p-5 flex items-center justify-between gap-3 relative overflow-hidden"
            size="sm"
            columnWidth="w-3 sm:w-4"
            topLintel={null}
            bottomLintel={null}
            showClouds={true}
          >
            <div className="min-w-0 z-10">
              <span className="pill-gold-3d font-cinzel text-[9.5px] font-black uppercase px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 mb-1.5">
                <i className="fa-solid fa-bolt-lightning text-[9px]"></i>
                <span>PASE DE 1-TOQUE</span>
              </span>
              <h3 className="font-cinzel text-lg sm:text-xl font-black text-white leading-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)]">
                Rayo Veloz — Pase de Visita
              </h3>
              <p className="text-xs text-[#F4F2EB]/90 font-medium mt-1 flex items-center gap-1.5 drop-shadow">
                <i className="fa-solid fa-door-open text-[11px] text-[#FFD700]"></i>
                <span>Registra en caja y libera portal sagrado</span>
              </p>
            </div>

            <div className="shrink-0 btn-gold-olympus px-4 py-2.5 rounded-xl text-center group-hover:scale-105 transition-transform z-10">
              <span className="font-cinzel text-xl sm:text-2xl font-black text-[#0B1528] block leading-none">
                +${quickVisitPrice}
              </span>
              <span className="text-[9px] font-black text-[#0F1E36] uppercase tracking-wider block mt-0.5">
                COBRAR
              </span>
            </div>
          </TempleFrame>
        </div>
      </div>

      {/* ================================================================ */}
      {/* SECCIÓN INFERIOR: PORTAL SAGRADO + SUPLEMENTOS 1-TOQUE           */}
      {/* ================================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
        {/* Portal Sagrado — Registro en Vivo (.olympus-card--marble) */}
        <OlympusCard variant="marble" className="overflow-hidden flex flex-col">
          <div className="bg-gradient-to-r from-[#0B1528] via-[#162A4A] to-[#0B1528] px-4 py-2.5 border-b border-[#C5A059] flex justify-between items-center">
            <h3 className="font-cinzel text-xs sm:text-sm font-black text-white uppercase flex items-center gap-2">
              <i className="fa-solid fa-door-open text-[#D4AF37]"></i>
              <span>Portal Sagrado — Registro en Vivo</span>
            </h3>
            <button
              onClick={() => onSwitchTab('torniquete')}
              className="text-[11px] text-[#F3E5AB] hover:text-white font-cinzel font-bold transition-colors cursor-pointer"
            >
              Control Relé <i className="fa-solid fa-arrow-right text-[10px] ml-0.5"></i>
            </button>
          </div>

          <div className="p-3.5 space-y-2 flex-1">
            {!accessFeed || accessFeed.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-4 text-center">
                Esperando lecturas de acceso al santuario...
              </p>
            ) : (
              accessFeed.slice(0, 4).map((entry, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-xs shadow-xs ${
                    entry.isDenial
                      ? 'bg-rose-50/90 border-rose-300 text-rose-900'
                      : 'bg-emerald-50/90 border-emerald-300 text-emerald-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                        entry.isDenial
                          ? 'bg-[#E11D48] shadow-[0_0_6px_#E11D48]'
                          : 'bg-[#10B981] shadow-[0_0_6px_#10B981]'
                      }`}
                    ></span>
                    <span className="font-bold text-[#0F1E36] truncate">{entry.name}</span>
                    <span className="text-[10px] font-cinzel font-bold opacity-85 hidden sm:inline">
                      • {entry.badgeText}
                    </span>
                  </div>
                  <span className="font-cinzel text-[10px] font-bold text-slate-500 shrink-0 ml-2">
                    {entry.time}
                  </span>
                </div>
              ))
            )}
          </div>
        </OlympusCard>

        {/* Suplementos / Néctar del Olimpo (1-Toque con Mini-Tarjetas de Mármol Claro) */}
        <OlympusCard variant="marble" className="overflow-hidden flex flex-col">
          <div className="bg-gradient-to-r from-[#0B1528] via-[#162A4A] to-[#0B1528] px-4 py-2.5 border-b border-[#C5A059] flex justify-between items-center">
            <h3 className="font-cinzel text-xs sm:text-sm font-black text-white uppercase flex items-center gap-2">
              <i className="fa-solid fa-jar text-[#D4AF37]"></i>
              <span>Suplementos en Recepción (1-Toque)</span>
            </h3>
            <button
              onClick={() => onSwitchTab('tienda')}
              className="text-[11px] text-[#F3E5AB] hover:text-white font-cinzel font-bold transition-colors cursor-pointer"
            >
              Catálogo POS <i className="fa-solid fa-arrow-right text-[10px] ml-0.5"></i>
            </button>
          </div>

          <div className="p-3.5 grid grid-cols-2 gap-2.5">
            {QUICK_NECTAR_BUTTONS.map((btn) => {
              const live = arsenalItems.find((x) => x.id === btn.id);
              const stock = live ? live.stock : 20;
              return (
                <button
                  key={btn.id}
                  type="button"
                  onClick={() => onSellProduct && onSellProduct(btn.id, btn.name, btn.price)}
                  className="olympus-supplement-card hover:border-[#D4AF37] active:translate-y-0.5 p-2.5 flex flex-col justify-between text-left transition-all cursor-pointer group"
                >
                  {/* Fila 1: Ícono cuadrado con volumen + Nombre completo */}
                  <div className="flex items-center gap-2 w-full mb-1.5">
                    <div
                      className={`w-7 h-7 rounded-lg border ${btn.iconBg} flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform`}
                    >
                      <i className={`fa-solid ${btn.icon} text-xs`}></i>
                    </div>
                    <span className="text-xs font-extrabold text-[#0F1E36] leading-tight">
                      {btn.name}
                    </span>
                  </div>

                  {/* Fila 2: Stock a la izquierda + Precio en verde esmeralda a la derecha */}
                  <div className="flex items-center justify-between w-full pt-1 border-t border-[#E5E0D3]">
                    <span className="text-[10px] font-semibold text-[#64748B]">
                      Stock: {stock}
                    </span>
                    <span
                      className="font-cinzel text-xs sm:text-sm font-extrabold"
                      style={{ color: '#0D9488', fontWeight: 800 }}
                    >
                      ${btn.price}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </OlympusCard>
      </div>

      {/* ================================================================ */}
      {/* MODAL ESTADO MONITOR TV (PILAR 5.4: MARCO DE TEMPLO)             */}
      {/* ================================================================ */}
      {isTvModalOpen && (
        <div className="fixed inset-0 olympus-modal-backdrop z-50 flex items-center justify-center p-3 animate-fadeIn">
          <div className="olympus-modal-frame rounded-2xl w-full max-w-md overflow-hidden modal-enter">
            <div className="bg-gradient-to-r from-[#0B1528] via-[#162A4A] to-[#0B1528] border-b-2 border-[#D4AF37] px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#162A4A] border border-[#D4AF37] flex items-center justify-center text-[#FFD700] text-sm">
                  <i className="fa-solid fa-tv"></i>
                </div>
                <div>
                  <h3 className="font-cinzel text-sm sm:text-base font-black text-white">
                    Monitor del Olimpo
                  </h3>
                  <p className="text-[11px] text-[#F3E5AB]">Pantalla Kiosco de Recepción</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsTvModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-[#F3E5AB] hover:text-white flex items-center justify-center text-sm cursor-pointer"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="bg-white border border-[#C5A059]/50 rounded-xl p-3.5 space-y-2 text-xs shadow-inner">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Estado de Sincronización:</span>
                  <span className="font-bold text-[#0D9488] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping"></span>
                    En Línea y Conectado
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Resolución Óptima:</span>
                  <span className="font-bold text-[#0F1E36]">1080p Full HD (Escala +15%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Contenido en Transmisión:</span>
                  <span className="font-bold text-[#997A2C]">Decretos + Cartelera Olímpica</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsTvModalOpen(false);
                    onSwitchTab('comunicaciones');
                  }}
                  className="btn-gold-olympus py-2.5 px-3 rounded-xl text-xs cursor-pointer text-center"
                >
                  <i className="fa-solid fa-sliders mr-1"></i> Configurar TV
                </button>
                <button
                  type="button"
                  onClick={() => setIsTvModalOpen(false)}
                  className="btn-navy-olympus py-2.5 px-3 rounded-xl text-xs cursor-pointer text-center"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* MODAL ESTADO TORNIQUETE (PILAR 5.4: MARCO DE TEMPLO)             */}
      {/* ================================================================ */}
      {isTurnstileModalOpen && (
        <div className="fixed inset-0 olympus-modal-backdrop z-50 flex items-center justify-center p-3 animate-fadeIn">
          <div className="olympus-modal-frame rounded-2xl w-full max-w-md overflow-hidden modal-enter">
            <div className="bg-gradient-to-r from-[#0B1528] via-[#162A4A] to-[#0B1528] border-b-2 border-[#D4AF37] px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-8 h-8 rounded-lg border flex items-center justify-center text-sm ${
                    isTurnstileLocked
                      ? 'bg-rose-900 border-rose-400 text-rose-200'
                      : 'bg-emerald-900 border-emerald-400 text-emerald-200'
                  }`}
                >
                  <i className={`fa-solid ${isTurnstileLocked ? 'fa-lock' : 'fa-door-open'}`}></i>
                </div>
                <div>
                  <h3 className="font-cinzel text-sm sm:text-base font-black text-white">
                    Portal Sagrado del Olimpo
                  </h3>
                  <p className="text-[11px] text-[#F3E5AB]">
                    Relevador 2 Canales (Entrada / Salida)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsTurnstileModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-[#F3E5AB] hover:text-white flex items-center justify-center text-sm cursor-pointer"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="bg-white border border-[#C5A059]/50 rounded-xl p-3.5 space-y-2 text-xs shadow-inner">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Estado del Sistema:</span>
                  <span
                    className={`font-bold flex items-center gap-1.5 ${
                      isTurnstileLocked ? 'text-[#E11D48]' : 'text-[#0D9488]'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isTurnstileLocked ? 'bg-[#EF4444] animate-ping' : 'bg-[#10B981]'
                      }`}
                    ></span>
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
                  Simular Lectura Biométrica hacia Monitor TV
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => onEmitScan && onEmitScan('active')}
                    className="bg-emerald-100 hover:bg-emerald-200 border border-emerald-400 border-b-2 border-b-emerald-600 text-emerald-900 text-xs font-bold py-2 rounded-lg cursor-pointer transition-all active:translate-y-0.5"
                  >
                    Activo
                  </button>
                  <button
                    type="button"
                    onClick={() => onEmitScan && onEmitScan('warning')}
                    className="bg-amber-100 hover:bg-amber-200 border border-amber-400 border-b-2 border-b-amber-600 text-amber-900 text-xs font-bold py-2 rounded-lg cursor-pointer transition-all active:translate-y-0.5"
                  >
                    Aviso 3d
                  </button>
                  <button
                    type="button"
                    onClick={() => onEmitScan && onEmitScan('expired')}
                    className="bg-rose-100 hover:bg-rose-200 border border-rose-400 border-b-2 border-b-rose-600 text-rose-900 text-xs font-bold py-2 rounded-lg cursor-pointer transition-all active:translate-y-0.5"
                  >
                    Vencido
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#C5A059]/30">
                <button
                  type="button"
                  onClick={() => {
                    setIsTurnstileModalOpen(false);
                    onSwitchTab('torniquete');
                  }}
                  className="btn-gold-olympus py-2.5 px-3 rounded-xl text-xs cursor-pointer text-center"
                >
                  <i className="fa-solid fa-sliders mr-1"></i> Panel Portal
                </button>
                <button
                  type="button"
                  onClick={() => setIsTurnstileModalOpen(false)}
                  className="btn-navy-olympus py-2.5 px-3 rounded-xl text-xs cursor-pointer text-center"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
