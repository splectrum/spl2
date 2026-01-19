// tools/pear - Holepunch Pear Runtime wrapper
//
// Passthrough wrapper for pear command.
// All args passed directly to pear.
//
// Splectrum flags (extracted by cli.js):
//   --dryRun  Show command without executing
//   --silent  Suppress narrative output
//
// Help:
//   spl tools/pear --help     → pear's help
//   spl tools/pear/whoami     → splectrum wrapper help
//
// Examples:
//   spl tools/pear run pear://app
//   spl tools/pear stage myapp
//   spl tools/pear seed myapp

const usageText =
  'Usage: spl tools/pear <pear-args>\n\n' +
  'Examples:\n' +
  '  spl tools/pear run pear://app        # Run a pear app\n' +
  '  spl tools/pear dev .                 # Run app in dev mode\n' +
  '  spl tools/pear stage myapp           # Stage app for release\n' +
  '  spl tools/pear seed myapp            # Seed app to network\n' +
  '  spl tools/pear --help                # Show pear help\n' +
  '  spl tools/pear/whoami                # Show splectrum help'

export default async function(module) {
  const wrapper = await module.require('lib/spl/wrapper')
  wrapper.exec('pear', usageText)
}
