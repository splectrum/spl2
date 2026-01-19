// tools/ssh - SSH CLI wrapper
//
// Passthrough wrapper for ssh command.
// All args passed directly to ssh.
//
// Splectrum flags (extracted by cli.js):
//   --dryRun  Show command without executing
//   --silent  Suppress narrative output
//
// Help:
//   spl tools/ssh --help     → ssh's help (via man page)
//   spl tools/ssh/whoami     → splectrum wrapper help
//
// Examples:
//   spl tools/ssh user@host
//   spl tools/ssh -i key.pem user@host
//   spl tools/ssh user@host "ls -la"

const usageText =
  'Usage: spl tools/ssh <ssh-args>\n\n' +
  'Examples:\n' +
  '  spl tools/ssh user@host              # Connect to host\n' +
  '  spl tools/ssh -i key.pem user@host   # Connect with key\n' +
  '  spl tools/ssh user@host "ls -la"     # Run remote command\n' +
  '  spl tools/ssh -p 2222 user@host      # Connect on custom port\n' +
  '  spl tools/ssh/whoami                 # Show splectrum help'

export default async function(module) {
  const wrapper = await module.require('lib/spl/wrapper')
  wrapper.exec('ssh', usageText)
}
