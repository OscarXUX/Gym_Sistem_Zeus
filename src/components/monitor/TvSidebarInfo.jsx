import React, { useEffect } from 'react';
import { ZeusMedallion } from '../common/GreekTempleComponents';

const DEFAULT_PRODUCTS = [
  { id: 'p1', name: 'Agua 1L', price: 20, icon: 'fa-bottle-water', bg: 'bg-[#162A4A] text-[#F3E5AB]' },
  { id: 'p2', name: 'Pre-Entreno Hype', price: 35, icon: 'fa-bolt-lightning', bg: 'bg-[#162A4A] text-[#D4AF37]' },
  { id: 'p3', name: 'Proteína Whey', price: 30, icon: 'fa-jar', bg: 'bg-[#162A4A] text-[#F3E5AB]' },
  { id: 'p4', name: 'Electrolitos', price: 15, icon: 'fa-wine-bottle', bg: 'bg-[#162A4A] text-[#D4AF37]' }
];

export default function TvSidebarInfo({
  isSystemLocked = false,
  isDoorOpen = false,
  sensorTitle = 'COLOCA TU HUELLA',
  sensorSub = 'El sistema mostrará tus días restantes de forma automática en pantalla',
  sensorBtn = 'PIN O HUELLA',
  card1Title = 'SUPLEMENTOS EN RECEPCIÓN',
  card1Desc = 'Pregunta por tu Scoop de Pre-entreno Hype, Creatina y Proteína por servicio.',
  arsenalItems = [],
  pinBuffer = '',
  accessCard = null,
  onClearAccessCard,
  onSensorTouch,
  onOpenPinPad
}) {
  // Auto-descartar la tarjeta de acceso tras 4.8 segundos
  useEffect(() => {
    if (!accessCard || !onClearAccessCard) return;
    const timer = setTimeout(() => {
      onClearAccessCard();
    }, 4800);
    return () => clearTimeout(timer);
  }, [accessCard, onClearAccessCard]);

  const displayProducts = Array.isArray(arsenalItems) && arsenalItems.length >= 4
    ? arsenalItems.slice(0, 4)
    : DEFAULT_PRODUCTS;

  return (
    <aside className="w-full lg:w-[clamp(320px,29vw,430px)] flex flex-col justify-between gap-3 shrink-0 relative z-20 lg:h-full lg:overflow-hidden select-none p-2 sm:p-3">
      {/* =========================================================================
          TARJETA 1: CONTROL DE ACCESO / COLOCA TU HUELLA
      ========================================================================= */}
      <div className="flex-1 min-h-[220px] rounded-lg border border-[#C5A059] bg-[#FAF9F6] shadow-xl flex flex-col overflow-hidden relative">
        {/* Header de la Tarjeta */}
        <div className="bg-gradient-to-r from-[#0F1E36] via-[#162A4A] to-[#0F1E36] px-3.5 py-1.5 border-b border-[#C5A059] flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-fingerprint text-[#D4AF37] text-xs"></i>
            <span className="font-cinzel text-xs font-black text-white tracking-wider uppercase">
              CONTROL DE ACCESO
            </span>
          </div>

          <span
            className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border tracking-wider ${
              isSystemLocked
                ? 'bg-[#2c1015] border-[#f43f5e] text-[#fb7185] animate-pulse'
                : isDoorOpen
                ? 'bg-[#0b241b] border-[#10b981] text-[#34d399] shadow-sm'
                : 'bg-[#091528] border-[#C5A059]/70 text-[#F3E5AB]'
            }`}
          >
            {isSystemLocked ? 'BLOQUEO TOTAL' : isDoorOpen ? 'PORTAL ABIERTO' : 'LISTO / EN LÍNEA'}
          </span>
        </div>

        {/* Contenido de la Tarjeta */}
        {accessCard ? (
          /* A) TARJETA DE ACCESO ACTIVO */
          <div className="flex-1 p-4 flex flex-col justify-between items-center text-center relative bg-marble-card">
            {/* Barra de progreso de auto-cierre */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#0F1E36]/30 overflow-hidden">
              <div
                className="h-full bg-[#D4AF37]"
                style={{ animation: 'countdownBar 4.7s linear forwards' }}
              ></div>
            </div>

            <div className="w-full flex items-center justify-between">
              <span className="bg-[#0F1E36] text-[#F3E5AB] border border-[#C5A059] text-[10px] font-cinzel font-bold px-2.5 py-0.5 rounded-full uppercase">
                {accessCard.badgeText || 'ACCESO REGISTRADO'}
              </span>
              {onClearAccessCard && (
                <button
                  type="button"
                  onClick={onClearAccessCard}
                  className="w-5 h-5 rounded-full bg-[#0F1E36]/20 hover:bg-[#0F1E36] text-[#0F1E36] hover:text-white flex items-center justify-center text-[10px] cursor-pointer"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              )}
            </div>

            {/* Foto del Atleta */}
            <div className="my-2 relative">
              <img
                src={accessCard.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'}
                alt={accessCard.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-[#D4AF37] shadow-lg"
              />
            </div>

            <h3 className="font-cinzel text-lg sm:text-xl font-black text-[#0F1E36] uppercase tracking-wide leading-tight">
              {accessCard.name}
            </h3>

            <p className="text-xs text-[#997A2C] font-bold font-cinzel">
              {accessCard.plan || 'Membresía Olimpo'} • {accessCard.expire || 'Vigente'}
            </p>

            <p className="text-xs text-[#2D3748] font-medium mt-1 leading-snug max-w-xs">
              {accessCard.message ? accessCard.message.replace(/<[^>]*>?/gm, '') : '¡Bienvenido al Templo de Zeus!'}
            </p>
          </div>
        ) : (
          /* B) EN REPOSO: MEDALLÓN DORADO DE ZEUS Y COLOCA TU HUELLA */
          <div className="flex-1 p-3.5 sm:p-5 flex flex-col items-center justify-between text-center relative bg-marble-card">
            {/* Medallón Dorado en Relieve */}
            <div className="my-auto py-2">
              <ZeusMedallion size="w-20 h-20 sm:w-24 sm:h-24" />
            </div>

            <div className="space-y-1 mb-3">
              <h3 className="font-cinzel text-lg sm:text-xl md:text-2xl font-black text-[#0F1E36] uppercase tracking-wider">
                {sensorTitle || 'COLOCA TU HUELLA'}
              </h3>
              <p className="text-[11px] sm:text-xs text-[#4A5568] max-w-xs font-medium leading-relaxed">
                {sensorSub || 'El sistema mostrará tus días restantes de forma automática en pantalla'}
              </p>
            </div>

            {/* Botones inferiores estilo Pill */}
            <div className="w-full flex items-center justify-center gap-2 pt-1 border-t border-[#DCD7C9]">
              <button
                type="button"
                onClick={onOpenPinPad}
                className="flex-1 py-1.5 px-3 rounded-full bg-gradient-to-b from-[#FFFFFF] to-[#EFECE2] border border-[#C5A059] hover:border-[#D4AF37] text-[#0F1E36] font-cinzel text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-sm hover:shadow transition-all cursor-pointer"
              >
                <i className="fa-solid fa-calculator text-[#D4AF37] text-xs"></i>
                <span>{sensorBtn || 'PIN O HUELLA'}</span>
              </button>

              <button
                type="button"
                onClick={onSensorTouch}
                className="py-1.5 px-3 rounded-full bg-[#0F1E36] border border-[#C5A059] hover:bg-[#162A4A] text-[#F3E5AB] font-cinzel text-[11px] font-bold flex items-center gap-1 shadow-sm transition-all cursor-pointer"
                title="Simular escaneo de prueba"
              >
                <i className="fa-solid fa-play text-[9px] text-[#D4AF37]"></i>
                <span>Demo</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          TARJETA 2: SUPLEMENTOS EN RECEPCIÓN
      ========================================================================= */}
      <div className="rounded-lg border border-[#C5A059] bg-[#FAF9F6] shadow-xl flex flex-col overflow-hidden shrink-0">
        {/* Header de Suplementos */}
        <div className="bg-gradient-to-r from-[#0F1E36] via-[#162A4A] to-[#0F1E36] px-3.5 py-1.5 border-b border-[#C5A059] flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-bottle-water text-[#D4AF37] text-xs"></i>
            <span className="font-cinzel text-xs font-black text-white tracking-wider uppercase">
              {card1Title || 'SUPLEMENTOS EN RECEPCIÓN'}
            </span>
          </div>

          <span className="text-[9px] font-cinzel font-bold text-[#F3E5AB] uppercase bg-[#091528] border border-[#C5A059]/60 px-2 py-0.5 rounded-full">
            EN BARRA
          </span>
        </div>

        {/* Rejilla 2x2 de Productos */}
        <div className="p-2 sm:p-2.5 bg-marble-card">
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
            {displayProducts.map((p, idx) => (
              <div
                key={p.id || idx}
                className="flex items-center justify-between p-2 rounded-md bg-gradient-to-b from-[#162A4A] to-[#0F1E36] border border-[#C5A059]/60 shadow-sm text-white"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 rounded bg-[#091528] border border-[#C5A059]/50 flex items-center justify-center shrink-0 text-[#F3E5AB]">
                    <i className={`fa-solid ${p.icon || 'fa-bottle-water'} text-[10px]`}></i>
                  </div>
                  <span className="font-cinzel text-[10px] sm:text-[11px] font-bold text-white truncate">
                    {p.name}
                  </span>
                </div>
                <span className="font-cinzel text-xs font-black text-[#D4AF37] ml-1 shrink-0">
                  ${p.price}
                </span>
              </div>
            ))}
          </div>

          {/* Subtítulo informativo */}
          <p className="text-[9.5px] text-[#718096] text-center font-medium mt-2 leading-tight">
            {card1Desc || 'Pregunta por tu Scoop de Pre-entreno Hype, Creatina y Proteína por servicio.'}
          </p>
        </div>
      </div>
    </aside>
  );
}
