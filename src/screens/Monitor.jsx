import React, { useState, useEffect, useRef } from 'react';
import socket from '../utils/socket';
import { playSound } from '../utils/audio';
import { useWakeLock } from '../utils/wakeLock';

import MonitorHeader from '../components/monitor/MonitorHeader';
import PromoHeroBanner from '../components/monitor/PromoHeroBanner';
import NoticesCarouselBanner from '../components/monitor/NoticesCarouselBanner';
import TariffsGrid from '../components/monitor/TariffsGrid';
import TvSidebarInfo from '../components/monitor/TvSidebarInfo';
import AccessPopupModal from '../components/monitor/AccessPopupModal';
import CommanderToastAlert from '../components/monitor/CommanderToastAlert';
import TickerFooter from '../components/monitor/TickerFooter';
import { CrimsonOmen } from '../components/common/CrimsonOmenSvg';

const DEFAULT_PROMOS = [
  {
    badge: 'PROMO GEARS DEL MES',
    title: 'MENSUALIDAD GEARS — $400 MXN',
    desc: 'Acceso total durante 30 días de entrenamiento sin límites en el campo de batalla.'
  },
  {
    badge: 'PROMO GEARS DEL MES',
    title: 'PROMO DÚO 2 X $700 MXN',
    desc: 'Entrena con tu compañero de escuadrón y ahorren $100 MXN en su mensualidad.'
  },
  {
    badge: 'PROMO GEARS DEL MES',
    title: 'QUINCENA GEARS — $250 MXN',
    desc: '15 días intensos de entrenamiento. ¡Cero excusas en la legión GEARS GYM!'
  },
  {
    badge: 'PROMO GEARS DEL MES',
    title: 'VISITA DEL DÍA — $60 MXN',
    desc: 'Pase individual de acceso completo por un día. ¡Entrena sin piedad!'
  }
];

const MEMBERS_DATA = {
  active: {
    name: 'Carlos Mendoza',
    photo: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=400&q=80',
    badge: '<i class="fa-solid fa-skull text-emerald-400"></i> GUERRERO ACTIVO — ACCESO PERMITIDO',
    message: '¡A darle con todo en GEARS! Te quedan <span class="underline font-black text-white">18 días</span> de tu mensualidad.',
    plan: 'Mensual ($400)',
    expire: '14 Nov 2026',
    streak: '14 días 💀 🔥',
    cardClasses: 'bg-gradient-to-b from-[#063f2a] via-[#032316] to-[#01140c] border-2 border-emerald-400 shadow-[0_0_50px_rgba(16,185,129,0.35)]',
    badgeClasses: 'bg-[#022114]/90 text-emerald-300 border border-emerald-500/50',
    dividerClass: 'border-emerald-500/20',
    statBoxClasses: 'bg-[#02180e]/90 border border-emerald-500/30 text-white',
    watermarkTopClass: 'w-48 h-48 gear-spin opacity-15 text-emerald-400 absolute -top-10 -left-10 pointer-events-none',
    watermarkBottomClass: 'w-32 h-32 opacity-15 text-emerald-400 absolute -bottom-6 -right-4 pointer-events-none',
    iconHtml: '<i class="fa-solid fa-check text-white"></i>',
    iconBg: 'bg-emerald-500',
    sound: 'success'
  },
  warning: {
    name: 'Sofía Ramírez',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    badge: '<i class="fa-solid fa-clock text-amber-400"></i> QUINCENA POR VENCER — ACCESO PERMITIDO',
    message: '¡Hola Sofía! Tu plan <span class="underline font-black text-white">vence mañana</span>. Renueva en recepción.',
    plan: 'Quincena ($250)',
    expire: 'Mañana (28 Oct)',
    streak: '8 días 🔥',
    cardClasses: 'bg-gradient-to-b from-[#3d2005] via-[#211202] to-[#120701] border-2 border-amber-400 shadow-[0_0_50px_rgba(245,158,11,0.35)]',
    badgeClasses: 'bg-[#211202]/90 text-amber-300 border border-amber-500/50',
    dividerClass: 'border-amber-500/20',
    statBoxClasses: 'bg-[#180a01]/90 border border-amber-500/30 text-white',
    watermarkTopClass: 'w-48 h-48 gear-spin opacity-15 text-amber-400 absolute -top-10 -left-10 pointer-events-none',
    watermarkBottomClass: 'w-32 h-32 opacity-15 text-amber-400 absolute -bottom-6 -right-4 pointer-events-none',
    iconHtml: '<i class="fa-solid fa-exclamation text-stone-950"></i>',
    iconBg: 'bg-amber-400',
    sound: 'warning'
  },
  expired: {
    name: 'Jorge Vargas',
    photo: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=400&q=80',
    badge: '<i class="fa-solid fa-skull-crossbones text-rose-400"></i> ALTO — ACCESO DENEGADO (VENCIDO)',
    message: 'Tu membresía ha vencido. <span class="underline font-black text-white">Pasa a recepción</span> para renovar.',
    plan: 'Mensual ($400)',
    expire: 'Venció hace 4 días',
    streak: '0 días 💀',
    cardClasses: 'bg-gradient-to-b from-[#3d0808] via-[#210303] to-[#120101] border-2 border-red-500 shadow-[0_0_50px_rgba(239,68,68,0.35)]',
    badgeClasses: 'bg-[#210303]/90 text-red-300 border border-red-500/50',
    dividerClass: 'border-red-500/20',
    statBoxClasses: 'bg-[#180202]/90 border border-red-500/30 text-white',
    watermarkTopClass: 'w-48 h-48 gear-spin opacity-15 text-red-400 absolute -top-10 -left-10 pointer-events-none',
    watermarkBottomClass: 'w-32 h-32 opacity-15 text-red-400 absolute -bottom-6 -right-4 pointer-events-none',
    iconHtml: '<i class="fa-solid fa-ban text-white"></i>',
    iconBg: 'bg-red-600',
    sound: 'error'
  },
  visit: {
    name: 'Pase de Visita',
    photo: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=400&q=80',
    badge: '<i class="fa-solid fa-bolt text-amber-400"></i> VISITA DEL DÍA — ACCESO CONCEDIDO',
    message: '¡Bienvenido a GEARS GYM! Entrena sin límites ni piedad.',
    plan: 'Visita ($60)',
    expire: 'Válido Hoy',
    streak: '1er día 🔥',
    cardClasses: 'bg-gradient-to-b from-[#3d2c05] via-[#211702] to-[#120c01] border-2 border-amber-400 shadow-[0_0_50px_rgba(245,158,11,0.35)]',
    badgeClasses: 'bg-[#211702]/90 text-amber-300 border border-amber-500/50',
    dividerClass: 'border-amber-500/20',
    statBoxClasses: 'bg-[#181001]/90 border border-amber-500/30 text-white',
    watermarkTopClass: 'w-48 h-48 gear-spin opacity-15 text-amber-400 absolute -top-10 -left-10 pointer-events-none',
    watermarkBottomClass: 'w-32 h-32 opacity-15 text-amber-400 absolute -bottom-6 -right-4 pointer-events-none',
    iconHtml: '<i class="fa-solid fa-bolt text-white"></i>',
    iconBg: 'bg-amber-500',
    sound: 'success'
  }
};

export default function Monitor({ currentView = 'monitor', onChangeView }) {
  useWakeLock();

  const [isConnected, setIsConnected] = useState(socket.connected);
  const [isSystemLocked, setIsSystemLocked] = useState(false);
  const [isDoorOpen, setIsDoorOpen] = useState(false);
  const [todayCounter, setTodayCounter] = useState(42);

  // Buffer de entrada por PIN / Lector HID y Modal Numérico
  const [pinBuffer, setPinBuffer] = useState('');
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const pinBufferRef = useRef('');
  const pinTimeoutRef = useRef(null);

  // Configuración de TV
  const [tvConfig, setTvConfig] = useState({
    musicTitle: 'HEAVY WORKOUT MIX',
    promoBadge: 'PROMO GEARS DEL MES',
    promoTitle: 'PROMO DÚO 2 X $700 MXN',
    promoDesc: 'Entrena con tu compañero de escuadrón. ¡Cero excusas en la legión GEARS GYM!',
    tariffsHeader: 'TARIFAS OFICIALES DE LA LEGIÓN (TOCA UNA TARJETA PARA DESTACAR EN PANTALLA)',
    tariffs: [
      { name: 'Mensualidad', price: '$400', sub: 'Acceso Total 30 días', promoTitle: 'MENSUALIDAD GEARS — $400 MXN', promoDesc: 'Acceso total durante 30 días de entrenamiento sin límites en el campo de batalla.' },
      { name: 'Promo 2 Guerreros', price: '2x$700', sub: '¡Ahorras $100 MXN!', promoTitle: 'PROMO DÚO 2 X $700 MXN', promoDesc: 'Entrena con tu compañero de escuadrón y ahorren $100 MXN en su mensualidad.' },
      { name: 'Quincena', price: '$250', sub: '15 días de batalla', promoTitle: 'QUINCENA GEARS — $250 MXN', promoDesc: '15 días intensos de entrenamiento. ¡Cero excusas en la legión GEARS GYM!' },
      { name: 'Visita del Día', price: '$60', sub: 'Pase individual', promoTitle: 'VISITA DEL DÍA — $60 MXN', promoDesc: 'Pase individual de acceso completo por un día. ¡Entrena sin piedad!' }
    ],
    gymNotices: [
      { id: 'n1', badge: 'REGLA DE ORO • HIGIENE OBLIGATORIA', title: 'USO OBLIGATORIO DE TOALLA', desc: 'Por higiene y respeto a tus hermanos de armas, es obligatorio portar toalla personal para limpiar bancos y máquinas al terminar.', icon: 'fa-spray-can-sparkles', theme: 'amber' },
      { id: 'n2', badge: 'CÓDIGO DE HONOR • DISCIPLINA', title: 'DESCARGA TUS BARRAS Y ACOMODA EL EQUIPO', desc: 'Si tuviste la fuerza para levantarlo, ten la disciplina de guardarlo. Regresa mancuernas y discos a sus racks.', icon: 'fa-dumbbell', theme: 'red' },
      { id: 'n3', badge: 'SEGURIDAD • PREVENCIÓN', title: 'CALZADO Y VESTIMENTA DEPORTIVA', desc: 'Por tu seguridad en sala de pesas, está estrictamente prohibido entrenar descalzo, en sandalias o con calzado no deportivo.', icon: 'fa-shoe-prints', theme: 'blue' },
      { id: 'n4', badge: 'HORARIOS OFICIALES • LA LEGIÓN', title: 'HORARIOS DEL CAMPO DE BATALLA', desc: 'Lunes a Viernes: 6:00 AM – 10:00 PM | Sábados: 7:00 AM – 2:00 PM. ¡Cero excusas en la legión GEARS GYM!', icon: 'fa-clock', theme: 'emerald' }
    ],
    sensorTitle: 'Coloca tu huella en el sensor para entrar',
    sensorSub: 'El sistema mostrará tus días restantes de forma automática en pantalla',
    sensorBtn: 'PIN O HUELLA',
    card1Title: 'SUPLEMENTOS EN RECEPCIÓN',
    card1Desc: 'Pregunta por tu Scoop de Pre-entreno Hype, Creatina y Proteína por servicio.',
    card2Title: 'CÓDIGO DE HONOR GEARS',
    card2Desc: 'Descarga los discos al terminar y trae tu toalla. ¡Entrena sin piedad!',
    footerTicker: 'Mensualidad $400 | Promo 2x$700 | Quincena $250 | Visita $60',
    bgImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1400&q=80'
  });

  const [arsenalItems, setArsenalItems] = useState([
    { id: 'p1', name: 'Agua 1L', price: 20, stock: 24, icon: 'fa-bottle-water' },
    { id: 'p2', name: 'Pre-Entreno Hype', price: 35, stock: 18, icon: 'fa-bolt' },
    { id: 'p3', name: 'Proteína Whey', price: 30, stock: 15, icon: 'fa-jar' },
    { id: 'p4', name: 'Electrolitos', price: 15, stock: 20, icon: 'fa-wine-bottle' }
  ]);

  // Rotación de Promos
  const [promos, setPromos] = useState(DEFAULT_PROMOS);
  const [currentPromoIndex, setCurrentPromoIndex] = useState(1);
  const [isPromoAutoplay, setIsPromoAutoplay] = useState(true);
  const [progressKey, setProgressKey] = useState(0);

  // Alerta Toast del Comandante y Modal de Acceso
  const [commanderAlert, setCommanderAlert] = useState({ visible: false, title: '', msg: '' });
  const [accessCard, setAccessCard] = useState(null);

  const showCommanderToast = (title, msg) => {
    setCommanderAlert({ visible: true, title, msg });
    setTimeout(() => {
      setCommanderAlert((prev) => ({ ...prev, visible: false }));
    }, 6000);
  };

  const updatePinBuffer = (nextVal) => {
    pinBufferRef.current = nextVal;
    setPinBuffer(nextVal);
    if (pinTimeoutRef.current) clearTimeout(pinTimeoutRef.current);
    if (nextVal) {
      pinTimeoutRef.current = setTimeout(() => {
        pinBufferRef.current = '';
        setPinBuffer('');
      }, 6000);
    }
  };

  const submitPinScan = (codeToScan) => {
    const clean = String(codeToScan || pinBufferRef.current || '').trim();
    if (!clean) return;

    if (isSystemLocked) {
      setAccessCard(MEMBERS_DATA.expired);
      playSound('error');
      showCommanderToast('ACCESO DENEGADO', 'El torniquete se encuentra en BLOQUEO TOTAL DE EMERGENCIA.');
      updatePinBuffer('');
      setIsPinModalOpen(false);
      return;
    }

    socket.emit('SENSOR_SCAN', { memberId: clean, channel: 1 });
    updatePinBuffer('');
    setIsPinModalOpen(false);
  };

  // Listener global de teclado numérico / lector HID
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) {
        return;
      }

      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        const next = (pinBufferRef.current + e.key).slice(0, 6);
        updatePinBuffer(next);
      } else if (e.key === 'Backspace') {
        if (pinBufferRef.current.length > 0) {
          e.preventDefault();
          updatePinBuffer(pinBufferRef.current.slice(0, -1));
        }
      } else if (e.key === 'Escape') {
        updatePinBuffer('');
        setIsPinModalOpen(false);
      } else if (e.key === 'Enter') {
        if (pinBufferRef.current.length > 0) {
          e.preventDefault();
          submitPinScan(pinBufferRef.current);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSystemLocked]);

  const handleSelectTariff = (idx) => {
    setCurrentPromoIndex(idx);
    setProgressKey((k) => k + 1);
  };

  const handleNextPromo = () => {
    setCurrentPromoIndex((prev) => (prev + 1) % (promos.length || 4));
    setProgressKey((k) => k + 1);
  };

  // Timer de Auto-Rotación
  useEffect(() => {
    if (!isPromoAutoplay) return;
    const interval = setInterval(() => {
      handleNextPromo();
    }, 10000);
    return () => clearInterval(interval);
  }, [isPromoAutoplay, promos.length]);

  // Socket listeners
  useEffect(() => {
    fetch('/api/tv-config')
      .then((res) => res.json())
      .then((cfg) => {
        if (!cfg) return;
        const normalizedCfg = { ...cfg };
        if (typeof normalizedCfg.gymNotices === 'string') {
          try {
            normalizedCfg.gymNotices = JSON.parse(normalizedCfg.gymNotices);
          } catch (e) {}
        }
        setTvConfig((prev) => ({ ...prev, ...normalizedCfg }));
      })
      .catch((err) => console.log('Init tv-config fetch error:', err));

    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));

    socket.on('TV_CONFIG_SYNC', (cfg) => {
      if (!cfg) return;
      const normalizedCfg = { ...cfg };
      if (typeof normalizedCfg.gymNotices === 'string') {
        try {
          normalizedCfg.gymNotices = JSON.parse(normalizedCfg.gymNotices);
        } catch (e) {}
      }
      setTvConfig((prev) => ({ ...prev, ...normalizedCfg }));
      if (Array.isArray(cfg.tariffs)) {
        setPromos(
          cfg.tariffs.map((t) => ({
            badge: cfg.promoBadge || 'PROMO GEARS DEL MES',
            title: t.promoTitle || `${t.name.toUpperCase()} — ${t.price} MXN`,
            desc: t.promoDesc || t.sub
          }))
        );
      }
    });

    socket.on('NEW_PROMO', (data) => {
      showCommanderToast(data.title, data.msg);
      setTvConfig((prev) => ({
        ...prev,
        promoBadge: data.badge || prev.promoBadge,
        promoTitle: data.title,
        promoDesc: data.msg
      }));
      playSound('alert');
    });

    socket.on('ARSENAL_SYNC', (items) => {
      if (Array.isArray(items)) setArsenalItems(items);
    });

    socket.on('LOCKDOWN_STATUS', (isLocked) => {
      setIsSystemLocked(isLocked);
      if (isLocked) {
        showCommanderToast('💀 ALERTA MÁXIMA: BLOQUEO DE EMERGENCIA', 'El torniquete ha sido bloqueado por el Comandante. Ningún ingreso permitido.');
        playSound('error');
      } else {
        setCommanderAlert({ visible: false, title: '', msg: '' });
        playSound('success');
      }
    });

    socket.on('DOOR_OVERRIDE_TRIGGERED', () => {
      if (isSystemLocked) return;
      showCommanderToast('PUERTA LIBERADA POR COMANDO', 'Apertura remota concedida por 5 segundos.');
      playSound('door');
      setIsDoorOpen(true);
      setTimeout(() => setIsDoorOpen(false), 5000);
    });

    socket.on('COUNTER_SYNC', (cnt) => {
      setTodayCounter(cnt);
    });

    socket.on('VISIT_PROCESSED', (data) => {
      if (data && data.counter !== undefined) setTodayCounter(data.counter);
    });

    socket.on('MEMBER_RENEWED', (data) => {
      showCommanderToast('GUERRERO RENOVADO', `${data.name || 'Un socio'} ha renovado su plan (${data.plan || 'Membresía'}). ¡A darle!`);
      playSound('success');
    });

    socket.on('SHOW_ACCESS_CARD', (payload) => {
      if (payload && typeof payload === 'object') {
        const statusType =
          payload.status === 'expired' || payload.type === 'expired' || payload.days < 0
            ? 'expired'
            : payload.status === 'warning' || payload.type === 'warning' || payload.days <= 3
            ? 'warning'
            : 'active';
        const template = MEMBERS_DATA[statusType] || MEMBERS_DATA.active;
        const daysVal = payload.days ?? payload.days_remaining ?? 0;
        const planText = payload.plan
          ? `${payload.plan} (${payload.price || '$400'})`
          : template.plan;

        let expireText = `${daysVal} días restantes`;
        let customMsg = `¡A darle con todo en GEARS, <span class="text-white font-black">${payload.name}</span>! Te quedan <span class="underline font-black text-white">${daysVal} días</span> de tu plan.`;

        if (statusType === 'warning') {
          expireText = daysVal === 0 ? 'Vence hoy' : `En ${daysVal} día(s)`;
          customMsg = `¡Hola <span class="text-white font-black">${payload.name}</span>! Tu plan <span class="underline font-black text-white">vence en ${daysVal} día(s)</span>. Renueva en recepción.`;
        } else if (statusType === 'expired') {
          expireText = payload.plan === 'Sin Registro' ? 'Folio no registrado' : `Venció hace ${Math.abs(daysVal)}d`;
          customMsg =
            payload.plan === 'Sin Registro'
              ? `El folio <span class="text-white font-black">#${payload.id}</span> no existe. Consulta en recepción.`
              : `<span class="text-white font-black">${payload.name}</span>, tu membresía ha vencido. <span class="underline font-black text-white">Pasa a recepción</span> para renovar.`;
        }

        const customCard = {
          ...template,
          name: payload.name || template.name,
          photo: payload.photo || template.photo,
          plan: planText,
          expire: expireText,
          message: customMsg,
          streak: statusType === 'expired' ? '0 días 💀' : `ID #${payload.id || '000'} 🔥`
        };
        setAccessCard(customCard);
        playSound(customCard.sound);
        if (statusType !== 'expired') {
          setIsDoorOpen(true);
          setTimeout(() => setIsDoorOpen(false), 5000);
        }
        return;
      }

      const data = MEMBERS_DATA[payload] || MEMBERS_DATA.active;
      setAccessCard(data);
      playSound(data.sound);
      if (payload !== 'expired' && data.sound !== 'error') {
        setIsDoorOpen(true);
        setTimeout(() => setIsDoorOpen(false), 5000);
      }
    });

    socket.on('SELECT_TARIFF_CARD', (idx) => {
      handleSelectTariff(idx);
    });

    socket.on('NEXT_PROMO_TRIGGER', () => {
      handleNextPromo();
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('TV_CONFIG_SYNC');
      socket.off('NEW_PROMO');
      socket.off('ARSENAL_SYNC');
      socket.off('LOCKDOWN_STATUS');
      socket.off('DOOR_OVERRIDE_TRIGGERED');
      socket.off('COUNTER_SYNC');
      socket.off('VISIT_PROCESSED');
      socket.off('MEMBER_RENEWED');
      socket.off('SHOW_ACCESS_CARD');
      socket.off('SELECT_TARIFF_CARD');
      socket.off('NEXT_PROMO_TRIGGER');
    };
  }, [isSystemLocked]);

  const currentPromo = promos[currentPromoIndex] || {
    badge: tvConfig.promoBadge,
    title: tvConfig.promoTitle,
    desc: tvConfig.promoDesc
  };

  const handleSensorTouch = () => {
    if (isSystemLocked) {
      setAccessCard(MEMBERS_DATA.expired);
      playSound('error');
      showCommanderToast('ACCESO DENEGADO', 'El torniquete se encuentra en BLOQUEO TOTAL DE EMERGENCIA.');
      return;
    }
    const options = ['active', 'warning', 'expired'];
    const chosen = options[Math.floor(Math.random() * options.length)];
    socket.emit('SENSOR_SCAN', chosen);
  };

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden flex flex-col bg-black antialiased select-none">
      {/* Toast del Comandante */}
      <CommanderToastAlert
        alert={commanderAlert}
        onClose={() => setCommanderAlert({ visible: false, title: '', msg: '' })}
      />

      {/* Header Superior a lo ancho de toda la pantalla */}
      <MonitorHeader
        musicTitle={tvConfig.musicTitle}
        todayCounter={todayCounter}
        isConnected={isConnected}
        currentView={currentView}
        onChangeView={onChangeView}
      />

      {/* Main Layout Adaptativo 100% Responsivo a cualquier resolución y relación de aspecto */}
      <main className="flex-1 min-h-0 w-full flex flex-col lg:flex-row bg-black overflow-y-auto lg:overflow-hidden relative">
        {/* Columna Izquierda: Cartelera Hero + Avisos + Tarifas Oficiales + Ticker */}
        <div className="flex-1 min-w-0 lg:h-full relative flex flex-col justify-between lg:overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-500 pointer-events-none"
            style={{ backgroundImage: `url('${tvConfig.bgImage}')` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/85 to-red-950/45"></div>
          </div>

          <div className="absolute -right-12 -bottom-12 opacity-15 pointer-events-none">
            <CrimsonOmen className="w-48 h-48 xl:w-72 xl:h-72 gear-spin" />
          </div>

          <div className="relative z-10 flex-1 min-h-0 flex flex-col justify-between px-[clamp(0.65rem,1.5vw,1.5rem)] py-[clamp(0.45rem,1.2dvh,1rem)] gap-[clamp(0.45rem,1.15dvh,1rem)] lg:overflow-hidden">
            <PromoHeroBanner
              badge={currentPromo.badge}
              title={currentPromo.title}
              desc={currentPromo.desc}
              progressKey={progressKey}
              duration={10000}
              isAutoplay={isPromoAutoplay}
              currentIndex={currentPromoIndex}
              totalPromos={promos.length}
              onSelectPromo={handleSelectTariff}
            />

            {/* Carrusel Rotativo de Avisos en Grande (Toalla, Pesas, Horarios) */}
            <NoticesCarouselBanner
              notices={tvConfig.gymNotices}
              duration={6000}
            />

            <TariffsGrid
              tariffsHeader={tvConfig.tariffsHeader}
              tariffs={tvConfig.tariffs}
              selectedIndex={currentPromoIndex}
              onSelectTariff={handleSelectTariff}
            />
          </div>

          <TickerFooter footerTicker={tvConfig.footerTicker} />
        </div>

        {/* Columna Derecha: Módulo de Acceso & Bienvenida en Vivo + Arsenal Express (32% ancho) */}
        <TvSidebarInfo
          isSystemLocked={isSystemLocked}
          isDoorOpen={isDoorOpen}
          sensorTitle={tvConfig.sensorTitle}
          sensorSub={tvConfig.sensorSub}
          sensorBtn={tvConfig.sensorBtn}
          card1Title={tvConfig.card1Title}
          card1Desc={tvConfig.card1Desc}
          arsenalItems={arsenalItems}
          pinBuffer={pinBuffer}
          accessCard={accessCard}
          onClearAccessCard={() => setAccessCard(null)}
          onSensorTouch={handleSensorTouch}
          onOpenPinPad={() => setIsPinModalOpen(true)}
        />
      </main>

      {/* Modal Táctil Limpio de Ingreso por PIN / Folio */}
      {isPinModalOpen && (
        <div
          onClick={() => setIsPinModalOpen(false)}
          className="fixed inset-0 bg-black/85 backdrop-blur-md z-[190] flex items-center justify-center p-4 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0a0a0a] border-2 border-red-600/80 rounded-3xl p-6 w-full max-w-sm shadow-[0_0_50px_rgba(220,38,38,0.35)] relative"
          >
            <button
              onClick={() => setIsPinModalOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white text-lg cursor-pointer"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            <div className="text-center mb-4">
              <h3 className="font-gears text-lg font-black text-white uppercase">
                Acceso por PIN / Folio
              </h3>
              <p className="text-xs text-stone-400">
                Teclea tu número de socio (ej. 042, 088, 019) y presiona Entrar
              </p>
            </div>

            {/* Pantalla del PIN */}
            <div className="bg-black border-2 border-stone-800 rounded-2xl py-3 px-4 mb-4 text-center">
              <span className="font-gears text-3xl font-black tracking-[0.25em] text-emerald-400">
                {pinBuffer ? '*'.repeat(pinBuffer.length) : '---'}
              </span>
              <p className="text-[10px] text-stone-500 font-gears mt-1">
                {pinBuffer ? `Folio: #${pinBuffer}` : 'Esperando dígitos...'}
              </p>
            </div>

            {/* Teclado Numérico 3x4 */}
            <div className="grid grid-cols-3 gap-2.5 mb-4">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => updatePinBuffer((pinBufferRef.current + digit).slice(0, 6))}
                  className="bg-stone-900 hover:bg-stone-800 active:scale-95 border border-stone-700 text-white font-gears text-xl font-black py-3.5 rounded-2xl cursor-pointer shadow"
                >
                  {digit}
                </button>
              ))}
              <button
                type="button"
                onClick={() => updatePinBuffer('')}
                className="bg-rose-950/60 hover:bg-rose-900 active:scale-95 border border-rose-700/60 text-rose-300 font-bold text-xs py-3.5 rounded-2xl cursor-pointer"
              >
                Limpiar
              </button>
              <button
                type="button"
                onClick={() => updatePinBuffer((pinBufferRef.current + '0').slice(0, 6))}
                className="bg-stone-900 hover:bg-stone-800 active:scale-95 border border-stone-700 text-white font-gears text-xl font-black py-3.5 rounded-2xl cursor-pointer shadow"
              >
                0
              </button>
              <button
                type="button"
                onClick={() => updatePinBuffer(pinBufferRef.current.slice(0, -1))}
                className="bg-stone-900 hover:bg-stone-800 active:scale-95 border border-stone-700 text-stone-300 font-bold text-sm py-3.5 rounded-2xl cursor-pointer"
              >
                <i className="fa-solid fa-delete-left"></i>
              </button>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsPinModalOpen(false);
                  handleSensorTouch();
                }}
                className="bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-300 font-bold text-xs px-3.5 py-3 rounded-xl cursor-pointer"
                title="Simular lectura de huella"
              >
                <i className="fa-solid fa-fingerprint mr-1"></i> Huella Demo
              </button>
              <button
                type="button"
                onClick={() => submitPinScan(pinBuffer)}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-gears font-black text-sm py-3 rounded-xl uppercase tracking-wider cursor-pointer shadow-lg shadow-emerald-900/40"
              >
                Entrar <i className="fa-solid fa-arrow-right-to-bracket ml-1"></i>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Emergente Grande de Acceso Biométrico / PIN (Visible en Monitor TV, Tablet y Móvil) */}
      <AccessPopupModal
        accessData={accessCard}
        onClose={() => setAccessCard(null)}
      />
    </div>
  );
}
