// spl.mjs - Splectrum CLI implementation
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
console.log(`Running: ${methodPath}`)
console.log(`Input: ${JSON.stringify(input)}`)
console.log(`Runtime: ${JSON.stringify(runtime)}`)
console.log('')

// Change to splectrum directory for lib resolution
process.chdir(__dirname)

try {
  const result = await run(methodPath, input, runtime)

  if (result.error) {
    console.error(`Error: ${result.error}`)
    process.exit(1)
  }

  console.log('Result:')
  console.log(JSON.stringify(result.output, null, 2))
} catch (err) {
  console.error(`Error: ${err.message}`)
  process.exit(1)
}
