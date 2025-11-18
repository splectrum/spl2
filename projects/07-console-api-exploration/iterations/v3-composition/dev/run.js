// run.js - Execution harness for Console API exploration
// v3: Composition pattern - output merges with args

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { randomUUID } from 'crypto';
import { readFileSync } from 'fs';
import avro from 'avsc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to modules folder
const modulesPath = join(__dirname, '..', 'modules');

// -----------------------------------------------------------------------------
// Runtime - environment context properties
// -----------------------------------------------------------------------------
function createRuntime() {
  return {
    runtimeId: randomUUID(),
    startTime: new Date().toISOString(),
    nodeVersion: process.version,
    platform: process.platform
  };
}

// -----------------------------------------------------------------------------
// Schema loader - loads and caches AVRO types
// -----------------------------------------------------------------------------
function createSchemaLoader() {
  const cache = new Map();

  function loadSchema(schemaPath) {
    if (cache.has(schemaPath)) {
      return cache.get(schemaPath);
    }
    const schema = JSON.parse(readFileSync(schemaPath, 'utf-8'));
    const type = avro.Type.forSchema(schema);
    cache.set(schemaPath, type);
    return type;
  }

  return { loadSchema };
}

// -----------------------------------------------------------------------------
// Execution - method invocation with boundary validation
// -----------------------------------------------------------------------------
function createExecution(runtime, options = {}) {
  const executionId = randomUUID();
  const verbosity = options.verbosity ?? 'normal';
  const schemaLoader = createSchemaLoader();

  // API states - maintained across pipeline
  const apiStates = {};

  // Track previous output for compatibility checking
  let previousOutput = null;
  let isFirstInvocation = true;

  // Get or create API state
  function getApiState(apiPath) {
    if (!apiStates[apiPath]) {
      apiStates[apiPath] = {
        data: {},
        metadata: {}
      };
    }
    return apiStates[apiPath];
  }

  // Update API state
  function setApiState(apiPath, newState) {
    apiStates[apiPath] = newState;
  }

  // Invoke a method with composition and boundary validation
  async function invoke(methodPath, args = {}) {
    const invocationId = randomUUID();
    const startTime = Date.now();

    // Extract API path and method name
    const parts = methodPath.split('/');
    const apiPath = parts.slice(0, -1).join('/');
    const methodName = parts[parts.length - 1];
    const apiName = parts[parts.length - 2];

    // Load schemas
    const schemasPath = join(modulesPath, apiPath, '_schemas');
    const inputSchemaPath = join(schemasPath, `${methodName}-input.avsc`);

    // Debug output
    if (verbosity === 'debug') {
      console.log(`[${invocationId.slice(0, 8)}] Invoking ${methodPath}`);
    }

    // COMPOSITION: Merge previous output with explicit args (args win)
    const mergedInput = { ...previousOutput, ...args };

    if (verbosity === 'debug' && previousOutput) {
      console.log(`[${invocationId.slice(0, 8)}] Input merged with previous output`);
    }

    // BOUNDARY IN: Validate merged input
    let validatedInput = mergedInput;
    try {
      const InputType = schemaLoader.loadSchema(inputSchemaPath);
      validatedInput = InputType.clone(mergedInput, { wrapUnions: true });
      if (verbosity === 'debug') {
        console.log(`[${invocationId.slice(0, 8)}] Input validated`);
      }
    } catch (err) {
      throw new Error(`Input validation failed: ${err.message}`);
    }

    // Build ctx for method
    const apiState = getApiState(apiPath);
    const ctx = {
      runtime,
      execution: {
        executionId,
        invocationId,
        verbosity
      },
      [apiName]: apiState
    };

    // Load and call method - no validation inside
    const fullPath = join(modulesPath, methodPath, 'index.js');
    const { default: method } = await import(fullPath);
    const result = await method(ctx, validatedInput);

    // Extract and store updated API state
    if (result[apiName]) {
      setApiState(apiPath, result[apiName]);
    }

    // Store output for next method's compatibility check
    previousOutput = result.output;
    isFirstInvocation = false;

    // Timing
    const duration = Date.now() - startTime;

    // Debug output
    if (verbosity === 'debug') {
      console.log(`[${invocationId.slice(0, 8)}] Complete in ${duration}ms`);
    }

    return result;
  }

  // Quality control - full validation at pipeline end
  function qualityControl() {
    if (verbosity === 'debug') {
      console.log(`[QC] Running quality control checks...`);
    }

    // Validate all API states against their schemas
    for (const [apiPath, state] of Object.entries(apiStates)) {
      try {
        const stateSchemaPath = join(modulesPath, apiPath, '_schemas', `${apiPath.split('/').pop()}-state.avsc`);
        const StateType = schemaLoader.loadSchema(stateSchemaPath);
        StateType.clone(state, { wrapUnions: true });
        if (verbosity === 'debug') {
          console.log(`[QC] ${apiPath} state: VALID`);
        }
      } catch (err) {
        console.error(`[QC] ${apiPath} state: INVALID - ${err.message}`);
        return false;
      }
    }

    if (verbosity === 'debug') {
      console.log(`[QC] All checks passed`);
    }
    return true;
  }

  return { invoke, getApiState, qualityControl, executionId };
}

// -----------------------------------------------------------------------------
// Main - test the console API
// -----------------------------------------------------------------------------
async function main() {
  console.log('========================================');
  console.log('  Console API v3 - Composition Pattern');
  console.log('========================================');
  console.log('');

  try {
    // Create runtime context
    console.log('[1] Creating runtime...');
    const runtime = createRuntime();
    console.log(`    Runtime ID: ${runtime.runtimeId.slice(0, 8)}...`);
    console.log(`    Node: ${runtime.nodeVersion}`);
    console.log('');

    // Create execution context
    console.log('[2] Creating execution...');
    const exec = createExecution(runtime, { verbosity: 'debug' });
    console.log(`    Execution ID: ${exec.executionId.slice(0, 8)}...`);
    console.log('');

    // Test composition: configure -> log
    console.log('[3] Testing composition (configure -> log)...');
    console.log('');

    // Configure - sets level to 'warn'
    let result = await exec.invoke('spl/console/configure', { level: 'warn' });
    console.log('    configure (level=warn):');
    console.log(`      Output: ${JSON.stringify(result.output)}`);
    console.log('');

    // Log - gets level from previous output (composition!)
    // Only provide message - level comes from configure output
    result = await exec.invoke('spl/console/log', { message: 'Test message at warn level' });
    console.log('    log (message only - level from previous output):');
    console.log(`      Output: ${JSON.stringify(result.output)}`);
    console.log('');

    // Log again - override level to 'info' (should be filtered since config is 'warn')
    result = await exec.invoke('spl/console/log', { message: 'This should be filtered', level: 'info' });
    console.log('    log (level=info - should be filtered):');
    console.log(`      Output: ${JSON.stringify(result.output)}`);
    console.log('');

    // Log with error level - should show
    result = await exec.invoke('spl/console/log', { message: 'Error message', level: 'error' });
    console.log('    log (level=error - should show):');
    console.log(`      Output: ${JSON.stringify(result.output)}`);
    console.log('');

    // Quality control
    console.log('[4] Quality control...');
    const qcPassed = exec.qualityControl();
    console.log('');

    // Show final API state
    console.log('[5] Final console API state:');
    const consoleState = exec.getApiState('spl/console');
    console.log(`    ${JSON.stringify(consoleState, null, 2).split('\n').join('\n    ')}`);
    console.log('');

    // Success
    if (qcPassed) {
      console.log('========================================');
      console.log('  ✓ DEV HARNESS TEST PASSED');
      console.log('========================================');
    } else {
      console.log('========================================');
      console.log('  ✗ QUALITY CONTROL FAILED');
      console.log('========================================');
    }
    console.log('');

    process.exit(qcPassed ? 0 : 1);
  } catch (error) {
    console.error('========================================');
    console.error('  ✗ DEV HARNESS TEST FAILED');
    console.error('========================================');
    console.error('');
    console.error('Error:', error.message);
    console.error(error.stack);
    console.error('');
    process.exit(1);
  }
}

main();
