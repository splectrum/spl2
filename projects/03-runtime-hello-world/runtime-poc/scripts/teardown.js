#!/usr/bin/env node

// Requirements: ../Twin_pair_1_requirements_v1.0.0.md

/**
 * Teardown script for runtime-poc deployment
 *
 * Removes build artifacts and dependencies.
 * Note: To completely remove runtime-poc/, delete the directory from parent:
 *   cd projects/03-runtime-hello-world && rm -rf runtime-poc/
 */

import { rmSync, existsSync } from 'fs';
import { join } from 'path';

// ANSI colors for output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function removeDirectory(path, name) {
  if (existsSync(path)) {
    try {
      rmSync(path, { recursive: true, force: true });
      log(`✓ Removed ${name}`, 'green');
      return true;
    } catch (error) {
      log(`✗ Failed to remove ${name}: ${error.message}`, 'red');
      return false;
    }
  } else {
    log(`  ${name} not found (already clean)`, 'yellow');
    return true;
  }
}

function main() {
  log('═══════════════════════════════════════', 'blue');
  log('  SPL2 Runtime POC - Teardown', 'blue');
  log('═══════════════════════════════════════', 'blue');

  log('\n[TEARDOWN] Removing build artifacts...', 'blue');

  let success = true;
  success = removeDirectory('node_modules', 'node_modules/') && success;
  success = removeDirectory('package-lock.json', 'package-lock.json') && success;

  if (success) {
    log('\n[TEARDOWN] Teardown completed successfully!', 'green');
    log('  To rebuild: npm run build', 'yellow');
    log('  To remove completely: cd .. && rm -rf runtime-poc/', 'yellow');
  } else {
    log('\n[TEARDOWN] Teardown completed with errors', 'red');
    process.exit(1);
  }
}

main();
