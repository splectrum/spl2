// spl/dev/upgrade - Install base module to splectrum/ runtime directory
//
// Creates a deployable splectrum install from implementation/:
// - Prefers bm_* (standalone base module) if available
// - Falls back to wm_* (work module) if no base module
//
// Input:
//   module: specific module name (e.g., 'bm_spl-1764156560867')
//   target: target directory (default: bundle root's parent parent)

import fs from 'fs'
import path from 'path'
import { createSpl } from 'lib/core.js'

export function handle(record) {
  const spl = createSpl(record)
  const input = spl.headers.spl.dev.upgrade || {}
  const runtime = spl.headers.spl.runtime

  const bundleRoot = runtime.cwd
  const implDir = path.join(bundleRoot, 'implementation')

  // Determine target path
  // Default: bundle root (where spl entry point will live alongside splectrum/)
  const targetPath = input.target
    ? path.resolve(bundleRoot, input.target)
    : bundleRoot

  const splectrumPath = path.join(targetPath, 'splectrum')
  const splPath = path.join(targetPath, 'spl')

  // Check implementation exists
  if (!fs.existsSync(implDir)) {
    spl.error('implementation/ directory not found')
    return
  }

  // Find module to install
  const implEntries = fs.readdirSync(implDir)
  let moduleName

  if (input.module) {
    // Specific module requested
    if (!fs.existsSync(path.join(implDir, input.module))) {
      spl.error(`Module not found: ${input.module}`)
      return
    }
    moduleName = input.module
  } else {
    // Auto-select: prefer bm_* (active, non-timestamped) over wm_*
    // Priority: bm_* (active) > wm_* (active)
    const bmActive = implEntries.find(e =>
      e.startsWith('bm_') &&
      !e.includes('-') &&  // not timestamped
      fs.statSync(path.join(implDir, e)).isDirectory()
    )

    const wmActive = implEntries.find(e =>
      e.startsWith('wm_') &&
      !e.includes('-') &&  // not timestamped
      fs.statSync(path.join(implDir, e)).isDirectory()
    )

    if (bmActive) {
      moduleName = bmActive
    } else if (wmActive) {
      moduleName = wmActive
    } else {
      spl.error('No active module (bm_* or wm_*) found in implementation/')
      return
    }
  }

  const moduleSrc = path.join(implDir, moduleName)

  // Remove existing splectrum/ if present
  if (fs.existsSync(splectrumPath)) {
    fs.rmSync(splectrumPath, { recursive: true })
  }

  // Create splectrum/
  fs.mkdirSync(splectrumPath, { recursive: true })

  // Create splectrum/modules/
  const modulesDir = path.join(splectrumPath, 'modules')
  fs.mkdirSync(modulesDir, { recursive: true })

  // Copy module
  const moduleDest = path.join(modulesDir, moduleName)
  fs.cpSync(moduleSrc, moduleDest, { recursive: true })

  // Set up lib/ symlinks (pointing to modules/*/_lib/)
  const libDir = path.join(splectrumPath, 'lib')
  fs.mkdirSync(libDir, { recursive: true })

  const libSourceDir = path.join(moduleDest, '_lib')
  let libCount = 0
  if (fs.existsSync(libSourceDir)) {
    const libFiles = fs.readdirSync(libSourceDir).filter(f => f.endsWith('.js'))
    for (const file of libFiles) {
      const target = path.join(libDir, file)
      const source = path.relative(path.dirname(target), path.join(libSourceDir, file))
      fs.symlinkSync(source, target)
      libCount++
    }
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
  }

  // Create splectrum/package.json
  const splectrumPackage = {
    name: 'splectrum',
    version: '0.1.0',
    type: 'module',
    description: 'Splectrum runtime',
    installedModule: moduleName,
    installedAt: new Date().toISOString()
  }
  fs.writeFileSync(
    path.join(splectrumPath, 'package.json'),
    JSON.stringify(splectrumPackage, null, 2) + '\n'
  )

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

  // Look for method in each module (bm_* or wm_* modules)
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

  // Create spl shell wrapper
  const splWrapper = `#!/bin/sh
# spl - Splectrum CLI entry point
# Hands off to splectrum/spl.mjs for ES module support

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
exec node "\${SCRIPT_DIR}/splectrum/spl.mjs" "$@"
`
  fs.writeFileSync(splPath, splWrapper)
  fs.chmodSync(splPath, 0o755)

  // Create splectrum/spl.mjs (actual implementation)
  const splMjs = `// spl.mjs - Splectrum CLI implementation
//
// Usage:
//   ./spl package/api/method [--arg=value ...]
//
// Examples:
//   ./spl spl/dev/clone --path=../v1.0
//   ./spl spl/dev/deploy

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
  console.error('  spl spl/dev/deploy')
  console.error('  spl spl/dev/cycle')
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

// Build runtime properties
const runtime = {
  cwd: bundleRoot,
  splectrumDir: __dirname,
  invokedFrom: process.cwd()
}

// Run method
console.log(\`Running: \${methodPath}\`)
if (Object.keys(input).length > 0) {
  console.log(\`Input: \${JSON.stringify(input)}\`)
}
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
  fs.writeFileSync(path.join(splectrumPath, 'spl.mjs'), splMjs)

  // Set output
  spl.headers.spl.dev.upgrade.output = {
    target: targetPath,
    splectrumPath: splectrumPath,
    installedModule: moduleName,
    libSymlinks: libCount
  }

  spl.complete()
}
