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

const usageText =
  'Usage: spl tools/git <git-args>\n\n' +
  'Examples:\n' +
  '  spl tools/git status              # Show status\n' +
  '  spl tools/git log --oneline -5    # Recent commits\n' +
  '  spl tools/git diff                # Show changes\n' +
  '  spl tools/git --help              # Show git help\n' +
  '  spl tools/git/whoami              # Show splectrum help'

export default async function(module) {
  const wrapper = await module.require('lib/tools/git/wrapper.js')
  wrapper.exec('git', usageText)
}
