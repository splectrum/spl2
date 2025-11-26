#!/usr/bin/env node
// upgrade.js - Bundle upgrade: creates splectrum install with spl entry point
//
// Usage:
//   node upgrade.js              # Default: install to bundle root (../..)
//   node upgrade.js ./test-spl   # Custom path for testing
//
// Creates:
//   <target>/
//   ├── spl                    # Entry point (#!/usr/bin/env node, executable)
//   └── splectrum/
//       ├── package.json
//       ├── node_modules/lib/  # lib resolution (re-exports)
//       ├── lib/               # symlinks to module _lib/
//       ├── modules/
//       │   └── wm_spl_dev/    # copied from implementation/
//       └── run.js             # core runner

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Parse args
const customPath = process.argv[2] || null
const targetPath = customPath
  ? path.resolve(__dirname, customPath)
  : path.resolve(__dirname, '../..')  // bundle root (dev/v0 -> project root)

const splectrumPath = path.join(targetPath, 'splectrum')
const splPath = path.join(targetPath, 'spl')
const splMjsPath = path.join(splectrumPath, 'spl.mjs')

console.log('=== Upgrade - Create Splectrum Install ===')
console.log('')
console.log(`Target: ${targetPath}`)
console.log(`Splectrum: ${splectrumPath}`)
console.log(`Entry point: ${splPath}`)
console.log('')

// Check if target exists
if (!fs.existsSync(targetPath)) {
  fs.mkdirSync(targetPath, { recursive: true })
  console.log('✓ Created target directory')
}

// Check implementation exists
const implDir = path.join(__dirname, 'implementation')
if (!fs.existsSync(implDir)) {
  console.error('Error: implementation/ directory not found')
  process.exit(1)
}

// Find work module (wm_* pattern)
const implEntries = fs.readdirSync(implDir)
const workModuleName = implEntries.find(e => e.startsWith('wm_'))
if (!workModuleName) {
  console.error('Error: No work module (wm_*) found in implementation/')
  process.exit(1)
}

// Remove existing splectrum/ if present
if (fs.existsSync(splectrumPath)) {
  fs.rmSync(splectrumPath, { recursive: true })
  console.log('✓ Removed existing splectrum/')
}

// Create splectrum/
fs.mkdirSync(splectrumPath, { recursive: true })

// Create splectrum/modules/
const modulesDir = path.join(splectrumPath, 'modules')
fs.mkdirSync(modulesDir, { recursive: true })

// Copy work module
const workModuleSrc = path.join(implDir, workModuleName)
const workModuleDest = path.join(modulesDir, workModuleName)
fs.cpSync(workModuleSrc, workModuleDest, { recursive: true })
console.log(`✓ Copied ${workModuleName}/ to splectrum/modules/`)

// Set up lib/ symlinks (pointing to modules/wm_*/_lib/)
const libDir = path.join(splectrumPath, 'lib')
fs.mkdirSync(libDir, { recursive: true })

const libSourceDir = path.join(workModuleDest, '_lib')
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
const nodeModulesLib = path.join(splectrumPath, 'node_modules/lib')
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

// Create splectrum/package.json
const splectrumPackage = {
  name: 'splectrum',
  version: '0.1.0',
  type: 'module',
  description: 'Splectrum runtime'
}
fs.writeFileSync(
  path.join(splectrumPath, 'package.json'),
  JSON.stringify(splectrumPackage, null, 2) + '\n'
)
console.log('✓ Created splectrum/package.json')

// Create splectrum/run.js (core runner)
const runJs = `// run.js - Core runner for Splectrum methods
//
// Usage: Called by spl entry point
// Input: method path (e.g., 'spl/dev/clone') and input object
// Output: method result

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Run a method
 * @param {string} methodPath - Method path (e.g., 'spl/dev/clone')
 * @param {Object} input - Input object for the method
 * @param {Object} runtime - Runtime properties (cwd, splectrumDir, invokedFrom)
 * @returns {Object} Result with headers and any output
 */
export async function run(methodPath, input, runtime) {
  // Parse method path: 'package/api/method' (fully specified, no defaults)
  const parts = methodPath.split('/')

  if (parts.length !== 3) {
    throw new Error(\`Invalid method path: \${methodPath}. Expected package/api/method (e.g., spl/dev/clone)\`)
  }

  const [pkg, api, method] = parts

  // Find module containing method
  const modulesDir = path.join(__dirname, 'modules')
  const moduleEntries = fs.readdirSync(modulesDir)

  // Look for method in each module (wm_* modules)
  let methodModule = null
  let methodDir = null

  for (const moduleName of moduleEntries) {
    const candidatePath = path.join(modulesDir, moduleName, pkg, api, method)
    if (fs.existsSync(candidatePath)) {
      methodModule = moduleName
      methodDir = candidatePath
      break
    }
  }

  if (!methodModule) {
    throw new Error(\`Method not found: \${pkg}/\${api}/\${method}\`)
  }

  // Build record with input and runtime
  // Note: spl package methods need spl.request/runtime AND spl.api.method
  const record = {
    headers: {
      spl: {
        request: { completed: false },
        runtime: runtime || {}
      }
    },
    value: null
  }

  // Add method input under package.api.method
  // For spl package, merge into existing spl object
  if (pkg === 'spl') {
    record.headers.spl[api] = record.headers.spl[api] || {}
    record.headers.spl[api][method] = input
  } else {
    record.headers[pkg] = { [api]: { [method]: input } }
  }

  // Import and run method
  const methodIndex = path.join(methodDir, 'index.js')
  const methodMod = await import(methodIndex)

  methodMod.handle(record)

  // Return result
  return {
    completed: record.headers.spl.request.completed,
    error: record.headers.spl.runtime.error || null,
    output: record.headers[pkg][api][method].output || null
  }
}

export default { run }
`
fs.writeFileSync(path.join(splectrumPath, 'run.js'), runJs)
console.log('✓ Created splectrum/run.js')

// Create spl shell wrapper
const splWrapper = `#!/bin/sh
# spl - Splectrum CLI entry point
# Hands off to splectrum/spl.mjs for ES module support

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
exec node "\${SCRIPT_DIR}/splectrum/spl.mjs" "$@"
`
fs.writeFileSync(splPath, splWrapper)
fs.chmodSync(splPath, 0o755)
console.log('✓ Created spl entry point (shell wrapper)')

// Create splectrum/spl.mjs (actual implementation)
const splMjs = `// spl.mjs - Splectrum CLI implementation
//
// Usage:
//   ./spl package/api/method [--arg=value ...]
//
// Examples:
//   ./spl spl/dev/clone --path=../v1.0
//   ./spl spl/dev/clone --path=../v1.0 --name=my-project

import path from 'path'
import { fileURLToPath } from 'url'
import { run } from './run.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Bundle root is parent of splectrum/
const bundleRoot = path.dirname(__dirname)

// Parse args
const args = process.argv.slice(2)
if (args.length === 0) {
  console.error('Usage: spl package/api/method [--arg=value ...]')
  console.error('')
  console.error('Examples:')
  console.error('  spl spl/dev/clone --path=../v1.0')
  process.exit(1)
}

// First arg is method path
const methodPath = args[0]

// Parse remaining args as input
const input = {}
for (let i = 1; i < args.length; i++) {
  const arg = args[i]
  if (arg.startsWith('--')) {
    const [key, ...valueParts] = arg.slice(2).split('=')
    const value = valueParts.join('=') || true
    input[key] = value
  }
}

// Build runtime properties (passed in record, not process globals)
const runtime = {
  cwd: bundleRoot,              // bundle root, not process.cwd()
  splectrumDir: __dirname,      // splectrum/ directory
  invokedFrom: process.cwd()    // where user ran the command
}

// Run method
console.log(\`Running: \${methodPath}\`)
console.log(\`Input: \${JSON.stringify(input)}\`)
console.log(\`Runtime: \${JSON.stringify(runtime)}\`)
console.log('')

// Change to splectrum directory for lib resolution
process.chdir(__dirname)

try {
  const result = await run(methodPath, input, runtime)

  if (result.error) {
    console.error(\`Error: \${result.error}\`)
    process.exit(1)
  }

  console.log('Result:')
  console.log(JSON.stringify(result.output, null, 2))
} catch (err) {
  console.error(\`Error: \${err.message}\`)
  process.exit(1)
}
`
fs.writeFileSync(splMjsPath, splMjs)
console.log('✓ Created splectrum/spl.mjs (implementation)')

console.log('')
console.log('=== Upgrade Complete ===')
console.log('')
console.log('Structure:')
console.log(`  ${targetPath}/`)
console.log('  ├── spl                   # shell wrapper')
console.log('  └── splectrum/')
console.log('      ├── spl.mjs           # CLI implementation')
console.log('      ├── run.js            # core runner')
console.log('      ├── package.json')
console.log('      ├── lib/              # symlinks')
console.log('      ├── node_modules/lib/ # re-exports')
console.log('      └── modules/')
console.log(`          └── ${workModuleName}/`)
console.log('')
console.log('Usage:')
console.log(`  cd ${targetPath}`)
console.log('  ./spl spl/dev/clone --path=../v1.0')
console.log('')
