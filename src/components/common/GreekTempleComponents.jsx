import React from 'react';

/**
 * CAPITEL DE COLUMNA GRIEGA (MÁRMOL Y ORO)
 */
export function ColumnCapital({ size = 'md', className = '' }) {
  const isSm = size === 'sm';
  const height = isSm ? 'h-3.5 sm:h-4' : 'h-5 sm:h-6';
  
  return (
    <div className={`w-full ${height} shrink-0 relative flex flex-col justify-end ${className}`}>
      {/* Ábaco superior con filete dorado */}
      <div className="w-full h-1 sm:h-1.5 bg-gradient-to-r from-[#C5A059] via-[#F3E5AB] to-[#C5A059] shadow-sm rounded-t-[1px]"></div>
      {/* Equino de mármol con curva biselada y volutas */}
      <div className="w-full flex-1 bg-gradient-to-b from-[#FFFFFF] via-[#EFECE2] to-[#D8D2C2] border-x border-[#C5A059]/80 flex items-center justify-between px-0.5 shadow-inner">
        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full border border-[#997A2C] bg-gradient-to-tr from-[#C5A059] to-[#F3E5AB] shadow-sm"></div>
        <div className="flex-1 h-[2px] bg-[#D4AF37]/60 mx-0.5"></div>
        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full border border-[#997A2C] bg-gradient-to-tr from-[#C5A059] to-[#F3E5AB] shadow-sm"></div>
      </div>
      {/* Collarino inferior */}
      <div className="w-full h-[2px] bg-[#997A2C]"></div>
    </div>
  );
}

/**
 * BASE DE COLUMNA GRIEGA (MÁRMOL Y ORO)
 */
export function ColumnBase({ size = 'md', className = '' }) {
  const isSm = size === 'sm';
  const height = isSm ? 'h-3 sm:h-3.5' : 'h-4 sm:h-5';

  return (
    <div className={`w-full ${height} shrink-0 relative flex flex-col justify-start ${className}`}>
      {/* Collarino superior de base */}
      <div className="w-full h-[2px] bg-[#997A2C]"></div>
      {/* Toro y Escocia de mármol */}
      <div className="w-full flex-1 bg-gradient-to-b from-[#D8D2C2] via-[#EFECE2] to-[#FFFFFF] border-x border-[#C5A059]/80 shadow-inner"></div>
      {/* Plinto de apoyo inferior con filete dorado */}
      <div className="w-full h-1 sm:h-1.5 bg-gradient-to-r from-[#997A2C] via-[#F3E5AB] to-[#C5A059] shadow-sm rounded-b-[1px]"></div>
    </div>
  );
}

/**
 * FUSTE ESTRIADO DE COLUMNA (CILINDRO DE MÁRMOL 3D)
 */
export function ColumnShaft({ className = '' }) {
  return (
    <div
      className={`w-full flex-1 min-h-[20px] relative overflow-hidden border-x border-[#B8943F]/70 ${className}`}
      style={{
        background: `repeating-linear-gradient(
          90deg,
          #D3CDC0 0px,
          #ECE8DE 2px,
          #FFFFFF 4px,
          #ECE8DE 6px,
          #B8B1A0 8px
        )`,
        boxShadow: 'inset 2px 0 4px rgba(0,0,0,0.22), inset -2px 0 4px rgba(0,0,0,0.22)'
      }}
    >
      {/* Brillo especular central de mármol */}
      <div className="absolute inset-y-0 left-1/3 right-1/3 bg-white/20 pointer-events-none"></div>
    </div>
  );
}

/**
 * COLUMNA GRIEGA COMPLETA REUTILIZABLE
 */
export function GreekColumn({
  size = 'md',
  className = '',
  width = 'w-3.5 sm:w-5 md:w-6'
}) {
  return (
    <div className={`h-full flex flex-col shrink-0 select-none pointer-events-none z-10 ${width} ${className}`}>
      <ColumnCapital size={size} />
      <ColumnShaft />
      <ColumnBase size={size} />
    </div>
  );
}

/**
 * DINTEL SUPERIOR DE TEMPLO GRIEGO
 */
export function TempleLintelTop({ title, subtitle, className = '', children }) {
  return (
    <div className={`w-full temple-lintel-top px-3 py-1 flex items-center justify-between shrink-0 select-none z-10 ${className}`}>
      {children || (
        <div className="flex items-center gap-2">
          {title && (
            <span className="font-cinzel text-[11px] sm:text-xs font-black text-[#0F1E36] tracking-wider uppercase">
              {title}
            </span>
          )}
          {subtitle && (
            <span className="text-[10px] sm:text-[11px] text-[#997A2C] font-bold">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * DINTEL INFERIOR DE TEMPLO GRIEGO
 */
export function TempleLintelBottom({ className = '', children }) {
  return (
    <div className={`w-full temple-lintel-bottom px-3 py-0.5 flex items-center justify-between shrink-0 select-none z-10 ${className}`}>
      {children || <div className="h-1"></div>}
    </div>
  );
}

/**
 * CONTENEDOR TEMPLO GRIEGO COMPLETO
 * Enmarca automáticamente cualquier elemento con 2 columnas griegas y cornisas superior e inferior
 */
export function TempleFrame({
  children,
  className = '',
  innerClassName = '',
  size = 'md',
  columnWidth = 'w-3.5 sm:w-5 md:w-6',
  topLintel,
  bottomLintel
}) {
  return (
    <div className={`relative flex flex-col rounded-lg overflow-hidden border border-[#C5A059] shadow-lg shadow-black/10 bg-[#FAF9F6] ${className}`}>
      {/* Cornisa Superior */}
      {topLintel !== false && (
        <TempleLintelTop>
          {topLintel}
        </TempleLintelTop>
      )}

      {/* Cuerpo Principal flanqueado por dos Columnas Griegas */}
      <div className="flex-1 flex flex-row items-stretch min-h-0 relative">
        <GreekColumn size={size} width={columnWidth} />
        
        <div className={`flex-1 min-w-0 relative ${innerClassName}`}>
          {children}
        </div>

        <GreekColumn size={size} width={columnWidth} />
      </div>

      {/* Cornisa Inferior */}
      {bottomLintel !== false && (
        <TempleLintelBottom>
          {bottomLintel}
        </TempleLintelBottom>
      )}
    </div>
  );
}

/**
 * MEDALLÓN DE ORO IMPERIAL DE ZEUS CON LAURELES
 */
export function ZeusMedallion({ size = 'w-20 h-20 sm:w-24 sm:h-24', className = '' }) {
  return (
    <div className={`relative flex items-center justify-center shrink-0 ${size} ${className}`}>
      {/* Aureola de destello */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#D4AF37]/30 to-[#F3E5AB]/60 blur-md animate-pulse"></div>

      {/* Medallón grabado en relieve */}
      <div className="relative w-full h-full rounded-full bg-gradient-to-br from-[#FCE8A6] via-[#D4AF37] to-[#8C6D1F] border-2 border-[#F3E5AB] p-[2.5px] shadow-[0_4px_16px_rgba(140,109,31,0.45)]">
        <div className="w-full h-full rounded-full bg-gradient-to-br from-[#FAF8F2] via-[#EFEBE0] to-[#DDD7C6] border border-[#C5A059] flex items-center justify-center relative overflow-hidden shadow-inner">
          {/* Relieve griego concéntrico */}
          <div className="absolute inset-1 rounded-full border border-[#D4AF37]/50 border-dashed"></div>

          {/* Icono de Zeus / León / Rayo imperial */}
          <div className="relative flex flex-col items-center justify-center text-[#997A2C]">
            <i className="fa-solid fa-bolt-lightning text-2xl sm:text-3xl text-gradient-gold drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"></i>
            <span className="font-cinzel text-[7px] sm:text-[8px] font-black tracking-widest text-[#0F1E36] uppercase mt-0.5">
              OLYMPUS
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * GRECA GRIEGA DECORATIVA (MEANDRO)
 */
export function GreekMeanderDivider({ className = '' }) {
  return (
    <div
      className={`w-full h-2.5 opacity-60 ${className}`}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='10' viewBox='0 0 24 10'%3E%3Cpath d='M0,1 H10 V9 H4 V5 H6 V7 H8 V3 H2 V10 H12 V0 H0 Z M12,1 H22 V9 H16 V5 H18 V7 H20 V3 H14 V10 H24 V0 H12 Z' fill='%23C5A059'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat-x'
      }}
    ></div>
  );
}

export default GreekColumn;

