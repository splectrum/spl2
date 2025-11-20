// run-tests.js - Req-driven test harness
// Reads method req, runs generic + logic tests

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runTests() {
  console.log('========================================');
  console.log('  Dev Environment v2 - Req-Driven Tests');
  console.log('========================================');
  console.log('');

  // Load method req
  const reqPath = join(__dirname, 'reqs', 'spl_dev_create_v1.0.0.json');
  const req = JSON.parse(readFileSync(reqPath, 'utf-8'));

  console.log(`Testing: ${req.method}`);
  console.log(`Req: ${req.type} v${req.version}`);
  console.log('');

  let passed = 0;
  let failed = 0;

  // Run generic tests from base (qc, safety)
  const baseReqPath = join(__dirname, 'reqs', `${req.extends}.json`);
  const baseReq = JSON.parse(readFileSync(baseReqPath, 'utf-8'));

  for (const [testType, testConfig] of Object.entries(baseReq.selfEval)) {
    const testPath = join(__dirname, 'tests', testConfig.test);
    const testName = `${testType} (${testConfig.description})`;

    process.stdout.write(`[${testType}] `);

    if (!existsSync(testPath)) {
      console.log('⊘ SKIP - test not implemented');
      continue;
    }

    try {
      const { default: test } = await import(testPath);
      const result = await test({ req, baseReq, method: req.method });

      if (result.status === 'pass') {
        console.log('✓ PASS');
        passed++;
      } else {
        console.log('✗ FAIL');
        console.log(`  ${result.message}`);
        if (result.guidance) {
          console.log(`  Guidance: ${result.guidance}`);
        }
        failed++;
        break;
      }
    } catch (error) {
      console.log('✗ ERROR');
      console.log(`  ${error.message}`);
      failed++;
      break;
    }
  }

  // Run logic tests from method req
  if (failed === 0 && req.selfEval.logic) {
    const testPath = join(__dirname, 'tests', req.selfEval.logic.test);

    process.stdout.write(`[logic] `);

    if (!existsSync(testPath)) {
      console.log('⊘ SKIP - test not implemented');
    } else {
      try {
        const { default: test } = await import(testPath);
        const result = await test({ req, cases: req.selfEval.logic.cases });

        if (result.status === 'pass') {
          console.log('✓ PASS');
          passed++;
        } else {
          console.log('✗ FAIL');
          console.log(`  ${result.message}`);
          if (result.guidance) {
            console.log('');
            console.log('  Guidance:');
            console.log('  ' + result.guidance.split('\n').join('\n  '));
          }
          failed++;
        }
      } catch (error) {
        console.log('✗ ERROR');
        console.log(`  ${error.message}`);
        failed++;
      }
    }
  }

  console.log('');
  if (failed === 0) {
    console.log('========================================');
    console.log(`  ✓ ALL PASSED - ${passed}/${passed}`);
    console.log('========================================');
    process.exit(0);
  } else {
    console.log('========================================');
    console.log(`  ✗ FAILED - ${passed} passed, ${failed} failed`);
    console.log('========================================');
    process.exit(1);
  }
}

runTests();
