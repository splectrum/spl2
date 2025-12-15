// tools/7zip - 7-Zip wrapper
//
// Passthrough wrapper for 7z command.
// All args passed directly to 7z.
//
// Global flags (must come first):
//   --help    Show 7z help
//   --dryRun  Show command without executing
//   --silent  Suppress narrative output
//
// Examples:
//   spl tools/7zip a archive.7z ./src
//   spl tools/7zip x archive.7z -o./output
//   spl tools/7zip l archive.7z
//   spl tools/7zip --help

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
      const output = execSync('7z --help', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] })
      module.output(output, { ok: true, command: '7z --help' })
    } catch (err) {
      // 7z --help might exit non-zero but still output help
      module.output(err.stdout || err.message, { ok: true, command: '7z --help' })
    }
    return
  }

  // No args - show usage
  if (args.length === 0) {
    module.output(
      'Usage: spl tools/7zip <7z-args>\n\n' +
      'Examples:\n' +
      '  spl tools/7zip a archive.7z ./src    # Create archive\n' +
      '  spl tools/7zip x archive.7z          # Extract\n' +
      '  spl tools/7zip l archive.7z          # List contents\n' +
      '  spl tools/7zip --help                # Show 7z help',
      { ok: true, usage: true }
    )
    return
  }

  const cmd = `7z ${args.join(' ')}`

  // Handle --dryRun
  if (input.dryRun) {
    module.output(`Would run: ${cmd}`, { ok: true, dryRun: true, command: cmd })
    return
  }

  // Execute
  try {
    const stdout = execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] })

    if (!input.silent) {
      module.output(stdout, { ok: true, exitCode: 0, command: cmd })
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
