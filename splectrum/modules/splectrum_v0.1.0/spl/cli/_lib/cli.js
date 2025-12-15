// cli.js - CLI entry point utilities
//
// Bound pattern: create(module, record) returns object with methods
// that read/write record internally. Caller doesn't know property paths.
//
// Note: This lib is entrypoint infrastructure specific to spl.mjs.
// It receives raw record because it builds the record structure.

// Script preamble - inline scripts must start with this
const SCRIPT_PREAMBLE = '/*'

// Convert kebab-case to camelCase (--dry-run → dryRun)
function kebabToCamel(str) {
  return str.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
}

/**
 * Create CLI bound to record
 * @param {Object} module - Module interface (for platform requires)
 * @param {Object} record - The CLI record (raw access for setup)
 * @returns {Object} - Bound CLI methods
 */
export async function create(module, record) {
  const fs = await module.require('fs')
  const path = await module.require('path')

  // Internal: resolve script by name from scripts/ folder
  function resolveScript(scriptName, nodeRoot) {
    const scriptsDir = path.join(nodeRoot, 'scripts')

    if (!fs.existsSync(scriptsDir) || !fs.statSync(scriptsDir).isDirectory()) {
      return null
    }

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

  return {
    /**
     * Find nearest splectrum/ folder traversing up from invokedFrom
     * Reads: record.headers.spl.runtime.invokedFrom
     * Writes: record.headers.spl.runtime.nodeRoot
     */
    resolveNode() {
      let dir = record.headers.spl.runtime.invokedFrom

      while (dir !== path.dirname(dir)) {
        const splectrumPath = path.join(dir, 'splectrum')

        if (fs.existsSync(splectrumPath) && fs.statSync(splectrumPath).isDirectory()) {
          const packageJsonPath = path.join(splectrumPath, 'package.json')
          if (fs.existsSync(packageJsonPath)) {
            try {
              const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
              if (pkg.name === 'splectrum') {
                record.headers.spl.runtime.nodeRoot = splectrumPath
                return
              }
            } catch (e) {
              // Invalid JSON, skip
            }
          }
        }

        dir = path.dirname(dir)
      }

      // Not found - nodeRoot stays null
    },

    /**
     * Detect invocation mode from first argument
     * Reads: record.value.argv[0], record.headers.spl.runtime.invokedFrom, record.headers.spl.runtime.nodeRoot
     * Writes: record.value.mode, record.value.resolvedPath
     */
    detectMode() {
      const firstArg = record.value.argv[0]
      const invokedFrom = record.headers.spl.runtime.invokedFrom
      const nodeRoot = record.headers.spl.runtime.nodeRoot

      if (!firstArg) {
        record.value.mode = 'command'
        return
      }

      // 1. Inline script (starts with /*) - check before file paths since /* looks like absolute path
      if (firstArg.startsWith(SCRIPT_PREAMBLE)) {
        record.value.mode = 'script'
        return
      }

      // 2. Explicit file path
      if (firstArg.startsWith('./') || firstArg.startsWith('../') || path.isAbsolute(firstArg)) {
        const possiblePath = path.isAbsolute(firstArg)
          ? firstArg
          : path.join(invokedFrom, firstArg)

        if (fs.existsSync(possiblePath) && fs.statSync(possiblePath).isFile()) {
          // Check if path is inside nodeRoot (internal script)
          if (nodeRoot && possiblePath.startsWith(nodeRoot + path.sep)) {
            record.value.mode = 'library'
            record.value.resolvedPath = possiblePath
            return
          }
          // External file
          record.value.mode = 'file'
          record.value.resolvedPath = possiblePath
          return
        } else {
          // Explicit file path but file not found - error
          record.value.mode = 'file'
          record.value.error = {
            code: 'FILE_NOT_FOUND',
            path: possiblePath,
            exitCode: 1
          }
          return
        }
      }

      // 4. Library script
      if (nodeRoot) {
        const scriptPath = resolveScript(firstArg, nodeRoot)
        if (scriptPath) {
          record.value.mode = 'library'
          record.value.resolvedPath = scriptPath
          return
        }
      }

      // 5. Default: command mode
      record.value.mode = 'command'
    },

    /**
     * Check if a method path instantiates spl/wrapper (passthrough mode)
     * @param {string} methodPath - The method path to check
     * @returns {boolean} - true if wrapper, false otherwise
     *
     * QUIRK: Only detects wrappers in splectrum modules (bm_spl, etc.), not app
     * overlay modules. This is because wrapper detection runs during cli.parseArgs()
     * before app context is available (appAPI not set yet). Wrappers should be
     * placed in splectrum modules, not work_module.
     */
    isWrapper(methodPath) {
      if (!methodPath) return false

      try {
        // Get the container path (remove method name if present)
        const segments = methodPath.split('/')
        let containerPath = methodPath

        // Try to find index.json - if not found, try parent
        let resolved = module.resolve(containerPath, 'index.json')
        if (!resolved && segments.length > 1) {
          containerPath = segments.slice(0, -1).join('/')
          resolved = module.resolve(containerPath, 'index.json')
        }
        if (!resolved) return false

        // Check instantiates chain for spl/wrapper
        const { stack } = module.buildTypeStack(containerPath, 'instantiates')
        return stack.includes('spl/wrapper')
      } catch (e) {
        return false
      }
    },

    /**
     * Parse CLI arguments
     * Reads: record.value.argv, record.value.mode
     * Writes: record.headers.spl.request.input, record.value.method
     */
    parseArgs() {
      const argv = record.value.argv
      const mode = record.value.mode

      // For command mode, first arg is method, rest are input
      // For other modes, first arg is script/file, rest are input
      const startIndex = 1

      // For command mode, first arg is the method
      if (mode === 'command' && argv[0]) {
        record.value.method = argv[0]
      }

      // Check if this is a wrapper - if so, all args are positional
      const isWrapperMode = mode === 'command' && this.isWrapper(record.value.method)

      const input = {}
      let positionalIndex = 0

      for (let i = startIndex; i < argv.length; i++) {
        const arg = argv[i]
        if (!isWrapperMode && arg.startsWith('--')) {
          const [rawKey, ...valueParts] = arg.slice(2).split('=')
          const key = kebabToCamel(rawKey)
          input[key] = valueParts.length > 0 ? valueParts.join('=') : true
        } else {
          // Positional args as numeric string keys
          input[String(positionalIndex)] = arg
          positionalIndex++
        }
      }

      // Input is metadata - goes to headers
      record.headers.spl.request.input = input
    },

    /**
     * Rewrite --help/-h to whoami --usage
     * Reads: record.value.argv, record.value.method, record.headers.spl.request.input
     * Writes: record.value.method, record.headers.spl.request.input
     */
    rewriteHelp() {
      const argv = record.value.argv
      const input = record.headers.spl.request.input

      // Check for --help (in input) or -h (in argv, not parsed as flag)
      const hasHelp = input.help === true || argv.includes('-h')

      if (!hasHelp) return

      // Rewrite method: append /whoami (always - whoami on whoami introspects the method itself)
      if (record.value.method) {
        record.value.method = record.value.method + '/whoami'
      }

      // Add usage flag, hide topline/summary, remove help
      input.usage = true
      input.hide = 'topline,summary'
      delete input.help
    },

    /**
     * Check if mode is external script file
     * Reads: record.value.mode
     * Returns: true if mode is 'file'
     */
    isExternalScriptFile() {
      return record.value.mode === 'file'
    },

    /**
     * Load external script file content for inline execution
     * Reads: record.value.resolvedPath
     * Writes: record.value.script, record.value.mode (file → script), record.value.error
     */
    loadExternalScriptFile() {
      try {
        const content = fs.readFileSync(record.value.resolvedPath, 'utf-8')
        record.value.script = content
        record.value.mode = 'script'
      } catch (e) {
        record.value.error = {
          code: 'FILE_READ_ERROR',
          path: record.value.resolvedPath,
          message: e.message,
          exitCode: 1
        }
      }
    },

    /**
     * Validate CLI state
     * Reads: record.value.argv, record.value.error, record.headers.spl.runtime.nodeRoot
     * Writes: record.value.error (if invalid)
     * Returns: true if valid, false if error
     */
    validate() {
      // Check: error already set (from detectMode, parseArgs, etc.)
      if (record.value.error) {
        return false
      }

      // Check: no args
      if (record.value.argv.length === 0) {
        record.value.error = {
          code: 'NO_ARGS',
          exitCode: 1
        }
        return false
      }

      // Check: no node found
      if (!record.headers.spl.runtime.nodeRoot) {
        record.value.error = {
          code: 'NO_NODE',
          invokedFrom: record.headers.spl.runtime.invokedFrom,
          exitCode: 1
        }
        return false
      }

      return true
    },

    /**
     * Resolve error topic path for this CLI session
     * Reads: record.headers.spl.runtime.nodeRoot
     * Returns: absolute path to error topic folder
     */
    resolveErrorTopic() {
      const nodeRoot = record.headers.spl.runtime.nodeRoot
      if (!nodeRoot) return null
      return path.join(nodeRoot, 'runtime', 'error', 'cli')
    },

    /**
     * Handle error - output console-friendly message and exit
     * Reads: record.value.error
     */
    handleError() {
      const error = record.value.error

      if (error.code === 'NO_ARGS') {
        console.error('Usage:')
        console.error('  spl package/api/method [--arg=value ...]   # Command')
        console.error('  spl "./script.js" [--arg=value ...]        # File')
        console.error('  spl "/* */ code..."                        # Inline')
        console.error('  spl scriptname [--arg=value ...]           # Library')
        console.error('')
        console.error('Examples:')
        console.error('  spl spl/dev/cycle --name=env-123')
        console.error('  spl status')
      } else if (error.code === 'NO_NODE') {
        console.error('Error: No splectrum/ node found in directory tree')
        console.error(`Searched from: ${error.invokedFrom}`)
      } else if (error.code === 'FILE_NOT_FOUND') {
        console.error(`Error: File not found: ${error.path}`)
      } else if (error.code === 'FILE_READ_ERROR') {
        console.error(`Error: Cannot read file: ${error.path}`)
        console.error(`  ${error.message}`)
      } else {
        console.error(`Error: ${error.code}`)
      }

      process.exit(error.exitCode)
    }
  }
}
