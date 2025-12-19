// spl/wrapper/_lib/wrapper.js - Shared wrapper execution logic
//
// Provides execSync-based command execution for tool wrappers.
// Handles: no-args usage, --dryRun, --silent, success/error output.

import { execSync } from 'child_process'

export function create(module) {
  return {
    /**
     * Execute a tool command with standard wrapper behavior.
     *
     * @param {string} toolName - The tool command name (e.g., 'git', '7z')
     * @param {string} usageText - Usage text shown when no args provided
     */
    exec(toolName, usageText) {
      let { args, dryRun, silent } = module.input()

      // No args - show usage
      if (!args) {
        module.output(usageText, { ok: true, usage: true })
        return
      }

      // Decode base64= prefix if present (bypasses shell escaping)
      if (args.startsWith('base64=')) {
        args = Buffer.from(args.slice(7), 'base64').toString('utf8')
      }

      const cmd = `${toolName} ${args}`

      // Handle --dryRun
      if (dryRun) {
        module.output(`Would run: ${cmd}`, { ok: true, dryRun: true, command: cmd })
        return
      }

      // Execute
      try {
        const stdout = execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] })

        if (!silent) {
          module.output(stdout || '(no output)', { ok: true, exitCode: 0, command: cmd })
        } else {
          module.output(null, { ok: true, exitCode: 0, command: cmd, stdout })
        }
      } catch (err) {
        const result = {
          ok: false,
          exitCode: err.status || 1,
          command: cmd,
          stdout: err.stdout || '',
          stderr: err.stderr || err.message
        }

        module.output(`Error (exit ${result.exitCode}): ${result.stderr}`, result)
      }
    }
  }
}
