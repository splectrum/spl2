// cli.js - CLI entry point utilities
//
// Bound pattern: createCli(record) returns object with methods
// that read/write record internally. Caller doesn't know property paths.

import fs from 'fs'
import path from 'path'

// Script preamble - inline scripts must start with this
const SCRIPT_PREAMBLE = '/*'

/**
 * Create CLI bound to record
 * @param {Object} record - The CLI record
 * @returns {Object} - Bound CLI methods
 */
export function create(record) {

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
     * Find nearest splectrum/ folder traversing up from cwd
     * Reads: record.value.cwd
     * Writes: record.headers.spl.runtime.nodeRoot
     */
    resolveNode() {
      let dir = record.value.cwd

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
     * Reads: record.value.argv[0], record.value.cwd, record.headers.spl.runtime.nodeRoot
     * Writes: record.value.mode, record.value.resolvedPath
     */
    detectMode() {
      const firstArg = record.value.argv[0]
      const cwd = record.value.cwd
      const nodeRoot = record.headers.spl.runtime.nodeRoot

      if (!firstArg) {
        record.value.mode = 'command'
        return
      }

      // 1. Explicit file path
      if (firstArg.startsWith('./') || firstArg.startsWith('../') || path.isAbsolute(firstArg)) {
        const possiblePath = path.isAbsolute(firstArg)
          ? firstArg
          : path.join(cwd, firstArg)

        if (fs.existsSync(possiblePath) && fs.statSync(possiblePath).isFile()) {
          record.value.mode = 'file'
          record.value.resolvedPath = possiblePath
          return
        }
      }

      // 2. Inline script (starts with /*)
      if (firstArg.startsWith(SCRIPT_PREAMBLE)) {
        record.value.mode = 'script'
        return
      }

      // 3. Library script
      if (nodeRoot) {
        const scriptPath = resolveScript(firstArg, nodeRoot)
        if (scriptPath) {
          record.value.mode = 'library'
          record.value.resolvedPath = scriptPath
          return
        }
      }

      // 4. Default: command mode
      record.value.mode = 'command'
    },

    /**
     * Parse CLI arguments
     * Reads: record.value.argv, record.value.mode
     * Writes: record.value.input, record.value.method
     */
    parseArgs() {
      const argv = record.value.argv
      const mode = record.value.mode

      // For command mode, first arg is method, rest are input
      // For other modes, first arg is script/file, rest are input
      const startIndex = 1

      const input = { _positional: [] }

      for (let i = startIndex; i < argv.length; i++) {
        const arg = argv[i]
        if (arg.startsWith('--')) {
          const [key, ...valueParts] = arg.slice(2).split('=')
          input[key] = valueParts.length > 0 ? valueParts.join('=') : true
        } else {
          input._positional.push(arg)
        }
      }

      record.value.input = input

      // For command mode, first arg is the method
      if (mode === 'command' && argv[0]) {
        record.value.method = argv[0]
      }
    },

    /**
     * Validate CLI state
     * Reads: record.value.argv, record.headers.spl.runtime.nodeRoot
     * Writes: record.value.error (if invalid)
     * Returns: true if valid, false if error
     */
    validate() {
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
          cwd: record.value.cwd,
          exitCode: 1
        }
        return false
      }

      return true
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
        console.error(`Searched from: ${error.cwd}`)
      } else {
        console.error(`Error: ${error.code}`)
      }

      process.exit(error.exitCode)
    }
  }
}
