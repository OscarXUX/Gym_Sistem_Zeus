import React, { useState } from 'react';

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
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
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
    onRenewMember(renewTarget.id, plan, numericPrice, parseInt(daysStr, 10) || 30, priceStr);
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
    <div className="w-full max-w-6xl mx-auto p-3 sm:p-5 space-y-4 animate-fadeIn overflow-x-hidden font-body text-slate-800">
      {/* ================================================================ */}
      {/* HERO BANNER: CONSAGRAR NUEVO ATLETA                              */}
      {/* ================================================================ */}
      <div
        onClick={onOpenNewMember}
        className="bg-gradient-to-r from-[#0F1E36] via-[#162A4A] to-[#1F3A60] border-2 border-[#C5A059] p-4 sm:p-5 rounded-2xl relative overflow-hidden group cursor-pointer transition-all shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-white"
      >
        <i className="fa-solid fa-user-plus absolute -right-3 -bottom-3 text-7xl sm:text-8xl text-[#D4AF37]/10 group-hover:text-[#D4AF37]/20 transition-all pointer-events-none"></i>
        <div className="min-w-0 z-10">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-[#FFD700] animate-pulse"></span>
            <span className="text-[10px] sm:text-[11px] font-black uppercase font-cinzel tracking-wider text-[#F3E5AB]">
              Consagración de Atletas
            </span>
            <span className="text-[10px] text-slate-300">• Templo de Zeus • SQLite</span>
          </div>
          <h2 className="font-cinzel text-xl sm:text-2xl font-black text-white leading-tight">
            Consagrar Nuevo Atleta
          </h2>
          <p className="text-xs text-slate-300 mt-1">
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
            className="w-full sm:w-auto btn-gold-olympus font-cinzel font-black text-xs py-2.5 px-5 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md"
          >
            <i className="fa-solid fa-bolt-lightning text-[#0F1E36] text-xs"></i>
            <span>+ Consagrar Atleta</span>
          </button>
        </div>
      </div>

      {/* ================================================================ */}
      {/* ACCESO RÁPIDO: AFORO EN VIVO                                     */}
      {/* ================================================================ */}
      <button
        type="button"
        onClick={() => onOpenAforo && onOpenAforo()}
        className="w-full bg-[#FAF9F5] border border-[#C5A059] hover:border-[#0F1E36] p-3.5 sm:p-4 rounded-2xl relative overflow-hidden group cursor-pointer transition-all shadow-sm flex items-center justify-between gap-3 text-left active:scale-[0.99]"
        title="Ir a la vista de aforo en vivo de atletas en el santuario"
      >
        <div className="flex items-center gap-3 z-10 min-w-0">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0F1E36] to-[#162A4A] border border-[#C5A059] flex items-center justify-center text-[#D4AF37] text-lg shrink-0 shadow-sm">
            <i className="fa-solid fa-users-viewfinder"></i>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-black uppercase font-cinzel tracking-wider text-emerald-800">
                Aforo en Vivo
              </span>
              <span className="text-[10px] text-slate-500 hidden xs:inline">• Tiempo Real</span>
            </div>
            <p className="font-cinzel text-sm sm:text-base font-black text-[#0F1E36] truncate mt-0.5">
              {insideCount} {insideCount === 1 ? 'Atleta en el Olimpo' : 'Atletas en el Olimpo'} Entrenando
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 z-10 bg-[#0F1E36] hover:bg-[#162A4A] text-[#F3E5AB] font-bold font-cinzel text-xs py-2 px-3 sm:px-4 rounded-xl shadow-sm transition-all border border-[#C5A059]">
          <span>Ver Aforo en Vivo</span>
          <i className="fa-solid fa-chevron-right text-[10px] ml-0.5"></i>
        </div>
      </button>

      {/* ================================================================ */}
      {/* CÁPSULAS DE FILTRO Y BUSCADOR                                    */}
      {/* ================================================================ */}
      <div className="bg-[#FAF9F5] border border-[#C5A059] rounded-2xl p-4 space-y-3 shadow-sm">
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
                      ? 'bg-[#0F1E36] text-[#F3E5AB] border-[#C5A059] shadow-sm'
                      : 'bg-white hover:bg-[#F3EFE6] text-slate-700 border-[#C5A059]/50'
                  }`}
                >
                  <span>{cap.label}</span>
                  <span
                    className={`text-[10px] font-black px-1.5 py-0.2 rounded-full font-cinzel ${
                      isSelected ? 'bg-[#C5A059] text-[#0F1E36]' : 'bg-[#EAE7DC] text-[#0F1E36]'
                    }`}
                  >
                    {cap.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Switcher de Vista (Cuadrícula / Tabla) */}
          <div className="flex items-center gap-1 bg-[#EAE7DC] border border-[#C5A059] p-1 rounded-xl self-end sm:self-auto shrink-0">
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
          </div>
        </div>

        {/* Fila Inferior: Buscador de Atletas */}
        <div className="space-y-1">
          <label className="text-[10px] font-black font-cinzel uppercase tracking-wider text-slate-600 block flex items-center gap-1">
            <i className="fa-solid fa-magnifying-glass text-[#997A2C] text-[10px]"></i>
            <span>Buscar Atleta por Nombre, PIN/ID o Teléfono:</span>
          </label>
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Escribe el nombre o ID del atleta..."
              className="w-full bg-white border border-[#C5A059] focus:border-[#0F1E36] rounded-xl pl-3.5 pr-8 py-2 text-xs text-[#0F1E36] font-bold focus:outline-none transition-colors"
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
      </div>

      {/* ================================================================ */}
      {/* VISTA 1: CUADRÍCULA DE TARJETAS (GRID)                           */}
      {/* ================================================================ */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 w-full">
          {filteredMembers.length === 0 ? (
            <div className="col-span-full bg-[#FAF9F5] border border-[#C5A059] rounded-2xl p-8 text-center text-slate-500 italic">
              No se encontraron atletas con los criterios seleccionados.
            </div>
          ) : (
            filteredMembers.map((m) => {
              let statusBadge = (
                <span className="text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded text-[10px] font-bold font-cinzel uppercase tracking-wider">
                  Activo ({m.days}d)
                </span>
              );
              if (m.status === 'warning') {
                statusBadge = (
                  <span className="text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded text-[10px] font-bold font-cinzel uppercase tracking-wider">
                    Aviso ({m.days}d)
                  </span>
                );
              } else if (m.status === 'expired') {
                statusBadge = (
                  <span className="text-rose-800 bg-rose-100 border border-rose-300 px-2 py-0.5 rounded text-[10px] font-bold font-cinzel uppercase tracking-wider">
                    Vencido ({Math.abs(m.days)}d)
                  </span>
                );
              }

              return (
                <div
                  key={m.id}
                  onClick={() => onOpenEditMember(m.id)}
                  className="bg-[#FAF9F5] border border-[#C5A059] hover:border-[#0F1E36] p-4 rounded-2xl relative group cursor-pointer transition-all shadow-sm space-y-3 flex flex-col justify-between"
                  title="Toca la tarjeta para editar los datos del atleta"
                >
                  {/* Encabezado de la Tarjeta: Foto + Datos */}
                  <div className="flex items-center gap-3">
                    <div className="relative shrink-0">
                      <img
                        src={m.photo}
                        alt={m.name}
                        className="w-12 h-12 rounded-xl object-cover border-2 border-[#C5A059] bg-[#EAE7DC]"
                      />
                      <span
                        className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                          m.isInside ? 'bg-emerald-500 shadow-sm' : 'bg-slate-400'
                        }`}
                        title={m.isInside ? 'Entrenando en el Olimpo' : 'Fuera del santuario'}
                      ></span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="font-cinzel font-black text-sm text-[#0F1E36] truncate group-hover:text-[#997A2C] transition-colors">
                          {m.name}
                        </h4>
                        <span className="text-[10px] font-cinzel font-bold px-1.5 py-0.5 rounded bg-[#EAE7DC] text-[#0F1E36] border border-[#C5A059]/40 shrink-0">
                          #{m.id}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5 font-medium">
                        {m.phone ? `📞 ${m.phone}` : 'Sin teléfono'}
                      </p>
                    </div>
                  </div>

                  {/* Estado y Plan */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#C5A059]/30 text-xs">
                    <div>
                      <span className="text-[#0F1E36] font-bold block leading-none">{m.plan}</span>
                      <span className="text-[10px] text-[#997A2C] font-cinzel font-black mt-0.5 block">{m.price}</span>
                    </div>
                    <div>{statusBadge}</div>
                  </div>

                  {/* Barra de Acciones Operativas */}
                  <div className="flex items-center justify-between gap-1.5 pt-2 border-t border-[#C5A059]/30">
                    {/* Botón Simular Huella */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onScanMember && onScanMember(m.id);
                      }}
                      className="bg-emerald-100 hover:bg-emerald-200 border border-emerald-400 text-emerald-900 text-[10px] font-bold py-1.5 px-2.5 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                      title="Simular paso de huella biométrica"
                    >
                      <i className="fa-solid fa-fingerprint text-xs text-emerald-700"></i>
                      <span>Huella</span>
                    </button>

                    {/* Botón Renovar */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setRenewTarget(m);
                        setRenewPlanOption('Mensualidad|$400|30');
                      }}
                      className="btn-gold-olympus font-cinzel text-[10px] font-black py-1 px-2.5 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                      title="Renovar consagración"
                    >
                      <i className="fa-solid fa-rotate text-xs text-[#0F1E36]"></i>
                      <span>Renovar</span>
                    </button>

                    {/* Botón Presencia (Dentro / Fuera) */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleInside(m.id);
                      }}
                      className={`text-[10px] font-bold py-1.5 px-2 rounded-lg border transition-colors cursor-pointer ${
                        m.isInside
                          ? 'bg-emerald-100 border-emerald-400 text-emerald-800'
                          : 'bg-[#EAE7DC] border-[#C5A059] text-[#0F1E36] hover:bg-[#DCD8CC]'
                      }`}
                      title={m.isInside ? 'Marcar Salida' : 'Marcar Entrada'}
                    >
                      {m.isInside ? 'Dentro' : 'Fuera'}
                    </button>

                    {/* Botón Eliminar */}
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
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ================================================================ */}
      {/* VISTA 2: TABLA CLÁSICA (LISTA)                                   */}
      {/* ================================================================ */}
      {viewMode === 'table' && (
        <div className="bg-[#FAF9F5] border border-[#C5A059] rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#C5A059] bg-[#0F1E36] text-[10px] font-black font-cinzel text-[#F3E5AB] uppercase tracking-wider">
                  <th className="px-4 sm:px-6 py-3.5">Atleta</th>
                  <th className="px-6 py-3.5 hidden md:table-cell">Plan / Tarifa</th>
                  <th className="px-3 sm:px-6 py-3.5">Estado</th>
                  <th className="px-6 py-3.5 text-center hidden sm:table-cell">Presencia</th>
                  <th className="px-4 sm:px-6 py-3.5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#C5A059]/20 text-xs">
                {filteredMembers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-slate-500 italic">
                      No se encontraron atletas con los criterios seleccionados.
                    </td>
                  </tr>
                ) : (
                  filteredMembers.map((m) => {
                    let statusBadge = (
                      <span className="inline-block text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded text-[10px] font-bold font-cinzel uppercase tracking-wider whitespace-nowrap">
                        Activo ({m.days}d)
                      </span>
                    );
                    if (m.status === 'warning') {
                      statusBadge = (
                        <span className="inline-block text-amber-800 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded text-[10px] font-bold font-cinzel uppercase tracking-wider whitespace-nowrap">
                          Aviso ({m.days}d)
                        </span>
                      );
                    } else if (m.status === 'expired') {
                      statusBadge = (
                        <span className="inline-block text-rose-800 bg-rose-100 border border-rose-300 px-2.5 py-0.5 rounded text-[10px] font-bold font-cinzel uppercase tracking-wider whitespace-nowrap">
                          Vencido ({Math.abs(m.days)}d)
                        </span>
                      );
                    }

                    return (
                      <tr
                        key={m.id}
                        onClick={() => onOpenEditMember(m.id)}
                        className="hover:bg-[#F3EFE6] transition-colors cursor-pointer group bg-white"
                        title="Toca para editar datos"
                      >
                        <td className="px-4 sm:px-6 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="relative shrink-0">
                              <img
                                src={m.photo}
                                alt={m.name}
                                className="w-10 h-10 rounded-full object-cover border-2 border-[#C5A059]"
                              />
                              <span
                                className={`sm:hidden absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${
                                  m.isInside ? 'bg-emerald-500' : 'bg-slate-400'
                                }`}
                              ></span>
                            </div>
                            <div className="min-w-0">
                              <span className="font-cinzel font-bold text-[#0F1E36] text-xs sm:text-sm block truncate group-hover:text-[#997A2C] transition-colors">
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
                          <span className="text-xs text-[#0F1E36] font-bold">{m.plan}</span> <br />
                          <span className="text-[10px] text-[#997A2C] font-cinzel font-bold">{m.price}</span>
                        </td>
                        <td className="px-3 sm:px-6 py-3.5">{statusBadge}</td>
                        <td className="px-6 py-3.5 text-center text-xs hidden sm:table-cell">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleInside(m.id);
                            }}
                            className={`font-bold cursor-pointer transition-colors ${
                              m.isInside ? 'text-emerald-700 hover:text-emerald-900' : 'text-slate-500 hover:text-slate-800'
                            }`}
                            title={m.isInside ? 'Registrar Salida' : 'Registrar Entrada'}
                          >
                            <i className={`fa-solid ${m.isInside ? 'fa-check text-emerald-600' : 'fa-minus'} mr-1`}></i>
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
                              className="bg-emerald-100 hover:bg-emerald-200 border border-emerald-400 text-emerald-900 text-[10px] font-bold px-2.5 py-1.5 rounded-lg cursor-pointer shadow-sm flex items-center gap-1"
                              title="Simular paso de huella"
                            >
                              <i className="fa-solid fa-fingerprint"></i>
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
                              className="btn-gold-olympus font-cinzel text-[10px] font-bold px-2.5 py-1.5 rounded-lg cursor-pointer shadow-sm flex items-center gap-1"
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
                                className="bg-rose-100 hover:bg-rose-200 border border-rose-300 text-rose-800 px-2.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer"
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
        </div>
      )}

      {/* ================================================================ */}
      {/* MODAL RÁPIDO DE CONFIRMACIÓN DE RENOVACIÓN                       */}
      {/* ================================================================ */}
      {renewTarget && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[110] flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#FAF9F5] border-2 border-[#C5A059] rounded-3xl p-6 w-full max-w-sm shadow-2xl relative">
            <button
              onClick={() => setRenewTarget(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-[#0F1E36] cursor-pointer"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            <div className="flex items-center gap-3 mb-4">
              <img
                src={renewTarget.photo}
                alt={renewTarget.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-[#C5A059]"
              />
              <div>
                <h4 className="font-cinzel text-base font-black text-[#0F1E36]">Renovar Consagración</h4>
                <p className="text-xs text-slate-600 font-bold">
                  {renewTarget.name} <span className="text-[#997A2C]">(#{renewTarget.id})</span>
                </p>
              </div>
            </div>

            <form onSubmit={handleConfirmRenew} className="space-y-4">
              <div>
                <label className="text-[10px] font-black font-cinzel uppercase tracking-wider text-slate-600 block mb-1">
                  Selecciona Decreto / Plan
                </label>
                <select
                  value={renewPlanOption}
                  onChange={(e) => setRenewPlanOption(e.target.value)}
                  className="w-full bg-white border border-[#C5A059] rounded-xl px-3.5 py-2.5 text-xs text-[#0F1E36] font-bold focus:outline-none focus:border-[#0F1E36]"
                >
                  <option value="Mensualidad|$400|30">Mensualidad Olimpo $400 MXN - +30 días</option>
                  <option value="Promo Dúo|2x$700|30">Promo Dúo Olímpico 2x$700 MXN - +30 días</option>
                  <option value="Quincena|$250|15">Quincena Olimpo $250 MXN - +15 días</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setRenewTarget(null)}
                  className="flex-1 bg-white hover:bg-[#F3EFE6] text-slate-700 font-bold text-xs py-2.5 rounded-xl border border-[#C5A059] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-gold-olympus font-cinzel font-black text-xs py-2.5 rounded-xl uppercase tracking-wider cursor-pointer shadow-md"
                >
                  Cobrar & Renovar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
