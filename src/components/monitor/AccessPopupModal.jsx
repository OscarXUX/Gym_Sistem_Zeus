import React, { useEffect } from 'react';
import { ZeusEmblem } from '../common/ZeusSvg';

export default function AccessPopupModal({ accessData, onClose }) {
  useEffect(() => {
    if (!accessData) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4800);
    return () => clearTimeout(timer);
  }, [accessData, onClose]);

  if (!accessData) return null;

  const {
    name,
    photo,
    badge,
    message,
    plan,
    expire,
    streak,
    cardClasses,
    badgeClasses,
    dividerClass,
    statBoxClasses,
    iconHtml,
    iconBg,
    watermarkTopClass,
    watermarkBottomClass
  } = accessData;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/85 backdrop-blur-xl z-[200] flex items-center justify-center p-[clamp(0.75rem,2dvh,1.75rem)] cursor-pointer animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`modal-enter w-full max-w-[clamp(24rem,62vw,48rem)] max-h-[92dvh] rounded-3xl p-[clamp(1.25rem,3.5dvh,2.5rem)] shadow-[0_25px_80px_rgba(0,0,0,0.9)] flex flex-col items-center justify-between text-center relative overflow-hidden cursor-default backdrop-blur-2xl ${cardClasses}`}
      >
        {/* Barra de Tiempo Regresiva Superior */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-black/50 overflow-hidden">
          <div
            className="h-full bg-white/90"
            style={{
              animation: 'countdownBar 4.7s linear forwards'
            }}
          ></div>
        </div>

        {/* Botón Cerrar */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 border border-white/15 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          title="Cerrar aviso"
        >
          <i className="fa-solid fa-xmark text-base"></i>
        </button>

        {/* Marcas de Agua Zeus Emblem */}
        <ZeusEmblem className={watermarkTopClass} />
        <ZeusEmblem className={watermarkBottomClass} />

        {/* Badge de Estado Superior */}
        <div
          className={`relative z-10 px-[clamp(0.85rem,2vw,1.35rem)] py-[clamp(0.3rem,0.8dvh,0.5rem)] rounded-full text-[clamp(0.72rem,min(1vw,2.05dvh),1rem)] font-black uppercase tracking-wider mb-[clamp(0.6rem,1.6dvh,1.25rem)] shadow-lg inline-flex items-center gap-2 max-w-[90%] truncate ${badgeClasses}`}
          dangerouslySetInnerHTML={{ __html: badge }}
        ></div>

        {/* Foto de Perfil con Anillo e Insignia de Estado */}
        <div className="relative z-10 mb-[clamp(0.5rem,1.4dvh,1rem)] shrink-0">
          <img
            src={photo}
            alt={name}
            className="w-[clamp(5.25rem,min(10vw,18dvh),9rem)] h-[clamp(5.25rem,min(10vw,18dvh),9rem)] rounded-full object-cover border-4 border-white/25 shadow-[0_10px_30px_rgba(0,0,0,0.7)]"
          />
          <div
            className={`w-[clamp(1.9rem,min(3vw,5.5dvh),2.75rem)] h-[clamp(1.9rem,min(3vw,5.5dvh),2.75rem)] rounded-full flex items-center justify-center text-[clamp(0.9rem,min(1.4vw,2.6dvh),1.25rem)] font-bold absolute -bottom-1 -right-1 border-4 border-slate-950 shadow-xl ${iconBg}`}
            dangerouslySetInnerHTML={{ __html: iconHtml }}
          ></div>
        </div>

        {/* Nombre del Socio */}
        <h2 className="relative z-10 font-zeus text-[clamp(1.5rem,min(3.1vw,6.2dvh),3.1rem)] font-black text-white uppercase tracking-wide leading-tight drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] max-w-full truncate">
          {name}
        </h2>

        {/* Mensaje de Bienvenida / Alerta */}
        <p
          className="relative z-10 text-[clamp(0.85rem,min(1.25vw,2.5dvh),1.2rem)] text-slate-200 mt-[clamp(0.3rem,0.9dvh,0.65rem)] max-w-xl font-medium leading-snug line-clamp-2"
          dangerouslySetInnerHTML={{ __html: message }}
        ></p>

        {/* Divisor */}
        <div className={`relative z-10 w-full border-t my-[clamp(0.75rem,2dvh,1.5rem)] ${dividerClass}`}></div>

        {/* Métricas del Miembro (3 Tarjetas Adaptativas) */}
        <div className="relative z-10 grid grid-cols-3 gap-[clamp(0.5rem,1.3vw,1.1rem)] w-full shrink-0">
          <div className={`rounded-2xl py-[clamp(0.55rem,1.4dvh,1rem)] px-[clamp(0.5rem,1.1vw,1rem)] text-center backdrop-blur-md shadow-inner overflow-hidden ${statBoxClasses}`}>
            <p className="text-[clamp(9px,min(0.78vw,1.6dvh),12px)] text-slate-400 font-black uppercase tracking-widest flex items-center justify-center gap-1.5 truncate">
              <i className="fa-solid fa-id-card opacity-75 shrink-0"></i>
              <span className="truncate">Membresía</span>
            </p>
            <p className="font-zeus text-[clamp(0.8rem,min(1.3vw,2.6dvh),1.2rem)] font-black text-white mt-1 truncate">
              {plan}
            </p>
          </div>

          <div className={`rounded-2xl py-[clamp(0.55rem,1.4dvh,1rem)] px-[clamp(0.5rem,1.1vw,1rem)] text-center backdrop-blur-md shadow-inner overflow-hidden ${statBoxClasses}`}>
            <p className="text-[clamp(9px,min(0.78vw,1.6dvh),12px)] text-slate-400 font-black uppercase tracking-widest flex items-center justify-center gap-1.5 truncate">
              <i className="fa-solid fa-calendar-check opacity-75 shrink-0"></i>
              <span className="truncate">Vigencia</span>
            </p>
            <p className="font-zeus text-[clamp(0.8rem,min(1.3vw,2.6dvh),1.2rem)] font-black text-white mt-1 truncate">
              {expire}
            </p>
          </div>

          <div className={`rounded-2xl py-[clamp(0.55rem,1.4dvh,1rem)] px-[clamp(0.5rem,1.1vw,1rem)] text-center backdrop-blur-md shadow-inner overflow-hidden ${statBoxClasses}`}>
            <p className="text-[clamp(9px,min(0.78vw,1.6dvh),12px)] text-slate-400 font-black uppercase tracking-widest flex items-center justify-center gap-1.5 truncate">
              <i className="fa-solid fa-bolt-lightning text-amber-400 opacity-90 shrink-0"></i>
              <span className="truncate">Estado / ID</span>
            </p>
            <p
              className="font-zeus text-[clamp(0.8rem,min(1.3vw,2.6dvh),1.2rem)] font-black text-white mt-1 truncate"
              dangerouslySetInnerHTML={{ __html: streak }}
            ></p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes countdownBar {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}
