// 09-fs-abstraction.js - File system abstraction for Bare/Node
// Self-testing: Runs on both platforms with unified fs API
// Run with: bare 09-fs-abstraction.js
// Run with: node 09-fs-abstraction.js

console.log('File System Abstraction Test\n')

// File system abstraction
const fs = typeof Bare !== 'undefined'
  ? require('bare-fs')
  : require('fs').promises

const runtime = {
  exit: (code) => typeof Bare !== 'undefined' ? Bare.exit(code) : process.exit(code)
}

async function testFileSystem() {
  const testFile = 'platform-test.txt'
  const testContent = 'Platform-agnostic file content\nWorks on Bare and Node!'

  console.log('=== Testing Unified File System API ===')

  // Write file
  console.log('1. Writing file:', testFile)
  await fs.writeFile(testFile, testContent)
  console.log('   ✓ File written')

  // Read file
  console.log('\n2. Reading file:', testFile)
  const readContent = await fs.readFile(testFile, 'utf8')
  console.log('   Content:', readContent.replace(/\n/g, '\\n'))

  // Validate content
  if (readContent !== testContent) {
    console.error('\n✗ FAIL: Content mismatch')
    console.error('   Expected:', testContent.replace(/\n/g, '\\n'))
    console.error('   Got:', readContent.replace(/\n/g, '\\n'))
    runtime.exit(1)
  }
  console.log('   ✓ Content matches')

  // Get stats
  console.log('\n3. Getting file stats...')
  const stats = await fs.stat(testFile)
  console.log('   Size:', stats.size, 'bytes')
  console.log('   Is file:', stats.isFile())
  console.log('   Is directory:', stats.isDirectory())

  // Cleanup
  console.log('\n4. Cleaning up...')
  await fs.unlink(testFile)
  console.log('   ✓ File removed')

  console.log('\n✓ File system abstraction working correctly')
  console.log('Same fs API works on both Bare and Node!')
}

testFileSystem().catch(err => {
  console.error('\n✗ Test failed:', err.message)
  console.error(err.stack)
  runtime.exit(1)
})
