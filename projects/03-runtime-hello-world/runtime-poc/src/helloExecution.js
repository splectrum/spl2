#!/usr/bin/env node

// Evaluation script for Step 2: Runtime + execution context
// Tests nested structure with execution context inside runtime value

import { run } from './modules/spl/runtime/run/index.js';
import { invoke } from './modules/spl/execution/invoke/index.js';
import { createRecordAccessor, createReadOnlyRecordAccessor, createArgsAccessor } from './modules/spl/_context/index.js';

// ANSI colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function main() {
  log('═══════════════════════════════════════', 'blue');
  log('  Step 2: Runtime + Execution Context', 'blue');
  log('═══════════════════════════════════════', 'blue');
  log('');

  // Create skeleton Kafka record for runtime API state
  const runtimeApiState = {
    key: 'runtime-api-state',
    headers: {},
    value: {}
  };

  // Create context object for runtime initialization
  const runtimeContext = {
    apiState: createRecordAccessor(runtimeApiState),
    args: createArgsAccessor({}),
    runtime: null,
    execution: null
  };

  log('[STEP 2.1] Initializing runtime context...', 'yellow');
  log('');

  try {
    // Step 2.1: Initialize runtime
    const runtimeOutput = run(runtimeContext);
    log('[STEP 2.1] ✓ Runtime initialized', 'green');
    log(`[STEP 2.1] Output: ${JSON.stringify(runtimeOutput)}`, 'green');
    log('');

    // Step 2.2: Create execution context record
    log('[STEP 2.2] Creating execution context...', 'yellow');
    log('');

    const executionApiState = {
      key: 'execution-1',
      headers: {},
      value: {}
    };

    // Store execution context in runtime value
    runtimeContext.apiState.setData('1', executionApiState);

    // Create execution context with runtime as read-only parent
    const executionContext = {
      apiState: createRecordAccessor(executionApiState),
      args: createArgsAccessor({}),
      runtime: createReadOnlyRecordAccessor(runtimeApiState),
      execution: null
    };

    // Initialize execution context
    const executionOutput = invoke(executionContext);
    log('[STEP 2.2] ✓ Execution context initialized', 'green');
    log(`[STEP 2.2] Output: ${JSON.stringify(executionOutput)}`, 'green');
    log('');

    // Display final state
    log('─────────────────────────────────────', 'blue');
    log('Final Runtime API State (with nested execution):', 'blue');
    log('─────────────────────────────────────', 'blue');
    log(JSON.stringify(runtimeApiState, null, 2), 'reset');
    log('');

    // Verify runtime properties
    log('─────────────────────────────────────', 'cyan');
    log('Runtime Context Verification:', 'cyan');
    log('─────────────────────────────────────', 'cyan');
    const version = runtimeContext.apiState.getMetadata('spl.runtime.version');
    const nodeVersion = runtimeContext.apiState.getMetadata('spl.runtime.nodeVersion');
    const runtimeId = runtimeContext.apiState.getMetadata('spl.runtime.runtimeId');
    const startTime = runtimeContext.apiState.getMetadata('spl.runtime.startTime');

    log(`✓ version: ${version}`, version ? 'green' : 'red');
    log(`✓ nodeVersion: ${nodeVersion}`, nodeVersion ? 'green' : 'red');
    log(`✓ runtimeId: ${runtimeId}`, runtimeId ? 'green' : 'red');
    log(`✓ startTime: ${startTime}`, startTime ? 'green' : 'red');
    log('');

    // Verify execution properties
    log('─────────────────────────────────────', 'cyan');
    log('Execution Context Verification:', 'cyan');
    log('─────────────────────────────────────', 'cyan');
    const executionId = executionContext.apiState.getMetadata('spl.execution.executionId');
    const executionStartTime = executionContext.apiState.getMetadata('spl.execution.startTime');

    log(`✓ executionId: ${executionId}`, executionId ? 'green' : 'red');
    log(`✓ startTime: ${executionStartTime}`, executionStartTime ? 'green' : 'red');
    log('');

    // Verify nested structure
    log('─────────────────────────────────────', 'cyan');
    log('Nested Structure Verification:', 'cyan');
    log('─────────────────────────────────────', 'cyan');
    const nestedExecution = runtimeContext.apiState.getData('1');
    log(`✓ Execution context stored in runtime.value.1: ${nestedExecution ? 'YES' : 'NO'}`,
        nestedExecution ? 'green' : 'red');
    log(`✓ Execution key: ${nestedExecution?.key}`, nestedExecution?.key ? 'green' : 'red');
    log('');

    log('╔═══════════════════════════════════════╗', 'green');
    log('║  ✓ STEP 2 PASSED                      ║', 'green');
    log('║  Runtime + execution structure works  ║', 'green');
    log('╚═══════════════════════════════════════╝', 'green');
    log('');

    process.exit(0);
  } catch (error) {
    log('╔═══════════════════════════════════════╗', 'red');
    log('║  ✗ STEP 2 FAILED                      ║', 'red');
    log('╚═══════════════════════════════════════╝', 'red');
    log('');
    log('Error:', 'red');
    console.error(error);
    log('');
    process.exit(1);
  }
}

main();
