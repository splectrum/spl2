// spl/dev/prepare - Build hierarchy.json for overlay resolution

import fs from 'fs'
import path from 'path'
import { createSpl } from 'lib/core.js'

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
function buildTypeRegistry(typesDir) {
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
 * Get module path chain for a node (walks up to work module root)
 * Returns array of paths from specific to general
 */
function getModulePathChain(nodePath, workModuleDir) {
  const chain = []
  let current = nodePath

  // Walk up until we hit work module or above
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
 */
function buildLayerSequence(node, workModuleDir, typeRegistry) {
  const layers = []

  // 1. Module path chain (work_module layers)
  const moduleChain = getModulePathChain(node.path, workModuleDir)
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

export function handle(record) {
  const spl = createSpl(record)
  const input = spl.headers.spl.dev.prepare || {}
  const runtime = spl.headers.spl.runtime

  // Resolve paths relative to runtime.cwd (bundle root)
  const bundleRoot = runtime.cwd
  const envsDir = path.join(bundleRoot, 'environments')

  // Find environment
  let envName
  let envPath

  if (input.name) {
    envName = input.name
    envPath = path.join(envsDir, envName)
  } else {
    // Find most recent env-*
    if (!fs.existsSync(envsDir)) {
      spl.error('No environments/ folder found')
      return
    }

    const envDirs = fs.readdirSync(envsDir)
      .filter(name => fs.statSync(path.join(envsDir, name)).isDirectory())
      .filter(name => name.startsWith('env-'))
      .sort()
      .reverse()

    if (envDirs.length === 0) {
      spl.error('No environments found')
      return
    }

    envName = envDirs[0]
    envPath = path.join(envsDir, envName)
  }

  if (!fs.existsSync(envPath)) {
    spl.error(`Environment not found: ${envName}`)
    return
  }

  const modulesDir = path.join(envPath, 'modules')
  const typesDir = path.join(modulesDir, 'types')

  // Find work module (wm_* pattern) - DYNAMIC DISCOVERY
  const moduleEntries = fs.readdirSync(modulesDir)
  const workModuleName = moduleEntries.find(e =>
    e.startsWith('wm_') && fs.statSync(path.join(modulesDir, e)).isDirectory()
  )

  if (!workModuleName) {
    spl.error('No work module (wm_*) found in modules/')
    return
  }

  const workModuleDir = path.join(modulesDir, workModuleName)

  // Build type registry
  const typeRegistry = buildTypeRegistry(typesDir)
  const typeCount = Object.keys(typeRegistry).length

  // Find all nodes in work_module
  const nodes = findAllNodes(workModuleDir)

  // Build hierarchy map
  const hierarchy = {}

  for (const node of nodes) {
    const layers = buildLayerSequence(node, workModuleDir, typeRegistry)

    hierarchy[node.relativePath] = {
      type: node.type,
      absolutePath: node.path,
      layers: layers
    }
  }

  // Write hierarchy.json
  const hierarchyPath = path.join(envPath, 'hierarchy.json')
  fs.writeFileSync(hierarchyPath, JSON.stringify(hierarchy, null, 2))

  // Set output
  spl.headers.spl.dev.prepare.output = {
    environment: envName,
    hierarchyPath: hierarchyPath,
    nodeCount: nodes.length,
    typeCount: typeCount
  }

  spl.complete()
}
