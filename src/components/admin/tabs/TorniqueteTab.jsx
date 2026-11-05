import React, { useState } from 'react';

export default function TorniqueteTab({
  isTurnstileLocked,
  isDoorOpen,
  accessFeed,
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
    <div className="p-3.5 sm:p-5 md:p-8 max-w-5xl mx-auto space-y-5 md:space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white flex items-center gap-2">
          <span>Portal del Olimpo — Control de Acceso</span>
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm">
          Apertura remota sagrada (Canal 1 Entrada / Canal 2 Salida), bloqueo divino de emergencia y simulación de accesos con el Monitor del Olimpo.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* PANEL ESTADO VISUAL PORTAL SAGRADO */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-2xl backdrop-blur-md">
          <div
            className={`absolute inset-0 transition-all ${
              isTurnstileLocked
                ? 'bg-rose-600/20 opacity-100'
                : isDoorOpen
                ? 'bg-sky-500/20 opacity-100'
                : 'bg-sky-500/10 opacity-50'
            }`}
          ></div>

          <div
            className={`w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 flex items-center justify-center mx-auto mb-4 transition-all ${
              isTurnstileLocked
                ? 'border-rose-500 bg-rose-950 shadow-[0_0_60px_rgba(225,29,72,0.8)] pulse-ring'
                : isDoorOpen
                ? 'border-sky-400 bg-sky-950 shadow-[0_0_60px_rgba(56,189,248,0.7)]'
                : 'border-sky-500/80 bg-slate-950 shadow-[0_0_40px_rgba(56,189,248,0.3)]'
            }`}
          >
            <i
              className={`text-4xl sm:text-5xl ${
                isTurnstileLocked
                  ? 'fa-solid fa-lock text-rose-400 animate-pulse'
                  : isDoorOpen
                  ? 'fa-solid fa-door-open text-sky-300'
                  : 'fa-solid fa-door-closed text-sky-400'
              }`}
            ></i>
          </div>

          <p className="text-slate-400 text-[10px] sm:text-xs font-black uppercase tracking-widest relative z-10">
            Portal Sagrado del Olimpo (Relevador 2 Canales)
          </p>
          <h3
            className={`font-zeus text-2xl sm:text-3xl font-black mt-1 relative z-10 ${
              isTurnstileLocked
                ? 'text-rose-400'
                : isDoorOpen
                ? 'text-sky-300'
                : 'text-sky-400'
            }`}
          >
            {isTurnstileLocked ? 'BLOQUEO DIVINO' : isDoorOpen ? 'PORTAL LIBERADO' : 'SANTUARIO ARMADO'}
          </h3>
          <p className="text-xs text-slate-400 mt-1 relative z-10">
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
              className="w-full bg-slate-900/80 border border-slate-800 hover:border-sky-400/60 hover:bg-sky-950/20 text-white p-4 rounded-2xl flex items-center gap-3 transition-all group text-left shadow-lg cursor-pointer backdrop-blur-md"
            >
              <div className="w-11 h-11 rounded-xl bg-sky-950 text-sky-400 border border-sky-800 flex items-center justify-center text-lg shrink-0 group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-door-open"></i>
              </div>
              <div>
                <p className="font-bold text-white text-xs sm:text-sm">Abrir Entrada (CH1)</p>
                <p className="text-[11px] text-slate-400">Pulso Relevador Canal 1</p>
              </div>
            </button>

            <button
              onClick={() => onManualOverride(2)}
              className="w-full bg-slate-900/80 border border-slate-800 hover:border-blue-400/60 hover:bg-blue-950/20 text-white p-4 rounded-2xl flex items-center gap-3 transition-all group text-left shadow-lg cursor-pointer backdrop-blur-md"
            >
              <div className="w-11 h-11 rounded-xl bg-blue-950 text-blue-400 border border-blue-800 flex items-center justify-center text-lg shrink-0 group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-person-walking-arrow-right"></i>
              </div>
              <div>
                <p className="font-bold text-white text-xs sm:text-sm">Abrir Salida (CH2)</p>
                <p className="text-[11px] text-slate-400">Pulso Relevador Canal 2</p>
              </div>
            </button>
          </div>

          <button
            onClick={onToggleLockdown}
            className={`w-full p-4 sm:p-5 rounded-2xl flex items-center gap-4 transition-all group text-left cursor-pointer backdrop-blur-md ${
              isTurnstileLocked
                ? 'bg-rose-950/60 border border-rose-500 text-white shadow-[0_0_25px_rgba(225,29,72,0.4)]'
                : 'bg-slate-900/80 border border-rose-600/50 hover:bg-rose-950/40 hover:border-rose-500 text-white'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-rose-950 text-rose-400 border border-rose-800 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
              <i className="fa-solid fa-lock"></i>
            </div>
            <div>
              <p className="font-bold text-white text-sm sm:text-base">
                {isTurnstileLocked ? 'Desactivar Bloqueo Total' : 'Bloqueo Divino de Emergencia'}
              </p>
              <p className="text-xs text-slate-400">
                {isTurnstileLocked
                  ? 'Clic para reanudar el paso en el portal sagrado.'
                  : 'Traba el portal y el Monitor del Olimpo indefinidamente.'}
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* SIMULADOR DE ESCANEO BIOMÉTRICO Y TECLADO PIN */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl space-y-4 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <h3 className="font-zeus text-sm sm:text-base font-black text-white uppercase flex items-center gap-2">
              <i className="fa-solid fa-keyboard text-amber-400"></i>
              Ingreso Rápido por PIN / Folio de Atleta (SQLite)
            </h3>
            <p className="text-xs text-slate-400">
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
              className="bg-slate-950 border border-slate-700 focus:border-sky-400 rounded-xl px-3.5 py-2 text-xs text-sky-400 font-zeus font-bold w-40 focus:outline-none transition-colors"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 active:scale-95 text-white font-black text-xs px-4 py-2 rounded-xl uppercase tracking-wider cursor-pointer shadow border border-sky-400/30"
            >
              Validar PIN
            </button>
          </form>
        </div>

        <h3 className="font-zeus text-sm sm:text-base font-black text-white uppercase mb-2 flex items-center gap-2">
          <i className="fa-solid fa-bolt-lightning text-amber-400"></i>
          Simulador Biométrico (Pruebas hacia el Monitor TV)
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Toca cualquier botón para enviar la señal instantánea al sensor y ver el comportamiento en la pantalla del Olimpo.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => onEmitScan('active')}
            className="bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 p-3.5 rounded-xl font-bold text-xs flex flex-col items-center text-center gap-1.5 transition-all cursor-pointer shadow-sm group"
          >
            <i className="fa-solid fa-fingerprint text-xl text-emerald-400 group-hover:scale-110 transition-transform"></i>
            <span>Carlos Mendoza</span>
            <span className="text-[10px] text-emerald-400 font-normal">Atleta Activo (18d restantes)</span>
          </button>

          <button
            onClick={() => onEmitScan('warning')}
            className="bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/40 text-amber-300 p-3.5 rounded-xl font-bold text-xs flex flex-col items-center text-center gap-1.5 transition-all cursor-pointer shadow-sm group"
          >
            <i className="fa-solid fa-clock text-xl text-amber-400 group-hover:scale-110 transition-transform"></i>
            <span>Sofía Ramírez</span>
            <span className="text-[10px] text-amber-300 font-normal">Aviso (Vence mañana)</span>
          </button>

          <button
            onClick={() => onEmitScan('expired')}
            className="bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/40 text-rose-300 p-3.5 rounded-xl font-bold text-xs flex flex-col items-center text-center gap-1.5 transition-all cursor-pointer shadow-sm group"
          >
            <i className="fa-solid fa-ban text-xl text-rose-400 group-hover:scale-110 transition-transform"></i>
            <span>Jorge Vargas</span>
            <span className="text-[10px] text-rose-300 font-normal">Denegado (Venció hace 4d)</span>
          </button>

          <button
            onClick={onSimulateRandomScan}
            className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 p-3.5 rounded-xl font-bold text-xs flex flex-col items-center text-center gap-1.5 transition-all cursor-pointer shadow-sm group"
          >
            <i className="fa-solid fa-dice text-xl text-sky-400 group-hover:scale-110 transition-transform"></i>
            <span>Aleatorio</span>
            <span className="text-[10px] text-slate-400 font-normal">Simulación externa</span>
          </button>
        </div>
      </div>

      {/* REGISTRO DEL PORTAL SAGRADO */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-4 sm:p-5 backdrop-blur-md">
        <h3 className="font-zeus text-sm font-black text-white uppercase mb-3 flex items-center gap-2">
          <i className="fa-solid fa-tower-broadcast text-sky-400"></i> Registro del Portal Sagrado
        </h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {(!accessFeed || accessFeed.length === 0) ? (
            <p className="text-xs text-slate-500 italic">No hay lecturas registradas en la sesión.</p>
          ) : (
            accessFeed.map((entry, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between p-3 rounded-xl border ${
                  entry.isDenial
                    ? 'bg-rose-950/20 border-rose-900/40'
                    : 'bg-emerald-950/20 border-emerald-900/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      entry.isDenial
                        ? 'bg-rose-500/20 text-rose-400'
                        : 'bg-emerald-500/20 text-emerald-400'
                    }`}
                  >
                    <i className={`fa-solid ${entry.isDenial ? 'fa-ban' : 'fa-arrow-right-to-bracket'}`}></i>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{entry.name}</p>
                    <p className={`text-[9px] ${entry.isDenial ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {entry.badgeText}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 font-zeus shrink-0">{entry.time}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
