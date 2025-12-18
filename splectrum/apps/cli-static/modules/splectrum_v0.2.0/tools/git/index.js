// tools/git - Git wrapper
//
// Passthrough wrapper for git command.
// All args passed directly to git.
//
// Splectrum flags (extracted by cli.js):
//   --dryRun  Show command without executing
//   --silent  Suppress narrative output
//
// Help:
//   spl tools/git --help     → git's help
//   spl tools/git/whoami     → splectrum wrapper help
//
// Examples:
//   spl tools/git status
//   spl tools/git log --oneline -5
//   spl tools/git commit -m "message with spaces"

import { execSync } from 'child_process'

export default async function(module) {
  const { args, dryRun, silent } = module.input()

  // No args - show usage
  if (!args) {
    module.output(
      'Usage: spl tools/git <git-args>\n\n' +
      'Examples:\n' +
      '  spl tools/git status              # Show status\n' +
      '  spl tools/git log --oneline -5    # Recent commits\n' +
      '  spl tools/git diff                # Show changes\n' +
      '  spl tools/git --help              # Show git help\n' +
      '  spl tools/git/whoami              # Show splectrum help',
      { ok: true, usage: true }
    )
    return
  }

  const cmd = `git ${args}`

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
