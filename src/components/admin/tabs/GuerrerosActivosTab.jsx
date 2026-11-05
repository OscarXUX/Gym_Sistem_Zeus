import React, { useState } from 'react';

export default function GuerrerosActivosTab({ members, onToggleInside, onBack }) {
  const [viewFormat, setViewFormat] = useState('grid'); // 'grid' | 'list'

  const activeInside = members.filter((m) => m.isInside);

  return (
    <div className="p-3.5 sm:p-5 md:p-8 max-w-7xl mx-auto space-y-5 md:space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-white font-bold mb-2 py-1 px-2.5 rounded-xl bg-stone-900 border border-stone-800 transition-colors cursor-pointer"
            >
              <i className="fa-solid fa-arrow-left text-[10px]"></i>
              <span>Volver a Socios</span>
            </button>
          )}
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white flex items-center gap-2">
            <span>Aforo en Vivo (Guerreros Dentro)</span>
            <span className="text-xs bg-emerald-950/80 border border-emerald-500/60 text-emerald-400 font-bold px-2.5 py-0.5 rounded-full">
              {activeInside.length} activos
            </span>
          </h2>
          <p className="text-stone-400 text-xs sm:text-sm">
            Monitoreo en tiempo real de los socios que se encuentran entrenando ahora mismo.
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-[#0a0a0a] border border-stone-800 p-1.5 rounded-xl">
          <button
            onClick={() => setViewFormat('grid')}
            className={`py-1.5 px-3 rounded-lg text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
              viewFormat === 'grid'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-stone-400 hover:text-white'
            }`}
            title="Vista Cuadrícula (Tarjetas)"
          >
            <i className="fa-solid fa-table-cells-large text-xs"></i>
            <span className="hidden sm:inline">Tarjetas</span>
          </button>
          <button
            onClick={() => setViewFormat('list')}
            className={`py-1.5 px-3 rounded-lg text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
              viewFormat === 'list'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-stone-400 hover:text-white'
            }`}
            title="Vista Lista"
          >
            <i className="fa-solid fa-list text-xs"></i>
            <span className="hidden sm:inline">Lista</span>
          </button>
        </div>
      </div>

      {activeInside.length === 0 ? (
        <div className="bg-[#0a0a0a] border border-stone-800 rounded-3xl p-12 text-center text-stone-500 italic">
          No hay guerreros registrados dentro del gimnasio actualmente.
        </div>
      ) : viewFormat === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {activeInside.map((f) => (
            <div
              key={f.id}
              className="bg-[#0a0a0a] border border-stone-800 hover:border-emerald-500/50 rounded-2xl p-3.5 sm:p-4 flex flex-col items-center text-center relative group transition-all shadow-lg"
            >
              <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_#10b981]"></div>
              <img
                src={f.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                alt={f.name}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-emerald-500/60 mb-2.5 sm:mb-3 shadow group-hover:scale-105 transition-transform"
              />
              <p className="font-bold text-white text-xs sm:text-sm leading-tight truncate w-full">{f.name}</p>
              <p className="text-[10px] text-emerald-400 font-mono mt-1 flex items-center gap-1">
                <i className="fa-solid fa-clock text-[9px]"></i> {f.timeIn || '10:00 AM'}
              </p>
              <button
                type="button"
                onClick={() => onToggleInside(f.id)}
                className="mt-2.5 w-full bg-rose-950/60 hover:bg-rose-900 active:scale-95 border border-rose-700/60 text-rose-300 text-[10px] font-bold py-1 px-2 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1 cursor-pointer"
              >
                <i className="fa-solid fa-arrow-right-from-bracket text-[9px]"></i>
                <span>Registrar Salida</span>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {activeInside.map((f) => (
            <div
              key={f.id}
              className="bg-[#0a0a0a] border border-stone-800 hover:border-emerald-500/40 rounded-xl p-3 flex items-center justify-between transition-all shadow-lg"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={f.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                  alt={f.name}
                  className="w-10 h-10 rounded-full object-cover border border-emerald-500/60 shrink-0"
                />
                <div className="min-w-0">
                  <p className="font-bold text-white text-xs sm:text-sm truncate">{f.name}</p>
                  <p className="text-[10px] text-emerald-400 font-mono mt-0.5">
                    <i className="fa-solid fa-clock text-[9px] mr-0.5"></i>
                    {f.timeIn || '10:00 AM'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onToggleInside(f.id)}
                className="bg-rose-950/60 hover:bg-rose-900 border border-rose-700/60 active:scale-95 text-rose-300 text-[10px] font-bold py-1.5 px-3 rounded-xl transition-all cursor-pointer flex items-center gap-1 shrink-0"
              >
                <i className="fa-solid fa-arrow-right-from-bracket text-[9px]"></i>
                <span>Salida</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
