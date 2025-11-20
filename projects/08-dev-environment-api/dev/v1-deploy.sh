#!/bin/bash
# v1-deploy.sh - Deploy Dev Environment v1
# Test harness with sequential test execution

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
V1_DIR="$SCRIPT_DIR/v1"

echo "Creating Dev Environment v1..."
echo ""

# Clean and create directory structure
rm -rf "$V1_DIR"
mkdir -p "$V1_DIR/src/spl/dev"
mkdir -p "$V1_DIR/tests"
mkdir -p "$V1_DIR/schemas"

# -----------------------------------------------------------------------------
# package.json
# -----------------------------------------------------------------------------
cat > "$V1_DIR/package.json" << 'EOF'
{
  "name": "dev-environment-v1",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "test": "node run-tests.js"
  },
  "dependencies": {
    "avsc": "^5.7.7"
  }
}
EOF

# -----------------------------------------------------------------------------
# run-tests.js - Test harness
# -----------------------------------------------------------------------------
cat > "$V1_DIR/run-tests.js" << 'EOF'
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
EOF

# -----------------------------------------------------------------------------
# Example test - 01-harness-works.js
# -----------------------------------------------------------------------------
cat > "$V1_DIR/tests/01-harness-works.js" << 'EOF'
// Test: Verify harness executes tests correctly
// Category: impl

export default async function test() {
  // Simple test to verify harness works
  const harnessExists = true;

  if (harnessExists) {
    return {
      status: 'pass',
      category: 'impl',
      message: 'Test harness executes correctly'
    };
  } else {
    return {
      status: 'fail',
      category: 'impl',
      message: 'Test harness not working',
      guidance: 'Check run-tests.js exists and is valid'
    };
  }
}
EOF

# -----------------------------------------------------------------------------
# Example test - 02-create-method-exists.js
# -----------------------------------------------------------------------------
cat > "$V1_DIR/tests/02-create-method-exists.js" << 'EOF'
// Test: Dev Environment create method exists
// Category: impl

import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async function test() {
  const createPath = join(__dirname, '..', 'src', 'spl', 'dev', 'create.js');

  if (existsSync(createPath)) {
    return {
      status: 'pass',
      category: 'impl',
      message: 'create method exists'
    };
  } else {
    return {
      status: 'fail',
      category: 'impl',
      message: 'create method not found',
      guidance: `Create the file: src/spl/dev/create.js

This method should create a new dev environment from a specification.

Expected signature:
  export default async function create(spec) {
    // Create environment
    return { envId, path, status: 'created' };
  }`
    };
  }
}
EOF

# -----------------------------------------------------------------------------
# Install dependencies
# -----------------------------------------------------------------------------
echo "Installing dependencies..."
cd "$V1_DIR"
npm install --silent

echo ""
echo "========================================
  Dev Environment v1 created at:
  $V1_DIR

  Run tests with:
  cd $V1_DIR && npm test
========================================"
