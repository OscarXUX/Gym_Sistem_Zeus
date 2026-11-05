import React, { useState, useEffect } from 'react';

const DEFAULT_NOTICES = [
  {
    id: 'n1',
    badge: 'REGLA DE ORO • HIGIENE OBLIGATORIA',
    title: 'USO OBLIGATORIO DE TOALLA',
    desc: 'Por higiene y respeto a tus hermanos de armas, es obligatorio portar toalla personal para limpiar bancos y máquinas al terminar.',
    icon: 'fa-spray-can-sparkles',
    theme: 'amber'
  },
  {
    id: 'n2',
    badge: 'CÓDIGO DE HONOR • DISCIPLINA',
    title: 'DESCARGA TUS BARRAS Y ACOMODA EL EQUIPO',
    desc: 'Si tuviste la fuerza para levantarlo, ten la disciplina de guardarlo. Regresa mancuernas y discos a sus racks.',
    icon: 'fa-dumbbell',
    theme: 'red'
  },
  {
    id: 'n3',
    badge: 'SEGURIDAD • PREVENCIÓN',
    title: 'CALZADO Y VESTIMENTA DEPORTIVA',
    desc: 'Por tu seguridad en sala de pesas, está estrictamente prohibido entrenar descalzo, en sandalias o con calzado no deportivo.',
    icon: 'fa-shoe-prints',
    theme: 'blue'
  },
  {
    id: 'n4',
    badge: 'HORARIOS OFICIALES • LA LEGIÓN',
    title: 'HORARIOS DEL CAMPO DE BATALLA',
    desc: 'Lunes a Viernes: 6:00 AM – 10:00 PM | Sábados: 7:00 AM – 2:00 PM. ¡Cero excusas en la legión GEARS GYM!',
    icon: 'fa-clock',
    theme: 'emerald'
  }
];

const THEME_STYLES = {
  amber: {
    border: 'border-amber-500/50',
    bg: 'bg-amber-950/20',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    iconBg: 'bg-amber-950/80 border-amber-500/50 text-amber-400',
    title: 'text-amber-400'
  },
  red: {
    border: 'border-red-600/50',
    bg: 'bg-red-950/20',
    badge: 'bg-red-600/20 text-red-400 border-red-600/30',
    iconBg: 'bg-red-950/80 border-red-600/50 text-red-500',
    title: 'text-red-500'
  },
  blue: {
    border: 'border-blue-500/50',
    bg: 'bg-blue-950/20',
    badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    iconBg: 'bg-blue-950/80 border-blue-500/50 text-blue-400',
    title: 'text-blue-400'
  },
  emerald: {
    border: 'border-emerald-500/50',
    bg: 'bg-emerald-950/20',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    iconBg: 'bg-emerald-950/80 border-emerald-500/50 text-emerald-400',
    title: 'text-emerald-400'
  }
};

export default function ComunicacionesTab({
  tvConfig,
  onSendPromo,
  onUpdateTvConfig,
  onRemoteSelectTariff,
  onRemoteNextPromo
}) {
  // Sub-pestañas: control 2x2 en móviles / 4 columnas en desktop (0 scroll horizontal)
  const [activeSubTab, setActiveSubTab] = useState('notices'); // 'notices' | 'broadcast' | 'tariffs' | 'appearance'

  const [promoBadge, setPromoBadge] = useState('AVISO EN VIVO DESDE RECEPCIÓN');
  const [promoTitle, setPromoTitle] = useState('');
  const [promoMsg, setPromoMsg] = useState('');

  // Carrusel de Avisos
  const [gymNotices, setGymNotices] = useState(tvConfig?.gymNotices || DEFAULT_NOTICES);
  const [activeNoticeIndex, setActiveNoticeIndex] = useState(0);

  // Tarifas
  const [tariffs, setTariffs] = useState(
    tvConfig?.tariffs || [
      { name: 'Mensualidad', price: '$400', sub: 'Acceso Total 30 días', promoTitle: 'MENSUALIDAD GEARS — $400 MXN', promoDesc: 'Acceso total durante 30 días de entrenamiento sin límites en el campo de batalla.' },
      { name: 'Promo 2 Guerreros', price: '2x$700', sub: '¡Ahorras $100 MXN!', promoTitle: 'PROMO DÚO 2 X $700 MXN', promoDesc: 'Entrena con tu compañero de escuadrón y ahorren $100 MXN en su mensualidad.' },
      { name: 'Quincena', price: '$250', sub: '15 días de batalla', promoTitle: 'QUINCENA GEARS — $250 MXN', promoDesc: '15 días intensos de entrenamiento. ¡Cero excusas en la legión GEARS GYM!' },
      { name: 'Visita del Día', price: '$60', sub: 'Pase individual', promoTitle: 'VISITA DEL DÍA — $60 MXN', promoDesc: 'Pase individual de acceso completo por un día. ¡Entrena sin piedad!' }
    ]
  );
  const [tariffsHeader, setTariffsHeader] = useState(tvConfig?.tariffsHeader || 'TARIFAS OFICIALES DE LA LEGIÓN');

  // Ajustes Generales
  const [musicTitle, setMusicTitle] = useState(tvConfig?.musicTitle || 'HEAVY WORKOUT MIX');
  const [sensorTitle, setSensorTitle] = useState(tvConfig?.sensorTitle || 'Coloca tu huella en el sensor para entrar');
  const [sensorSub, setSensorSub] = useState(tvConfig?.sensorSub || 'El sistema mostrará tus días restantes de forma automática en pantalla');
  const [sensorBtn, setSensorBtn] = useState(tvConfig?.sensorBtn || 'PIN O HUELLA');
  const [card1Title, setCard1Title] = useState(tvConfig?.card1Title || 'SUPLEMENTOS EN RECEPCIÓN');
  const [card1Desc, setCard1Desc] = useState(tvConfig?.card1Desc || 'Pregunta por tu Scoop de Pre-entreno Hype, Creatina y Proteína por servicio.');
  const [card2Title, setCard2Title] = useState(tvConfig?.card2Title || 'CÓDIGO DE HONOR GEARS');
  const [card2Desc, setCard2Desc] = useState(tvConfig?.card2Desc || 'Descarga los discos al terminar y trae tu toalla. ¡Entrena sin piedad!');
  const [footerTicker, setFooterTicker] = useState(tvConfig?.footerTicker || 'Mensualidad $400 | Promo 2x$700 | Quincena $250 | Visita $60');
  const [bgImage, setBgImage] = useState(tvConfig?.bgImage || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1400&q=80');

  useEffect(() => {
    if (tvConfig) {
      let noticesToSet = tvConfig.gymNotices;
      if (typeof noticesToSet === 'string') {
        try {
          noticesToSet = JSON.parse(noticesToSet);
        } catch (e) {
          noticesToSet = null;
        }
      }
      if (Array.isArray(noticesToSet) && noticesToSet.length > 0) {
        setGymNotices(noticesToSet);
      }
      if (tvConfig.tariffs) setTariffs(tvConfig.tariffs);
      if (tvConfig.tariffsHeader) setTariffsHeader(tvConfig.tariffsHeader);
      if (tvConfig.musicTitle) setMusicTitle(tvConfig.musicTitle);
      if (tvConfig.sensorTitle) setSensorTitle(tvConfig.sensorTitle);
      if (tvConfig.sensorSub) setSensorSub(tvConfig.sensorSub);
      if (tvConfig.sensorBtn) setSensorBtn(tvConfig.sensorBtn);
      if (tvConfig.card1Title) setCard1Title(tvConfig.card1Title);
      if (tvConfig.card1Desc) setCard1Desc(tvConfig.card1Desc);
      if (tvConfig.card2Title) setCard2Title(tvConfig.card2Title);
      if (tvConfig.card2Desc) setCard2Desc(tvConfig.card2Desc);
      if (tvConfig.footerTicker) setFooterTicker(tvConfig.footerTicker);
      if (tvConfig.bgImage) setBgImage(tvConfig.bgImage);
    }
  }, [tvConfig]);

  const handleFillExample = () => {
    setPromoBadge('PROMO RELÁMPAGO HOY');
    setPromoTitle('VENTA NOCTURNA 💀');
    setPromoMsg('A partir de las 8:00 PM, todos los Suplementos y Scoops pre-entreno tienen 15% de descuento.');
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!promoTitle.trim()) return alert('Escribe el título de la promoción');
    onSendPromo({
      badge: promoBadge.trim() || 'AVISO EN VIVO DESDE RECEPCIÓN',
      title: promoTitle.trim(),
      msg: promoMsg.trim() || 'Aviso para el pelotón.'
    });
    setPromoTitle('');
    setPromoMsg('');
  };

  const handleSaveTariffs = () => {
    onUpdateTvConfig({ tariffs, tariffsHeader });
  };

  const handleSaveNotices = () => {
    onUpdateTvConfig({
      gymNotices,
      card2Title: gymNotices[1]?.badge || card2Title,
      card2Desc: gymNotices[1]?.desc || card2Desc
    });
    fetch('/api/tv-config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        gymNotices,
        card2Title: gymNotices[1]?.badge || card2Title,
        card2Desc: gymNotices[1]?.desc || card2Desc
      })
    }).catch((err) => console.log('POST /api/tv-config error:', err));
  };

  const handleResetNotices = () => {
    if (confirm('¿Restablecer los 4 avisos oficiales (Uso de toalla, descarga de barras, calzado, horarios)?')) {
      setGymNotices(DEFAULT_NOTICES);
      setActiveNoticeIndex(0);
      onUpdateTvConfig({
        gymNotices: DEFAULT_NOTICES,
        card2Title: DEFAULT_NOTICES[1].badge,
        card2Desc: DEFAULT_NOTICES[1].desc
      });
    }
  };

  const handleNoticeChange = (idx, field, val) => {
    const updated = [...gymNotices];
    updated[idx] = { ...updated[idx], [field]: val };
    setGymNotices(updated);
  };

  const handleAddNotice = () => {
    const newId = 'n_' + Date.now();
    const newNotice = {
      id: newId,
      badge: 'COMUNICADO ESPECIAL',
      title: 'NUEVO AVISO DE LA LEGIÓN',
      desc: 'Escribe aquí la indicación para los socios.',
      icon: 'fa-bullhorn',
      theme: 'amber'
    };
    const nextList = [...gymNotices, newNotice];
    setGymNotices(nextList);
    setActiveNoticeIndex(nextList.length - 1);
  };

  const handleRemoveNotice = (idx) => {
    if (gymNotices.length <= 1) return alert('Debe haber al menos 1 aviso en el carrusel.');
    const updated = gymNotices.filter((_, i) => i !== idx);
    setGymNotices(updated);
    setActiveNoticeIndex(Math.max(0, idx - 1));
  };

  const handleSaveFull = () => {
    onUpdateTvConfig({
      musicTitle,
      sensorTitle,
      sensorSub,
      sensorBtn,
      card1Title,
      card1Desc,
      card2Title,
      card2Desc,
      footerTicker,
      bgImage
    });
  };

  const handleTariffChange = (idx, field, val) => {
    const updated = [...tariffs];
    updated[idx] = { ...updated[idx], [field]: val };
    setTariffs(updated);
  };

  const safeIndex = Math.min(activeNoticeIndex, Math.max(0, gymNotices.length - 1));
  const activeNotice = gymNotices[safeIndex] || DEFAULT_NOTICES[0];
  const activeNoticeTheme = THEME_STYLES[activeNotice?.theme || 'amber'] || THEME_STYLES.amber;

  // Botones de sub-pestañas pensados para Grid 2x2 en móviles
  const subTabs = [
    { id: 'notices', label: 'Avisos TV', icon: 'fa-bullhorn', tag: `${gymNotices.length}` },
    { id: 'broadcast', label: 'Alerta Flash', icon: 'fa-bolt', tag: 'Vivo' },
    { id: 'tariffs', label: 'Tarifas', icon: 'fa-tags', tag: 'Precios' },
    { id: 'appearance', label: 'Pantalla', icon: 'fa-sliders', tag: 'Fondo' }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto p-3 sm:p-5 space-y-4 animate-fadeIn overflow-x-hidden">
      {/* CABECERA COMPACTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-stone-800/80 pb-3">
        <div>
          <h2 className="text-lg sm:text-2xl font-black text-white flex items-center gap-2">
            <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-red-950/70 border border-red-600/50 flex items-center justify-center text-red-500 text-xs sm:text-sm shrink-0">
              <i className="fa-solid fa-tv"></i>
            </span>
            <span className="truncate">Configuración Monitor TV</span>
          </h2>
          <p className="text-stone-400 text-[11px] sm:text-xs mt-0.5">
            Personaliza el contenido transmitido en la pantalla de recepción.
          </p>
        </div>
      </div>

      {/* MENÚ RESPONSIVO: 2x2 EN MÓVILES / 4 COLUMNAS EN DESKTOP (CERO SCROLL HORIZONTAL) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full">
        {subTabs.map((tab) => {
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id)}
              className={`min-h-[46px] px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-between gap-2 border ${
                isActive
                  ? 'bg-red-600 text-white shadow-lg shadow-red-900/40 border-red-500'
                  : 'bg-stone-900/80 hover:bg-stone-800 text-stone-300 border-stone-800'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <i className={`fa-solid ${tab.icon} text-xs shrink-0 ${isActive ? 'text-white' : 'text-stone-400'}`}></i>
                <span className="truncate">{tab.label}</span>
              </div>
              <span
                className={`text-[9px] font-black px-1.5 py-0.5 rounded shrink-0 ${
                  isActive ? 'bg-black/30 text-white' : 'bg-stone-800 text-stone-400'
                }`}
              >
                {tab.tag}
              </span>
            </button>
          );
        })}
      </div>

      {/* ================================================================ */}
      {/* SECCIÓN 1: CARRUSEL DE AVISOS                                    */}
      {/* ================================================================ */}
      {activeSubTab === 'notices' && (
        <div className="bg-[#0a0a0a] border border-stone-800 rounded-2xl p-3.5 sm:p-5 shadow-xl space-y-4">
          {/* Header de la sección */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-stone-800/80 pb-3">
            <div>
              <h3 className="font-gears text-sm sm:text-base font-black text-white flex items-center gap-2">
                <span>Carrusel de Avisos</span>
                <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-500/30">
                  {gymNotices.length} de 8
                </span>
              </h3>
              <p className="text-[11px] text-stone-400">
                Aparece rotando automáticamente entre promociones y tarifas.
              </p>
            </div>
            {/* Botones de acción en grid móvil para que nunca se desborden */}
            <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleResetNotices}
                className="text-[11px] bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-700 py-2 px-3 rounded-xl font-bold cursor-pointer transition-all text-center"
                title="Restablecer los 4 avisos oficiales"
              >
                <i className="fa-solid fa-rotate-left mr-1"></i> Reiniciar
              </button>
              <button
                type="button"
                onClick={handleSaveNotices}
                className="bg-amber-600 hover:bg-amber-500 active:scale-95 text-black font-black text-xs py-2 px-3.5 rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-amber-600/30 cursor-pointer transition-all"
              >
                <i className="fa-solid fa-floppy-disk"></i> Guardar TV
              </button>
            </div>
          </div>

          {/* BARRA DE NAVEGACIÓN NUMÉRICA DE AVISOS (100% RESPONSIVE SIN SCROLL HORIZONTAL) */}
          <div className="bg-stone-950 border border-stone-800/80 rounded-xl p-2.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
            {/* Pastillas numéricas compactas */}
            <div className="flex items-center justify-between sm:justify-start gap-1.5 w-full sm:w-auto">
              <div className="flex items-center gap-1.5 flex-wrap">
                {gymNotices.map((n, idx) => {
                  const isActive = safeIndex === idx;
                  return (
                    <button
                      key={n.id || idx}
                      type="button"
                      onClick={() => setActiveNoticeIndex(idx)}
                      className={`w-9 h-9 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center justify-center ${
                        isActive
                          ? 'bg-amber-500 text-black shadow-md shadow-amber-500/30 scale-105'
                          : 'bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800'
                      }`}
                      title={`Aviso #${idx + 1}: ${n.title}`}
                    >
                      #{idx + 1}
                    </button>
                  );
                })}
              </div>

              {gymNotices.length < 8 && (
                <button
                  type="button"
                  onClick={handleAddNotice}
                  className="h-9 px-2.5 rounded-lg text-xs font-bold bg-stone-900 hover:bg-stone-800 border border-dashed border-stone-700 text-stone-400 hover:text-white cursor-pointer flex items-center gap-1 shrink-0"
                  title="Añadir nuevo aviso"
                >
                  <i className="fa-solid fa-plus text-[10px]"></i>
                  <span className="text-[11px]">Nuevo</span>
                </button>
              )}
            </div>

            {/* Selector de avance rápido con flechas táctiles */}
            <div className="flex items-center justify-between sm:justify-end gap-2 border-t sm:border-t-0 border-stone-800/80 pt-2 sm:pt-0">
              <span className="text-[11px] font-bold text-amber-400 truncate">
                Aviso {safeIndex + 1} de {gymNotices.length}
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  disabled={safeIndex === 0}
                  onClick={() => setActiveNoticeIndex((prev) => Math.max(0, prev - 1))}
                  className="w-8 h-8 rounded-lg bg-stone-900 hover:bg-stone-800 disabled:opacity-30 disabled:cursor-not-allowed border border-stone-800 text-stone-300 flex items-center justify-center text-xs cursor-pointer"
                  title="Aviso Anterior"
                >
                  <i className="fa-solid fa-chevron-left"></i>
                </button>
                <button
                  type="button"
                  disabled={safeIndex === gymNotices.length - 1}
                  onClick={() => setActiveNoticeIndex((prev) => Math.min(gymNotices.length - 1, prev + 1))}
                  className="w-8 h-8 rounded-lg bg-stone-900 hover:bg-stone-800 disabled:opacity-30 disabled:cursor-not-allowed border border-stone-800 text-stone-300 flex items-center justify-center text-xs cursor-pointer"
                  title="Siguiente Aviso"
                >
                  <i className="fa-solid fa-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>

          {/* FORMULARIO DEL AVISO ACTIVO */}
          <div className="bg-stone-950/80 border border-stone-800 rounded-xl p-3 sm:p-4 space-y-3">
            <div className="flex justify-between items-center border-b border-stone-800/60 pb-2">
              <span className="font-gears text-xs font-black text-amber-400 uppercase tracking-wider truncate">
                Editando Aviso #{safeIndex + 1}
              </span>
              {gymNotices.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveNotice(safeIndex)}
                  className="text-[11px] text-red-400 hover:text-red-300 cursor-pointer flex items-center gap-1 font-semibold"
                >
                  <i className="fa-solid fa-trash-can text-[10px]"></i> Eliminar
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-stone-400 block mb-1">
                  Insignia / Categoría
                </label>
                <input
                  type="text"
                  value={activeNotice.badge || ''}
                  onChange={(e) => handleNoticeChange(safeIndex, 'badge', e.target.value)}
                  placeholder="Ej. REGLA DE ORO • HIGIENE"
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white font-bold focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-stone-400 block mb-1">
                  Estilo de Color
                </label>
                <select
                  value={activeNotice.theme || 'amber'}
                  onChange={(e) => handleNoticeChange(safeIndex, 'theme', e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white font-bold focus:border-amber-500 focus:outline-none cursor-pointer"
                >
                  <option value="amber">Ámbar (Higiene / Toalla)</option>
                  <option value="red">Carmesí Gears (Disciplina / Pesas)</option>
                  <option value="blue">Azul Glaciar (Seguridad / Calzado)</option>
                  <option value="emerald">Esmeralda (Horarios / Info)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-stone-400 block mb-1">
                Icono de Pantalla
              </label>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center text-amber-400 text-sm shrink-0">
                  <i className={`fa-solid ${activeNotice.icon || 'fa-triangle-exclamation'}`}></i>
                </div>
                <select
                  value={activeNotice.icon || 'fa-spray-can-sparkles'}
                  onChange={(e) => handleNoticeChange(safeIndex, 'icon', e.target.value)}
                  className="flex-1 min-w-0 bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white font-bold focus:border-amber-500 focus:outline-none cursor-pointer"
                >
                  <option value="fa-spray-can-sparkles">Toalla / Spray</option>
                  <option value="fa-rug">Toalla Estampada</option>
                  <option value="fa-soap">Higiene / Jabón</option>
                  <option value="fa-dumbbell">Mancuerna / Pesas</option>
                  <option value="fa-shoe-prints">Calzado Deportivo</option>
                  <option value="fa-clock">Reloj / Horarios</option>
                  <option value="fa-skull">Calavera Gears</option>
                  <option value="fa-triangle-exclamation">Alerta / Atención</option>
                  <option value="fa-bullhorn">Megáfono / Aviso</option>
                  <option value="fa-bolt">Rayo de Energía</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-stone-400 block mb-1">
                Título Principal
              </label>
              <input
                type="text"
                value={activeNotice.title || ''}
                onChange={(e) => handleNoticeChange(safeIndex, 'title', e.target.value)}
                placeholder="Ej. USO OBLIGATORIO DE TOALLA"
                className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white font-gears font-black tracking-wide focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-stone-400 block mb-1">
                Indicaciones para el Socio
              </label>
              <textarea
                rows={2}
                value={activeNotice.desc || ''}
                onChange={(e) => handleNoticeChange(safeIndex, 'desc', e.target.value)}
                placeholder="Ej. Por respeto a tus compañeros porta siempre toalla..."
                className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 resize-none font-medium focus:border-amber-500 focus:outline-none"
              />
            </div>

            {/* Previsualización en Vivo Responsiva */}
            <div className="pt-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-stone-500 block mb-1.5 flex items-center gap-1.5">
                <i className="fa-solid fa-desktop text-[10px]"></i> Previsualización en Monitor TV
              </span>
              <div className={`p-3.5 rounded-xl border-2 ${activeNoticeTheme.border} ${activeNoticeTheme.bg} space-y-2`}>
                <span className={`text-[9px] font-black px-2 py-0.5 rounded border uppercase tracking-wider inline-block ${activeNoticeTheme.badge}`}>
                  {activeNotice.badge || 'COMUNICADO'}
                </span>
                <div className="flex items-start gap-2.5">
                  <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${activeNoticeTheme.iconBg}`}>
                    <i className={`fa-solid ${activeNotice.icon || 'fa-bullhorn'} text-sm`}></i>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className={`font-gears font-black text-xs sm:text-sm leading-tight uppercase truncate ${activeNoticeTheme.title}`}>
                      {activeNotice.title || 'Título del Aviso'}
                    </h4>
                    <p className="text-[11px] text-stone-300 mt-0.5 leading-snug line-clamp-2">
                      {activeNotice.desc || 'Descripción de la indicación para los socios.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* SECCIÓN 2: TRANSMISOR RÁPIDO DE ALERTA FLASH                     */}
      {/* ================================================================ */}
      {activeSubTab === 'broadcast' && (
        <div className="bg-[#0a0a0a] border border-stone-800 rounded-2xl p-3.5 sm:p-5 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-stone-800/80 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-red-950/80 border border-red-600/50 flex items-center justify-center text-red-500 shrink-0">
                <i className="fa-solid fa-bolt text-sm"></i>
              </div>
              <div>
                <h3 className="font-gears text-sm sm:text-base font-black text-white">
                  Alerta Flash en Pantalla TV
                </h3>
                <p className="text-[11px] text-stone-400">Interrumpe de inmediato con sonido y animación de flash</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleFillExample}
              className="w-full sm:w-auto text-[11px] bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-700 py-2 px-3 rounded-xl font-bold cursor-pointer transition-colors text-center"
            >
              <i className="fa-solid fa-wand-magic-sparkles mr-1 text-amber-400"></i> Llenar Ejemplo
            </button>
          </div>

          <form onSubmit={handleSend} className="space-y-3">
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-stone-400 block mb-1">
                Insignia Superior (Badge)
              </label>
              <input
                type="text"
                value={promoBadge}
                onChange={(e) => setPromoBadge(e.target.value)}
                className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-red-600 font-bold"
                placeholder="Ej. PROMO RELÁMPAGO HOY"
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-stone-400 block mb-1">
                Título del Anuncio
              </label>
              <input
                type="text"
                value={promoTitle}
                onChange={(e) => setPromoTitle(e.target.value)}
                className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-red-600 font-bold"
                placeholder="Ej. PROMOCIÓN DE PROTEÍNA"
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-stone-400 block mb-1">
                Mensaje Secundario
              </label>
              <textarea
                rows={2}
                value={promoMsg}
                onChange={(e) => setPromoMsg(e.target.value)}
                className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-red-600 resize-none font-medium"
                placeholder="Ej. Válido por los próximos 30 minutos en recepción."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-500 active:scale-[0.98] text-white font-bold py-2.5 px-3 rounded-xl text-xs uppercase tracking-wider flex justify-center items-center gap-2 shadow-lg shadow-red-600/30 cursor-pointer transition-all"
              >
                <i className="fa-solid fa-paper-plane text-xs"></i> Lanzar Alerta en TV
              </button>
              <button
                type="button"
                onClick={onRemoteNextPromo}
                className="bg-stone-900 hover:bg-stone-800 active:scale-[0.98] text-stone-300 font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer border border-stone-700 transition-colors"
                title="Avanzar manualmente a la siguiente promo en TV"
              >
                <i className="fa-solid fa-forward-step text-xs"></i> Siguiente Promo
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================================================================ */}
      {/* SECCIÓN 3: TARIFAS & CARTELERA                                   */}
      {/* ================================================================ */}
      {activeSubTab === 'tariffs' && (
        <div className="bg-[#0a0a0a] border border-stone-800 rounded-2xl p-3.5 sm:p-5 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-stone-800/80 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-950/80 border border-emerald-600/50 flex items-center justify-center text-emerald-400 shrink-0">
                <i className="fa-solid fa-tags text-sm"></i>
              </div>
              <div>
                <h3 className="font-gears text-sm sm:text-base font-black text-white">
                  Tarifas Oficiales
                </h3>
                <p className="text-[11px] text-stone-400">Precios mostrados a clientes en recepción</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleSaveTariffs}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs py-2 px-3.5 rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950/40 cursor-pointer transition-all"
            >
              <i className="fa-solid fa-floppy-disk"></i> Guardar Tarifas
            </button>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-stone-400 block mb-1">
              Encabezado en Pantalla TV
            </label>
            <input
              type="text"
              value={tariffsHeader}
              onChange={(e) => setTariffsHeader(e.target.value)}
              className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white placeholder-stone-600 font-bold focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            {tariffs.map((t, i) => (
              <div key={i} className="bg-stone-950/80 border border-stone-800 rounded-xl p-3 space-y-2">
                <div className="flex justify-between items-center border-b border-stone-800/60 pb-1.5">
                  <span className="font-gears text-xs font-black text-red-400">TARIFA #{i + 1}</span>
                  <button
                    type="button"
                    onClick={() => onRemoteSelectTariff(i)}
                    className="text-[10px] bg-red-950/50 hover:bg-red-900/60 border border-red-800/60 text-red-300 font-bold px-2 py-0.5 rounded cursor-pointer transition-colors flex items-center gap-1"
                    title="Destacar esta tarjeta en el Monitor TV"
                  >
                    <i className="fa-solid fa-eye text-[9px]"></i> Destacar
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] text-stone-400 uppercase font-bold block mb-0.5">Plan</label>
                    <input
                      type="text"
                      value={t.name}
                      onChange={(e) => handleTariffChange(i, 'name', e.target.value)}
                      className="w-full bg-stone-900 border border-stone-800 rounded-lg px-2 py-1.5 text-xs text-white font-bold focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-stone-400 uppercase font-bold block mb-0.5">Precio</label>
                    <input
                      type="text"
                      value={t.price}
                      onChange={(e) => handleTariffChange(i, 'price', e.target.value)}
                      className="w-full bg-stone-900 border border-stone-800 rounded-lg px-2 py-1.5 text-xs text-emerald-400 font-gears font-bold focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[9px] text-stone-400 uppercase font-bold block mb-0.5">Subtítulo</label>
                  <input
                    type="text"
                    value={t.sub}
                    onChange={(e) => handleTariffChange(i, 'sub', e.target.value)}
                    className="w-full bg-stone-900 border border-stone-800 rounded-lg px-2 py-1.5 text-xs text-stone-300 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[9px] text-stone-400 uppercase font-bold block mb-0.5">Título al Destacar</label>
                  <input
                    type="text"
                    value={t.promoTitle}
                    onChange={(e) => handleTariffChange(i, 'promoTitle', e.target.value)}
                    className="w-full bg-stone-900 border border-stone-800 rounded-lg px-2 py-1.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* SECCIÓN 4: PANTALLA & APARIENCIA                                 */}
      {/* ================================================================ */}
      {activeSubTab === 'appearance' && (
        <div className="bg-[#0a0a0a] border border-stone-800 rounded-2xl p-3.5 sm:p-5 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-stone-800/80 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-950/80 border border-blue-600/50 flex items-center justify-center text-blue-400 shrink-0">
                <i className="fa-solid fa-sliders text-sm"></i>
              </div>
              <div>
                <h3 className="font-gears text-sm sm:text-base font-black text-white">
                  Apariencia del Monitor TV
                </h3>
                <p className="text-[11px] text-stone-400">Música, marquesina, tarjetas laterales e imagen de fondo</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleSaveFull}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold text-xs py-2 px-3.5 rounded-xl flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-all"
            >
              <i className="fa-solid fa-sync"></i> Sincronizar Todo
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-stone-400 block mb-1">
                Título Música Gym
              </label>
              <input
                type="text"
                value={musicTitle}
                onChange={(e) => setMusicTitle(e.target.value)}
                className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white font-bold focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-stone-400 block mb-1">
                Cintillo Inferior (Ticker)
              </label>
              <input
                type="text"
                value={footerTicker}
                onChange={(e) => setFooterTicker(e.target.value)}
                className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-300 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Tarjetas Laterales */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-stone-800/80">
            <div className="bg-stone-950/80 border border-stone-800 rounded-xl p-3 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <i className="fa-solid fa-bottle-water"></i> Lateral 1: Suplementos
              </span>
              <input
                type="text"
                value={card1Title}
                onChange={(e) => setCard1Title(e.target.value)}
                placeholder="Título Tarjeta 1"
                className="w-full bg-stone-900 border border-stone-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-bold focus:border-amber-500 focus:outline-none"
              />
              <input
                type="text"
                value={card1Desc}
                onChange={(e) => setCard1Desc(e.target.value)}
                placeholder="Descripción Tarjeta 1"
                className="w-full bg-stone-900 border border-stone-800 rounded-lg px-2.5 py-1.5 text-xs text-stone-300 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="bg-stone-950/80 border border-stone-800 rounded-xl p-3 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                <i className="fa-solid fa-shield-halved"></i> Lateral 2: Código de Honor
              </span>
              <input
                type="text"
                value={card2Title}
                onChange={(e) => setCard2Title(e.target.value)}
                placeholder="Título Tarjeta 2"
                className="w-full bg-stone-900 border border-stone-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-bold focus:border-red-500 focus:outline-none"
              />
              <input
                type="text"
                value={card2Desc}
                onChange={(e) => setCard2Desc(e.target.value)}
                placeholder="Descripción Tarjeta 2"
                className="w-full bg-stone-900 border border-stone-800 rounded-lg px-2.5 py-1.5 text-xs text-stone-300 focus:border-red-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Imagen de Fondo y Presets en cuadrícula móvil */}
          <div className="space-y-2 pt-2 border-t border-stone-800/80">
            <label className="text-[10px] font-black uppercase tracking-wider text-stone-400 block">
              URL Imagen de Fondo TV
            </label>
            <input
              type="text"
              value={bgImage}
              onChange={(e) => setBgImage(e.target.value)}
              className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  const url = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1400&q=80';
                  setBgImage(url);
                  onUpdateTvConfig({ bgImage: url });
                }}
                className="text-[11px] bg-stone-950 border border-stone-800 hover:bg-stone-800 text-stone-300 py-2 px-2.5 rounded-xl cursor-pointer transition-colors font-bold text-center"
              >
                <i className="fa-solid fa-image mr-1 text-red-400"></i> Preset 1 (Gears Dark)
              </button>
              <button
                type="button"
                onClick={() => {
                  const url = 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1400&q=80';
                  setBgImage(url);
                  onUpdateTvConfig({ bgImage: url });
                }}
                className="text-[11px] bg-stone-950 border border-stone-800 hover:bg-stone-800 text-stone-300 py-2 px-2.5 rounded-xl cursor-pointer transition-colors font-bold text-center"
              >
                <i className="fa-solid fa-image mr-1 text-amber-400"></i> Preset 2 (Crossfit)
              </button>
              <button
                type="button"
                onClick={() => {
                  const url = 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1400&q=80';
                  setBgImage(url);
                  onUpdateTvConfig({ bgImage: url });
                }}
                className="text-[11px] bg-stone-950 border border-stone-800 hover:bg-stone-800 text-stone-300 py-2 px-2.5 rounded-xl cursor-pointer transition-colors font-bold text-center"
              >
                <i className="fa-solid fa-image mr-1 text-blue-400"></i> Preset 3 (Neon Gym)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
