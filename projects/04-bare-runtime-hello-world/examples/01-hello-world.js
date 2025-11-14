// 01-hello-world.js - Simplest possible Bare program
// Self-testing: Outputs hello world and validates Bare global exists

console.log('Hello from Bare!')
console.log('Platform:', Bare.platform)
console.log('Architecture:', Bare.arch)
console.log('Bare version:', Bare.version)
console.log('Process ID:', Bare.pid)

// Self-test validation
if (typeof Bare === 'undefined') {
  console.error('FAIL: Bare global not available')
  Bare.exit(1)
}

if (!Bare.version) {
  console.error('FAIL: Bare.version not available')
  Bare.exit(1)
}

console.log('\n✓ Self-test passed: Bare runtime working correctly')
