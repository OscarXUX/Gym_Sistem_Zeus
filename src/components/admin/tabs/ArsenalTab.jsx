import React, { useState } from 'react';

const COLOR_MAP = {
  blue: {
    text: 'text-[#0F1E36]',
    border: 'border-[#C5A059] hover:border-[#0F1E36]',
    bg: 'bg-white',
    badge: 'bg-[#EAE7DC] text-[#0F1E36] border-[#C5A059]',
    iconAlpha: 'text-[#C5A059]/15 group-hover:text-[#C5A059]/25',
    btnBorder: 'border-[#C5A059] hover:border-[#0F1E36] text-[#0F1E36]',
    btnBg: 'bg-[#FAF9F5] hover:bg-[#F3EFE6]'
  },
  rose: {
    text: 'text-rose-900',
    border: 'border-rose-300 hover:border-rose-500',
    bg: 'bg-white',
    badge: 'bg-rose-100 text-rose-800 border-rose-300',
    iconAlpha: 'text-rose-500/10 group-hover:text-rose-500/20',
    btnBorder: 'border-rose-300 hover:border-rose-400 text-rose-800',
    btnBg: 'bg-rose-50 hover:bg-rose-100'
  },
  amber: {
    text: 'text-[#997A2C]',
    border: 'border-[#C5A059] hover:border-[#0F1E36]',
    bg: 'bg-white',
    badge: 'bg-amber-100 text-amber-900 border-amber-300',
    iconAlpha: 'text-amber-500/15 group-hover:text-amber-500/25',
    btnBorder: 'border-[#C5A059] hover:border-[#997A2C] text-[#997A2C]',
    btnBg: 'bg-[#FAF9F5] hover:bg-[#F3EFE6]'
  },
  purple: {
    text: 'text-purple-900',
    border: 'border-purple-300 hover:border-purple-500',
    bg: 'bg-white',
    badge: 'bg-purple-100 text-purple-900 border-purple-300',
    iconAlpha: 'text-purple-500/10 group-hover:text-purple-500/20',
    btnBorder: 'border-purple-300 hover:border-purple-400 text-purple-800',
    btnBg: 'bg-purple-50 hover:bg-purple-100'
  },
  emerald: {
    text: 'text-emerald-900',
    border: 'border-emerald-300 hover:border-emerald-500',
    bg: 'bg-white',
    badge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    iconAlpha: 'text-emerald-500/10 group-hover:text-emerald-500/20',
    btnBorder: 'border-emerald-300 hover:border-emerald-400 text-emerald-800',
    btnBg: 'bg-emerald-50 hover:bg-emerald-100'
  },
  sky: {
    text: 'text-[#0F1E36]',
    border: 'border-[#C5A059] hover:border-[#0F1E36]',
    bg: 'bg-white',
    badge: 'bg-sky-100 text-sky-900 border-sky-300',
    iconAlpha: 'text-sky-500/15 group-hover:text-sky-500/25',
    btnBorder: 'border-[#C5A059] hover:border-[#0F1E36] text-[#0F1E36]',
    btnBg: 'bg-[#FAF9F5] hover:bg-[#F3EFE6]'
  },
  stone: {
    text: 'text-slate-800',
    border: 'border-slate-300 hover:border-slate-500',
    bg: 'bg-white',
    badge: 'bg-slate-100 text-slate-800 border-slate-300',
    iconAlpha: 'text-slate-400/15 group-hover:text-slate-400/25',
    btnBorder: 'border-slate-300 hover:border-slate-400 text-slate-700',
    btnBg: 'bg-[#FAF9F5] hover:bg-[#F3EFE6]'
  }
};

const getItemColor = (item) => {
  if (item?.color && COLOR_MAP[item.color]) return COLOR_MAP[item.color];
  const cat = (item?.category || '').toLowerCase();
  if (cat.includes('bebida') || cat.includes('agua')) return COLOR_MAP.blue;
  if (cat.includes('hype') || cat.includes('pre') || cat.includes('bolt') || cat.includes('rayo')) return COLOR_MAP.amber;
  if (cat.includes('prot') || cat.includes('scoop') || cat.includes('servicio') || cat.includes('ambros')) return COLOR_MAP.emerald;
  if (cat.includes('hidra') || cat.includes('electro') || cat.includes('néctar') || cat.includes('nectar')) return COLOR_MAP.purple;
  if (cat.includes('equipo') || cat.includes('toalla')) return COLOR_MAP.sky;
  return COLOR_MAP.amber;
};

const OFFICIAL_TOUCH_ITEMS = [
  { id: 'p1', name: 'Agua Sagrada 1L', price: 20, icon: 'fa-bottle-water', color: 'blue', desc: 'Hidratación Pura' },
  { id: 'p2', name: 'Rayo Divino (Pre)', price: 35, icon: 'fa-bolt-lightning', color: 'amber', desc: 'Scoop de Rayo' },
  { id: 'p3', name: 'Ambrosía Proteica', price: 30, icon: 'fa-jar', color: 'emerald', desc: 'Scoop del Olimpo' },
  { id: 'p4', name: 'Néctar Electrolitos', price: 15, icon: 'fa-wine-bottle', color: 'purple', desc: 'Recarga Divina' }
];

export default function ArsenalTab({
  todayCash = 0,
  todayEntries = 0,
  cashBreakdown = { memberships: 0, visits: 0, store: 0 },
  arsenalItems = [],
  salesLog = [],
  onSellProduct,
  onAddStock,
  onRestockAll,
  onOpenProductModal,
  onOpenCashCut
}) {
  const [flashId, setFlashId] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  const handleOneTouchSale = (item) => {
    setFlashId(item.id);
    onSellProduct(item.id, item.name, item.price);
    setTimeout(() => setFlashId(null), 450);
  };

  const categories = Array.from(new Set(arsenalItems.map((it) => it.category || 'General')));
  const lowStockCount = arsenalItems.filter((it) => (it.stock || 0) <= 5).length;

  const filteredItems = arsenalItems.filter((item) => {
    let matchCat = true;
    if (filterCategory === 'low') {
      matchCat = (item.stock || 0) <= 5;
    } else if (filterCategory !== 'all') {
      matchCat = (item.category || 'General') === filterCategory;
    }

    const matchSearch =
      !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchCat && matchSearch;
  });

  return (
    <div className="w-full max-w-6xl mx-auto p-3 sm:p-5 space-y-4 animate-fadeIn overflow-x-hidden font-body text-slate-800">
      {/* ================================================================ */}
      {/* 1. HERO: TOTAL DE TESORERÍA HOY                                  */}
      {/* ================================================================ */}
      <div
        onClick={onOpenCashCut}
        className="olympus-card olympus-card--marble border-t-[3px] border-t-[#D4AF37] p-4 sm:p-5 rounded-3xl relative overflow-hidden group cursor-pointer transition-all"
        title="Toca para ver Corte de Caja completo"
      >
        <i className="fa-solid fa-sack-dollar absolute -right-3 -bottom-3 text-7xl sm:text-8xl text-[#C5A059]/15 group-hover:text-[#C5A059]/25 transition-all pointer-events-none"></i>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] sm:text-[11px] text-[#0F1E36] uppercase font-black font-cinzel tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Tesorería del Olimpo Hoy (SQLite)
          </span>
          <span className="text-[10px] text-[#997A2C] group-hover:text-[#0F1E36] font-bold transition-colors flex items-center gap-1">
            Ver desglose <i className="fa-solid fa-chevron-right text-[9px]"></i>
          </span>
        </div>
        <p className="font-cinzel text-2xl sm:text-4xl font-black text-[#0F1E36] mt-1">
          ${Number(todayCash || 0).toLocaleString('es-MX')}
        </p>
        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-[#C5A059]/30 text-[11px] text-slate-600 flex-wrap font-medium">
          <span>Membresías: <strong className="text-[#0F1E36] font-bold">${Number(cashBreakdown.memberships || 0).toLocaleString('es-MX')}</strong></span>
          <span className="text-[#C5A059]">•</span>
          <span>Rayos Veloz: <strong className="text-[#0F1E36] font-bold">${Number(cashBreakdown.visits || 0).toLocaleString('es-MX')}</strong></span>
          <span className="text-[#C5A059]">•</span>
          <span>Néctar & Suplementos: <strong className="text-[#0D9488] font-extrabold">${Number(cashBreakdown.store || 0).toLocaleString('es-MX')}</strong></span>
          <span className="text-[#C5A059]">•</span>
          <span>Entradas: <strong className="text-[#0F1E36] font-bold">{todayEntries ?? 0}</strong></span>
        </div>
      </div>

      {/* ================================================================ */}
      {/* 2. DEBAJO: BOTÓN CORTE DE CAJA                                   */}
      {/* ================================================================ */}
      {onOpenCashCut && (
        <button
          type="button"
          onClick={onOpenCashCut}
          className="w-full btn-gold-olympus font-cinzel font-black text-xs sm:text-sm py-3 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
        >
          <i className="fa-solid fa-cash-register text-xs sm:text-sm text-[#0F1E36]"></i>
          <span>Realizar Corte de Tesorería del Olimpo</span>
        </button>
      )}

      {/* ================================================================ */}
      {/* 3. BOTONES ADD +5 Y AÑADIR NUEVO PRODUCTO                        */}
      {/* ================================================================ */}
      <div className="grid grid-cols-2 gap-3 w-full">
        <button
          type="button"
          onClick={() => onRestockAll && onRestockAll(5)}
          className="bg-[#FAF9F5] hover:bg-[#F3EFE6] border border-[#C5A059] text-[#0F1E36] text-xs font-bold py-2.5 px-3 rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-98 text-center"
          title="Sumar +5 unidades a todos los elíxires y suplementos"
        >
          <i className="fa-solid fa-boxes-packing text-xs text-[#997A2C]"></i>
          <span className="truncate">+5 a Todo el Néctar</span>
        </button>

        <button
          type="button"
          onClick={() => onOpenProductModal && onOpenProductModal(null)}
          className="btn-navy-olympus font-cinzel text-xs font-bold py-2.5 px-3 rounded-2xl flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-all text-center"
          title="Consagrar nuevo producto en el catálogo"
        >
          <i className="fa-solid fa-plus text-xs text-[#FFD700]"></i>
          <span className="truncate">Añadir Nuevo Néctar / Producto</span>
        </button>
      </div>

      {/* ================================================================ */}
      {/* 4. POS RÁPIDA: NÉCTAR DEL OLIMPO EN 1-TOQUE                      */}
      {/* ================================================================ */}
      <div className="olympus-card olympus-card--marble rounded-3xl p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-[#C5A059]/30 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
            <h3 className="font-cinzel text-xs sm:text-sm font-black text-[#0F1E36] uppercase tracking-wider flex items-center gap-2">
              <i className="fa-solid fa-bolt-lightning text-[#D4AF37]"></i>
              Néctar del Olimpo — Venta en 1-Toque
            </h3>
          </div>
          <span className="text-[10px] text-slate-500 font-bold hidden sm:inline">
            Toca una tarjeta para registrar la venta al instante
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
          {OFFICIAL_TOUCH_ITEMS.map((touchItem, idx) => {
            const liveItem = arsenalItems.find((x) => x.id === touchItem.id) || touchItem;
            const isFlashing = flashId === touchItem.id;
            const iconBoxClasses = [
              'bg-gradient-to-br from-[#0284C7] to-[#0369A1] text-white border-[#38BDF8]/50',
              'bg-gradient-to-br from-[#E11D48] to-[#9F1239] text-white border-[#FDA4AF]/50',
              'bg-gradient-to-br from-[#D97706] to-[#92400E] text-white border-[#FDE68A]/50',
              'bg-gradient-to-br from-[#7C3AED] to-[#4C1D95] text-white border-[#C4B5FD]/50'
            ][idx % 4];

            return (
              <button
                key={touchItem.id}
                type="button"
                onClick={() => handleOneTouchSale(touchItem)}
                className={`olympus-supplement-card p-3.5 text-left transition-all cursor-pointer active:scale-95 flex flex-col justify-between gap-2.5 group ${
                  isFlashing ? 'ring-2 ring-emerald-500 scale-[1.02]' : ''
                }`}
              >
                {/* Fila 1 (Superior): Ícono cuadrado 3D de color + Nombre completo en texto oscuro (#0F1E36) */}
                <div className="flex items-center gap-2.5 w-full">
                  <div
                    className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 shadow-[0_4px_8px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.4)] ${iconBoxClasses}`}
                  >
                    <i className={`fa-solid ${touchItem.icon} text-xs`}></i>
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="font-bold text-[#0F1E36] text-xs sm:text-[13px] leading-snug break-words block">
                      {touchItem.name}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium block">
                      Stock: {liveItem.stock ?? 20}
                    </span>
                  </div>
                </div>

                {/* Fila 2 (Inferior): "Disponible" en gris a la izquierda + Precio en Verde Esmeralda (#0D9488) a la derecha */}
                <div className="flex items-center justify-between w-full pt-2 border-t border-[#C5A059]/25">
                  <span className="text-[10px] text-slate-500 font-semibold">Disponible</span>
                  <span className="font-cinzel text-base sm:text-lg font-extrabold text-[#0D9488] leading-none">
                    ${touchItem.price}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================================================================ */}
      {/* 5. CÁPSULAS DE FILTROS, BUSCADOR Y MODO DE VISTA                 */}
      {/* ================================================================ */}
      <div className="olympus-card olympus-card--marble rounded-3xl p-4 space-y-3">
        {/* Fila 1: Cápsulas de Categorías */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => setFilterCategory('all')}
            className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
              filterCategory === 'all'
                ? 'bg-[#0F1E36] text-[#F3E5AB] border-[#C5A059] shadow-sm'
                : 'bg-white hover:bg-[#F3EFE6] text-slate-700 border-[#C5A059]/50'
            }`}
          >
            <span>Todos</span>
            <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-full font-cinzel ${
              filterCategory === 'all' ? 'bg-[#C5A059] text-[#0F1E36]' : 'bg-[#EAE7DC] text-[#0F1E36]'
            }`}>
              {arsenalItems.length}
            </span>
          </button>

          {categories.map((cat) => {
            const isSelected = filterCategory === cat;
            const count = arsenalItems.filter((it) => (it.category || 'General') === cat).length;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setFilterCategory(cat)}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-[#0F1E36] text-[#F3E5AB] border-[#C5A059] shadow-sm'
                    : 'bg-white hover:bg-[#F3EFE6] text-slate-700 border-[#C5A059]/50'
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-full font-cinzel ${
                  isSelected ? 'bg-[#C5A059] text-[#0F1E36]' : 'bg-[#EAE7DC] text-[#0F1E36]'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}

          {lowStockCount > 0 && (
            <button
              type="button"
              onClick={() => setFilterCategory('low')}
              className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                filterCategory === 'low'
                  ? 'bg-amber-100 border-amber-400 text-amber-900 shadow-sm'
                  : 'bg-white hover:bg-amber-50 text-amber-800 border-amber-300'
              }`}
            >
              <span>Bajo Stock</span>
              <span className="text-[10px] font-black px-1.5 py-0.2 rounded-full bg-amber-200 text-amber-900 font-cinzel">
                {lowStockCount}
              </span>
            </button>
          )}
        </div>

        {/* Fila 2: Buscador */}
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase font-cinzel tracking-wider text-slate-600 flex items-center gap-1">
            <i className="fa-solid fa-magnifying-glass text-[#997A2C] text-[10px]"></i>
            <span>Buscar Néctar / Producto por Nombre o Categoría:</span>
          </label>
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar en el catálogo del Olimpo..."
              className="w-full input-tactile-sunken rounded-xl pl-3.5 pr-8 py-2 text-xs text-[#0F1E36] font-bold transition-all"
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

        {/* Fila 3: Switcher de Vista */}
        <div className="flex items-center justify-between pt-1 border-t border-[#C5A059]/30">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-cinzel">
            Modo de Visualización:
          </span>
          <div className="flex items-center gap-1 bg-[#EAE7DC] border border-[#C5A059] p-1 rounded-xl">
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
              <span>Tarjetas</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`py-1 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'table'
                  ? 'bg-[#0F1E36] text-[#F3E5AB] shadow-sm'
                  : 'text-slate-600 hover:text-[#0F1E36]'
              }`}
              title="Vista Filas (Tabla)"
            >
              <i className="fa-solid fa-list text-xs"></i>
              <span>Filas</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================================================================ */}
      {/* 6. VISTA 1: NÉCTAR & SUPLEMENTOS — TARJETAS HERO                 */}
      {/* ================================================================ */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4.5 w-full">
          {filteredItems.length === 0 ? (
            <div className="col-span-full bg-[#FAF9F5] border border-[#C5A059] rounded-3xl p-8 text-center text-slate-500 italic">
              No se encontraron productos con los criterios seleccionados.
            </div>
          ) : (
            filteredItems.map((item) => {
              const c = getItemColor(item);
              const stockClass =
                item.stock > 5
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : item.stock > 0
                  ? 'bg-amber-100 text-amber-800 border-amber-300 animate-pulse'
                  : 'bg-rose-100 text-rose-800 border-rose-300';

              return (
                <div
                  key={item.id}
                  className="bg-white border-2 border-[#C5A059] hover:border-[#0F1E36] rounded-3xl p-4 sm:p-5 relative overflow-hidden group flex flex-col justify-between shadow-sm min-h-[195px] transition-all"
                >
                  {/* Ícono de fondo */}
                  <i
                    className={`fa-solid ${item.icon || 'fa-bottle-water'} absolute -left-4 -bottom-5 text-[8.5rem] sm:text-[10rem] text-[#C5A059]/15 transition-transform group-hover:scale-110 pointer-events-none select-none`}
                  ></i>

                  {/* Sección Superior: Categoría y Existencias */}
                  <div className="relative z-10 flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border bg-[#EAE7DC] text-[#0F1E36] border-[#C5A059]/40 font-cinzel">
                      {item.category || 'General'}
                    </span>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border shrink-0 font-cinzel ${stockClass}`}>
                      {item.stock} uds en stock
                    </span>
                  </div>

                  {/* Sección Media: Nombre y Precio */}
                  <div className="relative z-10 my-1.5">
                    <h4 className="font-cinzel font-black text-base sm:text-lg text-[#0F1E36] truncate">
                      {item.name}
                    </h4>
                    <p className="font-cinzel text-2xl sm:text-3xl font-black text-[#0F1E36] leading-none pt-1">
                      ${item.price}
                    </p>
                  </div>

                  {/* Bloque de Acciones */}
                  <div className="relative z-10 space-y-2 mt-2">
                    <button
                      type="button"
                      onClick={() => onSellProduct(item.id, item.name, item.price)}
                      className="w-full btn-gold-olympus font-cinzel font-black text-xs py-2 px-3 rounded-xl uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-all"
                    >
                      <i className="fa-solid fa-cart-plus text-xs text-[#0F1E36]"></i>
                      <span>Vender</span>
                    </button>

                    <div className="grid grid-cols-3 gap-1.5 w-full">
                      <button
                        type="button"
                        onClick={() => onAddStock(item.id, 1)}
                        className="bg-[#FAF9F5] hover:bg-[#F3EFE6] border border-[#C5A059] active:scale-95 text-[11px] font-bold text-[#0F1E36] py-1.5 rounded-xl cursor-pointer transition-all shadow-sm text-center font-cinzel"
                        title="Sumar 1 unidad"
                      >
                        +1
                      </button>
                      <button
                        type="button"
                        onClick={() => onAddStock(item.id, 5)}
                        className="bg-[#FAF9F5] hover:bg-[#F3EFE6] border border-[#C5A059] active:scale-95 text-[11px] font-bold text-[#0F1E36] py-1.5 rounded-xl cursor-pointer transition-all shadow-sm text-center font-cinzel"
                        title="Sumar 5 unidades"
                      >
                        +5
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenProductModal(item.id)}
                        className="bg-white hover:bg-[#F3EFE6] border border-[#C5A059] active:scale-95 text-slate-700 hover:text-[#0F1E36] text-[11px] font-bold py-1.5 rounded-xl cursor-pointer transition-all shadow-sm flex items-center justify-center gap-1 text-center font-cinzel"
                        title="Editar producto"
                      >
                        <i className="fa-solid fa-pen text-[9px] text-[#997A2C]"></i>
                        <span>Editar</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ================================================================ */}
      {/* 7. VISTA 2: NÉCTAR & SUPLEMENTOS — TABLA / FILAS                 */}
      {/* ================================================================ */}
      {viewMode === 'table' && (
        <div className="olympus-card olympus-card--marble rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-[#D4AF37] bg-gradient-to-r from-[#0F1E36] via-[#162A4A] to-[#0F1E36] text-[10px] font-black font-cinzel text-[#F3E5AB] uppercase tracking-wider">
                  <th className="px-4 sm:px-6 py-3.5">Producto</th>
                  <th className="px-6 py-3.5 hidden md:table-cell">Categoría</th>
                  <th className="px-4 sm:px-6 py-3.5">Precio</th>
                  <th className="px-3 sm:px-6 py-3.5">Existencias</th>
                  <th className="px-4 sm:px-6 py-3.5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#C5A059]/20 text-xs">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-slate-500 italic">
                      No se encontraron productos con los criterios seleccionados.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => {
                    const c = getItemColor(item);
                    const stockClass =
                      item.stock > 5
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : item.stock > 0
                        ? 'bg-amber-100 text-amber-800 border-amber-300 animate-pulse'
                        : 'bg-rose-100 text-rose-800 border-rose-300';

                    return (
                      <tr key={item.id} className="olympus-table-row bg-white">
                        <td className="px-4 sm:px-6 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#FAF9F5] border border-[#C5A059] flex items-center justify-center text-[#997A2C] shrink-0 shadow-[inset_0_2px_4px_rgba(15,30,54,0.12)] text-base">
                              <i className={`fa-solid ${item.icon || 'fa-bottle-water'}`}></i>
                            </div>
                            <div className="min-w-0">
                              <span className="font-cinzel font-bold text-[#0F1E36] text-xs sm:text-sm block truncate">
                                {item.name}
                              </span>
                              <span className="text-[10px] text-slate-500 md:hidden block">
                                {item.category || 'General'}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-3.5 hidden md:table-cell">
                          <span className="text-xs text-slate-700 font-semibold">{item.category || 'General'}</span>
                        </td>

                        <td className="px-4 sm:px-6 py-3.5">
                          <span className="font-cinzel text-sm sm:text-base font-extrabold text-[#0D9488]">
                            ${item.price}
                          </span>
                        </td>

                        <td className="px-3 sm:px-6 py-3.5">
                          <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border font-cinzel ${stockClass}`}>
                            {item.stock} uds
                          </span>
                        </td>

                        <td className="px-4 sm:px-6 py-3.5 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => onSellProduct(item.id, item.name, item.price)}
                              className="btn-gold-olympus text-[#0F1E36] font-cinzel font-black text-[10px] py-1.5 px-3 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm cursor-pointer transition-all"
                              title="Registrar venta directa"
                            >
                              <i className="fa-solid fa-cart-plus text-[10px]"></i>
                              <span>Vender</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => onAddStock(item.id, 1)}
                              className="bg-[#FAF9F5] hover:bg-[#F3EFE6] border border-[#C5A059] text-[#0F1E36] text-[10px] font-bold py-1.5 px-2 rounded-lg cursor-pointer transition-all font-cinzel"
                              title="Sumar 1 unidad"
                            >
                              +1
                            </button>
                            <button
                              type="button"
                              onClick={() => onAddStock(item.id, 5)}
                              className="bg-[#FAF9F5] hover:bg-[#F3EFE6] border border-[#C5A059] text-[#0F1E36] text-[10px] font-bold py-1.5 px-2 rounded-lg cursor-pointer transition-all font-cinzel"
                              title="Sumar 5 unidades"
                            >
                              +5
                            </button>
                            <button
                              type="button"
                              onClick={() => onOpenProductModal(item.id)}
                              className="bg-white hover:bg-[#F3EFE6] border border-[#C5A059] text-slate-600 hover:text-[#0F1E36] p-1.5 rounded-lg text-xs cursor-pointer shadow-sm"
                              title="Editar producto"
                            >
                              <i className="fa-solid fa-pen text-[10px] text-[#997A2C]"></i>
                            </button>
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
      {/* 8. REGISTRO DE MOVIMIENTOS Y VENTAS DEL DÍA                      */}
      {/* ================================================================ */}
      <div className="bg-[#FAF9F5] border border-[#C5A059] rounded-3xl p-4 sm:p-5 shadow-sm">
        <h3 className="font-cinzel text-xs sm:text-sm font-black text-[#0F1E36] uppercase mb-3 flex items-center gap-2">
          <i className="fa-solid fa-clock-rotate-left text-[#C5A059]"></i> Registro de Elíxires & Suplementos del Día
        </h3>
        <div className="space-y-1.5 max-h-56 overflow-y-auto scrollbar-thin">
          {(!salesLog || salesLog.length === 0) ? (
            <p className="text-xs text-slate-500 italic py-3 text-center">No hay ventas registradas aún hoy.</p>
          ) : (
            salesLog.map((log, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-white border border-[#C5A059]/40 px-3 py-2 rounded-xl text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-2 h-2 rounded-full ${log.isSale ? 'bg-emerald-500' : 'bg-amber-400'}`}></span>
                  <span className="text-[#0F1E36] font-semibold">{log.text}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`font-cinzel font-bold ${log.isSale ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {log.badgeText}
                  </span>
                  <span className="text-[10px] text-slate-500 font-cinzel">{log.time}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
