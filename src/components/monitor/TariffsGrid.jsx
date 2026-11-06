import React from 'react';
import {
  GreekColumn,
  TempleLintelTop,
  TempleLintelBottom,
  OlympusCloudsOverlay
} from '../common/GreekTempleComponents';

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
    { name: 'MENSUALIDAD', price: '$400', sub: 'ACCESO TOTAL 30 DÍAS' },
    { name: 'PROMO 2 ATLETAS', price: '2x$700', sub: '¡AHORRAS $100 MXN!' },
    { name: 'QUINCENA', price: '$250', sub: '15 DÍAS DE DISCIPLINA' },
    { name: 'VISITA DEL DÍA', price: '$60', sub: 'PASE INDIVIDUAL' }
  ];

  const items = Array.isArray(tariffs) && tariffs.length > 0 ? tariffs : defaultTariffs;

  return (
    <div className="space-y-1.5 shrink-0">
      {/* Encabezado de Sección sobre el mármol */}
      <div className="flex items-center justify-between border-b border-[#C5A059]/50 pb-1 px-1">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-[#AA8220] via-[#D4AF37] to-[#F3E5AB] shadow-[0_0_8px_rgba(212,175,55,0.85)] inline-block"></span>
          <h3 className="font-cinzel text-xs sm:text-sm font-black text-[#0F1E36] uppercase tracking-wider">
            {cleanHeader}
          </h3>
        </div>
        <span className="text-[10px] sm:text-[11px] font-bold text-[#0F1E36] uppercase tracking-wider hidden sm:inline-flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] shadow-[0_0_6px_#10B981] animate-ping"></span>
          <span>INSCRIPCIONES ABIERTAS EN RECEPCIÓN</span>
        </span>
      </div>

      {/* Grid de 4 Templos de Tarifas Polimórficos (.olympus-card--temple) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
        {items.map((t, idx) => {
          const isSelected = selectedIndex === idx;
          const isPrimaryPlan = idx === 0;

          return (
            <div
              key={idx}
              onClick={() => onSelectTariff && onSelectTariff(idx)}
              className={`olympus-card olympus-card--temple flex flex-col rounded-lg cursor-pointer transition-all duration-300 ${
                isSelected
                  ? 'border-2 border-[#D4AF37] ring-2 ring-[#F3E5AB]/70 shadow-[0_10px_25px_rgba(212,175,55,0.42)] -translate-y-0.5'
                  : 'border border-[#C5A059] hover:border-[#D4AF37] hover:-translate-y-0.5'
              }`}
            >
              {/* Cornisa Superior de Piedra Esculpida Limpia */}
              <TempleLintelTop className="h-2 sm:h-2.5" />

              {/* Nicho Azul Nublado (3 Planos de Profundidad) con Todo el Contenido Adentro */}
              <div className="flex flex-row items-stretch min-h-[82px] sm:min-h-[94px] bg-olympus-storm relative overflow-hidden">
                {/* Columna Cilíndrica Izquierda con Sombra Proyectada */}
                <GreekColumn size="sm" side="left" width="w-2.5 sm:w-3.5" />

                {/* Capas de Nubes Atmosféricas en Plano Medio */}
                <OlympusCloudsOverlay variant="card" />

                {/* Contenido Interno del Nicho: Nombre arriba, Precio gigante al centro, Pill con volumen abajo */}
                <div className="flex-1 flex flex-col items-center justify-between py-1.5 px-1.5 sm:px-2 text-center z-10 min-w-0">
                  {/* 1. Arriba: Nombre del Plan en Plata/Blanco */}
                  <p className="font-cinzel text-[9.5px] sm:text-[11px] font-black text-slate-100 uppercase tracking-wider truncate w-full drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)]">
                    {isPrimaryPlan && (
                      <span className="text-[#FFD700] mr-1">★</span>
                    )}
                    {t.name}
                  </p>

                  {/* 2. Al Centro: Precio Gigante con Relieve 3D */}
                  <p className="font-cinzel text-xl sm:text-2xl md:text-[28px] font-black text-white leading-none tracking-tight my-1 drop-shadow-[0_3px_6px_rgba(0,0,0,0.9)]">
                    {t.price}
                  </p>

                  {/* 3. Abajo: Badge Tipo Pill con Volumen (Dorado Metálico en $400, Glassmorphism en las otras 3) */}
                  <span
                    className={`w-full max-w-[96%] px-2 py-0.5 rounded-full font-cinzel text-[8.5px] sm:text-[9.5px] font-black uppercase tracking-wider truncate ${
                      isPrimaryPlan ? 'pill-gold-3d' : 'pill-glass-olympus'
                    }`}
                  >
                    {t.sub}
                  </span>
                </div>

                {/* Columna Cilíndrica Derecha con Sombra Proyectada */}
                <GreekColumn size="sm" side="right" width="w-2.5 sm:w-3.5" />
              </div>

              {/* Zócalo Arquitectónico Delgado (8px) sin texto muerto */}
              <TempleLintelBottom />
            </div>
          );
        })}
      </div>
    </div>
  );
}
