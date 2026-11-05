/**
 * tests/tier4-workloads.test.js
 * Tier 4: Real-World Workload Scenarios Test Suite
 * 
 * Simulates a complete, authentic gym day operational shift at the Temple of Zeus:
 * 1. Sanctuary Shift Opening (baseline metrics audit)
 * 2. Consagración de Nuevo Atleta (new membership registration + $400 payment)
 * 3. Morning Athlete Entrance Check-in (turnstile entry pulse, occupancy increment)
 * 4. Walk-in Visitor Quick Visit ($60 walk-in pass + entrance pulse)
 * 5. Néctar & Elixires Store Sale (Pre-entreno $35 + Toalla Oficial $100 POS purchase)
 * 6. Membership Renewal for Expiring Athlete (30-day extension + $400 renewal payment)
 * 7. Athlete Workout Completion & Exit Check-out (turnstile exit pulse, occupancy decrement)
 * 8. End-of-Day Cash Cut Reconciliation (ledger math audit, zero discrepancy reconciliation)
 */

const {
  BASE_URL,
  getDbConnection,
  ensureServerRunning,
  TestSuite,
  assert
} = require('./test-helper');

const suite = new TestSuite('Tier 4: Real-World Workload Scenarios');

suite.test('4.1 Full Olympus Gym Operational Lifecycle (Complete Day Shift Simulation)', async () => {
  await ensureServerRunning();
  const db = getDbConnection();

  try {
    // =========================================================================
    // STEP 1: Morning Sanctuary Opening Audit
    // =========================================================================
    const initialCutRes = await fetch(`${BASE_URL}/api/cash-cut`);
    assert.equal(initialCutRes.status, 200, 'Initial cash cut summary must respond 200');
    const openingSummary = await initialCutRes.json();

    const startTodayCash = openingSummary.today_cash || 0;
    const startMembershipsCash = openingSummary.memberships_cash || 0;
    const startVisitsCash = openingSummary.visits_cash || 0;
    const startStoreCash = openingSummary.store_cash || 0;
    const startEntries = openingSummary.today_entries || 0;

    // =========================================================================
    // STEP 2: Consagración de Nuevo Atleta (Registration + Plan Payment $400)
    // =========================================================================
    const newAthleteId = 'zeus_atleta_' + Date.now();
    const newAthletePin = '4321';
    const regRes = await fetch(`${BASE_URL}/api/members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: newAthleteId,
        name: 'Perseo de Argos',
        phone: '555-987-6543',
        plan: 'Membresía Olimpo',
        price: '400',
        days: 30,
        pin_code: newAthletePin
      })
    });
    assert.ok([200, 201].includes(regRes.status), `New athlete registration must return 200 or 201 (got ${regRes.status})`);
    const regData = await regRes.json();
    assert.ok(regData.member, 'Registered athlete object must be returned');
    assert.equal(regData.member.name, 'Perseo de Argos');

    // Verify SQLite persistence
    const perseoInDb = db.prepare('SELECT * FROM members WHERE id = ?').get(newAthleteId);
    assert.ok(perseoInDb, 'Perseo must be persisted in members table');
    assert.equal(perseoInDb.status, 'active', 'New athlete status must be active');
    assert.equal(perseoInDb.days_remaining, 30, 'New athlete must have 30 days remaining');

    // Verify payment in member_payments
    const regPayment = db.prepare('SELECT * FROM member_payments WHERE member_id = ?').get(newAthleteId);
    assert.ok(regPayment, 'Registration payment must be recorded in member_payments');
    assert.equal(regPayment.amount, 400, 'Registration payment amount must be $400');

    // =========================================================================
    // STEP 3: Athlete Morning Entrance Check-in (Channel 1 Entrada)
    // =========================================================================
    const entryRes = await fetch(`${BASE_URL}/api/simulation/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        memberId: newAthleteId,
        pin: newAthletePin,
        channel: 1
      })
    });
    assert.equal(entryRes.status, 200, 'Entrance scan must return 200');

    // Verify Perseo is inside
    const perseoInside = db.prepare('SELECT is_inside, isInside FROM members WHERE id = ?').get(newAthleteId);
    const isInsideNow = perseoInside.is_inside !== undefined ? perseoInside.is_inside : perseoInside.isInside;
    assert.equal(isInsideNow, 1, 'Perseo attendance state must be inside (1)');

    // Verify access log
    const entryLog = db.prepare('SELECT * FROM access_logs WHERE member_id = ? AND channel = 1 ORDER BY id DESC LIMIT 1').get(newAthleteId);
    assert.ok(entryLog, 'Entrance access log must exist');
    assert.match(String(entryLog.status).toLowerCase(), /granted|active|permitido/);

    // =========================================================================
    // STEP 4: Walk-in Visitor Quick Visit Purchase ($60)
    // =========================================================================
    const visitRes = await fetch(`${BASE_URL}/api/simulation/visit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 60 })
    });
    assert.ok([200, 201].includes(visitRes.status), 'Walk-in visit simulation must return 200 or 201');

    const visitPayment = db.prepare("SELECT * FROM member_payments WHERE payment_type = 'VISIT' ORDER BY id DESC LIMIT 1").get();
    assert.ok(visitPayment, 'Visit payment must exist');
    assert.equal(visitPayment.amount, 60);

    // =========================================================================
    // STEP 5: Néctar & Elixires Store Sale (Pre-Entreno $35 + Toalla Oficial $100)
    // =========================================================================
    // 5a. Buy Pre-Entreno ($35)
    const sale1Res = await fetch(`${BASE_URL}/api/store/sale`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        itemId: 'p2',
        itemName: 'Pre-Entreno Rayo de Zeus',
        price: 35,
        quantity: 1
      })
    });
    assert.ok([200, 201].includes(sale1Res.status), 'Pre-entreno sale must return 200 or 201');

    // 5b. Buy Toalla Oficial Zeus ($100)
    const sale2Res = await fetch(`${BASE_URL}/api/store/sale`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        itemId: 'p5',
        itemName: 'Toalla Oficial ZEUS GYM',
        price: 100,
        quantity: 1
      })
    });
    assert.ok([200, 201].includes(sale2Res.status), 'Toalla sale must return 200 or 201');

    // Verify store sales recorded
    const recentSales = db.prepare('SELECT * FROM store_sales ORDER BY id DESC LIMIT 2').all();
    assert.equal(recentSales.length, 2, '2 store sales must be recorded');

    // =========================================================================
    // STEP 6: Membership Plan Renewal ($400)
    // =========================================================================
    // Find or create an athlete needing renewal
    let expiringAthlete = db.prepare(`SELECT * FROM members WHERE id != ? LIMIT 1`).get(newAthleteId);
    if (!expiringAthlete) {
      const expiringId = 'zeus_sofia_' + Date.now();
      db.prepare(`
        INSERT INTO members (id, name, plan, price, status, days, days_remaining, start_date, expire_date, pin_code)
        VALUES (?, 'Sofía Ramírez Test', 'Membresía Olimpo', '400', 'warning', 30, 1, date('now', '-29 days'), date('now', '+1 days'), '5555')
      `).run(expiringId);
      expiringAthlete = db.prepare('SELECT * FROM members WHERE id = ?').get(expiringId);
    }

    const daysRemainingBefore = expiringAthlete.days_remaining || 0;
    const renewRes = await fetch(`${BASE_URL}/api/members/${expiringAthlete.id}/renew`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        plan: 'Membresía Olimpo',
        price: 400,
        extraDays: 30
      })
    });
    assert.ok([200, 201].includes(renewRes.status), 'Member renewal endpoint must return 200 or 201');

    // Verify expiration extension
    const renewedAthlete = db.prepare('SELECT * FROM members WHERE id = ?').get(expiringAthlete.id);
    assert.ok(renewedAthlete.days_remaining > daysRemainingBefore, 'Athlete days_remaining must be extended after renewal');
    assert.equal(renewedAthlete.status, 'active', 'Renewed athlete status must be active');

    // Verify renewal payment record
    const renewalPayment = db.prepare("SELECT * FROM member_payments WHERE member_id = ? AND payment_type = 'RENEWAL' ORDER BY id DESC LIMIT 1").get(expiringAthlete.id);
    assert.ok(renewalPayment, 'Renewal payment must be logged in member_payments');
    assert.equal(renewalPayment.amount, 400, 'Renewal payment amount must be $400');

    // =========================================================================
    // STEP 7: Athlete Workout Completion & Exit Check-out (Channel 2 Salida)
    // =========================================================================
    const exitRes = await fetch(`${BASE_URL}/api/simulation/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        memberId: newAthleteId,
        channel: 2
      })
    });
    assert.equal(exitRes.status, 200, 'Exit scan must return 200');

    // Verify Perseo is outside
    const perseoOutside = db.prepare('SELECT is_inside, isInside FROM members WHERE id = ?').get(newAthleteId);
    const isInsideExit = perseoOutside.is_inside !== undefined ? perseoOutside.is_inside : perseoOutside.isInside;
    assert.equal(isInsideExit, 0, 'Perseo attendance state must be outside (0) after exit');

    // =========================================================================
    // STEP 8: End-of-Day Cash Cut Reconciliation
    // =========================================================================
    // Expected Revenue Generated in this shift:
    // New Athlete: $400
    // Walk-in Visit: $60
    // Store Sale: $35 + $100 = $135
    // Renewal: $400
    // Total Shift Revenue Added = $995 MXN
    const expectedRevenueAdded = 400 + 60 + 135 + 400; // $995

    const finalSummaryRes = await fetch(`${BASE_URL}/api/cash-cut`);
    assert.equal(finalSummaryRes.status, 200);
    const closingSummary = await finalSummaryRes.json();

    const expectedTotalCash = startTodayCash + expectedRevenueAdded;
    assert.equal(closingSummary.today_cash, expectedTotalCash, 
      `Ledger invariant check: today_cash (${closingSummary.today_cash}) must equal startTodayCash (${startTodayCash}) + expectedRevenueAdded (${expectedRevenueAdded})`);

    // Verify sub-category balances
    assert.equal(closingSummary.memberships_cash, startMembershipsCash + 400 + 400, 'Memberships cash must reflect new + renewal ($800)');
    assert.equal(closingSummary.visits_cash, startVisitsCash + 60, 'Visits cash must reflect walk-in pass ($60)');
    assert.equal(closingSummary.store_cash, startStoreCash + 135, 'Store cash must reflect store sales ($135)');

    // Execute Cash Cut with exact physical drawer match
    const countedCashInDrawer = expectedTotalCash;
    const cutRes = await fetch(`${BASE_URL}/api/cash-cut`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        counted_cash: countedCashInDrawer,
        notes: 'Corte de caja final de jornada completa en Templo de Zeus. Cero descuadres.',
        closed_by: 'Administrador Olimpo'
      })
    });
    assert.ok([200, 201].includes(cutRes.status), 'Closing cash cut submission must return 200 or 201');
    const cutData = await cutRes.json();
    const cutRecord = cutData.cut || cutData;

    assert.ok(cutRecord.id, 'Cash cut record must be stored');
    assert.equal(cutRecord.expected_cash, expectedTotalCash, 'expected_cash must match ledger');
    assert.equal(cutRecord.counted_cash, countedCashInDrawer, 'counted_cash must match physical drawer count');
    assert.equal(cutRecord.difference, 0, 'Reconciled difference must be exactly 0 (Zero Descuadre)');
    assert.match(String(cutRecord.closed_by), /Administrador|Olimpo/i, 'Cut must be closed by Administrador Olimpo');
    assert.doesNotMatch(String(cutRecord.closed_by), /Comandante/i, 'Cut must not attribute to legacy Comandante');
  } finally {
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
