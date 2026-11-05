import React, { useState, useEffect } from 'react';

const DEFAULT_NOTICES = [
  {
    id: 'n1',
    badge: 'DECRETO OLÍMPICO • HIGIENE OBLIGATORIA',
    title: 'USO OBLIGATORIO DE TOALLA',
    desc: 'Por higiene y armonía entre atletas, es obligatorio portar tu toalla oficial Zeus para limpiar bancos y máquinas al terminar.',
    icon: 'fa-spray-can-sparkles',
    theme: 'amber'
  },
  {
    id: 'n2',
    badge: 'CÓDIGO OLÍMPICO DE HONOR • DISCIPLINA',
    title: 'DESCARGA TUS BARRAS Y ACOMODA EL EQUIPO',
    desc: 'Si tuviste la fuerza divina para levantarlo, ten la disciplina de guardarlo. Regresa mancuernas y discos a sus pedestales.',
    icon: 'fa-dumbbell',
    theme: 'sky'
  },
  {
    id: 'n3',
    badge: 'SEGURIDAD SAGRADA • PREVENCIÓN',
    title: 'CALZADO Y VESTIMENTA DEPORTIVA',
    desc: 'Por tu seguridad en el santuario de pesas, está estrictamente prohibido entrenar descalzo, en sandalias o con calzado no deportivo.',
    icon: 'fa-shoe-prints',
    theme: 'blue'
  },
  {
    id: 'n4',
    badge: 'HORARIOS SAGRADOS • TEMPLO DE ZEUS',
    title: 'HORARIOS DEL SANTUARIO',
    desc: 'Lunes a Viernes: 6:00 AM – 10:00 PM | Sábados: 7:00 AM – 2:00 PM. ¡La grandeza se forja en el Templo de ZEUS GYM!',
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
  sky: {
    border: 'border-sky-500/50',
    bg: 'bg-sky-950/20',
    badge: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    iconBg: 'bg-sky-950/80 border-sky-500/50 text-sky-400',
    title: 'text-sky-400'
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
  const [activeSubTab, setActiveSubTab] = useState('notices'); // 'notices' | 'broadcast' | 'tariffs' | 'appearance'

  const [promoBadge, setPromoBadge] = useState('DECRETO EN VIVO DESDE EL OLIMPO');
  const [promoTitle, setPromoTitle] = useState('');
  const [promoMsg, setPromoMsg] = useState('');

  // Carrusel de Avisos
  const [gymNotices, setGymNotices] = useState(tvConfig?.gymNotices || DEFAULT_NOTICES);
  const [activeNoticeIndex, setActiveNoticeIndex] = useState(0);

  // Tarifas
  const [tariffs, setTariffs] = useState(
    tvConfig?.tariffs || [
      { name: 'Mensualidad Olimpo', price: '$400', sub: 'Acceso Total 30 días', promoTitle: 'MEMBRESÍA OLIMPO — $400 MXN', promoDesc: 'Acceso total durante 30 días de entrenamiento divino en el Templo de Zeus.' },
      { name: 'Promo Dúo Olímpico', price: '2x$700', sub: '¡Ahorran $100 MXN!', promoTitle: 'PROMO DÚO OLÍMPICO 2 X $700 MXN', promoDesc: 'Entrena con tu compañero de entrenamiento y ahorren $100 MXN en su mensualidad.' },
      { name: 'Quincena Olimpo', price: '$250', sub: '15 días en el Santuario', promoTitle: 'QUINCENA ZEUS — $250 MXN', promoDesc: '15 días intensos de entrenamiento en el Templo del Olimpo.' },
      { name: 'Rayo Veloz (Visita)', price: '$60', sub: 'Pase individual 1 día', promoTitle: 'RAYO VELOZ — $60 MXN', promoDesc: 'Pase individual de acceso completo por un día al Santuario de Zeus.' }
    ]
  );
  const [tariffsHeader, setTariffsHeader] = useState(tvConfig?.tariffsHeader || 'DECRETOS & TARIFAS DEL OLIMPO');

  // Ajustes Generales
  const [musicTitle, setMusicTitle] = useState(tvConfig?.musicTitle || 'ZEUS EPIC SOUNDTRACK');
  const [sensorTitle, setSensorTitle] = useState(tvConfig?.sensorTitle || 'Coloca tu huella en el portal sagrado para entrar');
  const [sensorSub, setSensorSub] = useState(tvConfig?.sensorSub || 'El sistema mostrará tus días restantes de forma automática en el Monitor del Olimpo');
  const [sensorBtn, setSensorBtn] = useState(tvConfig?.sensorBtn || 'PIN O HUELLA');
  const [card1Title, setCard1Title] = useState(tvConfig?.card1Title || 'NÉCTAR & SUPLEMENTOS');
  const [card1Desc, setCard1Desc] = useState(tvConfig?.card1Desc || 'Pide tu Scoop de Rayo Divino Pre-Entreno, Creatina o Ambrosía Proteica en recepción.');
  const [card2Title, setCard2Title] = useState(tvConfig?.card2Title || 'CÓDIGO OLÍMPICO DE HONOR');
  const [card2Desc, setCard2Desc] = useState(tvConfig?.card2Desc || 'Descarga los discos al terminar y usa tu toalla. ¡Forja tu grandeza en ZEUS GYM!');
  const [footerTicker, setFooterTicker] = useState(tvConfig?.footerTicker || 'Mensualidad $400 | Promo Dúo 2x$700 | Quincena $250 | Rayo Veloz $60');
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
    setPromoBadge('DECRETO RELÁMPAGO DEL OLIMPO');
    setPromoTitle('NOCHE DE ELÍXIRES ⚡');
    setPromoMsg('A partir de las 8:00 PM, todos los Suplementos y Scoops de Néctar y Rayo Divino tienen 15% de descuento.');
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!promoTitle.trim()) return alert('Escribe el título del decreto u oferta');
    onSendPromo({
      badge: promoBadge.trim() || 'DECRETO EN VIVO DESDE EL OLIMPO',
      title: promoTitle.trim(),
      msg: promoMsg.trim() || 'Aviso para la comunidad olímpica.'
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
    if (confirm('¿Restablecer los 4 decretos olímpicos oficiales (Uso de toalla, descarga de barras, calzado, horarios)?')) {
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
      badge: 'DECRETO OLÍMPICO ESPECIAL',
      title: 'NUEVO DECRETO DEL SANTUARIO',
      desc: 'Escribe aquí la indicación para los atletas del Olimpo.',
      icon: 'fa-bullhorn',
      theme: 'sky'
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
  const activeNoticeTheme = THEME_STYLES[activeNotice?.theme || 'sky'] || THEME_STYLES.sky;

  const subTabs = [
    { id: 'notices', label: 'Decretos TV', icon: 'fa-scroll', tag: `${gymNotices.length}` },
    { id: 'broadcast', label: 'Rayo Flash', icon: 'fa-bolt-lightning', tag: 'Vivo' },
    { id: 'tariffs', label: 'Tarifas', icon: 'fa-tags', tag: 'Precios' },
    { id: 'appearance', label: 'Monitor TV', icon: 'fa-sliders', tag: 'Ajustes' }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto p-3 sm:p-5 space-y-4 animate-fadeIn overflow-x-hidden">
      {/* CABECERA COMPACTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-slate-800/80 pb-3">
        <div>
          <h2 className="text-lg sm:text-2xl font-black text-white flex items-center gap-2">
            <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-sky-500/15 border border-sky-400/30 flex items-center justify-center text-sky-400 text-xs sm:text-sm shrink-0 shadow-[0_0_12px_rgba(56,189,248,0.3)]">
              <i className="fa-solid fa-tv"></i>
            </span>
            <span className="truncate">Decretos del Olimpo • Configuración TV</span>
          </h2>
          <p className="text-slate-400 text-[11px] sm:text-xs mt-0.5">
            Personaliza el contenido y decretos sagrados transmitidos en la pantalla del santuario.
          </p>
        </div>
      </div>

      {/* MENÚ RESPONSIVO */}
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
                  ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-900/40 border-sky-400/50'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <i className={`fa-solid ${tab.icon} text-xs shrink-0 ${isActive ? 'text-amber-300' : 'text-slate-400'}`}></i>
                <span className="truncate">{tab.label}</span>
              </div>
              <span
                className={`text-[9px] font-black px-1.5 py-0.5 rounded shrink-0 ${
                  isActive ? 'bg-black/30 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {tab.tag}
              </span>
            </button>
          );
        })}
      </div>

      {/* ================================================================ */}
      {/* SECCIÓN 1: CARRUSEL DE DECRETOS                                  */}
      {/* ================================================================ */}
      {activeSubTab === 'notices' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 sm:p-5 shadow-xl space-y-4 backdrop-blur-md">
          {/* Header de la sección */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800/80 pb-3">
            <div>
              <h3 className="font-zeus text-sm sm:text-base font-black text-white flex items-center gap-2">
                <span>Carrusel de Decretos del Olimpo</span>
                <span className="bg-sky-500/20 text-sky-300 text-[10px] font-bold px-2 py-0.5 rounded border border-sky-500/30">
                  {gymNotices.length} de 8
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Aparece rotando automáticamente entre promociones y tarifas del santuario.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleResetNotices}
                className="text-[11px] bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 py-2 px-3 rounded-xl font-bold cursor-pointer transition-all text-center"
                title="Restablecer los 4 decretos oficiales"
              >
                <i className="fa-solid fa-rotate-left mr-1"></i> Reiniciar
              </button>
              <button
                type="button"
                onClick={handleSaveNotices}
                className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 active:scale-95 text-white font-black text-xs py-2 px-3.5 rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-sky-600/30 cursor-pointer transition-all border border-sky-400/40"
              >
                <i className="fa-solid fa-floppy-disk"></i> Guardar TV
              </button>
            </div>
          </div>

          {/* BARRA DE NAVEGACIÓN NUMÉRICA */}
          <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-2.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
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
                          ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30 scale-105'
                          : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                      }`}
                      title={`Decreto #${idx + 1}: ${n.title}`}
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
                  className="h-9 px-2.5 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 border border-dashed border-slate-700 text-slate-400 hover:text-white cursor-pointer flex items-center gap-1 shrink-0"
                  title="Añadir nuevo decreto"
                >
                  <i className="fa-solid fa-plus text-[10px]"></i>
                  <span className="text-[11px]">Nuevo</span>
                </button>
              )}
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-2 border-t sm:border-t-0 border-slate-800/80 pt-2 sm:pt-0">
              <span className="text-[11px] font-bold text-sky-400 truncate">
                Decreto {safeIndex + 1} de {gymNotices.length}
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  disabled={safeIndex === 0}
                  onClick={() => setActiveNoticeIndex((prev) => Math.max(0, prev - 1))}
                  className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed border border-slate-800 text-slate-300 flex items-center justify-center text-xs cursor-pointer"
                  title="Decreto Anterior"
                >
                  <i className="fa-solid fa-chevron-left"></i>
                </button>
                <button
                  type="button"
                  disabled={safeIndex === gymNotices.length - 1}
                  onClick={() => setActiveNoticeIndex((prev) => Math.min(gymNotices.length - 1, prev + 1))}
                  className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed border border-slate-800 text-slate-300 flex items-center justify-center text-xs cursor-pointer"
                  title="Siguiente Decreto"
                >
                  <i className="fa-solid fa-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>

          {/* FORMULARIO DEL DECRETO ACTIVO */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 sm:p-4 space-y-3">
            <div className="flex justify-between items-center border-b border-slate-800/60 pb-2">
              <span className="font-zeus text-xs font-black text-sky-400 uppercase tracking-wider truncate">
                Editando Decreto #{safeIndex + 1}
              </span>
              {gymNotices.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveNotice(safeIndex)}
                  className="text-[11px] text-rose-400 hover:text-rose-300 cursor-pointer flex items-center gap-1 font-semibold"
                >
                  <i className="fa-solid fa-trash-can text-[10px]"></i> Eliminar
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                  Insignia / Categoría
                </label>
                <input
                  type="text"
                  value={activeNotice.badge || ''}
                  onChange={(e) => handleNoticeChange(safeIndex, 'badge', e.target.value)}
                  placeholder="Ej. DECRETO OLÍMPICO • HIGIENE"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-bold focus:border-sky-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                  Estilo de Color
                </label>
                <select
                  value={activeNotice.theme || 'sky'}
                  onChange={(e) => handleNoticeChange(safeIndex, 'theme', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-bold focus:border-sky-400 focus:outline-none cursor-pointer"
                >
                  <option value="sky">Azul Celestial (Santuario / Disciplina)</option>
                  <option value="amber">Ámbar Divino (Higiene / Toalla)</option>
                  <option value="blue">Azul Glaciar (Seguridad / Calzado)</option>
                  <option value="emerald">Esmeralda (Horarios / Información)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                Icono de Pantalla
              </label>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-sky-400 text-sm shrink-0">
                  <i className={`fa-solid ${activeNotice.icon || 'fa-triangle-exclamation'}`}></i>
                </div>
                <select
                  value={activeNotice.icon || 'fa-spray-can-sparkles'}
                  onChange={(e) => handleNoticeChange(safeIndex, 'icon', e.target.value)}
                  className="flex-1 min-w-0 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-bold focus:border-sky-400 focus:outline-none cursor-pointer"
                >
                  <option value="fa-spray-can-sparkles">Toalla / Spray</option>
                  <option value="fa-rug">Toalla Oficial</option>
                  <option value="fa-soap">Higiene / Jabón</option>
                  <option value="fa-dumbbell">Mancuerna / Pesas</option>
                  <option value="fa-shoe-prints">Calzado Deportivo</option>
                  <option value="fa-clock">Reloj / Horarios</option>
                  <option value="fa-shield-halved">Escudo Sagrado</option>
                  <option value="fa-bolt-lightning">Rayo Divino</option>
                  <option value="fa-bullhorn">Decreto / Megáfono</option>
                  <option value="fa-triangle-exclamation">Alerta / Atención</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                Título Principal
              </label>
              <input
                type="text"
                value={activeNotice.title || ''}
                onChange={(e) => handleNoticeChange(safeIndex, 'title', e.target.value)}
                placeholder="Ej. USO OBLIGATORIO DE TOALLA"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white font-zeus font-black tracking-wide focus:border-sky-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                Indicaciones para el Atleta
              </label>
              <textarea
                rows={2}
                value={activeNotice.desc || ''}
                onChange={(e) => handleNoticeChange(safeIndex, 'desc', e.target.value)}
                placeholder="Ej. Por respeto a tus compañeros porta siempre toalla oficial..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 resize-none font-medium focus:border-sky-400 focus:outline-none"
              />
            </div>

            {/* Previsualización en Monitor TV */}
            <div className="pt-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1.5 flex items-center gap-1.5">
                <i className="fa-solid fa-desktop text-[10px]"></i> Previsualización en Monitor TV
              </span>
              <div className={`p-3.5 rounded-xl border-2 ${activeNoticeTheme.border} ${activeNoticeTheme.bg} space-y-2`}>
                <span className={`text-[9px] font-black px-2 py-0.5 rounded border uppercase tracking-wider inline-block ${activeNoticeTheme.badge}`}>
                  {activeNotice.badge || 'DECRETO'}
                </span>
                <div className="flex items-start gap-2.5">
                  <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${activeNoticeTheme.iconBg}`}>
                    <i className={`fa-solid ${activeNotice.icon || 'fa-bullhorn'} text-sm`}></i>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className={`font-zeus font-black text-xs sm:text-sm leading-tight uppercase truncate ${activeNoticeTheme.title}`}>
                      {activeNotice.title || 'Título del Decreto'}
                    </h4>
                    <p className="text-[11px] text-slate-300 mt-0.5 leading-snug line-clamp-2">
                      {activeNotice.desc || 'Descripción del decreto para los atletas.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* SECCIÓN 2: TRANSMISOR RÁPIDO DE RAYO FLASH                       */}
      {/* ================================================================ */}
      {activeSubTab === 'broadcast' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 sm:p-5 shadow-xl space-y-4 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-sky-950/80 border border-sky-500/50 flex items-center justify-center text-sky-400 shrink-0">
                <i className="fa-solid fa-bolt-lightning text-sm text-amber-300"></i>
              </div>
              <div>
                <h3 className="font-zeus text-sm sm:text-base font-black text-white">
                  Rayo Flash en Monitor del Olimpo
                </h3>
                <p className="text-[11px] text-slate-400">Interrumpe de inmediato la pantalla con resonancia y aura celestial</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleFillExample}
              className="w-full sm:w-auto text-[11px] bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 py-2 px-3 rounded-xl font-bold cursor-pointer transition-colors text-center"
            >
              <i className="fa-solid fa-wand-magic-sparkles mr-1 text-amber-300"></i> Llenar Ejemplo
            </button>
          </div>

          <form onSubmit={handleSend} className="space-y-3">
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                Insignia Superior (Badge)
              </label>
              <input
                type="text"
                value={promoBadge}
                onChange={(e) => setPromoBadge(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-sky-400 font-bold"
                placeholder="Ej. DECRETO RELÁMPAGO DEL OLIMPO"
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                Título del Anuncio
              </label>
              <input
                type="text"
                value={promoTitle}
                onChange={(e) => setPromoTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-sky-400 font-bold"
                placeholder="Ej. NOCHE DE ELÍXIRES ⚡"
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                Mensaje Secundario
              </label>
              <textarea
                rows={2}
                value={promoMsg}
                onChange={(e) => setPromoMsg(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-sky-400 resize-none font-medium"
                placeholder="Ej. Válido por los próximos 30 minutos en recepción del Olimpo."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <button
                type="submit"
                className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 active:scale-[0.98] text-white font-bold py-2.5 px-3 rounded-xl text-xs uppercase tracking-wider flex justify-center items-center gap-2 shadow-lg shadow-sky-600/30 cursor-pointer transition-all border border-sky-400/30"
              >
                <i className="fa-solid fa-paper-plane text-xs"></i> Lanzar Decreto en TV
              </button>
              <button
                type="button"
                onClick={onRemoteNextPromo}
                className="bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-slate-300 font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700 transition-colors"
                title="Avanzar manualmente a la siguiente promo en TV"
              >
                <i className="fa-solid fa-forward-step text-xs"></i> Siguiente Decreto
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================================================================ */}
      {/* SECCIÓN 3: TARIFAS & CARTELERA                                   */}
      {/* ================================================================ */}
      {activeSubTab === 'tariffs' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 sm:p-5 shadow-xl space-y-4 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shrink-0">
                <i className="fa-solid fa-tags text-sm"></i>
              </div>
              <div>
                <h3 className="font-zeus text-sm sm:text-base font-black text-white">
                  Decretos & Tarifas del Olimpo
                </h3>
                <p className="text-[11px] text-slate-400">Precios sagrados mostrados a atletas en recepción</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleSaveTariffs}
              className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-95 text-white font-bold text-xs py-2 px-3.5 rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950/40 cursor-pointer transition-all border border-emerald-400/30"
            >
              <i className="fa-solid fa-floppy-disk"></i> Guardar Tarifas
            </button>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
              Encabezado en Pantalla TV
            </label>
            <input
              type="text"
              value={tariffsHeader}
              onChange={(e) => setTariffsHeader(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 font-bold focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            {tariffs.map((t, i) => (
              <div key={i} className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 space-y-2">
                <div className="flex justify-between items-center border-b border-slate-800/60 pb-1.5">
                  <span className="font-zeus text-xs font-black text-sky-400">TARIFA #{i + 1}</span>
                  <button
                    type="button"
                    onClick={() => onRemoteSelectTariff(i)}
                    className="text-[10px] bg-sky-950/50 hover:bg-sky-900/60 border border-sky-800/60 text-sky-300 font-bold px-2 py-0.5 rounded cursor-pointer transition-colors flex items-center gap-1"
                    title="Destacar esta tarjeta en el Monitor TV"
                  >
                    <i className="fa-solid fa-eye text-[9px]"></i> Destacar
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] text-slate-400 uppercase font-bold block mb-0.5">Plan</label>
                    <input
                      type="text"
                      value={t.name}
                      onChange={(e) => handleTariffChange(i, 'name', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-white font-bold focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-400 uppercase font-bold block mb-0.5">Precio</label>
                    <input
                      type="text"
                      value={t.price}
                      onChange={(e) => handleTariffChange(i, 'price', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-emerald-400 font-zeus font-bold focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[9px] text-slate-400 uppercase font-bold block mb-0.5">Subtítulo</label>
                  <input
                    type="text"
                    value={t.sub}
                    onChange={(e) => handleTariffChange(i, 'sub', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-slate-300 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[9px] text-slate-400 uppercase font-bold block mb-0.5">Título al Destacar</label>
                  <input
                    type="text"
                    value={t.promoTitle}
                    onChange={(e) => handleTariffChange(i, 'promoTitle', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
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
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 sm:p-5 shadow-xl space-y-4 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-950/80 border border-blue-500/50 flex items-center justify-center text-blue-400 shrink-0">
                <i className="fa-solid fa-sliders text-sm"></i>
              </div>
              <div>
                <h3 className="font-zeus text-sm sm:text-base font-black text-white">
                  Apariencia del Monitor del Olimpo
                </h3>
                <p className="text-[11px] text-slate-400">Música sagrada, marquesina, tarjetas laterales e imagen de fondo</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleSaveFull}
              className="w-full sm:w-auto bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 active:scale-95 text-white font-bold text-xs py-2 px-3.5 rounded-xl flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-all border border-sky-400/30"
            >
              <i className="fa-solid fa-rotate"></i> Sincronizar Todo
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                Título Música Gym
              </label>
              <input
                type="text"
                value={musicTitle}
                onChange={(e) => setMusicTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-bold focus:border-sky-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                Cintillo Inferior (Ticker)
              </label>
              <input
                type="text"
                value={footerTicker}
                onChange={(e) => setFooterTicker(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:border-sky-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Tarjetas Laterales */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-slate-800/80">
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <i className="fa-solid fa-bottle-water"></i> Lateral 1: Néctar & Suplementos
              </span>
              <input
                type="text"
                value={card1Title}
                onChange={(e) => setCard1Title(e.target.value)}
                placeholder="Título Tarjeta 1"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-bold focus:border-amber-400 focus:outline-none"
              />
              <input
                type="text"
                value={card1Desc}
                onChange={(e) => setCard1Desc(e.target.value)}
                placeholder="Descripción Tarjeta 1"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                <i className="fa-solid fa-shield-halved"></i> Lateral 2: Código Olímpico de Honor
              </span>
              <input
                type="text"
                value={card2Title}
                onChange={(e) => setCard2Title(e.target.value)}
                placeholder="Título Tarjeta 2"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-bold focus:border-sky-400 focus:outline-none"
              />
              <input
                type="text"
                value={card2Desc}
                onChange={(e) => setCard2Desc(e.target.value)}
                placeholder="Descripción Tarjeta 2"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:border-sky-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Imagen de Fondo y Presets */}
          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
              URL Imagen de Fondo TV
            </label>
            <input
              type="text"
              value={bgImage}
              onChange={(e) => setBgImage(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-sky-400 focus:outline-none"
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  const url = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1400&q=80';
                  setBgImage(url);
                  onUpdateTvConfig({ bgImage: url });
                }}
                className="text-[11px] bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 py-2 px-2.5 rounded-xl cursor-pointer transition-colors font-bold text-center"
              >
                <i className="fa-solid fa-image mr-1 text-sky-400"></i> Preset 1 (Templo Olimpo)
              </button>
              <button
                type="button"
                onClick={() => {
                  const url = 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1400&q=80';
                  setBgImage(url);
                  onUpdateTvConfig({ bgImage: url });
                }}
                className="text-[11px] bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 py-2 px-2.5 rounded-xl cursor-pointer transition-colors font-bold text-center"
              >
                <i className="fa-solid fa-image mr-1 text-amber-400"></i> Preset 2 (Atletas Elite)
              </button>
              <button
                type="button"
                onClick={() => {
                  const url = 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1400&q=80';
                  setBgImage(url);
                  onUpdateTvConfig({ bgImage: url });
                }}
                className="text-[11px] bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 py-2 px-2.5 rounded-xl cursor-pointer transition-colors font-bold text-center"
              >
                <i className="fa-solid fa-image mr-1 text-blue-400"></i> Preset 3 (Rayo Divino)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
