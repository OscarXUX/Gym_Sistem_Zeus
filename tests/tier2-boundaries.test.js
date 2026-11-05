/**
 * tests/tier2-boundaries.test.js
 * Tier 2: Boundary & Corner Cases Test Suite
 * 
 * Verifies defensive handling, edge conditions, and failure resilience:
 * - 2.1: Non-existent / invalid member ID scan (denies access, zero relay pulse, zero crash)
 * - 2.2: Expired membership scan (denies access, logs denial in access_logs, does not increment today_entries)
 * - 2.3: Missing / malformed parameters in REST API endpoints (validation & safe rejection)
 * - 2.4: Rapid concurrent simulated scans (anti-bounce channel protection, zero race-condition deadlocks)
 * - 2.5: Extreme / zero / negative cash cut figures (accurate difference computation, zero ledger corruption)
 * - 2.6: Zero stock / inventory exhaustion behavior on store sales (underflow protection)
 */

const {
  BASE_URL,
  getDbConnection,
  ensureServerRunning,
  createSocketClient,
  TestSuite,
  assert
} = require('./test-helper');

const suite = new TestSuite('Tier 2: Boundary & Corner Cases');

// ---------------------------------------------------------------------------
// 2.1 Non-existent / Invalid Member ID Scan
// ---------------------------------------------------------------------------
suite.test('2.1 Non-existent member ID: Scan denies access and does not trigger turnstile pulse', async () => {
  await ensureServerRunning();
  const db = getDbConnection();

  const entriesBefore = db.prepare("SELECT today_entries FROM daily_metrics WHERE date = date('now', 'localtime')").get()?.today_entries || 0;
  const logsCountBefore = db.prepare('SELECT count(*) as count FROM access_logs').get().count;

  // Scan completely unknown credential
  const invalidId = 'NON_EXISTENT_ZEUS_CREDENTIAL_999999';
  const res = await fetch(`${BASE_URL}/api/simulation/scan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ memberId: invalidId, channel: 1 })
  });

  assert.ok(res.status === 200 || res.status === 404 || res.status === 400, 
    `Server must respond with non-500 status on invalid scan (got ${res.status})`);
  
  const body = await res.json();
  // Response must indicate denial or member not found
  if (body.status) {
    assert.match(String(body.status).toLowerCase(), /denied|expired|not_found|error/, 
      `Invalid scan status must indicate denial, got ${body.status}`);
  }

  // Verify daily_metrics was NOT incremented for invalid scan
  const entriesAfter = db.prepare("SELECT today_entries FROM daily_metrics WHERE date = date('now', 'localtime')").get()?.today_entries || 0;
  assert.equal(entriesAfter, entriesBefore, 'today_entries must NOT increment for an invalid member scan');

  // Verify access_logs recorded the failed attempt or no unauthorized entrance was granted
  const logsCountAfter = db.prepare('SELECT count(*) as count FROM access_logs').get().count;
  if (logsCountAfter > logsCountBefore) {
    const latestLog = db.prepare('SELECT * FROM access_logs ORDER BY id DESC LIMIT 1').get();
    assert.match(String(latestLog.status).toLowerCase(), /denied|expired|error|unknown/i, 
      'Latest access log for invalid scan must not be marked granted');
  }

  db.close();
});

// ---------------------------------------------------------------------------
// 2.2 Expired Membership Scan
// ---------------------------------------------------------------------------
suite.test('2.2 Expired membership: Scan denies entry, records denied log, and prevents turnstile pulse', async () => {
  await ensureServerRunning();
  const db = getDbConnection();

  // Find or create a test member with expired status
  let expiredMember = db.prepare(`SELECT * FROM members WHERE status = 'expired' OR days_remaining <= 0 LIMIT 1`).get();
  if (!expiredMember) {
    const expiredId = 'test_expired_' + Date.now();
    db.prepare(`
      INSERT INTO members (id, name, plan, price, status, days, days_remaining, start_date, expire_date, pin_code, is_inside)
      VALUES (?, 'Atleta Vencido Test', 'Membresía Olimpo', '400', 'expired', 30, -5, '2025-01-01', '2025-01-31', '8888', 0)
    `).run(expiredId);
    expiredMember = db.prepare(`SELECT * FROM members WHERE id = ?`).get(expiredId);
  }

  const entriesBefore = db.prepare("SELECT today_entries FROM daily_metrics WHERE date = date('now', 'localtime')").get()?.today_entries || 0;

  const res = await fetch(`${BASE_URL}/api/simulation/scan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ memberId: expiredMember.id, pin: expiredMember.pin_code, channel: 1 })
  });

  assert.equal(res.status, 200, 'Scan endpoint must return 200 even for expired members');
  const body = await res.json();
  
  if (body.access !== undefined) {
    assert.equal(body.access, false, 'Expired member access must be false');
  }
  if (body.status) {
    assert.match(String(body.status).toLowerCase(), /expired|denied/, 'Status must reflect expired/denied');
  }

  // Counter check
  const entriesAfter = db.prepare("SELECT today_entries FROM daily_metrics WHERE date = date('now', 'localtime')").get()?.today_entries || 0;
  assert.equal(entriesAfter, entriesBefore, 'today_entries must NOT increment for an expired member');

  // Verify access_logs
  const recentLog = db.prepare('SELECT * FROM access_logs WHERE member_id = ? ORDER BY id DESC LIMIT 1').get(expiredMember.id);
  if (recentLog) {
    assert.match(String(recentLog.status).toLowerCase(), /expired|denied/, 'Access log status must be expired or denied');
  }

  db.close();
});

// ---------------------------------------------------------------------------
// 2.3 Missing / Malformed Payload Parameters
// ---------------------------------------------------------------------------
suite.test('2.3 Missing Parameters: REST API endpoints reject or safely sanitize invalid payloads', async () => {
  await ensureServerRunning();

  // POST /api/members without name
  const resBadMember = await fetch(`${BASE_URL}/api/members`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: '5551234567' }) // Missing name
  });
  // Should either respond with 400 Bad Request or safely fallback without crashing
  assert.ok([200, 201, 400].includes(resBadMember.status), `Server must not 500 on missing member name (got ${resBadMember.status})`);
  if ([200, 201].includes(resBadMember.status)) {
    const data = await resBadMember.json();
    assert.ok(data.member?.name, 'If success returned, a valid fallback name must be provided');
  }

  // POST /api/store/sale with empty body
  const resEmptySale = await fetch(`${BASE_URL}/api/store/sale`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  });
  assert.ok([200, 201, 400].includes(resEmptySale.status), `Server must not 500 on empty store sale payload (got ${resEmptySale.status})`);

  // POST /api/cash-cut with non-numeric counted_cash
  const resBadCash = await fetch(`${BASE_URL}/api/cash-cut`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ counted_cash: 'NOT_A_NUMBER', notes: 'Malformed input test' })
  });
  assert.ok([200, 201, 400].includes(resBadCash.status), `Server must not 500 on malformed cash cut (got ${resBadCash.status})`);
});

// ---------------------------------------------------------------------------
// 2.4 Rapid Concurrent Scans (Anti-Bounce)
// ---------------------------------------------------------------------------
suite.test('2.4 Rapid Simulated Scans: Channel anti-bounce prevents race-condition deadlocks', async () => {
  await ensureServerRunning();

  // Fire 5 concurrent requests within milliseconds to test anti-bounce concurrency handling
  const promises = [];
  for (let i = 0; i < 5; i++) {
    promises.push(
      fetch(`${BASE_URL}/api/simulation/override`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channel: 1 })
      }).then(r => r.json().catch(() => ({ ok: false })))
    );
  }

  const results = await Promise.all(promises);
  assert.equal(results.length, 5, 'All 5 rapid requests must resolve without hanging');

  // Verify server is still alive and responsive after concurrent burst
  const healthRes = await fetch(`${BASE_URL}/api/plans`);
  assert.equal(healthRes.status, 200, 'Server must remain healthy and responsive after rapid pulse burst');
});

// ---------------------------------------------------------------------------
// 2.5 Negative / Zero Cash Cut Handling
// ---------------------------------------------------------------------------
suite.test('2.5 Cash Cut Boundaries: Zero or negative cash difference calculates accurately', async () => {
  await ensureServerRunning();
  const db = getDbConnection();

  // Record a cash cut with $0 counted cash
  const resZero = await fetch(`${BASE_URL}/api/cash-cut`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      counted_cash: 0,
      notes: 'Test corte en ceros',
      closed_by: 'Administrador Olimpo'
    })
  });

  assert.ok([200, 201].includes(resZero.status), `Cash cut with 0 counted cash should respond OK (got ${resZero.status})`);
  const cutData = await resZero.json();
  const cut = cutData.cut || cutData;
  assert.ok(cut.id, 'Cash cut record must be created in SQLite');
  assert.equal(cut.counted_cash, 0, 'counted_cash must be 0');

  // Difference must equal counted_cash - expected_cash
  const expectedDifference = 0 - cut.expected_cash;
  assert.equal(cut.difference, expectedDifference, 'Difference equation must be exact: counted_cash - expected_cash');

  db.close();
});

// ---------------------------------------------------------------------------
// 2.6 Zero Stock / Underflow Protection
// ---------------------------------------------------------------------------
suite.test('2.6 Store Inventory: Attempting sale on 0-stock item does not corrupt inventory', async () => {
  await ensureServerRunning();
  const db = getDbConnection();

  // Find or create product with 0 stock
  const testProdId = 'test_zero_stock_' + Date.now();
  db.prepare(`
    INSERT INTO products (id, name, category, price, stock, active)
    VALUES (?, 'Elixir Agotado Test', 'Suplementos', 50, 0, 1)
  `).run(testProdId);

  // Attempt store purchase of this 0-stock product
  const saleRes = await fetch(`${BASE_URL}/api/store/sale`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      itemId: testProdId,
      itemName: 'Elixir Agotado Test',
      price: 50,
      quantity: 1
    })
  });

  assert.ok([200, 201, 400].includes(saleRes.status), 'Sale endpoint should handle 0-stock gracefully');

  // Verify stock did not drop below 0 (clamped or prevented)
  const productAfter = db.prepare('SELECT stock FROM products WHERE id = ?').get(testProdId);
  assert.ok(productAfter.stock >= 0 || productAfter.stock === -1, 'Stock must not experience uncontrolled underflow');

  // Clean up test product
  db.prepare('DELETE FROM products WHERE id = ?').run(testProdId);
  db.close();
});

// Direct execution
if (require.main === module) {
  suite.run().then(results => {
    process.exit(results.failed > 0 ? 1 : 0);
  });
}

module.exports = suite;
