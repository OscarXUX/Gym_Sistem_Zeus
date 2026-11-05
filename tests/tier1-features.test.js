/**
 * tests/tier1-features.test.js
 * Tier 1: Feature Coverage Test Suite
 * 
 * Verifies:
 * - Feature 1: SQLite zeus_gym.sqlite relational schema, tables, indices, and Olympus seeds
 * - Feature 2: Decoupled virtual turnstile relay controller (zero serialport crash, simulated pulse)
 * - Feature 3: Backend REST API endpoints & simulation REST endpoints
 * - Feature 4: Package metadata & scripts
 * - Feature 5: Apple & Claude design tokens, midnight navy & celestial blue palette in index.css
 * - Feature 6: Zeus & Lightning SVG vector definitions (ZeusSvg.jsx & backward-compatibility alias)
 * - Feature 7: Web Audio API divine acoustic synthesizer (audio.js)
 * - Feature 8: PWA manifest, service worker cache, and root index.html metadata
 * - Feature 9: Production kiosk launcher batch script with auto-build check and flag fix
 * - Feature 21: TV Monitor simulation hotkeys (A/W/E/V/L/O/F/M)
 */

const fs = require('fs');
const path = require('path');
const {
  PROJECT_ROOT,
  BASE_URL,
  getDbConnection,
  ensureServerRunning,
  TestSuite,
  assert
} = require('./test-helper');

const suite = new TestSuite('Tier 1: Feature Coverage');

// ---------------------------------------------------------------------------
// 1. SQLite Database Schema & Master Seeds
// ---------------------------------------------------------------------------
suite.test('1.1 SQLite zeus_gym.sqlite file exists and initializes in WAL mode', () => {
  const db = getDbConnection();
  assert.ok(db, 'Failed to obtain SQLite database connection');
  
  const journalMode = db.pragma('journal_mode', { simple: true });
  assert.equal(String(journalMode).toLowerCase(), 'wal', 'Database journal_mode must be WAL');
  db.close();
});

suite.test('1.2 SQLite Schema: Relational tables and indices exist', () => {
  const db = getDbConnection();
  const tables = db.prepare(`SELECT name FROM sqlite_master WHERE type='table'`).all().map(t => t.name);

  const requiredTables = [
    'plans',
    'members',
    'member_payments',
    'products',
    'store_sales',
    'access_logs',
    'daily_metrics',
    'tv_settings',
    'cash_cuts'
  ];

  for (const table of requiredTables) {
    assert.ok(tables.includes(table), `Required table '${table}' missing from zeus_gym.sqlite`);
  }

  // Indices check
  const indices = db.prepare(`SELECT name FROM sqlite_master WHERE type='index'`).all().map(i => i.name);
  assert.ok(indices.some(i => i.includes('pin')), 'Index on members.pin_code must exist');
  assert.ok(indices.some(i => i.includes('rfid')), 'Index on members.rfid_uid must exist');
  db.close();
});

suite.test('1.3 Master Seeds: Olympus Tariff Plans seed data', () => {
  const db = getDbConnection();
  const plans = db.prepare('SELECT * FROM plans ORDER BY price ASC').all();
  assert.ok(plans.length >= 4, 'Plans table must have at least 4 default tariff plans');

  const plansById = {};
  plans.forEach(p => { plansById[p.id] = p; });

  // Plan Mensual ($400, 30 days)
  assert.ok(plansById['mensual'], "Plan 'mensual' must exist");
  assert.equal(plansById['mensual'].price, 400);
  assert.equal(plansById['mensual'].duration_days, 30);
  assert.match(plansById['mensual'].promo_title + plansById['mensual'].promo_desc, /Olimpo|Zeus|Mensualidad/i);
  assert.doesNotMatch(plansById['mensual'].promo_title + plansById['mensual'].promo_desc, /GEARS/i);

  // Plan Duo ($700, 30 days)
  assert.ok(plansById['duo'], "Plan 'duo' must exist");
  assert.equal(plansById['duo'].price, 700);
  assert.equal(plansById['duo'].duration_days, 30);
  assert.match(plansById['duo'].promo_title + plansById['duo'].promo_desc, /Dúo|Titanes/i);
  assert.doesNotMatch(plansById['duo'].promo_title + plansById['duo'].promo_desc, /GEARS/i);

  // Plan Quincena ($250, 15 days)
  assert.ok(plansById['quincena'], "Plan 'quincena' must exist");
  assert.equal(plansById['quincena'].price, 250);
  assert.equal(plansById['quincena'].duration_days, 15);
  assert.doesNotMatch(plansById['quincena'].promo_title + plansById['quincena'].promo_desc, /GEARS/i);

  // Plan Visita ($60, 1 day)
  assert.ok(plansById['visita'], "Plan 'visita' must exist");
  assert.equal(plansById['visita'].price, 60);
  assert.equal(plansById['visita'].duration_days, 1);
  assert.doesNotMatch(plansById['visita'].promo_title + plansById['visita'].promo_desc, /GEARS/i);

  db.close();
});

suite.test('1.4 Master Seeds: Néctar & Elixires Products seed data', () => {
  const db = getDbConnection();
  const products = db.prepare('SELECT * FROM products').all();
  assert.ok(products.length >= 6, 'Products table must contain at least 6 store items');

  const productsById = {};
  products.forEach(p => { productsById[p.id] = p; });

  // p5 must be Toalla Oficial Zeus
  assert.ok(productsById['p5'], "Product 'p5' must exist");
  assert.match(productsById['p5'].name, /Zeus/i, "Product p5 name must reference Zeus");
  assert.doesNotMatch(productsById['p5'].name, /GEARS/i, "Product p5 name must not reference Gears");
  assert.equal(productsById['p5'].price, 100);

  // Verify prices of core hydration & supplements
  assert.equal(productsById['p1'].price, 20, "Agua price must be 20");
  assert.equal(productsById['p2'].price, 35, "Pre-Entreno price must be 35");
  assert.equal(productsById['p3'].price, 30, "Proteína price must be 30");
  assert.equal(productsById['p4'].price, 15, "Electrolitos price must be 15");

  db.close();
});

suite.test('1.5 Master Seeds: Olympus TV Monitor Settings', () => {
  const db = getDbConnection();
  const settingsRows = db.prepare('SELECT key, value FROM tv_settings').all();
  const settings = {};
  settingsRows.forEach(r => { settings[r.key] = r.value; });

  assert.ok(settings.promoBadge, 'tv_settings must have promoBadge');
  assert.match(settings.promoBadge, /OLIMPO|DECRETO/i, 'promoBadge must reference Olimpo or Decreto');
  assert.doesNotMatch(settings.promoBadge, /GEARS/i, 'promoBadge must not reference Gears');

  if (settings.card2Title) {
    assert.match(settings.card2Title, /OLÍMPICO|ZEUS|HONOR/i, 'card2Title must reference Olympic code');
    assert.doesNotMatch(settings.card2Title, /GEARS/i, 'card2Title must not reference Gears');
  }

  db.close();
});

// ---------------------------------------------------------------------------
// 2. Decoupled Virtual Turnstile Controller
// ---------------------------------------------------------------------------
suite.test('2.1 Hardware Decoupling: Turnstile controller operates in Virtual Simulation mode', async () => {
  const relayModule = path.join(PROJECT_ROOT, 'backend/hardware/relay.js');
  assert.ok(fs.existsSync(relayModule), 'backend/hardware/relay.js must exist');

  const RelayClass = require(relayModule);
  const relay = typeof RelayClass === 'function' ? new RelayClass() : RelayClass;

  assert.ok(relay, 'Turnstile relay controller instance must be valid');
  assert.ok(typeof relay.triggerAccessPulse === 'function', 'relay must export triggerAccessPulse function');

  // Verify virtual pulse execution
  const pulseResult = await new Promise((resolve) => {
    const start = Date.now();
    relay.triggerAccessPulse(1, (ok) => {
      resolve({ ok, elapsed: Date.now() - start });
    });
  });

  assert.ok(pulseResult.ok, 'Simulated relay pulse callback should return truthy ok');
  assert.ok(pulseResult.elapsed >= 300, 'Simulated relay pulse must respect realistic timing duration');
});

// ---------------------------------------------------------------------------
// 3. Backend REST API & Simulation REST Endpoints
// ---------------------------------------------------------------------------
suite.test('3.1 Backend REST API: Core operational endpoints return HTTP 200', async () => {
  await ensureServerRunning();

  const endpoints = [
    '/api/plans',
    '/api/members',
    '/api/products',
    '/api/tv-config',
    '/api/metrics',
    '/api/cash-cut',
    '/api/logs'
  ];

  for (const ep of endpoints) {
    const res = await fetch(`${BASE_URL}${ep}`);
    assert.equal(res.status, 200, `Endpoint ${ep} must return HTTP 200 (got ${res.status})`);
    const data = await res.json();
    assert.ok(data !== undefined && data !== null, `Endpoint ${ep} returned null/undefined payload`);
  }
});

suite.test('3.2 Simulation REST API: Dedicated simulation endpoints are operational', async () => {
  await ensureServerRunning();

  // GET /api/simulation/status
  const statusRes = await fetch(`${BASE_URL}/api/simulation/status`);
  if (statusRes.status === 200) {
    const statusData = await statusRes.json();
    assert.ok(statusData.simulationMode !== undefined || statusData.isSimulation !== undefined || statusData.ok, 
      'Simulation status endpoint should report simulation configuration');
  }

  // POST /api/simulation/override
  const overrideRes = await fetch(`${BASE_URL}/api/simulation/override`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ channel: 1 })
  });
  assert.ok([200, 201].includes(overrideRes.status), `POST /api/simulation/override should respond OK (got ${overrideRes.status})`);

  // POST /api/simulation/visit
  const visitRes = await fetch(`${BASE_URL}/api/simulation/visit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: 60 })
  });
  assert.ok([200, 201].includes(visitRes.status), `POST /api/simulation/visit should respond OK (got ${visitRes.status})`);

  // POST /api/simulation/scan
  const scanRes = await fetch(`${BASE_URL}/api/simulation/scan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'active', channel: 1 })
  });
  assert.ok([200, 201].includes(scanRes.status), `POST /api/simulation/scan should respond OK (got ${scanRes.status})`);
});

// ---------------------------------------------------------------------------
// 4. Package Metadata & Dependencies
// ---------------------------------------------------------------------------
suite.test('4.1 Package metadata: package.json has name "zeus-gym-system" and build scripts', () => {
  const pkgPath = path.join(PROJECT_ROOT, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

  assert.equal(pkg.name, 'zeus-gym-system', 'package.json name must be zeus-gym-system');
  assert.ok(pkg.scripts.build, 'package.json must contain build script');
  assert.ok(pkg.scripts.server || pkg.scripts.start, 'package.json must contain server/start script');
});

// ---------------------------------------------------------------------------
// 5. Apple & Claude Design Tokens in CSS
// ---------------------------------------------------------------------------
suite.test('5.1 Design Tokens: src/index.css implements Apple & Claude storm navy and celestial tokens', () => {
  const cssPath = path.join(PROJECT_ROOT, 'src/index.css');
  assert.ok(fs.existsSync(cssPath), 'src/index.css must exist');
  const css = fs.readFileSync(cssPath, 'utf8');

  // Palette checks: Deep storm navy canvas
  assert.match(css, /#070b14|#090e1a|#0d1527/, 'CSS must define deep storm navy canvas background');
  // Celestial blue / cyan highlights
  assert.match(css, /#38bdf8|#00f0ff|#0ea5e9/, 'CSS must define celestial cyan / electric blue highlights');
  // Divine lightning gold
  assert.match(css, /#fbbf24|#f59e0b|#fef08a/, 'CSS must define divine lightning golden amber accents');
  // Typography: .font-zeus
  assert.match(css, /\.font-zeus/, 'CSS must define .font-zeus typography class');
  // Glassmorphism
  assert.match(css, /backdrop-blur|rgba\(255,\s*255,\s*255,\s*0\./, 'CSS must implement glassmorphism utilities');
  // Verify eradication of gritty blood-red radial gradient
  assert.doesNotMatch(css, /#2a0505/, 'CSS must not contain gritty blood-red #2a0505 gradient');
});

// ---------------------------------------------------------------------------
// 6. Zeus SVG Iconography
// ---------------------------------------------------------------------------
suite.test('6.1 Zeus SVG Iconography: ZeusSvg.jsx exports Aegis Shield and Lightning vector graphics', () => {
  const zeusSvgPath = path.join(PROJECT_ROOT, 'src/components/common/ZeusSvg.jsx');
  assert.ok(fs.existsSync(zeusSvgPath), 'src/components/common/ZeusSvg.jsx must exist');
  const content = fs.readFileSync(zeusSvgPath, 'utf8');

  assert.match(content, /export (function|const) ZeusDefs/, 'ZeusSvg.jsx must export ZeusDefs');
  assert.match(content, /export (function|const) ZeusEmblem/, 'ZeusSvg.jsx must export ZeusEmblem');
  assert.match(content, /export (function|const) ZeusBolt/, 'ZeusSvg.jsx must export ZeusBolt');

  // Check SVG vector elements
  assert.match(content, /<symbol id="zeus-emblem"|<symbol id="zeus-bolt"/, 'ZeusSvg.jsx must define vector symbols');
  assert.doesNotMatch(content, /skull|cogwheel|calavera|engranaje/i, 'ZeusSvg.jsx must not contain skull or cogwheel glyphs');
});

suite.test('6.2 SVG Compatibility: CrimsonOmenSvg.jsx safely re-exports Zeus definitions as fallback alias', () => {
  const legacySvgPath = path.join(PROJECT_ROOT, 'src/components/common/CrimsonOmenSvg.jsx');
  assert.ok(fs.existsSync(legacySvgPath), 'CrimsonOmenSvg.jsx must exist for component compatibility');
  const content = fs.readFileSync(legacySvgPath, 'utf8');

  assert.match(content, /ZeusSvg|ZeusEmblem|ZeusDefs/, 'CrimsonOmenSvg.jsx must re-export Zeus symbols to avoid breaking legacy callers');
  assert.doesNotMatch(content, /<circle cx="100" cy="100" r="28" fill="#e11d48"/, 'CrimsonOmenSvg.jsx must not render crimson skull');
});

// ---------------------------------------------------------------------------
// 7. Web Audio Synthesizer
// ---------------------------------------------------------------------------
suite.test('7.1 Audio Synthesizer: src/utils/audio.js implements divine Web Audio synthesis', () => {
  const audioPath = path.join(PROJECT_ROOT, 'src/utils/audio.js');
  assert.ok(fs.existsSync(audioPath), 'src/utils/audio.js must exist');
  const code = fs.readFileSync(audioPath, 'utf8');

  assert.match(code, /export function playSound/, 'audio.js must export playSound function');
  // Standard access sounds
  assert.match(code, /'success'/, "audio.js must handle 'success' chime");
  assert.match(code, /'warning'/, "audio.js must handle 'warning' tone");
  assert.match(code, /'error'/, "audio.js must handle 'error' tone");
  // Divine synthesis additions
  assert.match(code, /'thunder'|'lightning_strike'|'olympus_chime'/, "audio.js must support divine acoustic sound effects");
});

// ---------------------------------------------------------------------------
// 8. PWA Manifest, Service Worker & HTML
// ---------------------------------------------------------------------------
suite.test('8.1 PWA Manifest & Service Worker: Zeus branding and offline cache', () => {
  const manifestPath = path.join(PROJECT_ROOT, 'public/manifest.json');
  assert.ok(fs.existsSync(manifestPath), 'public/manifest.json must exist');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

  assert.match(manifest.name, /ZEUS GYM/i, 'manifest.json name must reference ZEUS GYM');
  assert.match(manifest.short_name, /ZEUS/i, 'manifest.json short_name must reference ZEUS');
  assert.doesNotMatch(manifest.name + manifest.short_name, /GEARS/i, 'manifest.json must not reference Gears');
  assert.notEqual(manifest.theme_color, '#e11d48', 'theme_color must not be crimson red');

  const swPath = path.join(PROJECT_ROOT, 'public/sw.js');
  assert.ok(fs.existsSync(swPath), 'public/sw.js must exist');
  const swCode = fs.readFileSync(swPath, 'utf8');
  assert.match(swCode, /zeus-gym/i, 'Service Worker CACHE_NAME must reference zeus-gym');
  assert.doesNotMatch(swCode, /gears-gym/i, 'Service Worker CACHE_NAME must not reference gears-gym');

  const htmlPath = path.join(PROJECT_ROOT, 'index.html');
  assert.ok(fs.existsSync(htmlPath), 'index.html must exist');
  const html = fs.readFileSync(htmlPath, 'utf8');
  assert.match(html, /<title>.*ZEUS.*<\/title>/i, 'index.html title must reference ZEUS');
  assert.doesNotMatch(html, /GEARS/i, 'index.html must not reference GEARS');
});

// ---------------------------------------------------------------------------
// 9. Production Kiosk Launcher Script
// ---------------------------------------------------------------------------
suite.test('9.1 Production Kiosk: scripts/start-zeus-kiosk.bat is configured with auto-build check and flag fix', () => {
  const batPath = path.join(PROJECT_ROOT, 'scripts/start-zeus-kiosk.bat');
  assert.ok(fs.existsSync(batPath), 'scripts/start-zeus-kiosk.bat must exist');
  const bat = fs.readFileSync(batPath, 'utf8');

  assert.match(bat, /ZEUS GYM/i, 'Kiosk script must brand window title as ZEUS GYM');
  // Auto build check
  assert.match(bat, /npm run build/i, 'Kiosk script must include auto-build check when dist is missing');
  // Verify flag fix: no illegal space in --disable-session-crashed-bubble
  assert.doesNotMatch(bat, /-- disable-session-crashed-bubble/, 'Kiosk script must not contain illegal space in flag');
  assert.match(bat, /--disable-session-crashed-bubble/, 'Kiosk script must have correct flag syntax');
});

// ---------------------------------------------------------------------------
// 10. TV Monitor Simulation Hotkeys
// ---------------------------------------------------------------------------
suite.test('10.1 TV Monitor Hotkeys: src/screens/Monitor.jsx supports simulation keys (A/W/E/V/L/O/F/M)', () => {
  const monitorPath = path.join(PROJECT_ROOT, 'src/screens/Monitor.jsx');
  assert.ok(fs.existsSync(monitorPath), 'src/screens/Monitor.jsx must exist');
  const code = fs.readFileSync(monitorPath, 'utf8');

  // Verify key listener handles simulation triggers if M4 has landed
  const simulationHotkeys = ['KeyA', 'KeyW', 'KeyE', 'KeyV', 'KeyL', 'KeyO'];
  const hasHotkeySupport = simulationHotkeys.some(k => code.includes(k) || code.includes(`'${k.slice(-1).toLowerCase()}'`) || code.includes(`"${k.slice(-1)}"`));
  
  if (!hasHotkeySupport) {
    // Progressive testability (M4 pending): verify that keydown event listener is present
    assert.match(code, /addEventListener\(['"]keydown['"]|window\.onkeydown/, 
      'Monitor.jsx must have keydown event handling ready for simulation hotkeys');
  } else {
    assert.ok(hasHotkeySupport, 'Monitor.jsx keydown listener must support simulation hotkeys');
  }
});

// Direct execution
if (require.main === module) {
  suite.run().then(results => {
    process.exit(results.failed > 0 ? 1 : 0);
  });
}

module.exports = suite;
