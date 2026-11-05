import React, { useEffect } from 'react';
import { CrimsonOmen } from '../common/CrimsonOmenSvg';

const ITEM_ICONS = {
  p1: { icon: 'fa-bottle-water', color: 'text-sky-400', bg: 'bg-sky-950/70 border-sky-500/40' },
  p2: { icon: 'fa-bolt', color: 'text-rose-400', bg: 'bg-rose-950/70 border-rose-500/40' },
  p3: { icon: 'fa-jar', color: 'text-amber-400', bg: 'bg-amber-950/70 border-amber-500/40' },
  p4: { icon: 'fa-wine-bottle', color: 'text-purple-400', bg: 'bg-purple-950/70 border-purple-500/40' }
};

export default function TvSidebarInfo({
  isSystemLocked = false,
  isDoorOpen = false,
  sensorTitle = 'Coloca tu huella en el sensor para entrar',
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
  const maskedPin = pinBuffer ? '*'.repeat(pinBuffer.length) : '';

  // Auto-descartar la tarjeta de acceso tras 4.8 segundos
  useEffect(() => {
    if (!accessCard || !onClearAccessCard) return;
    const timer = setTimeout(() => {
      onClearAccessCard();
    }, 4800);
    return () => clearTimeout(timer);
  }, [accessCard, onClearAccessCard]);

  return (
    <aside className="w-full lg:w-[clamp(320px,29vw,450px)] bg-stone-950/95 border-t lg:border-t-0 lg:border-l border-red-900/40 p-[clamp(0.55rem,1.25dvh,1rem)] flex flex-col justify-between gap-[clamp(0.5rem,1.2dvh,0.95rem)] shrink-0 relative z-20 lg:h-full lg:overflow-hidden select-none">
      {/* =========================================================================
          ZONA 1: CONSOLA DE ACCESO / ESTADO EN VIVO
      ========================================================================= */}
      <div className="flex-1 min-h-0 flex flex-col justify-between overflow-hidden relative">
        {accessCard ? (
          /* A) TARJETA DE ACCESO ACTIVO EN SIDEBAR */
          <div
            className={`w-full h-full rounded-2xl xl:rounded-3xl p-[clamp(0.75rem,1.6dvh,1.25rem)] flex flex-col justify-between relative overflow-hidden transition-all duration-300 shadow-2xl ${
              accessCard.cardClasses || 'bg-gradient-to-b from-stone-900 via-stone-950 to-black border-2 border-emerald-500'
            }`}
          >
            {/* Barra de progreso de auto-cierre */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-black/50 overflow-hidden">
              <div
                className="h-full bg-white/90"
                style={{ animation: 'countdownBar 4.7s linear forwards' }}
              ></div>
            </div>

            {/* Cabecera compacta de 1 sola línea */}
            <div className="flex items-center justify-between gap-2 pt-0.5 shrink-0">
              <div
                className={`px-3 py-1 rounded-full text-[clamp(9px,min(0.75vw,1.55dvh),12px)] font-black uppercase tracking-wider shadow-inner inline-flex items-center gap-1.5 truncate max-w-[86%] ${
                  accessCard.badgeClasses || 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50'
                }`}
                dangerouslySetInnerHTML={{ __html: accessCard.badge || 'ACCESO AUTORIZADO' }}
              ></div>

              {onClearAccessCard && (
                <button
                  onClick={onClearAccessCard}
                  className="w-6 h-6 rounded-full bg-black/60 hover:bg-black text-stone-300 hover:text-white flex items-center justify-center text-xs cursor-pointer border border-white/15 shrink-0"
                  title="Cerrar"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              )}
            </div>

            {/* Perfil del Guerrero */}
            <div className="flex items-center gap-[clamp(0.65rem,1.1vw,1rem)] my-auto py-1 min-h-0">
              <div className="relative shrink-0">
                <img
                  src={accessCard.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'}
                  alt={accessCard.name}
                  className="w-[clamp(3.25rem,min(4.6vw,9.5dvh),5rem)] h-[clamp(3.25rem,min(4.6vw,9.5dvh),5rem)] rounded-full object-cover border-2 border-white/25 shadow-xl"
                />
                <div
                  className={`w-[clamp(1.25rem,min(1.7vw,3.4dvh),1.65rem)] h-[clamp(1.25rem,min(1.7vw,3.4dvh),1.65rem)] rounded-full flex items-center justify-center text-[clamp(9px,min(0.8vw,1.6dvh),12px)] font-bold absolute -bottom-0.5 -right-0.5 border-2 border-stone-950 shadow ${
                    accessCard.iconBg || 'bg-emerald-500'
                  }`}
                  dangerouslySetInnerHTML={{ __html: accessCard.iconHtml || '<i class="fa-solid fa-check text-white"></i>' }}
                ></div>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-gears text-[clamp(0.95rem,min(1.35vw,2.75dvh),1.35rem)] font-black text-white uppercase leading-tight truncate">
                  {accessCard.name}
                </h3>
                <p className="text-[clamp(0.72rem,min(0.9vw,1.85dvh),0.9rem)] text-stone-300 font-bold mt-0.5 truncate">
                  Plan: <span className="text-white">{accessCard.plan || 'Mensual'}</span>
                </p>
                <span
                  className="inline-block mt-1 bg-black/60 border border-white/10 text-stone-200 text-[clamp(9px,min(0.72vw,1.5dvh),11.5px)] font-bold px-2.5 py-0.5 rounded-lg truncate max-w-full"
                  dangerouslySetInnerHTML={{ __html: accessCard.streak || 'Guerrero Activo' }}
                ></span>
              </div>
            </div>

            {/* Bloque Destacado de Vigencia */}
            <div className={`py-[clamp(0.45rem,1.1dvh,0.8rem)] px-3 rounded-2xl border text-center shrink-0 ${accessCard.statBoxClasses || 'bg-black/80 border-emerald-500/40 text-white'}`}>
              <p className="text-[clamp(8.5px,min(0.68vw,1.4dvh),11px)] font-black uppercase text-stone-400 tracking-widest">
                ESTADO DE VIGENCIA
              </p>
              <p className="font-gears text-[clamp(1rem,min(1.45vw,3dvh),1.5rem)] font-black text-white leading-tight mt-0.5 truncate">
                {accessCard.expire}
              </p>
            </div>

            {/* Mensaje de bienvenida */}
            <p
              className="text-[clamp(10px,min(0.85vw,1.75dvh),13px)] text-stone-200 font-medium leading-snug line-clamp-2 text-center shrink-0"
              dangerouslySetInnerHTML={{ __html: accessCard.message || '¡Entrena sin límites ni piedad!' }}
            ></p>
          </div>
        ) : (
          /* B) CONSOLA DE ACCESO EN REPOSO (Proporcionada, grande y cohesiva) */
          <div className="w-full h-full bg-gradient-to-b from-stone-900/90 via-stone-950 to-black border border-stone-800/90 rounded-2xl xl:rounded-3xl p-[clamp(0.75rem,1.6dvh,1.25rem)] flex flex-col justify-between gap-[clamp(0.35rem,0.9dvh,0.75rem)] shadow-xl relative overflow-hidden">
            {/* Header del sensor */}
            <div className="flex items-center justify-between gap-2 border-b border-stone-800/80 pb-[clamp(0.35rem,0.9dvh,0.65rem)] shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <CrimsonOmen className="w-[clamp(1rem,min(1.2vw,2.4dvh),1.25rem)] h-[clamp(1rem,min(1.2vw,2.4dvh),1.25rem)] text-red-500 shrink-0" />
                <h4 className="font-gears text-[clamp(0.75rem,min(1vw,2.05dvh),0.98rem)] font-black text-stone-100 uppercase tracking-wider truncate">
                  CONTROL DE ACCESO
                </h4>
              </div>
              <span
                className={`text-[clamp(8.5px,min(0.68vw,1.4dvh),10.5px)] font-black uppercase px-2.5 py-0.5 rounded-full border whitespace-nowrap shrink-0 ${
                  isSystemLocked
                    ? 'bg-rose-950 border-rose-500 text-rose-300 animate-pulse'
                    : isDoorOpen
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                    : pinBuffer
                    ? 'bg-amber-950 border-amber-500 text-amber-300 animate-pulse'
                    : 'bg-stone-900 border-stone-700 text-stone-300'
                }`}
              >
                {isSystemLocked
                  ? 'BLOQUEO TOTAL'
                  : isDoorOpen
                  ? 'PASE CONCEDIDO'
                  : pinBuffer
                  ? 'INGRESANDO PIN'
                  : 'LISTO / EN ESPERA'}
              </span>
            </div>

            {/* Núcleo Central: Scanner Biométrico + Texto agrupado armónicamente */}
            <div className="flex-1 min-h-0 flex flex-col items-center justify-center gap-[clamp(0.5rem,1.35dvh,1rem)] text-center overflow-hidden">
              <div className="relative flex items-center justify-center shrink-0">
                {/* Anillo táctico exterior */}
                <div
                  className={`absolute w-[clamp(4.2rem,min(6.8vw,13.8dvh),7.25rem)] h-[clamp(4.2rem,min(6.8vw,13.8dvh),7.25rem)] rounded-full border border-dashed opacity-35 pointer-events-none ${
                    isSystemLocked
                      ? 'border-rose-500'
                      : isDoorOpen
                      ? 'border-emerald-400'
                      : pinBuffer
                      ? 'border-amber-400'
                      : 'border-red-500'
                  }`}
                ></div>

                {/* Halo luminoso */}
                <div
                  className={`absolute w-[clamp(3.8rem,min(6vw,12.2dvh),6.5rem)] h-[clamp(3.8rem,min(6vw,12.2dvh),6.5rem)] rounded-full blur-md pointer-events-none transition-all duration-300 ${
                    isSystemLocked
                      ? 'bg-rose-600/30'
                      : isDoorOpen
                      ? 'bg-emerald-500/30'
                      : pinBuffer
                      ? 'bg-amber-500/30'
                      : 'bg-red-600/25'
                  }`}
                ></div>

                <button
                  type="button"
                  onClick={onSensorTouch}
                  className={`relative z-10 w-[clamp(3.5rem,min(5.7vw,11.5dvh),6.1rem)] h-[clamp(3.5rem,min(5.7vw,11.5dvh),6.1rem)] rounded-full bg-black border-4 flex items-center justify-center transition-all duration-300 cursor-pointer shadow-2xl ${
                    isSystemLocked
                      ? 'border-rose-600 shadow-[0_0_30px_rgba(225,29,72,0.8)] animate-pulse'
                      : isDoorOpen
                      ? 'border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.8)]'
                      : pinBuffer
                      ? 'border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.7)]'
                      : 'border-red-600 shadow-[0_0_30px_rgba(220,38,38,0.55)] hover:scale-105 active:scale-95'
                  }`}
                  title="Toca para simular lectura de huella"
                >
                  <i
                    className={`text-[clamp(1.6rem,min(2.6vw,5.3dvh),2.75rem)] ${
                      isSystemLocked
                        ? 'fa-solid fa-lock text-rose-500 animate-bounce'
                        : isDoorOpen
                        ? 'fa-solid fa-door-open text-emerald-400'
                        : pinBuffer
                        ? 'fa-solid fa-keyboard text-amber-400 animate-pulse'
                        : 'fa-solid fa-fingerprint text-white'
                    }`}
                  ></i>
                </button>
              </div>

              {/* Indicador de PIN si se está tecleando */}
              {pinBuffer ? (
                <div className="bg-black/90 border border-amber-500/80 rounded-xl px-4 py-1.5 text-center w-full max-w-xs animate-pulse">
                  <span className="font-gears text-[clamp(1.1rem,min(1.7vw,3.5dvh),1.6rem)] font-black text-amber-400 tracking-[0.25em]">
                    {maskedPin}
                  </span>
                  <p className="text-[clamp(9px,min(0.72vw,1.45dvh),11.5px)] text-stone-300 font-bold uppercase mt-0.5">
                    Presiona <span className="text-white underline">ENTER</span> para validar
                  </p>
                </div>
              ) : (
                <div className="text-center px-2 min-h-0">
                  <p className="font-gears text-[clamp(0.8rem,min(1.08vw,2.2dvh),1.12rem)] font-black text-white uppercase tracking-wide leading-snug line-clamp-2">
                    {sensorTitle}
                  </p>
                  <p className="text-[clamp(10px,min(0.84vw,1.7dvh),13.5px)] text-stone-400 mt-1 max-w-[300px] mx-auto leading-snug line-clamp-2">
                    {sensorSub}
                  </p>
                </div>
              )}
            </div>

            {/* Botonera de Acceso Táctil */}
            <div className="flex items-center gap-2.5 pt-[clamp(0.35rem,0.9dvh,0.65rem)] border-t border-stone-800/80 shrink-0">
              <button
                type="button"
                onClick={onOpenPinPad || onSensorTouch}
                className="flex-1 bg-red-600/20 hover:bg-red-600/35 border border-red-500/80 text-red-200 hover:text-white py-[clamp(0.42rem,1.1dvh,0.72rem)] px-3 rounded-xl text-[clamp(0.72rem,min(0.95vw,1.95dvh),0.92rem)] font-black tracking-wider uppercase transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md truncate"
              >
                <i className="fa-solid fa-id-card-clip shrink-0"></i>
                <span className="truncate">{sensorBtn}</span>
              </button>
              <button
                type="button"
                onClick={onSensorTouch}
                className="bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-300 hover:text-white py-[clamp(0.42rem,1.1dvh,0.72rem)] px-3 rounded-xl text-[clamp(0.72rem,min(0.9vw,1.85dvh),0.88rem)] font-bold cursor-pointer transition-all flex items-center gap-1.5 shrink-0"
                title="Probar lectura con huella demo"
              >
                <i className="fa-solid fa-fingerprint text-red-400"></i>
                <span>Demo</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          ZONA 2: ARSENAL EXPRESS (Compacto y Cohesivo — sin huecos vacíos internos)
      ========================================================================= */}
      <div className="shrink-0 flex flex-col justify-between bg-gradient-to-b from-stone-900/90 via-stone-950 to-black border border-amber-500/40 rounded-2xl xl:rounded-3xl p-[clamp(0.65rem,1.4dvh,1.1rem)] shadow-xl overflow-hidden">
        {/* Cabecera del Arsenal */}
        <div className="flex items-center justify-between gap-2 border-b border-stone-800/80 pb-[clamp(0.3rem,0.75dvh,0.55rem)] shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-[clamp(1.4rem,min(1.8vw,3.6dvh),1.85rem)] h-[clamp(1.4rem,min(1.8vw,3.6dvh),1.85rem)] rounded-lg bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-400 text-[clamp(10px,min(0.85vw,1.7dvh),13.5px)] shrink-0">
              <i className="fa-solid fa-jar"></i>
            </div>
            <h5 className="font-gears text-[clamp(0.72rem,min(0.98vw,2dvh),0.95rem)] font-black text-amber-400 uppercase tracking-wide truncate">
              {card1Title}
            </h5>
          </div>
          <span className="bg-amber-500/15 border border-amber-500/40 text-amber-300 text-[clamp(8.5px,min(0.68vw,1.4dvh),10.5px)] font-black uppercase px-2.5 py-0.5 rounded-full shrink-0 whitespace-nowrap">
            EN BARRA
          </span>
        </div>

        {/* Grid 2x2 Compacto y Bien Proporcionado */}
        <div className="grid grid-cols-2 gap-[clamp(0.4rem,0.95dvh,0.7rem)] my-[clamp(0.4rem,0.95dvh,0.7rem)]">
          {arsenalItems.slice(0, 4).map((it, idx) => {
            const style = ITEM_ICONS[it.id] || Object.values(ITEM_ICONS)[idx % 4];
            return (
              <div
                key={it.id || idx}
                className="bg-stone-900/95 border border-stone-800 hover:border-amber-500/50 rounded-xl p-[clamp(0.45rem,1.05dvh,0.75rem)] flex flex-col justify-between gap-[clamp(0.3rem,0.75dvh,0.55rem)] transition-all shadow-md min-h-0"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className={`w-[clamp(1.5rem,min(1.9vw,3.8dvh),2rem)] h-[clamp(1.5rem,min(1.9vw,3.8dvh),2rem)] rounded-lg border flex items-center justify-center text-[clamp(11px,min(0.9vw,1.8dvh),14px)] shrink-0 ${style.bg} ${style.color}`}>
                    <i className={`fa-solid ${it.icon || style.icon}`}></i>
                  </div>
                  <p className="text-[clamp(0.72rem,min(0.92vw,1.88dvh),0.9rem)] font-extrabold text-white leading-tight truncate">
                    {it.name}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-1 pt-[clamp(0.25rem,0.55dvh,0.4rem)] border-t border-stone-800/80">
                  <span className="text-[clamp(8.5px,min(0.68vw,1.4dvh),11px)] font-bold text-stone-400 truncate">
                    {it.stock !== undefined && it.stock <= 0 ? 'Agotado' : 'Disponible'}
                  </span>
                  <strong className="font-gears text-[clamp(0.82rem,min(1.12vw,2.25dvh),1.1rem)] font-black text-emerald-400 leading-none shrink-0">
                    ${it.price}
                  </strong>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-[clamp(9.5px,min(0.75vw,1.55dvh),12px)] text-stone-400 text-center font-medium truncate pt-[clamp(0.25rem,0.65dvh,0.45rem)] border-t border-stone-800/80 shrink-0">
          {card1Desc || 'Pide tu pre-entreno, proteína o bebida fría al ingresar.'}
        </p>
      </div>

      <style>{`
        @keyframes countdownBar {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </aside>
  );
}
