#!/usr/bin/env node
// destroy.js - Clean up environment(s)
//
// Usage:
//   node destroy.js                    # Destroy most recent environment
//   node destroy.js env-1234567890     # Destroy specific environment
//   node destroy.js --all              # Destroy all environments

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import readline from 'readline'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const envsDir = path.join(__dirname, 'environments')

console.log('=== Destroy - Clean Up Environments ===')
console.log('')

// Check environments folder exists
if (!fs.existsSync(envsDir)) {
  console.log('No environments folder found')
  process.exit(0)
}

const envDirs = fs.readdirSync(envsDir)
  .filter(name => fs.statSync(path.join(envsDir, name)).isDirectory())
  .filter(name => name.startsWith('env-'))
  .sort()

if (envDirs.length === 0) {
  console.log('No environments to destroy')
  process.exit(0)
}

// Determine what to destroy
const arg = process.argv[2]

if (arg === '--all') {
  // Destroy all
  console.log('Environments:')
  envDirs.forEach(env => console.log(`  ${env}`))
  console.log('')

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  rl.question('Destroy ALL environments? [y/N] ', (answer) => {
    rl.close()
    if (answer.toLowerCase() === 'y') {
      for (const env of envDirs) {
        fs.rmSync(path.join(envsDir, env), { recursive: true })
        console.log(`✓ Destroyed ${env}`)
      }
      console.log('')
      console.log('✓ All environments destroyed')
    } else {
      console.log('Cancelled')
    }
  })
} else {
  // Destroy specific or most recent
  let targetEnv

  if (arg && arg.startsWith('env-')) {
    targetEnv = arg
  } else {
    // Most recent (last in sorted list)
    targetEnv = envDirs[envDirs.length - 1]
  }

  const targetPath = path.join(envsDir, targetEnv)

  if (!fs.existsSync(targetPath)) {
    console.error(`Error: Environment not found: ${targetEnv}`)
    process.exit(1)
  }

  console.log(`Target: ${targetEnv}`)
  console.log(`Path: ${targetPath}`)
  console.log('')

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  rl.question('Destroy this environment? [y/N] ', (answer) => {
    rl.close()
    if (answer.toLowerCase() === 'y') {
      fs.rmSync(targetPath, { recursive: true })
      console.log('')
      console.log(`✓ Destroyed ${targetEnv}`)
    } else {
      console.log('Cancelled')
    }
  })
}
