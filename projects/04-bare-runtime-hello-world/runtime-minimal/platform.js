// platform.js - Platform abstraction for Bare and Node
// Applies patterns from Twin Pair 2

module.exports = {
  name: typeof Bare !== 'undefined' ? 'Bare' : 'Node.js',
  platform: typeof Bare !== 'undefined' ? Bare.platform : process.platform,
  version: typeof Bare !== 'undefined' ? Bare.version : process.version,
  exit: (code) => typeof Bare !== 'undefined' ? Bare.exit(code) : process.exit(code)
}
