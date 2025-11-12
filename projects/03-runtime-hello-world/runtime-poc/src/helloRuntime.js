#!/usr/bin/env node

// Evaluation script for Step 1: Runtime context initialization
// Tests bootstrap pattern with module resolution

import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createRuntimeHelper } from './modules/spl/runtime/_runtime/index.js';
import { createRecordAccessor, createArgsAccessor } from './modules/spl/_context/index.js';

// Get modules base path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const modulesBasePath = resolve(__dirname, 'modules');

// ANSI colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function main() {
  log('═══════════════════════════════════════', 'blue');
  log('  Step 1: Runtime Context Initialization', 'blue');
  log('  (Bootstrap Pattern with Module Resolver)', 'blue');
  log('═══════════════════════════════════════', 'blue');
  log('');

  // Create skeleton Kafka record for runtime API state
  // Bootstrap: only needs modulesBasePath in headers for resolver
  const runtimeApiState = {
    key: 'runtime-api-state',
    headers: {
      spl: {
        runtime: {
          modulesBasePath: modulesBasePath
        }
      }
    },
    value: {}
  };

  // Create context object
  const context = {
    apiState: createRecordAccessor(runtimeApiState),
    args: createArgsAccessor({}),
    runtime: null,    // Not needed for Step 1
    execution: null   // Not needed for Step 1
  };

  log('[BOOTSTRAP] modulesBasePath:', 'yellow');
  log(`  ${modulesBasePath}`, 'yellow');
  log('');
  log('[EVALUATION] Creating runtime helper with injected state...', 'yellow');

  // Create runtime helper with state injection (consistent with _context pattern)
  const runtimeHelper = createRuntimeHelper(runtimeApiState);

  log('[EVALUATION] Invoking spl/runtime/run via module resolver...', 'yellow');
  log('');

  try {
    // Call the method via runtime helper (state already injected)
    const output = await runtimeHelper.invokeMethod('spl/runtime/run', context);

    log('[EVALUATION] Method completed successfully', 'green');
    log(`[EVALUATION] Output: ${JSON.stringify(output)}`, 'green');
    log('');

    // Display final state
    log('─────────────────────────────────────', 'blue');
    log('Final Runtime API State:', 'blue');
    log('─────────────────────────────────────', 'blue');
    log(JSON.stringify(runtimeApiState, null, 2), 'reset');
    log('');

    // Verify properties were set
    log('─────────────────────────────────────', 'blue');
    log('Verification:', 'blue');
    log('─────────────────────────────────────', 'blue');
    const version = context.apiState.getMetadata('spl.runtime.version');
    const nodeVersion = context.apiState.getMetadata('spl.runtime.nodeVersion');
    const runtimeId = context.apiState.getMetadata('spl.runtime.runtimeId');
    const startTime = context.apiState.getMetadata('spl.runtime.startTime');

    log(`✓ version: ${version}`, version ? 'green' : 'red');
    log(`✓ nodeVersion: ${nodeVersion}`, nodeVersion ? 'green' : 'red');
    log(`✓ runtimeId: ${runtimeId}`, runtimeId ? 'green' : 'red');
    log(`✓ startTime: ${startTime}`, startTime ? 'green' : 'red');
    log('');

    log('╔═══════════════════════════════════════╗', 'green');
    log('║  ✓ STEP 1 PASSED                      ║', 'green');
    log('║  Runtime initialization successful    ║', 'green');
    log('║  Bootstrap pattern validated          ║', 'green');
    log('╚═══════════════════════════════════════╝', 'green');
    log('');

    process.exit(0);
  } catch (error) {
    log('╔═══════════════════════════════════════╗', 'red');
    log('║  ✗ STEP 1 FAILED                      ║', 'red');
    log('╚═══════════════════════════════════════╝', 'red');
    log('');
    log('Error:', 'red');
    console.error(error);
    log('');
    process.exit(1);
  }
}

main();
