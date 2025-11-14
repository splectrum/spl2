// 07-runtime-detection.js - Platform detection pattern
// Self-testing: Runs on both Bare and Node, validates detection works
// Run with: bare 07-runtime-detection.js
// Run with: node 07-runtime-detection.js

console.log('Platform Detection Test\n')

// Detection pattern
const isBare = typeof Bare !== 'undefined'
const isNode = typeof process !== 'undefined' && process.versions && process.versions.node

console.log('=== Detection Results ===')
console.log('Detected as Bare:', isBare)
console.log('Detected as Node:', isNode)

// Validate mutually exclusive
if (isBare && isNode) {
  console.error('\n✗ FAIL: Detected as both Bare and Node (should be mutually exclusive)')
  if (isBare) Bare.exit(1)
  if (isNode) process.exit(1)
}

if (!isBare && !isNode) {
  console.error('\n✗ FAIL: Detected as neither Bare nor Node')
  // Can't exit reliably if we don't know the platform
  throw new Error('Unknown platform')
}

// Platform-specific information
console.log('\n=== Platform Information ===')
if (isBare) {
  console.log('Runtime: Bare')
  console.log('Version:', Bare.version)
  console.log('Platform:', Bare.platform)
  console.log('Architecture:', Bare.arch)
  console.log('Process ID:', Bare.pid)
} else if (isNode) {
  console.log('Runtime: Node.js')
  console.log('Version:', process.version)
  console.log('Platform:', process.platform)
  console.log('Architecture:', process.arch)
  console.log('Process ID:', process.pid)
}

console.log('\n✓ Platform detection working correctly')
console.log('Detected runtime:', isBare ? 'Bare' : 'Node.js')
