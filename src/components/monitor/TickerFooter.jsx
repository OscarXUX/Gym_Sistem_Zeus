import React from 'react';

export default function TickerFooter({
  footerTicker = 'Visita $60 • Mensualidad $400 • Promo 2x$700 • Quincena $250 • Horarios: Lun-Vie 6:00 AM – 10:00 PM | Sáb 7:00 AM – 2:00 PM • ¡Honor y Disciplina en el Templo de Zeus!'
}) {
  return (
    <footer className="relative z-10 w-full max-w-full bg-gradient-to-r from-[#0F1E36] via-[#162A4A] to-[#0F1E36] border-t-2 border-[#C5A059] py-1.5 px-3 sm:px-6 overflow-hidden shrink-0 flex items-center gap-3 shadow-lg">
      <span className="bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#0F1E36] text-[10px] sm:text-xs font-cinzel font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider shrink-0 flex items-center gap-1 shadow-sm">
        <i className="fa-solid fa-bolt-lightning text-xs text-[#0F1E36]"></i>
        <span>AVISOS</span>
      </span>

      <div className="flex-1 min-w-0 overflow-hidden whitespace-nowrap">
        <div className="inline-block animate-marquee text-xs sm:text-sm font-cinzel font-bold text-white tracking-wide">
          <span className="mr-8">{footerTicker}</span>
          <span className="mr-8 text-[#D4AF37]">⚡</span>
          <span className="mr-8">{footerTicker}</span>
          <span className="mr-8 text-[#D4AF37]">✦</span>
          <span className="mr-8">{footerTicker}</span>
          <span className="mr-8 text-[#D4AF37]">⚡</span>
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
          animation: marquee 30s linear infinite;
          will-change: transform;
          contain: layout style;
        }
      `}</style>
    </footer>
  );
}
