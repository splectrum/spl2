// tools/rsync - rsync wrapper
//
// Passthrough wrapper for rsync command.
// All args passed directly to rsync.
//
// Splectrum flags (extracted by cli.js):
//   --dryRun  Show command without executing
//   --silent  Suppress narrative output
//
// Help:
//   spl tools/rsync --help     → rsync's help
//   spl tools/rsync/whoami     → splectrum wrapper help
//
// Examples:
//   spl tools/rsync -avz src/ dest/
//   spl tools/rsync -avz src/ user@host:dest/
//   spl tools/rsync -avz --delete src/ dest/

const usageText =
  'Usage: spl tools/rsync <rsync-args>\n\n' +
  'Examples:\n' +
  '  spl tools/rsync -avz src/ dest/          # Sync directories\n' +
  '  spl tools/rsync -avz src/ user@host:dest/ # Sync to remote\n' +
  '  spl tools/rsync -avz --delete src/ dest/ # Mirror (delete extra)\n' +
  '  spl tools/rsync -n -avz src/ dest/       # Dry run (rsync\'s -n)\n' +
  '  spl tools/rsync --help                   # Show rsync help\n' +
  '  spl tools/rsync/whoami                   # Show splectrum help'

export default async function(module) {
  const wrapper = await module.require('lib/spl/wrapper')
  wrapper.exec('rsync', usageText)
}
