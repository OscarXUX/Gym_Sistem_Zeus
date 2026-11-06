import React, { useState } from 'react';
import { OlympusCard, TempleFrame } from '../../common/GreekTempleComponents';

export default function SociosTab({
  members = [],
  onOpenNewMember,
  onOpenEditMember,
  onToggleInside,
  onRenewMember,
  onScanMember,
  onDeleteMember,
  onOpenAforo
}) {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'
  const [renewTarget, setRenewTarget] = useState(null);
  const [renewPlanOption, setRenewPlanOption] = useState('Mensualidad|$400|30');

  // Contadores para las cápsulas de filtro
  const insideCount = members.filter((m) => m.isInside).length;
  const activeCount = members.filter((m) => m.status === 'active').length;
  const warningCount = members.filter((m) => m.status === 'warning').length;
  const expiredCount = members.filter((m) => m.status === 'expired').length;

  const filteredMembers = members.filter((m) => {
    let matchStatus = true;
    if (filterStatus === 'inside') {
      matchStatus = !!m.isInside;
    } else if (filterStatus !== 'all') {
      matchStatus = m.status === filterStatus;
    }

    const matchSearch =
      !searchQuery ||
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(m.id).includes(searchQuery) ||
      (m.phone && String(m.phone).includes(searchQuery));
    return matchStatus && matchSearch;
  });

  const handleConfirmRenew = (e) => {
    e.preventDefault();
    if (!renewTarget) return;
    const [plan, priceStr, daysStr] = renewPlanOption.split('|');
    const numericPrice = parseInt(String(priceStr).replace(/\D/g, ''), 10) || 400;
    onRenewMember(
      renewTarget.id,
      plan,
      numericPrice,
      parseInt(daysStr, 10) || 30,
      priceStr
    );
    setRenewTarget(null);
  };

  const filterCapsules = [
    { id: 'all', label: 'Todos los Atletas', count: members.length },
    { id: 'inside', label: 'En el Olimpo', count: insideCount },
    { id: 'active', label: 'Activos', count: activeCount },
    { id: 'warning', label: 'Por Vencer (Aviso)', count: warningCount },
    { id: 'expired', label: 'Vencidos', count: expiredCount }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-3 sm:p-5 space-y-4 animate-fadeIn overflow-x-hidden font-body text-[#0F1E36]">
      {/* ================================================================ */}
      {/* HERO BANNER TEMPLE: CONSAGRAR NUEVO ATLETA                       */}
      {/* ================================================================ */}
      <div
        onClick={onOpenNewMember}
        className="cursor-pointer group transition-transform active:scale-[0.99]"
      >
        <TempleFrame
          innerClassName="bg-olympus-storm text-white p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden"
          size="sm"
          columnWidth="w-3.5 sm:w-5"
          topLintel={null}
          bottomLintel={null}
          showClouds={true}
        >
          <div className="min-w-0 z-10">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="pill-gold-3d font-cinzel text-[9.5px] font-black uppercase px-2.5 py-0.5 rounded-full">
                CONSAGRACIÓN DE ATLETAS
              </span>
              <span className="text-[10px] text-[#F3E5AB] font-cinzel font-bold">
                • TEMPLO DE ZEUS • SQLITE
              </span>
            </div>
            <h2 className="font-cinzel text-xl sm:text-2xl font-black text-white leading-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)]">
              Consagrar Nuevo Atleta
            </h2>
            <p className="text-xs text-[#F4F2EB]/90 mt-1 font-medium drop-shadow">
              Alta inmediata, captura fotográfica con cámara o archivo y cobro en tesorería en 1 toque.
            </p>
          </div>

          <div className="shrink-0 z-10">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenNewMember();
              }}
              className="w-full sm:w-auto btn-gold-olympus text-xs py-2.5 px-5 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <i className="fa-solid fa-bolt-lightning text-[#0B1528] text-xs"></i>
              <span>+ Consagrar Atleta</span>
            </button>
          </div>
        </TempleFrame>
      </div>

      {/* ================================================================ */}
      {/* ACCESO RÁPIDO: AFORO EN VIVO (.olympus-card--marble)             */}
      {/* ================================================================ */}
      <OlympusCard
        variant="marble"
        onClick={() => onOpenAforo && onOpenAforo()}
        className="w-full p-3.5 sm:p-4 cursor-pointer flex items-center justify-between gap-3 text-left hover:-translate-y-0.5"
        title="Ir a la vista de aforo en vivo de atletas en el santuario"
      >
        <div className="flex items-center gap-3 z-10 min-w-0">
          <div
            className="w-11 h-11 rounded-full bg-gradient-to-br from-[#FFFFFF] via-[#F4F2EB] to-[#DFD9C8] border-2 border-[#D4AF37] flex items-center justify-center text-[#0D9488] text-base shrink-0"
            style={{
              boxShadow:
                'inset 0 3px 6px rgba(15,30,54,0.22), 0 4px 10px rgba(212,175,55,0.3)'
            }}
          >
            <i className="fa-solid fa-users-viewfinder"></i>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse"></span>
              <span className="text-[10px] font-black uppercase font-cinzel tracking-wider text-[#0D9488]">
                Aforo en Vivo
              </span>
              <span className="text-[10px] text-slate-500 hidden xs:inline font-semibold">
                • Tiempo Real
              </span>
            </div>
            <p className="font-cinzel text-sm sm:text-base font-black text-[#0F1E36] truncate mt-0.5">
              {insideCount}{' '}
              {insideCount === 1 ? 'Atleta en el Olimpo' : 'Atletas en el Olimpo'} Entrenando
            </p>
          </div>
        </div>

        <div className="shrink-0 z-10 btn-navy-olympus text-xs py-2 px-3.5 sm:px-4 rounded-xl flex items-center gap-1.5">
          <span>Ver Aforo en Vivo</span>
          <i className="fa-solid fa-chevron-right text-[10px] ml-0.5"></i>
        </div>
      </OlympusCard>

      {/* ================================================================ */}
      {/* PILAR 5.2: CÁPSULAS DE FILTRO Y BUSCADOR HUNDIDO TÁCTIL          */}
      {/* ================================================================ */}
      <OlympusCard variant="marble" className="p-4 space-y-3.5">
        {/* Fila Superior: Cápsulas de Filtro y Switcher de Vista */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Cápsulas de Filtro */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {filterCapsules.map((cap) => {
              const isSelected = filterStatus === cap.id;
              return (
                <button
                  key={cap.id}
                  type="button"
                  onClick={() => setFilterStatus(cap.id)}
                  className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                    isSelected
                      ? 'btn-navy-olympus'
                      : 'bg-white hover:bg-[#F8F6F0] text-slate-700 border-[#C5A059]/60 shadow-xs'
                  }`}
                >
                  <span>{cap.label}</span>
                  <span
                    className={`text-[10px] font-black px-1.5 py-0.2 rounded-full font-cinzel ${
                      isSelected
                        ? 'bg-[#D4AF37] text-[#0B1528]'
                        : 'bg-[#EAE6DC] text-[#0F1E36]'
                    }`}
                  >
                    {cap.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Switcher de Vista (Tabla / Cuadrícula) */}
          <div className="flex items-center gap-1 bg-[#EAE6DC] border border-[#C5A059] p-1 rounded-xl self-end sm:self-auto shrink-0 shadow-inner">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`py-1 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'table'
                  ? 'bg-[#0F1E36] text-[#F3E5AB] shadow-sm'
                  : 'text-slate-600 hover:text-[#0F1E36]'
              }`}
              title="Vista Tabla (Filas)"
            >
              <i className="fa-solid fa-list text-xs"></i>
              <span className="hidden xs:inline">Tabla</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`py-1 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'grid'
                  ? 'bg-[#0F1E36] text-[#F3E5AB] shadow-sm'
                  : 'text-slate-600 hover:text-[#0F1E36]'
              }`}
              title="Vista Cuadrícula (Tarjetas)"
            >
              <i className="fa-solid fa-table-cells-large text-xs"></i>
              <span className="hidden xs:inline">Tarjetas</span>
            </button>
          </div>
        </div>

        {/* Fila Inferior: Buscador con Efecto Hundido Táctil (.input-tactile-sunken) */}
        <div className="space-y-1">
          <label className="text-[10px] font-black font-cinzel uppercase tracking-wider text-[#0F1E36] flex items-center gap-1.5">
            <i className="fa-solid fa-magnifying-glass text-[#997A2C] text-[10px]"></i>
            <span>Buscar Atleta por Nombre, PIN/ID o Teléfono:</span>
          </label>
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Escribe el nombre, PIN (#042) o teléfono del atleta..."
              className="w-full input-tactile-sunken rounded-xl pl-3.5 pr-8 py-2.5 text-xs text-[#0F1E36] font-bold"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-[#0F1E36] text-xs cursor-pointer"
                title="Limpiar búsqueda"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            )}
          </div>
        </div>
      </OlympusCard>

      {/* ================================================================ */}
      {/* PILAR 5.2: TABLA ELEVADA SOBRE MÁRMOL CON THEAD AZUL Y ORO       */}
      {/* ================================================================ */}
      {viewMode === 'table' && (
        <OlympusCard variant="marble" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-[#D4AF37] bg-gradient-to-r from-[#0B1528] via-[#162A4A] to-[#0B1528] text-[10.5px] font-black font-cinzel text-[#F3E5AB] uppercase tracking-wider">
                  <th className="px-4 sm:px-6 py-3.5">Atleta</th>
                  <th className="px-6 py-3.5 hidden md:table-cell">Plan / Tarifa</th>
                  <th className="px-3 sm:px-6 py-3.5">Estado Semántico</th>
                  <th className="px-6 py-3.5 text-center hidden sm:table-cell">Presencia</th>
                  <th className="px-4 sm:px-6 py-3.5 text-right">Acciones Tácticas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCD7C9] text-xs">
                {filteredMembers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-slate-500 italic">
                      No se encontraron atletas con los criterios seleccionados.
                    </td>
                  </tr>
                ) : (
                  filteredMembers.map((m) => {
                    let statusBadge = (
                      <span className="inline-flex items-center gap-1.5 text-[#065F46] bg-emerald-100 border border-[#10B981] px-2.5 py-0.5 rounded-full text-[10px] font-black font-cinzel uppercase tracking-wider whitespace-nowrap">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
                        Activo ({m.days}d)
                      </span>
                    );
                    if (m.status === 'warning') {
                      statusBadge = (
                        <span className="inline-flex items-center gap-1.5 text-[#92400E] bg-amber-100 border border-[#F59E0B] px-2.5 py-0.5 rounded-full text-[10px] font-black font-cinzel uppercase tracking-wider whitespace-nowrap">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]"></span>
                          Aviso ({m.days}d)
                        </span>
                      );
                    } else if (m.status === 'expired') {
                      statusBadge = (
                        <span className="inline-flex items-center gap-1.5 text-[#9F1239] bg-rose-100 border border-[#E11D48] px-2.5 py-0.5 rounded-full text-[10px] font-black font-cinzel uppercase tracking-wider whitespace-nowrap">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48]"></span>
                          Vencido ({Math.abs(m.days)}d)
                        </span>
                      );
                    }

                    return (
                      <tr
                        key={m.id}
                        onClick={() => onOpenEditMember(m.id)}
                        className="olympus-table-row cursor-pointer group bg-white/95"
                        title="Toca para editar datos"
                      >
                        <td className="px-4 sm:px-6 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="relative shrink-0">
                              <img
                                src={m.photo}
                                alt={m.name}
                                className="w-10 h-10 rounded-full object-cover border-2 border-[#D4AF37] shadow-xs"
                              />
                              <span
                                className={`sm:hidden absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${
                                  m.isInside ? 'bg-[#10B981]' : 'bg-slate-400'
                                }`}
                              ></span>
                            </div>
                            <div className="min-w-0">
                              <span className="font-cinzel font-black text-[#0F1E36] text-xs sm:text-sm block truncate group-hover:text-[#997A2C] transition-colors">
                                {m.name}
                              </span>
                              <span className="text-[10px] text-slate-500 font-cinzel block mt-0.5">
                                PIN: <strong className="text-[#0F1E36]">#{m.id}</strong>
                                {m.phone ? ` · 📞 ${m.phone}` : ''}
                                <span className="md:hidden text-slate-600"> · {m.plan}</span>
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-3.5 hidden md:table-cell">
                          <span className="text-xs text-[#0F1E36] font-extrabold">{m.plan}</span>{' '}
                          <br />
                          <span
                            className="text-[11px] font-cinzel font-black"
                            style={{ color: '#0D9488' }}
                          >
                            {m.price}
                          </span>
                        </td>
                        <td className="px-3 sm:px-6 py-3.5">{statusBadge}</td>
                        <td className="px-6 py-3.5 text-center text-xs hidden sm:table-cell">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleInside(m.id);
                            }}
                            className={`font-bold cursor-pointer px-2.5 py-1 rounded-full border text-[10.5px] transition-all ${
                              m.isInside
                                ? 'bg-emerald-50 border-[#10B981] text-[#0D9488]'
                                : 'bg-[#F4F2EB] border-[#C5A059]/60 text-slate-600 hover:text-[#0F1E36]'
                            }`}
                            title={m.isInside ? 'Registrar Salida' : 'Registrar Entrada'}
                          >
                            <i
                              className={`fa-solid ${
                                m.isInside ? 'fa-check text-[#10B981]' : 'fa-minus'
                              } mr-1`}
                            ></i>
                            {m.isInside ? 'Dentro' : 'Fuera'}
                          </button>
                        </td>
                        <td className="px-4 sm:px-6 py-3.5 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5">
                            {/* Pasar Huella */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onScanMember && onScanMember(m.id);
                              }}
                              className="bg-emerald-100 hover:bg-emerald-200 border border-[#10B981] border-b-2 border-b-emerald-700 text-emerald-950 text-[10px] font-bold px-2.5 py-1.5 rounded-lg cursor-pointer active:translate-y-0.5 flex items-center gap-1"
                              title="Simular paso de huella"
                            >
                              <i className="fa-solid fa-fingerprint text-[#0D9488]"></i>
                              <span className="hidden lg:inline">Huella</span>
                            </button>

                            {/* Renovar */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setRenewTarget(m);
                                setRenewPlanOption('Mensualidad|$400|30');
                              }}
                              className="btn-gold-olympus text-[10px] px-2.5 py-1.5 rounded-lg cursor-pointer flex items-center gap-1"
                              title="Renovar consagración"
                            >
                              <i className="fa-solid fa-rotate"></i>
                              <span>Renovar</span>
                            </button>

                            {/* Eliminar */}
                            {onDeleteMember && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (confirm(`¿Estás seguro de dar de baja a ${m.name}?`)) {
                                    onDeleteMember(m.id);
                                  }
                                }}
                                className="bg-rose-100 hover:bg-rose-200 border border-rose-300 border-b-2 border-b-rose-500 text-rose-800 px-2.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer active:translate-y-0.5"
                                title="Dar de baja atleta permanentemente"
                              >
                                <i className="fa-solid fa-trash"></i>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </OlympusCard>
      )}

      {/* ================================================================ */}
      {/* VISTA CUADRÍCULA DE TARJETAS POLIMÓRFICAS                        */}
      {/* ================================================================ */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 w-full">
          {filteredMembers.length === 0 ? (
            <OlympusCard
              variant="marble"
              className="col-span-full p-8 text-center text-slate-500 italic"
            >
              No se encontraron atletas con los criterios seleccionados.
            </OlympusCard>
          ) : (
            filteredMembers.map((m) => {
              let statusBadge = (
                <span className="text-[#065F46] bg-emerald-100 border border-[#10B981] px-2 py-0.5 rounded-full text-[10px] font-black font-cinzel uppercase tracking-wider">
                  Activo ({m.days}d)
                </span>
              );
              if (m.status === 'warning') {
                statusBadge = (
                  <span className="text-[#92400E] bg-amber-100 border border-[#F59E0B] px-2 py-0.5 rounded-full text-[10px] font-black font-cinzel uppercase tracking-wider">
                    Aviso ({m.days}d)
                  </span>
                );
              } else if (m.status === 'expired') {
                statusBadge = (
                  <span className="text-[#9F1239] bg-rose-100 border border-[#E11D48] px-2 py-0.5 rounded-full text-[10px] font-black font-cinzel uppercase tracking-wider">
                    Vencido ({Math.abs(m.days)}d)
                  </span>
                );
              }

              return (
                <OlympusCard
                  key={m.id}
                  variant="marble"
                  onClick={() => onOpenEditMember(m.id)}
                  className="border-t-[3px] border-t-[#D4AF37] p-4 relative group cursor-pointer hover:-translate-y-0.5 space-y-3 flex flex-col justify-between"
                  title="Toca la tarjeta para editar los datos del atleta"
                >
                  {/* Encabezado de la Tarjeta: Foto + Datos */}
                  <div className="flex items-center gap-3">
                    <div className="relative shrink-0">
                      <img
                        src={m.photo}
                        alt={m.name}
                        className="w-12 h-12 rounded-xl object-cover border-2 border-[#D4AF37] bg-[#EAE6DC]"
                      />
                      <span
                        className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                          m.isInside ? 'bg-[#10B981] shadow-xs' : 'bg-slate-400'
                        }`}
                        title={
                          m.isInside ? 'Entrenando en el Olimpo' : 'Fuera del santuario'
                        }
                      ></span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="font-cinzel font-black text-sm text-[#0F1E36] truncate group-hover:text-[#997A2C] transition-colors">
                          {m.name}
                        </h4>
                        <span className="text-[10px] font-cinzel font-black px-1.5 py-0.5 rounded bg-[#EAE6DC] text-[#0F1E36] border border-[#C5A059] shrink-0">
                          #{m.id}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 truncate mt-0.5 font-semibold">
                        {m.phone ? `📞 ${m.phone}` : 'Sin teléfono'}
                      </p>
                    </div>
                  </div>

                  {/* Estado y Plan */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#C5A059]/35 text-xs">
                    <div>
                      <span className="text-[#0F1E36] font-extrabold block leading-none">
                        {m.plan}
                      </span>
                      <span
                        className="text-[11px] font-cinzel font-black mt-0.5 block"
                        style={{ color: '#0D9488' }}
                      >
                        {m.price}
                      </span>
                    </div>
                    <div>{statusBadge}</div>
                  </div>

                  {/* Barra de Acciones Operativas */}
                  <div className="flex items-center justify-between gap-1.5 pt-2 border-t border-[#C5A059]/35">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onScanMember && onScanMember(m.id);
                      }}
                      className="bg-emerald-100 hover:bg-emerald-200 border border-[#10B981] border-b-2 border-b-emerald-700 text-emerald-950 text-[10px] font-bold py-1.5 px-2.5 rounded-lg flex items-center gap-1 cursor-pointer active:translate-y-0.5"
                      title="Simular paso de huella biométrica"
                    >
                      <i className="fa-solid fa-fingerprint text-xs text-[#0D9488]"></i>
                      <span>Huella</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setRenewTarget(m);
                        setRenewPlanOption('Mensualidad|$400|30');
                      }}
                      className="btn-gold-olympus text-[10px] py-1 px-2.5 rounded-lg flex items-center gap-1 cursor-pointer"
                      title="Renovar consagración"
                    >
                      <i className="fa-solid fa-rotate text-xs text-[#0B1528]"></i>
                      <span>Renovar</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleInside(m.id);
                      }}
                      className={`text-[10px] font-bold py-1.5 px-2 rounded-lg border transition-colors cursor-pointer ${
                        m.isInside
                          ? 'bg-emerald-100 border-[#10B981] text-[#065F46]'
                          : 'bg-[#EAE6DC] border-[#C5A059] text-[#0F1E36] hover:bg-[#DCD8CC]'
                      }`}
                      title={m.isInside ? 'Marcar Salida' : 'Marcar Entrada'}
                    >
                      {m.isInside ? 'Dentro' : 'Fuera'}
                    </button>

                    {onDeleteMember && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`¿Estás seguro de dar de baja a ${m.name}?`)) {
                            onDeleteMember(m.id);
                          }
                        }}
                        className="bg-rose-100 hover:bg-rose-200 border border-rose-300 text-rose-800 py-1.5 px-2 rounded-lg text-xs cursor-pointer transition-colors"
                        title="Eliminar atleta permanentemente"
                      >
                        <i className="fa-solid fa-trash text-xs"></i>
                      </button>
                    )}
                  </div>
                </OlympusCard>
              );
            })
          )}
        </div>
      )}

      {/* ================================================================ */}
      {/* MODAL DE RENOVACIÓN CON MARCO DE TEMPLO (PILAR 5.4)              */}
      {/* ================================================================ */}
      {renewTarget && (
        <div className="fixed inset-0 olympus-modal-backdrop z-[110] flex items-center justify-center p-4 animate-fadeIn">
          <div className="olympus-modal-frame rounded-2xl w-full max-w-sm overflow-hidden modal-enter">
            <div className="bg-gradient-to-r from-[#0B1528] via-[#162A4A] to-[#0B1528] border-b-2 border-[#D4AF37] px-5 py-3.5 flex items-center justify-between">
              <h4 className="font-cinzel text-sm sm:text-base font-black text-white">
                Renovar Consagración
              </h4>
              <button
                onClick={() => setRenewTarget(null)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-[#F3E5AB] hover:text-white flex items-center justify-center text-sm cursor-pointer"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="p-5">
              <div className="flex items-center gap-3 mb-4 bg-white border border-[#C5A059]/60 p-3 rounded-xl shadow-inner">
                <img
                  src={renewTarget.photo}
                  alt={renewTarget.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#D4AF37]"
                />
                <div>
                  <p className="font-cinzel text-sm font-black text-[#0F1E36]">
                    {renewTarget.name}
                  </p>
                  <p className="text-xs text-[#997A2C] font-cinzel font-bold">
                    PIN #{renewTarget.id}
                  </p>
                </div>
              </div>

              <form onSubmit={handleConfirmRenew} className="space-y-4">
                <div>
                  <label className="text-[10px] font-black font-cinzel uppercase tracking-wider text-[#0F1E36] block mb-1">
                    Selecciona Decreto / Plan
                  </label>
                  <select
                    value={renewPlanOption}
                    onChange={(e) => setRenewPlanOption(e.target.value)}
                    className="w-full input-tactile-sunken rounded-xl px-3.5 py-2.5 text-xs text-[#0F1E36] font-bold cursor-pointer"
                  >
                    <option value="Mensualidad|$400|30">
                      Mensualidad Olimpo $400 MXN - +30 días
                    </option>
                    <option value="Promo Dúo|2x$700|30">
                      Promo Dúo Olímpico 2x$700 MXN - +30 días
                    </option>
                    <option value="Quincena|$250|15">
                      Quincena Olimpo $250 MXN - +15 días
                    </option>
                  </select>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setRenewTarget(null)}
                    className="flex-1 btn-navy-olympus text-xs py-2.5 rounded-xl cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 btn-gold-olympus text-xs py-2.5 rounded-xl uppercase tracking-wider cursor-pointer"
                  >
                    Cobrar & Renovar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
