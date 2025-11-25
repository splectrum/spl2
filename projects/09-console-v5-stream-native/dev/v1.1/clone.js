#!/usr/bin/env node
// clone.js - Clone this dev environment package to a new iteration
//
// Usage:
//   node clone.js ../v1.2
//   node clone.js ../v2.0

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

if (process.argv.length < 3) {
  console.error('Usage: node clone.js <destination>')
  console.error('')
  console.error('Examples:')
  console.error('  node clone.js ../v1.2')
  console.error('  node clone.js ../v2.0')
  console.error('')
  console.error('Destination is relative to current directory')
  process.exit(1)
}

const destination = process.argv[2]
const destPath = path.resolve(__dirname, destination)
const sourcePath = __dirname

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

// Files to copy
const filesToCopy = [
  'package.json',
  'deploy.js',
  'test.js',
  'publish.js',
  'destroy.js',
  'handler.js',
  'submit.js',
  'clone.js'
]

// Directories to copy
const dirsToCopy = [
  'implementation'
]

// Directories to create empty
const dirsToCreate = [
  'environments'
]

// Copy files
for (const file of filesToCopy) {
  const srcFile = path.join(sourcePath, file)
  const destFile = path.join(destPath, file)

  if (fs.existsSync(srcFile)) {
    fs.copyFileSync(srcFile, destFile)
    console.log(`✓ Copied ${file}`)
  }
}

// Copy directories
for (const dir of dirsToCopy) {
  const srcDir = path.join(sourcePath, dir)
  const destDir = path.join(destPath, dir)

  if (fs.existsSync(srcDir)) {
    fs.cpSync(srcDir, destDir, { recursive: true })
    console.log(`✓ Copied ${dir}/`)
  }
}

// Create empty directories
for (const dir of dirsToCreate) {
  const destDir = path.join(destPath, dir)
  fs.mkdirSync(destDir, { recursive: true })
  console.log(`✓ Created ${dir}/`)
}

// Clean implementation - keep only types and base work_module (no timestamped versions)
const implDir = path.join(destPath, 'implementation')
if (fs.existsSync(implDir)) {
  const entries = fs.readdirSync(implDir)
  for (const entry of entries) {
    // Remove timestamped work_module versions (work_module-NNNN)
    if (entry.startsWith('work_module-')) {
      fs.rmSync(path.join(implDir, entry), { recursive: true })
      console.log(`✓ Removed ${entry}/ (timestamped version)`)
    }
  }
}

// Update package.json with new iteration info
const destName = path.basename(destPath)
const packageJsonPath = path.join(destPath, 'package.json')

if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

  // Update name based on destination folder
  const versionMatch = destName.match(/^v(\d+)\.(\d+)$/)

  if (versionMatch) {
    const [, major, minor] = versionMatch
    packageJson.name = `pr09-${destName}`
    packageJson.version = `${major}.${minor}.0`
  } else {
    packageJson.name = `pr09-${destName}`
    packageJson.version = '0.0.0'
  }

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n')
  console.log(`✓ Updated package.json (${packageJson.name} v${packageJson.version})`)
}

console.log('')
console.log('=== Clone Complete ===')
console.log('')
console.log('Structure:')
console.log(`  ${destPath}/`)
console.log('  ├── package.json')
console.log('  ├── deploy.js      # Create environment')
console.log('  ├── test.js        # Run selfevals')
console.log('  ├── publish.js     # Publish work_module')
console.log('  ├── destroy.js     # Clean up environment')
console.log('  ├── handler.js     # Request handler (copied to env)')
console.log('  ├── submit.js      # Test submitter (copied to env)')
console.log('  ├── clone.js       # Clone to new iteration')
console.log('  ├── environments/  # (empty)')
console.log('  └── implementation/')
console.log('      ├── types/')
console.log('      └── work_module/')
console.log('')
console.log('Next steps:')
console.log(`  cd ${destination}`)
console.log('  node deploy.js')
console.log('  node test.js')
