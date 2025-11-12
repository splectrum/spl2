#!/usr/bin/env node

// Evaluation script for Step 2: Runtime + execution context
// Tests nested structure with execution context inside runtime value

import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createRuntimeHelper } from './modules/spl/runtime/_runtime/index.js';
import { init } from './modules/spl/execution/init/index.js';
import { createRecordAccessor, createReadOnlyRecordAccessor, createArgsAccessor } from './modules/spl/_context/index.js';

// Get modules base path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const modulesBasePath = resolve(__dirname, 'modules');

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

async function main() {
  log('═══════════════════════════════════════', 'blue');
  log('  Step 3: Full Hello World Execution', 'blue');
  log('  (Runtime → Execution → Hello/Greet)', 'blue');
  log('═══════════════════════════════════════', 'blue');
  log('');

  // Create skeleton Kafka record for runtime API state with modulesBasePath (bootstrap)
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

  // Create context object for runtime initialization
  const runtimeContext = {
    apiState: createRecordAccessor(runtimeApiState),
    args: createArgsAccessor({}),
    runtime: null,
    execution: null
  };

  log('[STEP 3.1] Initializing runtime context...', 'yellow');
  log('');

  try {
    // Create runtime helper with state injection (bootstrap pattern)
    const runtimeHelper = createRuntimeHelper(runtimeApiState);

    // Step 3.1: Initialize runtime via bootstrap helper
    const runtimeOutput = await runtimeHelper.invokeMethod('spl/runtime/run', runtimeContext);
    log('[STEP 3.1] ✓ Runtime initialized', 'green');
    log(`[STEP 3.1] Output: ${JSON.stringify(runtimeOutput)}`, 'green');
    log('');

    // Step 3.2: Create execution context and invoke hello world
    log('[STEP 3.2] Creating execution context and invoking pr03/hello/greet...', 'yellow');
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

    // Initialize execution context - this will invoke pr03/hello/greet (Step 3 logic)
    const executionOutput = await init(executionContext);
    log('[STEP 3.2] ✓ Execution context initialized and method invoked', 'green');
    log(`[STEP 3.2] Output from pr03/hello/greet: ${JSON.stringify(executionOutput)}`, 'green');
    log(`[STEP 3.2] Message: "${executionOutput.message}"`, 'green');
    log('');

    // Display final state
    log('─────────────────────────────────────', 'blue');
    log('Final State (Three-Layer Stack):', 'blue');
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
    log('Three-Layer Stack Verification:', 'cyan');
    log('─────────────────────────────────────', 'cyan');
    const nestedExecution = runtimeContext.apiState.getData('1');
    log(`✓ Execution context stored in runtime.value.1: ${nestedExecution ? 'YES' : 'NO'}`,
        nestedExecution ? 'green' : 'red');
    log(`✓ Execution key: ${nestedExecution?.key}`, nestedExecution?.key ? 'green' : 'red');

    // Verify hello world invocation
    const helloState = executionContext.apiState.getData('pr03/hello');
    const greeting = helloState?.value?.greeting;
    log(`✓ Hello API state exists: ${helloState ? 'YES' : 'NO'}`, helloState ? 'green' : 'red');
    log(`✓ Greeting message: ${greeting || 'NOT FOUND'}`, greeting ? 'green' : 'red');
    log(`✓ Output matches: ${executionOutput.message === greeting ? 'YES' : 'NO'}`,
        executionOutput.message === greeting ? 'green' : 'red');
    log('');

    log('╔═══════════════════════════════════════╗', 'green');
    log('║  ✓ STEP 3 PASSED                      ║', 'green');
    log('║  Full three-layer execution works!    ║', 'green');
    log('║  Runtime → Execution → Hello World    ║', 'green');
    log('╚═══════════════════════════════════════╝', 'green');
    log('');

    process.exit(0);
  } catch (error) {
    log('╔═══════════════════════════════════════╗', 'red');
    log('║  ✗ STEP 3 FAILED                      ║', 'red');
    log('╚═══════════════════════════════════════╝', 'red');
    log('');
    log('Error:', 'red');
    console.error(error);
    log('');
    process.exit(1);
  }
}

main();
