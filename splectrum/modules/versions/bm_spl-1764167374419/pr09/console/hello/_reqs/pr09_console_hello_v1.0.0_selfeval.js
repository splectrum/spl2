// pr09/console/hello self-eval
// Validates method implementation against requirements

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const METHOD_DIR = path.join(__dirname, '..')

/**
 * Run all self-eval checks
 */
async function selfEval() {
  const results = []

  // 1. Structure: index.js exists
  results.push(checkIndexExists())

  // 2. Structure: exports handle function
  results.push(await checkHandleExport())

  // 3. Input access: reads from correct namespace
  results.push(await checkInputAccess())

  // 4. Completion: calls spl.complete()
  results.push(await checkCompletion())

  // 5. No cross-API access
  results.push(checkNoCrossApiAccess())

  // Report
  console.log('\n=== pr09/console/hello Self-Eval ===\n')

  let passed = 0
  let failed = 0

  for (const result of results) {
    const status = result.pass ? '✓' : '✗'
    console.log(`${status} ${result.name}`)
    if (!result.pass) {
      console.log(`  ${result.reason}`)
      failed++
    } else {
      passed++
    }
  }

  console.log(`\nResults: ${passed} passed, ${failed} failed`)

  return failed === 0
}

/**
 * Check index.js exists
 */
function checkIndexExists() {
  const indexPath = path.join(METHOD_DIR, 'index.js')
  const exists = fs.existsSync(indexPath)

  return {
    name: 'index.js exists',
    pass: exists,
    reason: exists ? null : 'index.js not found'
  }
}

/**
 * Check handle function is exported
 */
async function checkHandleExport() {
  try {
    const indexPath = path.join(METHOD_DIR, 'index.js')
    const module = await import(indexPath)
    const hasHandle = typeof module.handle === 'function'

    return {
      name: 'exports handle function',
      pass: hasHandle,
      reason: hasHandle ? null : 'handle function not exported'
    }
  } catch (err) {
    return {
      name: 'exports handle function',
      pass: false,
      reason: `import failed: ${err.message}`
    }
  }
}

/**
 * Check input access from correct namespace
 */
async function checkInputAccess() {
  const indexPath = path.join(METHOD_DIR, 'index.js')
  const source = fs.readFileSync(indexPath, 'utf8')

  // Should access headers.pr09.console.hello or spl.headers.pr09.console.hello
  const correctAccess = source.includes('pr09.console.hello')

  return {
    name: 'reads from correct namespace',
    pass: correctAccess,
    reason: correctAccess ? null : 'should access headers.pr09.console.hello'
  }
}

/**
 * Check completion is called
 */
async function checkCompletion() {
  const indexPath = path.join(METHOD_DIR, 'index.js')
  const source = fs.readFileSync(indexPath, 'utf8')

  // Should call spl.complete() or similar
  const callsComplete = source.includes('.complete()')

  return {
    name: 'calls complete()',
    pass: callsComplete,
    reason: callsComplete ? null : 'should call spl.complete()'
  }
}

/**
 * Check no cross-API access
 */
function checkNoCrossApiAccess() {
  const indexPath = path.join(METHOD_DIR, 'index.js')
  const source = fs.readFileSync(indexPath, 'utf8')

  // Should not access other API namespaces
  // This is a simple check - looks for other pr09.* patterns that aren't pr09.console.hello
  const otherApiPattern = /headers\.pr09\.(?!console\.hello)/
  const hasCrossAccess = otherApiPattern.test(source)

  return {
    name: 'no cross-API access',
    pass: !hasCrossAccess,
    reason: hasCrossAccess ? 'accessing other API namespaces' : null
  }
}

// Run if executed directly
selfEval().then(success => {
  process.exit(success ? 0 : 1)
})

export { selfEval }
