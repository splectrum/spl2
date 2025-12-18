/*
 * scripts/selfeval-all.js - Selfeval container and all descendants
 * Usage: spl selfeval-all <container> [--failFast] [--detail]
 *
 * --detail   Show selfeval breakdown for each container
 * --failFast Stop at first failure
 */
const { execSync } = await import('child_process')
const fs = await import('fs')
const path = await import('path')

const input = module.input()
const container = input['0']
const failFast = input.failFast === true
const detail = input.detail === true

if (!container) {
  console.log('Usage: spl selfeval-all <container> [--failFast] [--detail]')
  console.log('')
  console.log('Options:')
  console.log('  --detail    Show selfeval breakdown for each container')
  console.log('  --failFast  Stop at first failure')
  module.output({ status: 'error', message: 'No container specified' })
  return
}

const rootContainer = container
const results = []
const visited = new Set()

// Get modules directory from module
const modulesDir = module.getModulesDir()
const hierarchyPath = path.join(modulesDir, 'hierarchy.json')
const hierarchy = JSON.parse(fs.readFileSync(hierarchyPath, 'utf8'))

// Get container filesystem path
function getContainerFsPath(containerPath) {
  for (const layer of hierarchy.layers) {
    const fsPath = path.join(modulesDir, layer.name, containerPath)
    const indexPath = path.join(fsPath, 'index.json')
    if (fs.existsSync(indexPath)) {
      return fsPath
    }
  }
  return null
}

// Get children from container
function getChildren(containerPath) {
  const fsPath = getContainerFsPath(containerPath)
  if (!fsPath) return []

  try {
    const identity = JSON.parse(fs.readFileSync(path.join(fsPath, 'index.json'), 'utf8'))
    return identity.instance?.children?.list || []
  } catch (e) {
    return []
  }
}

// Run selfeval on a container
function runSelfeval(containerPath) {
  try {
    const metaLevel = (detail || failFast) ? '--meta=detail' : ''
    const output = execSync(`spl ${containerPath}/selfeval ${metaLevel}`, {
      encoding: 'utf8',
      timeout: 60000,
      stdio: ['pipe', 'pipe', 'pipe']
    })
    // Check first line: "containerPath | PASS" or "containerPath | FAIL"
    const pass = !output.includes('| FAIL')
    return { pass, output }
  } catch (e) {
    return { pass: false, output: e.stdout || e.message }
  }
}

// Process container and descendants
function processContainer(containerPath, depth = 0) {
  if (visited.has(containerPath)) return true
  visited.add(containerPath)

  const result = runSelfeval(containerPath)
  const status = result.pass ? 'PASS' : 'FAIL'
  const indent = '  '.repeat(depth)

  results.push({
    container: containerPath,
    pass: result.pass
  })

  // Output container status
  console.log(`${indent}${containerPath} | ${status}`)

  // Show detail if requested
  if (detail && result.output) {
    const lines = result.output.trim().split('\n')
    for (const line of lines) {
      console.log(`${indent}  ${line}`)
    }
  }

  if (!result.pass && failFast) {
    // Show detail for the failing container
    if (!detail && result.output) {
      const lines = result.output.trim().split('\n')
      for (const line of lines) {
        console.log(`${indent}  ${line}`)
      }
    }
    return false
  }

  // Process children
  const children = getChildren(containerPath)
  for (const child of children) {
    const childPath = `${containerPath}/${child}`
    const shouldContinue = processContainer(childPath, depth + 1)
    if (!shouldContinue) {
      return false
    }
  }

  return true
}

// Run the tree
console.log(`${rootContainer} tree${failFast ? ' (failFast)' : ''}`)
console.log('---')
processContainer(rootContainer)

// Summary
const passCount = results.filter(r => r.pass).length
const failCount = results.filter(r => !r.pass).length
const allPass = failCount === 0

console.log('---')
console.log(`${allPass ? 'PASS' : 'FAIL'} | ${passCount} passed, ${failCount} failed, ${results.length} total`)

module.output({
  pass: allPass,
  summary: `${passCount}/${results.length}`,
  results
})
