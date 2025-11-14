// 08-platform-abstraction.js - Simple platform abstraction layer
// Self-testing: Runs on both Bare and Node with unified API
// Run with: bare 08-platform-abstraction.js
// Run with: node 08-platform-abstraction.js

console.log('Platform Abstraction Test\n')

// Simple abstraction layer
const runtime = {
  name: typeof Bare !== 'undefined' ? 'Bare' : 'Node.js',
  platform: typeof Bare !== 'undefined' ? Bare.platform : process.platform,
  arch: typeof Bare !== 'undefined' ? Bare.arch : process.arch,
  pid: typeof Bare !== 'undefined' ? Bare.pid : process.pid,
  version: typeof Bare !== 'undefined' ? Bare.version : process.version,
  argv: typeof Bare !== 'undefined' ? Bare.argv : process.argv,
  exit: (code) => typeof Bare !== 'undefined' ? Bare.exit(code) : process.exit(code)
}

console.log('=== Abstracted Runtime Information ===')
console.log('Runtime Name:', runtime.name)
console.log('Platform:', runtime.platform)
console.log('Architecture:', runtime.arch)
console.log('Process ID:', runtime.pid)
console.log('Version:', runtime.version)
console.log('Arguments:', runtime.argv.slice(-1)[0]) // Show script name

// Self-test validation
if (!runtime.platform) {
  console.error('\n✗ FAIL: Platform not detected')
  runtime.exit(1)
}

if (!runtime.arch) {
  console.error('\n✗ FAIL: Architecture not detected')
  runtime.exit(1)
}

if (!runtime.pid || runtime.pid <= 0) {
  console.error('\n✗ FAIL: Invalid process ID')
  runtime.exit(1)
}

console.log('\n✓ Platform abstraction working correctly')
console.log('Business logic can use runtime.* without platform-specific code')
