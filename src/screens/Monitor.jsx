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
import { ZeusEmblem } from '../components/common/ZeusSvg';

/**
 * MONITOR DEL OLIMPO — TEMPLO DE ZEUS
 * Pantalla TV Kiosco Kiosk para Demostración y Simulación de Alto Nivel
 */

const DEFAULT_PROMOS = [
  {
    badge: 'DECRETOS & PROMOCIONES DEL OLIMPO',
    title: 'MEMBRESÍA OLIMPO — $400 MXN',
    desc: 'Acceso total durante 30 días de entrenamiento divino en el Templo de Zeus.'
  },
  {
    badge: 'DECRETOS & PROMOCIONES DEL OLIMPO',
    title: 'PROMO DÚO TITANES 2 X $700 MXN',
    desc: 'Entrena con tu compañero de armas del Olimpo y alcancen la gloria de los dioses.'
  },
  {
    badge: 'DECRETOS & PROMOCIONES DEL OLIMPO',
    title: 'QUINCENA CELESTIAL — $250 MXN',
    desc: '15 días de disciplina y fuerza divina. ¡Poder absoluto en el Templo de Zeus!'
  },
  {
    badge: 'DECRETOS & PROMOCIONES DEL OLIMPO',
    title: 'PASE DIARIO ZEUS — $60 MXN',
    desc: 'Pase individual de acceso completo por un día. ¡Entrena con la fuerza del rayo!'
  }
];

const MEMBERS_DATA = {
  active: {
    name: 'Carlos Mendoza',
    photo: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=400&q=80',
    badge: '<i class="fa-solid fa-bolt-lightning text-emerald-400"></i> ATLETA ACTIVO — ACCESO CONCEDIDO ⚡',
    message: '¡Bienvenido al Templo de Zeus! Te quedan <span class="underline font-black text-white">18 días</span> de tu Membresía Olimpo.',
    plan: 'Membresía Olimpo ($400)',
    expire: '14 Nov 2026',
    streak: '18 días ⚡ 🏛️',
    cardClasses: 'bg-gradient-to-b from-[#063f2a] via-[#032316] to-[#01140c] border-2 border-emerald-400 shadow-[0_0_50px_rgba(16,185,129,0.35)]',
    badgeClasses: 'bg-[#022114]/90 text-emerald-300 border border-emerald-500/50',
    dividerClass: 'border-emerald-500/20',
    statBoxClasses: 'bg-[#02180e]/90 border border-emerald-500/30 text-white',
    watermarkTopClass: 'w-48 h-48 opacity-15 text-emerald-400 absolute -top-10 -left-10 pointer-events-none animate-pulse',
    watermarkBottomClass: 'w-32 h-32 opacity-15 text-emerald-400 absolute -bottom-6 -right-4 pointer-events-none',
    iconHtml: '<i class="fa-solid fa-bolt-lightning text-white"></i>',
    iconBg: 'bg-emerald-500',
    sound: 'success'
  },
  ana: {
    name: 'Ana Gómez',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    badge: '<i class="fa-solid fa-crown text-emerald-400"></i> ATLETA ACTIVA — ACCESO CONCEDIDO ⚡',
    message: '¡Poder divino, Ana! Te quedan <span class="underline font-black text-white">22 días</span> de tu Membresía Olimpo.',
    plan: 'Membresía Olimpo ($400)',
    expire: '28 Nov 2026',
    streak: '22 días ⚡ 🏛️',
    cardClasses: 'bg-gradient-to-b from-[#063f2a] via-[#032316] to-[#01140c] border-2 border-emerald-400 shadow-[0_0_50px_rgba(16,185,129,0.35)]',
    badgeClasses: 'bg-[#022114]/90 text-emerald-300 border border-emerald-500/50',
    dividerClass: 'border-emerald-500/20',
    statBoxClasses: 'bg-[#02180e]/90 border border-emerald-500/30 text-white',
    watermarkTopClass: 'w-48 h-48 opacity-15 text-emerald-400 absolute -top-10 -left-10 pointer-events-none animate-pulse',
    watermarkBottomClass: 'w-32 h-32 opacity-15 text-emerald-400 absolute -bottom-6 -right-4 pointer-events-none',
    iconHtml: '<i class="fa-solid fa-crown text-white"></i>',
    iconBg: 'bg-emerald-500',
    sound: 'success'
  },
  warning: {
    name: 'Sofía Ramírez',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    badge: '<i class="fa-solid fa-clock text-amber-400"></i> MEMBRESÍA POR VENCER ⚠️ — ACCESO PERMITIDO',
    message: '¡Saludos Sofía! Tu plan <span class="underline font-black text-white">vence mañana</span>. Renueva en Olimpo Central.',
    plan: 'Quincena Celestial ($250)',
    expire: 'Mañana (28 Oct)',
    streak: '8 días ⚡',
    cardClasses: 'bg-gradient-to-b from-[#3d2005] via-[#211202] to-[#120701] border-2 border-amber-400 shadow-[0_0_50px_rgba(245,158,11,0.35)]',
    badgeClasses: 'bg-[#211202]/90 text-amber-300 border border-amber-500/50',
    dividerClass: 'border-amber-500/20',
    statBoxClasses: 'bg-[#180a01]/90 border border-amber-500/30 text-white',
    watermarkTopClass: 'w-48 h-48 opacity-15 text-amber-400 absolute -top-10 -left-10 pointer-events-none animate-pulse',
    watermarkBottomClass: 'w-32 h-32 opacity-15 text-amber-400 absolute -bottom-6 -right-4 pointer-events-none',
    iconHtml: '<i class="fa-solid fa-exclamation text-slate-950"></i>',
    iconBg: 'bg-amber-400',
    sound: 'warning'
  },
  expired: {
    name: 'Jorge Vargas',
    photo: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=400&q=80',
    badge: '<i class="fa-solid fa-shield-halved text-rose-400"></i> PORTAL CERRADO — ACCESO DENEGADO 🚫',
    message: 'Tu membresía ha vencido. <span class="underline font-black text-white">Pasa a recepción</span> para renovar en el Olimpo.',
    plan: 'Membresía Olimpo ($400)',
    expire: 'Venció hace 4 días',
    streak: 'Vencido 🚫',
    cardClasses: 'bg-gradient-to-b from-[#3d0808] via-[#210303] to-[#120101] border-2 border-rose-500 shadow-[0_0_50px_rgba(244,63,94,0.35)]',
    badgeClasses: 'bg-[#210303]/90 text-rose-300 border border-rose-500/50',
    dividerClass: 'border-rose-500/20',
    statBoxClasses: 'bg-[#180202]/90 border border-rose-500/30 text-white',
    watermarkTopClass: 'w-48 h-48 opacity-15 text-rose-400 absolute -top-10 -left-10 pointer-events-none',
    watermarkBottomClass: 'w-32 h-32 opacity-15 text-rose-400 absolute -bottom-6 -right-4 pointer-events-none',
    iconHtml: '<i class="fa-solid fa-ban text-white"></i>',
    iconBg: 'bg-rose-600',
    sound: 'error'
  },
  visit: {
    name: 'Pase de Visita Zeus',
    photo: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=400&q=80',
    badge: '<i class="fa-solid fa-bolt-lightning text-amber-400"></i> PASE DIARIO ZEUS — ACCESO CONCEDIDO ⚡',
    message: '¡Bienvenido al Templo de Zeus! Entrena con la disciplina y fuerza de un titán.',
    plan: 'Visita ($60)',
    expire: 'Válido Hoy',
    streak: 'Pase Diario ⚡',
    cardClasses: 'bg-gradient-to-b from-[#1e1b4b] via-[#0f172a] to-[#070b14] border-2 border-sky-400 shadow-[0_0_50px_rgba(56,189,248,0.35)]',
    badgeClasses: 'bg-sky-950/90 text-sky-300 border border-sky-500/50',
    dividerClass: 'border-sky-500/20',
    statBoxClasses: 'bg-sky-950/90 border border-sky-500/30 text-white',
    watermarkTopClass: 'w-48 h-48 opacity-15 text-sky-400 absolute -top-10 -left-10 pointer-events-none animate-pulse',
    watermarkBottomClass: 'w-32 h-32 opacity-15 text-sky-400 absolute -bottom-6 -right-4 pointer-events-none',
    iconHtml: '<i class="fa-solid fa-bolt-lightning text-amber-300"></i>',
    iconBg: 'bg-sky-500',
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
  const [isSimPillOpen, setIsSimPillOpen] = useState(false);
  const pinBufferRef = useRef('');
  const pinTimeoutRef = useRef(null);

  // Configuración de TV con Temática del Olimpo
  const [tvConfig, setTvConfig] = useState({
    musicTitle: 'ZEUS EPIC SOUNDTRACK',
    promoBadge: 'DECRETOS & PROMOCIONES DEL OLIMPO',
    promoTitle: 'PROMO DÚO TITANES 2 X $700 MXN',
    promoDesc: 'Entrena en el Templo de Zeus. ¡Disciplina y poder divino!',
    tariffsHeader: 'DECRETOS & TARIFAS DEL OLIMPO',
    tariffs: [
      { name: 'Membresía Olimpo', price: '$400', sub: 'Acceso Total 30 días', promoTitle: 'MEMBRESÍA OLIMPO — $400 MXN', promoDesc: 'Acceso total durante 30 días de entrenamiento divino en el Templo de Zeus.' },
      { name: 'Dúo Titanes', price: '2x$700', sub: '¡Ahorras $100 MXN!', promoTitle: 'PROMO DÚO TITANES 2 X $700 MXN', promoDesc: 'Entrena con tu compañero de armas del Olimpo y alcancen la gloria de los dioses.' },
      { name: 'Quincena Celestial', price: '$250', sub: '15 días de disciplina', promoTitle: 'QUINCENA CELESTIAL — $250 MXN', promoDesc: '15 días de disciplina y fuerza divina. ¡Poder absoluto en el Templo de Zeus!' },
      { name: 'Pase Diario Zeus', price: '$60', sub: 'Pase individual', promoTitle: 'PASE DIARIO ZEUS — $60 MXN', promoDesc: 'Pase individual de acceso completo por un día. ¡Entrena con la fuerza del rayo!' }
    ],
    gymNotices: [
      { id: 'n1', badge: 'CÓDIGO OLÍMPICO • HIGIENE DEL SANTUARIO', title: 'USO OBLIGATORIO DE TOALLA', desc: 'Por higiene y respeto a tus compañeros de entrenamiento, es obligatorio portar toalla personal para limpiar bancos y máquinas al terminar.', icon: 'fa-spray-can-sparkles', theme: 'amber' },
      { id: 'n2', badge: 'DECRETO SAGRADO • DISCIPLINA OLÍMPICA', title: 'DESCARGA TUS BARRAS Y ACOMODA EL EQUIPO', desc: 'Si tuviste la fuerza para levantarlo, ten la disciplina de guardarlo. Regresa mancuernas y discos a sus racks en el Templo.', icon: 'fa-dumbbell', theme: 'blue' },
      { id: 'n3', badge: 'SEGURIDAD DEL OLIMPO • PREVENCIÓN', title: 'CALZADO Y VESTIMENTA DEPORTIVA', desc: 'Por tu seguridad en sala de pesas, está estrictamente prohibido entrenar descalzo, en sandalias o con calzado no deportivo.', icon: 'fa-shoe-prints', theme: 'emerald' },
      { id: 'n4', badge: 'HORARIOS DEL SANTUARIO • TEMPLO DE ZEUS', title: 'HORARIOS DEL TEMPLO DE ZEUS', desc: 'Lunes a Viernes: 6:00 AM – 10:00 PM | Sábados: 7:00 AM – 2:00 PM. ¡Honor, fuerza y disciplina en el Templo de Zeus!', icon: 'fa-clock', theme: 'amber' }
    ],
    sensorTitle: 'Coloca tu huella en el sensor para entrar',
    sensorSub: 'El sistema mostrará tus días restantes de forma automática en pantalla',
    sensorBtn: 'PIN O HUELLA',
    card1Title: 'NÉCTAR & ELÍXIRES EXPRESS',
    card1Desc: 'Pregunta por tu Scoop de Pre-entreno Rayo de Zeus, Creatina y Proteína por servicio.',
    card2Title: 'CÓDIGO OLÍMPICO',
    card2Desc: 'Descarga tus barras al terminar y porta tu toalla. ¡Honor en el Templo de Zeus!',
    footerTicker: 'CÓDIGO OLÍMPICO // ¡Honor, fuerza y disciplina en el Templo de Zeus! • Horarios: Lun-Vie 6am a 10pm, Sáb 7am a 2pm',
    bgImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1400&q=80'
  });

  const [arsenalItems, setArsenalItems] = useState([
    { id: 'p1', name: 'Agua Glaciar 1L', price: 20, stock: 24, icon: 'fa-bottle-water' },
    { id: 'p2', name: 'Pre-Entreno Rayo de Zeus', price: 35, stock: 18, icon: 'fa-bolt-lightning' },
    { id: 'p3', name: 'Néctar Proteico Whey', price: 30, stock: 15, icon: 'fa-jar' },
    { id: 'p4', name: 'Electrolitos del Olimpo', price: 15, stock: 20, icon: 'fa-wine-bottle' }
  ]);

  // Rotación de Promos
  const [promos, setPromos] = useState(DEFAULT_PROMOS);
  const [currentPromoIndex, setCurrentPromoIndex] = useState(1);
  const [isPromoAutoplay, setIsPromoAutoplay] = useState(true);
  const [progressKey, setProgressKey] = useState(0);

  // Alertas y Modal de Acceso
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
      showCommanderToast('PORTAL CERRADO', 'El simulador de acceso se encuentra en BLOQUEO TOTAL DE EMERGENCIA.');
      updatePinBuffer('');
      setIsPinModalOpen(false);
      return;
    }

    socket.emit('SENSOR_SCAN', { memberId: clean, channel: 1 });
    updatePinBuffer('');
    setIsPinModalOpen(false);
  };

  // Helper para disparar flujos de simulación interactiva
  const triggerSimulation = (type) => {
    if (type === 'active') {
      const data = MEMBERS_DATA.active;
      setAccessCard(data);
      playSound(data.sound);
      setIsDoorOpen(true);
      setTimeout(() => setIsDoorOpen(false), 5000);
      socket.emit('SENSOR_SCAN', { memberId: '042', channel: 1 });
      showCommanderToast('⚡ ACCESO AUTORIZADO', 'Carlos Mendoza — Acceso Concedido (Atleta Activo)');
    } else if (type === 'warning') {
      const data = MEMBERS_DATA.warning;
      setAccessCard(data);
      playSound(data.sound);
      setIsDoorOpen(true);
      setTimeout(() => setIsDoorOpen(false), 5000);
      socket.emit('SENSOR_SCAN', { memberId: '019', channel: 1 });
      showCommanderToast('⚠️ MEMBRESÍA POR VENCER', 'Sofía Ramírez — Vence mañana. Pasa a recepción.');
    } else if (type === 'expired') {
      const data = MEMBERS_DATA.expired;
      setAccessCard(data);
      playSound(data.sound);
      socket.emit('SENSOR_SCAN', { memberId: '012', channel: 1 });
      showCommanderToast('🚫 ACCESO DENEGADO', 'Jorge Vargas — Membresía vencida hace 4 días.');
    } else if (type === 'visit') {
      const data = MEMBERS_DATA.visit;
      setAccessCard(data);
      playSound(data.sound);
      setIsDoorOpen(true);
      setTimeout(() => setIsDoorOpen(false), 5000);
      setTodayCounter((prev) => prev + 1);
      socket.emit('QUICK_VISIT', { amount: 60, note: 'Simulación Pase Diario Zeus' });
      showCommanderToast('⚡ PASE DIARIO ZEUS ($60)', 'Visita express registrada en el Olimpo.');
    } else if (type === 'lockdown') {
      const nextLock = !isSystemLocked;
      setIsSystemLocked(nextLock);
      socket.emit('EMERGENCY_LOCKDOWN', { isLocked: nextLock });
      if (nextLock) {
        playSound('error');
        showCommanderToast('⚡ BLOQUEO TOTAL DE EMERGENCIA', 'Portal del Olimpo cerrado herméticamente.');
      } else {
        playSound('success');
        showCommanderToast('⚡ PORTAL RESTABLECIDO', 'Simulador de acceso activo y en línea.');
      }
    } else if (type === 'gate') {
      if (!isSystemLocked) {
        playSound('door');
        setIsDoorOpen(true);
        setTimeout(() => setIsDoorOpen(false), 5000);
        socket.emit('MANUAL_OVERRIDE', { channel: 1 });
        showCommanderToast('⚡ PULSO MANUAL DEL PORTAL', 'Canal 1 liberado por 5 segundos.');
      }
    } else if (type === 'fullscreen') {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    } else if (type === 'view') {
      if (onChangeView) {
        onChangeView(currentView === 'monitor' ? 'admin' : 'monitor');
      } else {
        const next = currentView === 'monitor' ? 'admin' : 'monitor';
        const url = new URL(window.location.href);
        url.searchParams.set('view', next);
        window.location.href = url.toString();
      }
    }
  };

  // Listener global de teclado numérico / lector HID y Hotkeys de Simulación
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) {
        return;
      }

      const key = e.key ? e.key.toLowerCase() : '';
      const code = e.code || '';

      // Hotkeys de Simulación: KeyA, KeyW, KeyE, KeyV, KeyL, KeyO, KeyF, KeyM
      if (code === 'KeyA' || key === 'a') {
        e.preventDefault();
        triggerSimulation('active');
        return;
      }
      if (code === 'KeyW' || key === 'w') {
        e.preventDefault();
        triggerSimulation('warning');
        return;
      }
      if (code === 'KeyE' || key === 'e') {
        e.preventDefault();
        triggerSimulation('expired');
        return;
      }
      if (code === 'KeyV' || key === 'v') {
        e.preventDefault();
        triggerSimulation('visit');
        return;
      }
      if (code === 'KeyL' || key === 'l') {
        e.preventDefault();
        triggerSimulation('lockdown');
        return;
      }
      if (code === 'KeyO' || key === 'o') {
        e.preventDefault();
        triggerSimulation('gate');
        return;
      }
      if (code === 'KeyF' || key === 'f') {
        e.preventDefault();
        triggerSimulation('fullscreen');
        return;
      }
      if (code === 'KeyM' || key === 'm') {
        e.preventDefault();
        triggerSimulation('view');
        return;
      }

      // Ingreso de PIN numérico
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
  }, [isSystemLocked, currentView, onChangeView]);

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
            badge: cfg.promoBadge || 'DECRETOS & PROMOCIONES DEL OLIMPO',
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

    const handleProductsSync = (items) => {
      if (Array.isArray(items)) setArsenalItems(items);
    };
    socket.on('PRODUCTS_SYNC', handleProductsSync);
    socket.on('ARSENAL_SYNC', handleProductsSync);

    socket.on('LOCKDOWN_STATUS', (isLocked) => {
      setIsSystemLocked(isLocked);
      if (isLocked) {
        showCommanderToast('⚡ ALERTA DEL OLIMPO: BLOQUEO DE EMERGENCIA', 'El portal sagrado ha sido cerrado por el Administrador. Ningún ingreso permitido.');
        playSound('error');
      } else {
        setCommanderAlert({ visible: false, title: '', msg: '' });
        playSound('success');
      }
    });

    socket.on('DOOR_OVERRIDE_TRIGGERED', () => {
      if (isSystemLocked) return;
      showCommanderToast('PORTAL LIBERADO POR COMANDO', 'Apertura remota concedida por 5 segundos.');
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
      showCommanderToast('ATLETA RENOVADO', `${data.name || 'Un atleta'} ha renovado su plan (${data.plan || 'Membresía Olimpo'}). ¡Gloria en el Templo!`);
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
        let customMsg = `¡Bienvenido al Templo de Zeus, <span class="text-white font-black">${payload.name}</span>! Te quedan <span class="underline font-black text-white">${daysVal} días</span> de tu plan.`;

        if (statusType === 'warning') {
          expireText = daysVal === 0 ? 'Vence hoy' : `En ${daysVal} día(s)`;
          customMsg = `¡Saludos <span class="text-white font-black">${payload.name}</span>! Tu plan <span class="underline font-black text-white">vence en ${daysVal} día(s)</span>. Renueva en Olimpo Central.`;
        } else if (statusType === 'expired') {
          expireText = payload.plan === 'Sin Registro' ? 'Folio no registrado' : `Venció hace ${Math.abs(daysVal)}d`;
          customMsg =
            payload.plan === 'Sin Registro'
              ? `El folio <span class="text-white font-black">#${payload.id}</span> no existe. Consulta en Olimpo Central.`
              : `<span class="text-white font-black">${payload.name}</span>, tu membresía ha vencido. <span class="underline font-black text-white">Pasa a recepción</span> para renovar en el Olimpo.`;
        }

        const customCard = {
          ...template,
          name: payload.name || template.name,
          photo: payload.photo || template.photo,
          plan: planText,
          expire: expireText,
          message: customMsg,
          streak: statusType === 'expired' ? 'Vencido 🚫' : `ID #${payload.id || '000'} ⚡`
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
      socket.off('PRODUCTS_SYNC', handleProductsSync);
      socket.off('ARSENAL_SYNC', handleProductsSync);
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
      showCommanderToast('PORTAL CERRADO', 'El simulador de acceso se encuentra en BLOQUEO TOTAL DE EMERGENCIA.');
      return;
    }
    const options = ['active', 'warning', 'expired'];
    const chosen = options[Math.floor(Math.random() * options.length)];
    socket.emit('SENSOR_SCAN', chosen);
  };

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden flex flex-col bg-marble-travertine antialiased select-none">
      {/* Toast de Decretos del Olimpo */}
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

      {/* Main Layout Adaptativo 100% Responsivo */}
      <main className="flex-1 min-h-0 w-full flex flex-col lg:flex-row bg-marble-travertine overflow-y-auto lg:overflow-hidden relative">
        {/* Columna Izquierda: Cartelera Hero + Avisos + Decretos & Tarifas + Ticker */}
        <div className="flex-1 min-w-0 lg:h-full relative flex flex-col justify-between lg:overflow-hidden bg-marble-travertine">
          {/* Suave sombra decorativa en el fondo del templo */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-black/5 pointer-events-none"></div>

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

            {/* Carrusel Rotativo de Avisos Sagrados del Olimpo */}
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

        {/* Columna Derecha: Módulo de Acceso & Bienvenida en Vivo + Néctar Express */}
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

      {/* Píldora Flotante Elegante de Controles de Simulación (Estilo Olimpo Clásico) */}
      <aside aria-label="Controles de Simulación del Olimpo" className="fixed bottom-14 right-4 z-[95] select-none">
        <div
          onMouseEnter={() => setIsSimPillOpen(true)}
          onMouseLeave={() => setIsSimPillOpen(false)}
          className={`transition-all duration-300 rounded-2xl backdrop-blur-2xl border shadow-2xl ${
            isSimPillOpen
              ? 'bg-[#0F1E36]/95 border-[#D4AF37] p-3 w-72 sm:w-80 shadow-[0_10px_40px_rgba(15,30,54,0.6)] ring-1 ring-[#D4AF37]/50'
              : 'bg-[#0F1E36]/90 border-[#C5A059] px-3.5 py-2 shadow-[0_4px_25px_rgba(212,175,55,0.3)] hover:border-[#D4AF37]'
          }`}
        >
          {!isSimPillOpen ? (
            <button
              type="button"
              onClick={() => setIsSimPillOpen(true)}
              className="flex items-center gap-2 text-amber-300 cursor-pointer font-zeus font-black text-xs tracking-wider uppercase"
              title="Abrir controles rápidos de simulación"
            >
              <i className="fa-solid fa-bolt-lightning text-amber-300 text-sm animate-pulse"></i>
              <span>Simulador Olimpo</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping ml-1"></span>
            </button>
          ) : (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                <div className="flex items-center gap-1.5 text-amber-300 font-zeus font-black text-xs uppercase tracking-wider">
                  <i className="fa-solid fa-bolt-lightning"></i>
                  <span>Simulador Olimpo</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSimPillOpen(false)}
                  className="w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white flex items-center justify-center text-[10px] cursor-pointer"
                  title="Colapsar"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => triggerSimulation('active')}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/90 border border-emerald-500/40 text-emerald-200 font-bold transition-all cursor-pointer active:scale-95"
                >
                  <span className="truncate">⚡ Activo</span>
                  <kbd className="text-[10px] font-mono bg-black/60 px-1.5 py-0.5 rounded text-emerald-400 border border-emerald-500/30">A</kbd>
                </button>

                <button
                  type="button"
                  onClick={() => triggerSimulation('warning')}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-amber-950/70 hover:bg-amber-900/90 border border-amber-500/40 text-amber-200 font-bold transition-all cursor-pointer active:scale-95"
                >
                  <span className="truncate">⚠️ Aviso</span>
                  <kbd className="text-[10px] font-mono bg-black/60 px-1.5 py-0.5 rounded text-amber-400 border border-amber-500/30">W</kbd>
                </button>

                <button
                  type="button"
                  onClick={() => triggerSimulation('expired')}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-rose-950/70 hover:bg-rose-900/90 border border-rose-500/40 text-rose-200 font-bold transition-all cursor-pointer active:scale-95"
                >
                  <span className="truncate">🚫 Vencido</span>
                  <kbd className="text-[10px] font-mono bg-black/60 px-1.5 py-0.5 rounded text-rose-400 border border-rose-500/30">E</kbd>
                </button>

                <button
                  type="button"
                  onClick={() => triggerSimulation('visit')}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-sky-950/70 hover:bg-sky-900/90 border border-sky-500/40 text-sky-200 font-bold transition-all cursor-pointer active:scale-95"
                >
                  <span className="truncate">⚡ Visita $60</span>
                  <kbd className="text-[10px] font-mono bg-black/60 px-1.5 py-0.5 rounded text-sky-400 border border-sky-500/30">V</kbd>
                </button>

                <button
                  type="button"
                  onClick={() => triggerSimulation('gate')}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold transition-all cursor-pointer active:scale-95"
                >
                  <span className="truncate">🔓 Puerta</span>
                  <kbd className="text-[10px] font-mono bg-black/60 px-1.5 py-0.5 rounded text-slate-300 border border-slate-600">O</kbd>
                </button>

                <button
                  type="button"
                  onClick={() => triggerSimulation('lockdown')}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl border font-bold transition-all cursor-pointer active:scale-95 ${
                    isSystemLocked
                      ? 'bg-rose-900 border-rose-400 text-white shadow-[0_0_12px_rgba(244,63,94,0.6)] animate-pulse'
                      : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300'
                  }`}
                >
                  <span className="truncate">{isSystemLocked ? '🔒 Bloqueado' : '🛡️ Bloqueo'}</span>
                  <kbd className="text-[10px] font-mono bg-black/60 px-1.5 py-0.5 rounded text-amber-300 border border-slate-600">L</kbd>
                </button>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[11px] text-slate-400">
                <button
                  type="button"
                  onClick={() => triggerSimulation('fullscreen')}
                  className="hover:text-white cursor-pointer flex items-center gap-1"
                >
                  <i className="fa-solid fa-expand"></i> Pantalla (F)
                </button>
                <button
                  type="button"
                  onClick={() => triggerSimulation('view')}
                  className="hover:text-white cursor-pointer flex items-center gap-1 text-sky-400"
                >
                  <i className="fa-solid fa-repeat"></i> Admin (M)
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Modal Táctil Limpio de Ingreso por PIN / Folio */}
      {isPinModalOpen && (
        <div
          onClick={() => setIsPinModalOpen(false)}
          className="fixed inset-0 bg-black/85 backdrop-blur-xl z-[190] flex items-center justify-center p-4 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl p-6 shadow-2xl relative border-2 border-[#C5A059] bg-[#FAF9F6] text-[#0F1E36] animate-scaleUp"
          >
            <button
              onClick={() => setIsPinModalOpen(false)}
              className="absolute top-4 right-4 text-[#997A2C] hover:text-[#0F1E36] text-lg cursor-pointer"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            <div className="text-center mb-4">
              <h3 className="font-cinzel text-lg font-black text-[#0F1E36] uppercase tracking-wider">
                Acceso por PIN / Folio
              </h3>
              <p className="text-xs text-[#718096] mt-0.5">
                Teclea tu número de atleta (ej. 042, 088, 019) y presiona Entrar
              </p>
            </div>

            {/* Pantalla del PIN */}
            <div className="bg-[#0F1E36] border-2 border-[#C5A059] rounded-xl py-3 px-4 mb-4 text-center shadow-inner">
              <span className="font-cinzel text-3xl font-black tracking-[0.25em] text-[#D4AF37]">
                {pinBuffer ? '*'.repeat(pinBuffer.length) : '---'}
              </span>
              <p className="text-[10px] text-[#F3E5AB] font-cinzel mt-1">
                {pinBuffer ? `Folio: #${pinBuffer}` : 'Esperando dígitos...'}
              </p>
            </div>

            {/* Teclado Numérico 3x4 */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => updatePinBuffer((pinBufferRef.current + digit).slice(0, 6))}
                  className="bg-gradient-to-b from-[#162A4A] to-[#0F1E36] hover:from-[#1E3458] hover:to-[#142646] active:scale-95 border border-[#C5A059]/70 text-[#F3E5AB] font-cinzel text-xl font-black py-3 rounded-xl cursor-pointer shadow-md"
                >
                  {digit}
                </button>
              ))}
              <button
                type="button"
                onClick={() => updatePinBuffer('')}
                className="bg-[#2c1015] hover:bg-[#3d161d] active:scale-95 border border-[#f43f5e]/60 text-[#fb7185] font-bold text-xs py-3 rounded-xl cursor-pointer"
              >
                Limpiar
              </button>
              <button
                type="button"
                onClick={() => updatePinBuffer((pinBufferRef.current + '0').slice(0, 6))}
                className="bg-gradient-to-b from-[#162A4A] to-[#0F1E36] hover:from-[#1E3458] hover:to-[#142646] active:scale-95 border border-[#C5A059]/70 text-[#F3E5AB] font-cinzel text-xl font-black py-3 rounded-xl cursor-pointer shadow-md"
              >
                0
              </button>
              <button
                type="button"
                onClick={() => updatePinBuffer(pinBufferRef.current.slice(0, -1))}
                className="bg-[#162A4A] hover:bg-[#1E3458] active:scale-95 border border-[#C5A059]/70 text-[#F3E5AB] font-bold text-sm py-3 rounded-xl cursor-pointer"
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
                className="bg-[#E2E8F0] hover:bg-[#CBD5E1] border border-[#CBD5E1] text-[#0F1E36] font-cinzel font-bold text-xs px-3.5 py-2.5 rounded-xl cursor-pointer shadow-sm"
                title="Simular lectura de huella"
              >
                <i className="fa-solid fa-fingerprint mr-1 text-[#D4AF37]"></i> Demo
              </button>
              <button
                type="button"
                onClick={() => submitPinScan(pinBuffer)}
                className="flex-1 btn-gold-olympus active:scale-95 text-[#0F1E36] font-cinzel font-black text-sm py-2.5 rounded-xl uppercase tracking-wider cursor-pointer shadow-md"
              >
                Entrar <i className="fa-solid fa-arrow-right-to-bracket ml-1"></i>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Emergente Grande de Acceso Biométrico / PIN */}
      <AccessPopupModal
        accessData={accessCard}
        onClose={() => setAccessCard(null)}
      />
    </div>
  );
}
