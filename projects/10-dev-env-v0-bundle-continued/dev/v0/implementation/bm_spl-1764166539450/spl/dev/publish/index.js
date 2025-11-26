// spl/dev/publish - Publish work module and merged base module with timestamps
//
// Creates two timestamped artifacts:
// 1. wm_*-{timestamp} - Standalone snapshot of work module (types flattened)
// 2. bm_*-{timestamp} - Work module merged into base module (types flattened)
//
// Active versions (wm_*, bm_*) remain untouched for manual promotion.

import fs from 'fs'
import path from 'path'
import { createSpl } from 'lib/core.js'

/**
 * Load type definition from types directory
 */
function loadTypeDefinition(typesDir, typeName) {
  const typeReadmePath = path.join(typesDir, typeName, 'README.json')
  if (!fs.existsSync(typeReadmePath)) {
    return null
  }
  return JSON.parse(fs.readFileSync(typeReadmePath, 'utf8'))
}

/**
 * Build inheritance chain for a type (e.g., method -> module_node)
 */
function buildTypeChain(typesDir, typeName) {
  const chain = []
  let currentType = typeName

  while (currentType) {
    const typeDef = loadTypeDefinition(typesDir, currentType)
    if (!typeDef) break
    chain.push({ name: currentType, definition: typeDef })
    currentType = typeDef.extends || null
  }

  return chain
}

/**
 * Get all default files from a type definition
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
function copyTypeFileIfMissing(typesDir, typeName, filePath, nodePath) {
  const srcPath = path.join(typesDir, typeName, filePath)
  const destPath = path.join(nodePath, filePath)

  if (fs.existsSync(destPath)) return false
  if (!fs.existsSync(srcPath)) return false

  const destDir = path.dirname(destPath)
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true })
  }

  const stat = fs.statSync(srcPath)
  if (stat.isDirectory()) {
    fs.cpSync(srcPath, destPath, { recursive: true })
  } else {
    fs.copyFileSync(srcPath, destPath)
  }

  return true
}

/**
 * Find all module nodes in a directory (directories with README.json)
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

/**
 * Flatten type hierarchy into a module (make standalone)
 */
function flattenTypes(moduleDir, typesDir) {
  const nodes = findAllNodes(moduleDir)
  let totalFlattened = 0

  for (const node of nodes) {
    const readmePath = path.join(node.path, 'README.json')
    const readme = JSON.parse(fs.readFileSync(readmePath, 'utf8'))
    const nodeType = readme.type

    if (!nodeType) continue

    const typeChain = buildTypeChain(typesDir, nodeType)
    for (const typeInfo of typeChain) {
      const typeFiles = getTypeFiles(typeInfo.definition)
      for (const filePath of typeFiles) {
        if (copyTypeFileIfMissing(typesDir, typeInfo.name, filePath, node.path)) {
          totalFlattened++
        }
      }
    }
  }

  return { nodes: nodes.length, filesFlattened: totalFlattened }
}

/**
 * Deep merge directory src into dest (src files override dest)
 */
function mergeDirectories(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true })
  }

  const entries = fs.readdirSync(src, { withFileTypes: true })
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)

    if (entry.isDirectory()) {
      mergeDirectories(srcPath, destPath)
    } else {
      // Ensure dest directory exists
      const destDir = path.dirname(destPath)
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true })
      }
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

export function handle(record) {
  const spl = createSpl(record)
  const input = spl.headers.spl.dev.publish || {}
  const runtime = spl.headers.spl.runtime

  const bundleRoot = runtime.cwd
  const implDir = path.join(bundleRoot, 'implementation')
  const envsDir = path.join(bundleRoot, 'environments')

  // Find environment to publish from
  let envName, envPath

  if (input.name) {
    envName = input.name
    envPath = path.join(envsDir, envName)
  } else {
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

  // Find work module in environment
  const moduleEntries = fs.readdirSync(modulesDir)
  const wmName = moduleEntries.find(e =>
    e.startsWith('wm_') && fs.statSync(path.join(modulesDir, e)).isDirectory()
  )

  if (!wmName) {
    spl.error('No work module (wm_*) found in environment')
    return
  }

  const wmSrc = path.join(modulesDir, wmName)
  const timestamp = input.timestamp || Date.now().toString()

  // Derive base module name from work module name (wm_spl_dev -> bm_spl)
  // Convention: wm_X_Y -> bm_X (drop the last segment which is the work context)
  const wmParts = wmName.split('_')
  const bmName = wmParts.length > 2
    ? 'bm_' + wmParts.slice(1, -1).join('_')  // wm_spl_dev -> bm_spl
    : 'bm_' + wmParts.slice(1).join('_')       // wm_spl -> bm_spl

  // === 1. Create timestamped work module snapshot ===
  const wmTimestamped = `${wmName}-${timestamp}`
  const wmTargetPath = path.join(implDir, wmTimestamped)

  if (fs.existsSync(wmTargetPath)) {
    fs.rmSync(wmTargetPath, { recursive: true })
  }

  fs.cpSync(wmSrc, wmTargetPath, { recursive: true })
  const wmFlattenResult = flattenTypes(wmTargetPath, typesDir)

  // Add manifest to work module
  fs.writeFileSync(
    path.join(wmTargetPath, 'PUBLISH_MANIFEST.json'),
    JSON.stringify({
      type: 'work_module_snapshot',
      source: wmName,
      environment: envName,
      timestamp: timestamp,
      publishedAt: new Date().toISOString(),
      nodesProcessed: wmFlattenResult.nodes,
      filesFlattened: wmFlattenResult.filesFlattened
    }, null, 2)
  )

  // === 2. Create timestamped base module (merged) ===
  const bmTimestamped = `${bmName}-${timestamp}`
  const bmTargetPath = path.join(implDir, bmTimestamped)

  if (fs.existsSync(bmTargetPath)) {
    fs.rmSync(bmTargetPath, { recursive: true })
  }

  // Start with existing base module if it exists, otherwise empty
  const bmActivePath = path.join(implDir, bmName)
  if (fs.existsSync(bmActivePath)) {
    fs.cpSync(bmActivePath, bmTargetPath, { recursive: true })
  } else {
    fs.mkdirSync(bmTargetPath, { recursive: true })
  }

  // Merge work module into base module (wm files override bm files)
  mergeDirectories(wmSrc, bmTargetPath)

  // Flatten types in merged base module
  const bmFlattenResult = flattenTypes(bmTargetPath, typesDir)

  // Add manifest to base module
  fs.writeFileSync(
    path.join(bmTargetPath, 'PUBLISH_MANIFEST.json'),
    JSON.stringify({
      type: 'base_module_release',
      source: bmName,
      mergedFrom: wmName,
      environment: envName,
      timestamp: timestamp,
      publishedAt: new Date().toISOString(),
      nodesProcessed: bmFlattenResult.nodes,
      filesFlattened: bmFlattenResult.filesFlattened
    }, null, 2)
  )

  // Set output
  spl.headers.spl.dev.publish.output = {
    environment: envName,
    timestamp: timestamp,
    workModule: {
      name: wmTimestamped,
      path: wmTargetPath,
      nodes: wmFlattenResult.nodes,
      filesFlattened: wmFlattenResult.filesFlattened
    },
    baseModule: {
      name: bmTimestamped,
      path: bmTargetPath,
      nodes: bmFlattenResult.nodes,
      filesFlattened: bmFlattenResult.filesFlattened,
      mergedFrom: fs.existsSync(bmActivePath) ? bmName : '(new)'
    }
  }

  spl.complete()
}
