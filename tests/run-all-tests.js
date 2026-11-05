#!/usr/bin/env node
/**
 * tests/run-all-tests.js
 * Master Automated Test Runner for Gym_Sistem_Zeus
 * 
 * Executes all 4 test tiers + Forensic Integrity suite:
 * - Tier 1: Feature Coverage (Schema, APIs, Tokens, SVGs, Audio, Kiosk, Hotkeys)
 * - Tier 2: Boundary & Corner Cases (Invalid scans, Expired, Malformed, Anti-bounce, Underflow)
 * - Tier 3: Cross-Feature Integration (Scan -> Logs -> Metrics -> Sockets -> Occupancy)
 * - Tier 4: Real-World Workload Scenarios (Complete Olympus Gym Day Shift Lifecycle)
 * - Forensic Brand Integrity Gate (Zero legacy Gears / Crimson Omen occurrences)
 * 
 * Usage:
 *   node tests/run-all-tests.js
 *   node Gym_Sistem_Zeus/tests/run-all-tests.js
 */

const path = require('path');
const { ensureServerRunning, stopServer } = require('./test-helper');

const SUITES = [
  { file: './tier1-features.test', name: 'Tier 1: Feature Coverage' },
  { file: './tier2-boundaries.test', name: 'Tier 2: Boundary & Corner Cases' },
  { file: './tier3-integration.test', name: 'Tier 3: Cross-Feature Integration' },
  { file: './tier4-workloads.test', name: 'Tier 4: Real-World Workload Scenarios' },
  { file: './forensic-integrity.test', name: 'Forensic Brand Integrity Gate' }
];

async function main() {
  console.log(`\n\x1b[36m⚡====================================================================⚡\x1b[0m`);
  console.log(`\x1b[36m     GYM ZEUS — MASTER AUTOMATED TEST RUNNER (4 TIERS + FORENSIC)      \x1b[0m`);
  console.log(`\x1b[36m⚡====================================================================⚡\x1b[0m\n`);

  console.log(`[HARNESS] Initializing test environment...`);
  const serverInfo = await ensureServerRunning().catch(err => {
    console.warn(`[HARNESS] Note on server launch: ${err.message}`);
    return { spawned: false };
  });

  if (serverInfo && serverInfo.url) {
    console.log(`[HARNESS] Backend test server ready at ${serverInfo.url}\n`);
  }

  const overallStart = Date.now();
  const summaryReport = [];
  let totalTests = 0;
  let totalPassed = 0;
  let totalFailed = 0;

  for (const { file, name } of SUITES) {
    try {
      const suiteModule = require(file);
      const result = await suiteModule.run();

      totalTests += result.total;
      totalPassed += result.passed;
      totalFailed += result.failed;

      summaryReport.push({
        name,
        total: result.total,
        passed: result.passed,
        failed: result.failed,
        duration: result.duration,
        status: result.failed === 0 ? 'PASS' : 'FAIL'
      });
    } catch (err) {
      console.error(`\x1b[31m[ERROR] Failed to execute suite ${name}:\x1b[0m`, err);
      totalFailed++;
      summaryReport.push({
        name,
        total: 1,
        passed: 0,
        failed: 1,
        duration: 0,
        status: 'FAIL'
      });
    }
  }

  await stopServer();
  const totalDuration = Date.now() - overallStart;

  // Print Summary Table
  console.log(`\n\x1b[36m====================================================================\x1b[0m`);
  console.log(`                 TEST SUITE EXECUTION SUMMARY                       `);
  console.log(`\x1b[36m====================================================================\x1b[0m`);
  console.log(`  SUITE NAME                               STATUS   PASS/TOTAL  TIME`);
  console.log(`--------------------------------------------------------------------`);

  for (const item of summaryReport) {
    const statusColor = item.status === 'PASS' ? '\x1b[32m✔ PASS\x1b[0m' : '\x1b[31m✖ FAIL\x1b[0m';
    const counts = `${item.passed}/${item.total}`.padStart(9);
    const duration = `${item.duration}ms`.padStart(7);
    const namePadded = item.name.padEnd(40);
    console.log(`  ${namePadded} ${statusColor}  ${counts} ${duration}`);
  }

  console.log(`--------------------------------------------------------------------`);
  const finalStatus = totalFailed === 0 
    ? `\x1b[32m✔ ALL SUITES PASSED (${totalPassed}/${totalTests})\x1b[0m` 
    : `\x1b[31m✖ TEST FAILURES DETECTED (${totalFailed} failed)\x1b[0m`;
  console.log(`  OVERALL RESULT: ${finalStatus} in ${totalDuration}ms`);
  console.log(`\x1b[36m====================================================================\x1b[0m\n`);

  process.exit(totalFailed === 0 ? 0 : 1);
}

main().catch(err => {
  console.error('[FATAL] Test runner crashed:', err);
  process.exit(1);
});
