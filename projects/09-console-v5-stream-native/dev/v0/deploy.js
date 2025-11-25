#!/usr/bin/env node
// deploy.js - Create new dev environment instance from implementation/

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import install from './install/install.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log('=== Deploy - Create Dev Environment ===')
console.log('')

// Run install to prepare implementation/
await install()
console.log('')

// Check implementation exists
const implDir = path.join(__dirname, 'implementation')
if (!fs.existsSync(implDir)) {
  console.error('Error: implementation/ directory not found after install')
  process.exit(1)
}

// Generate environment name with timestamp
const envName = `env-${Date.now()}`
const envPath = path.join(__dirname, 'environments', envName)

console.log('=== Creating Environment Instance ===')
console.log('')
console.log(`Environment: ${envName}`)
console.log(`Path: ${envPath}`)
console.log('')

// Copy implementation/ to environment
fs.cpSync(implDir, envPath, { recursive: true })
console.log('✓ Copied implementation/ to environment')

// Create events/requests/ directory
fs.mkdirSync(path.join(envPath, 'events/requests'), { recursive: true })
console.log('✓ Created events/requests/')

// Create package.json for environment
const envPackage = {
  name: envName,
  version: '1.0.0',
  type: 'module'
}
fs.writeFileSync(path.join(envPath, 'package.json'), JSON.stringify(envPackage, null, 2))
console.log('✓ Created package.json')

// Copy handler and submit to environment
fs.copyFileSync(path.join(__dirname, 'handler.js'), path.join(envPath, 'handler.js'))
fs.copyFileSync(path.join(__dirname, 'submit.js'), path.join(envPath, 'submit.js'))
console.log('✓ Copied handler.js and submit.js')

console.log('')
console.log('=== Environment Created ===')
console.log('')
console.log('Structure:')
console.log(`  ${envPath}/`)
console.log('  ├── package.json')
console.log('  ├── handler.js')
console.log('  ├── submit.js')
console.log('  ├── events/requests/')
console.log('  ├── lib/ (symlinks)')
console.log('  ├── node_modules/lib/ (re-exports)')
console.log('  ├── types/')
console.log('  └── work_module/')
console.log('')
console.log('To use:')
console.log(`  cd ${envPath}`)
console.log('  node submit.js')
console.log('  node handler.js')
console.log('')
console.log(`✓ Deployment complete: ${envName}`)
