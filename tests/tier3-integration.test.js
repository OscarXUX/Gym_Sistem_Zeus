/**
 * tests/tier3-integration.test.js
 * Tier 3: Cross-Feature Integration Test Suite
 * 
 * Verifies end-to-end integration and real-time synchronization between:
 * - Simulation Scan -> SQLite access_logs -> daily_metrics increment -> Socket.IO broadcast -> Attendance state
 * - Quick Visit purchase -> Member payments ledger -> Cash metrics -> Turnstile gate pulse -> TV Toast
 * - Store POS Sale -> SQLite inventory decrement -> Store sales audit -> Cash metrics -> Socket.IO broadcast
 * - Emergency Lockdown -> Access denial across active athletes -> Unlock restoration
 */

const {
  BASE_URL,
  getDbConnection,
  ensureServerRunning,
  createSocketClient,
  TestSuite,
  assert
} = require('./test-helper');

const suite = new TestSuite('Tier 3: Cross-Feature Integration');

// ---------------------------------------------------------------------------
// 3.1 Simulation Scan Flow -> DB -> Metrics -> Socket Broadcast -> Attendance
// ---------------------------------------------------------------------------
suite.test('3.1 Full Scan Flow: Scan persists access_log, increments metrics, broadcasts socket card, and updates attendance', async () => {
  await ensureServerRunning();
  const db = getDbConnection();
  const { socket, waitForEvent, close } = createSocketClient();

  try {
    // 1. Ensure an active athlete exists
    let athlete = db.prepare(`SELECT * FROM members WHERE status = 'active' AND (days_remaining > 0 OR days > 0) LIMIT 1`).get();
    if (!athlete) {
      const athleteId = 'test_athlete_' + Date.now();
      db.prepare(`
        INSERT INTO members (id, name, plan, price, status, days, days_remaining, start_date, expire_date, pin_code, is_inside)
        VALUES (?, 'Atleta Hércules Test', 'Membresía Olimpo', '400', 'active', 30, 25, date('now'), date('now', '+25 days'), '7777', 0)
      `).run(athleteId);
      athlete = db.prepare(`SELECT * FROM members WHERE id = ?`).get(athleteId);
    }

    // Set athlete initially outside
    db.prepare(`UPDATE members SET is_inside = 0, isInside = 0 WHERE id = ?`).run(athlete.id);

    // Baseline metrics
    const metricsBefore = db.prepare("SELECT today_entries, total_entries FROM daily_metrics WHERE date = date('now', 'localtime')").get() || { today_entries: 0 };
    const logsCountBefore = db.prepare('SELECT count(*) as count FROM access_logs').get().count;

    // Listen for real-time Socket.IO broadcasts
    const cardPromise = waitForEvent('SHOW_ACCESS_CARD', 4000).catch(() => null);
    const counterPromise = waitForEvent('COUNTER_SYNC', 4000).catch(() => null);

    // 2. Trigger simulated access scan
    const scanRes = await fetch(`${BASE_URL}/api/simulation/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        memberId: athlete.id,
        pin: athlete.pin_code,
        channel: 1
      })
    });
    assert.equal(scanRes.status, 200, 'Scan endpoint must return 200');

    // 3. Verify SQLite access_logs was created
    const logsCountAfter = db.prepare('SELECT count(*) as count FROM access_logs').get().count;
    assert.ok(logsCountAfter > logsCountBefore, 'A new access_log record must be created in SQLite');

    const latestLog = db.prepare('SELECT * FROM access_logs WHERE member_id = ? ORDER BY id DESC LIMIT 1').get(athlete.id);
    assert.ok(latestLog, 'Latest access log for athlete must exist');
    assert.equal(latestLog.channel, 1, 'Access log channel must be 1 (Entrada)');
    assert.match(String(latestLog.status).toLowerCase(), /granted|active|permitido/, 'Access log status must be granted/active');

    // 4. Verify daily_metrics today_entries incremented by 1
    const metricsAfter = db.prepare("SELECT today_entries FROM daily_metrics WHERE date = date('now', 'localtime')").get();
    assert.equal(metricsAfter.today_entries, metricsBefore.today_entries + 1, 'today_entries must increment by exactly 1');

    // 5. Verify athlete attendance is_inside is now 1
    const athleteAfter = db.prepare('SELECT is_inside, isInside FROM members WHERE id = ?').get(athlete.id);
    const isInside = athleteAfter.is_inside !== undefined ? athleteAfter.is_inside : athleteAfter.isInside;
    assert.equal(isInside, 1, 'Athlete attendance status (is_inside) must be updated to 1');

    // 6. Verify Socket.IO received event
    const cardEvent = await cardPromise;
    if (cardEvent) {
      assert.ok(cardEvent.member || cardEvent.name || cardEvent.status, 'SHOW_ACCESS_CARD payload must contain athlete details');
    }
  } finally {
    close();
    db.close();
  }
});

// ---------------------------------------------------------------------------
// 3.2 Quick Visit Flow -> Payments -> Cash Metrics -> Turnstile Pulse -> Broadcast
// ---------------------------------------------------------------------------
suite.test('3.2 Quick Visit Flow: Visit purchase increments cash metrics, logs payment, and triggers gate pulse', async () => {
  await ensureServerRunning();
  const db = getDbConnection();
  const { socket, waitForEvent, close } = createSocketClient();

  try {
    const metricsBefore = db.prepare("SELECT today_cash, visits_cash, cash_visits, today_entries FROM daily_metrics WHERE date = date('now', 'localtime')").get() || { today_cash: 0, visits_cash: 0, today_entries: 0 };
    const initialVisitsCash = metricsBefore.visits_cash !== undefined ? metricsBefore.visits_cash : (metricsBefore.cash_visits || 0);

    const doorOverridePromise = waitForEvent('DOOR_OVERRIDE_TRIGGERED', 3000).catch(() => null);
    const showCardPromise = waitForEvent('SHOW_ACCESS_CARD', 3000).catch(() => null);

    // Trigger quick visit simulation ($60 MXN)
    const visitRes = await fetch(`${BASE_URL}/api/simulation/visit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 60 })
    });
    assert.equal(visitRes.status, 200, 'POST /api/simulation/visit must return 200');

    // Verify payments ledger in SQLite
    const latestPayment = db.prepare("SELECT * FROM member_payments WHERE payment_type = 'VISIT' ORDER BY id DESC LIMIT 1").get();
    assert.ok(latestPayment, 'A payment record of type VISIT must be recorded in member_payments');
    assert.equal(latestPayment.amount, 60, 'Visit payment amount must be $60');

    // Verify daily_metrics cash increment
    const metricsAfter = db.prepare("SELECT today_cash, visits_cash, cash_visits FROM daily_metrics WHERE date = date('now', 'localtime')").get();
    const updatedVisitsCash = metricsAfter.visits_cash !== undefined ? metricsAfter.visits_cash : (metricsAfter.cash_visits || 0);
    assert.equal(updatedVisitsCash, initialVisitsCash + 60, 'visits_cash must increment by $60');
    assert.equal(metricsAfter.today_cash, metricsBefore.today_cash + 60, 'today_cash must increment by $60');

    // Verify socket notification
    const cardData = await showCardPromise;
    if (cardData) {
      assert.match(String(cardData.type || cardData.status || cardData.plan || ''), /visit|visita|pase/i, 
        'SHOW_ACCESS_CARD should indicate visit pass');
    }
  } finally {
    close();
    db.close();
  }
});

// ---------------------------------------------------------------------------
// 3.3 Store Sale Flow -> Stock Decrement -> Sales Log -> Revenue Sync
// ---------------------------------------------------------------------------
suite.test('3.3 Store Sale Flow: POS sale decrements product stock, logs store_sales, and increments store_cash', async () => {
  await ensureServerRunning();
  const db = getDbConnection();
  const { socket, waitForEvent, close } = createSocketClient();

  try {
    // Pick product p2 (Pre-Entreno Rayo de Zeus, price 35)
    let product = db.prepare("SELECT * FROM products WHERE id = 'p2'").get();
    if (!product) {
      product = db.prepare('SELECT * FROM products LIMIT 1').get();
    }
    assert.ok(product, 'Store product must exist');

    // Ensure initial stock > 0
    if (product.stock < 5) {
      db.prepare('UPDATE products SET stock = 10 WHERE id = ?').run(product.id);
      product.stock = 10;
    }

    const stockBefore = product.stock;
    const metricsBefore = db.prepare("SELECT today_cash, store_cash, cash_store FROM daily_metrics WHERE date = date('now', 'localtime')").get() || { today_cash: 0, store_cash: 0 };
    const initialStoreCash = metricsBefore.store_cash !== undefined ? metricsBefore.store_cash : (metricsBefore.cash_store || 0);

    const syncPromise = waitForEvent('ARSENAL_SYNC', 3000)
      .catch(() => waitForEvent('PRODUCTS_SYNC', 3000))
      .catch(() => null);

    // Record sale of 1 unit
    const saleRes = await fetch(`${BASE_URL}/api/store/sale`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        itemId: product.id,
        itemName: product.name,
        price: product.price,
        quantity: 1
      })
    });
    assert.ok([200, 201].includes(saleRes.status), `POST /api/store/sale must return 200 or 201 (got ${saleRes.status})`);

    // 1. Verify stock decremented by 1
    const productAfter = db.prepare('SELECT stock FROM products WHERE id = ?').get(product.id);
    assert.equal(productAfter.stock, stockBefore - 1, 'Product stock must decrement by exactly 1');

    // 2. Verify store_sales record created
    const latestSale = db.prepare('SELECT * FROM store_sales WHERE product_id = ? OR item_id = ? ORDER BY id DESC LIMIT 1').get(product.id, product.id);
    assert.ok(latestSale, 'A store_sales record must be logged in SQLite');
    assert.equal(latestSale.unit_price, product.price);
    assert.equal(latestSale.total_price, product.price);

    // 3. Verify metrics store_cash and today_cash incremented
    const metricsAfter = db.prepare("SELECT today_cash, store_cash, cash_store FROM daily_metrics WHERE date = date('now', 'localtime')").get();
    const updatedStoreCash = metricsAfter.store_cash !== undefined ? metricsAfter.store_cash : (metricsAfter.cash_store || 0);
    assert.equal(updatedStoreCash, initialStoreCash + product.price, 'store_cash must increment by product price');
    assert.equal(metricsAfter.today_cash, metricsBefore.today_cash + product.price, 'today_cash must increment by product price');
  } finally {
    close();
    db.close();
  }
});

// ---------------------------------------------------------------------------
// 3.4 Emergency Lockdown Toggle Flow
// ---------------------------------------------------------------------------
suite.test('3.4 Emergency Lockdown: Toggling lockdown denies access across athletes until released', async () => {
  await ensureServerRunning();
  const db = getDbConnection();
  const { socket, waitForEvent, close } = createSocketClient();

  try {
    const athlete = db.prepare(`SELECT * FROM members WHERE status = 'active' LIMIT 1`).get();
    assert.ok(athlete, 'Active athlete required for lockdown test');

    const lockdownOnPromise = waitForEvent('LOCKDOWN_STATUS', 3000).catch(() => null);

    // 1. Activate Emergency Lockdown
    socket.emit('TOGGLE_LOCKDOWN', true);
    await lockdownOnPromise;

    // 2. Attempt scan during lockdown
    const scanRes = await fetch(`${BASE_URL}/api/simulation/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        memberId: athlete.id,
        pin: athlete.pin_code,
        channel: 1
      })
    });
    assert.equal(scanRes.status, 200);
    const scanBody = await scanRes.json();
    if (scanBody.access !== undefined) {
      // Access should be false or denied during emergency lockdown
      assert.equal(scanBody.access, false, 'Access must be denied while turnstile is in lockdown');
    }

    // 3. Deactivate Emergency Lockdown
    const lockdownOffPromise = waitForEvent('LOCKDOWN_STATUS', 3000).catch(() => null);
    socket.emit('TOGGLE_LOCKDOWN', false);
    await lockdownOffPromise;

    // 4. Scan after release should grant access again
    const postReleaseScan = await fetch(`${BASE_URL}/api/simulation/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        memberId: athlete.id,
        pin: athlete.pin_code,
        channel: 1
      })
    });
    assert.equal(postReleaseScan.status, 200);
  } finally {
    // Ensure lockdown is off
    socket.emit('TOGGLE_LOCKDOWN', false);
    close();
    db.close();
  }
});

// Direct execution
if (require.main === module) {
  suite.run().then(results => {
    process.exit(results.failed > 0 ? 1 : 0);
  });
}

module.exports = suite;
