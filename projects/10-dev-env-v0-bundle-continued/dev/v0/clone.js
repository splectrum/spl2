#!/usr/bin/env node
// clone.js - Clone this dev environment package to a new iteration
//
// Usage:
//   node clone.js <path> [name] [description]
//
// Examples:
//   node clone.js ../v1.0                         # auto: pr10-v1.0, "Project 10 - Dev environment v1.0"
//   node clone.js ../v1.0 my-feature              # custom name, default description
//   node clone.js ../v1.0 my-api "My API work"    # custom name and description

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

if (process.argv.length < 3) {
  console.error('Usage: node clone.js <path> [name] [description]')
  console.error('')
  console.error('Arguments:')
  console.error('  path         Destination path (required)')
  console.error('  name         Package name (optional, auto-detected from path)')
  console.error('  description  Package description (optional, default generated)')
  console.error('')
  console.error('Examples:')
  console.error('  node clone.js ../v1.0')
  console.error('  node clone.js ../v1.0 my-feature')
  console.error('  node clone.js ../v1.0 my-api "My API work"')
  process.exit(1)
}

const destination = process.argv[2]
const customName = process.argv[3] || null
const customDescription = process.argv[4] || null
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
  'prepare.js',
  'test.js',
  'cycle.js',
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

  // Detect project number from path: projects/NN-name/dev/vX.Y/
  // sourcePath is something like /path/to/projects/10-project-name/dev/v0
  const projectMatch = sourcePath.match(/projects\/(\d+)-[^/]+\/dev\//)
  const projectNum = projectMatch ? projectMatch[1] : '00'

  // Determine name: custom or auto-detected
  if (customName) {
    packageJson.name = customName
  } else {
    packageJson.name = `pr${projectNum}-${destName}`
  }

  // Determine version from destination folder name
  const versionMatch = destName.match(/^v(\d+)\.(\d+)$/)
  if (versionMatch) {
    const [, major, minor] = versionMatch
    packageJson.version = `${major}.${minor}.0`
  } else {
    packageJson.version = '0.0.0'
  }

  // Determine description: custom or default
  if (customDescription) {
    packageJson.description = customDescription
  } else {
    packageJson.description = `Project ${projectNum} - Dev environment ${destName}`
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
