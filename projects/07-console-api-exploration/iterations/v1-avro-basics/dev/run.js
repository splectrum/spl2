// run.js - Execution harness for Console API exploration
// Free scripting approach - pragmatic scaffolding

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { randomUUID } from 'crypto';

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
// Execution - method invocation wrapper with common tasks
// -----------------------------------------------------------------------------
function createExecution(runtime, options = {}) {
  const executionId = randomUUID();
  const verbosity = options.verbosity ?? 'normal';

  // API states - maintained across pipeline
  const apiStates = {};

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

  // Invoke a method with wrapping
  async function invoke(methodPath, input = {}) {
    const invocationId = randomUUID();
    const startTime = Date.now();

    // Extract API path from method path (e.g., 'spl/console' from 'spl/console/log')
    const parts = methodPath.split('/');
    const apiPath = parts.slice(0, -1).join('/');

    // Debug output
    if (verbosity === 'debug') {
      console.log(`[${invocationId.slice(0, 8)}] Invoking ${methodPath}`);
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
      [parts[parts.length - 2]]: apiState,  // e.g., 'console': apiState
      input
    };

    // Load and call method
    const fullPath = join(modulesPath, methodPath, 'index.js');
    const { default: method } = await import(fullPath);
    const result = await method(ctx, input);

    // Extract and store updated API state
    const apiName = parts[parts.length - 2];
    if (result[apiName]) {
      setApiState(apiPath, result[apiName]);
    }

    // Timing
    const duration = Date.now() - startTime;

    // Debug output
    if (verbosity === 'debug') {
      console.log(`[${invocationId.slice(0, 8)}] Complete in ${duration}ms`);
    }

    return result;
  }

  return { invoke, getApiState, executionId };
}

// -----------------------------------------------------------------------------
// Main - test the console API
// -----------------------------------------------------------------------------
async function main() {
  console.log('========================================');
  console.log('  Console API Exploration - Dev Harness');
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

    // Test console API methods
    console.log('[3] Testing configure with AVRO...');
    console.log('');

    // First configure - with defaults
    let result = await exec.invoke('spl/console/configure', {});
    console.log('    Call 1 (defaults):');
    console.log(`      Output: ${JSON.stringify(result.output)}`);
    console.log(`      State invocationCount: ${exec.getApiState('spl/console').data.invocationCount}`);
    console.log('');

    // Second configure - change level
    result = await exec.invoke('spl/console/configure', { level: 'warn', format: 'json' });
    console.log('    Call 2 (level=warn, format=json):');
    console.log(`      Output: ${JSON.stringify(result.output)}`);
    console.log(`      State invocationCount: ${exec.getApiState('spl/console').data.invocationCount}`);
    console.log('');

    // Third configure - invalid level (error case)
    result = await exec.invoke('spl/console/configure', { level: 'invalid' });
    console.log('    Call 3 (invalid level - error):');
    console.log(`      Output: ${JSON.stringify(result.output)}`);
    console.log(`      State invocationCount: ${exec.getApiState('spl/console').data.invocationCount}`);
    console.log('      (invocation count unchanged on error)');
    console.log('');

    // Show final API state
    console.log('[4] Final console API state:');
    const consoleState = exec.getApiState('spl/console');
    console.log(`    ${JSON.stringify(consoleState, null, 2).split('\n').join('\n    ')}`);
    console.log('');

    // Success
    console.log('========================================');
    console.log('  ✓ DEV HARNESS TEST PASSED');
    console.log('========================================');
    console.log('');

    process.exit(0);
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
