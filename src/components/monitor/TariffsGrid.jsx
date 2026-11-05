import React from 'react';

export default function TariffsGrid({
  tariffsHeader = 'DECRETOS & TARIFAS DEL OLIMPO',
  tariffs = [],
  selectedIndex = 0,
  onSelectTariff
}) {
  const cleanHeader = String(tariffsHeader || 'DECRETOS & TARIFAS DEL OLIMPO')
    .replace(/TARIFAS OFICIALES DE LA LEGI[OÓ]N/gi, 'DECRETOS & TARIFAS DEL OLIMPO')
    .replace(/LEGI\uFFFDN/gi, 'OLIMPO')
    .replace(/LEGI[OÓ]N/gi, 'OLIMPO')
    .replace(/\uFFFD/g, 'Ó')
    .replace(/\s*\(TOCA UNA TARJETA.*\)/i, '');

  return (
    <div className="space-y-[clamp(0.4rem,1dvh,0.75rem)] shrink-0">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-[clamp(0.3rem,0.7dvh,0.5rem)]">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-[clamp(1.35rem,min(1.6vw,3.2dvh),1.75rem)] h-[clamp(1.35rem,min(1.6vw,3.2dvh),1.75rem)] rounded-lg bg-sky-500/20 border border-sky-400/50 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(56,189,248,0.25)]">
            <i className="fa-solid fa-bolt-lightning text-amber-400 text-[clamp(10px,min(0.8vw,1.65dvh),13px)]"></i>
          </div>
          <h3 className="font-zeus text-[clamp(0.75rem,min(0.98vw,2dvh),1rem)] font-black text-slate-100 uppercase tracking-wider truncate">
            {cleanHeader}
          </h3>
        </div>
        <span className="text-[clamp(10px,min(0.75vw,1.55dvh),13px)] font-bold text-slate-400 uppercase tracking-widest hidden sm:inline-flex items-center gap-1.5 shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
          Inscripciones abiertas en Olimpo Central
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-[clamp(0.5rem,1.1vw,1rem)]">
        {tariffs.map((t, idx) => {
          const isSelected = selectedIndex === idx;
          const isLongPrice = String(t.price || '').length > 4;

          return (
            <div
              key={idx}
              onClick={() => onSelectTariff && onSelectTariff(idx)}
              className={`overflow-hidden rounded-2xl px-[clamp(0.6rem,1.1vw,1.15rem)] py-[clamp(0.55rem,1.45dvh,1.15rem)] text-center backdrop-blur-md cursor-pointer transition-all duration-300 flex flex-col justify-between items-center relative ${
                isSelected
                  ? 'bg-gradient-to-b from-sky-950/90 via-[#090e1a] to-[#070b14] border-2 border-sky-400 shadow-[0_0_25px_rgba(56,189,248,0.35)] ring-1 ring-sky-400/40'
                  : 'bg-[#090e1a]/90 border border-slate-800/90 hover:border-sky-500/60 shadow-lg'
              }`}
            >
              {/* Fila superior de título e indicador de destacada */}
              <div className="w-full flex items-center justify-center gap-1.5">
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.9)] animate-pulse shrink-0"></span>
                )}
                <p className="font-zeus text-[clamp(0.7rem,min(0.95vw,1.95dvh),0.98rem)] font-black text-slate-200 uppercase tracking-wider leading-tight truncate">
                  {t.name}
                </p>
              </div>

              <div className="my-[clamp(0.25rem,0.85dvh,0.65rem)] w-full">
                <p
                  className={`font-zeus font-black text-white leading-none tracking-tight drop-shadow-md ${
                    isLongPrice
                      ? 'text-[clamp(1.35rem,min(2.4vw,4.9dvh),2.75rem)] text-amber-300'
                      : 'text-[clamp(1.5rem,min(2.75vw,5.6dvh),3.1rem)] text-white'
                  }`}
                >
                  {t.price}
                </p>
              </div>

              <span
                className={`inline-block text-[clamp(9px,min(0.78vw,1.6dvh),12.5px)] font-black uppercase px-2.5 py-0.5 rounded-lg truncate max-w-full border ${
                  isSelected
                    ? 'bg-sky-500/20 border-sky-400/50 text-sky-200'
                    : 'bg-slate-900/90 border-slate-800 text-slate-300'
                }`}
              >
                {t.sub}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
