// tools/git - Git wrapper
//
// Passthrough wrapper for git command.
// All args passed directly to git.
//
// Global flags (must come first):
//   --help    Show git help
//   --dryRun  Show command without executing
//   --silent  Suppress narrative output
//
// Examples:
//   spl tools/git status
//   spl tools/git log --oneline -5
//   spl tools/git diff
//   spl tools/git --help

export default async function(module) {
  const { execSync } = await module.require('child_process')
  const input = module.input()

  // Collect positional args
  const args = []
  for (let i = 0; input[i] !== undefined; i++) {
    args.push(input[i])
  }

  // Handle --help
  if (input.help) {
    try {
      const output = execSync('git --help', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] })
      module.output(output, { ok: true, command: 'git --help' })
    } catch (err) {
      module.output(err.stdout || err.message, { ok: true, command: 'git --help' })
    }
    return
  }

  // No args - show usage
  if (args.length === 0) {
    module.output(
      'Usage: spl tools/git <git-args>\n\n' +
      'Examples:\n' +
      '  spl tools/git status              # Show status\n' +
      '  spl tools/git log --oneline -5    # Recent commits\n' +
      '  spl tools/git diff                # Show changes\n' +
      '  spl tools/git --help              # Show git help',
      { ok: true, usage: true }
    )
    return
  }

  // Quote args containing spaces or special shell characters
  const quotedArgs = args.map(arg => {
    if (arg.includes(' ') || arg.includes('"') || arg.includes("'") || arg.includes('$')) {
      // Escape any existing double quotes and wrap in double quotes
      return `"${arg.replace(/"/g, '\\"')}"`
    }
    return arg
  })

  const cmd = `git ${quotedArgs.join(' ')}`

  // Handle --dryRun
  if (input.dryRun) {
    module.output(`Would run: ${cmd}`, { ok: true, dryRun: true, command: cmd })
    return
  }

  // Execute
  try {
    const stdout = execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] })

    if (!input.silent) {
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
