#!/bin/bash
# v2-deploy.sh - Deploy Dev Environment v2
# Req-driven test harness

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
V2_DIR="$SCRIPT_DIR/v2"

echo "Creating Dev Environment v2..."
echo ""

# Clean and create directory structure
rm -rf "$V2_DIR"
mkdir -p "$V2_DIR/src/spl/dev/create"
mkdir -p "$V2_DIR/src/spl/dev/_schemas"
mkdir -p "$V2_DIR/tests/generic"
mkdir -p "$V2_DIR/tests/logic"
mkdir -p "$V2_DIR/reqs"

# -----------------------------------------------------------------------------
# package.json
# -----------------------------------------------------------------------------
cat > "$V2_DIR/package.json" << 'EOF'
{
  "name": "dev-environment-v2",
  "version": "2.0.0",
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
# api_method req - base requirements for any API method
# -----------------------------------------------------------------------------
cat > "$V2_DIR/reqs/api_method_v1.0.0.json" << 'EOF'
{
  "type": "api_method",
  "version": "1.0.0",
  "spec": {
    "description": "Base requirements for any API method",
    "requires": {
      "inputSchema": "AVRO schema for input validation",
      "outputSchema": "AVRO schema for output validation",
      "implementation": "index.js in method folder"
    }
  },
  "selfEval": {
    "qc": {
      "test": "generic/qc.js",
      "description": "Validate input/output against schemas"
    },
    "safety": {
      "test": "generic/safety.js",
      "description": "Verify runtime/execution not modified"
    }
  }
}
EOF

# -----------------------------------------------------------------------------
# spl/dev/create req - specific method requirements
# -----------------------------------------------------------------------------
cat > "$V2_DIR/reqs/spl_dev_create_v1.0.0.json" << 'EOF'
{
  "type": "method_req",
  "extends": "api_method_v1.0.0",
  "version": "1.0.0",
  "method": "spl/dev/create",
  "spec": {
    "description": "Create a new dev environment from specification",
    "input": {
      "name": "Environment name (string)",
      "template": "Optional template type (string)"
    },
    "output": {
      "envId": "UUID of created environment",
      "path": "Path to environment directory",
      "status": "created"
    }
  },
  "selfEval": {
    "logic": {
      "test": "logic/spl_dev_create.js",
      "description": "Verify create method behavior",
      "cases": [
        {
          "name": "creates environment with name",
          "input": { "name": "test-env" },
          "expect": { "status": "created" }
        },
        {
          "name": "generates unique envId",
          "input": { "name": "test-env" },
          "expect": { "envId": "uuid" }
        }
      ]
    }
  },
  "schemas": {
    "input": "create-input.avsc",
    "output": "create-output.avsc"
  }
}
EOF

# -----------------------------------------------------------------------------
# Input schema for create
# -----------------------------------------------------------------------------
cat > "$V2_DIR/src/spl/dev/_schemas/create-input.avsc" << 'EOF'
{
  "type": "record",
  "name": "CreateInput",
  "fields": [
    { "name": "name", "type": "string" },
    { "name": "template", "type": ["null", "string"], "default": null }
  ]
}
EOF

# -----------------------------------------------------------------------------
# Output schema for create
# -----------------------------------------------------------------------------
cat > "$V2_DIR/src/spl/dev/_schemas/create-output.avsc" << 'EOF'
{
  "type": "record",
  "name": "CreateOutput",
  "fields": [
    { "name": "envId", "type": "string" },
    { "name": "path", "type": "string" },
    { "name": "status", "type": "string" }
  ]
}
EOF

# -----------------------------------------------------------------------------
# run-tests.js - Req-driven test harness
# -----------------------------------------------------------------------------
cat > "$V2_DIR/run-tests.js" << 'EOF'
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
EOF

# -----------------------------------------------------------------------------
# Generic QC test
# -----------------------------------------------------------------------------
cat > "$V2_DIR/tests/generic/qc.js" << 'EOF'
// Generic QC test - schema validation
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import avro from 'avsc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async function test({ req, method }) {
  const methodParts = method.split('/');
  const apiPath = methodParts.slice(0, -1).join('/');
  const methodName = methodParts[methodParts.length - 1];

  const schemasDir = join(__dirname, '..', '..', 'src', apiPath, '_schemas');

  // Check input schema exists and is valid
  const inputSchemaPath = join(schemasDir, req.schemas.input);
  if (!existsSync(inputSchemaPath)) {
    return {
      status: 'fail',
      message: `Input schema not found: ${req.schemas.input}`,
      guidance: `Create ${inputSchemaPath}`
    };
  }

  try {
    const inputSchema = JSON.parse(readFileSync(inputSchemaPath, 'utf-8'));
    avro.Type.forSchema(inputSchema);
  } catch (err) {
    return {
      status: 'fail',
      message: `Invalid input schema: ${err.message}`,
      guidance: 'Fix AVRO schema syntax'
    };
  }

  // Check output schema exists and is valid
  const outputSchemaPath = join(schemasDir, req.schemas.output);
  if (!existsSync(outputSchemaPath)) {
    return {
      status: 'fail',
      message: `Output schema not found: ${req.schemas.output}`,
      guidance: `Create ${outputSchemaPath}`
    };
  }

  try {
    const outputSchema = JSON.parse(readFileSync(outputSchemaPath, 'utf-8'));
    avro.Type.forSchema(outputSchema);
  } catch (err) {
    return {
      status: 'fail',
      message: `Invalid output schema: ${err.message}`,
      guidance: 'Fix AVRO schema syntax'
    };
  }

  return {
    status: 'pass',
    message: 'Schemas valid'
  };
}
EOF

# -----------------------------------------------------------------------------
# Generic safety test (placeholder)
# -----------------------------------------------------------------------------
cat > "$V2_DIR/tests/generic/safety.js" << 'EOF'
// Generic safety test - runtime/execution not modified
// Requires method implementation to test

import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async function test({ req, method }) {
  const methodParts = method.split('/');
  const methodPath = join(__dirname, '..', '..', 'src', ...methodParts, 'index.js');

  if (!existsSync(methodPath)) {
    return {
      status: 'fail',
      message: 'Method implementation not found',
      guidance: `Create ${methodPath}`
    };
  }

  // TODO: Actually invoke method and check safety
  // For now, just verify implementation exists
  return {
    status: 'pass',
    message: 'Method implementation exists'
  };
}
EOF

# -----------------------------------------------------------------------------
# Logic test for spl/dev/create
# -----------------------------------------------------------------------------
cat > "$V2_DIR/tests/logic/spl_dev_create.js" << 'EOF'
// Logic test for spl/dev/create
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async function test({ req, cases }) {
  const methodPath = join(__dirname, '..', '..', 'src', 'spl', 'dev', 'create', 'index.js');

  let create;
  try {
    const module = await import(methodPath);
    create = module.default;
  } catch (err) {
    return {
      status: 'fail',
      message: `Cannot load create method: ${err.message}`,
      guidance: `Implement the create method in src/spl/dev/create/index.js

export default async function create(ctx, input) {
  const { name, template } = input;

  return {
    output: {
      envId: crypto.randomUUID(),
      path: \`/path/to/\${name}\`,
      status: 'created'
    }
  };
}`
    };
  }

  // Run test cases
  for (const testCase of cases) {
    const mockCtx = { runtime: {}, execution: {} };

    try {
      const result = await create(mockCtx, testCase.input);

      // Check expected fields
      for (const [key, expected] of Object.entries(testCase.expect)) {
        if (expected === 'uuid') {
          // Just check it exists and looks like UUID
          if (!result.output[key] || result.output[key].length < 10) {
            return {
              status: 'fail',
              message: `Case "${testCase.name}": expected ${key} to be UUID`,
              guidance: `Ensure create returns a valid UUID for ${key}`
            };
          }
        } else if (result.output[key] !== expected) {
          return {
            status: 'fail',
            message: `Case "${testCase.name}": expected ${key}="${expected}", got "${result.output[key]}"`,
            guidance: `Fix create method to return correct ${key}`
          };
        }
      }
    } catch (err) {
      return {
        status: 'fail',
        message: `Case "${testCase.name}" threw: ${err.message}`,
        guidance: 'Fix error in create method'
      };
    }
  }

  return {
    status: 'pass',
    message: `All ${cases.length} test cases passed`
  };
}
EOF

# -----------------------------------------------------------------------------
# Install dependencies
# -----------------------------------------------------------------------------
echo "Installing dependencies..."
cd "$V2_DIR"
npm install --silent

echo ""
echo "========================================"
echo "  Dev Environment v2 created at:"
echo "  $V2_DIR"
echo ""
echo "  Run tests with:"
echo "  cd $V2_DIR && npm test"
echo "========================================"
