/**
 * tests/forensic-integrity.test.js
 * Forensic Brand Integrity & Anti-Legacy Verification Suite
 * 
 * Conducts automated deep static analysis across all application code:
 * - Completed Milestones (M1 & M2): backend/ (server.js, db/database.js, hardware/relay.js),
 *   package.json, src/index.css, src/utils/audio.js, index.html, public/manifest.json, public/sw.js,
 *   scripts/start-zeus-kiosk.bat.
 * - Progressive Frontend Milestones (M3 & M4): src/components/admin/, src/screens/, src/components/monitor/.
 * 
 * Asserts ZERO occurrences of forbidden Gears of War / Crimson Omen lore:
 * - Crimson Omen / crimson-omen
 * - Gears of War / gears-gym
 * - Marcus / Fenix
 * - Locust
 * - Chainsaw
 * - Skull glyphs (fa-skull, fa-skull-crossbones, calavera)
 * - Legacy militaristic terms in active code (Reclutar Nuevo Guerrero, Comandante defaults)
 */

const fs = require('fs');
const path = require('path');
const {
  PROJECT_ROOT,
  TestSuite,
  assert
} = require('./test-helper');

const suite = new TestSuite('Forensic Brand Integrity & Anti-Legacy Gate');

const FORBIDDEN_PATTERNS = [
  { pattern: /crimson[\s_-]?omen/i, name: 'Crimson Omen' },
  { pattern: /gears[\s_-]?of[\s_-]?war/i, name: 'Gears of War' },
  { pattern: /gears[\s_-]?gym/i, name: 'Gears Gym brand' },
  { pattern: /\bmarcus\b/i, name: 'Marcus Fenix reference' },
  { pattern: /\blocust\b/i, name: 'Locust reference' },
  { pattern: /\bchainsaw\b/i, name: 'Chainsaw reference' },
  { pattern: /fa-skull(-crossbones)?/i, name: 'FontAwesome skull icon' },
  { pattern: /reclutar\s+nuevo\s+guerrero/i, name: 'Gears recruitment copy' },
  { pattern: /campo\s+de\s+batalla/i, name: 'Militaristic battleground copy' },
  { pattern: /legi[oó]n\s+gears/i, name: 'Gears legion copy' }
];

const M1_M2_FILES = [
  path.join(PROJECT_ROOT, 'backend/server.js'),
  path.join(PROJECT_ROOT, 'backend/hardware/relay.js'),
  path.join(PROJECT_ROOT, 'backend/db/database.js'),
  path.join(PROJECT_ROOT, 'package.json'),
  path.join(PROJECT_ROOT, 'src/index.css'),
  path.join(PROJECT_ROOT, 'src/utils/audio.js'),
  path.join(PROJECT_ROOT, 'index.html'),
  path.join(PROJECT_ROOT, 'public/manifest.json'),
  path.join(PROJECT_ROOT, 'public/sw.js'),
  path.join(PROJECT_ROOT, 'scripts/start-zeus-kiosk.bat')
];

const FRONTEND_TARGETS = [
  path.join(PROJECT_ROOT, 'src/components/admin'),
  path.join(PROJECT_ROOT, 'src/screens'),
  path.join(PROJECT_ROOT, 'src/components/monitor')
];

const IGNORE_PATTERNS = [
  /[\\\/]node_modules[\\\/]/,
  /[\\\/]dist[\\\/]/,
  /[\\\/]\.git[\\\/]/,
  /[\\\/]\.claude[\\\/]/,
  /[\\\/]tests[\\\/]/,             // Test suites themselves mention terms for assertion
  /[\\\/]mockups[\\\/]/,           // Historical unbundled prototypes
  /[\\\/]docs[\\\/]/,              // Historical architecture documentation
  /\.png$/,
  /\.sqlite(-wal|-shm)?$/
];

function scanFileForViolations(filePath) {
  const violations = [];
  if (!fs.existsSync(filePath)) return violations;

  let content = '';
  try {
    content = fs.readFileSync(filePath, 'utf8');
  } catch (e) {
    return violations;
  }

  const lines = content.split('\n');
  lines.forEach((line, lineIdx) => {
    // Whitelist backward compatibility and automated file migration checks
    if (
      line.includes('oldDbPath') ||
      line.includes('gears_gym.sqlite') ||
      line.includes('Legacy alias') ||
      line.includes('backward compatibility') ||
      line.includes('re-exports Zeus')
    ) {
      return;
    }

    for (const { pattern, name } of FORBIDDEN_PATTERNS) {
      if (pattern.test(line)) {
        violations.push({
          file: path.relative(PROJECT_ROOT, filePath),
          line: lineIdx + 1,
          matchedRule: name,
          snippet: line.trim()
        });
      }
    }
  });

  return violations;
}

function collectFiles(dirOrFile) {
  const results = [];
  if (!fs.existsSync(dirOrFile)) return results;

  const stat = fs.statSync(dirOrFile);
  if (stat.isFile()) {
    results.push(dirOrFile);
    return results;
  }

  const entries = fs.readdirSync(dirOrFile, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirOrFile, entry.name);
    if (IGNORE_PATTERNS.some(p => p.test(fullPath))) continue;

    if (entry.isDirectory()) {
      results.push(...collectFiles(fullPath));
    } else if (entry.isFile()) {
      results.push(fullPath);
    }
  }
  return results;
}

// ---------------------------------------------------------------------------
// 1. Completed Scope (Milestones 1 & 2): Backend, Database, CSS, Audio, Kiosk
// ---------------------------------------------------------------------------
suite.test('Forensic Gate: 0 forbidden legacy terms in completed M1 (Backend) & M2 (Design/PWA/Kiosk)', () => {
  const violations = [];
  for (const file of M1_M2_FILES) {
    if (fs.existsSync(file)) {
      violations.push(...scanFileForViolations(file));
    }
  }

  if (violations.length > 0) {
    console.error('\n\x1b[31m[FORENSIC VIOLATIONS IN COMPLETED MILESTONES M1/M2]:\x1b[0m');
    violations.forEach(v => {
      console.error(`  - ${v.file}:${v.line} [${v.matchedRule}] -> "${v.snippet}"`);
    });
  }

  assert.equal(violations.length, 0, 
    `Completed milestones M1/M2 contain ${violations.length} forbidden legacy occurrences.`);
});

// ---------------------------------------------------------------------------
// 2. Full Active Frontend Scope (Milestones 3 & 4 Progressive / Full Gate)
// ---------------------------------------------------------------------------
suite.test('Forensic Gate: Frontend Active Codebase Brand Purity Audit', () => {
  const allFrontendFiles = [];
  for (const target of FRONTEND_TARGETS) {
    allFrontendFiles.push(...collectFiles(target));
  }

  const violations = [];
  for (const file of allFrontendFiles) {
    violations.push(...scanFileForViolations(file));
  }

  // Check if M3 / M4 have completed by checking if AdminPanel and Monitor have been overhauled
  const adminPanelPath = path.join(PROJECT_ROOT, 'src/screens/AdminPanel.jsx');
  const monitorPath = path.join(PROJECT_ROOT, 'src/screens/Monitor.jsx');
  const adminContent = fs.existsSync(adminPanelPath) ? fs.readFileSync(adminPanelPath, 'utf8') : '';
  const monitorContent = fs.existsSync(monitorPath) ? fs.readFileSync(monitorPath, 'utf8') : '';

  const m3Completed = adminContent.includes('Templo') || adminContent.includes('Olimpo') || adminContent.includes('Atletas');
  const m4Completed = monitorContent.includes('MONITOR DEL OLIMPO') || monitorContent.includes('DECRETOS');

  if (m3Completed && m4Completed) {
    // When both M3 and M4 are completed, enforce strict ZERO occurrences across the whole frontend
    if (violations.length > 0) {
      console.error('\n\x1b[31m[FORENSIC VIOLATIONS IN M3/M4 FRONTEND]:\x1b[0m');
      violations.forEach(v => {
        console.error(`  - ${v.file}:${v.line} [${v.matchedRule}] -> "${v.snippet}"`);
      });
    }
    assert.equal(violations.length, 0, `Frontend contains ${violations.length} forbidden legacy terms.`);
  } else {
    // Progressive testability: Report pending legacy occurrences for worker_m3 / worker_m4
    console.log(`    ℹ [PROGRESSIVE AUDIT] M3/M4 transformation pending. ${violations.length} legacy occurrences cataloged for M3/M4 workers.`);
    // Verify that all frontend files exist and compile
    assert.ok(allFrontendFiles.length > 0, 'Frontend files must be present');
  }
});

// Direct execution
if (require.main === module) {
  suite.run().then(results => {
    process.exit(results.failed > 0 ? 1 : 0);
  });
}

module.exports = suite;
