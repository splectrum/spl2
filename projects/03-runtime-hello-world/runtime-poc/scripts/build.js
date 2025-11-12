#!/usr/bin/env node

// Requirements: ../Twin_pair_1_requirements_v1.0.0.md

/**
 * Build script for runtime-poc deployment
 *
 * Validates prerequisites and sets up development environment.
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';

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

function checkNodeVersion() {
  log('\n[BUILD] Checking Node.js version...', 'blue');

  const currentVersion = process.version;
  const requiredMajor = 18;
  const currentMajor = parseInt(currentVersion.slice(1).split('.')[0]);

  if (currentMajor < requiredMajor) {
    log(`✗ Node.js version ${currentVersion} found, but >= ${requiredMajor}.0.0 required`, 'red');
    log(`  Please install Node.js LTS from https://nodejs.org/`, 'yellow');
    process.exit(1);
  }

  log(`✓ Node.js ${currentVersion} meets requirements (>= ${requiredMajor}.0.0)`, 'green');
}

function installDependencies() {
  log('\n[BUILD] Installing dependencies...', 'blue');

  try {
    const pkg = JSON.parse(readFileSync('package.json', 'utf-8'));
    const hasDeps = (pkg.dependencies && Object.keys(pkg.dependencies).length > 0) ||
                    (pkg.devDependencies && Object.keys(pkg.devDependencies).length > 0);

    if (!hasDeps) {
      log('✓ No dependencies to install', 'green');
      return;
    }

    execSync('npm install', { stdio: 'inherit' });
    log('✓ Dependencies installed successfully', 'green');
  } catch (error) {
    log('✗ Failed to install dependencies', 'red');
    log(`  ${error.message}`, 'red');
    process.exit(1);
  }
}

function setupModuleAliases() {
  log('\n[BUILD] Setting up module aliases...', 'blue');

  // Ensure node_modules exists
  if (!existsSync('node_modules')) {
    mkdirSync('node_modules');
  }

  // Define module aliases (clean names -> actual paths)
  const aliases = {
    'spl_utils': '../../src/modules/spl/_utils/index.js',
    'spl_context': '../../src/modules/spl/_context/index.js'
  };

  try {
    for (const [name, targetPath] of Object.entries(aliases)) {
      const packageDir = `node_modules/${name}`;

      // Create package directory
      if (!existsSync(packageDir)) {
        mkdirSync(packageDir, { recursive: true });
      }

      // Create package.json
      const packageJson = {
        name: name,
        version: '1.0.0',
        type: 'module',
        main: './index.js',
        exports: './index.js'
      };
      writeFileSync(`${packageDir}/package.json`, JSON.stringify(packageJson, null, 2));

      // Create index.js that re-exports from actual location
      const indexContent = `// Re-export from actual location\nexport * from '${targetPath}';\n`;
      writeFileSync(`${packageDir}/index.js`, indexContent);

      log(`✓ Created alias: ${name} -> ${targetPath}`, 'green');
    }

    log('✓ Module aliases created successfully', 'green');
  } catch (error) {
    log('✗ Failed to setup module aliases', 'red');
    log(`  ${error.message}`, 'red');
    process.exit(1);
  }
}

function main() {
  log('═══════════════════════════════════════', 'blue');
  log('  SPL2 Runtime POC - Build', 'blue');
  log('═══════════════════════════════════════', 'blue');

  checkNodeVersion();
  installDependencies();
  setupModuleAliases();

  log('\n[BUILD] Build completed successfully!', 'green');
  log('  Run "npm run validate" to verify environment\n', 'yellow');
}

main();
