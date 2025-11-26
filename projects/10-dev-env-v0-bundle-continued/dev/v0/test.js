#!/usr/bin/env node
// test.js - Run selfevals for all nodes using hierarchy overlay
//
// Collects selfevals from all layers (node, ancestors, types) using overlay resolution.
// Same-named selfevals follow overlay logic (lower layer wins).
// Stops on first failure.
//
// Usage:
//   node test.js                       # Test most recent environment
//   node test.js env-1234567890        # Test specific environment

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log('=== Test - Run Self-Evaluations ===')
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

// Check hierarchy.json exists
const hierarchyPath = path.join(envPath, 'hierarchy.json')
if (!fs.existsSync(hierarchyPath)) {
  console.error('Error: hierarchy.json not found')
  console.error('Run: node prepare.js')
  process.exit(1)
}

console.log(`Environment: ${envName}`)
console.log('')

// Load hierarchy
const hierarchy = JSON.parse(fs.readFileSync(hierarchyPath, 'utf8'))
const modulesDir = path.join(envPath, 'modules')

/**
 * Collect all selfevals for a node using overlay logic
 * Returns selfevals from all layers, with same-name overlay (first wins)
 */
function collectSelfevals(node) {
  const collected = new Map() // filename -> {name, path, layer}

  for (const layer of node.layers) {
    const reqsPath = path.join(layer.path, '_reqs')
    if (!fs.existsSync(reqsPath)) continue

    const files = fs.readdirSync(reqsPath).filter(f => {
      return f.includes('_selfeval') && f.endsWith('.js')
    })

    for (const file of files) {
      // Only add if not already collected (first/higher layer wins)
      if (!collected.has(file)) {
        collected.set(file, {
          name: file,
          path: path.join(reqsPath, file),
          layer: layer.layer,
          layerType: layer.type || null
        })
      }
    }
  }

  return Array.from(collected.values())
}

/**
 * Execute a selfeval script
 * Passes node path and types path as arguments for structural checks
 */
function executeSelfeval(selfeval, nodePath, typesDir) {
  try {
    // Run selfeval with node path and types path as arguments
    const output = execSync(`node "${selfeval.path}" "${nodePath}" "${typesDir}"`, {
      cwd: path.dirname(selfeval.path),
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe']
    })
    return { passed: true, output }
  } catch (error) {
    return {
      passed: false,
      output: error.stdout || error.stderr || error.message
    }
  }
}

// Get all nodes
const nodePaths = Object.keys(hierarchy)
console.log(`Found ${nodePaths.length} node(s)`)
console.log('')

let totalPassed = 0
let totalFailed = 0
let totalSkipped = 0

const typesDir = path.join(modulesDir, 'types')

// Run selfevals for each node
for (const nodePath of nodePaths) {
  const node = hierarchy[nodePath]

  console.log('─'.repeat(60))
  console.log(`Node: ${nodePath} (${node.type || 'no type'})`)
  console.log('─'.repeat(60))

  const selfevals = collectSelfevals(node)

  if (selfevals.length === 0) {
    console.log('  (no selfevals)')
    totalSkipped++
    console.log('')
    continue
  }

  console.log(`  Found ${selfevals.length} selfeval(s):`)
  for (const se of selfevals) {
    const layerInfo = se.layer === 'type' ? `type:${se.layerType}` : 'work_module'
    console.log(`    - ${se.name} [${layerInfo}]`)
  }
  console.log('')

  for (const selfeval of selfevals) {
    const layerInfo = selfeval.layer === 'type' ? `type:${selfeval.layerType}` : 'work_module'
    console.log(`  Running: ${selfeval.name} [${layerInfo}]`)

    const result = executeSelfeval(selfeval, node.absolutePath, typesDir)

    if (result.passed) {
      console.log(`  ✓ PASS`)
      totalPassed++
    } else {
      console.log(`  ✗ FAIL`)
      if (result.output) {
        console.log('')
        console.log(result.output.split('\n').map(l => `    ${l}`).join('\n'))
      }
      totalFailed++

      // Stop on first failure
      console.log('')
      console.log('═'.repeat(60))
      console.log('✗ STOPPED ON FIRST FAILURE')
      console.log('═'.repeat(60))
      console.log('')
      console.log(`Passed: ${totalPassed}`)
      console.log(`Failed: ${totalFailed}`)
      console.log(`Skipped: ${totalSkipped}`)
      process.exit(1)
    }
  }

  console.log('')
}

// Summary
console.log('═'.repeat(60))
console.log('✓ ALL TESTS PASSED')
console.log('═'.repeat(60))
console.log('')
console.log(`Passed: ${totalPassed}`)
console.log(`Skipped (no selfevals): ${totalSkipped}`)
console.log('')
process.exit(0)
