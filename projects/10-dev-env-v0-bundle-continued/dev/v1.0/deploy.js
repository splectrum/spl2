#!/usr/bin/env node
// deploy.js - Create new dev environment instance
//
// Creates environment with:
//   env-{timestamp}/
//   ├── package.json
//   ├── handler.js
//   ├── submit.js
//   ├── events/requests/
//   ├── lib/              (symlinks to modules/work_module/_lib/)
//   ├── node_modules/lib/ (re-exports from lib/)
//   └── modules/
//       ├── types/
//       └── work_module/

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log('=== Deploy - Create Dev Environment ===')
console.log('')

// Check implementation exists
const implDir = path.join(__dirname, 'implementation')
if (!fs.existsSync(implDir)) {
  console.error('Error: implementation/ directory not found')
  process.exit(1)
}

// Generate environment name with timestamp
const envName = `env-${Date.now()}`
const envPath = path.join(__dirname, 'environments', envName)

console.log(`Environment: ${envName}`)
console.log(`Path: ${envPath}`)
console.log('')

// Create environment directory
fs.mkdirSync(envPath, { recursive: true })

// Create modules/ directory and copy implementation contents
const modulesDir = path.join(envPath, 'modules')
fs.mkdirSync(modulesDir, { recursive: true })

// Copy types
const typesSrc = path.join(implDir, 'types')
if (fs.existsSync(typesSrc)) {
  fs.cpSync(typesSrc, path.join(modulesDir, 'types'), { recursive: true })
  console.log('✓ Copied types/ to modules/')
}

// Copy work_module
const workModuleSrc = path.join(implDir, 'work_module')
if (fs.existsSync(workModuleSrc)) {
  fs.cpSync(workModuleSrc, path.join(modulesDir, 'work_module'), { recursive: true })
  console.log('✓ Copied work_module/ to modules/')
}

// Set up lib/ symlinks (pointing to modules/work_module/_lib/)
const libDir = path.join(envPath, 'lib')
fs.mkdirSync(libDir, { recursive: true })

const libSourceDir = path.join(modulesDir, 'work_module/_lib')
if (fs.existsSync(libSourceDir)) {
  const libFiles = fs.readdirSync(libSourceDir).filter(f => f.endsWith('.js'))
  for (const file of libFiles) {
    const target = path.join(libDir, file)
    const source = path.relative(path.dirname(target), path.join(libSourceDir, file))
    fs.symlinkSync(source, target)
  }
  console.log(`✓ Created ${libFiles.length} lib symlink(s)`)
}

// Set up node_modules/lib re-exports
const nodeModulesLib = path.join(envPath, 'node_modules/lib')
fs.mkdirSync(nodeModulesLib, { recursive: true })
fs.writeFileSync(
  path.join(nodeModulesLib, 'package.json'),
  JSON.stringify({ name: 'lib', type: 'module' }, null, 2)
)

if (fs.existsSync(libSourceDir)) {
  const libFiles = fs.readdirSync(libSourceDir).filter(f => f.endsWith('.js'))
  for (const file of libFiles) {
    const content = `// Re-export from lib/
export * from '../../lib/${file}'
export { default } from '../../lib/${file}'
`
    fs.writeFileSync(path.join(nodeModulesLib, file), content)
  }
  console.log('✓ Created node_modules/lib/ re-exports')
}

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
console.log('  └── modules/')
console.log('      ├── types/')
console.log('      └── work_module/')
console.log('')
console.log('To use:')
console.log(`  cd ${envPath}`)
console.log('  node submit.js')
console.log('  node handler.js')
console.log('')
console.log(`✓ Deployment complete: ${envName}`)
