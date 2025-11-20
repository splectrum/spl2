// run-tests.js - Test harness for Dev Environment
// Runs tests sequentially, exits on first failure with guidance

import { readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runTests() {
  console.log('========================================');
  console.log('  Dev Environment v1 - Test Harness');
  console.log('========================================');
  console.log('');

  const testsDir = join(__dirname, 'tests');
  const testFiles = readdirSync(testsDir)
    .filter(f => f.endsWith('.js'))
    .sort();

  if (testFiles.length === 0) {
    console.log('No tests found in tests/ directory');
    process.exit(0);
  }

  console.log(`Found ${testFiles.length} test(s)`);
  console.log('');

  let passed = 0;
  let failed = 0;

  for (const testFile of testFiles) {
    const testPath = join(testsDir, testFile);
    const testName = testFile.replace('.js', '');

    process.stdout.write(`[${testName}] `);

    try {
      const { default: test } = await import(testPath);
      const result = await test();

      if (result.status === 'pass') {
        console.log('✓ PASS');
        if (result.message) {
          console.log(`  ${result.message}`);
        }
        passed++;
      } else {
        console.log('✗ FAIL');
        console.log('');
        console.log('  Category:', result.category || 'unknown');
        console.log('  Message:', result.message || 'No message');
        if (result.guidance) {
          console.log('');
          console.log('  Guidance:');
          console.log('  ' + result.guidance.split('\n').join('\n  '));
        }
        console.log('');
        failed++;

        // Exit on first failure
        console.log('========================================');
        console.log(`  ✗ STOPPED - ${passed} passed, 1 failed`);
        console.log('========================================');
        process.exit(1);
      }
    } catch (error) {
      console.log('✗ ERROR');
      console.log('');
      console.log('  Error:', error.message);
      console.log('');
      console.log('  Guidance:');
      console.log('  Fix the error in the test or implementation');
      console.log('');
      failed++;

      console.log('========================================');
      console.log(`  ✗ STOPPED - ${passed} passed, 1 error`);
      console.log('========================================');
      process.exit(1);
    }
  }

  console.log('');
  console.log('========================================');
  console.log(`  ✓ ALL PASSED - ${passed}/${passed}`);
  console.log('========================================');
  process.exit(0);
}

runTests();
