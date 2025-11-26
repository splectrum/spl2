// spl/dev/test - Run selfevals for all nodes using hierarchy overlay
//
// Collects selfevals from all layers (node, ancestors, types) using overlay resolution.
// Same-named selfevals follow overlay logic (lower layer wins).
// Stops on first failure.

import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { createSpl } from 'lib/core.js'

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

export function handle(record) {
  const spl = createSpl(record)
  const input = spl.headers.spl.dev.test || {}
  const runtime = spl.headers.spl.runtime

  const bundleRoot = runtime.cwd
  const envsDir = path.join(bundleRoot, 'environments')

  // Find environment
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

  // Check hierarchy.json exists
  const hierarchyPath = path.join(envPath, 'hierarchy.json')
  if (!fs.existsSync(hierarchyPath)) {
    spl.error('hierarchy.json not found - run spl/dev/prepare first')
    return
  }

  // Load hierarchy
  const hierarchy = JSON.parse(fs.readFileSync(hierarchyPath, 'utf8'))
  const modulesDir = path.join(envPath, 'modules')
  const typesDir = path.join(modulesDir, 'types')

  const nodePaths = Object.keys(hierarchy)
  const results = []
  let totalPassed = 0
  let totalFailed = 0
  let totalSkipped = 0

  // Run selfevals for each node
  for (const nodePath of nodePaths) {
    const node = hierarchy[nodePath]
    const selfevals = collectSelfevals(node)

    if (selfevals.length === 0) {
      totalSkipped++
      results.push({
        node: nodePath,
        type: node.type,
        status: 'skipped',
        reason: 'no selfevals'
      })
      continue
    }

    let nodeStatus = 'passed'
    const selfevalResults = []

    for (const selfeval of selfevals) {
      const result = executeSelfeval(selfeval, node.absolutePath, typesDir)

      selfevalResults.push({
        name: selfeval.name,
        layer: selfeval.layer,
        layerType: selfeval.layerType,
        passed: result.passed,
        output: result.output
      })

      if (result.passed) {
        totalPassed++
      } else {
        totalFailed++
        nodeStatus = 'failed'

        // Stop on first failure if not in continue mode
        if (!input.continueOnFailure) {
          results.push({
            node: nodePath,
            type: node.type,
            status: 'failed',
            selfevals: selfevalResults
          })

          spl.headers.spl.dev.test.output = {
            environment: envName,
            status: 'failed',
            stoppedAt: nodePath,
            summary: {
              passed: totalPassed,
              failed: totalFailed,
              skipped: totalSkipped
            },
            results: results
          }

          spl.complete()
          return
        }
      }
    }

    results.push({
      node: nodePath,
      type: node.type,
      status: nodeStatus,
      selfevals: selfevalResults
    })
  }

  // All passed
  spl.headers.spl.dev.test.output = {
    environment: envName,
    status: totalFailed === 0 ? 'passed' : 'failed',
    summary: {
      nodes: nodePaths.length,
      passed: totalPassed,
      failed: totalFailed,
      skipped: totalSkipped
    },
    results: results
  }

  spl.complete()
}
