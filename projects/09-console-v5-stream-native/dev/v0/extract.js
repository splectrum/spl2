#!/usr/bin/env node
// extract.js - Extract successful work module from environment

import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

console.log('=== Extract - Create Install Candidate ===')
console.log('')

// Find environment to extract from
let envName
let envPath

if (process.argv[2]) {
  // Specific environment provided
  envName = process.argv[2]
  envPath = `environments/${envName}`
} else {
  // Find most recent environment
  if (!fs.existsSync('environments')) {
    console.error('Error: No environments found')
    console.error('Run ./deploy.js first')
    process.exit(1)
  }

  const envDirs = fs.readdirSync('environments')
    .filter(name => fs.statSync(`environments/${name}`).isDirectory())
    .sort()
    .reverse()

  if (envDirs.length === 0) {
    console.error('Error: No environments found')
    console.error('Run ./deploy.js first')
    process.exit(1)
  }

  envName = envDirs[0]
  envPath = `environments/${envName}`
}

if (!fs.existsSync(envPath)) {
  console.error(`Error: Environment not found: ${envPath}`)
  process.exit(1)
}

console.log(`Extracting from: ${envName}`)
console.log(`Path: ${envPath}`)
console.log('')

// Check if modules/pr09 exists
const modulePath = `${envPath}/modules/pr09`
if (!fs.existsSync(modulePath)) {
  console.error('Error: No modules/pr09/ found in environment')
  process.exit(1)
}

// Create extraction directory (install candidate)
const extractDir = `extracted/${envName}`
if (!fs.existsSync('extracted')) {
  fs.mkdirSync('extracted', { recursive: true })
}

if (fs.existsSync(extractDir)) {
  console.log(`⚠ Warning: ${extractDir} already exists, removing...`)
  fs.rmSync(extractDir, { recursive: true })
}

fs.mkdirSync(extractDir, { recursive: true })

// Copy work module
console.log('Copying work module...')
execSync(`cp -r ${modulePath} ${extractDir}/`, { stdio: 'inherit' })

console.log('✓ Work module copied')
console.log('')

// Extract test reports if they exist
const eventsPath = `${envPath}/events`
if (fs.existsSync(eventsPath)) {
  console.log('Extracting event logs...')
  execSync(`cp -r ${eventsPath} ${extractDir}/`, { stdio: 'inherit' })
  console.log('✓ Event logs extracted')
  console.log('')
}

// Create a manifest
const manifest = {
  extractedFrom: envName,
  extractedAt: new Date().toISOString(),
  sourcePath: modulePath,
  extractedTo: extractDir
}

fs.writeFileSync(
  `${extractDir}/MANIFEST.json`,
  JSON.stringify(manifest, null, 2)
)

console.log('=== Extraction Complete ===')
console.log('')
console.log(`Install candidate created: ${extractDir}`)
console.log(`  pr09/ - Work module`)
console.log(`  events/ - Event logs (if any)`)
console.log(`  MANIFEST.json - Extraction metadata`)
console.log('')
console.log('Next steps:')
console.log('  1. Review extracted files')
console.log('  2. Update implementation/ if needed')
console.log('  3. Continue to next iteration or publish')
