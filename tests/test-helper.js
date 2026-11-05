/**
 * tests/test-helper.js
 * Shared Test Harness for Gym_Sistem_Zeus 4-Tier Test Suite
 * 
 * Provides:
 * - Server lifecycle management (auto-detect / auto-spawn Express + Socket.IO)
 * - SQLite database access wrappers
 * - Socket.IO real-time test client with promise-based event waiting
 * - Zero-dependency async test runner with assertion helpers
 */

const http = require('http');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const assert = require('node:assert/strict');
const Database = require('better-sqlite3');
const { io } = require('socket.io-client');

const TEST_PORT = process.env.TEST_PORT || process.env.PORT || 3000;
const BASE_URL = `http://127.0.0.1:${TEST_PORT}`;
const PROJECT_ROOT = path.resolve(__dirname, '..');
const DB_PATH = process.env.DB_PATH || path.join(PROJECT_ROOT, 'backend/db/zeus_gym.sqlite');

let spawnedServerProcess = null;

/**
 * Checks if the server is already active on TEST_PORT
 */
async function isServerActive() {
  try {
    const res = await fetch(`${BASE_URL}/api/plans`, { signal: AbortSignal.timeout(1000) });
    return res.ok || res.status === 200 || res.status === 304;
  } catch (err) {
    return false;
  }
}

/**
 * Ensures backend server is running. If not running, spawns it as a child process.
 */
async function ensureServerRunning() {
  if (await isServerActive()) {
    return { spawned: false, url: BASE_URL };
  }

  return new Promise((resolve, reject) => {
    const serverScript = path.join(PROJECT_ROOT, 'backend/server.js');
    spawnedServerProcess = spawn('node', [serverScript], {
      cwd: PROJECT_ROOT,
      env: { ...process.env, PORT: String(TEST_PORT), HARDWARE_ENABLED: 'false' },
      stdio: 'pipe'
    });

    let stdoutData = '';
    let stderrData = '';

    spawnedServerProcess.stdout.on('data', (data) => {
      stdoutData += data.toString();
    });

    spawnedServerProcess.stderr.on('data', (data) => {
      stderrData += data.toString();
    });

    spawnedServerProcess.on('error', (err) => {
      reject(new Error(`Failed to start backend server: ${err.message}`));
    });

    spawnedServerProcess.on('exit', (code) => {
      if (code !== 0 && code !== null) {
        console.error(`Server exited unexpectedly with code ${code}. Stderr: ${stderrData}`);
      }
    });

    // Poll until server is ready
    const startTime = Date.now();
    const interval = setInterval(async () => {
      if (await isServerActive()) {
        clearInterval(interval);
        resolve({ spawned: true, url: BASE_URL });
      } else if (Date.now() - startTime > 10000) {
        clearInterval(interval);
        if (spawnedServerProcess) {
          spawnedServerProcess.kill();
        }
        reject(new Error(`Timed out waiting for server to start on ${BASE_URL}. Output:\n${stdoutData}\n${stderrData}`));
      }
    }, 200);
  });
}

/**
 * Stops spawned server process if one was started
 */
async function stopServer() {
  if (spawnedServerProcess) {
    try {
      spawnedServerProcess.kill('SIGTERM');
    } catch (e) {
      // Ignore process already dead
    }
    spawnedServerProcess = null;
  }
}

/**
 * Gets a fresh connection to SQLite database
 */
function getDbConnection() {
  if (!fs.existsSync(DB_PATH)) {
    // If zeus_gym.sqlite doesn't exist yet, try requiring database.js to initialize it
    try {
      require(path.join(PROJECT_ROOT, 'backend/db/database'));
    } catch (e) {
      // ignore
    }
  }
  const db = new Database(DB_PATH, { readonly: false });
  db.pragma('journal_mode = WAL');
  return db;
}

/**
 * Creates an authenticated or guest Socket.IO client
 */
function createSocketClient() {
  const socket = io(BASE_URL, {
    transports: ['websocket'],
    reconnection: false,
    timeout: 5000
  });

  const waitForEvent = (eventName, timeoutMs = 4000) => {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        socket.off(eventName, listener);
        reject(new Error(`Socket.IO timeout waiting for event '${eventName}' after ${timeoutMs}ms`));
      }, timeoutMs);

      const listener = (data) => {
        clearTimeout(timer);
        socket.off(eventName, listener);
        resolve(data);
      };

      socket.on(eventName, listener);
    });
  };

  const close = () => {
    if (socket && socket.connected) {
      socket.disconnect();
    }
  };

  return { socket, waitForEvent, close };
}

/**
 * Mini Test Framework: Suite & Test Runner
 */
class TestSuite {
  constructor(name) {
    this.name = name;
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
    this.errors = [];
  }

  test(description, fn) {
    this.tests.push({ description, fn });
  }

  async run() {
    console.log(`\n======================================================`);
    console.log(`  SUITE: ${this.name}`);
    console.log(`======================================================`);

    const suiteStart = Date.now();
    for (const t of this.tests) {
      const testStart = Date.now();
      try {
        await t.fn();
        const duration = Date.now() - testStart;
        this.passed++;
        console.log(`  \x1b[32m✔ PASS\x1b[0m [${duration}ms] ${t.description}`);
      } catch (err) {
        const duration = Date.now() - testStart;
        this.failed++;
        this.errors.push({ test: t.description, error: err });
        console.log(`  \x1b[31m✖ FAIL\x1b[0m [${duration}ms] ${t.description}`);
        console.log(`    \x1b[33mError:\x1b[0m ${err.message}`);
        if (err.stack && process.env.VERBOSE) {
          console.log(`    ${err.stack.split('\n').slice(1, 4).join('\n    ')}`);
        }
      }
    }

    const totalDuration = Date.now() - suiteStart;
    console.log(`------------------------------------------------------`);
    console.log(`  Total: ${this.tests.length} | \x1b[32mPassed: ${this.passed}\x1b[0m | \x1b[31mFailed: ${this.failed}\x1b[0m [${totalDuration}ms]\n`);

    return {
      name: this.name,
      total: this.tests.length,
      passed: this.passed,
      failed: this.failed,
      duration: totalDuration,
      errors: this.errors
    };
  }
}

module.exports = {
  TEST_PORT,
  BASE_URL,
  PROJECT_ROOT,
  DB_PATH,
  isServerActive,
  ensureServerRunning,
  stopServer,
  getDbConnection,
  createSocketClient,
  TestSuite,
  assert
};
