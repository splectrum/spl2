// run.js - Execution harness for Console API v7
// Schema-driven property selection for three-layer merge

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { randomUUID } from 'crypto';
import { readFileSync } from 'fs';
import avro from 'avsc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const modulesPath = join(__dirname, 'modules');

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
// Self-eval report
// -----------------------------------------------------------------------------
function createSelfEvalReport() {
  const results = [];

  function pass(category, message) {
    results.push({ status: 'pass', category, message });
  }

  function fail(category, message) {
    results.push({ status: 'fail', category, message });
  }

  function print() {
    const passes = results.filter(r => r.status === 'pass');
    const failures = results.filter(r => r.status === 'fail');

    console.log('');
    console.log('Self-Eval Report');
    console.log('================');

    for (const r of results) {
      const icon = r.status === 'pass' ? '✓' : '✗';
      console.log(`${icon} [${r.category}] ${r.message}`);
    }

    console.log('');
    console.log(`${failures.length} failures, ${passes.length} passed`);

    return failures.length === 0;
  }

  return { pass, fail, print, results };
}

// -----------------------------------------------------------------------------
// Execution - method invocation with self-eval
// -----------------------------------------------------------------------------
function createExecution(runtime, options = {}) {
  const executionId = randomUUID();
  const verbosity = options.verbosity ?? 'normal';
  const selfEval = options.selfEval ?? {};
  const schemaLoader = createSchemaLoader();
  const report = createSelfEvalReport();

  // API states - maintained across pipeline
  const apiStates = {};

  // Track previous output for pipeline flow
  let previousOutput = null;

  // Get or create API state
  function getApiState(apiPath) {
    if (!apiStates[apiPath]) {
      apiStates[apiPath] = {
        data: {},
        metadata: {},
        args: {}
      };
    }
    return apiStates[apiPath];
  }

  // Update API state
  function setApiState(apiPath, newState) {
    apiStates[apiPath] = newState;
  }

  // Invoke API or method
  async function invoke(path, args = {}) {
    const parts = path.split('/');
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

    const parts = methodPath.split('/');
    const apiPath = parts.slice(0, -1).join('/');
    const methodName = parts[parts.length - 1];
    const apiName = parts[parts.length - 2];

    const schemasPath = join(modulesPath, apiPath, '_schemas');
    const inputSchemaPath = join(schemasPath, `${methodName}-input.avsc`);

    if (verbosity === 'debug') {
      console.log(`[${invocationId.slice(0, 8)}] Invoking ${methodPath}`);
    }

    // Load input schema for property selection and validation
    const InputType = schemaLoader.loadSchema(inputSchemaPath);
    const schemaFields = InputType.fields.map(f => f.name);

    // THREE-LAYER MERGE: API defaults < output flow < method overrides
    // Schema-driven: only select properties defined in method schema
    const apiState = getApiState(apiPath);
    const mergedInput = {};

    for (const prop of schemaFields) {
      if (apiState.args[prop] !== undefined) {
        mergedInput[prop] = apiState.args[prop];
      }
      if (previousOutput?.[prop] !== undefined) {
        mergedInput[prop] = previousOutput[prop];
      }
      if (args[prop] !== undefined) {
        mergedInput[prop] = args[prop];
      }
    }

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
      validatedInput = InputType.clone(mergedInput, { wrapUnions: true });
      if (verbosity === 'debug') {
        console.log(`[${invocationId.slice(0, 8)}] Input validated`);
      }
    } catch (err) {
      throw new Error(`Input validation failed: ${err.message}`);
    }

    // Build ctx for method
    const ctx = {
      runtime,
      execution: {
        executionId,
        invocationId,
        verbosity
      },
      [apiName]: apiState
    };

    // Snapshot for safety self-eval
    const runtimeSnapshot = selfEval.safety ? JSON.stringify(runtime) : null;
    const executionSnapshot = selfEval.safety ? JSON.stringify({ executionId, invocationId, verbosity }) : null;

    // Load and call method
    const fullPath = join(modulesPath, methodPath, 'index.js');
    const { default: method } = await import(fullPath);
    const result = await method(ctx, validatedInput);

    // Safety self-eval
    if (selfEval.safety) {
      if (JSON.stringify(runtime) !== runtimeSnapshot) {
        report.fail('safety', `${methodPath}: runtime modified`);
      } else {
        report.pass('safety', `${methodPath}: runtime not modified`);
      }

      const currentExecution = JSON.stringify({ executionId, invocationId, verbosity });
      if (currentExecution !== executionSnapshot) {
        report.fail('safety', `${methodPath}: execution modified`);
      } else {
        report.pass('safety', `${methodPath}: execution not modified`);
      }
    }

    // Extract and store updated API state
    if (result[apiName]) {
      setApiState(apiPath, {
        ...result[apiName],
        args: apiState.args
      });
    }

    previousOutput = result.output;

    const duration = Date.now() - startTime;
    if (verbosity === 'debug') {
      console.log(`[${invocationId.slice(0, 8)}] Complete in ${duration}ms`);
    }

    return result;
  }

  // Quality control
  function qualityControl() {
    if (!selfEval.qc) return true;

    if (verbosity === 'debug') {
      console.log(`[QC] Running quality control checks...`);
    }

    for (const [apiPath, state] of Object.entries(apiStates)) {
      try {
        const stateSchemaPath = join(modulesPath, apiPath, '_schemas', `${apiPath.split('/').pop()}-state.avsc`);
        const StateType = schemaLoader.loadSchema(stateSchemaPath);
        StateType.clone(state, { wrapUnions: true });
        report.pass('qc', `${apiPath} state schema valid`);
      } catch (err) {
        report.fail('qc', `${apiPath} state schema invalid: ${err.message}`);
      }
    }

    return true;
  }

  function printReport() {
    return report.print();
  }

  return { invoke, getApiState, qualityControl, printReport, executionId };
}

// -----------------------------------------------------------------------------
// Main - test all 5 console methods
// -----------------------------------------------------------------------------
async function main() {
  console.log('========================================');
  console.log('  Console API v7 - Wrapper Methods');
  console.log('========================================');
  console.log('');

  try {
    console.log('[1] Creating runtime...');
    const runtime = createRuntime();
    console.log(`    Runtime ID: ${runtime.runtimeId.slice(0, 8)}...`);
    console.log('');

    console.log('[2] Creating execution with self-eval...');
    const exec = createExecution(runtime, {
      verbosity: 'debug',
      selfEval: {
        safety: true,
        qc: true
      }
    });
    console.log(`    Execution ID: ${exec.executionId.slice(0, 8)}...`);
    console.log('');

    // API-level invocation - set defaults
    console.log('[3] API-level invocation (set defaults)...');
    await exec.invoke('spl/console', { format: 'text' });
    console.log('');

    // Test all 5 methods
    console.log('[4] Testing all wrapper methods...');
    console.log('');

    console.log('--- debug ---');
    await exec.invoke('spl/console/debug', { message: 'Debug message' });
    console.log('');

    console.log('--- info ---');
    await exec.invoke('spl/console/info', { message: 'Info message' });
    console.log('');

    console.log('--- log ---');
    await exec.invoke('spl/console/log', { message: 'Log message' });
    console.log('');

    console.log('--- warn ---');
    await exec.invoke('spl/console/warn', { message: 'Warning message' });
    console.log('');

    console.log('--- error ---');
    await exec.invoke('spl/console/error', { message: 'Error message' });
    console.log('');

    // Quality control
    console.log('[5] Quality control...');
    exec.qualityControl();
    console.log('');

    // Final state
    console.log('[6] Final console API state:');
    const consoleState = exec.getApiState('spl/console');
    console.log(`    ${JSON.stringify(consoleState, null, 2).split('\n').join('\n    ')}`);

    const allPassed = exec.printReport();

    if (allPassed) {
      console.log('========================================');
      console.log('  ✓ ALL SELF-EVAL PASSED');
      console.log('========================================');
    } else {
      console.log('========================================');
      console.log('  ✗ SELF-EVAL FAILURES');
      console.log('========================================');
    }
    console.log('');

    process.exit(allPassed ? 0 : 1);
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
