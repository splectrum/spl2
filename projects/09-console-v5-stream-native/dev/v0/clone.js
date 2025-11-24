#!/usr/bin/env node
// clone.js - Clone this dev environment package to a new iteration

import fs from 'fs'
import path from 'path'

if (process.argv.length < 3) {
  console.error('Usage: node clone.js <destination>')
  console.error('')
  console.error('Examples:')
  console.error('  node clone.js ../v1.0')
  console.error('  node clone.js ../v1.1')
  console.error('')
  console.error('Destination is relative to v0/ directory')
  process.exit(1)
}

const destination = process.argv[2]
const destPath = path.resolve(destination)
const sourcePath = process.cwd()

console.log('=== Clone - Create New Iteration ===')
console.log('')
console.log(`Source: ${sourcePath}`)
console.log(`Destination: ${destPath}`)
console.log('')

// Check if destination exists
if (fs.existsSync(destPath)) {
  console.error(`Error: Destination already exists: ${destPath}`)
  console.error('Remove it first or choose a different destination')
  process.exit(1)
}

// Create destination directory
fs.mkdirSync(destPath, { recursive: true })

// List of items to copy
const itemsToCopy = [
  'README.md',
  'package.json',
  'deploy.js',
  'test.js',
  'destroy.js',
  'install',
  'implementation',
  'environments'
]

// Copy each item
for (const item of itemsToCopy) {
  const sourcePath = path.join(process.cwd(), item)
  const destItemPath = path.join(destPath, item)

  if (fs.existsSync(sourcePath)) {
    const stats = fs.statSync(sourcePath)

    if (stats.isDirectory()) {
      // Copy directory recursively
      fs.cpSync(sourcePath, destItemPath, { recursive: true })
      console.log(`✓ Copied ${item}/ (directory)`)
    } else {
      // Copy file
      fs.copyFileSync(sourcePath, destItemPath)
      console.log(`✓ Copied ${item}`)
    }
  }
}

// Make scripts executable
const scripts = ['deploy.js', 'test.js', 'destroy.js', 'clone.js']
for (const script of scripts) {
  const scriptPath = path.join(destPath, script)
  if (fs.existsSync(scriptPath)) {
    fs.chmodSync(scriptPath, 0o755)
  }
}

// Update package.json with new iteration info
const destName = path.basename(destPath)
const packageJsonPath = path.join(destPath, 'package.json')

if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

  // Update name and version based on destination folder
  // v1.0 -> pr09-v1.0-iteration, version 1.0.0
  // v1.1 -> pr09-v1.1-iteration, version 1.1.0
  const versionMatch = destName.match(/^v(\d+)\.(\d+)$/)

  if (versionMatch) {
    const [, major, minor] = versionMatch
    packageJson.name = `pr09-${destName}-iteration`
    packageJson.version = `${major}.${minor}.0`
    packageJson.description = `Project 09 - Iteration ${major}.${minor}`
  } else {
    // Non-standard name, just use as-is
    packageJson.name = `pr09-${destName}`
    packageJson.version = '0.0.0'
    packageJson.description = `Project 09 - ${destName}`
  }

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n')
  console.log(`✓ Updated package.json (${packageJson.name} v${packageJson.version})`)
}

console.log('')
console.log('✓ Clone complete!')
console.log('')
console.log('Next steps:')
console.log(`  cd ${path.relative(process.cwd(), destPath)}`)
console.log('  # Add your code to implementation/pr09/')
console.log('  node deploy.js')
