// cli.js - CLI entry point utilities
//
// Bound pattern: create(module) returns object with methods
// that read/write record internally via module.getData() and module.getMetaData().
//
// Note: This lib is entrypoint infrastructure specific to spl.mjs.

import fs from 'fs'
import path from 'path'

// Script preamble - inline scripts must start with this
const SCRIPT_PREAMBLE = '/*'

// Convert kebab-case to camelCase (--dry-run → dryRun)
function kebabToCamel(str) {
  return str.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
}

/**
 * Create CLI bound to module's record
 * @param {Object} module - Module interface (record access via getData/getMetaData)
 * @returns {Object} - Bound CLI methods
 */
export function create(module) {
  // Get record data and metadata from module
  const data = module.getData()
  const metadata = module.getMetaData()

  return {
    /**
     * Find nearest splectrum/ folder traversing up from invokedFrom
     * Reads: metadata.spl.runtime.invokedFrom
     * Writes: metadata.spl.runtime.nodeRoot
     */
    resolveNode() {
      let dir = metadata.spl.runtime.invokedFrom

      while (dir !== path.dirname(dir)) {
        const splectrumPath = path.join(dir, 'splectrum')

        if (fs.existsSync(splectrumPath) && fs.statSync(splectrumPath).isDirectory()) {
          const packageJsonPath = path.join(splectrumPath, 'package.json')
          if (fs.existsSync(packageJsonPath)) {
            try {
              const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
              if (pkg.name === 'splectrum') {
                metadata.spl.runtime.nodeRoot = splectrumPath
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
     * Detect invocation mode from first argument (syntax-based, no existence checks)
     *
     * Mode classification:
     * - /*       → inline script
     * - ./ or ../ or /abs → file (external script)
     * - no /     → script (internal, resolved later via module.resolveScript)
     * - has /    → command
     *
     * Reads: data.argv[0]
     * Writes: data.mode, data.scriptName (for script mode)
     */
    detectMode() {
      const firstArg = data.argv[0]

      if (!firstArg) {
        data.mode = 'command'
        return
      }

      // 1. Inline script (starts with /*)
      if (firstArg.startsWith(SCRIPT_PREAMBLE)) {
        data.mode = 'inline'
        return
      }

      // 2. Explicit file path (./, ../, or absolute)
      if (firstArg.startsWith('./') || firstArg.startsWith('../') || path.isAbsolute(firstArg)) {
        data.mode = 'file'
        return
      }

      // 3. Script (no forward slash) - resolved later via module.resolveScript
      if (!firstArg.includes('/')) {
        data.mode = 'script'
        data.scriptName = firstArg
        return
      }

      // 4. Command (has forward slash)
      data.mode = 'command'
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
     *
     * NOTE: Only returns true when invoking a wrapper API directly (e.g., tools/git).
     * Method calls on wrapper APIs (e.g., tools/git/whoami, spl/wrapper/selfeval)
     * use standard splectrum parsing, not passthrough.
     */
    isWrapper(methodPath) {
      if (!methodPath) return false

      try {
        // Only check exact path - if no index.json here, it's a method call
        const resolved = module.resolve(methodPath, 'index.json')
        if (!resolved) return false

        // Check instantiates chain for spl/wrapper
        const { stack } = module.buildTypeStack(methodPath, 'instantiates')
        return stack.includes('spl/wrapper')
      } catch (e) {
        return false
      }
    },

    /**
     * Parse CLI arguments
     * Reads: data.argv, data.mode
     * Writes: metadata.spl.request.input, data.method
     */
    parseArgs() {
      const argv = data.argv
      const mode = data.mode

      // For command mode, first arg is method, rest are input
      // For other modes, first arg is script/file, rest are input
      const startIndex = 1

      // For command mode, first arg is the method
      if (mode === 'command' && argv[0]) {
        data.method = argv[0]
      }

      // Check if this is a wrapper - schema-driven parsing
      const isWrapperMode = mode === 'command' && this.isWrapper(data.method)

      if (isWrapperMode) {
        // Load wrapper input schema to get splectrum flag names
        const schemaPath = module.resolve('spl/wrapper', '_schemas/input.avsc')
        let schemaFields = new Set(['dryRun', 'silent']) // defaults if schema not found

        if (schemaPath) {
          try {
            const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'))
            if (schema.fields) {
              schemaFields = new Set(schema.fields.map(f => f.name))
              schemaFields.delete('args') // args is passthrough, not a flag
            }
          } catch (e) {
            // Use defaults
          }
        }

        // Initialize input with schema defaults
        const input = { args: '', dryRun: false, silent: false }
        const passthrough = []

        // Extract splectrum flags, collect passthrough args
        for (let i = startIndex; i < argv.length; i++) {
          const arg = argv[i]
          if (arg.startsWith('--')) {
            const [rawKey] = arg.slice(2).split('=')
            const flagName = kebabToCamel(rawKey)
            if (schemaFields.has(flagName)) {
              input[flagName] = true
              continue
            }
          }
          passthrough.push(arg)
        }

        // Quote and join passthrough args for shell
        input.args = passthrough.map(arg => {
          if (arg.includes(' ') || arg.includes('"') || arg.includes("'") || arg.includes('$')) {
            return `"${arg.replace(/"/g, '\\"')}"`
          }
          return arg
        }).join(' ')

        metadata.spl.request.input = input
        return
      }

      // Standard (non-wrapper) parsing
      const input = {}
      let positionalIndex = 0

      for (let i = startIndex; i < argv.length; i++) {
        const arg = argv[i]
        if (arg.startsWith('--')) {
          const [rawKey, ...valueParts] = arg.slice(2).split('=')
          const key = kebabToCamel(rawKey)
          input[key] = valueParts.length > 0 ? valueParts.join('=') : true
        } else {
          // Positional args as numeric string keys
          input[String(positionalIndex)] = arg
          positionalIndex++
        }
      }

      // Input is metadata - goes to metadata
      metadata.spl.request.input = input
    },

    /**
     * Rewrite --help/-h to whoami --usage
     * Reads: data.argv, data.method, metadata.spl.request.input
     * Writes: data.method, metadata.spl.request.input
     *
     * Note: Wrappers skip help rewrite - help passes through to wrapped tool.
     * Use /whoami for splectrum wrapper help (e.g., spl tools/git/whoami).
     */
    rewriteHelp() {
      // Wrappers: help passes through to tool, use /whoami for splectrum help
      if (this.isWrapper(data.method)) return

      const argv = data.argv
      const input = metadata.spl.request.input

      // Check for --help (in input) or -h (in argv, not parsed as flag)
      const hasHelp = input.help === true || argv.includes('-h')

      if (!hasHelp) return

      // Rewrite method: append /whoami (always - whoami on whoami introspects the method itself)
      if (data.method) {
        data.method = data.method + '/whoami'
      }

      // Add usage flag, hide topline/summary, remove help
      input.usage = true
      input.hide = 'topline,summary'
      delete input.help
    },

    /**
     * Check if mode is external script file
     * Reads: data.mode
     * Returns: true if mode is 'file'
     */
    isExternalScriptFile() {
      return data.mode === 'file'
    },

    /**
     * Resolve and load external script file
     * Reads: data.argv[0], metadata.spl.runtime.invokedFrom
     * Writes: data.script, data.resolvedPath, data.mode (file → inline), data.error
     */
    loadExternalScriptFile() {
      const firstArg = data.argv[0]
      const invokedFrom = metadata.spl.runtime.invokedFrom

      // Resolve path
      const resolvedPath = path.isAbsolute(firstArg)
        ? firstArg
        : path.join(invokedFrom, firstArg)

      // Check existence
      if (!fs.existsSync(resolvedPath) || !fs.statSync(resolvedPath).isFile()) {
        data.error = {
          code: 'FILE_NOT_FOUND',
          path: resolvedPath,
          exitCode: 1
        }
        return
      }

      // Load content
      try {
        const content = fs.readFileSync(resolvedPath, 'utf-8')
        data.script = content
        data.resolvedPath = resolvedPath
        data.mode = 'inline'
      } catch (e) {
        data.error = {
          code: 'FILE_READ_ERROR',
          path: resolvedPath,
          message: e.message,
          exitCode: 1
        }
      }
    },

    /**
     * Validate CLI state
     * Reads: data.argv, data.error, metadata.spl.runtime.nodeRoot
     * Writes: data.error (if invalid)
     * Returns: true if valid, false if error
     */
    validate() {
      // Check: error already set (from detectMode, parseArgs, etc.)
      if (data.error) {
        return false
      }

      // Check: no args
      if (data.argv.length === 0) {
        data.error = {
          code: 'NO_ARGS',
          exitCode: 1
        }
        return false
      }

      // Check: no node found
      if (!metadata.spl.runtime.nodeRoot) {
        data.error = {
          code: 'NO_NODE',
          invokedFrom: metadata.spl.runtime.invokedFrom,
          exitCode: 1
        }
        return false
      }

      return true
    },

    /**
     * Resolve error topic path for this CLI session
     * Reads: metadata.spl.runtime.nodeRoot
     * Returns: absolute path to error topic folder
     */
    resolveErrorTopic() {
      const nodeRoot = metadata.spl.runtime.nodeRoot
      if (!nodeRoot) return null
      return path.join(nodeRoot, 'runtime', 'error', 'cli')
    },

    /**
     * Handle error - output console-friendly message and exit
     * Reads: data.error
     */
    handleError() {
      const error = data.error

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
