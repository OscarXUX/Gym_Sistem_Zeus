import React, { useState } from 'react';

export default function GuerrerosActivosTab({ members = [], onToggleInside, onBack }) {
  const [viewFormat, setViewFormat] = useState('grid'); // 'grid' | 'list'

  const activeInside = members.filter((m) => m.isInside);

  return (
    <div className="p-3.5 sm:p-5 md:p-8 max-w-7xl mx-auto space-y-5 md:space-y-6 animate-fadeIn font-body text-slate-800">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b-2 border-[#C5A059]/40 pb-4">
        <div>
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-xs text-[#0F1E36] hover:text-[#997A2C] font-bold mb-2 py-1 px-3 rounded-xl bg-[#FAF9F5] border border-[#C5A059] transition-colors cursor-pointer shadow-sm"
            >
              <i className="fa-solid fa-arrow-left text-[10px]"></i>
              <span>Volver a Atletas</span>
            </button>
          )}
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black font-cinzel text-[#0F1E36] flex items-center gap-2.5">
            <span>Aforo en Vivo (Atletas en el Olimpo)</span>
            <span className="text-xs bg-emerald-100 border border-emerald-400 text-emerald-800 font-bold px-3 py-1 rounded-full shadow-sm font-cinzel">
              {activeInside.length} activos
            </span>
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-1">
            Monitoreo en tiempo real de los atletas consagrados que se encuentran entrenando ahora en el santuario.
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-[#EAE7DC] border border-[#C5A059] p-1.5 rounded-xl">
          <button
            onClick={() => setViewFormat('grid')}
            className={`py-1.5 px-3 rounded-lg text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
              viewFormat === 'grid'
                ? 'bg-[#0F1E36] text-[#F3E5AB] shadow-sm'
                : 'text-slate-600 hover:text-[#0F1E36]'
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
                ? 'bg-[#0F1E36] text-[#F3E5AB] shadow-sm'
                : 'text-slate-600 hover:text-[#0F1E36]'
            }`}
            title="Vista Lista"
          >
            <i className="fa-solid fa-list text-xs"></i>
            <span className="hidden sm:inline">Lista</span>
          </button>
        </div>
      </div>

      {activeInside.length === 0 ? (
        <div className="bg-[#FAF9F5] border border-[#C5A059] rounded-3xl p-12 text-center text-slate-500 italic shadow-sm">
          No hay atletas registrados dentro del Olimpo actualmente.
        </div>
      ) : viewFormat === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 sm:gap-4">
          {activeInside.map((f) => (
            <div
              key={f.id}
              className="bg-[#FAF9F5] border border-[#C5A059] hover:border-[#0F1E36] rounded-2xl p-4 flex flex-col items-center text-center relative group transition-all shadow-sm"
            >
              {/* Indicador de Vitalidad */}
              <div className="absolute top-3 right-3 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-sm animate-pulse"></div>
              <img
                src={f.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                alt={f.name}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-[#C5A059] mb-3 shadow group-hover:scale-105 transition-transform"
              />
              <p className="font-cinzel font-bold text-[#0F1E36] text-xs sm:text-sm leading-tight truncate w-full">{f.name}</p>
              <p className="text-[10px] text-slate-500 font-cinzel font-bold mt-1 flex items-center gap-1">
                <i className="fa-solid fa-clock text-[9px] text-[#C5A059]"></i> {f.timeIn || '10:00 AM'}
              </p>
              <button
                type="button"
                onClick={() => onToggleInside(f.id)}
                className="mt-3 w-full bg-rose-100 hover:bg-rose-200 active:scale-95 border border-rose-300 text-rose-800 text-[10px] font-bold py-1.5 px-2 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1 cursor-pointer"
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
              className="bg-[#FAF9F5] border border-[#C5A059] hover:border-[#0F1E36] rounded-xl p-3.5 flex items-center justify-between transition-all shadow-sm"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={f.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                  alt={f.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-[#C5A059] shrink-0"
                />
                <div className="min-w-0">
                  <p className="font-cinzel font-bold text-[#0F1E36] text-xs sm:text-sm truncate">{f.name}</p>
                  <p className="text-[10px] text-slate-500 font-cinzel font-bold mt-0.5">
                    <i className="fa-solid fa-clock text-[9px] mr-1 text-[#C5A059]"></i>
                    {f.timeIn || '10:00 AM'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onToggleInside(f.id)}
                className="bg-rose-100 hover:bg-rose-200 border border-rose-300 active:scale-95 text-rose-800 text-[10px] font-bold py-1.5 px-3 rounded-xl transition-all cursor-pointer flex items-center gap-1 shrink-0"
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
