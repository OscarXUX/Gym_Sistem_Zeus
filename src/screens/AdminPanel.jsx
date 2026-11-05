import React, { useState, useEffect } from 'react';
import socket, { BACKEND_URL } from '../utils/socket';
import { playSound } from '../utils/audio';
import { useWakeLock } from '../utils/wakeLock';

import Sidebar from '../components/admin/Sidebar';
import MobileHeader from '../components/admin/MobileHeader';
import MobileDrawer from '../components/admin/MobileDrawer';
import BottomNav from '../components/admin/BottomNav';

import DashboardTab from '../components/admin/tabs/DashboardTab';
import ArsenalTab from '../components/admin/tabs/ArsenalTab';
import ComunicacionesTab from '../components/admin/tabs/ComunicacionesTab';
import TorniqueteTab from '../components/admin/tabs/TorniqueteTab';
import SociosTab from '../components/admin/tabs/SociosTab';
import GuerrerosActivosTab from '../components/admin/tabs/GuerrerosActivosTab';

import NewMemberModal from '../components/admin/modals/NewMemberModal';
import EditMemberModal from '../components/admin/modals/EditMemberModal';
import ProductModal from '../components/admin/modals/ProductModal';
import CashCutModal from '../components/admin/modals/CashCutModal';
import Toast from '../components/common/Toast';

const INITIAL_MEMBERS = [
  { id: '042', name: 'Carlos Mendoza', phone: '5512345678', photo: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=150&q=80', plan: 'Mensual', price: '$400', status: 'active', days: 18, isInside: true, timeIn: '10:15 AM' },
  { id: '088', name: 'Ana Gómez', phone: '5587654321', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80', plan: 'Mensual', price: '$400', status: 'active', days: 22, isInside: true, timeIn: '11:30 AM' },
  { id: '019', name: 'Sofía Ramírez', phone: '5544332211', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', plan: 'Quincena', price: '$250', status: 'warning', days: 1, isInside: true, timeIn: '12:05 PM' },
  { id: '012', name: 'Jorge Vargas', phone: '5599887766', photo: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80', plan: 'Mensual', price: '$400', status: 'expired', days: -4, isInside: false, timeIn: null }
];

const INITIAL_ARSENAL = [
  { id: 'p1', name: 'Agua 1L', category: 'Bebidas', price: 20, stock: 24, icon: 'fa-bottle-water', color: 'blue' },
  { id: 'p2', name: 'Pre-Entreno Hype', category: 'Scoop Hype', price: 35, stock: 18, icon: 'fa-bolt', color: 'rose' },
  { id: 'p3', name: 'Proteína Whey', category: 'Scoop Servicio', price: 30, stock: 15, icon: 'fa-jar', color: 'amber' },
  { id: 'p4', name: 'Electrolitos', category: 'Hidratación', price: 15, stock: 20, icon: 'fa-wine-bottle', color: 'purple' },
  { id: 'p5', name: 'Toalla GEARS', category: 'Equipo Oficial', price: 100, stock: 8, icon: 'fa-rug', color: 'stone' },
  { id: 'p6', name: 'Candado Lock', category: 'Seguridad Locker', price: 50, stock: 6, icon: 'fa-lock', color: 'rose' }
];

export default function AdminPanel({ currentView = 'admin', onChangeView }) {
  useWakeLock();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(socket.connected);

  // Estados Financieros y Métricas
  const [todayCash, setTodayCash] = useState(1420);
  const [todayEntries, setTodayEntries] = useState(42);
  const [dailyGoal, setDailyGoal] = useState(2500);
  const [quickVisitPrice, setQuickVisitPrice] = useState(60);
  const [cashBreakdown, setCashBreakdown] = useState({
    memberships: 1150,
    visits: 180,
    store: 90
  });

  // Torniquete y Radar
  const [isTurnstileLocked, setIsTurnstileLocked] = useState(false);
  const [isDoorOpen, setIsDoorOpen] = useState(false);
  const [accessFeed, setAccessFeed] = useState([
    { name: 'Carlos Mendoza', badgeText: 'ACCESO CONCEDIDO', isDenial: false, time: '12:00:15' },
    { name: 'Sofía Ramírez', badgeText: 'ACCESO CONCEDIDO (AVISO)', isDenial: false, time: '11:45:20' }
  ]);

  // Arsenal / Inventario
  const [arsenalItems, setArsenalItems] = useState(INITIAL_ARSENAL);
  const [salesLog, setSalesLog] = useState([
    { text: 'Venta: Agua 1L', badgeText: '+$20', isSale: true, time: '11:30 AM' },
    { text: 'Venta: Pre-Entreno Hype', badgeText: '+$35', isSale: true, time: '11:15 AM' }
  ]);

  // Socios
  const [members, setMembers] = useState(INITIAL_MEMBERS);

  // Modales y Toast
  const [isNewMemberOpen, setIsNewMemberOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCashCutOpen, setIsCashCutOpen] = useState(false);
  const [toast, setToast] = useState({ visible: false, msg: '', type: 'success' });

  // Configuración de TV sincronizada
  const [tvConfig, setTvConfig] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ visible: true, msg, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 3200);
  };

  const applyMetrics = (metrics) => {
    if (!metrics) return;
    const entries = metrics.today_entries ?? metrics.total_entries;
    if (typeof entries === 'number') setTodayEntries(entries);
    const m = metrics.memberships_cash ?? metrics.cash_memberships ?? 1150;
    const v = metrics.visits_cash ?? metrics.cash_visits ?? 180;
    const s = metrics.store_cash ?? metrics.cash_store ?? 90;
    const total = metrics.today_cash ?? (m + v + s);
    setCashBreakdown({ memberships: m, visits: v, store: s });
    setTodayCash(total);
  };

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/members`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setMembers(data);
        }
      })
      .catch(() => {});

    fetch(`${BACKEND_URL}/api/metrics`)
      .then((res) => (res.ok ? res.json() : null))
      .then((metrics) => {
        if (metrics) applyMetrics(metrics);
      })
      .catch(() => {});

    fetch(`${BACKEND_URL}/api/products`)
      .then((res) => (res.ok ? res.json() : null))
      .then((prods) => {
        if (Array.isArray(prods) && prods.length > 0) setArsenalItems(prods);
      })
      .catch(() => {});

    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));

    socket.on('MEMBERS_UPDATED', (updatedMembers) => {
      if (Array.isArray(updatedMembers)) {
        setMembers(updatedMembers);
      }
    });

    socket.on('METRICS_SYNC', (metrics) => {
      applyMetrics(metrics);
    });

    socket.on('STORE_SALE_RECORDED', (payload) => {
      if (payload?.metrics) applyMetrics(payload.metrics);
      if (payload?.sale) {
        const time = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
        setSalesLog((prev) => [
          {
            text: `Venta: ${payload.sale.item_name}`,
            badgeText: `+$${payload.sale.price}`,
            isSale: true,
            time
          },
          ...prev.slice(0, 19)
        ]);
      }
    });

    socket.on('TV_CONFIG_SYNC', (cfg) => {
      setTvConfig(cfg);
      if (cfg?.tariffs?.[3]?.price) {
        const num = parseInt(String(cfg.tariffs[3].price).replace(/[^0-9]/g, ''), 10);
        if (!isNaN(num) && num > 0) setQuickVisitPrice(num);
      }
    });

    socket.on('ARSENAL_SYNC', (items) => {
      if (Array.isArray(items) && items.length > 0) {
        setArsenalItems((prev) => {
          const map = new Map(prev.map((i) => [i.id, i]));
          items.forEach((it) => {
            map.set(it.id, { ...(map.get(it.id) || {}), ...it });
          });
          return Array.from(map.values());
        });
      }
    });

    socket.on('LOCKDOWN_STATUS', (isLocked) => {
      setIsTurnstileLocked(isLocked);
    });

    socket.on('COUNTER_SYNC', (cnt) => {
      setTodayEntries(cnt);
    });

    socket.on('DOOR_OVERRIDE_TRIGGERED', () => {
      setIsDoorOpen(true);
      setTimeout(() => setIsDoorOpen(false), 5000);
    });

    socket.on('UPDATE_FEED', (payload) => {
      const time = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      if (payload && typeof payload === 'object') {
        const isDenial = payload.status === 'expired' || payload.type === 'expired' || payload.days < 0;
        const name = payload.name || `Socio #${payload.id}`;
        const badgeText = isDenial
          ? 'ACCESO DENEGADO (Vencido)'
          : payload.status === 'warning'
          ? `ACCESO CONCEDIDO (${payload.days}d restantes)`
          : 'ACCESO CONCEDIDO';
        setAccessFeed((prev) => [{ name, badgeText, isDenial, time }, ...prev.slice(0, 14)]);
        return;
      }

      const type = payload;
      const isDenial = type === 'expired';
      const name = type === 'active' ? 'Carlos Mendoza' : type === 'warning' ? 'Sofía Ramírez' : type === 'visit' ? 'Pase de Visita' : 'Jorge Vargas';
      const badgeText = type === 'visit' ? 'VISITA PAGADA (ACCESO)' : isDenial ? 'ACCESO DENEGADO (Vencido)' : 'ACCESO CONCEDIDO';

      setAccessFeed((prev) => [{ name, badgeText, isDenial, time }, ...prev.slice(0, 14)]);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('MEMBERS_UPDATED');
      socket.off('METRICS_SYNC');
      socket.off('STORE_SALE_RECORDED');
      socket.off('TV_CONFIG_SYNC');
      socket.off('ARSENAL_SYNC');
      socket.off('LOCKDOWN_STATUS');
      socket.off('COUNTER_SYNC');
      socket.off('DOOR_OVERRIDE_TRIGGERED');
      socket.off('UPDATE_FEED');
    };
  }, []);

  // Handlers para Dashboard y Finanzas
  const handleAdjustCounter = (delta) => {
    const next = Math.max(0, todayEntries + delta);
    setTodayEntries(next);
    socket.emit('SET_COUNTER', next);
    showToast(`Contador TV ajustado a ${next}`, 'info');
  };

  const handleRegisterVisit = () => {
    setTodayCash((c) => c + quickVisitPrice);
    setCashBreakdown((b) => ({ ...b, visits: b.visits + quickVisitPrice }));
    setTodayEntries((e) => e + 1);

    socket.emit('QUICK_VISIT', { price: quickVisitPrice });
    setIsDoorOpen(true);
    setTimeout(() => setIsDoorOpen(false), 5000);

    showToast(`Visita cobrada (+$${quickVisitPrice} MXN) — Puerta abierta en TV`, 'success');
    playSound('success');
  };

  const handleEditDailyGoal = () => {
    const val = prompt('Ingresa la nueva meta de ingresos diarios ($ MXN):', dailyGoal);
    if (val === null) return;
    const num = parseInt(val, 10);
    if (!isNaN(num) && num >= 100) {
      setDailyGoal(num);
      showToast(`Meta diaria actualizada a $${num.toLocaleString('es-MX')}`, 'info');
    }
  };

  // Handlers de Torniquete
  const handleToggleLockdown = () => {
    const nextLocked = !isTurnstileLocked;
    setIsTurnstileLocked(nextLocked);
    socket.emit('TOGGLE_LOCKDOWN', nextLocked);
    if (nextLocked) {
      showToast('BLOQUEO DE EMERGENCIA ACTIVADO', 'error');
      playSound('error');
    } else {
      showToast('Torniquete restablecido a modo Armado', 'success');
      playSound('success');
    }
  };

  const handleManualOverride = (channel = 1) => {
    if (isTurnstileLocked) {
      showToast('No se puede abrir. El torniquete está en Bloqueo Total.', 'error');
      playSound('error');
      return;
    }
    const ch = channel === 2 ? 2 : 1;
    socket.emit('MANUAL_OVERRIDE', { channel: ch });
    setIsDoorOpen(true);
    setTimeout(() => setIsDoorOpen(false), 5000);
    showToast(`Apertura manual Canal ${ch} (${ch === 1 ? 'Entrada' : 'Salida'}) enviada`, 'info');
    playSound('door');
  };

  const handleEmitScan = (type) => {
    if (isTurnstileLocked) {
      showToast('Acceso denegado: Torniquete bajo Bloqueo Total', 'error');
      playSound('error');
      return;
    }
    socket.emit('SENSOR_SCAN', type);
    showToast(`Señal biométrica (${type}) enviada a TV`, 'info');
  };

  const handleScanMember = (memberId, channel = 1) => {
    if (isTurnstileLocked) {
      showToast('Acceso denegado: Torniquete bajo Bloqueo Total', 'error');
      playSound('error');
      return;
    }
    const target = members.find((m) => m.id === memberId);
    socket.emit('SENSOR_SCAN', { memberId, channel });
    if (target && (target.status === 'expired' || target.days < 0)) {
      showToast(`Huella de ${target.name}: ACCESO DENEGADO (Vencido)`, 'error');
      playSound('error');
    } else {
      setIsDoorOpen(true);
      setTimeout(() => setIsDoorOpen(false), 5000);
      showToast(`Huella de ${target ? target.name : '#' + memberId}: Acceso en Monitor TV + Relevador`, 'success');
      playSound('success');
    }
  };

  const handleSimulateRandomScan = () => {
    const types = ['active', 'warning', 'expired'];
    const chosen = types[Math.floor(Math.random() * types.length)];
    handleEmitScan(chosen);
  };

  // Handlers de Arsenal / Tienda (POS 1-Toque con SQLite)
  const handleAddStock = (id, amount) => {
    setArsenalItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStock = Math.max(0, item.stock + amount);
          showToast(`+${amount} unidades agregadas a ${item.name} (Stock: ${nextStock})`, 'info');
          return { ...item, stock: nextStock };
        }
        return item;
      })
    );
    playSound('success');
  };

  const handleRestockAll = (amount) => {
    setArsenalItems((prev) =>
      prev.map((item) => ({ ...item, stock: item.stock + amount }))
    );
    showToast(`Se sumaron +${amount} existencias a todo el Arsenal`, 'success');
    playSound('success');
  };

  const handleSellProduct = async (id, customName, customPrice) => {
    const found = arsenalItems.find((p) => p.id === id);
    const itemName = customName || (found ? found.name : 'Suplemento Arsenal');
    const itemPrice = customPrice ?? (found ? found.price : 20);

    setArsenalItems((prev) =>
      prev.map((p) => (p.id === id && p.stock > 0 ? { ...p, stock: p.stock - 1 } : p))
    );

    showToast(`Cobrado: ${itemName} (+$${itemPrice} MXN)`, 'success');
    playSound('success');

    try {
      const res = await fetch(`${BACKEND_URL}/api/store/sale`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: id, itemName, price: itemPrice })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.metrics) applyMetrics(data.metrics);
        return;
      }
    } catch {
      // Fallback por Socket.IO si la petición HTTP falla
    }
    socket.emit('RECORD_STORE_SALE', { itemId: id, itemName, price: itemPrice });
  };

  const handleSaveProduct = async (prodData) => {
    const payload = prodData.id ? prodData : { ...prodData, id: 'p' + Date.now() };

    // Emitir UPDATE_ARSENAL por Socket.IO para sincronización en tiempo real
    socket.emit('UPDATE_ARSENAL', [payload]);

    try {
      const res = await fetch(`${BACKEND_URL}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.products)) setArsenalItems(data.products);
        showToast(prodData.id ? `${prodData.name} actualizado en SQLite` : `Nuevo producto "${prodData.name}" guardado en SQLite`, 'success');
        playSound('success');
        return;
      }
    } catch {
      // Fallback local en caso de desconexión HTTP
    }

    if (prodData.id) {
      setArsenalItems((prev) =>
        prev.map((p) => (p.id === prodData.id ? { ...p, ...prodData } : p))
      );
      showToast(`${prodData.name} actualizado`, 'success');
    } else {
      setArsenalItems((prev) => [...prev, payload]);
      showToast(`Nuevo producto "${prodData.name}" agregado`, 'success');
    }
    playSound('success');
  };

  // Handlers de Socios (CRUD SQLite + Socket.IO)
  const handleToggleInside = async (id) => {
    const target = members.find((m) => m.id === id);
    if (!target) return;
    const nextInside = !target.isInside;
    const nextTimeIn = nextInside
      ? new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
      : target.timeIn;

    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isInside: nextInside, timeIn: nextTimeIn } : m))
    );
    showToast(`${target.name}: ${nextInside ? 'Dentro del gimnasio' : 'Fuera del gimnasio'}`, 'info');

    try {
      await fetch(`${BACKEND_URL}/api/members/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isInside: nextInside, timeIn: nextTimeIn })
      });
    } catch {
      socket.emit('UPDATE_MEMBER', { id, isInside: nextInside, timeIn: nextTimeIn });
    }
  };

  const handleRenewMember = async (id, planType, numericPrice, extraDays, priceLabel) => {
    const target = members.find((m) => m.id === id);
    const priceToSend = priceLabel || `$${numericPrice}`;

    try {
      const res = await fetch(`${BACKEND_URL}/api/members/${encodeURIComponent(id)}/renew`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: planType,
          price: priceToSend,
          extraDays
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.members)) setMembers(data.members);
        if (data.metrics) applyMetrics(data.metrics);
        showToast(
          `Renovación registrada en SQLite: ${target ? target.name : '#' + id} (+$${numericPrice} MXN)`,
          'success'
        );
        playSound('success');
        return;
      }
    } catch {
      // Fallback WebSocket
    }

    socket.emit('RENEW_MEMBER', {
      id,
      name: target ? target.name : `Socio #${id}`,
      plan: planType,
      price: priceToSend,
      extraDays
    });
    showToast(`Renovación exitosa: ${target ? target.name : '#' + id} (+$${numericPrice})`, 'success');
    playSound('success');
  };

  const handleRegisterNewMember = async ({ id, name, phone, photo, plan, price, rawPrice, days }) => {
    const payload = {
      id,
      name,
      phone,
      photo,
      plan,
      price,
      days
    };

    try {
      const res = await fetch(`${BACKEND_URL}/api/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.members)) setMembers(data.members);
        if (data.metrics) applyMetrics(data.metrics);
        showToast(
          `¡Guerrero ${name} (#${data.member?.id || ''}) guardado en SQLite! (+$${rawPrice || price})`,
          'success'
        );
        playSound('success');
        return;
      }
    } catch {
      // Fallback por Socket.IO
    }

    socket.emit('CREATE_MEMBER', payload);
    showToast(`¡Guerrero ${name} reclutado! (+$${rawPrice || price})`, 'success');
    playSound('success');
  };

  const handleSaveEditedMember = async (editedData) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/members/${encodeURIComponent(editedData.id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedData)
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.members)) setMembers(data.members);
        showToast('Datos del guerrero actualizados en SQLite', 'success');
        playSound('success');
        return;
      }
    } catch {
      // Fallback
    }
    socket.emit('UPDATE_MEMBER', editedData);
    showToast('Datos del guerrero actualizados', 'success');
    playSound('success');
  };

  const handleDeleteMember = async (id) => {
    const target = members.find((m) => m.id === id);
    if (!window.confirm(`¿Dar de baja al guerrero ${target ? target.name : '#' + id} de la base de datos?`)) {
      return;
    }
    try {
      const res = await fetch(`${BACKEND_URL}/api/members/${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.members)) setMembers(data.members);
        showToast(`Socio #${id} eliminado de SQLite`, 'info');
        return;
      }
    } catch {
      // Fallback
    }
    socket.emit('DELETE_MEMBER', { id });
    showToast(`Socio #${id} eliminado`, 'info');
  };

  // Handlers de Comunicaciones TV
  const handleSendPromo = (promoData) => {
    socket.emit('SEND_PROMO', promoData);
    showToast('Transmitido a TV en tiempo real', 'success');
    playSound('success');
  };

  const handleUpdateTvConfig = (newCfg) => {
    socket.emit('UPDATE_TV_CONFIG', newCfg);
    showToast('Configuración sincronizada con la TV', 'success');
    playSound('success');
  };

  const handleRemoteSelectTariff = (idx) => {
    socket.emit('REMOTE_SELECT_TARIFF', idx);
    showToast(`Tarifa #${idx + 1} destacada en TV`, 'info');
  };

  const handleRemoteNextPromo = () => {
    socket.emit('REMOTE_NEXT_PROMO');
    showToast('Siguiente promoción activada en TV', 'info');
  };

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden antialiased bg-[#111418] text-stone-200">
      {/* Toast Alert */}
      <Toast toast={toast} />

      {/* Sidebar Tablet / Desktop */}
      <Sidebar
        activeTab={activeTab}
        onSwitchTab={setActiveTab}
        onOpenNewMember={() => setIsNewMemberOpen(true)}
        isConnected={isConnected}
        currentView={currentView}
        onChangeView={onChangeView}
      />

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        activeTab={activeTab}
        onSwitchTab={setActiveTab}
        onOpenNewMember={() => setIsNewMemberOpen(true)}
        isConnected={isConnected}
      />

      {/* Área Principal de Contenido */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative admin-mesh-bg">
        {/* Contenido Dinámico de Tabs con Scroll (Header y BottomNav con efecto cristal iOS/macOS) */}
        <main className="flex-1 overflow-y-auto flex flex-col">
          {/* Header Mobile Sticky con Efecto Cristal */}
          <MobileHeader
            onToggleDrawer={() => setIsDrawerOpen(true)}
            onOpenNewMember={() => setIsNewMemberOpen(true)}
            isConnected={isConnected}
            currentView={currentView}
            onChangeView={onChangeView}
          />

          <div className="flex-1">
            {activeTab === 'dashboard' && (
              <DashboardTab
                todayCash={todayCash}
                todayEntries={todayEntries}
                activeMembers={members.length}
                members={members}
                dailyGoal={dailyGoal}
                quickVisitPrice={quickVisitPrice}
                cashBreakdown={cashBreakdown}
                isTurnstileLocked={isTurnstileLocked}
                isDoorOpen={isDoorOpen}
                accessFeed={accessFeed}
                arsenalItems={arsenalItems}
                onAdjustCounter={handleAdjustCounter}
                onRegisterVisit={handleRegisterVisit}
                onEditDailyGoal={handleEditDailyGoal}
                onEmitScan={handleEmitScan}
                onManualOverride={handleManualOverride}
                onOpenNewMember={() => setIsNewMemberOpen(true)}
                onAddStock={handleAddStock}
                onSellProduct={handleSellProduct}
                onOpenProductModal={(id) => {
                  const prod = id ? arsenalItems.find((p) => p.id === id) : null;
                  setEditingProduct(prod);
                  setIsProductModalOpen(true);
                }}
                onSwitchTab={setActiveTab}
                onOpenCashCut={() => setIsCashCutOpen(true)}
              />
            )}

            {activeTab === 'tienda' && (
              <ArsenalTab
                todayCash={todayCash}
                todayEntries={todayEntries}
                cashBreakdown={cashBreakdown}
                arsenalItems={arsenalItems}
                salesLog={salesLog}
                onSellProduct={handleSellProduct}
                onAddStock={handleAddStock}
                onRestockAll={handleRestockAll}
                onOpenProductModal={(id) => {
                  const prod = id ? arsenalItems.find((p) => p.id === id) : null;
                  setEditingProduct(prod);
                  setIsProductModalOpen(true);
                }}
                onOpenCashCut={() => setIsCashCutOpen(true)}
              />
            )}

            {activeTab === 'comunicaciones' && (
              <ComunicacionesTab
                tvConfig={tvConfig}
                onSendPromo={handleSendPromo}
                onUpdateTvConfig={handleUpdateTvConfig}
                onRemoteSelectTariff={handleRemoteSelectTariff}
                onRemoteNextPromo={handleRemoteNextPromo}
              />
            )}

            {activeTab === 'torniquete' && (
              <TorniqueteTab
                isTurnstileLocked={isTurnstileLocked}
                isDoorOpen={isDoorOpen}
                accessFeed={accessFeed}
                onToggleLockdown={handleToggleLockdown}
                onManualOverride={handleManualOverride}
                onEmitScan={handleEmitScan}
                onScanMember={handleScanMember}
                onSimulateRandomScan={handleSimulateRandomScan}
              />
            )}

            {activeTab === 'socios' && (
              <SociosTab
                members={members}
                onOpenNewMember={() => setIsNewMemberOpen(true)}
                onOpenEditMember={(id) => {
                  const m = members.find((x) => x.id === id);
                  setEditingMember(m);
                }}
                onToggleInside={handleToggleInside}
                onRenewMember={handleRenewMember}
                onScanMember={handleScanMember}
                onDeleteMember={handleDeleteMember}
                onOpenAforo={() => setActiveTab('guerreros_activos')}
              />
            )}

            {activeTab === 'guerreros_activos' && (
              <GuerrerosActivosTab
                members={members}
                onToggleInside={handleToggleInside}
                onBack={() => setActiveTab('socios')}
              />
            )}
          </div>

          {/* Bottom Nav Mobile Sticky con Efecto Cristal */}
          <BottomNav activeTab={activeTab} onSwitchTab={setActiveTab} />
        </main>
      </div>

      {/* Modales */}
      <NewMemberModal
        isOpen={isNewMemberOpen}
        onClose={() => setIsNewMemberOpen(false)}
        onRegister={handleRegisterNewMember}
      />

      <EditMemberModal
        isOpen={!!editingMember}
        onClose={() => setEditingMember(null)}
        member={editingMember}
        onSave={handleSaveEditedMember}
        onDelete={handleDeleteMember}
      />

      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setEditingProduct(null);
        }}
        product={editingProduct}
        onSave={handleSaveProduct}
      />

      <CashCutModal
        isOpen={isCashCutOpen}
        onClose={() => setIsCashCutOpen(false)}
        todayCash={todayCash}
        todayEntries={todayEntries}
        cashBreakdown={cashBreakdown}
      />
    </div>
  );
}

