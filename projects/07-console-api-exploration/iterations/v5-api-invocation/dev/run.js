// run.js - Execution harness for Console API exploration
// v5: API-level invocation with batch support

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
        metadata: {},
        args: {}  // API-level default arguments
      };
    }
    return apiStates[apiPath];
  }

  // Update API state
  function setApiState(apiPath, newState) {
    apiStates[apiPath] = newState;
  }

  // Set API-level default arguments
  function setApiArgs(apiPath, args) {
    const state = getApiState(apiPath);
    state.args = { ...state.args, ...args };
  }

  // Invoke API or method
  async function invoke(path, args = {}) {
    const parts = path.split('/');

    // Determine if API-level or method-level invocation
    // API-level: 'spl/console' (2 parts)
    // Method-level: 'spl/console/configure' (3 parts)
    const isApiLevel = parts.length === 2;

    if (isApiLevel) {
      return await invokeApi(path, args);
    } else {
      return await invokeMethod(path, args);
    }
  }

  // API-level invocation - set defaults and optionally run batch
  async function invokeApi(apiPath, args = {}) {
    const invocationId = randomUUID();

    if (verbosity === 'debug') {
      console.log(`[${invocationId.slice(0, 8)}] API invocation: ${apiPath}`);
    }

    // Extract batch (transient, not stored)
    const { batch, ...defaultArgs } = args;

    // Store API defaults
    const apiState = getApiState(apiPath);
    apiState.args = { ...apiState.args, ...defaultArgs };

    if (verbosity === 'debug' && Object.keys(defaultArgs).length) {
      console.log(`[${invocationId.slice(0, 8)}] API defaults set: ${JSON.stringify(defaultArgs)}`);
    }

    // Execute batch if present
    let result = { output: previousOutput };
    if (batch && batch.length) {
      if (verbosity === 'debug') {
        console.log(`[${invocationId.slice(0, 8)}] Executing batch of ${batch.length} methods`);
      }
      for (const [methodName, methodArgs] of batch) {
        const methodPath = `${apiPath}/${methodName}`;
        result = await invokeMethod(methodPath, methodArgs ?? {});
      }
    }

    return result;
  }

  // Method-level invocation
  async function invokeMethod(methodPath, args = {}) {
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

    // THREE-LAYER MERGE: API defaults < output flow < method overrides
    const apiState = getApiState(apiPath);
    const mergedInput = {
      ...apiState.args,              // 1. API defaults (lowest precedence)
      ...(previousOutput ?? {}),     // 2. Pipeline flow (middle)
      ...args                        // 3. Method overrides (highest precedence)
    };

    if (verbosity === 'debug') {
      const layers = [];
      if (Object.keys(apiState.args).length) layers.push('API defaults');
      if (previousOutput) layers.push('output flow');
      if (Object.keys(args).length) layers.push('method overrides');
      if (layers.length > 1) {
        console.log(`[${invocationId.slice(0, 8)}] Input merged: ${layers.join(' < ')}`);
      }
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

    // Build ctx for method (apiState already retrieved for merge)
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

    // Extract and store updated API state (preserve args)
    if (result[apiName]) {
      setApiState(apiPath, {
        ...result[apiName],
        args: apiState.args  // preserve API-level args
      });
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

  return { invoke, getApiState, setApiArgs, qualityControl, executionId };
}

// -----------------------------------------------------------------------------
// Main - test the console API
// -----------------------------------------------------------------------------
async function main() {
  console.log('========================================');
  console.log('  Console API v5 - API-Level Invocation');
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

    // API-level invocation - set defaults
    console.log('[3] API-level invocation (set defaults)...');
    await exec.invoke('spl/console', { level: 'info', format: 'text' });
    console.log('');

    // Method-level invocation
    console.log('[4] Method-level invocations...');
    console.log('');

    let result = await exec.invoke('spl/console/configure', { level: 'warn' });
    console.log('    configure (level=warn override):');
    console.log(`      Output: ${JSON.stringify(result.output)}`);
    console.log('');

    result = await exec.invoke('spl/console/log', { message: 'First message' });
    console.log('    log (message only - level from flow):');
    console.log(`      Output: ${JSON.stringify(result.output)}`);
    console.log('');

    // API-level invocation with batch
    console.log('[5] API-level invocation with batch...');
    result = await exec.invoke('spl/console', {
      level: 'debug',  // update API default
      batch: [
        ['log', { message: 'Batch message 1' }],
        ['log', { message: 'Batch message 2', level: 'error' }],
        ['log', { message: 'Batch message 3' }]
      ]
    });
    console.log('    Batch complete');
    console.log(`      Final output: ${JSON.stringify(result.output)}`);
    console.log('');

    // Quality control
    console.log('[6] Quality control...');
    const qcPassed = exec.qualityControl();
    console.log('');

    // Show final API state
    console.log('[7] Final console API state:');
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
