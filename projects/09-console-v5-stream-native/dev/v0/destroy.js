#!/usr/bin/env node
// destroy.js - Remove environment(s)

import fs from 'fs'
import readline from 'readline'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const askQuestion = (question) => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer)
    })
  })
}

console.log('=== Destroy - Remove Environment(s) ===')
console.log('')

if (!fs.existsSync('environments')) {
  console.log('No environments directory found')
  rl.close()
  process.exit(0)
}

const envName = process.argv[2]

if (envName) {
  // Remove specific environment
  const envPath = `environments/${envName}`

  if (!fs.existsSync(envPath)) {
    console.log(`Environment not found: ${envName}`)
    rl.close()
    process.exit(1)
  }

  console.log('Will remove:')
  console.log(`  ${envPath}/`)
  console.log('')

  const answer = await askQuestion('Continue? (y/N) ')

  if (answer.toLowerCase() !== 'y') {
    console.log('Cancelled')
    rl.close()
    process.exit(0)
  }

  fs.rmSync(envPath, { recursive: true, force: true })
  console.log(`✓ Removed ${envName}`)
} else {
  // Remove all environments
  const envDirs = fs.readdirSync('environments')
    .filter(name => fs.statSync(`environments/${name}`).isDirectory())

  if (envDirs.length === 0) {
    console.log('No environments to remove')
    rl.close()
    process.exit(0)
  }

  console.log(`Will remove ${envDirs.length} environment(s):`)
  for (const dir of envDirs) {
    console.log(`  - ${dir}`)
  }
  console.log('')

  const answer = await askQuestion('Continue? (y/N) ')

  if (answer.toLowerCase() !== 'y') {
    console.log('Cancelled')
    rl.close()
    process.exit(0)
  }

  for (const dir of envDirs) {
    fs.rmSync(`environments/${dir}`, { recursive: true, force: true })
  }
  console.log(`✓ Removed ${envDirs.length} environment(s)`)
}

console.log('')
console.log('✓ Cleanup complete')
rl.close()
