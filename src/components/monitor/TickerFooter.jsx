import React from 'react';

export default function TickerFooter({
  footerTicker = 'CÓDIGO OLÍMPICO // ¡Honor, fuerza y disciplina en el Templo de Zeus! • Horarios: Lun-Vie 6am a 10pm, Sáb 7am a 2pm • Néctar & Elíxires disponibles en barra'
}) {
  return (
    <footer className="relative z-10 w-full max-w-full bg-[#070b14]/95 border-t border-sky-500/20 py-[clamp(0.4rem,1dvh,0.7rem)] px-[clamp(0.85rem,1.5vw,1.35rem)] overflow-hidden shrink-0 flex items-center gap-3 backdrop-blur-xl">
      <span className="bg-gradient-to-r from-sky-600 to-indigo-600 text-white text-[clamp(9px,min(0.75vw,1.55dvh),12px)] font-black uppercase px-2.5 py-0.5 rounded-lg tracking-wider shrink-0 flex items-center gap-1.5 shadow-md shadow-sky-950 border border-sky-400/30">
        <i className="fa-solid fa-bolt-lightning text-amber-300 text-[0.9em]"></i> DECRETOS
      </span>
      <div className="flex-1 min-w-0 overflow-hidden whitespace-nowrap">
        <div className="inline-block animate-marquee text-[clamp(0.75rem,min(0.95vw,1.95dvh),0.98rem)] font-bold text-slate-200">
          <span className="mr-8">{footerTicker}</span>
          <span className="mr-8 text-amber-400">✦</span>
          <span className="mr-8">{footerTicker}</span>
          <span className="mr-8 text-sky-400">⚡</span>
          <span className="mr-8">{footerTicker}</span>
          <span className="mr-8 text-amber-400">✦</span>
          <span className="mr-8">{footerTicker}</span>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-block;
          white-space: nowrap;
          animation: marquee 28s linear infinite;
        }
      `}</style>
    </footer>
  );
}
