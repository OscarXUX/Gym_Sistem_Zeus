/**
 * tests/challenger-stress.test.js
 * Empirical Challenger Stress Harness for Gym_Sistem_Zeus
 * 
 * Tests:
 * 1. POST /api/simulation/scan ('active', 'warning', 'expired', non-existent IDs, exit channel)
 * 2. POST /api/simulation/override (channel 1, channel 2, invalid channel fallback)
 * 3. POST /api/simulation/visit (cash accounting, SQLite daily_metrics ledger verification)
 * 4. GET /api/simulation/status (runtime diagnostics verification)
 * 5. Concurrent Operations (10 concurrent requests to /api/simulation/scan for anti-bounce & WAL resilience)
 * 6. Mixed Concurrency Stress (10 simultaneous heterogeneous simulation requests & SQLite integrity check)
 */

const {
  ensureServerRunning,
  stopServer,
  getDbConnection,
  createSocketClient,
  TestSuite,
  assert,
  BASE_URL
} = require('./test-helper');

const suite = new TestSuite('Empirical Challenger: Simulation & Stress Suite');

/**
 * Helper to ensure the Socket.IO client is fully connected before issuing triggers
 */
async function getConnectedSocket() {
  const client = createSocketClient();
  if (!client.socket.connected) {
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Socket.IO connection handshake timed out')), 4000);
      client.socket.once('connect', () => {
        clearTimeout(timer);
        resolve();
      });
      client.socket.once('connect_error', (err) => {
        clearTimeout(timer);
        reject(err);
      });
    });
  }
  return client;
}

suite.test('1.1 Simulation Scan: Active credential grants access, triggers pulse & emits card', async () => {
  const { socket, waitForEvent, close } = await getConnectedSocket();
  const db = getDbConnection();

  try {
    const cardPromise = waitForEvent('SHOW_ACCESS_CARD', 4000);

    const res = await fetch(`${BASE_URL}/api/simulation/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'active', channel: 1 })
    });

    assert.equal(res.status, 200, `Expected HTTP 200 but got ${res.status}`);
    const data = await res.json();
    assert.equal(data.ok, true, 'Expected ok: true');
    assert.equal(data.accessGranted, true, 'Expected accessGranted: true');
    assert.equal(data.channel, 1, 'Expected channel 1');
    assert.equal(data.status, 'active', 'Expected active status');

    const cardEvent = await cardPromise;
    assert.ok(cardEvent, 'Socket should receive SHOW_ACCESS_CARD');
    assert.equal(cardEvent.type, 'active');

    // Verify DB log
    const log = db.prepare('SELECT * FROM access_logs WHERE member_id = ? ORDER BY id DESC LIMIT 1').get(data.member.id);
    assert.ok(log, 'Access log must be recorded in SQLite');
    assert.equal(log.status, 'GRANTED');
    assert.equal(log.action, 'SIMULATION_ENTRY');

    // Verify member attendance in DB
    const member = db.prepare('SELECT isInside, is_inside FROM members WHERE id = ?').get(data.member.id);
    assert.equal(member.isInside === 1 || member.is_inside === 1, true, 'Member should be marked inside');
  } finally {
    close();
    db.close();
  }
});

suite.test('1.2 Simulation Scan: Warning credential grants access with warning flag', async () => {
  const { socket, waitForEvent, close } = await getConnectedSocket();
  const db = getDbConnection();

  try {
    const cardPromise = waitForEvent('SHOW_ACCESS_CARD', 4000);

    const res = await fetch(`${BASE_URL}/api/simulation/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'warning', channel: 1 })
    });

    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.ok, true);
    assert.equal(data.accessGranted, true);
    assert.equal(data.status, 'warning');

    const cardEvent = await cardPromise;
    assert.equal(cardEvent.type, 'warning');

    const log = db.prepare('SELECT * FROM access_logs WHERE member_id = ? ORDER BY id DESC LIMIT 1').get(data.member.id);
    assert.ok(log);
    assert.equal(log.status, 'GRANTED_WARNING');
  } finally {
    close();
    db.close();
  }
});

suite.test('1.3 Simulation Scan: Expired credential denies access without turnstile pulse', async () => {
  const { socket, waitForEvent, close } = await getConnectedSocket();
  const db = getDbConnection();

  try {
    const cardPromise = waitForEvent('SHOW_ACCESS_CARD', 4000);

    const res = await fetch(`${BASE_URL}/api/simulation/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'expired', channel: 1 })
    });

    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.ok, true);
    assert.equal(data.accessGranted, false, 'Expired member must be denied entry');
    assert.equal(data.reason, 'EXPIRED');

    const cardEvent = await cardPromise;
    assert.equal(cardEvent.type, 'expired');

    const log = db.prepare('SELECT * FROM access_logs WHERE member_id = ? ORDER BY id DESC LIMIT 1').get(data.member.id);
    assert.ok(log);
    assert.equal(log.status, 'DENIED_EXPIRED');
    assert.equal(log.action, 'SIMULATION_DENIED');
  } finally {
    close();
    db.close();
  }
});

suite.test('1.4 Simulation Scan: Non-existent IDs return HTTP 404 and deny access', async () => {
  // Test numeric unknown ID
  const res1 = await fetch(`${BASE_URL}/api/simulation/scan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ memberId: '99999999' })
  });
  assert.equal(res1.status, 404, 'Unknown memberId must return 404');
  const d1 = await res1.json();
  assert.equal(d1.accessGranted, false);
  assert.equal(d1.reason, 'MEMBER_NOT_FOUND');

  // Test unknown PIN
  const res2 = await fetch(`${BASE_URL}/api/simulation/scan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pin: 'UNKNOWN_ORACLE_PIN' })
  });
  assert.equal(res2.status, 404);
  const d2 = await res2.json();
  assert.equal(d2.reason, 'MEMBER_NOT_FOUND');

  // Test unknown RFID
  const res3 = await fetch(`${BASE_URL}/api/simulation/scan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rfid: 'RFID_NONEXISTENT_99' })
  });
  assert.equal(res3.status, 404);
  const d3 = await res3.json();
  assert.equal(d3.reason, 'MEMBER_NOT_FOUND');
});

suite.test('1.5 Simulation Scan: Exit channel 2 marks athlete isInside=0 and logs SIMULATION_EXIT', async () => {
  const db = getDbConnection();
  try {
    const res = await fetch(`${BASE_URL}/api/simulation/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'active', channel: 2 })
    });

    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.channel, 2);
    assert.equal(data.accessGranted, true);

    const log = db.prepare('SELECT * FROM access_logs WHERE member_id = ? ORDER BY id DESC LIMIT 1').get(data.member.id);
    assert.equal(log.action, 'SIMULATION_EXIT');
    assert.equal(log.channel, 2);

    const member = db.prepare('SELECT isInside, is_inside FROM members WHERE id = ?').get(data.member.id);
    assert.equal(member.isInside === 0 || member.is_inside === 0, true, 'Member must be marked outside on exit');
  } finally {
    db.close();
  }
});

suite.test('2.1 Simulation Override: Manual triggers for Channel 1 and Channel 2 with fallback', async () => {
  const { socket, waitForEvent, close } = await getConnectedSocket();
  const db = getDbConnection();

  try {
    // Channel 1 (Entrada)
    const overridePromise1 = waitForEvent('DOOR_OVERRIDE_TRIGGERED', 4000);
    const res1 = await fetch(`${BASE_URL}/api/simulation/override`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channel: 1 })
    });
    assert.equal(res1.status, 200);
    const d1 = await res1.json();
    assert.equal(d1.ok, true);
    assert.equal(d1.channel, 1);
    assert.equal(d1.direction, 'ENTRADA');
    const ev1 = await overridePromise1;
    assert.equal(ev1.channel, 1);

    // Channel 2 (Salida)
    const overridePromise2 = waitForEvent('DOOR_OVERRIDE_TRIGGERED', 4000);
    const res2 = await fetch(`${BASE_URL}/api/simulation/override`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channel: 2 })
    });
    assert.equal(res2.status, 200);
    const d2 = await res2.json();
    assert.equal(d2.ok, true);
    assert.equal(d2.channel, 2);
    assert.equal(d2.direction, 'SALIDA');
    const ev2 = await overridePromise2;
    assert.equal(ev2.channel, 2);

    // Invalid channel fallback
    const res3 = await fetch(`${BASE_URL}/api/simulation/override`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channel: 999 })
    });
    assert.equal(res3.status, 200);
    const d3 = await res3.json();
    assert.equal(d3.channel, 1, 'Invalid channel must safely fallback to channel 1');
  } finally {
    close();
    db.close();
  }
});

suite.test('3.1 Simulation Visit: Cash accounting and zeus_gym.sqlite ledger verification', async () => {
  const { socket, waitForEvent, close } = await getConnectedSocket();
  const db = getDbConnection();

  try {
    // Capture metrics before visit
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const beforeMetrics = db.prepare('SELECT * FROM daily_metrics WHERE date = ?').get(today) || {
      today_entries: 0,
      visits_cash: 0,
      cash_visits: 0,
      today_cash: 0
    };

    const visitPromise = waitForEvent('VISIT_PROCESSED', 4000);
    const cardPromise = waitForEvent('SHOW_ACCESS_CARD', 4000);

    const testPrice = 60;
    const res = await fetch(`${BASE_URL}/api/simulation/visit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: testPrice })
    });

    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.ok, true);
    assert.equal(data.price, testPrice);

    const visitEvent = await visitPromise;
    assert.ok(visitEvent, 'VISIT_PROCESSED must be emitted');

    const cardEvent = await cardPromise;
    assert.equal(cardEvent, 'visit', 'SHOW_ACCESS_CARD must emit visit flag');

    // Query zeus_gym.sqlite directly to assert ledger mathematical accuracy
    const afterMetrics = db.prepare('SELECT * FROM daily_metrics WHERE date = ?').get(today);
    assert.ok(afterMetrics, 'daily_metrics record must exist for today');

    assert.equal(
      afterMetrics.today_entries,
      beforeMetrics.today_entries + 1,
      `today_entries should increment by 1 (was ${beforeMetrics.today_entries}, now ${afterMetrics.today_entries})`
    );

    const expectedVisitsCash = (beforeMetrics.visits_cash || beforeMetrics.cash_visits || 0) + testPrice;
    const actualVisitsCash = afterMetrics.visits_cash || afterMetrics.cash_visits || 0;
    assert.equal(
      actualVisitsCash,
      expectedVisitsCash,
      `visits_cash should increment by ${testPrice} (expected ${expectedVisitsCash}, got ${actualVisitsCash})`
    );

    const expectedTodayCash = (beforeMetrics.today_cash || 0) + testPrice;
    assert.equal(
      afterMetrics.today_cash,
      expectedTodayCash,
      `today_cash must accurately reflect the +$${testPrice} payment`
    );

    // Verify member_payments recorded the visit transaction
    const payment = db.prepare(`
      SELECT * FROM member_payments 
      WHERE member_id = 'VISIT' AND amount = ? 
      ORDER BY id DESC LIMIT 1
    `).get(testPrice);
    assert.ok(payment, 'member_payments should record VISIT payment');
    assert.equal(payment.payment_type, 'VISIT');
  } finally {
    close();
    db.close();
  }
});

suite.test('4.1 Simulation Status: Runtime diagnostics output verification', async () => {
  const res = await fetch(`${BASE_URL}/api/simulation/status`);
  assert.equal(res.status, 200);
  const status = await res.json();

  assert.equal(typeof status.simulationMode, 'boolean', 'simulationMode must be boolean');
  assert.equal(status.simulationMode, true, 'simulationMode must be true in test mode');
  assert.equal(typeof status.hardwareEnabled, 'boolean', 'hardwareEnabled must be boolean');
  assert.equal(status.db, 'zeus_gym.sqlite', 'Database name must be zeus_gym.sqlite');
  assert.equal(typeof status.connectedClients, 'number', 'connectedClients must be number');
  assert.ok(status.connectedClients >= 0, 'connectedClients >= 0');
  assert.equal(typeof status.todayEntries, 'number', 'todayEntries must be number');
  assert.equal(status.turnstileLocked, false, 'turnstileLocked should be false by default');
  assert.ok(status.channels, 'channels object must exist');
  assert.ok(status.channels['1'] === 'ready' || status.channels['1'] === 'busy');
  assert.ok(status.channels['2'] === 'ready' || status.channels['2'] === 'busy');
});

suite.test('5.1 Concurrency Stress: 10 concurrent requests to /api/simulation/scan with anti-bounce', async () => {
  const db = getDbConnection();
  try {
    // Fire 10 concurrent requests simultaneously to stress test anti-bounce & WAL
    const requests = Array.from({ length: 10 }, (_, i) => {
      return fetch(`${BASE_URL}/api/simulation/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId: '042', channel: 1 })
      });
    });

    const results = await Promise.all(requests);
    assert.equal(results.length, 10, 'All 10 requests must complete');

    // Check responses: all must return valid HTTP status without crashing
    for (const res of results) {
      assert.equal(res.status, 200, `Expected 200 but got ${res.status}`);
      const body = await res.json();
      assert.equal(body.ok, true, 'Response body ok should be true');
    }

    // Verify database integrity has not been corrupted by concurrency
    const check = db.prepare('PRAGMA integrity_check').get();
    assert.equal(check.integrity_check, 'ok', 'SQLite integrity_check must return ok');
  } finally {
    db.close();
  }
});

suite.test('5.2 Mixed Concurrency Stress: 10 heterogeneous simulation requests simultaneously', async () => {
  const db = getDbConnection();
  try {
    const mixedRequests = [
      fetch(`${BASE_URL}/api/simulation/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'active', channel: 1 })
      }),
      fetch(`${BASE_URL}/api/simulation/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'warning', channel: 1 })
      }),
      fetch(`${BASE_URL}/api/simulation/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'expired', channel: 1 })
      }),
      fetch(`${BASE_URL}/api/simulation/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId: '9999999' })
      }),
      fetch(`${BASE_URL}/api/simulation/override`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channel: 1 })
      }),
      fetch(`${BASE_URL}/api/simulation/override`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channel: 2 })
      }),
      fetch(`${BASE_URL}/api/simulation/visit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 60 })
      }),
      fetch(`${BASE_URL}/api/simulation/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'active', channel: 2 })
      }),
      fetch(`${BASE_URL}/api/simulation/status`),
      fetch(`${BASE_URL}/api/metrics`)
    ];

    const responses = await Promise.all(mixedRequests);
    assert.equal(responses.length, 10, 'All 10 mixed requests must complete');

    // Item index 3 is memberId 9999999 which should be 404, all others should be 200
    assert.equal(responses[0].status, 200);
    assert.equal(responses[1].status, 200);
    assert.equal(responses[2].status, 200);
    assert.equal(responses[3].status, 404);
    assert.equal(responses[4].status, 200);
    assert.equal(responses[5].status, 200);
    assert.equal(responses[6].status, 200);
    assert.equal(responses[7].status, 200);
    assert.equal(responses[8].status, 200);
    assert.equal(responses[9].status, 200);

    // Verify WAL concurrency and database health
    const integrityCheck = db.prepare('PRAGMA integrity_check').get();
    assert.equal(integrityCheck.integrity_check, 'ok', 'PRAGMA integrity_check must return ok');
  } finally {
    db.close();
  }
});

suite.test('6.1 Adversarial Lockdown: Denies access across scan, override & visit when locked, restores on unlock', async () => {
  const { socket, waitForEvent, close } = await getConnectedSocket();
  try {
    // 1. Enable lockdown via Socket.IO
    socket.emit('TOGGLE_LOCKDOWN', true);
    await new Promise(r => setTimeout(r, 100)); // Allow server to process event

    // 2. Scan should be denied due to lockdown
    const scanRes = await fetch(`${BASE_URL}/api/simulation/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'active', channel: 1 })
    });
    assert.equal(scanRes.status, 200);
    const scanData = await scanRes.json();
    assert.equal(scanData.accessGranted, false, 'Access must be denied during lockdown');
    assert.equal(scanData.reason, 'TURNSTILE_LOCKED');

    // 3. Override should return HTTP 403
    const overrideRes = await fetch(`${BASE_URL}/api/simulation/override`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channel: 1 })
    });
    assert.equal(overrideRes.status, 403, 'Override must return HTTP 403 during lockdown');

    // 4. Visit should return HTTP 403
    const visitRes = await fetch(`${BASE_URL}/api/simulation/visit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 60 })
    });
    assert.equal(visitRes.status, 403, 'Visit must return HTTP 403 during lockdown');

    // 5. Restore unlock
    socket.emit('TOGGLE_LOCKDOWN', false);
    await new Promise(r => setTimeout(r, 100));

    // 6. Verify scan succeeds again
    const unlockScan = await fetch(`${BASE_URL}/api/simulation/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'active', channel: 1 })
    });
    assert.equal(unlockScan.status, 200);
    const unlockData = await unlockScan.json();
    assert.equal(unlockData.accessGranted, true, 'Access must be granted after releasing lockdown');
  } finally {
    try {
      socket.emit('TOGGLE_LOCKDOWN', false);
    } catch (e) {}
    close();
  }
});

suite.test('6.2 High-Throughput Burst: 50 concurrent requests across all simulation endpoints', async () => {
  const db = getDbConnection();
  try {
    const burstRequests = Array.from({ length: 50 }, (_, i) => {
      const mode = i % 5;
      if (mode === 0) {
        return fetch(`${BASE_URL}/api/simulation/scan`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'active', channel: 1 })
        });
      } else if (mode === 1) {
        return fetch(`${BASE_URL}/api/simulation/scan`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'warning', channel: 1 })
        });
      } else if (mode === 2) {
        return fetch(`${BASE_URL}/api/simulation/override`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ channel: 1 })
        });
      } else if (mode === 3) {
        return fetch(`${BASE_URL}/api/simulation/visit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: 60 })
        });
      } else {
        return fetch(`${BASE_URL}/api/simulation/status`);
      }
    });

    const responses = await Promise.all(burstRequests);
    assert.equal(responses.length, 50, 'All 50 burst requests must complete');

    for (const res of responses) {
      assert.equal(res.status, 200, `Every burst request must return 200 (got ${res.status})`);
    }

    // Verify WAL concurrency and database health after 50-request blast
    const integrity = db.prepare('PRAGMA integrity_check').get();
    assert.equal(integrity.integrity_check, 'ok', 'PRAGMA integrity_check must be ok after 50-request blast');
  } finally {
    db.close();
  }
});

suite.test('6.3 Boundary Sanitization: Visit with negative or malformed amounts protects ledger from negative cash', async () => {
  const db = getDbConnection();
  try {
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const beforeMetrics = db.prepare('SELECT * FROM daily_metrics WHERE date = ?').get(today);

    // 1. Negative amount input: { amount: -500 }
    const resNegative = await fetch(`${BASE_URL}/api/simulation/visit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: -500 })
    });
    assert.equal(resNegative.status, 200);
    const dataNeg = await resNegative.json();
    assert.equal(dataNeg.ok, true);

    // Verify SQLite ledger was protected: cash did NOT decrease
    const afterMetrics = db.prepare('SELECT * FROM daily_metrics WHERE date = ?').get(today);
    assert.ok(afterMetrics.today_cash >= beforeMetrics.today_cash, 'today_cash must never decrease on visit');
    assert.ok(afterMetrics.visits_cash >= beforeMetrics.visits_cash, 'visits_cash must never decrease on visit');

    // 2. Malformed string input: { amount: "invalid_price_string" }
    const resString = await fetch(`${BASE_URL}/api/simulation/visit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 'invalid_price_string' })
    });
    assert.equal(resString.status, 200);
    const dataStr = await resString.json();
    assert.equal(dataStr.price, 60, 'Malformed price string must fall back to default $60 MXN');
  } finally {
    db.close();
  }
});

// Execute runner if executed directly
if (require.main === module) {
  (async () => {
    try {
      console.log('⚡ Starting Challenger Stress Test Suite...');
      await ensureServerRunning();
      // Ensure clean baseline state
      try {
        const initClient = await getConnectedSocket();
        initClient.socket.emit('TOGGLE_LOCKDOWN', false);
        await new Promise(r => setTimeout(r, 100));
        initClient.close();
      } catch (e) {}
      const results = await suite.run();
      await stopServer();
      if (results.failed > 0) {
        process.exit(1);
      }
      process.exit(0);
    } catch (err) {
      console.error('Fatal harness error:', err);
      process.exit(1);
    }
  })();
}

module.exports = suite;
