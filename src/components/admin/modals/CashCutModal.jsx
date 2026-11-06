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
    <div className="fixed inset-0 olympus-modal-backdrop z-[120] flex items-center justify-center p-3 sm:p-5 animate-fadeIn overflow-y-auto font-body text-slate-800">
      <div className="olympus-modal-frame rounded-3xl w-full max-w-3xl relative my-auto max-h-[92dvh] flex flex-col overflow-hidden">
        {/* Encabezado Templo */}
        <div className="bg-gradient-to-r from-[#0F1E36] via-[#162A4A] to-[#0F1E36] border-b-2 border-[#D4AF37] px-5 sm:px-7 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 text-white">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#0F1E36] border border-[#D4AF37] flex items-center justify-center text-[#FFD700] text-xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]">
              <i className="fa-solid fa-cash-register"></i>
            </div>
            <div>
              <h3 className="font-cinzel text-base sm:text-xl font-black text-white uppercase">
                Corte de Tesorería del Olimpo (SQLite)
              </h3>
              <p className="text-xs text-slate-300">
                Fecha operativa: <strong className="text-[#F3E5AB]">{summary?.date || 'Hoy'}</strong> · Auditoría sagrada en tiempo real
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={fetchCashCut}
              className="bg-white/10 hover:bg-white/20 border border-[#D4AF37]/50 text-[#F3E5AB] text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <i className={`fa-solid fa-rotate text-[#FFD700] ${loading ? 'animate-spin' : ''}`}></i> Actualizar
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center text-sm cursor-pointer transition-colors"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>

        <div className="p-5 sm:p-7 overflow-y-auto flex-1">

        {/* Tarjetas Financieras de Desglose */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
          <div className="col-span-2 sm:col-span-1 bg-white border-2 border-[#C5A059] rounded-2xl p-3.5 text-center shadow-sm">
            <p className="text-[9px] font-black uppercase font-cinzel tracking-wider text-[#997A2C]">
              Total en Caja Hoy
            </p>
            <p className="font-cinzel text-xl sm:text-2xl font-black text-[#0F1E36] mt-1">
              ${Number(totalCash).toLocaleString('es-MX')}
            </p>
            <span className="text-[9px] text-slate-500 font-bold">today_cash</span>
          </div>

          <div className="bg-white border border-[#C5A059] rounded-2xl p-3.5 text-center shadow-sm">
            <p className="text-[9px] font-black uppercase font-cinzel tracking-wider text-slate-600">
              Membresías Olimpo
            </p>
            <p className="font-cinzel text-lg sm:text-xl font-black text-[#0F1E36] mt-1">
              ${Number(membershipsCash).toLocaleString('es-MX')}
            </p>
            <span className="text-[9px] text-slate-500 font-bold">memberships_cash</span>
          </div>

          <div className="bg-white border border-[#C5A059] rounded-2xl p-3.5 text-center shadow-sm">
            <p className="text-[9px] font-black uppercase font-cinzel tracking-wider text-slate-600">
              Rayos Veloz ($60)
            </p>
            <p className="font-cinzel text-lg sm:text-xl font-black text-[#0F1E36] mt-1">
              ${Number(visitsCash).toLocaleString('es-MX')}
            </p>
            <span className="text-[9px] text-slate-500 font-bold">visits_cash</span>
          </div>

          <div className="bg-white border border-[#C5A059] rounded-2xl p-3.5 text-center shadow-sm">
            <p className="text-[9px] font-black uppercase font-cinzel tracking-wider text-slate-600">
              Néctar & Suplementos
            </p>
            <p className="font-cinzel text-lg sm:text-xl font-black text-[#0F1E36] mt-1">
              ${Number(storeCash).toLocaleString('es-MX')}
            </p>
            <span className="text-[9px] text-slate-500 font-bold">store_cash</span>
          </div>

          <div className="bg-white border border-[#C5A059] rounded-2xl p-3.5 text-center shadow-sm">
            <p className="text-[9px] font-black uppercase font-cinzel tracking-wider text-slate-600">
              Aforo / Entradas Hoy
            </p>
            <p className="font-cinzel text-lg sm:text-xl font-black text-[#0F1E36] mt-1">
              {entriesCount}
            </p>
            <span className="text-[9px] text-slate-500 font-bold">today_entries</span>
          </div>
        </div>

        {/* Listado de Últimas Ventas de Néctar y Accesos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Últimas Ventas Néctar & Suplementos */}
          <div className="bg-white border border-[#C5A059] rounded-2xl p-4 shadow-sm">
            <h4 className="font-cinzel text-xs font-black text-[#0F1E36] uppercase mb-3 flex items-center justify-between">
              <span>
                <i className="fa-solid fa-bolt-lightning text-[#D4AF37] mr-1.5"></i> Últimas Ventas Néctar
              </span>
              <span className="text-[10px] text-slate-500 font-sans">({salesList.length})</span>
            </h4>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {salesList.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-2 text-center">Sin ventas registradas hoy.</p>
              ) : (
                salesList.map((sale) => (
                  <div
                    key={sale.id}
                    className="flex items-center justify-between bg-[#FAF9F5] border border-[#C5A059]/30 px-3 py-2 rounded-xl text-xs"
                  >
                    <div>
                      <p className="font-bold text-[#0F1E36]">{sale.item_name}</p>
                      <p className="text-[10px] text-slate-500 font-cinzel">
                        ID: {sale.item_id} · {sale.timestamp}
                      </p>
                    </div>
                    <span className="font-cinzel font-black text-[#0F1E36] text-sm">
                      +${sale.price}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Últimos Accesos Registrados */}
          <div className="bg-white border border-[#C5A059] rounded-2xl p-4 shadow-sm">
            <h4 className="font-cinzel text-xs font-black text-[#0F1E36] uppercase mb-3 flex items-center justify-between">
              <span>
                <i className="fa-solid fa-door-open text-[#C5A059] mr-1.5"></i> Bitácora del Portal Sagrado
              </span>
              <span className="text-[10px] text-slate-500 font-sans">({logsList.length})</span>
            </h4>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {logsList.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-2 text-center">Sin accesos registrados hoy.</p>
              ) : (
                logsList.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between bg-[#FAF9F5] border border-[#C5A059]/30 px-3 py-2 rounded-xl text-xs"
                  >
                    <div>
                      <p className="font-bold text-[#0F1E36]">{log.member_name}</p>
                      <p className="text-[10px] text-slate-500 font-cinzel">
                        {log.action} · CH{log.channel || 1}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded font-cinzel ${
                        String(log.status).includes('DENIED')
                          ? 'bg-rose-100 text-rose-800 border border-rose-300'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
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
            className="btn-gold-olympus font-cinzel font-black text-xs px-6 py-2.5 rounded-xl uppercase tracking-wider cursor-pointer shadow-sm transition-all"
          >
            Cerrar Corte de Tesorería
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}
