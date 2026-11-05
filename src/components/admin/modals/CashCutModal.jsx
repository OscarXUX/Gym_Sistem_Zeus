import React, { useEffect, useState } from 'react';
import { BACKEND_URL } from '../../../utils/socket';

export default function CashCutModal({
  isOpen,
  onClose,
  todayCash,
  todayEntries,
  cashBreakdown
}) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCashCut = () => {
    setLoading(true);
    fetch(`${BACKEND_URL}/api/cash-cut`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setSummary(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isOpen) {
      fetchCashCut();
    }
  }, [isOpen, todayCash, todayEntries]);

  if (!isOpen) return null;

  const totalCash = summary?.today_cash ?? todayCash ?? 0;
  const membershipsCash = summary?.memberships_cash ?? cashBreakdown?.memberships ?? 0;
  const visitsCash = summary?.visits_cash ?? cashBreakdown?.visits ?? 0;
  const storeCash = summary?.store_cash ?? cashBreakdown?.store ?? 0;
  const entriesCount = summary?.today_entries ?? todayEntries ?? 0;
  const salesList = summary?.sales || summary?.store_sales || [];
  const logsList = summary?.recent_logs || [];

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[120] flex items-center justify-center p-3 sm:p-5 animate-fadeIn overflow-y-auto">
      <div className="bg-[#0a0a0a] border border-emerald-700/60 rounded-3xl p-5 sm:p-7 w-full max-w-3xl shadow-2xl relative my-auto max-h-[92dvh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-white text-lg cursor-pointer"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        {/* Encabezado */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5 pr-8">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-600/20 border border-emerald-500 flex items-center justify-center text-emerald-400 text-xl">
              <i className="fa-solid fa-cash-register"></i>
            </div>
            <div>
              <h3 className="font-gears text-lg sm:text-xl font-black text-white uppercase">
                Corte de Caja del Día (SQLite)
              </h3>
              <p className="text-xs text-stone-400">
                Fecha operativa: <strong className="text-stone-200">{summary?.date || 'Hoy'}</strong> · Auditoría en tiempo real
              </p>
            </div>
          </div>
          <button
            onClick={fetchCashCut}
            className="self-start sm:self-auto bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-300 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer"
          >
            <i className={`fa-solid fa-rotate ${loading ? 'animate-spin' : ''}`}></i> Actualizar
          </button>
        </div>

        {/* Tarjetas Financieras de Desglose */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
          <div className="col-span-2 sm:col-span-1 bg-gradient-to-br from-emerald-950/90 to-stone-950 border-2 border-emerald-500/80 rounded-2xl p-3.5 text-center shadow-lg">
            <p className="text-[9px] font-black uppercase tracking-wider text-emerald-300">
              Total en Caja Hoy
            </p>
            <p className="font-gears text-xl sm:text-2xl font-black text-white mt-1">
              ${Number(totalCash).toLocaleString('es-MX')}
            </p>
            <span className="text-[9px] text-emerald-400 font-bold">today_cash</span>
          </div>

          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-3.5 text-center">
            <p className="text-[9px] font-black uppercase tracking-wider text-stone-400">
              Mensualidades / Renov.
            </p>
            <p className="font-gears text-lg sm:text-xl font-black text-blue-400 mt-1">
              ${Number(membershipsCash).toLocaleString('es-MX')}
            </p>
            <span className="text-[9px] text-stone-500 font-bold">memberships_cash</span>
          </div>

          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-3.5 text-center">
            <p className="text-[9px] font-black uppercase tracking-wider text-stone-400">
              Visitas del Día ($60)
            </p>
            <p className="font-gears text-lg sm:text-xl font-black text-amber-400 mt-1">
              ${Number(visitsCash).toLocaleString('es-MX')}
            </p>
            <span className="text-[9px] text-stone-500 font-bold">visits_cash</span>
          </div>

          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-3.5 text-center">
            <p className="text-[9px] font-black uppercase tracking-wider text-stone-400">
              Suplementos / Arsenal
            </p>
            <p className="font-gears text-lg sm:text-xl font-black text-purple-400 mt-1">
              ${Number(storeCash).toLocaleString('es-MX')}
            </p>
            <span className="text-[9px] text-stone-500 font-bold">store_cash</span>
          </div>

          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-3.5 text-center">
            <p className="text-[9px] font-black uppercase tracking-wider text-stone-400">
              Aforo / Entradas Hoy
            </p>
            <p className="font-gears text-lg sm:text-xl font-black text-white mt-1">
              {entriesCount}
            </p>
            <span className="text-[9px] text-stone-500 font-bold">today_entries</span>
          </div>
        </div>

        {/* Listado de Últimas Ventas de Suplementos y Accesos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Últimas 20 Ventas de Suplementos */}
          <div className="bg-[#111] border border-stone-800 rounded-2xl p-4">
            <h4 className="font-gears text-xs font-black text-white uppercase mb-3 flex items-center justify-between">
              <span>
                <i className="fa-solid fa-bolt text-amber-400 mr-1.5"></i> Últimas Ventas Arsenal
              </span>
              <span className="text-[10px] text-stone-400 font-sans">({salesList.length})</span>
            </h4>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {salesList.length === 0 ? (
                <p className="text-xs text-stone-500 italic">Sin ventas registradas hoy.</p>
              ) : (
                salesList.map((sale) => (
                  <div
                    key={sale.id}
                    className="flex items-center justify-between bg-stone-900/80 border border-stone-800/80 px-3 py-2 rounded-xl text-xs"
                  >
                    <div>
                      <p className="font-bold text-white">{sale.item_name}</p>
                      <p className="text-[10px] text-stone-500 font-gears">
                        ID: {sale.item_id} · {sale.timestamp}
                      </p>
                    </div>
                    <span className="font-gears font-black text-emerald-400 text-sm">
                      +${sale.price}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Últimos Accesos Registrados */}
          <div className="bg-[#111] border border-stone-800 rounded-2xl p-4">
            <h4 className="font-gears text-xs font-black text-white uppercase mb-3 flex items-center justify-between">
              <span>
                <i className="fa-solid fa-door-open text-emerald-400 mr-1.5"></i> Bitácora de Accesos
              </span>
              <span className="text-[10px] text-stone-400 font-sans">({logsList.length})</span>
            </h4>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {logsList.length === 0 ? (
                <p className="text-xs text-stone-500 italic">Sin accesos registrados hoy.</p>
              ) : (
                logsList.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between bg-stone-900/80 border border-stone-800/80 px-3 py-2 rounded-xl text-xs"
                  >
                    <div>
                      <p className="font-bold text-white">{log.member_name}</p>
                      <p className="text-[10px] text-stone-500 font-gears">
                        {log.action} · CH{log.channel || 1}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded ${
                        String(log.status).includes('DENIED')
                          ? 'bg-rose-950 text-rose-400'
                          : 'bg-emerald-950 text-emerald-400'
                      }`}
                    >
                      {log.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-6 py-2.5 rounded-xl uppercase tracking-wider cursor-pointer shadow-lg"
          >
            Cerrar Corte de Caja
          </button>
        </div>
      </div>
    </div>
  );
}

