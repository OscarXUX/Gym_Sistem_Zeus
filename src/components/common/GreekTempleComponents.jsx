import React from 'react';

/**
 * CAPITEL JÓNICO/DÓRICO DE COLUMNA GRIEGA (MÁRMOL ESCULPIDO Y ORO IMPERIAL)
 */
export function ColumnCapital({ size = 'md', className = '' }) {
  const isSm = size === 'sm';
  const height = isSm ? 'h-3 sm:h-3.5' : 'h-4 sm:h-5';

  return (
    <div className={`w-full ${height} shrink-0 relative flex flex-col justify-end z-20 ${className}`}>
      {/* Ábaco superior con filete de oro imperial */}
      <div className="w-[114%] -ml-[7%] h-1 sm:h-1.5 bg-gradient-to-r from-[#AA8220] via-[#F3E5AB] to-[#AA8220] border-b border-[#7D5D11] shadow-sm rounded-t-[1px]"></div>
      {/* Equino de mármol con volutas jónicas en relieve */}
      <div
        className="w-[108%] -ml-[4%] flex-1 border-x border-[#C5A059] flex items-center justify-between px-0.5 shadow-inner"
        style={{
          background: 'linear-gradient(90deg, #CFC9BC 0%, #FFFFFF 35%, #F4F2EB 65%, #B8B1A0 100%)'
        }}
      >
        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full border border-[#997A2C] bg-gradient-to-tr from-[#AA8220] via-[#D4AF37] to-[#F3E5AB] shadow-sm"></div>
        <div className="flex-1 h-[1.5px] bg-gradient-to-r from-[#C5A059] via-[#F3E5AB] to-[#C5A059] mx-0.5"></div>
        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full border border-[#997A2C] bg-gradient-to-tr from-[#AA8220] via-[#D4AF37] to-[#F3E5AB] shadow-sm"></div>
      </div>
      {/* Collarino astrágalo dorado */}
      <div className="w-full h-[2px] bg-gradient-to-r from-[#8C6D1F] via-[#D4AF37] to-[#8C6D1F]"></div>
    </div>
  );
}

/**
 * BASE ÁTICA DE COLUMNA GRIEGA (MÁRMOL Y ORO)
 */
export function ColumnBase({ size = 'md', className = '' }) {
  const isSm = size === 'sm';
  const height = isSm ? 'h-2.5 sm:h-3' : 'h-3.5 sm:h-4';

  return (
    <div className={`w-full ${height} shrink-0 relative flex flex-col justify-start z-20 ${className}`}>
      {/* Collarino superior */}
      <div className="w-full h-[2px] bg-gradient-to-r from-[#8C6D1F] via-[#D4AF37] to-[#8C6D1F]"></div>
      {/* Toro y Escocia de mármol 3D */}
      <div
        className="w-[108%] -ml-[4%] flex-1 border-x border-[#C5A059] shadow-inner"
        style={{
          background: 'linear-gradient(90deg, #CFC9BC 0%, #FFFFFF 35%, #F4F2EB 65%, #B8B1A0 100%)'
        }}
      ></div>
      {/* Plinto de apoyo con filete dorado */}
      <div className="w-[114%] -ml-[7%] h-1 sm:h-1.5 bg-gradient-to-r from-[#8C6D1F] via-[#F3E5AB] to-[#8C6D1F] shadow-sm rounded-b-[1px]"></div>
    </div>
  );
}

/**
 * FUSTE ESTRIADO CILÍNDRICO 3D (PILAR 2.1: GRADIENTE HORIZONTAL + SOMBRA PROYECTADA)
 */
export function ColumnShaft({ side = 'left', className = '' }) {
  const shadowClass = side === 'right' ? 'olympus-column-right' : 'olympus-column-left';

  return (
    <div
      className={`w-full flex-1 min-h-[20px] relative overflow-hidden border-x border-[#B8943F]/75 olympus-column-shaft ${shadowClass} ${className}`}
    >
      {/* Brillo especular cilíndrico al 35% */}
      <div className="absolute inset-y-0 left-[28%] w-[22%] bg-white/30 pointer-events-none"></div>
    </div>
  );
}

/**
 * COLUMNA GRIEGA 3D REUTILIZABLE
 */
export function GreekColumn({
  size = 'md',
  side = 'left',
  className = '',
  width = 'w-3.5 sm:w-5 md:w-6'
}) {
  return (
    <div className={`h-full flex flex-col shrink-0 select-none pointer-events-none z-20 ${width} ${className}`}>
      <ColumnCapital size={size} />
      <ColumnShaft side={side} />
      <ColumnBase size={size} />
    </div>
  );
}

/**
 * CORNISA SUPERIOR ESCULPIDA EN PIEDRA Y ORO (PILAR 4.1: LIMPIA Y ARQUITECTÓNICA)
 */
export function TempleLintelTop({ title, subtitle, className = '', children }) {
  const hasContent = Boolean(children || title || subtitle);

  return (
    <div
      className={`w-full temple-lintel-top ${
        hasContent ? 'px-3 py-1' : 'h-2.5 sm:h-3'
      } flex items-center justify-between shrink-0 select-none z-20 relative ${className}`}
    >
      {/* Filete interior esculpido cuando es cornisa limpia */}
      {!hasContent ? (
        <div className="w-full h-[2px] bg-gradient-to-r from-[#C5A059]/40 via-[#D4AF37]/80 to-[#C5A059]/40"></div>
      ) : (
        children || (
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
        )
      )}
    </div>
  );
}

/**
 * ZÓCALO ARQUITECTÓNICO DELGADO (PILAR 4.1: 8PX CON SOMBRA, SIN PISOS MUERTOS)
 */
export function TempleLintelBottom({ className = '', children }) {
  return (
    <div
      className={`w-full temple-lintel-bottom h-[8px] flex items-center justify-between shrink-0 select-none z-20 relative ${className}`}
    >
      {children || (
        <div className="w-full h-[1.5px] bg-gradient-to-r from-[#997A2C]/50 via-[#F3E5AB]/85 to-[#997A2C]/50"></div>
      )}
    </div>
  );
}

/**
 * PLANO MEDIO ATMOSFÉRICO: CAPAS DE NUBES ÉPICAS DEL OLIMPO (PILAR 2.2)
 */
export function OlympusCloudsOverlay({ className = '', variant = 'banner' }) {
  return (
    <div className={`absolute inset-0 pointer-events-none select-none overflow-hidden z-[1] ${className}`}>
      {/* Nubes dramáticas iluminadas en la esquina derecha e inferior */}
      <svg
        className="absolute right-0 bottom-0 w-[75%] sm:w-[60%] h-full opacity-90"
        viewBox="0 0 500 220"
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          <radialGradient id="cloudGlow1" cx="75%" cy="65%" r="55%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.42" />
            <stop offset="45%" stopColor="#BFD4F2" stopOpacity="0.22" />
            <stop offset="80%" stopColor="#4A6B9C" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#13223E" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="cloudGlow2" cx="88%" cy="82%" r="48%">
            <stop offset="0%" stopColor="#FFF7D6" stopOpacity="0.48" />
            <stop offset="40%" stopColor="#E2ECF8" stopOpacity="0.28" />
            <stop offset="75%" stopColor="#4A6B9C" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#0A1324" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="cloudMistBase" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4A6B9C" stopOpacity="0" />
            <stop offset="65%" stopColor="#6D8EC2" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#E8EEF7" stopOpacity="0.28" />
          </linearGradient>
        </defs>

        {/* Bruma atmosférica inferior */}
        <rect x="0" y="90" width="500" height="130" fill="url(#cloudMistBase)" />

        {/* Cúmulos de nubes del Olimpo */}
        <ellipse cx="410" cy="150" rx="145" ry="75" fill="url(#cloudGlow1)" />
        <ellipse cx="455" cy="175" rx="120" ry="65" fill="url(#cloudGlow2)" />
        <ellipse cx="310" cy="188" rx="135" ry="52" fill="url(#cloudGlow1)" />
        {variant === 'banner' && (
          <>
            <path
              d="M210 220 C235 178, 285 168, 325 184 C350 142, 415 135, 450 164 C470 148, 492 152, 500 168 L500 220 Z"
              fill="rgba(255, 255, 255, 0.16)"
            />
            <path
              d="M275 220 C305 186, 355 176, 392 192 C418 158, 468 154, 500 178 L500 220 Z"
              fill="rgba(255, 255, 255, 0.22)"
            />
          </>
        )}
      </svg>
    </div>
  );
}

/**
 * CONTENEDOR TEMPLO GRIEGO POLIMÓRFICO (.olympus-card--temple)
 * Enmarca cualquier elemento con cornisa esculpida limpia, 2 columnas cilíndricas 3D con sombra proyectada y zócalo de 8px
 */
export function TempleFrame({
  children,
  className = '',
  innerClassName = '',
  size = 'md',
  columnWidth = 'w-3.5 sm:w-5 md:w-6',
  topLintel = null,
  bottomLintel = null,
  showClouds = true
}) {
  return (
    <div className={`olympus-card olympus-card--temple flex flex-col rounded-lg ${className}`}>
      {/* Cornisa Superior de Piedra Esculpida */}
      {topLintel !== false && <TempleLintelTop>{topLintel}</TempleLintelTop>}

      {/* Cuerpo Principal flanqueado por dos Columnas Griegas 3D que proyectan sombra */}
      <div className="flex-1 flex flex-row items-stretch min-h-0 relative">
        <GreekColumn size={size} side="left" width={columnWidth} />

        <div className={`flex-1 min-w-0 relative ${innerClassName}`}>
          {showClouds && <OlympusCloudsOverlay variant="banner" />}
          {children}
        </div>

        <GreekColumn size={size} side="right" width={columnWidth} />
      </div>

      {/* Zócalo Arquitectónico Delgado (8px) */}
      {bottomLintel !== false && <TempleLintelBottom>{bottomLintel}</TempleLintelBottom>}
    </div>
  );
}

/**
 * COMPONENTE POLIMÓRFICO DE TARJETA (.olympus-card)
 * Variantes: 'temple' | 'marble' | 'glass'
 */
export function OlympusCard({
  variant = 'marble',
  biometricState,
  className = '',
  children,
  ...props
}) {
  const variantClass =
    variant === 'temple'
      ? 'olympus-card--temple'
      : variant === 'glass'
      ? 'olympus-card--glass'
      : 'olympus-card--marble';

  return (
    <div
      data-biometric-state={biometricState}
      className={`olympus-card ${variantClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * SVG DETALLADO DE HUELLA DIGITAL BIOMÉTRICA (PILAR 4.3)
 */
export function FingerprintSvg({ className = 'w-10 h-10 sm:w-12 sm:h-12', color = 'currentColor' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Crestas biométricas concéntricas de alta precisión */}
      <path
        d="M16 24C19.5 16.5 25.3 13 32 13C38.7 13 44.5 16.5 48 24"
        stroke={color}
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d="M12 31C12 19.5 20.8 9 32 9C43.2 9 52 19.5 52 31C52 36.5 50.8 41.8 48.5 46.5"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M19 32C19 23.8 24.8 17.5 32 17.5C39.2 17.5 45 23.8 45 32C45 39.2 42.6 46.2 38.5 52"
        stroke={color}
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d="M15.5 39.5C14.8 36.8 14.5 34 14.5 31.2"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M23.5 32.5C23.5 26.8 27.3 22.2 32 22.2C36.7 22.2 40.5 26.8 40.5 32.5C40.5 38.5 38.2 44.5 34 49.5"
        stroke={color}
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d="M20.5 46.5C18.2 42.2 17 37.2 17 32"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M28 33C28 29.8 29.8 27.2 32 27.2C34.2 27.2 36 29.8 36 33C36 37.8 34 42.8 30.2 47"
        stroke={color}
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      <path
        d="M32 32.5C32 36.2 30.2 40.2 26.5 44"
        stroke={color}
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      <path
        d="M24 51.5C21.8 48.5 20.2 45 19.5 41"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M44 49.5C46.2 44.5 47.5 38.8 47.5 32.5"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * MEDALLÓN DE ORO IMPERIAL CON SVG DE HUELLA DIGITAL Y POLIMORFISMO DE ESTADO
 * (PILAR 1.3 & PILAR 4.3: INSET SHADOW + OUTER GLOW DINÁMICO)
 */
export function ZeusMedallion({
  size = 'w-20 h-20 sm:w-24 sm:h-24',
  biometricState = 'idle',
  className = ''
}) {
  const glowColorClass =
    biometricState === 'granted'
      ? 'from-[#10B981]/45 to-[#34D399]/70'
      : biometricState === 'denied'
      ? 'from-[#EF4444]/45 to-[#FB7185]/70'
      : biometricState === 'warning'
      ? 'from-[#F59E0B]/45 to-[#FBBF24]/70'
      : 'from-[#D4AF37]/40 to-[#F3E5AB]/70';

  const ringClass =
    biometricState === 'granted'
      ? 'from-[#A7F3D0] via-[#10B981] to-[#047857] border-[#6EE7B7]'
      : biometricState === 'denied'
      ? 'from-[#FECDD3] via-[#EF4444] to-[#991B1B] border-[#FDA4AF]'
      : 'from-[#FCE8A6] via-[#D4AF37] to-[#8C6D1F] border-[#F3E5AB]';

  const iconColor =
    biometricState === 'granted'
      ? '#059669'
      : biometricState === 'denied'
      ? '#DC2626'
      : '#0F1E36';

  return (
    <div className={`relative flex items-center justify-center shrink-0 ${size} ${className}`}>
      {/* Halo Exterior Pulsante Polimórfico (Outer Glow) */}
      <div
        className={`absolute -inset-2 rounded-full bg-gradient-to-tr ${glowColorClass} blur-md pulse-ring pointer-events-none`}
      ></div>

      {/* Anillo Metálico Biselado 3D */}
      <div
        className={`biometric-halo relative w-full h-full rounded-full bg-gradient-to-br ${ringClass} border-2 p-[3px] transition-all duration-300`}
        style={{
          boxShadow:
            '0 8px 22px rgba(140, 109, 31, 0.48), 0 0 18px rgba(212, 175, 55, 0.4), inset 0 2px 3px rgba(255, 255, 255, 0.85)'
        }}
      >
        {/* Cavidad Interior Esculpida con Sombra Interna (Inset Shadow) */}
        <div
          className="w-full h-full rounded-full bg-gradient-to-br from-[#FFFFFF] via-[#F4F2EB] to-[#DFD9C8] border border-[#C5A059] flex items-center justify-center relative overflow-hidden"
          style={{
            boxShadow:
              'inset 0 4px 10px rgba(15, 30, 54, 0.22), inset 0 -2px 5px rgba(255, 255, 255, 0.9)'
          }}
        >
          {/* Anillo concéntrico grabado en oro */}
          <div className="absolute inset-1.5 rounded-full border border-[#D4AF37]/60 border-dashed pointer-events-none"></div>

          {/* SVG Detallado de Huella Digital (Fingerprint) */}
          <div className="relative flex flex-col items-center justify-center">
            <FingerprintSvg
              className="w-10 h-10 sm:w-12 sm:h-12 drop-shadow-[0_1px_2px_rgba(212,175,55,0.45)]"
              color={iconColor}
            />
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
