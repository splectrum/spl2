// tools/gh - GitHub CLI wrapper
//
// Passthrough wrapper for gh command.
// All args passed directly to gh.
//
// Splectrum flags (extracted by cli.js):
//   --dryRun  Show command without executing
//   --silent  Suppress narrative output
//
// Help:
//   spl tools/gh --help     → gh's help
//   spl tools/gh/whoami     → splectrum wrapper help
//
// Examples:
//   spl tools/gh pr list
//   spl tools/gh issue create --title "Bug" --body "Description"
//   spl tools/gh repo view

const usageText =
  'Usage: spl tools/gh <gh-args>\n\n' +
  'Examples:\n' +
  '  spl tools/gh pr list              # List pull requests\n' +
  '  spl tools/gh pr create            # Create a pull request\n' +
  '  spl tools/gh issue list           # List issues\n' +
  '  spl tools/gh repo view            # View repository info\n' +
  '  spl tools/gh --help               # Show gh help\n' +
  '  spl tools/gh/whoami               # Show splectrum help'

export default async function(module) {
  const wrapper = await module.require('lib/spl/wrapper')
  wrapper.exec('gh', usageText)
}
