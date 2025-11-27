// spl.mjs - Splectrum CLI implementation
//
// Global entry point with node resolution. Finds nearest splectrum/ folder
// traversing up from current working directory.
//
// Invocation modes:
//   1. Single command:  spl spl/dev/cycle --name=env-123
//   2. Inline script:   spl "await spl.dev.cycle({ name: 'env-123' })"
//   3. File script:     spl ./workflow.js --env=prod

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ============================================================================
// Node Resolution
// ============================================================================

/**
 * Find nearest splectrum/ folder traversing up from startDir
 * @param {string} startDir - Directory to start searching from
 * @returns {{ nodeRoot: string, splectrumDir: string }} - Resolved node paths
 */
function resolveNode(startDir) {
  let dir = startDir

  while (dir !== path.dirname(dir)) {  // not at filesystem root
    const splectrumPath = path.join(dir, 'splectrum')

    if (fs.existsSync(splectrumPath) && fs.statSync(splectrumPath).isDirectory()) {
      // Check for package.json with name "splectrum" (defines a valid node)
      const packageJsonPath = path.join(splectrumPath, 'package.json')
      if (fs.existsSync(packageJsonPath)) {
        try {
          const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
          if (pkg.name === 'splectrum') {
            return {
              nodeRoot: dir,
              splectrumDir: splectrumPath
            }
          }
        } catch (e) {
          // Invalid JSON, skip
        }
      }
    }

    dir = path.dirname(dir)
  }

  return null
}

// ============================================================================
// Mode Detection
// ============================================================================

/**
 * Detect invocation mode from first argument
 * @param {string} firstArg - First command line argument
 * @param {string} invokedFrom - Directory command was invoked from
 * @returns {'command' | 'script' | 'file'} - Detected mode
 */
function detectMode(firstArg, invokedFrom) {
  if (!firstArg) {
    return 'command'  // Will show usage
  }

  // Check if it's a file path (absolute or relative)
  const possiblePath = path.isAbsolute(firstArg)
    ? firstArg
    : path.join(invokedFrom, firstArg)

  if (fs.existsSync(possiblePath) && fs.statSync(possiblePath).isFile()) {
    return 'file'
  }

  // Check if it looks like a method path (contains / but not a relative path)
  if (firstArg.includes('/') && !firstArg.startsWith('./') && !firstArg.startsWith('../')) {
    return 'command'
  }

  // Default to inline script
  return 'script'
}

/**
 * Parse --key=value arguments into object
 * @param {string[]} args - Command line arguments
 * @param {number} startIndex - Index to start parsing from
 * @returns {Object} - Parsed key-value pairs
 */
function parseArgs(args, startIndex = 1) {
  const input = {}

  for (let i = startIndex; i < args.length; i++) {
    const arg = args[i]
    if (arg.startsWith('--')) {
      const [key, ...valueParts] = arg.slice(2).split('=')
      input[key] = valueParts.length > 0 ? valueParts.join('=') : true
    }
  }

  return input
}

// ============================================================================
// Main
// ============================================================================

const invokedFrom = process.cwd()
const args = process.argv.slice(2)

// Show usage if no args
if (args.length === 0) {
  console.error('Usage:')
  console.error('  spl package/api/method [--arg=value ...]   # Single command')
  console.error('  spl "./script.js" [--arg=value ...]        # File script')
  console.error('  spl "await spl.dev.cycle()"                # Inline script')
  console.error('')
  console.error('Examples:')
  console.error('  spl spl/dev/cycle --name=env-123')
  console.error('  spl spl/dev/deploy')
  console.error('  spl ./workflow.js --env=prod')
  process.exit(1)
}

// Resolve target node (find nearest splectrum/)
const targetNode = resolveNode(invokedFrom)

if (!targetNode) {
  console.error('Error: No splectrum/ node found in directory tree')
  console.error(`Searched from: ${invokedFrom}`)
  process.exit(1)
}

// Detect invocation mode
const mode = detectMode(args[0], invokedFrom)

// Build runtime context (WYSIWI - capture everything upfront)
const runtime = {
  nodeRoot: targetNode.nodeRoot,
  splectrumDir: targetNode.splectrumDir,
  invokedFrom: invokedFrom,
  mode: mode,
  globalSplectrumDir: __dirname  // Where global spl lives (for reference)
}

// Dispatch based on mode
if (mode === 'command') {
  await executeCommand(args, runtime)
} else if (mode === 'file') {
  await executeFile(args, runtime)
} else {
  await executeScript(args, runtime)
}

// ============================================================================
// Execution Handlers
// ============================================================================

async function executeCommand(args, runtime) {
  const methodPath = args[0]
  const input = parseArgs(args, 1)

  console.log(`Node: ${runtime.nodeRoot}`)
  console.log(`Running: ${methodPath}`)
  if (Object.keys(input).length > 0) {
    console.log(`Input: ${JSON.stringify(input)}`)
  }
  console.log('')

  // Import run.js from target node
  const runPath = path.join(runtime.splectrumDir, 'run.js')

  if (!fs.existsSync(runPath)) {
    console.error(`Error: Target node missing run.js: ${runPath}`)
    process.exit(1)
  }

  // Change to target splectrum directory for lib resolution
  process.chdir(runtime.splectrumDir)

  const { run } = await import(runPath)

  try {
    const result = await run(methodPath, input, runtime)

    if (result.error) {
      console.error(`Error: ${result.error}`)
      process.exit(1)
    }

    console.log('Result:')
    console.log(JSON.stringify(result.output, null, 2))
  } catch (err) {
    console.error(`Error: ${err.message}`)
    process.exit(1)
  }
}

async function executeFile(args, runtime) {
  const filePath = path.isAbsolute(args[0])
    ? args[0]
    : path.join(runtime.invokedFrom, args[0])
  const scriptArgs = parseArgs(args, 1)

  console.log(`Node: ${runtime.nodeRoot}`)
  console.log(`Running file: ${filePath}`)
  if (Object.keys(scriptArgs).length > 0) {
    console.log(`Args: ${JSON.stringify(scriptArgs)}`)
  }
  console.log('')

  // Read script content
  const scriptContent = fs.readFileSync(filePath, 'utf-8')

  // Execute with context
  await executeWithContext(scriptContent, scriptArgs, runtime)
}

async function executeScript(args, runtime) {
  const scriptContent = args[0]

  console.log(`Node: ${runtime.nodeRoot}`)
  console.log(`Running inline script`)
  console.log('')

  // Execute with context
  await executeWithContext(scriptContent, {}, runtime)
}

async function executeWithContext(scriptContent, scriptArgs, runtime) {
  // Change to target splectrum directory for lib resolution
  process.chdir(runtime.splectrumDir)

  // Import run.js from target node for programmatic API
  const runPath = path.join(runtime.splectrumDir, 'run.js')
  const { run } = await import(runPath)

  // Create programmatic API (spl.dev.cycle() style)
  const spl = createSplApi(run, runtime)

  // Create execution context
  const context = {
    spl,
    args: scriptArgs,
    runtime,
    // Common imports available to scripts
    fs,
    path,
    console
  }

  // Wrap in async function and execute
  const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor

  try {
    const fn = new AsyncFunction(
      ...Object.keys(context),
      scriptContent
    )

    const result = await fn(...Object.values(context))

    if (result !== undefined) {
      console.log('Result:')
      console.log(JSON.stringify(result, null, 2))
    }
  } catch (err) {
    console.error(`Error: ${err.message}`)
    process.exit(1)
  }
}

/**
 * Create programmatic API for scripts
 * Allows: spl.dev.cycle({ name: 'env-123' }) → spl/dev/cycle
 * Three levels: package.api.method
 */
function createSplApi(run, runtime) {
  return new Proxy({}, {
    get(target, pkg) {
      // Package level (e.g., spl)
      return new Proxy({}, {
        get(target, api) {
          // API level (e.g., dev)
          return new Proxy({}, {
            get(target, method) {
              // Method level (e.g., cycle)
              return async function(input = {}) {
                const methodPath = `${pkg}/${api}/${method}`
                return await run(methodPath, input, runtime)
              }
            }
          })
        }
      })
    }
  })
}
