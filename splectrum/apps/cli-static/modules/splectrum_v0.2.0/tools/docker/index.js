// tools/docker - Docker CLI wrapper
//
// Passthrough wrapper for docker command.
// All args passed directly to docker.
//
// Splectrum flags (extracted by cli.js):
//   --dryRun  Show command without executing
//   --silent  Suppress narrative output
//
// Help:
//   spl tools/docker --help     → docker's help
//   spl tools/docker/whoami     → splectrum wrapper help
//
// Examples:
//   spl tools/docker ps
//   spl tools/docker build -t myapp .
//   spl tools/docker run -d nginx

const usageText =
  'Usage: spl tools/docker <docker-args>\n\n' +
  'Examples:\n' +
  '  spl tools/docker ps                  # List containers\n' +
  '  spl tools/docker images              # List images\n' +
  '  spl tools/docker build -t app .      # Build image\n' +
  '  spl tools/docker run -d nginx        # Run container\n' +
  '  spl tools/docker --help              # Show docker help\n' +
  '  spl tools/docker/whoami              # Show splectrum help'

export default async function(module) {
  const wrapper = await module.require('lib/spl/wrapper')
  wrapper.exec('docker', usageText)
}
