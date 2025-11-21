#!/usr/bin/env node
// Test runner - Execute all selfevals in a directory tree
// Discovers and runs all *_selfeval*.js files with their data

const { readdirSync, statSync, existsSync } = require('fs');
const { join, basename, dirname } = require('path');
const { execSync } = require('child_process');

/**
 * Find all selfeval scripts in a directory
 * @param {string} dir - Directory to search
 * @returns {Array<string>} - Array of selfeval script paths
 */
function findSelfevals(dir) {
  const selfevals = [];

  // Check for _reqs folder
  const reqsPath = join(dir, '_reqs');
  if (existsSync(reqsPath)) {
    const files = readdirSync(reqsPath);
    files.forEach(file => {
      if (file.includes('_selfeval') && file.endsWith('.js')) {
        selfevals.push(join(reqsPath, file));
      }
    });
  }

  return selfevals;
}

/**
 * Execute a selfeval script
 * @param {string} scriptPath - Path to selfeval script
 * @param {string} cwd - Working directory for execution
 * @returns {boolean} - true if passed, false if failed
 */
function executeSelfeval(scriptPath, cwd) {
  const scriptName = basename(scriptPath);

  try {
    // Execute in the directory containing _reqs
    execSync(`node _reqs/${scriptName}`, {
      cwd,
      stdio: 'inherit',
      encoding: 'utf-8'
    });
    return true;
  } catch (error) {
    // Script exited with non-zero (test failed)
    return false;
  }
}

/**
 * Run selfevals for a single node
 * @param {string} nodePath - Path to node directory
 * @param {string} nodeLabel - Label for reporting (e.g., "Module root")
 * @returns {boolean} - true if all passed
 */
function runNodeSelfevals(nodePath, nodeLabel) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Testing: ${nodeLabel}`);
  console.log(`Path: ${nodePath}`);
  console.log(`${'='.repeat(60)}\n`);

  const selfevals = findSelfevals(nodePath);

  if (selfevals.length === 0) {
    console.log(`No selfevals found at this level\n`);
    return true;
  }

  console.log(`Found ${selfevals.length} selfeval(s)\n`);

  for (const selfeval of selfevals) {
    const name = basename(selfeval);
    console.log(`Running: ${name}`);
    console.log(`${'─'.repeat(60)}`);

    const passed = executeSelfeval(selfeval, nodePath);

    if (!passed) {
      console.log(`\n❌ FAILED: ${name}`);
      console.log(`\nStopping on first failure.`);
      return false;
    }
  }

  console.log(`✅ All selfevals passed for ${nodeLabel}\n`);
  return true;
}

/**
 * Main execution - cascade through module structure
 */
function main() {
  const moduleRoot = process.argv[2] || process.cwd();

  console.log(`\n${'═'.repeat(60)}`);
  console.log(`SPL2 Self-Evaluation Test Runner`);
  console.log(`${'═'.repeat(60)}`);
  console.log(`Module: ${moduleRoot}\n`);

  // Level 1: Module root
  if (!runNodeSelfevals(moduleRoot, 'Module root')) {
    process.exit(1);
  }

  // Level 2: Package (spl/)
  const packagePath = join(moduleRoot, 'spl');
  if (existsSync(packagePath)) {
    if (!runNodeSelfevals(packagePath, 'Package (spl/)')) {
      process.exit(1);
    }

    // Level 3: API (spl/dev/)
    const apiPath = join(packagePath, 'dev');
    if (existsSync(apiPath)) {
      if (!runNodeSelfevals(apiPath, 'API (spl/dev/)')) {
        process.exit(1);
      }

      // Level 4: Methods
      const methods = readdirSync(apiPath).filter(name => {
        const path = join(apiPath, name);
        return !name.startsWith('_') &&
               !name.startsWith('.') &&
               statSync(path).isDirectory();
      });

      for (const method of methods) {
        const methodPath = join(apiPath, method);
        if (!runNodeSelfevals(methodPath, `Method (spl/dev/${method}/)`)) {
          process.exit(1);
        }
      }
    }
  }

  // Success!
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`✅ ALL TESTS PASSED`);
  console.log(`${'═'.repeat(60)}\n`);
  process.exit(0);
}

main();
