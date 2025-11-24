#!/usr/bin/env node
// deploy.js - Create new dev environment from implementation/

import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

console.log('=== Deploy - Create Dev Environment ===')
console.log('')

// Check we're in the right place
if (!fs.existsSync('implementation')) {
  console.error('Error: implementation/ directory not found')
  console.error('Must run from v0/ directory')
  process.exit(1)
}

// Generate environment name with timestamp
const envName = `env-${Date.now()}`
const envPath = `environments/${envName}`

console.log(`Creating environment: ${envName}`)
console.log(`Path: ${envPath}`)
console.log('')

// Create environment structure
fs.mkdirSync(`${envPath}/modules`, { recursive: true })

// Copy work module to environment
if (fs.existsSync('implementation/pr09')) {
  fs.cpSync('implementation/pr09', `${envPath}/modules/pr09`, { recursive: true })
  console.log('✓ Copied pr09/ work module')
} else {
  console.log('⚠ No pr09/ directory in implementation/ - environment will be empty')
}

// Copy package.json template to environment
if (fs.existsSync('install/package.json.template')) {
  fs.copyFileSync('install/package.json.template', `${envPath}/package.json`)
  console.log('✓ Created package.json (from template)')
} else {
  console.log('⚠ No package.json template found - using default')
  const defaultPackage = {
    name: 'pr09-dev-env',
    version: '1.0.0',
    type: 'module',
    dependencies: {
      avsc: '^5.7.7'
    }
  }
  fs.writeFileSync(`${envPath}/package.json`, JSON.stringify(defaultPackage, null, 2))
  console.log('✓ Created package.json (default)')
}

// Copy any other install assets (except .template and .js files)
if (fs.existsSync('install')) {
  const files = fs.readdirSync('install')
  const assetFiles = files.filter(f => {
    return !f.endsWith('.template') &&
           !f.endsWith('.js') &&
           fs.statSync(`install/${f}`).isFile()
  })

  if (assetFiles.length > 0) {
    for (const file of assetFiles) {
      fs.copyFileSync(`install/${file}`, `${envPath}/${file}`)
    }
    console.log(`✓ Copied ${assetFiles.length} install asset(s)`)
  }
}

// Run install hook if it exists
if (fs.existsSync('install/install.js')) {
  console.log('')
  console.log('=== Running Install Hook ===')
  console.log('')

  try {
    // Import and run the install hook
    const installHook = await import(`./install/install.js?${Date.now()}`)
    if (typeof installHook.default === 'function') {
      await installHook.default(envPath, envName)
      console.log('✓ Install hook completed')
    } else {
      console.log('⚠ install.js found but no default export function')
    }
  } catch (error) {
    console.error('✗ Install hook failed:', error.message)
    process.exit(1)
  }
}

// Install dependencies in environment
console.log('')
console.log('Installing dependencies...')
try {
  execSync('npm install --silent', {
    cwd: envPath,
    stdio: 'inherit'
  })
} catch (error) {
  console.error('✗ npm install failed')
  process.exit(1)
}

console.log('')
console.log('=== Environment Created ===')
console.log('')
console.log('Structure:')
console.log(`  ${envPath}/`)
console.log('  ├── package.json')
console.log('  ├── node_modules/')
console.log('  └── modules/')
console.log('      └── pr09/')
console.log('')
console.log('=== Running Tests ===')
console.log('')

// Run tests if test script exists
if (fs.existsSync('test.js')) {
  try {
    execSync(`node test.js ${envName}`, { stdio: 'inherit' })
  } catch (error) {
    // Test script handles its own exit codes
  }
} else {
  console.log('No test.js found - skipping tests')
}

console.log('')
console.log(`✓ Deployment complete: ${envPath}`)
