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
 * Resolve script by name from scripts/ folder inside splectrum node
 * @param {string} scriptName - Script name (without path)
 * @param {string} splectrumDir - The splectrum/ directory (the node)
 * @returns {string|null} - Resolved script path or null
 */
function resolveScript(scriptName, splectrumDir) {
  const scriptsDir = path.join(splectrumDir, 'scripts')

  if (!fs.existsSync(scriptsDir) || !fs.statSync(scriptsDir).isDirectory()) {
    return null
  }

  // Try with and without .js extension
  const withExt = path.join(scriptsDir, scriptName + '.js')
  const withoutExt = path.join(scriptsDir, scriptName)

  if (fs.existsSync(withExt) && fs.statSync(withExt).isFile()) {
    return withExt
  }
  if (fs.existsSync(withoutExt) && fs.statSync(withoutExt).isFile()) {
    return withoutExt
  }

  return null
}

// Script preamble - inline scripts must start with this
// Using /* allows clear detection and optional descriptive comment
// e.g., spl "/* deploy script */ await spl.dev.deploy()"
const SCRIPT_PREAMBLE = '/*'

/**
 * Detect invocation mode from first argument
 *
 * Detection order:
 * 1. Explicit file path (./path, ../path, /absolute) → file mode
 * 2. Starts with script preamble (/*) → inline script mode
 * 3. Script name found in library → library mode
 * 4. Default → command mode (method path)
 *
 * @param {string} firstArg - First command line argument
 * @param {string} invokedFrom - Directory command was invoked from
 * @param {string} splectrumDir - The splectrum/ directory (the node)
 * @returns {{ mode: 'command' | 'script' | 'file' | 'library', resolvedPath?: string }}
 */
function detectMode(firstArg, invokedFrom, splectrumDir) {
  if (!firstArg) {
    return { mode: 'command' }  // Will show usage
  }

  // 1. Check if it's an explicit file path (absolute or relative with ./ or ../)
  if (firstArg.startsWith('./') || firstArg.startsWith('../') || path.isAbsolute(firstArg)) {
    const possiblePath = path.isAbsolute(firstArg)
      ? firstArg
      : path.join(invokedFrom, firstArg)

    if (fs.existsSync(possiblePath) && fs.statSync(possiblePath).isFile()) {
      return { mode: 'file', resolvedPath: possiblePath }
    }
  }

  // 2. Check if it starts with script preamble → inline script
  if (firstArg.startsWith(SCRIPT_PREAMBLE)) {
    return { mode: 'script' }
  }

  // 3. Check if it's a script name (resolve from library)
  const scriptPath = resolveScript(firstArg, splectrumDir)
  if (scriptPath) {
    return { mode: 'library', resolvedPath: scriptPath }
  }

  // 4. Default to command mode (method path)
  return { mode: 'command' }
}

/**
 * Parse arguments into key-value pairs and positional args
 * @param {string[]} args - Command line arguments
 * @param {number} startIndex - Index to start parsing from
 * @returns {Object} - Object with named args and _positional array
 */
function parseArgs(args, startIndex = 1) {
  const input = { _positional: [] }

  for (let i = startIndex; i < args.length; i++) {
    const arg = args[i]
    if (arg.startsWith('--')) {
      const [key, ...valueParts] = arg.slice(2).split('=')
      input[key] = valueParts.length > 0 ? valueParts.join('=') : true
    } else {
      input._positional.push(arg)
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
const detected = detectMode(args[0], invokedFrom, targetNode.splectrumDir)

// Build runtime context (WYSIWI - capture everything upfront)
const runtime = {
  nodeRoot: targetNode.splectrumDir,    // The splectrum/ folder is the node
  invokedFrom: invokedFrom,
  mode: detected.mode
}

// Dispatch based on mode
if (detected.mode === 'command') {
  await executeCommand(args, runtime)
} else if (detected.mode === 'file') {
  await executeFile(args, detected.resolvedPath, runtime)
} else if (detected.mode === 'library') {
  await executeLibraryScript(args, detected.resolvedPath, runtime)
} else {
  await executeScript(args, runtime)
}

// ============================================================================
// Execution Handlers
// ============================================================================

async function executeCommand(args, runtime) {
  const methodPath = args[0]
  const input = parseArgs(args, 1)

  // Determine app routing
  // Format: appId or appId:appInstanceId
  const terminalId = process.env.SPL_TERMINAL_ID || 'cli-static'
  const [appId, appInstanceId] = terminalId.includes(':')
    ? terminalId.split(':')
    : [terminalId, null]

  // Generate request ID
  const requestId = `req-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const timeReceived = Date.now()

  console.log(`Node: ${runtime.nodeRoot}`)
  console.log(`App: ${appId}${appInstanceId ? ':' + appInstanceId : ''}`)
  console.log(`Request: ${requestId}`)
  console.log(`Running: ${methodPath}`)
  if (Object.keys(input).length > 0 && Object.keys(input).some(k => k !== '_positional')) {
    console.log(`Input: ${JSON.stringify(input)}`)
  }
  console.log('')

  // Route to app
  const appPath = path.join(runtime.nodeRoot, 'apps', appId, 'index.js')

  if (!fs.existsSync(appPath)) {
    console.error(`Error: App not found: ${appId}`)
    console.error(`Looked in: ${appPath}`)
    process.exit(1)
  }

  // Change to node root for lib resolution
  process.chdir(runtime.nodeRoot)

  try {
    const app = await import(appPath)

    // Build request record (Kafka-style structure)
    //
    // Headers = public metadata (travels with record, shared with all)
    // Value = payload (request API state - local concerns)
    //
    const requestRecord = {
      headers: {
        spl: {
          request: {
            id: requestId,
            timeReceived
          },
          runtime: {
            nodeRoot: runtime.nodeRoot
          }
        }
      },
      value: {
        mode: 'command',
        appId,
        appInstanceId,
        invokedFrom: runtime.invokedFrom,
        method: methodPath,
        input
      }
    }

    // Hand off to app
    const response = await app.handleRequest(requestRecord)

    // Stamp response time (request leaving splectrum)
    response.headers.spl.request.timeResponded = Date.now()

    // TODO: transform response to client format

    // Send to client
    console.log('Response:')
    console.log(JSON.stringify(response, null, 2))

    // FAF: persist response record
    const fafModule = await import(path.join(runtime.nodeRoot, 'apps', appId, 'scripts/faf.js'))
    const requestsFolder = path.join(runtime.nodeRoot, 'apps', appId, 'requests')
    await fafModule.write({
      folder: requestsFolder,
      filename: `${timeReceived}.response.json`,
      dedupe: 'numeric-digit',
      record: response
    })
  } catch (err) {
    console.error(`Error: ${err.message}`)
    process.exit(1)
  }
}

async function executeFile(args, resolvedPath, runtime) {
  const scriptArgs = parseArgs(args, 1)

  console.log(`Node: ${runtime.nodeRoot}`)
  console.log(`Running file: ${resolvedPath}`)
  if (Object.keys(scriptArgs).length > 0) {
    console.log(`Args: ${JSON.stringify(scriptArgs)}`)
  }
  console.log('')

  // Read script content
  const scriptContent = fs.readFileSync(resolvedPath, 'utf-8')

  // Execute with context
  await executeWithContext(scriptContent, scriptArgs, runtime)
}

async function executeLibraryScript(args, resolvedPath, runtime) {
  const scriptName = args[0]
  const scriptArgs = parseArgs(args, 1)

  console.log(`Node: ${runtime.nodeRoot}`)
  console.log(`Running script: ${scriptName}`)
  console.log(`  from: ${resolvedPath}`)
  if (Object.keys(scriptArgs).length > 0) {
    console.log(`Args: ${JSON.stringify(scriptArgs)}`)
  }
  console.log('')

  // Read script content
  const scriptContent = fs.readFileSync(resolvedPath, 'utf-8')

  // Execute with context
  await executeWithContext(scriptContent, scriptArgs, runtime)
}

async function executeScript(args, runtime) {
  // Script content starts with /* preamble - valid JS, no stripping needed
  const scriptContent = args[0]

  console.log(`Node: ${runtime.nodeRoot}`)
  console.log(`Running inline script`)
  console.log('')

  // Execute with context
  await executeWithContext(scriptContent, {}, runtime)
}

async function executeWithContext(scriptContent, scriptArgs, runtime) {
  // Change to node root for lib resolution
  process.chdir(runtime.nodeRoot)

  // Import run.js from target node for programmatic API
  const runPath = path.join(runtime.nodeRoot, 'run.js')
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
