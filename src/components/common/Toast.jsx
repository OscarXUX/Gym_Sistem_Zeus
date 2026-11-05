import React from 'react';

export default function Toast({ toast }) {
  if (!toast || !toast.visible) return null;

  const { msg, type = 'success' } = toast;

  let bgClass = "bg-emerald-950 border-emerald-900 text-emerald-100";
  let iconBg = "bg-emerald-500 text-black";
  let icon = <i className="fa-solid fa-check"></i>;

  if (type === 'error') {
    bgClass = "bg-rose-950 border-rose-900 text-rose-100";
    iconBg = "bg-rose-500 text-white";
    icon = <i className="fa-solid fa-xmark"></i>;
  } else if (type === 'info') {
    bgClass = "bg-blue-950 border-blue-900 text-blue-100";
    iconBg = "bg-blue-500 text-white";
    icon = <i className="fa-solid fa-info"></i>;
  }

  return (
    <div className={`fixed top-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm border ${bgClass} text-xs px-4 py-3 rounded-xl shadow-2xl z-[200] flex items-center gap-3 transition-opacity duration-300 animate-fadeIn`}>
      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${iconBg}`}>
        {icon}
      </div>
      <div className="font-semibold">{msg}</div>
    </div>
  );
}
