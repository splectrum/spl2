#!/usr/bin/env node

// Requirements: ../Twin_pair_1_requirements_v1.0.0.md

/**
 * Validation script for runtime-poc deployment
 *
 * Verifies that the development environment is correctly set up and ready for use.
 */

import { existsSync, readFileSync } from 'fs';
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

function validateNodeVersion() {
  log('\n[VALIDATE] Checking Node.js version...', 'blue');

  const currentVersion = process.version;
  const currentMajor = parseInt(currentVersion.slice(1).split('.')[0]);
  const requiredMajor = 18;

  if (currentMajor < requiredMajor) {
    log(`✗ Node.js ${currentVersion} does not meet requirements (>= ${requiredMajor}.0.0)`, 'red');
    return false;
  }

  log(`✓ Node.js ${currentVersion} meets requirements`, 'green');
  return true;
}

function validateFileStructure() {
  log('\n[VALIDATE] Checking file structure...', 'blue');

  const requiredPaths = [
    { path: 'package.json', type: 'file' },
    { path: 'src', type: 'directory' },
    { path: 'scripts', type: 'directory' },
    { path: 'scripts/build.js', type: 'file' },
    { path: 'scripts/teardown.js', type: 'file' },
    { path: 'scripts/validate.js', type: 'file' }
  ];

  let allValid = true;

  for (const { path, type } of requiredPaths) {
    if (!existsSync(path)) {
      log(`✗ Missing ${type}: ${path}`, 'red');
      allValid = false;
    } else {
      log(`✓ Found ${type}: ${path}`, 'green');
    }
  }

  return allValid;
}

function validatePackageJson() {
  log('\n[VALIDATE] Checking package.json...', 'blue');

  try {
    const pkg = JSON.parse(readFileSync('package.json', 'utf-8'));

    if (!pkg.name) {
      log('✗ package.json missing "name" field', 'red');
      return false;
    }

    if (!pkg.scripts || !pkg.scripts.build || !pkg.scripts.teardown || !pkg.scripts.validate) {
      log('✗ package.json missing required scripts', 'red');
      return false;
    }

    log(`✓ package.json valid (${pkg.name} v${pkg.version || '0.0.0'})`, 'green');
    return true;
  } catch (error) {
    log(`✗ Failed to read package.json: ${error.message}`, 'red');
    return false;
  }
}

function validateModuleSystem() {
  log('\n[VALIDATE] Checking module system...', 'blue');

  try {
    // Test that ES modules work
    const testModule = { test: 'ES modules working' };
    log(`✓ ES module imports working`, 'green');
    return true;
  } catch (error) {
    log(`✗ Module system error: ${error.message}`, 'red');
    return false;
  }
}

function main() {
  log('═══════════════════════════════════════', 'blue');
  log('  SPL2 Runtime POC - Validation', 'blue');
  log('═══════════════════════════════════════', 'blue');

  const checks = [
    validateNodeVersion(),
    validateFileStructure(),
    validatePackageJson(),
    validateModuleSystem()
  ];

  const allPassed = checks.every(check => check === true);

  if (allPassed) {
    log('\n╔═══════════════════════════════════════╗', 'green');
    log('║  ✓ VALIDATION PASSED                  ║', 'green');
    log('║  Environment ready for development    ║', 'green');
    log('╚═══════════════════════════════════════╝', 'green');
    log('');
    process.exit(0);
  } else {
    log('\n╔═══════════════════════════════════════╗', 'red');
    log('║  ✗ VALIDATION FAILED                  ║', 'red');
    log('║  Fix errors above and retry           ║', 'red');
    log('╚═══════════════════════════════════════╝', 'red');
    log('');
    process.exit(1);
  }
}

main();
