// module_node self-eval
// Validates: all child folders are allowed underscore folders or instances of a type

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Build type registry from types/ folder
 * Returns map of type name -> { allowedFolders: string[] }
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
    const readmePath = path.join(typesDir, typeName, 'README.json')
    if (!fs.existsSync(readmePath)) continue

    const readme = JSON.parse(fs.readFileSync(readmePath, 'utf8'))

    // Get folders defined in structure.default (underscore folders)
    const folders = []
    if (readme.structure?.default) {
      for (const key of Object.keys(readme.structure.default)) {
        // Strip trailing slash if present
        const folderName = key.replace(/\/$/, '')
        if (folderName.startsWith('_')) {
          folders.push(folderName)
        }
      }
    }

    registry[typeName] = {
      extends: readme.extends || null,
      allowedFolders: folders
    }
  }

  return registry
}

/**
 * Get all allowed underscore folders for a type (including inherited)
 */
function getAllowedFolders(typeName, registry) {
  const allowed = new Set()
  let current = typeName

  while (current && registry[current]) {
    for (const folder of registry[current].allowedFolders) {
      allowed.add(folder)
    }
    current = registry[current].extends
  }

  return allowed
}

/**
 * Run self-eval on a specific node
 * @param {string} nodeDir - Path to the node being tested
 * @param {string} typesDir - Path to types/ folder
 */
export async function selfEval(nodeDir, typesDir) {
  const results = []

  // Read node's README.json to get its type
  const nodeReadmePath = path.join(nodeDir, 'README.json')
  if (!fs.existsSync(nodeReadmePath)) {
    results.push({
      name: 'README.json exists',
      pass: false,
      reason: 'Node has no README.json'
    })
    return { results, passed: false }
  }

  const nodeReadme = JSON.parse(fs.readFileSync(nodeReadmePath, 'utf8'))
  const nodeType = nodeReadme.type

  if (!nodeType) {
    results.push({
      name: 'type declared',
      pass: false,
      reason: 'README.json has no type field'
    })
    return { results, passed: false }
  }

  // Build type registry
  const registry = buildTypeRegistry(typesDir)

  if (!registry[nodeType]) {
    results.push({
      name: 'valid type',
      pass: false,
      reason: `Unknown type: ${nodeType}`
    })
    return { results, passed: false }
  }

  // Get allowed underscore folders for this type
  const allowedFolders = getAllowedFolders(nodeType, registry)

  // Check all child folders
  const children = fs.readdirSync(nodeDir).filter(f => {
    return fs.statSync(path.join(nodeDir, f)).isDirectory()
  })

  for (const child of children) {
    if (child.startsWith('_')) {
      // Underscore folder - must be in allowed list
      const isAllowed = allowedFolders.has(child)
      results.push({
        name: `${child} is allowed underscore folder`,
        pass: isAllowed,
        reason: isAllowed ? null : `${child} not defined in type ${nodeType} or its ancestors`
      })
    } else {
      // Non-underscore folder - must be a type instance
      const childReadmePath = path.join(nodeDir, child, 'README.json')
      const hasReadme = fs.existsSync(childReadmePath)

      if (!hasReadme) {
        results.push({
          name: `${child}/ is type instance`,
          pass: false,
          reason: `${child}/ has no README.json - not a type instance`
        })
        continue
      }

      const childReadme = JSON.parse(fs.readFileSync(childReadmePath, 'utf8'))
      const childType = childReadme.type

      if (!childType) {
        results.push({
          name: `${child}/ is type instance`,
          pass: false,
          reason: `${child}/README.json has no type field`
        })
        continue
      }

      const validType = !!registry[childType]
      results.push({
        name: `${child}/ is type instance (${childType})`,
        pass: validType,
        reason: validType ? null : `${child}/ declares unknown type: ${childType}`
      })
    }
  }

  // If no children, add a pass result
  if (children.length === 0) {
    results.push({
      name: 'folder structure (no children)',
      pass: true,
      reason: null
    })
  }

  const passed = results.every(r => r.pass)
  return { results, passed }
}

// Run if executed directly (for testing the type itself)
if (process.argv[1] === __filename) {
  const nodeDir = process.argv[2] || path.join(__dirname, '..')
  const typesDir = process.argv[3] || path.join(__dirname, '..', '..')

  console.log(`\n=== module_node Self-Eval ===`)
  console.log(`Node: ${nodeDir}`)
  console.log(`Types: ${typesDir}\n`)

  const { results, passed } = await selfEval(nodeDir, typesDir)

  let passCount = 0
  let failCount = 0

  for (const result of results) {
    const status = result.pass ? '✓' : '✗'
    console.log(`${status} ${result.name}`)
    if (!result.pass) {
      console.log(`  ${result.reason}`)
      failCount++
    } else {
      passCount++
    }
  }

  console.log(`\nResults: ${passCount} passed, ${failCount} failed`)
  process.exit(passed ? 0 : 1)
}
