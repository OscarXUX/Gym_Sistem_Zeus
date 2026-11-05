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
    { id: 'all', label: 'Todos', count: members.length, color: 'text-stone-300' },
    { id: 'inside', label: 'Dentro', count: insideCount, color: 'text-emerald-400', activeClass: 'bg-emerald-950/60 border-emerald-500/80 text-emerald-300 shadow-emerald-950/40' },
    { id: 'active', label: 'Activos', count: activeCount, color: 'text-emerald-400', activeClass: 'bg-emerald-950/60 border-emerald-500/80 text-emerald-300' },
    { id: 'warning', label: 'Por Vencer', count: warningCount, color: 'text-amber-400', activeClass: 'bg-amber-950/60 border-amber-500/80 text-amber-300' },
    { id: 'expired', label: 'Vencidos', count: expiredCount, color: 'text-rose-400', activeClass: 'bg-rose-950/60 border-rose-500/80 text-rose-300' }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-3 sm:p-5 space-y-4 animate-fadeIn overflow-x-hidden">
      {/* ================================================================ */}
      {/* HERO BANNER: RECLUTAR GUERRERO                                    */}
      {/* ================================================================ */}
      <div
        onClick={onOpenNewMember}
        className="bg-gradient-to-br from-red-950/60 via-stone-900 to-[#0a0a0a] border-2 border-red-600/60 hover:border-red-500 p-4 sm:p-5 rounded-2xl relative overflow-hidden group cursor-pointer transition-all shadow-xl shadow-red-950/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5"
      >
        <i className="fa-solid fa-user-plus absolute -right-3 -bottom-3 text-7xl sm:text-8xl text-red-500/10 group-hover:text-red-500/20 transition-all pointer-events-none"></i>
        <div className="min-w-0 z-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-red-400">
              Alta Rápida de Socios
            </span>
            <span className="text-[10px] text-stone-400">• SQLite GEARS</span>
          </div>
          <h2 className="font-gears text-xl sm:text-2xl font-black text-white leading-tight">
            Reclutar Nuevo Guerrero
          </h2>
          <p className="text-xs text-stone-300 mt-1">
            Alta inmediata, captura fotográfica con cámara o archivo y cobro en caja en 1 toque.
          </p>
        </div>

        <div className="shrink-0 z-10">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenNewMember();
            }}
            className="w-full sm:w-auto bg-red-600 hover:bg-red-500 active:scale-95 text-white font-black text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-950/50 cursor-pointer transition-all"
          >
            <i className="fa-solid fa-user-plus text-xs"></i>
            <span>+ Iniciar Reclutamiento</span>
          </button>
        </div>
      </div>

      {/* ================================================================ */}
      {/* ACCESO RÁPIDO: AFORO EN VIVO (LLEVA A LA VISTA DE AFORO)         */}
      {/* ================================================================ */}
      <button
        type="button"
        onClick={() => onOpenAforo && onOpenAforo()}
        className="w-full bg-gradient-to-r from-emerald-950/60 via-stone-900 to-[#0a0a0a] border-2 border-emerald-500/60 hover:border-emerald-400 p-3 sm:p-4 rounded-2xl relative overflow-hidden group cursor-pointer transition-all shadow-xl shadow-emerald-950/20 flex items-center justify-between gap-3 text-left active:scale-[0.99]"
        title="Ir a la vista de aforo en vivo de guerreros dentro del gimnasio"
      >
        <i className="fa-solid fa-users-viewfinder absolute -right-2 -bottom-2 text-6xl sm:text-7xl text-emerald-500/10 group-hover:text-emerald-500/20 transition-all pointer-events-none"></i>
        <div className="flex items-center gap-3 z-10 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/60 flex items-center justify-center text-emerald-400 shrink-0 shadow-inner">
            <i className="fa-solid fa-user-check text-lg"></i>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                Aforo en Vivo
              </span>
              <span className="text-[10px] text-stone-400 hidden xs:inline">• Tiempo Real</span>
            </div>
            <p className="font-gears text-sm sm:text-base font-black text-white truncate">
              {insideCount} {insideCount === 1 ? 'Guerrero Dentro' : 'Guerreros Dentro'} Entrenando
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 z-10 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs py-2 px-3 sm:px-4 rounded-xl shadow-md transition-all">
          <span>Ver Aforo en Vivo</span>
          <i className="fa-solid fa-chevron-right text-[10px] ml-0.5"></i>
        </div>
      </button>

      {/* ================================================================ */}
      {/* CÁPSULAS DE FILTRO Y SELECTOR DE VISTA (GRID / TABLA)            */}
      {/* ================================================================ */}
      <div className="bg-[#0a0a0a] border border-stone-800 rounded-2xl p-3.5 space-y-3 shadow-lg">
        {/* Fila Superior: Cápsulas de Filtro y Switcher de Vista */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
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
                      ? cap.activeClass || 'bg-red-600 text-white border-red-500 shadow-md shadow-red-950/40'
                      : 'bg-stone-900/80 hover:bg-stone-800 text-stone-400 border-stone-800'
                  }`}
                >
                  <span>{cap.label}</span>
                  <span
                    className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-black/40 text-white' : 'bg-stone-800 text-stone-300'
                    }`}
                  >
                    {cap.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Switcher de Vista (Cuadrícula / Tabla) */}
          <div className="flex items-center gap-1 bg-stone-900 border border-stone-800 p-1 rounded-xl self-end sm:self-auto shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`py-1 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'grid'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-stone-400 hover:text-white'
              }`}
              title="Vista Cuadrícula (Tarjetas)"
            >
              <i className="fa-solid fa-table-cells-large text-xs"></i>
              <span className="hidden xs:inline">Tarjetas</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`py-1 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'table'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-stone-400 hover:text-white'
              }`}
              title="Vista Tabla (Filas)"
            >
              <i className="fa-solid fa-list text-xs"></i>
              <span className="hidden xs:inline">Tabla</span>
            </button>
          </div>
        </div>

        {/* Fila Inferior: Buscador con Instrucción Explícita (Placeholder desaparece) */}
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase tracking-wider text-stone-400 block flex items-center gap-1">
            <i className="fa-solid fa-magnifying-glass text-red-500 text-[10px]"></i>
            <span>Buscar Guerrero por Nombre, PIN/ID o Teléfono:</span>
          </label>
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 focus:border-red-600 rounded-xl pl-3.5 pr-8 py-2 text-xs text-white font-bold focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-stone-500 hover:text-white text-xs cursor-pointer"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full">
          {filteredMembers.length === 0 ? (
            <div className="col-span-full bg-[#0a0a0a] border border-stone-800 rounded-2xl p-8 text-center text-stone-500 italic">
              No se encontraron guerreros con los criterios seleccionados.
            </div>
          ) : (
            filteredMembers.map((m) => {
              let statusBadge = (
                <span className="text-emerald-400 bg-emerald-950/60 border border-emerald-900/60 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                  Activo ({m.days}d)
                </span>
              );
              if (m.status === 'warning') {
                statusBadge = (
                  <span className="text-amber-400 bg-amber-950/60 border border-amber-900/60 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                    Aviso ({m.days}d)
                  </span>
                );
              } else if (m.status === 'expired') {
                statusBadge = (
                  <span className="text-rose-400 bg-rose-950/60 border border-rose-900/60 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                    Vencido ({Math.abs(m.days)}d)
                  </span>
                );
              }

              return (
                <div
                  key={m.id}
                  onClick={() => onOpenEditMember(m.id)}
                  className="bg-[#0a0a0a] border border-stone-800 hover:border-red-600/60 p-3.5 rounded-2xl relative group cursor-pointer transition-all shadow-md space-y-3 flex flex-col justify-between"
                  title="Toca la tarjeta para editar los datos del guerrero"
                >
                  {/* Encabezado de la Tarjeta: Foto + Datos */}
                  <div className="flex items-center gap-3">
                    <div className="relative shrink-0">
                      <img
                        src={m.photo}
                        alt={m.name}
                        className="w-12 h-12 rounded-xl object-cover border border-stone-700 bg-stone-900"
                      />
                      <span
                        className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-[#0a0a0a] ${
                          m.isInside ? 'bg-emerald-500' : 'bg-stone-600'
                        }`}
                        title={m.isInside ? 'Entrenando dentro' : 'Fuera del gym'}
                      ></span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="font-gears font-black text-sm text-white truncate group-hover:text-red-400 transition-colors">
                          {m.name}
                        </h4>
                        <span className="text-[10px] font-gears font-bold px-1.5 py-0.5 rounded bg-stone-900 text-stone-300 border border-stone-800 shrink-0">
                          #{m.id}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-400 truncate mt-0.5">
                        {m.phone ? `📞 ${m.phone}` : 'Sin teléfono'}
                      </p>
                    </div>
                  </div>

                  {/* Estado y Plan */}
                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-stone-800/60 text-xs">
                    <div>
                      <span className="text-stone-300 font-bold block leading-none">{m.plan}</span>
                      <span className="text-[10px] text-emerald-400 font-gears font-bold">{m.price}</span>
                    </div>
                    <div>{statusBadge}</div>
                  </div>

                  {/* Barra de Acciones Operativas (Con Detención de Propagación) */}
                  <div className="flex items-center justify-between gap-1.5 pt-2 border-t border-stone-800/80">
                    {/* Botón Simular Huella */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onScanMember && onScanMember(m.id);
                      }}
                      className="bg-emerald-950/60 hover:bg-emerald-800 border border-emerald-600/50 text-emerald-300 text-[10px] font-bold py-1.5 px-2.5 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                      title="Simular paso de huella biométrica"
                    >
                      <i className="fa-solid fa-fingerprint text-xs"></i>
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
                      className={`${
                        m.status === 'expired'
                          ? 'bg-red-600 hover:bg-red-500 text-white'
                          : 'bg-amber-600/20 hover:bg-amber-600/40 border border-amber-500/40 text-amber-300'
                      } text-[10px] font-black py-1.5 px-2.5 rounded-lg flex items-center gap-1 cursor-pointer transition-colors`}
                      title="Renovar membresía"
                    >
                      <i className="fa-solid fa-rotate text-xs"></i>
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
                          ? 'bg-emerald-950/40 border-emerald-800 text-emerald-400'
                          : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-white'
                      }`}
                      title={m.isInside ? 'Marcar Salida' : 'Marcar Entrada'}
                    >
                      {m.isInside ? 'Dentro' : 'Fuera'}
                    </button>

                    {/* Botón Eliminar (Visible en Móvil y Desktop) */}
                    {onDeleteMember && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`¿Estás seguro de eliminar a ${m.name}?`)) {
                            onDeleteMember(m.id);
                          }
                        }}
                        className="bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 py-1.5 px-2.5 rounded-lg text-xs cursor-pointer transition-colors"
                        title="Eliminar socio permanentemente"
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
        <div className="bg-[#0a0a0a] border border-stone-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-800 bg-stone-950/80 text-[10px] font-black text-stone-400 uppercase tracking-wider">
                  <th className="px-3.5 sm:px-5 py-3.5">Guerrero</th>
                  <th className="px-5 py-3.5 hidden md:table-cell">Plan / Precio</th>
                  <th className="px-2.5 sm:px-5 py-3.5">Estado</th>
                  <th className="px-5 py-3.5 text-center hidden sm:table-cell">Presencia</th>
                  <th className="px-3.5 sm:px-5 py-3.5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60 text-xs">
                {filteredMembers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-stone-500 italic">
                      No se encontraron guerreros con los criterios seleccionados.
                    </td>
                  </tr>
                ) : (
                  filteredMembers.map((m) => {
                    let statusBadge = (
                      <span className="inline-block text-emerald-400 bg-emerald-950/50 border border-emerald-900/50 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded text-[9px] sm:text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">
                        Activo ({m.days}d)
                      </span>
                    );
                    if (m.status === 'warning') {
                      statusBadge = (
                        <span className="inline-block text-amber-400 bg-amber-950/50 border border-amber-900/50 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded text-[9px] sm:text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">
                          Aviso ({m.days}d)
                        </span>
                      );
                    } else if (m.status === 'expired') {
                      statusBadge = (
                        <span className="inline-block text-rose-400 bg-rose-950/50 border border-rose-900/50 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded text-[9px] sm:text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">
                          Vencido ({Math.abs(m.days)}d)
                        </span>
                      );
                    }

                    return (
                      <tr
                        key={m.id}
                        onClick={() => onOpenEditMember(m.id)}
                        className="hover:bg-stone-900/40 transition-colors cursor-pointer group"
                        title="Toca para editar datos"
                      >
                        <td className="px-3.5 sm:px-5 py-3.5 sm:py-4">
                          <div className="flex items-center gap-2.5 sm:gap-3">
                            <div className="relative shrink-0">
                              <img
                                src={m.photo}
                                alt={m.name}
                                className="w-10 h-10 rounded-full object-cover border border-stone-700"
                              />
                              <span
                                className={`sm:hidden absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#0a0a0a] ${
                                  m.isInside ? 'bg-emerald-500' : 'bg-stone-600'
                                }`}
                              ></span>
                            </div>
                            <div className="min-w-0">
                              <span className="font-bold text-white text-xs sm:text-sm block truncate group-hover:text-red-400 transition-colors">
                                {m.name}
                              </span>
                              <span className="text-[10px] text-stone-500 font-gears block">
                                PIN: <strong className="text-stone-300">#{m.id}</strong>
                                {m.phone ? ` · 📞 ${m.phone}` : ''}
                                <span className="md:hidden text-stone-400"> · {m.plan}</span>
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 hidden md:table-cell">
                          <span className="text-xs text-stone-300 font-bold">{m.plan}</span> <br />
                          <span className="text-[10px] text-emerald-400 font-gears font-bold">{m.price}</span>
                        </td>
                        <td className="px-2.5 sm:px-5 py-3.5 sm:py-4">{statusBadge}</td>
                        <td className="px-5 py-4 text-center text-xs hidden sm:table-cell">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleInside(m.id);
                            }}
                            className={`font-bold cursor-pointer transition-colors ${
                              m.isInside ? 'text-emerald-500 hover:text-emerald-300' : 'text-stone-500 hover:text-stone-300'
                            }`}
                            title={m.isInside ? 'Registrar Salida' : 'Registrar Entrada'}
                          >
                            <i className={`fa-solid ${m.isInside ? 'fa-check' : 'fa-minus'} mr-1`}></i>
                            {m.isInside ? 'Dentro' : 'Fuera'}
                          </button>
                        </td>
                        <td className="px-3.5 sm:px-5 py-3.5 sm:py-4 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5">
                            {/* Pasar Huella */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onScanMember && onScanMember(m.id);
                              }}
                              className="bg-emerald-950/60 hover:bg-emerald-800 active:scale-95 border border-emerald-600/50 text-emerald-300 text-[10px] font-black px-2.5 py-1.5 rounded-lg cursor-pointer shadow flex items-center gap-1"
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
                              className={`${
                                m.status === 'expired'
                                  ? 'bg-red-600 hover:bg-red-500 text-white'
                                  : 'bg-amber-600/20 hover:bg-amber-600/40 border border-amber-500/40 text-amber-300'
                              } active:scale-95 text-[10px] font-black px-2.5 py-1.5 rounded-lg cursor-pointer shadow flex items-center gap-1`}
                              title="Renovar membresía"
                            >
                              <i className="fa-solid fa-rotate"></i>
                              <span>Renovar</span>
                            </button>

                            {/* Eliminar (Ahora visible en móvil y desktop) */}
                            {onDeleteMember && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (confirm(`¿Estás seguro de eliminar a ${m.name}?`)) {
                                    onDeleteMember(m.id);
                                  }
                                }}
                                className="bg-rose-950/60 hover:bg-rose-900 px-2.5 py-1.5 rounded-lg border border-rose-800 text-xs font-bold text-rose-300 cursor-pointer"
                                title="Dar de baja socio permanentemente"
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
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[110] flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#0a0a0a] border border-amber-600/50 rounded-3xl p-5 sm:p-6 w-full max-w-sm shadow-2xl relative">
            <button
              onClick={() => setRenewTarget(null)}
              className="absolute top-4 right-4 text-stone-500 hover:text-white cursor-pointer"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            <div className="flex items-center gap-3 mb-4">
              <img
                src={renewTarget.photo}
                alt={renewTarget.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-amber-500"
              />
              <div>
                <h4 className="font-gears text-base font-black text-white">Renovar Membresía</h4>
                <p className="text-xs text-stone-300 font-bold">
                  {renewTarget.name} <span className="text-stone-500">(#{renewTarget.id})</span>
                </p>
              </div>
            </div>

            <form onSubmit={handleConfirmRenew} className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-stone-400 block mb-1">
                  Selecciona Plan a Cobrar
                </label>
                <select
                  value={renewPlanOption}
                  onChange={(e) => setRenewPlanOption(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-amber-500"
                >
                  <option value="Mensualidad|$400|30">Mensualidad $400 MXN - +30 días</option>
                  <option value="Promo Dúo|2x$700|30">Promo Dúo 2x$700 MXN - +30 días</option>
                  <option value="Quincena|$250|15">Quincena $250 MXN - +15 días</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setRenewTarget(null)}
                  className="flex-1 bg-stone-900 hover:bg-stone-800 text-stone-300 font-bold text-xs py-2.5 rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-black text-xs py-2.5 rounded-xl uppercase tracking-wider cursor-pointer shadow-lg shadow-emerald-900/40"
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
