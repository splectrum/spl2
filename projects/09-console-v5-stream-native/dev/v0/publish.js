#!/usr/bin/env node
// publish.js - Copy work_module from environment back to implementation
//
// After development cycle completes (tests pass), publish changes back
// to implementation with timestamp suffix for versioning.
//
// IMPORTANT: Flattens type hierarchy - copies all default files from type
// definitions into each node, making the published module standalone
// (no dependency on types module bundle).
//
// Usage:
//   node publish.js                    # Use most recent environment
//   node publish.js env-1234567890     # Use specific environment

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log('=== Publish - Copy Work Module to Implementation ===')
console.log('')

// Find environment to publish from
let envName
let envPath

if (process.argv[2]) {
  envName = process.argv[2]
  envPath = path.join(__dirname, 'environments', envName)
} else {
  const envsDir = path.join(__dirname, 'environments')
  if (!fs.existsSync(envsDir)) {
    console.error('Error: No environments/ folder found')
    console.error('Run: node deploy.js')
    process.exit(1)
  }

  const envDirs = fs.readdirSync(envsDir)
    .filter(name => fs.statSync(path.join(envsDir, name)).isDirectory())
    .filter(name => name.startsWith('env-'))
    .sort()
    .reverse()

  if (envDirs.length === 0) {
    console.error('Error: No environments found')
    console.error('Run: node deploy.js')
    process.exit(1)
  }

  envName = envDirs[0]
  envPath = path.join(envsDir, envName)
}

if (!fs.existsSync(envPath)) {
  console.error(`Error: Environment not found: ${envPath}`)
  process.exit(1)
}

console.log(`Source: ${envName}`)
console.log(`Path: ${envPath}`)
console.log('')

// Check work_module and types exist in environment
const workModuleSrc = path.join(envPath, 'modules/work_module')
const typesDir = path.join(envPath, 'modules/types')

if (!fs.existsSync(workModuleSrc)) {
  console.error('Error: modules/work_module/ not found in environment')
  process.exit(1)
}

if (!fs.existsSync(typesDir)) {
  console.error('Error: modules/types/ not found in environment')
  process.exit(1)
}

// Extract timestamp from environment name
const timestamp = envName.replace('env-', '')

// Create target path with timestamp suffix
const implDir = path.join(__dirname, 'implementation')
const targetPath = path.join(implDir, `work_module-${timestamp}`)

if (fs.existsSync(targetPath)) {
  console.log(`Warning: ${targetPath} already exists, removing...`)
  fs.rmSync(targetPath, { recursive: true })
}

// Copy work_module to implementation with timestamp
fs.cpSync(workModuleSrc, targetPath, { recursive: true })
console.log(`✓ Copied work_module to implementation/work_module-${timestamp}`)

// ============================================================
// FLATTEN TYPE HIERARCHY
// ============================================================

console.log('')
console.log('=== Flattening Type Hierarchy ===')
console.log('')

/**
 * Load type definition from types directory
 */
function loadTypeDefinition(typeName) {
  const typeReadmePath = path.join(typesDir, typeName, 'README.json')
  if (!fs.existsSync(typeReadmePath)) {
    return null
  }
  return JSON.parse(fs.readFileSync(typeReadmePath, 'utf8'))
}

/**
 * Build inheritance chain for a type (e.g., method -> module_node)
 */
function buildTypeChain(typeName) {
  const chain = []
  let currentType = typeName

  while (currentType) {
    const typeDef = loadTypeDefinition(currentType)
    if (!typeDef) {
      console.log(`  Warning: Type definition not found: ${currentType}`)
      break
    }
    chain.push({ name: currentType, definition: typeDef })
    currentType = typeDef.extends || null
  }

  return chain
}

/**
 * Get all default files from a type definition
 * Returns array of relative file paths
 */
function getTypeFiles(typeDef) {
  const files = []
  if (typeDef.files) {
    for (const filePath of Object.keys(typeDef.files)) {
      files.push(filePath)
    }
  }
  return files
}

/**
 * Copy file from type to node if it doesn't exist
 */
function copyTypeFileIfMissing(typeName, filePath, nodePath) {
  const srcPath = path.join(typesDir, typeName, filePath)
  const destPath = path.join(nodePath, filePath)

  // Skip if destination already exists
  if (fs.existsSync(destPath)) {
    return false
  }

  // Skip if source doesn't exist (declared but not provided)
  if (!fs.existsSync(srcPath)) {
    return false
  }

  // Ensure destination directory exists
  const destDir = path.dirname(destPath)
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true })
  }

  // Copy file or directory
  const stat = fs.statSync(srcPath)
  if (stat.isDirectory()) {
    fs.cpSync(srcPath, destPath, { recursive: true })
  } else {
    fs.copyFileSync(srcPath, destPath)
  }

  return true
}

/**
 * Find all module nodes in work_module (directories with README.json)
 */
function findAllNodes(dir, relativePath = '') {
  const nodes = []
  const readmePath = path.join(dir, 'README.json')

  if (fs.existsSync(readmePath)) {
    nodes.push({ path: dir, relativePath: relativePath || '(root)' })
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    if (entry.isDirectory() && !entry.name.startsWith('_')) {
      const subPath = path.join(dir, entry.name)
      const subRelative = relativePath ? `${relativePath}/${entry.name}` : entry.name
      nodes.push(...findAllNodes(subPath, subRelative))
    }
  }

  return nodes
}

// Find all nodes in the published work_module
const nodes = findAllNodes(targetPath)
console.log(`Found ${nodes.length} module node(s)`)
console.log('')

let totalFilesCopied = 0

// Process each node
for (const node of nodes) {
  const readmePath = path.join(node.path, 'README.json')
  const readme = JSON.parse(fs.readFileSync(readmePath, 'utf8'))
  const nodeType = readme.type

  if (!nodeType) {
    console.log(`  ${node.relativePath}: No type declared, skipping`)
    continue
  }

  // Build type inheritance chain
  const typeChain = buildTypeChain(nodeType)

  if (typeChain.length === 0) {
    console.log(`  ${node.relativePath}: Type '${nodeType}' not found, skipping`)
    continue
  }

  // Collect all files from entire type chain (most specific to base)
  let filesCopied = 0
  for (const typeInfo of typeChain) {
    const typeFiles = getTypeFiles(typeInfo.definition)
    for (const filePath of typeFiles) {
      if (copyTypeFileIfMissing(typeInfo.name, filePath, node.path)) {
        filesCopied++
      }
    }
  }

  const chainNames = typeChain.map(t => t.name).join(' → ')
  if (filesCopied > 0) {
    console.log(`  ${node.relativePath} [${nodeType}]: +${filesCopied} file(s) from ${chainNames}`)
    totalFilesCopied += filesCopied
  } else {
    console.log(`  ${node.relativePath} [${nodeType}]: complete (${chainNames})`)
  }
}

console.log('')
console.log(`✓ Flattened ${totalFilesCopied} file(s) from type definitions`)

// ============================================================
// CREATE MANIFEST
// ============================================================

const manifest = {
  publishedFrom: envName,
  publishedAt: new Date().toISOString(),
  sourcePath: workModuleSrc,
  targetPath: targetPath,
  typesFlattenedFrom: typesDir,
  nodesProcessed: nodes.length,
  filesFlattened: totalFilesCopied
}

fs.writeFileSync(
  path.join(targetPath, 'PUBLISH_MANIFEST.json'),
  JSON.stringify(manifest, null, 2)
)
console.log('✓ Created PUBLISH_MANIFEST.json')

console.log('')
console.log('=== Publish Complete ===')
console.log('')
console.log(`Published: implementation/work_module-${timestamp}/`)
console.log('')
console.log('The published module is standalone (no types dependency).')
console.log('')
console.log('Next steps:')
console.log('  1. Review published work_module')
console.log('  2. If satisfied, promote to work_module (remove timestamp)')
console.log('  3. Destroy environment if no longer needed')
