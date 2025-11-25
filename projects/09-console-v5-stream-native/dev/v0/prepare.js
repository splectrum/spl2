#!/usr/bin/env node
// prepare.js - Build hierarchy.json for overlay resolution
//
// Builds a map of all nodes with their layer sequences for file resolution.
// Run after deploy, or anytime structure changes.
//
// Usage:
//   node prepare.js                    # Prepare most recent environment
//   node prepare.js env-1234567890     # Prepare specific environment

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log('=== Prepare - Build Hierarchy Map ===')
console.log('')

// Find environment
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

console.log(`Environment: ${envName}`)
console.log(`Path: ${envPath}`)
console.log('')

const modulesDir = path.join(envPath, 'modules')
const typesDir = path.join(modulesDir, 'types')
const workModuleDir = path.join(modulesDir, 'work_module')

/**
 * Read README.json from a directory
 */
function readReadme(dir) {
  const readmePath = path.join(dir, 'README.json')
  if (!fs.existsSync(readmePath)) {
    return null
  }
  return JSON.parse(fs.readFileSync(readmePath, 'utf8'))
}

/**
 * Build type registry from types/ folder
 * Returns map of type name -> { extends, path }
 */
function buildTypeRegistry() {
  const registry = {}

  if (!fs.existsSync(typesDir)) {
    return registry
  }

  const types = fs.readdirSync(typesDir).filter(f => {
    return fs.statSync(path.join(typesDir, f)).isDirectory()
  })

  for (const typeName of types) {
    const typePath = path.join(typesDir, typeName)
    const readme = readReadme(typePath)
    if (!readme) continue

    registry[typeName] = {
      extends: readme.extends || null,
      path: typePath
    }
  }

  return registry
}

/**
 * Get type chain for a type (walks extends)
 * Returns array of type names from specific to general
 */
function getTypeChain(typeName, typeRegistry) {
  const chain = []
  let current = typeName

  while (current && typeRegistry[current]) {
    chain.push(current)
    current = typeRegistry[current].extends
  }

  return chain
}

/**
 * Get module path chain for a node (walks up to work_module root)
 * Returns array of paths from specific to general
 */
function getModulePathChain(nodePath) {
  const chain = []
  let current = nodePath

  // Walk up until we hit work_module or above
  while (current.startsWith(workModuleDir)) {
    chain.push(current)
    const parent = path.dirname(current)
    if (parent === current) break // root
    current = parent
  }

  return chain
}

/**
 * Find all module nodes (directories with README.json)
 */
function findAllNodes(dir, relativePath = '') {
  const nodes = []
  const readme = readReadme(dir)

  if (readme) {
    nodes.push({
      path: dir,
      relativePath: relativePath || '(root)',
      type: readme.type || null
    })
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

/**
 * Build layer sequence for a node
 * Combines module path chain with type chain
 *
 * Layer order (highest priority first):
 * 1. Node itself and ancestors in work_module (layer n, n-1, ...)
 * 2. Type chain from types/ (layer 1)
 */
function buildLayerSequence(node, typeRegistry) {
  const layers = []

  // 1. Module path chain (work_module layers)
  const moduleChain = getModulePathChain(node.path)
  for (const modulePath of moduleChain) {
    layers.push({
      layer: 'work_module',
      path: modulePath
    })
  }

  // 2. Type chain (type layers)
  if (node.type) {
    const typeChain = getTypeChain(node.type, typeRegistry)
    for (const typeName of typeChain) {
      layers.push({
        layer: 'type',
        type: typeName,
        path: typeRegistry[typeName].path
      })
    }
  }

  return layers
}

// Build type registry
console.log('Building type registry...')
const typeRegistry = buildTypeRegistry()
const typeCount = Object.keys(typeRegistry).length
console.log(`  Found ${typeCount} type(s)`)

// Show type inheritance
for (const [name, info] of Object.entries(typeRegistry)) {
  const ext = info.extends ? ` extends ${info.extends}` : ' (base)'
  console.log(`    ${name}${ext}`)
}
console.log('')

// Find all nodes in work_module
console.log('Finding nodes in work_module...')
const nodes = findAllNodes(workModuleDir)
console.log(`  Found ${nodes.length} node(s)`)
console.log('')

// Build hierarchy map
console.log('Building hierarchy map...')
const hierarchy = {}

for (const node of nodes) {
  const layers = buildLayerSequence(node, typeRegistry)

  hierarchy[node.relativePath] = {
    type: node.type,
    absolutePath: node.path,
    layers: layers
  }
}

// Write hierarchy.json
const hierarchyPath = path.join(envPath, 'hierarchy.json')
fs.writeFileSync(hierarchyPath, JSON.stringify(hierarchy, null, 2))
console.log(`✓ Written hierarchy.json`)
console.log('')

// Summary
console.log('=== Hierarchy Map ===')
console.log('')
for (const [nodePath, info] of Object.entries(hierarchy)) {
  console.log(`${nodePath} (${info.type || 'no type'})`)
  for (let i = 0; i < info.layers.length; i++) {
    const layer = info.layers[i]
    const prefix = i === info.layers.length - 1 ? '└─' : '├─'
    if (layer.layer === 'type') {
      console.log(`  ${prefix} [type] ${layer.type}`)
    } else {
      const rel = path.relative(modulesDir, layer.path)
      console.log(`  ${prefix} [module] ${rel}`)
    }
  }
}
console.log('')
console.log(`✓ Prepare complete: ${envName}`)
