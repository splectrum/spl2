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

const usageText =
  'Usage: spl tools/7zip <7z-args>\n\n' +
  'Examples:\n' +
  '  spl tools/7zip a archive.7z ./src    # Create archive\n' +
  '  spl tools/7zip x archive.7z          # Extract\n' +
  '  spl tools/7zip l archive.7z          # List contents\n' +
  '  spl tools/7zip --help                # Show 7z help\n' +
  '  spl tools/7zip/whoami                # Show splectrum help'

export default async function(module) {
  const wrapper = await module.require('lib/tools/7zip/wrapper.js')
  wrapper.exec('7z', usageText)
}
