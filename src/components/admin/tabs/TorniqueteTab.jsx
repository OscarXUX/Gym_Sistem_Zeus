import React, { useState } from 'react';

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

  return (
    <div className="p-3.5 sm:p-5 md:p-8 max-w-5xl mx-auto space-y-5 md:space-y-6 animate-fadeIn font-body text-slate-800">
      <div className="border-b-2 border-[#C5A059]/40 pb-3">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-black font-cinzel text-[#0F1E36] flex items-center gap-2">
          <span>Portal del Olimpo — Control de Acceso</span>
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm mt-1">
          Apertura remota sagrada (Canal 1 Entrada / Canal 2 Salida), bloqueo divino de emergencia y simulación de accesos con el Monitor del Olimpo.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* PANEL ESTADO VISUAL PORTAL SAGRADO */}
        <div className="bg-[#FAF9F5] border-2 border-[#C5A059] rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-md">
          <div
            className={`w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 flex items-center justify-center mx-auto mb-4 transition-all ${isTurnstileLocked
                ? 'border-rose-500 bg-rose-100 shadow-rose-300'
                : isDoorOpen
                  ? 'border-emerald-500 bg-emerald-100 shadow-emerald-200'
                  : 'border-[#C5A059] bg-[#0F1E36] shadow-md'
              }`}
          >
            <i
              className={`text-4xl sm:text-5xl ${isTurnstileLocked
                  ? 'fa-solid fa-lock text-rose-600 animate-pulse'
                  : isDoorOpen
                    ? 'fa-solid fa-door-open text-emerald-600'
                    : 'fa-solid fa-door-closed text-[#D4AF37]'
                }`}
            ></i>
          </div>

          <p className="text-[#997A2C] text-[10px] sm:text-xs font-black uppercase font-cinzel tracking-widest relative z-10">
            Portal Sagrado del Olimpo (Relevador 2 Canales)
          </p>
          <h3
            className={`font-cinzel text-2xl sm:text-3xl font-black mt-1 relative z-10 ${isTurnstileLocked
                ? 'text-rose-700'
                : isDoorOpen
                  ? 'text-emerald-700'
                  : 'text-[#0F1E36]'
              }`}
          >
            {isTurnstileLocked ? 'BLOQUEO DIVINO' : isDoorOpen ? 'PORTAL LIBERADO' : 'SANTUARIO ARMADO'}
          </h3>
          <p className="text-xs text-slate-600 mt-1 relative z-10 font-medium">
            {isTurnstileLocked
              ? 'Paso prohibido e ignorado por el sistema'
              : isDoorOpen
                ? 'Liberación por pulso de relevador virtual'
                : 'Esperando huella digital o PIN del atleta'}
          </p>
        </div>

        {/* CONTROLES DE ACCIÓN (2 CANALES: ENTRADA Y SALIDA) */}
        <div className="space-y-3.5 sm:space-y-4 flex flex-col justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => onManualOverride(1)}
              className="w-full bg-[#FAF9F5] hover:bg-[#F3EFE6] border border-[#C5A059] hover:border-[#0F1E36] text-[#0F1E36] p-4 rounded-2xl flex items-center gap-3 transition-all group text-left shadow-sm cursor-pointer"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0F1E36] to-[#162A4A] text-[#D4AF37] border border-[#C5A059] flex items-center justify-center text-lg shrink-0 group-hover:scale-105 transition-transform shadow-sm">
                <i className="fa-solid fa-door-open"></i>
              </div>
              <div>
                <p className="font-cinzel font-bold text-[#0F1E36] text-xs sm:text-sm">Abrir Entrada (CH1)</p>
                <p className="text-[11px] text-slate-500 font-medium">Pulso Relevador Canal 1</p>
              </div>
            </button>

            <button
              onClick={() => onManualOverride(2)}
              className="w-full bg-[#FAF9F5] hover:bg-[#F3EFE6] border border-[#C5A059] hover:border-[#0F1E36] text-[#0F1E36] p-4 rounded-2xl flex items-center gap-3 transition-all group text-left shadow-sm cursor-pointer"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0F1E36] to-[#162A4A] text-[#D4AF37] border border-[#C5A059] flex items-center justify-center text-lg shrink-0 group-hover:scale-105 transition-transform shadow-sm">
                <i className="fa-solid fa-person-walking-arrow-right"></i>
              </div>
              <div>
                <p className="font-cinzel font-bold text-[#0F1E36] text-xs sm:text-sm">Abrir Salida (CH2)</p>
                <p className="text-[11px] text-slate-500 font-medium">Pulso Relevador Canal 2</p>
              </div>
            </button>
          </div>

          <button
            onClick={onToggleLockdown}
            className={`w-full p-4 sm:p-5 rounded-2xl flex items-center gap-4 transition-all group text-left cursor-pointer shadow-sm ${isTurnstileLocked
                ? 'bg-rose-100 border-2 border-rose-500 text-rose-900'
                : 'bg-[#FAF9F5] hover:bg-rose-50 border border-rose-300 text-rose-800'
              }`}
          >
            <div className="w-12 h-12 rounded-xl bg-rose-600 text-white flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform shadow-sm">
              <i className="fa-solid fa-lock"></i>
            </div>
            <div>
              <p className="font-cinzel font-black text-rose-900 text-sm sm:text-base">
                {isTurnstileLocked ? 'Desactivar Bloqueo Total' : 'Bloqueo Divino de Emergencia'}
              </p>
              <p className="text-xs text-rose-700 font-medium mt-0.5">
                {isTurnstileLocked
                  ? 'Clic para reanudar el paso en el portal sagrado.'
                  : 'Traba el portal y el Monitor del Olimpo indefinidamente.'}
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* SIMULADOR DE ESCANEO BIOMÉTRICO Y TECLADO PIN */}
      <div className="bg-[#FAF9F5] border border-[#C5A059] rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#C5A059]/30">
          <div>
            <h3 className="font-cinzel text-sm sm:text-base font-black text-[#0F1E36] uppercase flex items-center gap-2">
              <i className="fa-solid fa-keyboard text-[#997A2C]"></i>
              Ingreso Rápido por PIN / Folio de Atleta (SQLite)
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
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
              className="bg-white border border-[#C5A059] focus:border-[#0F1E36] rounded-xl px-3.5 py-2 text-xs text-[#0F1E36] font-cinzel font-bold w-40 focus:outline-none transition-colors"
            />
            <button
              type="submit"
              className="btn-navy-olympus font-cinzel font-black text-xs px-4 py-2 rounded-xl uppercase tracking-wider cursor-pointer shadow-sm"
            >
              Validar PIN
            </button>
          </form>
        </div>

        <h3 className="font-cinzel text-sm sm:text-base font-black text-[#0F1E36] uppercase mb-1 flex items-center gap-2">
          <i className="fa-solid fa-bolt-lightning text-[#FFD700]"></i>
          Simulador Biométrico (Pruebas hacia el Monitor TV)
        </h3>
        <p className="text-xs text-slate-600 mb-4">
          Toca cualquier botón para enviar la señal instantánea al sensor y ver el comportamiento en la pantalla del Olimpo.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => onEmitScan('active')}
            className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 p-4 rounded-xl font-bold text-xs flex flex-col items-center text-center gap-1.5 transition-all cursor-pointer shadow-sm group"
          >
            <i className="fa-solid fa-fingerprint text-xl text-emerald-600 group-hover:scale-110 transition-transform"></i>
            <span className="font-cinzel font-bold">Carlos Mendoza</span>
            <span className="text-[10px] text-emerald-700 font-medium">Atleta Activo (18d restantes)</span>
          </button>

          <button
            onClick={() => onEmitScan('warning')}
            className="bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 p-4 rounded-xl font-bold text-xs flex flex-col items-center text-center gap-1.5 transition-all cursor-pointer shadow-sm group"
          >
            <i className="fa-solid fa-clock text-xl text-amber-600 group-hover:scale-110 transition-transform"></i>
            <span className="font-cinzel font-bold">Sofía Ramírez</span>
            <span className="text-[10px] text-amber-700 font-medium">Aviso (Vence mañana)</span>
          </button>

          <button
            onClick={() => onEmitScan('expired')}
            className="bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-900 p-4 rounded-xl font-bold text-xs flex flex-col items-center text-center gap-1.5 transition-all cursor-pointer shadow-sm group"
          >
            <i className="fa-solid fa-ban text-xl text-rose-600 group-hover:scale-110 transition-transform"></i>
            <span className="font-cinzel font-bold">Jorge Vargas</span>
            <span className="text-[10px] text-rose-700 font-medium">Denegado (Venció hace 4d)</span>
          </button>

          <button
            onClick={onSimulateRandomScan}
            className="bg-[#FAF9F5] hover:bg-[#F3EFE6] border border-[#C5A059] text-[#0F1E36] p-4 rounded-xl font-bold text-xs flex flex-col items-center text-center gap-1.5 transition-all cursor-pointer shadow-sm group"
          >
            <i className="fa-solid fa-dice text-xl text-[#997A2C] group-hover:scale-110 transition-transform"></i>
            <span className="font-cinzel font-bold">Aleatorio</span>
            <span className="text-[10px] text-slate-500 font-medium">Simulación externa</span>
          </button>
        </div>
      </div>

      {/* REGISTRO DEL PORTAL SAGRADO */}
      <div className="bg-[#FAF9F5] border border-[#C5A059] rounded-3xl p-5 sm:p-6 shadow-sm">
        <h3 className="font-cinzel text-sm font-black text-[#0F1E36] uppercase mb-3 flex items-center gap-2">
          <i className="fa-solid fa-tower-broadcast text-[#C5A059]"></i> Registro del Portal Sagrado
        </h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {(!accessFeed || accessFeed.length === 0) ? (
            <p className="text-xs text-slate-500 italic py-3 text-center">No hay lecturas registradas en la sesión.</p>
          ) : (
            accessFeed.map((entry, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between p-3 rounded-xl border ${entry.isDenial
                    ? 'bg-rose-50 border-rose-200'
                    : 'bg-emerald-50 border-emerald-200'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${entry.isDenial
                        ? 'bg-rose-200 text-rose-800'
                        : 'bg-emerald-200 text-emerald-800'
                      }`}
                  >
                    <i className={`fa-solid ${entry.isDenial ? 'fa-ban' : 'fa-arrow-right-to-bracket'}`}></i>
                  </div>
                  <div>
                    <p className="text-xs font-bold font-cinzel text-[#0F1E36]">{entry.name}</p>
                    <p className={`text-[10px] font-bold ${entry.isDenial ? 'text-rose-700' : 'text-emerald-700'}`}>
                      {entry.badgeText}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 font-cinzel font-bold shrink-0">{entry.time}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
