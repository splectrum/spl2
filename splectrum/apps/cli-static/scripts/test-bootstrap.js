// test-bootstrap.js - Test moduleBootstrap
//
// Run with: spl ./splectrum/apps/cli-static/scripts/test-bootstrap.js

const { requireSpl } = await import(path.join(runtime.nodeRoot, 'lib/moduleBootstrap.js'))

console.log('Testing moduleBootstrap.js\n')

// Test 1: requireSpl (node modules only)
console.log('1. requireSpl - node modules')
try {
  const required = await requireSpl('spl/dev/cycle', { name: 'test-env' }, {})
  console.log('   Got spl wrapper:', typeof required.spl)
  console.log('   Got handle:', typeof required.handle)
  console.log('   Got record:', typeof required.record)
  console.log('   spl.complete exists:', typeof required.spl.complete)
} catch (err) {
  console.log(`   Error: ${err.message}`)
  console.log('   (expected if method not in node modules)')
}
console.log('')

// Test 2: requireSpl with app override (no app modules yet)
console.log('2. requireSpl - with appModuleOverride')
try {
  const required = await requireSpl('spl/dev/cycle', { name: 'test-env' }, {
    appModuleOverride: true,
    appId: 'cli-static'
  })
  console.log('   Got spl wrapper:', typeof required.spl)
  console.log('   (resolved from node modules - no app modules yet)')
} catch (err) {
  console.log(`   Error: ${err.message}`)
}

console.log('\nDone.')
