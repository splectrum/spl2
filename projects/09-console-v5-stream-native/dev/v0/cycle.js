#!/usr/bin/env node
// cycle.js - Run prepare + test cycle
//
// Convenience script that rebuilds hierarchy and runs tests.
// Use when structure changes or for quick iteration.
//
// Usage:
//   node cycle.js                      # Cycle most recent environment
//   node cycle.js env-1234567890       # Cycle specific environment

import { execSync } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const envArg = process.argv[2] || ''

try {
  // Run prepare
  console.log('╔════════════════════════════════════════════════════════════╗')
  console.log('║                         PREPARE                            ║')
  console.log('╚════════════════════════════════════════════════════════════╝')
  console.log('')
  execSync(`node prepare.js ${envArg}`, { cwd: __dirname, stdio: 'inherit' })

  console.log('')
  console.log('╔════════════════════════════════════════════════════════════╗')
  console.log('║                          TEST                              ║')
  console.log('╚════════════════════════════════════════════════════════════╝')
  console.log('')
  execSync(`node test.js ${envArg}`, { cwd: __dirname, stdio: 'inherit' })

} catch (error) {
  // Error already printed by child process
  process.exit(1)
}
