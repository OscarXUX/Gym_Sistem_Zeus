// backend/server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const db = require('./db/database');
const relay = require('./hardware/relay');

const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' }));

// Servir frontend compilado de Vite (carpeta ../dist)
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

const server = http.createServer(app);
const io = new Server(server, {
  maxHttpBufferSize: 5e6, // 5MB para fotos Base64 también por WebSocket
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Helper para pulsar relevador y emitir RELAY_PULSE_EVENT a todos los clientes conectados
function triggerRelayPulseWithBroadcast(channel = 1, onComplete) {
  const targetChannel = channel === 2 ? 2 : 1;
  const duration = relay.pulseDuration || 800;
  io.emit('RELAY_PULSE_EVENT', { channel: targetChannel, duration, state: 'OPEN' });
  relay.triggerAccessPulse(targetChannel, (result) => {
    io.emit('RELAY_PULSE_EVENT', { channel: targetChannel, duration: 0, state: 'CLOSED' });
    if (onComplete) onComplete(result);
  });
}

// Cargar métricas persistidas del día desde SQLite
const initialMetrics = db.getTodayMetrics();
let todayCounter = initialMetrics ? initialMetrics.today_entries : 42;
let turnstileLocked = false;

// Cargar configuración de TV persistida en SQLite
let tvConfig = db.getTvConfig();

let currentPromo = {
  badge: tvConfig.promoBadge || 'DECRETO DEL OLIMPO',
  title: tvConfig.promoTitle || 'PROMO DÚO TITANES 2 X $700 MXN',
  msg: tvConfig.promoDesc || 'Entrena en el Templo de Zeus. ¡Disciplina y poder divino!'
};

// ==========================================
// ENDPOINTS REST API (SQLite + Relevador)
// ==========================================

app.get('/api/members', (req, res) => {
  try {
    const members = db.getAllMembers();
    res.json(members);
  } catch (err) {
    console.error('[API GET /api/members ERROR]', err.message);
    res.status(500).json({ error: 'Error al consultar socios en SQLite' });
  }
});

app.post('/api/members', (req, res) => {
  try {
    const created = db.createMember(req.body || {});
    const allMembers = db.getAllMembers();
    const metrics = db.getTodayMetrics();

    io.emit('MEMBERS_UPDATED', allMembers);
    io.emit('METRICS_SYNC', metrics);

    res.status(201).json({
      ok: true,
      member: created,
      members: allMembers,
      metrics
    });
  } catch (err) {
    console.error('[API POST /api/members ERROR]', err.message);
    res.status(500).json({ error: 'Error al crear socio en SQLite', details: err.message });
  }
});

app.put('/api/members/:id/renew', (req, res) => {
  try {
    const { id } = req.params;
    const { plan = 'Mensualidad', price = '$400', extraDays, days } = req.body || {};
    const renewed = db.renewMember(id, plan, price, extraDays ?? days ?? 30);
    if (!renewed) {
      return res.status(404).json({ error: 'Socio no encontrado' });
    }
    const allMembers = db.getAllMembers();
    const metrics = db.getTodayMetrics();

    io.emit('MEMBERS_UPDATED', allMembers);
    io.emit('METRICS_SYNC', metrics);
    io.emit('MEMBER_RENEWED', {
      id: renewed.id,
      name: renewed.name,
      plan: renewed.plan,
      days: renewed.days,
      price: renewed.price
    });

    res.json({
      ok: true,
      member: renewed,
      members: allMembers,
      metrics
    });
  } catch (err) {
    console.error('[API PUT /api/members/:id/renew ERROR]', err.message);
    res.status(500).json({ error: 'Error al renovar socio en SQLite', details: err.message });
  }
});

app.put('/api/members/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updated = db.updateMember(id, req.body || {});
    if (!updated) {
      return res.status(404).json({ error: 'Socio no encontrado' });
    }
    const allMembers = db.getAllMembers();
    io.emit('MEMBERS_UPDATED', allMembers);
    res.json({
      ok: true,
      member: updated,
      members: allMembers
    });
  } catch (err) {
    console.error('[API PUT /api/members/:id ERROR]', err.message);
    res.status(500).json({ error: 'Error al actualizar socio en SQLite' });
  }
});

app.delete('/api/members/:id', (req, res) => {
  try {
    const { id } = req.params;
    const deleted = db.deleteMember(id);
    const allMembers = db.getAllMembers();
    io.emit('MEMBERS_UPDATED', allMembers);
    res.json({
      ok: true,
      deleted,
      members: allMembers
    });
  } catch (err) {
    console.error('[API DELETE /api/members/:id ERROR]', err.message);
    res.status(500).json({ error: 'Error al eliminar socio en SQLite' });
  }
});

// Planes de membresía
app.get('/api/plans', (req, res) => {
  try {
    const plans = db.getAllPlans();
    res.json(plans);
  } catch (err) {
    console.error('[API GET /api/plans ERROR]', err.message);
    res.status(500).json({ error: 'Error al consultar planes en SQLite' });
  }
});

// Néctar y Suplementos (Inventario Olimpo)
app.get('/api/products', (req, res) => {
  try {
    const products = db.getAllProducts();
    res.json(products);
  } catch (err) {
    console.error('[API GET /api/products ERROR]', err.message);
    res.status(500).json({ error: 'Error al consultar inventario de Néctar y Suplementos' });
  }
});

app.post('/api/products', (req, res) => {
  try {
    const saved = db.saveProduct(req.body || {});
    const products = db.getAllProducts();
    io.emit('PRODUCTS_SYNC', products);
    io.emit('ARSENAL_SYNC', products);
    res.json({ ok: true, product: saved, products });
  } catch (err) {
    console.error('[API POST /api/products ERROR]', err.message);
    res.status(500).json({ error: 'Error al guardar producto', details: err.message });
  }
});

app.post('/api/products/:id/stock', (req, res) => {
  try {
    const delta = parseInt(req.body && req.body.delta !== undefined ? req.body.delta : 1, 10);
    const updated = db.addProductStock(req.params.id, delta);
    const products = db.getAllProducts();
    io.emit('PRODUCTS_SYNC', products);
    io.emit('ARSENAL_SYNC', products);
    res.json({ ok: true, product: updated, products });
  } catch (err) {
    console.error('[API POST /api/products/:id/stock ERROR]', err.message);
    res.status(500).json({ error: 'Error al actualizar stock', details: err.message });
  }
});

app.post('/api/products/restock-all', (req, res) => {
  try {
    const products = db.restockAllProducts();
    io.emit('PRODUCTS_SYNC', products);
    io.emit('ARSENAL_SYNC', products);
    res.json({ ok: true, products });
  } catch (err) {
    console.error('[API POST /api/products/restock-all ERROR]', err.message);
    res.status(500).json({ error: 'Error al reabastecer inventario', details: err.message });
  }
});

app.post('/api/store/sale', (req, res) => {
  try {
    const { itemId = 'p1', itemName = 'Néctar y Suplemento Olimpo', price = 20, quantity = 1 } = req.body || {};
    const { sale, metrics } = db.recordStoreSale(itemId, itemName, price, quantity);
    const products = db.getAllProducts();

    io.emit('METRICS_SYNC', metrics);
    io.emit('STORE_SALE_RECORDED', { sale, metrics });
    io.emit('PRODUCTS_SYNC', products);
    io.emit('ARSENAL_SYNC', products);

    res.status(201).json({
      ok: true,
      sale,
      metrics,
      products
    });
  } catch (err) {
    console.error('[API POST /api/store/sale ERROR]', err.message);
    res.status(500).json({ error: 'Error al registrar venta de suplemento', details: err.message });
  }
});

// Configuración de Pantalla TV / Monitor
app.get('/api/tv-config', (req, res) => {
  try {
    res.json(db.getTvConfig());
  } catch (err) {
    console.error('[API GET /api/tv-config ERROR]', err.message);
    res.status(500).json({ error: 'Error al consultar configuración de TV' });
  }
});

app.post('/api/tv-config', (req, res) => {
  try {
    tvConfig = db.saveTvConfig(req.body || {});
    io.emit('TV_CONFIG_SYNC', tvConfig);
    res.json({ ok: true, tvConfig });
  } catch (err) {
    console.error('[API POST /api/tv-config ERROR]', err.message);
    res.status(500).json({ error: 'Error al guardar configuración de TV' });
  }
});

// Cortes de Caja y Cierres de Turno
app.get('/api/cash-cut', (req, res) => {
  try {
    const summary = db.getDailyCutSummary(req.query.date || null);
    res.json(summary);
  } catch (err) {
    console.error('[API GET /api/cash-cut ERROR]', err.message);
    res.status(500).json({ error: 'Error al obtener el corte de caja del día' });
  }
});

app.post('/api/cash-cut', (req, res) => {
  try {
    const cut = db.registerCashCut(req.body || {});
    io.emit('CASH_CUT_REGISTERED', cut);
    res.status(201).json({ ok: true, cut });
  } catch (err) {
    console.error('[API POST /api/cash-cut ERROR]', err.message);
    res.status(500).json({ error: 'Error al registrar corte de caja en SQLite', details: err.message });
  }
});

app.get('/api/logs', (req, res) => {
  try {
    const logs = db.getRecentLogs(50);
    res.json(logs);
  } catch (err) {
    console.error('[API /api/logs ERROR]', err.message);
    res.status(500).json({ error: 'Error al consultar bitácora de accesos' });
  }
});

app.get('/api/metrics', (req, res) => {
  try {
    const metrics = db.getTodayMetrics();
    res.json(metrics);
  } catch (err) {
    res.status(500).json({ error: 'Error al consultar métricas del día' });
  }
});

app.post('/api/turnstile/override', (req, res) => {
  if (turnstileLocked) {
    return res.status(403).json({
      ok: false,
      error: 'Torniquete en BLOQUEO TOTAL de emergencia'
    });
  }

  const rawChannel = req.body && req.body.channel ? parseInt(req.body.channel, 10) : 1;
  const channel = rawChannel === 2 ? 2 : 1;

  triggerRelayPulseWithBroadcast(channel);

  const updated = db.incrementEntries(1);
  todayCounter = updated.today_entries;

  db.logAccess({
    memberId: 'ADMIN',
    memberName: `Apertura Manual Administrador Olimpo (${channel === 1 ? 'Entrada' : 'Salida'})`,
    action: channel === 1 ? 'MANUAL_ENTRY' : 'MANUAL_EXIT',
    channel,
    status: 'GRANTED'
  });

  io.emit('DOOR_OVERRIDE_TRIGGERED', { channel });
  io.emit('COUNTER_SYNC', todayCounter);
  io.emit('METRICS_SYNC', updated);

  return res.json({
    ok: true,
    channel,
    direction: channel === 1 ? 'ENTRADA' : 'SALIDA',
    counter: todayCounter
  });
});

// ==========================================
// ENDPOINTS REST PARA MODO SIMULACIÓN ZEUS
// ==========================================

app.post('/api/simulation/scan', (req, res) => {
  try {
    const { memberId, pin, rfid, type, channel = 1 } = req.body || {};
    const targetChannel = channel === 2 ? 2 : 1;

    if (turnstileLocked) {
      return res.json({
        ok: false,
        accessGranted: false,
        reason: 'TURNSTILE_LOCKED',
        channel: targetChannel
      });
    }

    const credential = memberId ?? pin ?? rfid;
    let member = null;
    if (credential !== undefined && credential !== null && String(credential).trim() !== '') {
      member = db.getMemberByCredential(String(credential).trim());
    } else if (type) {
      const memberMap = {
        active: '042',
        warning: '019',
        expired: '012'
      };
      const mappedId = memberMap[type] || '042';
      member = db.getMemberById(mappedId);
    } else {
      member = db.getMemberById('042');
    }

    if (member) {
      const isExpired = member.status === 'expired' || member.days < 0;
      if (!isExpired) {
        triggerRelayPulseWithBroadcast(targetChannel);
        const metrics = db.incrementEntries(1);
        todayCounter = metrics.today_entries;

        const nowTime = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
        const updatedMember = db.updateMember(member.id, {
          isInside: targetChannel === 1,
          timeIn: targetChannel === 1 ? nowTime : member.timeIn
        });

        db.logAccess({
          memberId: member.id,
          memberName: member.name,
          action: targetChannel === 1 ? 'SIMULATION_ENTRY' : 'SIMULATION_EXIT',
          channel: targetChannel,
          status: member.status === 'warning' ? 'GRANTED_WARNING' : 'GRANTED'
        });

        io.emit('COUNTER_SYNC', todayCounter);
        io.emit('METRICS_SYNC', metrics);
        io.emit('MEMBERS_UPDATED', db.getAllMembers());

        const cardPayload = {
          ...(updatedMember || member),
          type: member.status === 'warning' ? 'warning' : 'active',
          channel: targetChannel
        };
        io.emit('SHOW_ACCESS_CARD', cardPayload);
        io.emit('UPDATE_FEED', cardPayload);

        return res.json({
          ok: true,
          accessGranted: true,
          status: member.status,
          member: updatedMember || member,
          channel: targetChannel,
          counter: todayCounter
        });
      } else {
        db.logAccess({
          memberId: member.id,
          memberName: member.name,
          action: 'SIMULATION_DENIED',
          channel: targetChannel,
          status: 'DENIED_EXPIRED'
        });

        const deniedPayload = {
          ...member,
          status: 'expired',
          type: 'expired',
          channel: targetChannel
        };
        io.emit('SHOW_ACCESS_CARD', deniedPayload);
        io.emit('UPDATE_FEED', deniedPayload);

        return res.json({
          ok: true,
          accessGranted: false,
          reason: 'EXPIRED',
          member,
          channel: targetChannel
        });
      }
    } else {
      return res.status(404).json({
        ok: false,
        accessGranted: false,
        reason: 'MEMBER_NOT_FOUND',
        channel: targetChannel
      });
    }
  } catch (err) {
    console.error('[API /api/simulation/scan ERROR]', err.message);
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.post('/api/simulation/override', (req, res) => {
  try {
    if (turnstileLocked) {
      return res.status(403).json({ ok: false, error: 'Torniquete en Bloqueo Total de Emergencia' });
    }
    const channel = req.body && req.body.channel === 2 ? 2 : 1;
    triggerRelayPulseWithBroadcast(channel);

    const updated = db.incrementEntries(1);
    todayCounter = updated.today_entries;

    db.logAccess({
      memberId: 'ADMIN',
      memberName: 'Apertura Manual Administrador Olimpo',
      action: channel === 1 ? 'MANUAL_ENTRY' : 'MANUAL_EXIT',
      channel,
      status: 'GRANTED'
    });

    io.emit('DOOR_OVERRIDE_TRIGGERED', { channel });
    io.emit('COUNTER_SYNC', todayCounter);
    io.emit('METRICS_SYNC', updated);

    res.json({
      ok: true,
      channel,
      direction: channel === 1 ? 'ENTRADA' : 'SALIDA',
      counter: todayCounter
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.post('/api/simulation/visit', (req, res) => {
  try {
    if (turnstileLocked) {
      return res.status(403).json({ ok: false, error: 'Torniquete en Bloqueo Total de Emergencia' });
    }
    const amount = (req.body && (req.body.amount || req.body.price)) || 60;
    const visitPrice = parseInt(amount, 10) || 60;

    triggerRelayPulseWithBroadcast(1);

    const updated = db.recordQuickVisit(visitPrice, 1);
    todayCounter = updated.today_entries;

    io.emit('VISIT_PROCESSED', { counter: todayCounter, cashVisits: updated.visits_cash });
    io.emit('COUNTER_SYNC', todayCounter);
    io.emit('METRICS_SYNC', updated);
    io.emit('DOOR_OVERRIDE_TRIGGERED', { channel: 1 });
    io.emit('SHOW_ACCESS_CARD', 'visit');
    io.emit('UPDATE_FEED', 'visit');

    res.json({
      ok: true,
      price: visitPrice,
      counter: todayCounter,
      metrics: updated
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.get('/api/simulation/status', (req, res) => {
  try {
    res.json({
      simulationMode: Boolean(relay.isSimulation),
      hardwareEnabled: Boolean(!relay.isSimulation && relay.isConnected),
      db: 'zeus_gym.sqlite',
      connectedClients: io.engine.clientsCount,
      todayEntries: todayCounter,
      turnstileLocked,
      channels: {
        1: relay.isProcessing[1] ? 'busy' : 'ready',
        2: relay.isProcessing[2] ? 'busy' : 'ready'
      }
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ==========================================
// EVENTOS SOCKET.IO EN TIEMPO REAL
// ==========================================

io.on('connection', (socket) => {
  console.log('⚡ Dispositivo conectado al Templo de Zeus: ' + socket.id);

  const metrics = db.getTodayMetrics();
  todayCounter = metrics.today_entries;

  socket.emit('TV_CONFIG_SYNC', db.getTvConfig());
  socket.emit('PRODUCTS_SYNC', db.getAllProducts());
  socket.emit('ARSENAL_SYNC', db.getAllProducts());
  socket.emit('MEMBERS_UPDATED', db.getAllMembers());
  socket.emit('METRICS_SYNC', metrics);
  if (currentPromo.title !== '') {
    socket.emit('NEW_PROMO', currentPromo);
  }
  socket.emit('LOCKDOWN_STATUS', turnstileLocked);
  socket.emit('COUNTER_SYNC', todayCounter);

  // Promociones / Comunicaciones a TV
  socket.on('SEND_PROMO', (data = {}) => {
    console.log('Promoción recibida:', data);
    currentPromo = {
      badge: data.badge || tvConfig.promoBadge || 'DECRETO DEL OLIMPO',
      title: data.title || '',
      msg: data.msg || ''
    };
    tvConfig = db.saveTvConfig({
      promoBadge: currentPromo.badge,
      promoTitle: currentPromo.title,
      promoDesc: currentPromo.msg
    });
    io.emit('NEW_PROMO', currentPromo);
    io.emit('TV_CONFIG_SYNC', tvConfig);
  });

  // Actualización completa o parcial de la configuración del Monitor TV
  socket.on('UPDATE_TV_CONFIG', (newConfig = {}) => {
    console.log('Configuración de TV actualizada desde Admin');
    tvConfig = db.saveTvConfig(newConfig);
    if (newConfig.promoTitle) currentPromo.title = newConfig.promoTitle;
    if (newConfig.promoDesc) currentPromo.msg = newConfig.promoDesc;
    if (newConfig.promoBadge) currentPromo.badge = newConfig.promoBadge;
    io.emit('TV_CONFIG_SYNC', tvConfig);
    if (newConfig.notifyToast) {
      io.emit('NEW_PROMO', {
        badge: tvConfig.promoBadge,
        title: newConfig.toastTitle || 'PANTALLA ACTUALIZADA',
        msg: newConfig.toastMsg || 'Se han actualizado los precios y contenidos de la cartelera.'
      });
    }
  });

  socket.on('REMOTE_SELECT_TARIFF', (index) => {
    io.emit('SELECT_TARIFF_CARD', index);
  });

  socket.on('REMOTE_NEXT_PROMO', () => {
    io.emit('NEXT_PROMO_TRIGGER');
  });

  const handleProductsUpdate = (items) => {
    try {
      if (Array.isArray(items)) {
        for (const item of items) {
          db.saveProduct(item);
        }
        const allProds = db.getAllProducts();
        io.emit('PRODUCTS_SYNC', allProds);
        io.emit('ARSENAL_SYNC', allProds);
      }
    } catch (err) {
      console.error('[SOCKET UPDATE_PRODUCTS ERROR]', err.message);
    }
  };
  socket.on('UPDATE_PRODUCTS', handleProductsUpdate);
  socket.on('UPDATE_ARSENAL', handleProductsUpdate);

  socket.on('SET_COUNTER', (val) => {
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed >= 0) {
      const updated = db.setTodayCounter(parsed);
      todayCounter = updated.today_entries;
      io.emit('COUNTER_SYNC', todayCounter);
      io.emit('METRICS_SYNC', updated);
    }
  });

  socket.on('TOGGLE_LOCKDOWN', (isLocked) => {
    turnstileLocked = Boolean(isLocked);
    console.log(`Estado de Bloqueo de Emergencia cambiado a: ${turnstileLocked ? 'BLOQUEADO' : 'DESBLOQUEADO'}`);
    db.logAccess({
      memberId: 'SYSTEM',
      memberName: 'Oráculo Central Olimpo',
      action: turnstileLocked ? 'LOCKDOWN_ON' : 'LOCKDOWN_OFF',
      channel: 1,
      status: turnstileLocked ? 'LOCKED' : 'ARMED'
    });
    io.emit('LOCKDOWN_STATUS', turnstileLocked);
  });

  socket.on('MANUAL_OVERRIDE', (payload) => {
    if (turnstileLocked) {
      console.warn('Intento de apertura manual ignorado: Torniquete en BLOQUEO TOTAL');
      return;
    }
    const channel = payload && typeof payload === 'object' && payload.channel === 2 ? 2 : 1;
    console.log(`Apertura manual remota activada por Administrador Olimpo (Canal ${channel})`);

    triggerRelayPulseWithBroadcast(channel);

    const updated = db.incrementEntries(1);
    todayCounter = updated.today_entries;

    db.logAccess({
      memberId: 'ADMIN',
      memberName: 'Apertura Manual Administrador Olimpo',
      action: channel === 1 ? 'MANUAL_ENTRY' : 'MANUAL_EXIT',
      channel,
      status: 'GRANTED'
    });

    io.emit('DOOR_OVERRIDE_TRIGGERED', { channel });
    io.emit('COUNTER_SYNC', todayCounter);
    io.emit('METRICS_SYNC', updated);
  });

  socket.on('QUICK_VISIT', (payload) => {
    if (turnstileLocked) {
      console.warn('Cobro de visita con torniquete bloqueado');
      return;
    }
    const visitPrice =
      (payload && typeof payload === 'object' && parseInt(payload.price, 10)) ||
      parseInt(String(tvConfig?.tariffs?.[3]?.price || '60').replace(/[^0-9]/g, ''), 10) ||
      60;

    console.log(`Visita registrada y cobrada en mostrador ($${visitPrice} MXN)`);
    triggerRelayPulseWithBroadcast(1);

    const updated = db.recordQuickVisit(visitPrice, 1);
    todayCounter = updated.today_entries;

    io.emit('VISIT_PROCESSED', { counter: todayCounter, cashVisits: updated.visits_cash });
    io.emit('COUNTER_SYNC', todayCounter);
    io.emit('METRICS_SYNC', updated);
    io.emit('DOOR_OVERRIDE_TRIGGERED', { channel: 1 });
    io.emit('SHOW_ACCESS_CARD', 'visit');
    io.emit('UPDATE_FEED', 'visit');
  });

  // =========================================================
  // CRUD SOCIOS Y TIENDA VÍA SOCKET.IO (BLOQUES 1 Y 2)
  // =========================================================

  socket.on('CREATE_MEMBER', (data = {}) => {
    try {
      const created = db.createMember(data);
      const allMembers = db.getAllMembers();
      const updatedMetrics = db.getTodayMetrics();

      io.emit('MEMBERS_UPDATED', allMembers);
      io.emit('METRICS_SYNC', updatedMetrics);
      console.log(`⚡ Nuevo atleta del Olimpo consagrado en SQLite: #${created.id} ${created.name}`);
    } catch (err) {
      console.error('[SOCKET CREATE_MEMBER ERROR]', err.message);
    }
  });

  socket.on('RENEW_MEMBER', (data = {}) => {
    try {
      console.log('Socio renovado por socket:', data);
      if (data.id) {
        const renewed = db.renewMember(
          data.id,
          data.plan || 'Mensualidad',
          data.price !== undefined ? data.price : 400,
          data.extraDays ?? data.days ?? 30
        );
        const allMembers = db.getAllMembers();
        const updatedMetrics = db.getTodayMetrics();

        io.emit('MEMBERS_UPDATED', allMembers);
        io.emit('METRICS_SYNC', updatedMetrics);
        io.emit('MEMBER_RENEWED', {
          id: renewed ? renewed.id : data.id,
          name: renewed ? renewed.name : data.name || `Socio #${data.id}`,
          plan: renewed ? renewed.plan : data.plan || 'Mensualidad',
          days: renewed ? renewed.days : data.days || 30
        });
      }
    } catch (err) {
      console.error('[SOCKET RENEW_MEMBER ERROR]', err.message);
    }
  });

  socket.on('UPDATE_MEMBER', (data = {}) => {
    try {
      if (data.id) {
        db.updateMember(data.id, data);
        io.emit('MEMBERS_UPDATED', db.getAllMembers());
      }
    } catch (err) {
      console.error('[SOCKET UPDATE_MEMBER ERROR]', err.message);
    }
  });

  socket.on('DELETE_MEMBER', (payload) => {
    try {
      const id = typeof payload === 'object' && payload !== null ? payload.id : payload;
      if (id) {
        db.deleteMember(id);
        io.emit('MEMBERS_UPDATED', db.getAllMembers());
      }
    } catch (err) {
      console.error('[SOCKET DELETE_MEMBER ERROR]', err.message);
    }
  });

  socket.on('RECORD_STORE_SALE', (data = {}) => {
    try {
      const itemId = data.itemId || data.id || 'p1';
      const itemName = data.itemName || data.name || 'Néctar y Suplemento Olimpo';
      const price = data.price || 20;
      const quantity = data.quantity || 1;

      const { sale, metrics: updatedMetrics } = db.recordStoreSale(itemId, itemName, price, quantity);
      const products = db.getAllProducts();

      io.emit('METRICS_SYNC', updatedMetrics);
      io.emit('STORE_SALE_RECORDED', { sale, metrics: updatedMetrics });
      io.emit('PRODUCTS_SYNC', products);
      io.emit('ARSENAL_SYNC', products);
    } catch (err) {
      console.error('[SOCKET RECORD_STORE_SALE ERROR]', err.message);
    }
  });

  // Escaneo de Sensor Biométrico / RFID / PIN (Soporta tipo simulado o { memberId, pin, rfid, channel } real)
  socket.on('SENSOR_SCAN', (data) => {
    const channel = typeof data === 'object' && data !== null && data.channel === 2 ? 2 : 1;
    const rawMemberId = typeof data === 'object' && data !== null ? (data.memberId ?? data.id ?? data.pin ?? data.rfid) : null;

    if (rawMemberId !== null && rawMemberId !== undefined && String(rawMemberId).trim() !== '') {
      const cleanId = String(rawMemberId).trim();
      const member = db.getMemberByCredential(cleanId);

      if (member) {
        const isExpired = member.status === 'expired' || member.days < 0;
        const canEnter = !turnstileLocked && !isExpired;
        const nowTime = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });

        if (canEnter) {
          triggerRelayPulseWithBroadcast(channel);
          const updatedMetrics = db.incrementEntries(1);
          todayCounter = updatedMetrics.today_entries;

          const updatedMember = db.updateMember(member.id, {
            isInside: channel === 1,
            timeIn: channel === 1 ? nowTime : member.timeIn
          });

          db.logAccess({
            memberId: member.id,
            memberName: member.name,
            action: channel === 1 ? 'PIN_BIOMETRIC_ENTRY' : 'PIN_BIOMETRIC_EXIT',
            channel,
            status: member.status === 'warning' ? 'GRANTED_WARNING' : 'GRANTED'
          });

          io.emit('COUNTER_SYNC', todayCounter);
          io.emit('METRICS_SYNC', updatedMetrics);
          io.emit('MEMBERS_UPDATED', db.getAllMembers());

          const cardPayload = {
            ...(updatedMember || member),
            type: member.status === 'warning' ? 'warning' : 'active',
            channel
          };
          io.emit('SHOW_ACCESS_CARD', cardPayload);
          io.emit('UPDATE_FEED', cardPayload);
        } else {
          db.logAccess({
            memberId: member.id,
            memberName: member.name,
            action: 'PIN_BIOMETRIC_ATTEMPT',
            channel,
            status: turnstileLocked ? 'DENIED_LOCKDOWN' : 'DENIED_EXPIRED'
          });

          const deniedPayload = {
            ...member,
            status: 'expired',
            type: 'expired',
            channel
          };
          io.emit('SHOW_ACCESS_CARD', deniedPayload);
          io.emit('UPDATE_FEED', deniedPayload);
        }
        return;
      } else {
        // Socio no encontrado con ese PIN
        db.logAccess({
          memberId: cleanId,
          memberName: `PIN Desconocido (#${cleanId})`,
          action: 'PIN_NOT_FOUND',
          channel,
          status: 'DENIED_UNKNOWN'
        });
        const notFoundPayload = {
          id: cleanId,
          name: `PIN #${cleanId} NO REGISTRADO`,
          plan: 'Sin Registro',
          price: '$0',
          days: -1,
          status: 'expired',
          type: 'expired',
          channel
        };
        io.emit('SHOW_ACCESS_CARD', notFoundPayload);
        io.emit('UPDATE_FEED', notFoundPayload);
        return;
      }
    }

    // Modo simulado clásico ('active', 'warning', 'expired')
    const scanType = typeof data === 'object' && data !== null ? data.type : data;
    console.log(`Escaneo de sensor (${scanType}) en Canal ${channel}`);

    const memberMap = {
      active: { id: '042', name: 'Carlos Mendoza' },
      warning: { id: '019', name: 'Sofía Ramírez' },
      expired: { id: '012', name: 'Jorge Vargas' }
    };
    const target = memberMap[scanType] || { id: '000', name: 'Atleta' };

    if (!turnstileLocked && (scanType === 'active' || scanType === 'warning')) {
      triggerRelayPulseWithBroadcast(channel);
      const updated = db.incrementEntries(1);
      todayCounter = updated.today_entries;

      db.logAccess({
        memberId: target.id,
        memberName: target.name,
        action: channel === 1 ? 'BIOMETRIC_ENTRY' : 'BIOMETRIC_EXIT',
        channel,
        status: scanType === 'warning' ? 'GRANTED_WARNING' : 'GRANTED'
      });

      io.emit('COUNTER_SYNC', todayCounter);
      io.emit('METRICS_SYNC', updated);
    } else {
      db.logAccess({
        memberId: target.id,
        memberName: target.name,
        action: 'BIOMETRIC_ATTEMPT',
        channel,
        status: turnstileLocked ? 'DENIED_LOCKDOWN' : 'DENIED_EXPIRED'
      });
    }

    io.emit('SHOW_ACCESS_CARD', scanType);
    io.emit('UPDATE_FEED', scanType);
  });

  socket.on('disconnect', () => {
    console.log('Dispositivo desconectado: ' + socket.id);
  });
});

// Fallback SPA para cualquier ruta de cliente (Express 4 y 5 compatible)
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.startsWith('/socket.io')) {
    const indexHtml = path.join(distPath, 'index.html');
    if (fs.existsSync(indexHtml)) {
      return res.sendFile(indexHtml);
    }
  }
  next();
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`===================================================`);
  console.log(`⚡ ZEUS GYM — SISTEMA OFFLINE-FIRST ACTIVO ⚡`);
  console.log(`🌐 URL Local / LAN: http://0.0.0.0:${PORT}`);
  console.log(`🗄️  SQLite WAL:      Activo (zeus_gym.sqlite)`);
  console.log(`⚡ Modo Simulación:  ${relay.isSimulation ? '100% ACTIVO (Virtual)' : 'Hardware Físico'}`);
  console.log(`===================================================`);
});
