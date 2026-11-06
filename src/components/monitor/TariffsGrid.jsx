import React from 'react';
import { GreekColumn } from '../common/GreekTempleComponents';

export default function TariffsGrid({
  tariffsHeader = 'TARIFAS OFICIALES DEL OLIMPO',
  tariffs = [],
  selectedIndex = 0,
  onSelectTariff
}) {
  const cleanHeader = String(tariffsHeader || 'TARIFAS OFICIALES DEL OLIMPO')
    .replace(/TARIFAS OFICIALES DE LA LEGI[OÓ]N/gi, 'TARIFAS OFICIALES DEL OLIMPO')
    .replace(/LEGI\uFFFDN/gi, 'OLIMPO')
    .replace(/LEGI[OÓ]N/gi, 'OLIMPO')
    .replace(/\uFFFD/g, 'Ó')
    .replace(/\s*\(TOCA UNA TARJETA.*\)/i, '');

  const defaultTariffs = [
    { name: 'MENSUALIDAD', price: '$400', sub: 'PASES DE DÍAS TOTALES' },
    { name: 'PROMO 2 GUERREROS', price: '2x$700', sub: '¡AHORRAS $100 MXN!' },
    { name: 'QUINCENA', price: '$250', sub: '15 DÍAS DE BATALLA' },
    { name: 'VISITA DEL DÍA', price: '$60', sub: 'PASE INDIVIDUAL' }
  ];

  const items = Array.isArray(tariffs) && tariffs.length > 0 ? tariffs : defaultTariffs;

  return (
    <div className="space-y-1.5 shrink-0">
      {/* Encabezado de Sección */}
      <div className="flex items-center justify-between border-b border-[#C5A059]/40 pb-1 px-1">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] shadow-[0_0_8px_rgba(212,175,55,0.8)] inline-block"></span>
          <h3 className="font-cinzel text-xs sm:text-sm font-black text-[#0F1E36] uppercase tracking-wider">
            {cleanHeader}
          </h3>
        </div>
        <span className="text-[10px] sm:text-[11px] font-bold text-[#0F1E36] uppercase tracking-wider hidden sm:inline-flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-ping"></span>
          INSCRIPCIONES ABIERTAS EN RECEPCIÓN
        </span>
      </div>

      {/* Grid de 4 Templos de Tarifas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
        {items.map((t, idx) => {
          const isSelected = selectedIndex === idx;

          return (
            <div
              key={idx}
              onClick={() => onSelectTariff && onSelectTariff(idx)}
              className={`flex flex-col rounded-md overflow-hidden cursor-pointer transition-all duration-300 shadow-md ${
                isSelected
                  ? 'border-2 border-[#D4AF37] ring-2 ring-[#F3E5AB]/60 shadow-[0_4px_16px_rgba(212,175,55,0.4)] scale-[1.02]'
                  : 'border border-[#C5A059] hover:border-[#D4AF37] hover:shadow-lg'
              }`}
            >
              {/* Cornisa Superior del Templo */}
              <div className="temple-lintel-top py-0.5 px-2 text-center">
                <p className="font-cinzel text-[10px] sm:text-[11px] font-black text-[#0F1E36] uppercase tracking-wider truncate">
                  {t.name}
                </p>
              </div>

              {/* Cuerpo del Templo flanqueado por Columnas Griegas */}
              <div className="flex flex-row items-stretch min-h-[64px] sm:min-h-[76px] bg-olympus-storm relative">
                {/* Columna Izquierda */}
                <GreekColumn size="sm" width="w-2.5 sm:w-3" />

                {/* Contenido Central: Precio y Beneficio */}
                <div className="flex-1 flex flex-col items-center justify-center p-1 sm:p-2 text-center z-10">
                  <p className="font-cinzel text-xl sm:text-2xl md:text-3xl font-black text-white leading-none tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    {t.price}
                  </p>
                  <p className="text-[9px] sm:text-[10px] font-bold text-[#F3E5AB] uppercase tracking-wider mt-1 line-clamp-1 drop-shadow">
                    {t.sub}
                  </p>
                </div>

                {/* Columna Derecha */}
                <GreekColumn size="sm" width="w-2.5 sm:w-3" />
              </div>

              {/* Cornisa Inferior */}
              <div className="temple-lintel-bottom py-0.5 text-center">
                <span className="text-[8px] font-cinzel font-black tracking-widest text-[#997A2C] uppercase">
                  ZEUS GYM
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
