// backend/db/database.js
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const oldDbPath = path.join(__dirname, 'gears_gym.sqlite');
const newDbPath = path.join(__dirname, 'zeus_gym.sqlite');

// Migración transparente si existe gears_gym.sqlite y no existe zeus_gym.sqlite
if (fs.existsSync(oldDbPath) && !fs.existsSync(newDbPath)) {
  try {
    fs.copyFileSync(oldDbPath, newDbPath);
    if (fs.existsSync(oldDbPath + '-wal')) fs.copyFileSync(oldDbPath + '-wal', newDbPath + '-wal');
    if (fs.existsSync(oldDbPath + '-shm')) fs.copyFileSync(oldDbPath + '-shm', newDbPath + '-shm');
    console.log('⚡ [MIGRACIÓN] Base de datos gears_gym.sqlite migrada exitosamente a zeus_gym.sqlite');
  } catch (err) {
    console.error('⚠️ [MIGRACIÓN ERROR]', err.message);
  }
}

const dbPath = process.env.DB_PATH || newDbPath;
const db = new Database(dbPath);

// Optimización WAL para lecturas y escrituras concurrentes sin bloqueos de archivo
db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');
db.pragma('foreign_keys = ON');

// =========================================================================
// 1. CREACIÓN DE ESQUEMA RELACIONAL Y TABLAS MAESTRAS
// =========================================================================
db.exec(`
  -- Tabla de Planes y Tarifas Oficiales
  CREATE TABLE IF NOT EXISTS plans (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price INTEGER NOT NULL,
    duration_days INTEGER NOT NULL DEFAULT 30,
    sub_title TEXT DEFAULT '',
    promo_title TEXT DEFAULT '',
    promo_desc TEXT DEFAULT '',
    sort_order INTEGER DEFAULT 0,
    active INTEGER DEFAULT 1
  );

  -- Tabla Maestra de Socios (Atletas del Olimpo)
  CREATE TABLE IF NOT EXISTS members (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT DEFAULT '',
    photo TEXT,
    plan TEXT NOT NULL DEFAULT 'Mensual',
    plan_id TEXT DEFAULT 'mensual',
    price TEXT DEFAULT '$400',
    status TEXT DEFAULT 'active',
    days INTEGER DEFAULT 30,
    days_remaining INTEGER DEFAULT 30,
    start_date DATE,
    expire_date DATE,
    pin_code TEXT,
    rfid_uid TEXT,
    isInside INTEGER DEFAULT 0,
    is_inside INTEGER DEFAULT 0,
    timeIn TEXT,
    time_in TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Tabla Transaccional de Pagos de Membresías
  CREATE TABLE IF NOT EXISTS member_payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    member_id TEXT NOT NULL,
    member_name TEXT NOT NULL,
    plan_id TEXT,
    plan_name TEXT NOT NULL,
    amount INTEGER NOT NULL,
    payment_type TEXT DEFAULT 'RENEWAL',
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Tabla Maestra de Néctar y Suplementos (Inventario del Olimpo)
  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT DEFAULT 'General',
    price INTEGER NOT NULL,
    stock INTEGER DEFAULT 0,
    icon TEXT DEFAULT 'fa-bottle-water',
    color TEXT DEFAULT 'blue',
    active INTEGER DEFAULT 1,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Tabla Transaccional de Ventas de Néctar y Suplementos
  CREATE TABLE IF NOT EXISTS store_sales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id TEXT,
    item_id TEXT,
    item_name TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    unit_price INTEGER NOT NULL,
    price INTEGER NOT NULL,
    total_price INTEGER NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Bitácora de Accesos y Sensor Biométrico / Torniquete
  CREATE TABLE IF NOT EXISTS access_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    member_id TEXT,
    member_name TEXT,
    action TEXT,
    channel INTEGER DEFAULT 1,
    status TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Métricas Consolidadas Diarias
  CREATE TABLE IF NOT EXISTS daily_metrics (
    date TEXT PRIMARY KEY,
    today_entries INTEGER DEFAULT 0,
    total_entries INTEGER DEFAULT 0,
    today_cash INTEGER DEFAULT 0,
    memberships_cash INTEGER DEFAULT 0,
    visits_cash INTEGER DEFAULT 0,
    store_cash INTEGER DEFAULT 0,
    cash_memberships INTEGER DEFAULT 0,
    cash_visits INTEGER DEFAULT 0,
    cash_store INTEGER DEFAULT 0
  );

  -- Tabla de Configuración Persistente del Monitor TV y Sistema
  CREATE TABLE IF NOT EXISTS tv_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Registro de Cortes de Caja (Cierres de Turno)
  CREATE TABLE IF NOT EXISTS cash_cuts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    expected_cash INTEGER NOT NULL,
    counted_cash INTEGER DEFAULT 0,
    difference INTEGER DEFAULT 0,
    memberships_cash INTEGER DEFAULT 0,
    visits_cash INTEGER DEFAULT 0,
    store_cash INTEGER DEFAULT 0,
    today_entries INTEGER DEFAULT 0,
    notes TEXT DEFAULT '',
    closed_by TEXT DEFAULT 'Administrador Olimpo',
    closed_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// =========================================================================
// 2. MIGRACIONES SEGURAS PARA BASES DE DATOS EXISTENTES
// =========================================================================
function ensureSchemaMigrations() {
  const memberCols = db.prepare('PRAGMA table_info(members)').all().map((c) => c.name);
  if (!memberCols.includes('phone')) db.exec(`ALTER TABLE members ADD COLUMN phone TEXT DEFAULT ''`);
  if (!memberCols.includes('plan_id')) db.exec(`ALTER TABLE members ADD COLUMN plan_id TEXT DEFAULT 'mensual'`);
  if (!memberCols.includes('start_date')) db.exec(`ALTER TABLE members ADD COLUMN start_date DATE`);
  if (!memberCols.includes('expire_date')) db.exec(`ALTER TABLE members ADD COLUMN expire_date DATE`);
  if (!memberCols.includes('pin_code')) db.exec(`ALTER TABLE members ADD COLUMN pin_code TEXT`);
  if (!memberCols.includes('rfid_uid')) db.exec(`ALTER TABLE members ADD COLUMN rfid_uid TEXT`);
  if (!memberCols.includes('createdAt')) db.exec(`ALTER TABLE members ADD COLUMN createdAt DATETIME`);
  if (!memberCols.includes('updatedAt')) db.exec(`ALTER TABLE members ADD COLUMN updatedAt DATETIME`);
  if (!memberCols.includes('days')) db.exec(`ALTER TABLE members ADD COLUMN days INTEGER DEFAULT 30`);
  if (!memberCols.includes('days_remaining')) db.exec(`ALTER TABLE members ADD COLUMN days_remaining INTEGER DEFAULT 30`);
  if (!memberCols.includes('isInside')) db.exec(`ALTER TABLE members ADD COLUMN isInside INTEGER DEFAULT 0`);
  if (!memberCols.includes('is_inside')) db.exec(`ALTER TABLE members ADD COLUMN is_inside INTEGER DEFAULT 0`);
  if (!memberCols.includes('timeIn')) db.exec(`ALTER TABLE members ADD COLUMN timeIn TEXT`);
  if (!memberCols.includes('time_in')) db.exec(`ALTER TABLE members ADD COLUMN time_in TEXT`);

  const salesCols = db.prepare('PRAGMA table_info(store_sales)').all().map((c) => c.name);
  if (!salesCols.includes('product_id')) db.exec(`ALTER TABLE store_sales ADD COLUMN product_id TEXT`);
  if (!salesCols.includes('quantity')) db.exec(`ALTER TABLE store_sales ADD COLUMN quantity INTEGER DEFAULT 1`);
  if (!salesCols.includes('unit_price')) db.exec(`ALTER TABLE store_sales ADD COLUMN unit_price INTEGER DEFAULT 0`);
  if (!salesCols.includes('total_price')) db.exec(`ALTER TABLE store_sales ADD COLUMN total_price INTEGER DEFAULT 0`);

  const metricsCols = db.prepare('PRAGMA table_info(daily_metrics)').all().map((c) => c.name);
  if (!metricsCols.includes('today_entries')) db.exec(`ALTER TABLE daily_metrics ADD COLUMN today_entries INTEGER DEFAULT 0`);
  if (!metricsCols.includes('total_entries')) db.exec(`ALTER TABLE daily_metrics ADD COLUMN total_entries INTEGER DEFAULT 0`);
  if (!metricsCols.includes('today_cash')) db.exec(`ALTER TABLE daily_metrics ADD COLUMN today_cash INTEGER DEFAULT 0`);
  if (!metricsCols.includes('memberships_cash')) db.exec(`ALTER TABLE daily_metrics ADD COLUMN memberships_cash INTEGER DEFAULT 0`);
  if (!metricsCols.includes('visits_cash')) db.exec(`ALTER TABLE daily_metrics ADD COLUMN visits_cash INTEGER DEFAULT 0`);
  if (!metricsCols.includes('store_cash')) db.exec(`ALTER TABLE daily_metrics ADD COLUMN store_cash INTEGER DEFAULT 0`);
}
ensureSchemaMigrations();

// Índices para búsqueda sub-milisegundo en torniquetes y teclados (creados después de asegurar columnas)
db.exec(`
  CREATE INDEX IF NOT EXISTS idx_members_pin ON members(pin_code);
  CREATE INDEX IF NOT EXISTS idx_members_rfid ON members(rfid_uid);
  CREATE INDEX IF NOT EXISTS idx_access_logs_time ON access_logs(timestamp);
  CREATE INDEX IF NOT EXISTS idx_store_sales_time ON store_sales(timestamp);
  CREATE INDEX IF NOT EXISTS idx_member_payments_time ON member_payments(timestamp);
`);

// =========================================================================
// 3. UTILIDADES DE FECHA, MONEDA Y FORMATO
// =========================================================================
function getTodayDate() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function addDaysToDate(baseDateStr, daysToAdd) {
  let date;
  if (baseDateStr instanceof Date) {
    date = new Date(baseDateStr.getTime());
  } else if (baseDateStr) {
    const cleanStr = String(baseDateStr).trim();
    const parts = cleanStr.split(/[-T\s]/);
    if (parts.length >= 3 && !isNaN(parseInt(parts[0], 10)) && !isNaN(parseInt(parts[1], 10)) && !isNaN(parseInt(parts[2], 10))) {
      date = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    } else {
      date = new Date(cleanStr);
    }
  } else {
    date = new Date();
  }
  if (isNaN(date.getTime())) return getTodayDate();
  const numDays = parseInt(daysToAdd, 10);
  date.setDate(date.getDate() + (isNaN(numDays) ? 0 : numDays));
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function calculateDaysDifference(targetDateStr) {
  if (!targetDateStr) return 0;
  let target;
  if (targetDateStr instanceof Date) {
    target = new Date(targetDateStr.getTime());
  } else {
    const cleanStr = String(targetDateStr).trim();
    const parts = cleanStr.split(/[-T\s]/);
    if (parts.length >= 3 && !isNaN(parseInt(parts[0], 10)) && !isNaN(parseInt(parts[1], 10)) && !isNaN(parseInt(parts[2], 10))) {
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10) - 1;
      const d = parseInt(parts[2], 10);
      target = new Date(y, m, d);
    } else {
      target = new Date(cleanStr);
    }
  }
  if (!target || isNaN(target.getTime())) return 0;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  const diffTime = target.getTime() - now.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

function parsePriceAmount(priceInput) {
  if (typeof priceInput === 'number' && !isNaN(priceInput)) {
    return Math.max(0, Math.round(priceInput));
  }
  const str = String(priceInput || '').trim();
  const dollarMatch = str.match(/\$\s*(\d+)/);
  if (dollarMatch) return parseInt(dollarMatch[1], 10) || 0;
  const allNums = str.match(/\d+/g);
  if (allNums && allNums.length > 0) return parseInt(allNums[allNums.length - 1], 10) || 0;
  return 0;
}

function formatPriceText(priceInput) {
  if (typeof priceInput === 'number') return `$${priceInput}`;
  const str = String(priceInput || '').trim();
  if (!str) return '$400';
  if (str.includes('$')) return str;
  const num = parseInt(str, 10);
  return !isNaN(num) ? `$${num}` : str;
}

function computeStatusFromDays(days) {
  const d = parseInt(days, 10);
  if (isNaN(d)) return 'active';
  return d > 3 ? 'active' : d >= 0 ? 'warning' : 'expired';
}

// =========================================================================
// 4. SEMILLAS INICIALES (PLANS, PRODUCTS, SETTINGS, MEMBERS)
// =========================================================================
const planCount = db.prepare('SELECT COUNT(*) as total FROM plans').get();
if (planCount.total === 0) {
  const insertPlan = db.prepare(`
    INSERT INTO plans (id, name, price, duration_days, sub_title, promo_title, promo_desc, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertPlan.run('mensual', 'Membresía Olimpo', 400, 30, 'Pase Total 30 días', 'MEMBRESÍA ZEUS OLIMPO — $400 MXN', 'Acceso total durante 30 días para forjar fuerza legendaria en el Templo de Zeus.', 1);
  insertPlan.run('duo', 'Promo Dúo Titanes 2 X $700 MXN', 700, 30, '¡Ahorro Divino de $100 MXN!', 'PROMO DÚO TITANES 2 X $700 MXN', 'Entrena en el Templo de Zeus. ¡Disciplina y poder divino!', 2);
  insertPlan.run('quincena', 'Quincena Celestial', 250, 15, '15 días de poder divino', 'QUINCENA CELESTIAL — $250 MXN', '15 días intensos de entrenamiento con el poder del trueno en ZEUS GYM.', 3);
  insertPlan.run('visita', 'Pase Diario Zeus', 60, 1, 'Pase individual olímpico', 'PASE DIARIO ZEUS — $60 MXN', 'Pase individual de acceso completo por un día. ¡Despierta al titán que llevas dentro!', 4);
}

const productCount = db.prepare('SELECT COUNT(*) as total FROM products').get();
if (productCount.total === 0) {
  const insertProd = db.prepare(`
    INSERT INTO products (id, name, category, price, stock, icon, color)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  insertProd.run('p1', 'Agua Glaciar Olimpo 1L', 'Hidratación', 20, 24, 'fa-bottle-water', 'blue');
  insertProd.run('p2', 'Pre-Entreno Rayo de Zeus', 'Fórmula Divina', 35, 18, 'fa-bolt', 'amber');
  insertProd.run('p3', 'Proteína Néctar Divino', 'Néctar de Dioses', 30, 15, 'fa-jar', 'cyan');
  insertProd.run('p4', 'Electrolitos Ambrosía', 'Elixir Olímpico', 15, 20, 'fa-wine-bottle', 'purple');
  insertProd.run('p5', 'Toalla Oficial ZEUS GYM', 'Indumentaria Olímpica', 100, 8, 'fa-rug', 'indigo');
  insertProd.run('p6', 'Candado Titán', 'Seguridad Égida', 50, 6, 'fa-lock', 'amber');
}

const tvSettingsCount = db.prepare('SELECT COUNT(*) as total FROM tv_settings').get();
if (tvSettingsCount.total === 0) {
  const insertSetting = db.prepare(`INSERT INTO tv_settings (key, value) VALUES (?, ?)`);
  insertSetting.run('musicTitle', 'SONIDOS DEL OLIMPO // WORKOUT SESSIONS');
  insertSetting.run('promoBadge', 'DECRETO DEL OLIMPO');
  insertSetting.run('promoTitle', 'PROMO DÚO TITANES 2 X $700 MXN');
  insertSetting.run('promoDesc', 'Entrena en el Templo de Zeus. ¡Disciplina y poder divino!');
  insertSetting.run('tariffsHeader', 'TARIFAS OFICIALES DEL TEMPLO DE ZEUS');
  insertSetting.run('sensorTitle', 'Presenta tu huella o PIN para entrar al Olimpo');
  insertSetting.run('sensorSub', 'El oráculo validará tu vigencia al instante');
  insertSetting.run('sensorBtn', 'PIN O HUELLA');
  insertSetting.run('card1Title', 'NÉCTAR Y SUPLEMENTOS EN RECEPCIÓN');
  insertSetting.run('card1Desc', 'Pregunta por tu Scoop de Rayo de Zeus, Creatina y Proteína Néctar Divino.');
  insertSetting.run('card2Title', 'CÓDIGO OLÍMPICO');
  insertSetting.run('card2Desc', 'Descarga tus barras al terminar y porta tu toalla. ¡Honor en el Templo de Zeus!');
  insertSetting.run('footerTicker', 'Membresía Olimpo $400 | Promo Dúo Titanes 2x$700 | Quincena Celestial $250 | Pase Diario Zeus $60 | ZEUS GYM');
  insertSetting.run('bgImage', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1400&q=80');
}

const memberCount = db.prepare('SELECT COUNT(*) as total FROM members').get();
if (memberCount.total === 0) {
  const today = getTodayDate();
  const insertMember = db.prepare(`
    INSERT INTO members (
      id, name, phone, photo, plan, plan_id, price, status,
      days, days_remaining, start_date, expire_date, pin_code, rfid_uid,
      isInside, is_inside, timeIn, time_in
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertMember.run('042', 'Carlos Mendoza', '5512345678', 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=150&q=80', 'Membresía Olimpo', 'mensual', '$400', 'active', 18, 18, addDaysToDate(today, -12), addDaysToDate(today, 18), '042', 'E042A1', 1, 1, '10:15 AM', '10:15 AM');
  insertMember.run('088', 'Ana Gómez', '5587654321', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80', 'Membresía Olimpo', 'mensual', '$400', 'active', 22, 22, addDaysToDate(today, -8), addDaysToDate(today, 22), '088', 'E088B2', 1, 1, '11:30 AM', '11:30 AM');
  insertMember.run('019', 'Sofía Ramírez', '5544332211', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', 'Quincena Celestial', 'quincena', '$250', 'warning', 1, 1, addDaysToDate(today, -14), addDaysToDate(today, 1), '019', 'E019C3', 1, 1, '12:05 PM', '12:05 PM');
  insertMember.run('012', 'Jorge Vargas', '5599887766', 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80', 'Membresía Olimpo', 'mensual', '$400', 'expired', -4, -4, addDaysToDate(today, -34), addDaysToDate(today, -4), '012', 'E012D4', 0, 0, null, null);
}

// Rutina de sanitización / migración automática para bases de datos preexistentes
function upgradeExistingZeusLore() {
  try {
    db.transaction(() => {
      // 1. Actualizar Planes
      db.prepare(`
        UPDATE plans SET
          name = CASE id
            WHEN 'mensual' THEN 'Membresía Olimpo'
            WHEN 'duo' THEN 'Promo Dúo Titanes 2 X $700 MXN'
            WHEN 'quincena' THEN 'Quincena Celestial'
            WHEN 'visita' THEN 'Pase Diario Zeus'
            ELSE name END,
          sub_title = CASE id
            WHEN 'mensual' THEN 'Pase Total 30 días'
            WHEN 'duo' THEN '¡Ahorro Divino de $100 MXN!'
            WHEN 'quincena' THEN '15 días de poder divino'
            WHEN 'visita' THEN 'Pase individual olímpico'
            ELSE sub_title END,
          promo_title = CASE id
            WHEN 'mensual' THEN 'MEMBRESÍA ZEUS OLIMPO — $400 MXN'
            WHEN 'duo' THEN 'PROMO DÚO TITANES 2 X $700 MXN'
            WHEN 'quincena' THEN 'QUINCENA CELESTIAL — $250 MXN'
            WHEN 'visita' THEN 'PASE DIARIO ZEUS — $60 MXN'
            ELSE promo_title END,
          promo_desc = CASE id
            WHEN 'mensual' THEN 'Acceso total durante 30 días para forjar fuerza legendaria en el Templo de Zeus.'
            WHEN 'duo' THEN 'Entrena en el Templo de Zeus. ¡Disciplina y poder divino!'
            WHEN 'quincena' THEN '15 días intensos de entrenamiento con el poder del trueno en ZEUS GYM.'
            WHEN 'visita' THEN 'Pase individual de acceso completo por un día. ¡Despierta al titán que llevas dentro!'
            ELSE promo_desc END
        WHERE promo_title LIKE '%GEARS%' OR promo_title LIKE '%GUERRERO%' OR name LIKE '%Guerreros%' OR promo_desc LIKE '%batalla%'
      `).run();

      // 2. Actualizar Productos
      db.prepare(`
        UPDATE products SET
          name = CASE id
            WHEN 'p1' THEN 'Agua Glaciar Olimpo 1L'
            WHEN 'p2' THEN 'Pre-Entreno Rayo de Zeus'
            WHEN 'p3' THEN 'Proteína Néctar Divino'
            WHEN 'p4' THEN 'Electrolitos Ambrosía'
            WHEN 'p5' THEN 'Toalla Oficial ZEUS GYM'
            WHEN 'p6' THEN 'Candado Titán'
            ELSE name END,
          category = CASE id
            WHEN 'p1' THEN 'Hidratación'
            WHEN 'p2' THEN 'Fórmula Divina'
            WHEN 'p3' THEN 'Néctar de Dioses'
            WHEN 'p4' THEN 'Elixir Olímpico'
            WHEN 'p5' THEN 'Indumentaria Olímpica'
            WHEN 'p6' THEN 'Seguridad Égida'
            ELSE category END
        WHERE name LIKE '%GEARS%' OR name LIKE '%Hype%' OR name LIKE '%Lock%'
      `).run();

      // 3. Actualizar Ajustes de TV
      const tvFixes = [
        ['musicTitle', 'SONIDOS DEL OLIMPO // WORKOUT SESSIONS'],
        ['promoBadge', 'DECRETO DEL OLIMPO'],
        ['promoTitle', 'PROMO DÚO TITANES 2 X $700 MXN'],
        ['promoDesc', 'Entrena en el Templo de Zeus. ¡Disciplina y poder divino!'],
        ['tariffsHeader', 'TARIFAS OFICIALES DEL TEMPLO DE ZEUS'],
        ['sensorTitle', 'Presenta tu huella o PIN para entrar al Olimpo'],
        ['sensorSub', 'El oráculo validará tu vigencia al instante'],
        ['card1Title', 'NÉCTAR Y SUPLEMENTOS EN RECEPCIÓN'],
        ['card1Desc', 'Pregunta por tu Scoop de Rayo de Zeus, Creatina y Proteína Néctar Divino.'],
        ['card2Title', 'CÓDIGO OLÍMPICO'],
        ['card2Desc', 'Descarga tus barras al terminar y porta tu toalla. ¡Honor en el Templo de Zeus!'],
        ['footerTicker', 'Membresía Olimpo $400 | Promo Dúo Titanes 2x$700 | Quincena Celestial $250 | Pase Diario Zeus $60 | ZEUS GYM']
      ];
      const updateSettingStmt = db.prepare(`
        UPDATE tv_settings SET value = ?
        WHERE key = ? AND (value LIKE '%GEARS%' OR value LIKE '%LEGIÓN%' OR value LIKE '%escuadrón%' OR value LIKE '%piedad%' OR value LIKE '%Guerreros%')
      `);
      for (const [k, v] of tvFixes) {
        updateSettingStmt.run(v, k);
      }

      // 4. Actualizar cash_cuts con Comandante
      db.prepare(`UPDATE cash_cuts SET closed_by = 'Administrador Olimpo' WHERE closed_by = 'Comandante'`).run();
    })();
  } catch (err) {
    console.warn('⚠️ [ZEUS MIGRACIÓN] Error al sincronizar registros preexistentes:', err.message);
  }
}
upgradeExistingZeusLore();

// =========================================================================
// 5. NORMALIZADORES Y MÉTODOS DE CONSULTA
// =========================================================================
function normalizeMetricsRow(row) {
  if (!row) return null;
  const memberships_cash = row.memberships_cash ?? row.cash_memberships ?? 0;
  const visits_cash = row.visits_cash ?? row.cash_visits ?? 0;
  const store_cash = row.store_cash ?? row.cash_store ?? 0;
  const today_cash = row.today_cash ?? (memberships_cash + visits_cash + store_cash);
  const today_entries = row.today_entries ?? row.total_entries ?? 0;

  return {
    date: row.date,
    today_cash,
    memberships_cash,
    visits_cash,
    store_cash,
    today_entries,
    total_entries: today_entries,
    cash_memberships: memberships_cash,
    cash_visits: visits_cash,
    cash_store: store_cash
  };
}

function ensureTodayMetrics(defaultEntries = 42, targetDate = null) {
  const dateKey = targetDate || getTodayDate();
  db.prepare(`
    INSERT OR IGNORE INTO daily_metrics (
      date, today_entries, total_entries,
      today_cash, memberships_cash, visits_cash, store_cash,
      cash_memberships, cash_visits, cash_store
    )
    VALUES (?, ?, ?, 1420, 1150, 180, 90, 1150, 180, 90)
  `).run(dateKey, defaultEntries, defaultEntries);

  const row = db.prepare('SELECT * FROM daily_metrics WHERE date = ?').get(dateKey);
  return normalizeMetricsRow(row);
}

function getTodayMetrics() {
  return ensureTodayMetrics();
}

function incrementEntries(delta = 1) {
  const today = getTodayDate();
  ensureTodayMetrics();
  db.prepare(`
    UPDATE daily_metrics
    SET today_entries = MAX(0, today_entries + ?),
        total_entries = MAX(0, total_entries + ?)
    WHERE date = ?
  `).run(delta, delta, today);
  return getTodayMetrics();
}

function setTodayCounter(val) {
  const today = getTodayDate();
  ensureTodayMetrics();
  const parsed = Math.max(0, parseInt(val, 10) || 0);
  db.prepare(`
    UPDATE daily_metrics
    SET today_entries = ?,
        total_entries = ?
    WHERE date = ?
  `).run(parsed, parsed, today);
  return getTodayMetrics();
}

function normalizeMemberRow(row) {
  if (!row) return null;
  
  // Cálculo de días restantes en tiempo real basado en expire_date si existe
  let calculatedDays = row.days !== undefined && row.days !== null ? row.days : (row.days_remaining ?? 0);
  if (row.expire_date) {
    calculatedDays = calculateDaysDifference(row.expire_date);
  }

  const insideVal = row.isInside !== undefined && row.isInside !== null ? row.isInside : (row.is_inside ?? 0);
  const timeInVal = row.timeIn !== undefined ? row.timeIn : row.time_in;
  const numericPrice = parsePriceAmount(row.price);
  const formattedPrice = formatPriceText(row.price);
  const computedStatus = row.expire_date ? computeStatusFromDays(calculatedDays) : (row.status || computeStatusFromDays(calculatedDays));

  return {
    id: String(row.id),
    name: row.name,
    phone: row.phone || '',
    photo: row.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
    plan: row.plan || 'Mensual',
    plan_id: row.plan_id || 'mensual',
    price: formattedPrice,
    rawPrice: numericPrice,
    status: computedStatus,
    days: calculatedDays,
    days_remaining: calculatedDays,
    start_date: row.start_date || null,
    expire_date: row.expire_date || null,
    pin_code: row.pin_code || row.id,
    rfid_uid: row.rfid_uid || null,
    isInside: Boolean(insideVal),
    is_inside: insideVal ? 1 : 0,
    timeIn: timeInVal || null,
    updatedAt: row.updatedAt || null
  };
}

function getAllMembers() {
  return db
    .prepare('SELECT * FROM members ORDER BY updatedAt DESC, id ASC')
    .all()
    .map(normalizeMemberRow);
}

function getMemberById(id) {
  if (id === undefined || id === null) return null;
  const raw = String(id).trim();
  if (!raw) return null;

  let row = db.prepare('SELECT * FROM members WHERE id = ?').get(raw);
  if (row) return normalizeMemberRow(row);

  const padded3 = raw.padStart(3, '0');
  const padded4 = raw.padStart(4, '0');
  const stripped = raw.replace(/^0+/, '') || '0';

  row = db
    .prepare(`
      SELECT * FROM members
      WHERE id = ? OR id = ? OR id = ? OR LTRIM(id, '0') = ?
      LIMIT 1
    `)
    .get(padded3, padded4, stripped, stripped);

  return normalizeMemberRow(row);
}

function getMemberByCredential(credential) {
  if (!credential) return null;
  const query = String(credential).trim();
  
  // 1. Probar por ID (exacto o flexible)
  let member = getMemberById(query);
  if (member) return member;

  // 2. Probar por PIN
  let row = db.prepare('SELECT * FROM members WHERE pin_code = ? LIMIT 1').get(query);
  if (row) return normalizeMemberRow(row);

  // 3. Probar por UID de RFID
  row = db.prepare('SELECT * FROM members WHERE rfid_uid = ? LIMIT 1').get(query);
  if (row) return normalizeMemberRow(row);

  return null;
}

function generateNextFolio() {
  const rows = db.prepare('SELECT id FROM members').all();
  let maxNum = 88;
  for (const r of rows) {
    const n = parseInt(String(r.id).replace(/\D/g, ''), 10);
    if (!isNaN(n) && n > maxNum) maxNum = n;
  }
  let candidate = maxNum + 1;
  while (db.prepare('SELECT 1 FROM members WHERE id = ?').get(String(candidate).padStart(3, '0'))) {
    candidate++;
  }
  return String(candidate).padStart(3, '0');
}

// =========================================================================
// 6. OPERACIONES TRANSACCIONALES DE SOCIOS Y PAGOS
// =========================================================================
function createMember({ id, name, phone = '', photo, plan = 'Mensualidad', price = '$400', days = 30, pin_code, rfid_uid } = {}) {
  const today = getTodayDate();
  ensureTodayMetrics();

  const memberId = id && String(id).trim() !== '' ? String(id).trim() : generateNextFolio();
  const parsedDays = days !== undefined && days !== null ? parseInt(days, 10) : 30;
  const finalDays = isNaN(parsedDays) ? 30 : parsedDays;
  const status = computeStatusFromDays(finalDays);
  const priceText = formatPriceText(price);
  const numericPrice = parsePriceAmount(price);
  const expireDate = addDaysToDate(today, finalDays);
  const pin = pin_code || memberId;
  const defaultPhoto = photo && String(photo).trim() !== '' ? photo : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80';
  const nowTime = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });

  const memberName = (name && String(name).trim()) ? String(name).trim() : 'Nuevo Atleta Olímpico';
  const planName = (plan && String(plan).trim()) ? String(plan).trim() : 'Membresía Olimpo';

  const tx = db.transaction(() => {
    db.prepare(`
      INSERT OR REPLACE INTO members (
        id, name, phone, photo, plan, price, status,
        days, days_remaining, start_date, expire_date, pin_code, rfid_uid,
        isInside, is_inside, timeIn, time_in, updatedAt
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 1, ?, ?, CURRENT_TIMESTAMP)
    `).run(
      memberId,
      memberName,
      String(phone || '').trim(),
      defaultPhoto,
      planName,
      priceText,
      status,
      finalDays,
      finalDays,
      today,
      expireDate,
      pin,
      rfid_uid || null,
      nowTime,
      nowTime
    );

    // Registro en auditoría de pagos (seguro contra NULL en member_name)
    db.prepare(`
      INSERT INTO member_payments (member_id, member_name, plan_name, amount, payment_type)
      VALUES (?, ?, ?, ?, 'NEW')
    `).run(memberId, memberName, planName, numericPrice);

    // Impactar caja del día
    if (numericPrice > 0) {
      db.prepare(`
        UPDATE daily_metrics
        SET today_cash = today_cash + ?,
            memberships_cash = memberships_cash + ?,
            cash_memberships = cash_memberships + ?
        WHERE date = ?
      `).run(numericPrice, numericPrice, numericPrice, today);
    }
  });

  tx();
  return getMemberById(memberId);
}

function renewMember(idOrObj, plan = 'Mensualidad', price = '$400', extraDays = 30) {
  let id = idOrObj;
  if (typeof idOrObj === 'object' && idOrObj !== null) {
    id = idOrObj.id;
    plan = idOrObj.plan || plan;
    price = idOrObj.price !== undefined ? idOrObj.price : price;
    extraDays = idOrObj.extraDays ?? idOrObj.days ?? extraDays;
  }

  const memberId = String(id || '').trim();
  const existing = getMemberById(memberId);
  if (!existing) throw new Error('Socio no encontrado para renovar');

  const today = getTodayDate();
  ensureTodayMetrics();

  const addDays = parseInt(extraDays, 10) || 30;
  const priceText = formatPriceText(price);
  const numericPrice = parsePriceAmount(price);

  // Si la membresía actual no ha vencido, extendemos a partir de expire_date; si ya venció, desde hoy
  const baseExpire = existing.days > 0 && existing.expire_date ? existing.expire_date : today;
  const newExpireDate = addDaysToDate(baseExpire, addDays);
  const newTotalDays = calculateDaysDifference(newExpireDate);

  const tx = db.transaction(() => {
    db.prepare(`
      UPDATE members
      SET days = ?,
          days_remaining = ?,
          expire_date = ?,
          status = 'active',
          plan = ?,
          price = ?,
          updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(newTotalDays, newTotalDays, newExpireDate, String(plan || 'Mensualidad').trim(), priceText, memberId);

    // Auditoría de pago (seguro contra valores vacíos)
    const memberName = existing.name || 'Atleta';
    const planName = String(plan || existing.plan || 'Membresía Olimpo').trim();
    db.prepare(`
      INSERT INTO member_payments (member_id, member_name, plan_name, amount, payment_type)
      VALUES (?, ?, ?, ?, 'RENEWAL')
    `).run(memberId, memberName, planName, numericPrice);

    if (numericPrice > 0) {
      db.prepare(`
        UPDATE daily_metrics
        SET today_cash = today_cash + ?,
            memberships_cash = memberships_cash + ?,
            cash_memberships = cash_memberships + ?
        WHERE date = ?
      `).run(numericPrice, numericPrice, numericPrice, today);
    }
  });

  tx();
  return getMemberById(memberId);
}

function updateMember(id, data = {}) {
  const memberId = String(id || data.id || '').trim();
  const existing = getMemberById(memberId);
  if (!existing) return null;

  const nextName = data.name !== undefined ? String(data.name).trim() : existing.name;
  const nextPhone = data.phone !== undefined ? String(data.phone).trim() : existing.phone;
  const nextPhoto = data.photo !== undefined ? data.photo : existing.photo;
  const nextPlan = data.plan !== undefined ? String(data.plan).trim() : existing.plan;
  const nextPrice = data.price !== undefined ? formatPriceText(data.price) : existing.price;
  const nextDays = data.days !== undefined ? parseInt(data.days, 10) : existing.days;
  const finalDays = isNaN(nextDays) ? existing.days : nextDays;
  const nextStatus = data.status || computeStatusFromDays(finalDays);
  const nextInside = data.isInside !== undefined ? (data.isInside ? 1 : 0) : (existing.isInside ? 1 : 0);
  const nextPin = data.pin_code !== undefined ? String(data.pin_code).trim() : existing.pin_code;
  const nextRfid = data.rfid_uid !== undefined ? String(data.rfid_uid).trim() : existing.rfid_uid;
  const nextExpire = data.expire_date || addDaysToDate(getTodayDate(), finalDays);
  const nextTimeIn =
    data.timeIn !== undefined
      ? data.timeIn
      : nextInside && !existing.isInside
        ? new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
        : existing.timeIn;

  db.prepare(`
    UPDATE members
    SET name = ?,
        phone = ?,
        photo = ?,
        plan = ?,
        price = ?,
        status = ?,
        days = ?,
        days_remaining = ?,
        expire_date = ?,
        pin_code = ?,
        rfid_uid = ?,
        isInside = ?,
        is_inside = ?,
        timeIn = ?,
        time_in = ?,
        updatedAt = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(
    nextName,
    nextPhone,
    nextPhoto,
    nextPlan,
    nextPrice,
    nextStatus,
    finalDays,
    finalDays,
    nextExpire,
    nextPin,
    nextRfid,
    nextInside,
    nextInside,
    nextTimeIn,
    nextTimeIn,
    memberId
  );

  return getMemberById(memberId);
}

function deleteMember(id) {
  const memberId = String(id || '').trim();
  const info = db.prepare('DELETE FROM members WHERE id = ?').run(memberId);
  return info.changes > 0;
}

// =========================================================================
// 7. OPERACIONES DE NÉCTAR Y SUPLEMENTOS (PRODUCTOS, STOCK Y VENTAS TRANSACCIONALES)
// =========================================================================
function getAllProducts() {
  return db.prepare('SELECT * FROM products WHERE active = 1 ORDER BY id ASC').all();
}

function getProductById(id) {
  return db.prepare('SELECT * FROM products WHERE id = ?').get(id);
}

function saveProduct({ id, name, category = 'General', price = 20, stock = 0, icon = 'fa-bottle-water', color = 'blue' }) {
  const prodId = id || 'p' + Date.now();
  const numPrice = parsePriceAmount(price);
  const numStock = Math.max(0, parseInt(stock, 10) || 0);

  db.prepare(`
    INSERT OR REPLACE INTO products (id, name, category, price, stock, icon, color, active, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP)
  `).run(prodId, String(name).trim(), category, numPrice, numStock, icon, color);

  return getProductById(prodId);
}

function addProductStock(id, amount = 1) {
  const delta = parseInt(amount, 10) || 1;
  db.prepare(`
    UPDATE products
    SET stock = MAX(0, stock + ?),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(delta, id);
  return getProductById(id);
}

function restockAllProducts(amount = 5) {
  const delta = parseInt(amount, 10) || 5;
  db.prepare(`
    UPDATE products
    SET stock = stock + ?,
        updated_at = CURRENT_TIMESTAMP
    WHERE active = 1
  `).run(delta);
  return getAllProducts();
}

function recordStoreSale(itemIdOrObj, itemName, price, quantity = 1) {
  let itemId = itemIdOrObj;
  let qty = quantity;
  if (typeof itemIdOrObj === 'object' && itemIdOrObj !== null) {
    itemId = itemIdOrObj.productId || itemIdOrObj.itemId || itemIdOrObj.id || 'item';
    itemName = itemIdOrObj.name || itemIdOrObj.itemName || 'Néctar y Suplemento Olimpo';
    price = itemIdOrObj.price;
    qty = itemIdOrObj.quantity || 1;
  }

  const today = getTodayDate();
  ensureTodayMetrics();

  const numericPrice = parsePriceAmount(price);
  const totalAmount = numericPrice * qty;
  let insertedSale = null;

  const tx = db.transaction(() => {
    // 1. Decrementar stock en tabla products si existe el producto
    db.prepare(`
      UPDATE products
      SET stock = MAX(0, stock - ?),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(qty, String(itemId));

    // 2. Insertar ticket de venta
    const info = db.prepare(`
      INSERT INTO store_sales (product_id, item_id, item_name, quantity, unit_price, price, total_price)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(String(itemId), String(itemId), String(itemName || 'Néctar y Suplemento Olimpo'), qty, numericPrice, numericPrice, totalAmount);

    insertedSale = db.prepare('SELECT * FROM store_sales WHERE id = ?').get(info.lastInsertRowid);

    // 3. Impactar caja diaria
    db.prepare(`
      UPDATE daily_metrics
      SET today_cash = today_cash + ?,
          store_cash = store_cash + ?,
          cash_store = cash_store + ?
      WHERE date = ?
    `).run(totalAmount, totalAmount, totalAmount, today);
  });

  tx();
  return {
    sale: insertedSale,
    product: getProductById(String(itemId)),
    metrics: getTodayMetrics()
  };
}

// =========================================================================
// 8. PLANES Y CONFIGURACIÓN PERSISTENTE DE TV
// =========================================================================
function getAllPlans() {
  return db.prepare('SELECT * FROM plans WHERE active = 1 ORDER BY sort_order ASC').all();
}

function updatePlan(id, data = {}) {
  const existing = db.prepare('SELECT * FROM plans WHERE id = ?').get(id);
  if (!existing) return null;

  db.prepare(`
    UPDATE plans
    SET name = ?,
        price = ?,
        sub_title = ?,
        promo_title = ?,
        promo_desc = ?
    WHERE id = ?
  `).run(
    data.name || existing.name,
    data.price !== undefined ? parsePriceAmount(data.price) : existing.price,
    data.sub !== undefined ? data.sub : existing.sub_title,
    data.promoTitle || existing.promo_title,
    data.promoDesc || existing.promo_desc,
    id
  );
  return db.prepare('SELECT * FROM plans WHERE id = ?').get(id);
}

function getDefaultGymNotices(card2Title = 'CÓDIGO OLÍMPICO', card2Desc = 'Descarga tus barras al terminar y porta tu toalla. ¡Honor en el Templo de Zeus!') {
  return [
    {
      id: 'n1',
      badge: 'REGLA SAGRADA • HIGIENE OBLIGATORIA',
      title: 'USO OBLIGATORIO DE TOALLA',
      desc: 'Por higiene y respeto a tus compañeros atletas en el santuario, es obligatorio portar toalla personal para limpiar bancos y máquinas al terminar.',
      icon: 'fa-spray-can-sparkles',
      theme: 'amber'
    },
    {
      id: 'n2',
      badge: card2Title || 'CÓDIGO OLÍMPICO • DISCIPLINA',
      title: 'DESCARGA TUS BARRAS Y ACOMODA EL EQUIPO',
      desc: card2Desc || 'Si tuviste la fuerza para levantarlo, ten la disciplina de guardarlo. Regresa mancuernas y discos a sus soportes.',
      icon: 'fa-dumbbell',
      theme: 'blue'
    },
    {
      id: 'n3',
      badge: 'SEGURIDAD • PREVENCIÓN',
      title: 'CALZADO Y VESTIMENTA DEPORTIVA',
      desc: 'Por tu seguridad en el Templo de Zeus, está estrictamente prohibido entrenar descalzo, en sandalias o con calzado no deportivo.',
      icon: 'fa-shoe-prints',
      theme: 'cyan'
    },
    {
      id: 'n4',
      badge: 'HORARIOS OFICIALES • EL OLIMPO',
      title: 'HORARIOS DEL TEMPLO DE ZEUS',
      desc: 'Lunes a Viernes: 6:00 AM – 10:00 PM | Sábados: 7:00 AM – 2:00 PM. ¡Disciplina y poder divino en ZEUS GYM!',
      icon: 'fa-clock',
      theme: 'emerald'
    }
  ];
}

function sanitizeCorruptedText(str) {
  if (typeof str !== 'string' || !str.includes('\uFFFD')) return str;
  return str
    .replace(/LEGI\uFFFDN/gi, 'LEGIÓN')
    .replace(/RECEPCI\uFFFDN/gi, 'RECEPCIÓN')
    .replace(/PROMOCI\uFFFDN/gi, 'PROMOCIÓN')
    .replace(/C\uFFFDDIGO/gi, 'CÓDIGO')
    .replace(/D\uFFFDAS/gi, 'DÍAS')
    .replace(/D\uFFFDA/gi, 'DÍA')
    .replace(/D\uFFFDO/gi, 'DÚO')
    .replace(/M\uFFFDXIMA/gi, 'MÁXIMA')
    .replace(/AUTOM\uFFFDTICA/gi, 'AUTOMÁTICA')
    .replace(/MOSTRAR\uFFFD/gi, 'MOSTRARÁ')
    .replace(/\uFFFD/g, 'Ó');
}

function getTvConfig() {
  const rows = db.prepare('SELECT key, value FROM tv_settings').all();
  const config = {};
  const fixStmt = db.prepare('UPDATE tv_settings SET value = ? WHERE key = ?');
  for (const r of rows) {
    const cleaned = sanitizeCorruptedText(r.value);
    if (cleaned !== r.value) {
      try {
        fixStmt.run(cleaned, r.key);
      } catch (e) {}
    }
    config[r.key] = cleaned;
  }

  // Parsear gymNotices persistidos o generar valores por defecto enriquecidos
  if (config.gymNotices) {
    try {
      config.gymNotices = typeof config.gymNotices === 'string' ? JSON.parse(config.gymNotices) : config.gymNotices;
    } catch (e) {
      config.gymNotices = null;
    }
  }
  if (!Array.isArray(config.gymNotices) || config.gymNotices.length === 0) {
    config.gymNotices = getDefaultGymNotices(config.card2Title, config.card2Desc);
  }

  // Cargar tarifas dinámicamente desde la tabla plans
  const plans = getAllPlans();
  config.tariffs = plans.map((p) => {
    const formattedPrice =
      (p.id === 'duo' || p.name.includes('Titanes') || p.name.includes('2 Guerreros')) && (p.price === 700 || p.price === '700')
        ? '2x' + String.fromCharCode(36) + '700'
        : (String(p.price).includes(String.fromCharCode(36)) ? String(p.price) : String.fromCharCode(36) + p.price);
    return {
      name: p.name,
      price: formattedPrice,
      sub: p.sub_title,
      promoTitle: p.promo_title,
      promoDesc: p.promo_desc
    };
  });

  return config;
}

function saveTvConfig(newConfig = {}) {
  const updateSetting = db.prepare(`
    INSERT OR REPLACE INTO tv_settings (key, value, updated_at)
    VALUES (?, ?, CURRENT_TIMESTAMP)
  `);

  const keys = [
    'musicTitle', 'promoBadge', 'promoTitle', 'promoDesc',
    'tariffsHeader', 'sensorTitle', 'sensorSub', 'sensorBtn',
    'card1Title', 'card1Desc', 'card2Title', 'card2Desc',
    'footerTicker', 'bgImage', 'gymNotices'
  ];

  const tx = db.transaction(() => {
    for (const k of keys) {
      if (newConfig[k] !== undefined) {
        const val = typeof newConfig[k] === 'object' ? JSON.stringify(newConfig[k]) : String(newConfig[k]);
        updateSetting.run(k, val);
      }
    }

    // Sincronizar card2Title y card2Desc si se editaron avisos en gymNotices
    if (Array.isArray(newConfig.gymNotices) && newConfig.gymNotices.length > 1) {
      if (newConfig.gymNotices[1]?.badge || newConfig.gymNotices[1]?.title) {
        updateSetting.run('card2Title', String(newConfig.gymNotices[1].badge || newConfig.gymNotices[1].title));
      }
      if (newConfig.gymNotices[1]?.desc) {
        updateSetting.run('card2Desc', String(newConfig.gymNotices[1].desc));
      }
    }

    // Actualizar tarifas en plans si vienen en la carga útil
    if (Array.isArray(newConfig.tariffs)) {
      const planIds = ['mensual', 'duo', 'quincena', 'visita'];
      newConfig.tariffs.forEach((t, i) => {
        const id = planIds[i];
        if (id) {
          updatePlan(id, t);
        }
      });
    }
  });

  tx();
  return getTvConfig();
}

// =========================================================================
// 9. CORTE DE CAJA, ACCESOS Y CIERRES
// =========================================================================
function logAccess({ memberId = null, memberName = 'Atleta', action = 'ENTRY', channel = 1, status = 'GRANTED' }) {
  const stmt = db.prepare(`
    INSERT INTO access_logs (member_id, member_name, action, channel, status)
    VALUES (?, ?, ?, ?, ?)
  `);
  const info = stmt.run(memberId, memberName, action, channel, status);
  return db.prepare('SELECT * FROM access_logs WHERE id = ?').get(info.lastInsertRowid);
}

function recordQuickVisit(visitPrice = 60, channel = 1) {
  const today = getTodayDate();
  const amount = parsePriceAmount(visitPrice) || 60;
  ensureTodayMetrics();

  const tx = db.transaction(() => {
    db.prepare(`
      UPDATE daily_metrics
      SET today_entries = today_entries + 1,
          total_entries = total_entries + 1,
          today_cash = today_cash + ?,
          visits_cash = visits_cash + ?,
          cash_visits = cash_visits + ?
      WHERE date = ?
    `).run(amount, amount, amount, today);

    logAccess({
      memberId: 'VISIT',
      memberName: 'Pase de Visita',
      action: 'QUICK_VISIT',
      channel,
      status: 'GRANTED'
    });

    db.prepare(`
      INSERT INTO member_payments (member_id, member_name, plan_name, amount, payment_type)
      VALUES ('VISIT', 'Pase de Visita', 'Visita del Día', ?, 'VISIT')
    `).run(amount);
  });

  tx();
  return getTodayMetrics();
}

function getDailyCutSummary(date = null) {
  const targetDate = date || getTodayDate();
  const metrics = ensureTodayMetrics(42, targetDate);

  const salesToday = db.prepare(`
    SELECT * FROM store_sales
    WHERE date(timestamp) = date(?)
    ORDER BY id DESC
    LIMIT 30
  `).all(targetDate);

  const paymentsToday = db.prepare(`
    SELECT * FROM member_payments
    WHERE date(timestamp) = date(?)
    ORDER BY id DESC
    LIMIT 30
  `).all(targetDate);

  const recentLogs = db.prepare('SELECT * FROM access_logs ORDER BY id DESC LIMIT 20').all();

  return {
    date: targetDate,
    expected_cash: metrics.today_cash,
    today_cash: metrics.today_cash,
    memberships_cash: metrics.memberships_cash,
    visits_cash: metrics.visits_cash,
    store_cash: metrics.store_cash,
    today_entries: metrics.today_entries,
    total_entries: metrics.today_entries,
    cash_memberships: metrics.memberships_cash,
    cash_visits: metrics.visits_cash,
    cash_store: metrics.store_cash,
    sales: salesToday,
    store_sales: salesToday,
    payments: paymentsToday,
    recent_logs: recentLogs
  };
}

function registerCashCut({ date = null, counted_cash = 0, notes = '', closed_by = 'Administrador Olimpo' }) {
  const targetDate = date || getTodayDate();
  const summary = getDailyCutSummary(targetDate);
  const counted = parseInt(counted_cash, 10) || 0;
  const difference = counted - summary.today_cash;

  const info = db.prepare(`
    INSERT INTO cash_cuts (
      date, expected_cash, counted_cash, difference,
      memberships_cash, visits_cash, store_cash, today_entries,
      notes, closed_by
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    targetDate,
    summary.today_cash,
    counted,
    difference,
    summary.memberships_cash,
    summary.visits_cash,
    summary.store_cash,
    summary.today_entries,
    String(notes || '').trim(),
    String(closed_by || 'Administrador Olimpo')
  );

  return db.prepare('SELECT * FROM cash_cuts WHERE id = ?').get(info.lastInsertRowid);
}

function getRecentLogs(limit = 50) {
  return db.prepare('SELECT * FROM access_logs ORDER BY id DESC LIMIT ?').all(limit);
}

ensureTodayMetrics();

module.exports = Object.assign(db, {
  parsePriceAmount,
  formatPriceText,
  getTodayDate,
  addDaysToDate,
  calculateDaysDifference,
  ensureTodayMetrics,
  getTodayMetrics,
  incrementEntries,
  setTodayCounter,
  logAccess,
  recordQuickVisit,
  getAllMembers,
  getMemberById,
  getMemberByCredential,
  createMember,
  renewMember,
  updateMember,
  deleteMember,
  getAllProducts,
  getProductById,
  saveProduct,
  addProductStock,
  restockAllProducts,
  recordStoreSale,
  getAllPlans,
  updatePlan,
  getTvConfig,
  saveTvConfig,
  getDailyCutSummary,
  registerCashCut,
  getRecentLogs
});
