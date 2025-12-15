// tools/7zip - 7-Zip wrapper
//
// Passthrough wrapper for 7z command.
// All args passed directly to 7z.
//
// Splectrum flags (extracted by cli.js):
//   --dryRun  Show command without executing
//   --silent  Suppress narrative output
//
// Help:
//   spl tools/7zip --help     → 7z's help
//   spl tools/7zip/whoami     → splectrum wrapper help
//
// Examples:
//   spl tools/7zip a archive.7z ./src
//   spl tools/7zip x archive.7z -o./output
//   spl tools/7zip l archive.7z

export default async function(module) {
  const { execSync } = await module.require('child_process')
  const { args, dryRun, silent } = module.input()

  // No args - show usage
  if (!args) {
    module.output(
      'Usage: spl tools/7zip <7z-args>\n\n' +
      'Examples:\n' +
      '  spl tools/7zip a archive.7z ./src    # Create archive\n' +
      '  spl tools/7zip x archive.7z          # Extract\n' +
      '  spl tools/7zip l archive.7z          # List contents\n' +
      '  spl tools/7zip --help                # Show 7z help\n' +
      '  spl tools/7zip/whoami                # Show splectrum help',
      { ok: true, usage: true }
    )
    return
  }

  const cmd = `7z ${args}`

  // Handle --dryRun
  if (dryRun) {
    module.output(`Would run: ${cmd}`, { ok: true, dryRun: true, command: cmd })
    return
  }

  // Execute
  try {
    const stdout = execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] })

    if (!silent) {
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
