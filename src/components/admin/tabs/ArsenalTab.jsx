import React, { useState } from 'react';

const COLOR_MAP = {
  blue: {
    text: 'text-blue-400',
    border: 'border-blue-500/60 hover:border-blue-400',
    bg: 'from-blue-900/80 via-stone-900 to-[#0a0a0a]',
    shadow: 'shadow-blue-950/40',
    badge: 'bg-blue-950/70 text-blue-300 border-blue-600/60',
    iconAlpha: 'text-blue-500/20 group-hover:text-blue-500/30',
    btnBorder: 'border-blue-600/60 hover:border-blue-400 text-blue-300 hover:text-white',
    btnBg: 'bg-blue-950/40 hover:bg-blue-900/60'
  },
  rose: {
    text: 'text-rose-400',
    border: 'border-rose-500/60 hover:border-rose-400',
    bg: 'from-rose-900/80 via-stone-900 to-[#0a0a0a]',
    shadow: 'shadow-rose-950/40',
    badge: 'bg-rose-950/70 text-rose-300 border-rose-600/60',
    iconAlpha: 'text-rose-500/20 group-hover:text-rose-500/30',
    btnBorder: 'border-rose-600/60 hover:border-rose-400 text-rose-300 hover:text-white',
    btnBg: 'bg-rose-950/40 hover:bg-rose-900/60'
  },
  amber: {
    text: 'text-amber-400',
    border: 'border-amber-500/60 hover:border-amber-400',
    bg: 'from-amber-900/80 via-stone-900 to-[#0a0a0a]',
    shadow: 'shadow-amber-950/40',
    badge: 'bg-amber-950/70 text-amber-300 border-amber-600/60',
    iconAlpha: 'text-amber-500/20 group-hover:text-amber-500/30',
    btnBorder: 'border-amber-600/60 hover:border-amber-400 text-amber-300 hover:text-white',
    btnBg: 'bg-amber-950/40 hover:bg-amber-900/60'
  },
  purple: {
    text: 'text-purple-400',
    border: 'border-purple-500/60 hover:border-purple-400',
    bg: 'from-purple-900/80 via-stone-900 to-[#0a0a0a]',
    shadow: 'shadow-purple-950/40',
    badge: 'bg-purple-950/70 text-purple-300 border-purple-600/60',
    iconAlpha: 'text-purple-500/20 group-hover:text-purple-500/30',
    btnBorder: 'border-purple-600/60 hover:border-purple-400 text-purple-300 hover:text-white',
    btnBg: 'bg-purple-950/40 hover:bg-purple-900/60'
  },
  emerald: {
    text: 'text-emerald-400',
    border: 'border-emerald-500/60 hover:border-emerald-400',
    bg: 'from-emerald-900/80 via-stone-900 to-[#0a0a0a]',
    shadow: 'shadow-emerald-950/40',
    badge: 'bg-emerald-950/70 text-emerald-300 border-emerald-600/60',
    iconAlpha: 'text-emerald-500/20 group-hover:text-emerald-500/30',
    btnBorder: 'border-emerald-600/60 hover:border-emerald-400 text-emerald-300 hover:text-white',
    btnBg: 'bg-emerald-950/40 hover:bg-emerald-900/60'
  },
  stone: {
    text: 'text-stone-300',
    border: 'border-stone-500/60 hover:border-stone-400',
    bg: 'from-stone-800/80 via-stone-900 to-[#0a0a0a]',
    shadow: 'shadow-stone-950/40',
    badge: 'bg-stone-900 text-stone-300 border-stone-600/60',
    iconAlpha: 'text-stone-400/20 group-hover:text-stone-300/30',
    btnBorder: 'border-stone-600/60 hover:border-stone-400 text-stone-300 hover:text-white',
    btnBg: 'bg-stone-900/60 hover:bg-stone-800/80'
  }
};

// Determina el esquema de color por propiedad o categoría
const getItemColor = (item) => {
  if (item?.color && COLOR_MAP[item.color]) return COLOR_MAP[item.color];
  const cat = (item?.category || '').toLowerCase();
  if (cat.includes('bebida') || cat.includes('agua')) return COLOR_MAP.blue;
  if (cat.includes('hype') || cat.includes('pre') || cat.includes('bolt')) return COLOR_MAP.rose;
  if (cat.includes('prot') || cat.includes('scoop') || cat.includes('servicio') || cat.includes('jar')) return COLOR_MAP.amber;
  if (cat.includes('hidra') || cat.includes('electro')) return COLOR_MAP.purple;
  if (cat.includes('equipo') || cat.includes('toalla')) return COLOR_MAP.stone;
  return COLOR_MAP.amber;
};

const OFFICIAL_TOUCH_ITEMS = [
  { id: 'p1', name: 'Agua 1L', price: 20, icon: 'fa-bottle-water', color: 'blue', desc: 'Hidratación Pura' },
  { id: 'p2', name: 'Pre-Entreno Hype', price: 35, icon: 'fa-bolt', color: 'rose', desc: 'Scoop Explosivo' },
  { id: 'p3', name: 'Proteína Whey', price: 30, icon: 'fa-jar', color: 'amber', desc: 'Scoop Recuperación' },
  { id: 'p4', name: 'Electrolitos', price: 15, icon: 'fa-wine-bottle', color: 'purple', desc: 'Recarga Mineral' }
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

  // Venta instantánea con efecto flash
  const handleOneTouchSale = (item) => {
    setFlashId(item.id);
    onSellProduct(item.id, item.name, item.price);
    setTimeout(() => setFlashId(null), 450);
  };

  // Categorías dinámicas
  const categories = Array.from(new Set(arsenalItems.map((it) => it.category || 'General')));
  const lowStockCount = arsenalItems.filter((it) => (it.stock || 0) <= 5).length;

  // Filtrado de inventario
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
    <div className="w-full max-w-6xl mx-auto p-3 sm:p-5 space-y-4 animate-fadeIn overflow-x-hidden">
      {/* ================================================================ */}
      {/* 1. HERO: TOTAL DE CAJA HOY                                       */}
      {/* ================================================================ */}
      <div
        onClick={onOpenCashCut}
        className="bg-gradient-to-br from-emerald-950/60 via-stone-900 to-[#0a0a0a] border-2 border-emerald-500/60 hover:border-emerald-400 p-4 sm:p-5 rounded-3xl relative overflow-hidden group cursor-pointer transition-all shadow-xl shadow-emerald-950/30"
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
          ${Number(todayCash || 0).toLocaleString('es-MX')}
        </p>
        <div className="flex items-center gap-3 mt-3 pt-2.5 border-t border-emerald-900/40 text-[10px] text-stone-400 flex-wrap">
          <span>Membresías: <strong className="text-white">${Number(cashBreakdown.memberships || 0).toLocaleString('es-MX')}</strong></span>
          <span>•</span>
          <span>Visitas: <strong className="text-white">${Number(cashBreakdown.visits || 0).toLocaleString('es-MX')}</strong></span>
          <span>•</span>
          <span>Arsenal Tienda: <strong className="text-white">${Number(cashBreakdown.store || 0).toLocaleString('es-MX')}</strong></span>
          <span>•</span>
          <span>Entradas: <strong className="text-white">{todayEntries ?? 0}</strong></span>
        </div>
      </div>

      {/* ================================================================ */}
      {/* 2. DEBAJO: BOTÓN CORTE DE CAJA                                   */}
      {/* ================================================================ */}
      {onOpenCashCut && (
        <button
          type="button"
          onClick={onOpenCashCut}
          className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-black text-xs sm:text-sm py-2.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 cursor-pointer transition-all"
        >
          <i className="fa-solid fa-cash-register text-xs sm:text-sm"></i>
          <span>Realizar Corte de Caja Diario</span>
        </button>
      )}

      {/* ================================================================ */}
      {/* 3. DEBAJO: BOTONES ADD +5 Y AÑADIR NUEVO PRODUCTO EN MISMA ROW    */}
      {/* ================================================================ */}
      <div className="grid grid-cols-2 gap-2 w-full">
        <button
          type="button"
          onClick={() => onRestockAll && onRestockAll(5)}
          className="bg-amber-950/40 hover:bg-amber-900/60 border border-amber-600/50 text-amber-400 hover:text-white text-xs font-bold py-2.5 px-3 rounded-2xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-98 text-center"
          title="Sumar +5 unidades a todos los productos del inventario"
        >
          <i className="fa-solid fa-boxes-packing text-xs"></i>
          <span className="truncate">+5 a Todo el Stock</span>
        </button>

        <button
          type="button"
          onClick={() => onOpenProductModal && onOpenProductModal(null)}
          className="bg-red-600 hover:bg-red-500 active:scale-98 text-white font-bold text-xs py-2.5 px-3 rounded-2xl flex items-center justify-center gap-1.5 shadow-lg shadow-red-950/40 cursor-pointer transition-all text-center"
          title="Dar de alta nuevo producto en el catálogo"
        >
          <i className="fa-solid fa-plus text-xs"></i>
          <span className="truncate">Añadir Nuevo Producto</span>
        </button>
      </div>

      {/* ================================================================ */}
      {/* 4. POS RÁPIDA: TARJETAS CON ÍCONO ALFA EN ESQUINA INFERIOR IZQ   */}
      {/* ================================================================ */}
      <div className="bg-[#0a0a0a] border border-stone-800 rounded-3xl p-3.5 sm:p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-stone-800/80 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <h3 className="font-gears text-xs sm:text-sm font-black text-white uppercase tracking-wider">
              POS Rápida — Venta en 1-Toque
            </h3>
          </div>
          <span className="text-[10px] text-stone-400 font-bold hidden sm:inline">
            Toca una tarjeta para cobrar al instante
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
          {OFFICIAL_TOUCH_ITEMS.map((touchItem) => {
            const liveItem = arsenalItems.find((x) => x.id === touchItem.id) || touchItem;
            const c = getItemColor(touchItem);
            const isFlashing = flashId === touchItem.id;

            return (
              <button
                key={touchItem.id}
                type="button"
                onClick={() => handleOneTouchSale(touchItem)}
                className={`relative overflow-hidden rounded-3xl p-3 sm:p-3.5 text-left border-2 transition-all cursor-pointer active:scale-95 flex flex-col justify-between min-h-[135px] sm:min-h-[145px] shadow-xl group ${
                  isFlashing
                    ? 'bg-emerald-700/50 border-emerald-400 scale-[1.02] shadow-[0_0_30px_rgba(16,185,129,0.6)]'
                    : `bg-gradient-to-br ${c.bg} ${c.border} ${c.shadow}`
                }`}
              >
                {/* Ícono de fondo coloreado aún más grande con valor alfa en la esquina inferior izquierda */}
                <i
                  className={`fa-solid ${touchItem.icon} absolute -left-4 -bottom-4 text-[6.75rem] sm:text-[7.75rem] ${c.iconAlpha} transition-transform group-hover:scale-110 pointer-events-none select-none`}
                ></i>

                {/* Fila Superior: Precio Verde Gigante a la derecha */}
                <div className="flex justify-end w-full relative z-10">
                  <span className="font-gears text-2xl sm:text-3xl font-black text-emerald-400 leading-none drop-shadow-md">
                    ${touchItem.price}
                  </span>
                </div>

                {/* Fila Inferior: Nombre a la izquierda y Stock a la derecha */}
                <div className="relative z-10 flex items-end justify-between w-full pt-1">
                  <div className="min-w-0 pr-1.5">
                    <p className="font-gears font-black text-white text-xs sm:text-sm leading-tight drop-shadow truncate">
                      {touchItem.name}
                    </p>
                    <span className="text-[10px] text-stone-300 font-semibold block truncate mt-0.5">
                      {touchItem.desc}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-stone-200 bg-black/85 border border-stone-700/80 px-2 py-0.5 rounded-md shrink-0 shadow">
                    Stock: {liveItem.stock ?? 20}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================================================================ */}
      {/* 5. CÁPSULAS DE FILTROS, BUSCADOR Y SELECTOR DE VISTA             */}
      {/* ================================================================ */}
      <div className="bg-[#0a0a0a] border border-stone-800 rounded-3xl p-3.5 space-y-3 shadow-lg">
        {/* Fila 1: Cápsulas de Categorías */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => setFilterCategory('all')}
            className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
              filterCategory === 'all'
                ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-950/40'
                : 'bg-stone-900/80 hover:bg-stone-800 text-stone-400 border-stone-800'
            }`}
          >
            <span>Todos</span>
            <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
              filterCategory === 'all' ? 'bg-black/40 text-white' : 'bg-stone-800 text-stone-300'
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
                    ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-950/40'
                    : 'bg-stone-900/80 hover:bg-stone-800 text-stone-400 border-stone-800'
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-black/40 text-white' : 'bg-stone-800 text-stone-300'
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
                  ? 'bg-amber-950/60 border-amber-500 text-amber-300 shadow-md'
                  : 'bg-stone-900/80 hover:bg-stone-800 text-amber-400 border-stone-800'
              }`}
            >
              <span>Bajo Stock</span>
              <span className="text-[10px] font-black px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300">
                {lowStockCount}
              </span>
            </button>
          )}
        </div>

        {/* Fila 2: Buscador con Instrucción Explícita */}
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase tracking-wider text-stone-400 flex items-center gap-1">
            <i className="fa-solid fa-magnifying-glass text-red-500 text-[10px]"></i>
            <span>Buscar Producto por Nombre o Categoría:</span>
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

        {/* Fila 3: Switcher de Vista colocado DEBAJO del Buscador */}
        <div className="flex items-center justify-between pt-1 border-t border-stone-800/60">
          <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">
            Modo de Visualización:
          </span>
          <div className="flex items-center gap-1 bg-stone-900 border border-stone-800 p-1 rounded-xl">
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
              <span>Tarjetas</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`py-1 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'table'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-stone-400 hover:text-white'
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
      {/* 6. VISTA 1: ARSENAL INVENTARIO — TARJETAS ESTILO HERO            */}
      {/* ================================================================ */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4.5 w-full">
          {filteredItems.length === 0 ? (
            <div className="col-span-full bg-[#0a0a0a] border border-stone-800 rounded-3xl p-8 text-center text-stone-500 italic">
              No se encontraron productos con los criterios seleccionados.
            </div>
          ) : (
            filteredItems.map((item) => {
              const c = getItemColor(item);
              const stockClass =
                item.stock > 5
                  ? 'bg-emerald-950/70 text-emerald-300 border-emerald-700/60'
                  : item.stock > 0
                  ? 'bg-amber-950/70 text-amber-300 border-amber-700/60 animate-pulse'
                  : 'bg-rose-950/80 text-rose-300 border-rose-700/60';

              return (
                <div
                  key={item.id}
                  className={`bg-gradient-to-br ${c.bg} border-2 ${c.border} ${c.shadow} rounded-3xl p-4 sm:p-5 relative overflow-hidden group flex flex-col justify-between shadow-xl min-h-[195px] transition-all`}
                >
                  {/* Ícono de fondo coloreado con transparencia aún más grande en la esquina inferior izquierda */}
                  <i
                    className={`fa-solid ${item.icon || 'fa-bottle-water'} absolute -left-4 -bottom-5 text-[8.5rem] sm:text-[11rem] ${c.iconAlpha} transition-transform group-hover:scale-110 pointer-events-none select-none`}
                  ></i>

                  {/* Sección Superior: Categoría y Existencias */}
                  <div className="relative z-10 flex items-center justify-between gap-2">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${c.badge}`}>
                      {item.category || 'General'}
                    </span>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border shrink-0 ${stockClass}`}>
                      {item.stock} uds en stock
                    </span>
                  </div>

                  {/* Sección Media: Nombre del Producto y Precio Verde Gigante */}
                  <div className="relative z-10 my-1">
                    <h4 className="font-gears font-black text-base sm:text-lg text-white truncate drop-shadow">
                      {item.name}
                    </h4>
                    <p className="font-gears text-2xl sm:text-3xl font-black text-emerald-400 leading-none pt-1 drop-shadow-md">
                      ${item.price}
                    </p>
                  </div>

                  {/* Bloque de Acciones: Botón Vender arriba y Botones de Stock (+1, +5, Editar) abajo, con el mismo largo y sin línea divisoria */}
                  <div className="relative z-10 space-y-1.5 mt-2.5">
                    {/* Botón Vender: Ocupa el mismo largo (ancho completo) que los 3 botones inferiores */}
                    <button
                      type="button"
                      onClick={() => onSellProduct(item.id, item.name, item.price)}
                      className="w-full bg-[#22c55e] hover:bg-[#16a34a] active:scale-95 text-white font-black text-xs py-2 px-3 rounded-xl uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950/60 cursor-pointer transition-all"
                    >
                      <i className="fa-solid fa-cart-plus text-xs"></i>
                      <span>Vender</span>
                    </button>

                    {/* Fila de los tres botones (+1, +5, Editar) abarcando el mismo largo */}
                    <div className="grid grid-cols-3 gap-1.5 w-full">
                      <button
                        type="button"
                        onClick={() => onAddStock(item.id, 1)}
                        className={`${c.btnBg} border ${c.btnBorder} active:scale-95 text-[11px] font-bold py-1.5 rounded-xl cursor-pointer transition-all shadow-sm text-center`}
                        title="Sumar 1 unidad"
                      >
                        +1
                      </button>
                      <button
                        type="button"
                        onClick={() => onAddStock(item.id, 5)}
                        className={`${c.btnBg} border ${c.btnBorder} active:scale-95 text-[11px] font-bold py-1.5 rounded-xl cursor-pointer transition-all shadow-sm text-center`}
                        title="Sumar 5 unidades"
                      >
                        +5
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenProductModal(item.id)}
                        className="bg-stone-900/80 hover:bg-stone-800 border border-stone-700/80 active:scale-95 text-stone-300 hover:text-white text-[11px] font-bold py-1.5 rounded-xl cursor-pointer transition-all shadow-sm flex items-center justify-center gap-1 text-center"
                        title="Editar producto"
                      >
                        <i className="fa-solid fa-pen text-[9px]"></i>
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
      {/* 7. VISTA 2: ARSENAL INVENTARIO — TABLA / FILAS                   */}
      {/* ================================================================ */}
      {viewMode === 'table' && (
        <div className="bg-[#0a0a0a] border border-stone-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-800 bg-stone-950/80 text-[10px] font-black text-stone-400 uppercase tracking-wider">
                  <th className="px-3.5 sm:px-5 py-3.5">Producto</th>
                  <th className="px-5 py-3.5 hidden md:table-cell">Categoría</th>
                  <th className="px-3.5 sm:px-5 py-3.5">Precio</th>
                  <th className="px-2.5 sm:px-5 py-3.5">Existencias</th>
                  <th className="px-3.5 sm:px-5 py-3.5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60 text-xs">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-stone-500 italic">
                      No se encontraron productos con los criterios seleccionados.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => {
                    const c = getItemColor(item);
                    const stockClass =
                      item.stock > 5
                        ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/50'
                        : item.stock > 0
                        ? 'bg-amber-950/70 text-amber-400 border-amber-700/60 animate-pulse'
                        : 'bg-rose-950/80 text-rose-400 border-rose-700/60';

                    return (
                      <tr key={item.id} className="hover:bg-stone-900/30 transition-colors">
                        <td className="px-3.5 sm:px-5 py-3 sm:py-4">
                          <div className="flex items-center gap-2.5 sm:gap-3">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.bg} border border-stone-800 flex items-center justify-center ${c.text} shrink-0 shadow-inner text-base`}>
                              <i className={`fa-solid ${item.icon || 'fa-bottle-water'}`}></i>
                            </div>
                            <div className="min-w-0">
                              <span className="font-bold text-white text-xs sm:text-sm block truncate">
                                {item.name}
                              </span>
                              <span className="text-[10px] text-stone-400 md:hidden block">
                                {item.category || 'General'}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 hidden md:table-cell">
                          <span className="text-xs text-stone-300 font-semibold">{item.category || 'General'}</span>
                        </td>

                        <td className="px-3.5 sm:px-5 py-3 sm:py-4">
                          <span className="font-gears text-sm sm:text-base font-black text-emerald-400">
                            ${item.price}
                          </span>
                        </td>

                        <td className="px-2.5 sm:px-5 py-3 sm:py-4">
                          <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${stockClass}`}>
                            {item.stock} uds
                          </span>
                        </td>

                        <td className="px-3.5 sm:px-5 py-3 sm:py-4 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => onSellProduct(item.id, item.name, item.price)}
                              className="bg-[#22c55e] hover:bg-[#16a34a] active:scale-95 text-white font-black text-[10px] py-1.5 px-3 rounded-full uppercase tracking-wider flex items-center gap-1 shadow cursor-pointer transition-all"
                              title="Registrar venta directa"
                            >
                              <i className="fa-solid fa-cart-plus text-[10px]"></i>
                              <span>Vender</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => onAddStock(item.id, 1)}
                              className={`${c.btnBg} border ${c.btnBorder} text-[10px] font-bold py-1.5 px-2 rounded-lg cursor-pointer transition-all`}
                              title="Sumar 1 unidad"
                            >
                              +1
                            </button>
                            <button
                              type="button"
                              onClick={() => onAddStock(item.id, 5)}
                              className={`${c.btnBg} border ${c.btnBorder} text-[10px] font-bold py-1.5 px-2 rounded-lg cursor-pointer transition-all`}
                              title="Sumar 5 unidades"
                            >
                              +5
                            </button>
                            <button
                              type="button"
                              onClick={() => onOpenProductModal(item.id)}
                              className="bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-400 hover:text-white p-1.5 rounded-lg text-xs cursor-pointer"
                              title="Editar producto"
                            >
                              <i className="fa-solid fa-pen text-[10px]"></i>
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
      <div className="bg-[#0a0a0a] border border-stone-800 rounded-3xl p-3.5 sm:p-5 shadow-lg">
        <h3 className="font-gears text-xs sm:text-sm font-black text-white uppercase mb-3 flex items-center gap-2">
          <i className="fa-solid fa-clock-rotate-left text-red-500"></i> Registro de Movimientos de Tienda
        </h3>
        <div className="space-y-1.5 max-h-56 overflow-y-auto scrollbar-thin">
          {(!salesLog || salesLog.length === 0) ? (
            <p className="text-xs text-stone-500 italic py-2 text-center">No hay ventas registradas aún hoy.</p>
          ) : (
            salesLog.map((log, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-stone-900/60 border border-stone-800 px-3 py-2 rounded-xl text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-2 h-2 rounded-full ${log.isSale ? 'bg-emerald-500' : 'bg-amber-400'}`}></span>
                  <span className="text-white font-semibold">{log.text}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`font-gears font-bold ${log.isSale ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {log.badgeText}
                  </span>
                  <span className="text-[10px] text-stone-500 font-gears">{log.time}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
