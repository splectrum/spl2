// Test Harness - Reads _reqs/_selfeval.json and runs tests
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import avro from 'avsc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runScriptTest(test, methodPath) {
  // test.script is relative to method folder (e.g., "_tests/create-status.js")
  // Run node with method folder as cwd so relative imports work
  return new Promise((resolve) => {
    const proc = spawn('node', [test.script], {
      cwd: methodPath,
      stdio: ['ignore', 'pipe', 'pipe']
    });

    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    proc.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    proc.on('close', (code) => {
      resolve({
        passed: code === 0,
        output: stdout + stderr
      });
    });
  });
}

async function runSchemaTest(test, methodPath) {
  try {
    const schemaPath = join(methodPath, test.schema);
    const schemaContent = readFileSync(schemaPath, 'utf8');
    const schema = avro.parse(schemaContent);

    // For schema tests, we just validate the schema is loadable
    // Actual validation would happen with real data
    return {
      passed: true,
      output: 'Schema loaded successfully'
    };
  } catch (error) {
    return {
      passed: false,
      output: `Schema validation failed: ${error.message}`
    };
  }
}

async function runTest(test, methodPath) {
  console.log(`  Running: ${test.name} (${test.category})`);

  let result;

  switch (test.type) {
    case 'script':
      result = await runScriptTest(test, methodPath);
      break;
    case 'schema':
      result = await runSchemaTest(test, methodPath);
      break;
    default:
      result = {
        passed: false,
        output: `Unknown test type: ${test.type}`
      };
  }

  if (result.passed) {
    console.log(`  ✓ PASS: ${test.name}`);
  } else {
    console.log(`  ✗ FAIL: ${test.name}`);
    if (result.output) {
      console.log(`    ${result.output}`);
    }
  }

  return result;
}

async function runHarness(methodPath) {
  console.log('\n=== Test Harness ===\n');

  // Read selfeval manifest from _reqs/ folder
  const manifestPath = join(methodPath, '_reqs/_selfeval.json');
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

  console.log(`Method: ${manifest.method}`);
  console.log(`Description: ${manifest.description}`);
  console.log(`Total tests: ${manifest.tests.length}\n`);

  // Group tests by category
  const categories = {};
  for (const test of manifest.tests) {
    if (!categories[test.category]) {
      categories[test.category] = [];
    }
    categories[test.category].push(test);
  }

  // Run tests by category
  let totalPassed = 0;
  let totalFailed = 0;

  for (const [category, tests] of Object.entries(categories)) {
    console.log(`\n[${category.toUpperCase()}]`);

    for (const test of tests) {
      const result = await runTest(test, methodPath);

      if (result.passed) {
        totalPassed++;
      } else {
        totalFailed++;
        // Stop on first failure
        console.log('\n✗ Stopping on first failure\n');
        break;
      }
    }

    if (totalFailed > 0) {
      break;
    }
  }

  // Summary
  console.log('\n=== Summary ===');
  console.log(`Passed: ${totalPassed}`);
  console.log(`Failed: ${totalFailed}`);
  console.log(`Total: ${totalPassed + totalFailed}/${manifest.tests.length}`);

  if (totalFailed === 0 && totalPassed === manifest.tests.length) {
    console.log('\n✓ 100% PASS - All tests passed!\n');
    process.exit(0);
  } else {
    console.log('\n✗ INCOMPLETE - Fix failures and run again\n');
    process.exit(1);
  }
}

// Main
const methodPath = process.argv[2] || join(__dirname, 'spl-dev-implementation/spl/dev/create');
runHarness(methodPath);
