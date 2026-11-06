import React, { useEffect } from 'react';
import { ZeusMedallion, OlympusCard } from '../common/GreekTempleComponents';

const DEFAULT_PRODUCTS = [
  { id: 'p1', name: 'Agua 1L', price: 20, icon: 'fa-bottle-water' },
  { id: 'p2', name: 'Pre-Entreno Hype', price: 35, icon: 'fa-bolt-lightning' },
  { id: 'p3', name: 'Proteína Whey', price: 30, icon: 'fa-jar' },
  { id: 'p4', name: 'Electrolitos', price: 15, icon: 'fa-wine-bottle' }
];

// Paleta de íconos cuadrados 3D por producto (Pilar 4.4: Azul Agua, Rojo Pre-entreno, Oro Proteína, Morado Electrolitos)
const PRODUCT_ICON_THEMES = [
  {
    bg: 'bg-gradient-to-br from-[#0284C7] to-[#0369A1]',
    border: 'border-[#38BDF8]',
    text: 'text-white',
    shadow: 'shadow-[0_2px_6px_rgba(2,132,199,0.35),inset_0_1px_0_rgba(255,255,255,0.4)]'
  },
  {
    bg: 'bg-gradient-to-br from-[#E11D48] to-[#9F1239]',
    border: 'border-[#FB7185]',
    text: 'text-white',
    shadow: 'shadow-[0_2px_6px_rgba(225,29,72,0.35),inset_0_1px_0_rgba(255,255,255,0.4)]'
  },
  {
    bg: 'bg-gradient-to-br from-[#D4AF37] to-[#997A2C]',
    border: 'border-[#F3E5AB]',
    text: 'text-[#0B1528]',
    shadow: 'shadow-[0_2px_6px_rgba(180,135,35,0.38),inset_0_1px_0_rgba(255,255,255,0.55)]'
  },
  {
    bg: 'bg-gradient-to-br from-[#7C3AED] to-[#5B21B6]',
    border: 'border-[#C4B5FD]',
    text: 'text-white',
    shadow: 'shadow-[0_2px_6px_rgba(124,58,237,0.35),inset_0_1px_0_rgba(255,255,255,0.4)]'
  }
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

  const displayProducts =
    Array.isArray(arsenalItems) && arsenalItems.length >= 4
      ? arsenalItems.slice(0, 4)
      : DEFAULT_PRODUCTS;

  // Polimorfismo de Estado Lumínico (Pilar 1.3): 'idle' | 'granted' | 'denied' | 'warning'
  let biometricState = 'idle';
  if (isSystemLocked || accessCard?.sound === 'error') {
    biometricState = 'denied';
  } else if (accessCard?.sound === 'warning') {
    biometricState = 'warning';
  } else if (isDoorOpen || accessCard?.sound === 'success') {
    biometricState = 'granted';
  }

  // Normalizar el título para que siempre sea directo y en 1 sola línea (Pilar 4.3)
  const cleanSensorTitle =
    !sensorTitle || sensorTitle.length > 22 ? 'COLOCA TU HUELLA' : sensorTitle.toUpperCase();

  return (
    <aside className="w-full lg:w-[clamp(330px,29.5vw,440px)] flex flex-col justify-between gap-2.5 shrink-0 relative z-20 lg:h-full lg:overflow-hidden select-none p-2 sm:p-3">
      {/* =========================================================================
          TARJETA 1: CONTROL DE ACCESO POLIMÓRFICO (.olympus-card--marble)
      ========================================================================= */}
      <OlympusCard
        variant="marble"
        biometricState={biometricState}
        className="flex-1 min-h-[215px] flex flex-col overflow-hidden relative"
      >
        {/* Header de la Tarjeta en Azul Olimpo Profundo (30% Regla 60-30-10) */}
        <div className="bg-gradient-to-r from-[#0B1528] via-[#162A4A] to-[#0B1528] px-3.5 py-2 border-b-[1.5px] border-[#C5A059] flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#162A4A] border border-[#D4AF37] flex items-center justify-center">
              <i className="fa-solid fa-fingerprint text-[#D4AF37] text-[10px]"></i>
            </span>
            <span className="font-cinzel text-xs font-black text-white tracking-wider uppercase">
              CONTROL DE ACCESO
            </span>
          </div>

          <span
            className={`text-[9px] font-cinzel font-black uppercase px-2.5 py-0.5 rounded-full border tracking-wider ${
              biometricState === 'denied'
                ? 'bg-[#3B0A14] border-[#EF4444] text-[#FCA5A5] shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-pulse'
                : biometricState === 'granted'
                ? 'bg-[#062E22] border-[#10B981] text-[#6EE7B7] shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                : 'bg-[#091326] border-[#C5A059]/80 text-[#F3E5AB]'
            }`}
          >
            {isSystemLocked
              ? 'BLOQUEO TOTAL'
              : isDoorOpen
              ? 'ACCESO CONCEDIDO'
              : 'LISTO / EN LÍNEA'}
          </span>
        </div>

        {/* Contenido Polimórfico de la Tarjeta */}
        {accessCard ? (
          /* A) TARJETA DE ACCESO ACTIVO CON ATMÓSFERA LUMÍNICA */
          <div className="flex-1 p-3.5 sm:p-4 flex flex-col justify-between items-center text-center relative">
            {/* Barra de progreso de auto-cierre */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#0F1E36]/20 overflow-hidden">
              <div
                className={`h-full ${
                  biometricState === 'denied'
                    ? 'bg-[#EF4444]'
                    : biometricState === 'warning'
                    ? 'bg-[#F59E0B]'
                    : 'bg-[#10B981]'
                }`}
                style={{ animation: 'countdownBar 4.7s linear forwards' }}
              ></div>
            </div>

            <div className="w-full flex items-center justify-between">
              <span
                className={`text-[9.5px] font-cinzel font-black px-2.5 py-0.5 rounded-full uppercase border ${
                  biometricState === 'denied'
                    ? 'bg-rose-100 text-rose-900 border-rose-400'
                    : biometricState === 'warning'
                    ? 'bg-amber-100 text-amber-900 border-amber-400'
                    : 'bg-emerald-100 text-emerald-900 border-emerald-400'
                }`}
              >
                {accessCard.streak || 'ACCESO REGISTRADO'}
              </span>
              {onClearAccessCard && (
                <button
                  type="button"
                  onClick={onClearAccessCard}
                  className="w-5 h-5 rounded-full bg-[#0F1E36]/15 hover:bg-[#0F1E36] text-[#0F1E36] hover:text-white flex items-center justify-center text-[10px] cursor-pointer transition-colors"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              )}
            </div>

            {/* Foto del Atleta con Halo de Estado */}
            <div className="my-1.5 relative">
              <img
                src={
                  accessCard.photo ||
                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'
                }
                alt={accessCard.name}
                className={`w-18 h-18 sm:w-20 sm:h-20 rounded-full object-cover border-[3px] shadow-lg ${
                  biometricState === 'denied'
                    ? 'border-[#EF4444] shadow-[0_0_20px_rgba(239,68,68,0.5)]'
                    : biometricState === 'warning'
                    ? 'border-[#F59E0B] shadow-[0_0_20px_rgba(245,158,11,0.5)]'
                    : 'border-[#10B981] shadow-[0_0_20px_rgba(16,185,129,0.5)]'
                }`}
              />
            </div>

            <h3 className="font-cinzel text-base sm:text-lg font-black text-[#0F1E36] uppercase tracking-wide leading-tight">
              {accessCard.name}
            </h3>

            <p className="text-[11px] text-[#997A2C] font-bold font-cinzel">
              {accessCard.plan || 'Membresía Olimpo'} • {accessCard.expire || 'Vigente'}
            </p>

            <p className="text-[11px] text-[#1E293B] font-semibold mt-0.5 leading-snug max-w-xs">
              {accessCard.message
                ? accessCard.message.replace(/<[^>]*>?/gm, '')
                : '¡Bienvenido al Templo de Zeus!'}
            </p>
          </div>
        ) : (
          /* B) EN REPOSO: MEDALLÓN DORADO CON HUELLA DIGITAL SVG Y TÍTULO EN 1 SOLA LÍNEA */
          <div className="flex-1 px-4 py-3 flex flex-col items-center justify-between text-center relative">
            {/* Medallón Dorado con SVG de Huella Digital y Halo Polimórfico */}
            <div className="my-auto py-1">
              <ZeusMedallion
                size="w-20 h-20 sm:w-22 sm:h-22"
                biometricState={biometricState}
              />
            </div>

            {/* Título en 1 sola línea contundente: COLOCA TU HUELLA */}
            <div className="space-y-1 mb-2 w-full">
              <h3 className="font-cinzel text-lg sm:text-xl font-black text-[#0F1E36] uppercase tracking-wider whitespace-nowrap leading-none">
                {cleanSensorTitle}
              </h3>
              <p className="text-[11px] text-[#475569] max-w-[270px] mx-auto font-medium leading-snug">
                {sensorSub ||
                  'El sistema mostrará tus días restantes de forma automática en pantalla'}
              </p>
            </div>

            {/* Botones Táctiles inferiores estilo Pill */}
            <div className="w-full flex items-center justify-center gap-2 pt-2 border-t border-[#DCD7C9]">
              <button
                type="button"
                onClick={onOpenPinPad}
                className="flex-1 py-1.5 px-3 rounded-full bg-gradient-to-b from-[#FFFFFF] via-[#F8F7F4] to-[#E8E4DA] border border-[#C5A059] hover:border-[#D4AF37] text-[#0F1E36] font-cinzel text-[11px] font-black flex items-center justify-center gap-1.5 shadow-[0_2px_6px_rgba(15,30,54,0.1),inset_0_1px_0_#FFF] active:translate-y-[1px] transition-all cursor-pointer"
              >
                <i className="fa-solid fa-table-cells text-[#0F1E36] text-xs"></i>
                <span>{sensorBtn || 'PIN O HUELLA'}</span>
              </button>

              <button
                type="button"
                onClick={onSensorTouch}
                className="py-1.5 px-3.5 rounded-full btn-navy-olympus text-[11px] flex items-center gap-1.5 cursor-pointer"
                title="Simular escaneo de prueba"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]"></span>
                <span>Demo</span>
              </button>
            </div>
          </div>
        )}
      </OlympusCard>

      {/* =========================================================================
          TARJETA 2: SUPLEMENTOS EN RECEPCIÓN (PILAR 4.4: MÁRMOL CLARO & 2 FILAS)
      ========================================================================= */}
      <OlympusCard variant="marble" className="flex flex-col overflow-hidden shrink-0">
        {/* Header de Suplementos en Azul Olimpo Profundo */}
        <div className="bg-gradient-to-r from-[#0B1528] via-[#162A4A] to-[#0B1528] px-3.5 py-2 border-b-[1.5px] border-[#C5A059] flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#162A4A] border border-[#D4AF37] flex items-center justify-center">
              <i className="fa-solid fa-jar text-[#D4AF37] text-[10px]"></i>
            </span>
            <span className="font-cinzel text-xs font-black text-white tracking-wider uppercase">
              {card1Title || 'SUPLEMENTOS EN RECEPCIÓN'}
            </span>
          </div>

          <span className="pill-gold-3d text-[9px] font-cinzel font-black uppercase px-2.5 py-0.5 rounded-full">
            EN BARRA
          </span>
        </div>

        {/* Rejilla 2x2 de Mini-Tarjetas de Mármol Claro con Layout de 2 Filas (Sin recortar nombres) */}
        <div className="p-2.5">
          <div className="grid grid-cols-2 gap-2">
            {displayProducts.map((p, idx) => {
              const iconTheme = PRODUCT_ICON_THEMES[idx % PRODUCT_ICON_THEMES.length];

              return (
                <div
                  key={p.id || idx}
                  className="olympus-supplement-card p-2.5 flex flex-col justify-between gap-1.5"
                >
                  {/* FILA 1 (ARRIBA): Ícono cuadrado con volumen y color propio + Nombre completo en texto oscuro (#0F1E36) */}
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-lg border ${iconTheme.bg} ${iconTheme.border} ${iconTheme.text} ${iconTheme.shadow} flex items-center justify-center shrink-0`}
                    >
                      <i className={`fa-solid ${p.icon || 'fa-bottle-water'} text-xs`}></i>
                    </div>
                    <span className="font-body text-[11px] sm:text-xs font-extrabold text-[#0F1E36] leading-tight break-words">
                      {p.name}
                    </span>
                  </div>

                  {/* FILA 2 (ABAJO): Texto "Disponible" en gris a la izquierda + Precio en verde esmeralda (#0D9488, font-weight: 800) a la derecha */}
                  <div className="flex items-center justify-between pt-1 border-t border-[#E5E0D3]">
                    <span className="text-[10px] font-semibold text-[#64748B]">
                      Disponible
                    </span>
                    <span
                      className="font-cinzel text-xs sm:text-sm font-extrabold tracking-tight"
                      style={{ color: '#0D9488', fontWeight: 800 }}
                    >
                      ${p.price}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Subtítulo informativo */}
          <p className="text-[9.5px] text-[#64748B] text-center font-medium mt-2 leading-tight">
            {card1Desc ||
              'Pregunta por tu Scoop de Pre-entreno Hype, Creatina y Proteína por servicio.'}
          </p>
        </div>
      </OlympusCard>
    </aside>
  );
}
