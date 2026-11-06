import React, { useState } from 'react';
import { OlympusCard, ZeusMedallion } from '../../common/GreekTempleComponents';

export default function TorniqueteTab({
  isTurnstileLocked,
  isDoorOpen,
  accessFeed = [],
  onToggleLockdown,
  onManualOverride,
  onEmitScan,
  onScanMember,
  onSimulateRandomScan
}) {
  const [pinInput, setPinInput] = useState('');

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (!pinInput.trim()) return;
    if (onScanMember) {
      onScanMember(pinInput.trim(), 1);
    }
    setPinInput('');
  };

  // Polimorfismo de Estado Biométrico y Relé (Pilar 1.3)
  const biometricState = isTurnstileLocked
    ? 'denied'
    : isDoorOpen
    ? 'granted'
    : 'idle';

  return (
    <div className="p-3.5 sm:p-5 md:p-8 max-w-5xl mx-auto space-y-5 md:space-y-6 animate-fadeIn font-body text-[#0F1E36]">
      <div className="border-b-2 border-[#C5A059]/60 pb-3">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-black font-cinzel text-[#0F1E36] flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0B1528] via-[#162A4A] to-[#0F1E36] border-2 border-[#D4AF37] flex items-center justify-center text-[#FFD700] text-sm shadow-md">
            <i className="fa-solid fa-door-open"></i>
          </span>
          <span>Portal del Olimpo — Control de Puerta y Relé</span>
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm mt-1 font-medium">
          Apertura remota sagrada (Canal 1 Entrada / Canal 2 Salida), bloqueo divino de emergencia y simulación biométrica con el Monitor TV.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* ================================================================ */}
        {/* PANEL ESTADO VISUAL POLIMÓRFICO DEL PORTAL Y BIOMETRÍA           */}
        {/* ================================================================ */}
        <OlympusCard
          variant="marble"
          biometricState={biometricState}
          className="rounded-2xl overflow-hidden flex flex-col justify-between text-center relative"
        >
          <div className="bg-gradient-to-r from-[#0B1528] via-[#162A4A] to-[#0B1528] px-4 py-2.5 border-b border-[#C5A059] flex items-center justify-between">
            <span className="font-cinzel text-xs font-black text-white uppercase tracking-wider">
              ESTADO LUMÍNICO DEL RELÉ
            </span>
            <span
              className={`text-[9.5px] font-cinzel font-black px-2.5 py-0.5 rounded-full border uppercase ${
                biometricState === 'denied'
                  ? 'bg-[#3B0A14] border-[#EF4444] text-[#FCA5A5]'
                  : biometricState === 'granted'
                  ? 'bg-[#062E22] border-[#10B981] text-[#6EE7B7]'
                  : 'bg-[#091326] border-[#D4AF37] text-[#F3E5AB]'
              }`}
            >
              {isTurnstileLocked
                ? 'DENEGADO / BLOQUEO'
                : isDoorOpen
                ? 'CONCEDIDO / ABIERTO'
                : 'REPOSO / ARMADO'}
            </span>
          </div>

          <div className="p-6 sm:p-8 flex flex-col items-center justify-center flex-1">
            {/* Medallón Polimórfico con Huella Digital SVG y Halo Dinámico */}
            <div className="mb-4">
              <ZeusMedallion
                size="w-24 h-24 sm:w-28 sm:h-28"
                biometricState={biometricState}
              />
            </div>

            <p className="text-[#997A2C] text-[10px] sm:text-xs font-black uppercase font-cinzel tracking-widest relative z-10">
              Portal Sagrado del Olimpo (Relevador 2 Canales)
            </p>
            <h3
              className={`font-cinzel text-2xl sm:text-3xl font-black mt-1 relative z-10 ${
                isTurnstileLocked
                  ? 'text-[#E11D48]'
                  : isDoorOpen
                  ? 'text-[#0D9488]'
                  : 'text-[#0F1E36]'
              }`}
            >
              {isTurnstileLocked
                ? 'BLOQUEO DIVINO'
                : isDoorOpen
                ? 'PORTAL LIBERADO'
                : 'COLOCA TU HUELLA'}
            </h3>
            <p className="text-xs text-slate-600 mt-1 relative z-10 font-medium">
              {isTurnstileLocked
                ? 'Paso prohibido e ignorado por el sistema'
                : isDoorOpen
                ? 'Liberación por pulso de relevador virtual (5s)'
                : 'Esperando huella digital o PIN del atleta'}
            </p>
          </div>
        </OlympusCard>

        {/* ================================================================ */}
        {/* PILAR 5.3: BOTONES DE ACCIÓN FÍSICA CON ESTILO TÁCTIL 3D         */}
        {/* ================================================================ */}
        <div className="space-y-3.5 sm:space-y-4 flex flex-col justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Botón Táctil 3D: Abrir Entrada (CH1) */}
            <button
              type="button"
              onClick={() => onManualOverride(1)}
              className="w-full btn-gold-olympus p-4 rounded-2xl flex items-center gap-3 text-left cursor-pointer group"
            >
              <div className="w-11 h-11 rounded-xl bg-[#0B1528] text-[#FFD700] border border-[#F3E5AB] flex items-center justify-center text-lg shrink-0 group-hover:scale-105 transition-transform shadow-md">
                <i className="fa-solid fa-door-open"></i>
              </div>
              <div>
                <p className="font-cinzel font-black text-[#0B1528] text-xs sm:text-sm leading-tight">
                  Abrir Puerta (CH1)
                </p>
                <p className="text-[11px] text-[#0F1E36]/80 font-body font-bold mt-0.5">
                  Activar Relé Entrada
                </p>
              </div>
            </button>

            {/* Botón Táctil 3D: Abrir Salida (CH2) */}
            <button
              type="button"
              onClick={() => onManualOverride(2)}
              className="w-full btn-navy-olympus p-4 rounded-2xl flex items-center gap-3 text-left cursor-pointer group"
            >
              <div className="w-11 h-11 rounded-xl bg-[#1E3458] text-[#FFD700] border border-[#D4AF37] flex items-center justify-center text-lg shrink-0 group-hover:scale-105 transition-transform shadow-md">
                <i className="fa-solid fa-person-walking-arrow-right"></i>
              </div>
              <div>
                <p className="font-cinzel font-black text-white text-xs sm:text-sm leading-tight">
                  Abrir Salida (CH2)
                </p>
                <p className="text-[11px] text-[#F3E5AB]/85 font-body font-semibold mt-0.5">
                  Activar Relé Salida
                </p>
              </div>
            </button>
          </div>

          {/* Botón Táctil 3D: Bloqueo de Emergencia */}
          <button
            type="button"
            onClick={onToggleLockdown}
            className={`w-full p-4 sm:p-5 rounded-2xl flex items-center gap-4 transition-all group text-left cursor-pointer border-2 border-b-4 active:translate-y-0.5 ${
              isTurnstileLocked
                ? 'bg-gradient-to-b from-[#EF4444] to-[#B91C1C] border-[#FCA5A5] border-b-[#7F1D1D] text-white shadow-[0_10px_25px_rgba(239,68,68,0.45)]'
                : 'olympus-card--marble border-[#E11D48] border-b-[#9F1239] text-rose-950 hover:bg-rose-50'
            }`}
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform shadow-md ${
                isTurnstileLocked
                  ? 'bg-white text-[#DC2626]'
                  : 'bg-gradient-to-br from-[#E11D48] to-[#9F1239] text-white border border-rose-300'
              }`}
            >
              <i className="fa-solid fa-lock"></i>
            </div>
            <div>
              <p
                className={`font-cinzel font-black text-sm sm:text-base ${
                  isTurnstileLocked ? 'text-white' : 'text-rose-950'
                }`}
              >
                {isTurnstileLocked
                  ? 'Desactivar Bloqueo Total'
                  : 'Bloqueo Divino de Emergencia'}
              </p>
              <p
                className={`text-xs font-medium mt-0.5 ${
                  isTurnstileLocked ? 'text-rose-100' : 'text-rose-800'
                }`}
              >
                {isTurnstileLocked
                  ? 'Clic para reanudar el paso en el portal sagrado.'
                  : 'Traba el portal y el Monitor del Olimpo indefinidamente.'}
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* ================================================================ */}
      {/* SIMULADOR DE ESCANEO BIOMÉTRICO Y TECLADO PIN (.olympus-card)    */}
      {/* ================================================================ */}
      <OlympusCard variant="marble" className="p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#C5A059]/40">
          <div>
            <h3 className="font-cinzel text-sm sm:text-base font-black text-[#0F1E36] uppercase flex items-center gap-2">
              <i className="fa-solid fa-keyboard text-[#997A2C]"></i>
              <span>Ingreso Rápido por PIN / Folio de Atleta (SQLite)</span>
            </h3>
            <p className="text-xs text-slate-600 mt-0.5 font-medium">
              Ingresa el PIN o Folio del atleta (ej. 042 o 42) para abrir el portal sagrado.
            </p>
          </div>
          <form onSubmit={handlePinSubmit} className="flex items-center gap-2 shrink-0">
            <input
              type="text"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="PIN / Folio (ej. 042)"
              maxLength={6}
              className="input-tactile-sunken rounded-xl px-3.5 py-2.5 text-xs text-[#0F1E36] font-cinzel font-bold w-40"
            />
            <button
              type="submit"
              className="btn-gold-olympus text-xs px-4 py-2.5 rounded-xl uppercase tracking-wider cursor-pointer"
            >
              Validar PIN
            </button>
          </form>
        </div>

        <h3 className="font-cinzel text-sm sm:text-base font-black text-[#0F1E36] uppercase mb-1 flex items-center gap-2">
          <i className="fa-solid fa-bolt-lightning text-[#D4AF37]"></i>
          <span>Simulador Biométrico (Pruebas hacia el Monitor TV)</span>
        </h3>
        <p className="text-xs text-slate-600 mb-3 font-medium">
          Toca cualquier botón para enviar la señal instantánea al sensor y cambiar el estado lumínico en la pantalla del Olimpo.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            type="button"
            onClick={() => onEmitScan('active')}
            className="bg-emerald-50 hover:bg-emerald-100 border border-[#10B981] border-b-[3px] border-b-emerald-700 text-emerald-950 p-4 rounded-xl font-bold text-xs flex flex-col items-center text-center gap-1.5 transition-all cursor-pointer active:translate-y-0.5 shadow-sm group"
          >
            <i className="fa-solid fa-fingerprint text-xl text-[#0D9488] group-hover:scale-110 transition-transform"></i>
            <span className="font-cinzel font-black">Carlos Mendoza</span>
            <span className="text-[10px] text-[#065F46] font-semibold">
              Atleta Activo (18d restantes)
            </span>
          </button>

          <button
            type="button"
            onClick={() => onEmitScan('warning')}
            className="bg-amber-50 hover:bg-amber-100 border border-[#F59E0B] border-b-[3px] border-b-amber-700 text-amber-950 p-4 rounded-xl font-bold text-xs flex flex-col items-center text-center gap-1.5 transition-all cursor-pointer active:translate-y-0.5 shadow-sm group"
          >
            <i className="fa-solid fa-clock text-xl text-[#D97706] group-hover:scale-110 transition-transform"></i>
            <span className="font-cinzel font-black">Sofía Ramírez</span>
            <span className="text-[10px] text-[#92400E] font-semibold">
              Aviso (Vence mañana)
            </span>
          </button>

          <button
            type="button"
            onClick={() => onEmitScan('expired')}
            className="bg-rose-50 hover:bg-rose-100 border border-[#EF4444] border-b-[3px] border-b-rose-700 text-rose-950 p-4 rounded-xl font-bold text-xs flex flex-col items-center text-center gap-1.5 transition-all cursor-pointer active:translate-y-0.5 shadow-sm group"
          >
            <i className="fa-solid fa-ban text-xl text-[#E11D48] group-hover:scale-110 transition-transform"></i>
            <span className="font-cinzel font-black">Jorge Vargas</span>
            <span className="text-[10px] text-[#9F1239] font-semibold">
              Denegado (Venció hace 4d)
            </span>
          </button>

          <button
            type="button"
            onClick={onSimulateRandomScan}
            className="bg-white hover:bg-[#F8F6F0] border border-[#C5A059] border-b-[3px] border-b-[#997A2C] text-[#0F1E36] p-4 rounded-xl font-bold text-xs flex flex-col items-center text-center gap-1.5 transition-all cursor-pointer active:translate-y-0.5 shadow-sm group"
          >
            <i className="fa-solid fa-dice text-xl text-[#997A2C] group-hover:scale-110 transition-transform"></i>
            <span className="font-cinzel font-black">Aleatorio</span>
            <span className="text-[10px] text-slate-600 font-semibold">
              Simulación externa
            </span>
          </button>
        </div>
      </OlympusCard>

      {/* ================================================================ */}
      {/* REGISTRO DEL PORTAL SAGRADO (.olympus-card--marble)              */}
      {/* ================================================================ */}
      <OlympusCard variant="marble" className="overflow-hidden">
        <div className="bg-gradient-to-r from-[#0B1528] via-[#162A4A] to-[#0B1528] px-5 py-3 border-b border-[#D4AF37]">
          <h3 className="font-cinzel text-xs sm:text-sm font-black text-white uppercase flex items-center gap-2">
            <i className="fa-solid fa-tower-broadcast text-[#D4AF37]"></i>
            <span>Registro del Portal Sagrado</span>
          </h3>
        </div>
        <div className="p-4 sm:p-5 space-y-2 max-h-64 overflow-y-auto">
          {!accessFeed || accessFeed.length === 0 ? (
            <p className="text-xs text-slate-500 italic py-3 text-center">
              No hay lecturas registradas en la sesión.
            </p>
          ) : (
            accessFeed.map((entry, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between p-3 rounded-xl border ${
                  entry.isDenial
                    ? 'bg-rose-50/90 border-rose-300'
                    : 'bg-emerald-50/90 border-emerald-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      entry.isDenial
                        ? 'bg-rose-200 text-rose-800'
                        : 'bg-emerald-200 text-emerald-800'
                    }`}
                  >
                    <i
                      className={`fa-solid ${
                        entry.isDenial ? 'fa-ban' : 'fa-arrow-right-to-bracket'
                      }`}
                    ></i>
                  </div>
                  <div>
                    <p className="text-xs font-black font-cinzel text-[#0F1E36]">
                      {entry.name}
                    </p>
                    <p
                      className={`text-[10px] font-bold ${
                        entry.isDenial ? 'text-[#E11D48]' : 'text-[#0D9488]'
                      }`}
                    >
                      {entry.badgeText}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 font-cinzel font-bold shrink-0">
                  {entry.time}
                </span>
              </div>
            ))
          )}
        </div>
      </OlympusCard>
    </div>
  );
}
