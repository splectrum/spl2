// 02-file-operations.js - Basic file system operations in Bare
// Self-testing: Writes and reads a file, validates content matches

const fs = require('bare-fs')

async function testFileOperations() {
  const testFile = 'test-output.txt'
  const testContent = 'Hello from Bare file system!\nLine 2'

  console.log('Testing Bare file system operations...\n')

  // Write file
  console.log('1. Writing file:', testFile)
  await fs.writeFile(testFile, testContent)
  console.log('   ✓ File written successfully')

  // Read file
  console.log('\n2. Reading file:', testFile)
  const readContent = await fs.readFile(testFile, 'utf8')
  console.log('   Content read:', readContent.replace(/\n/g, '\\n'))

  // Self-test validation
  if (readContent !== testContent) {
    console.error('\n✗ FAIL: Content mismatch!')
    console.error('   Expected:', testContent.replace(/\n/g, '\\n'))
    console.error('   Got:', readContent.replace(/\n/g, '\\n'))
    Bare.exit(1)
  }
  console.log('   ✓ Content matches expected')

  // Get file stats
  console.log('\n3. Getting file stats...')
  const stats = await fs.stat(testFile)
  console.log('   Size:', stats.size, 'bytes')
  console.log('   Is file:', stats.isFile())
  console.log('   Is directory:', stats.isDirectory())

  // Cleanup
  console.log('\n4. Cleaning up...')
  await fs.unlink(testFile)
  console.log('   ✓ Test file removed')

  console.log('\n✓ All file operations tests passed!')
}

testFileOperations().catch(err => {
  console.error('✗ Test failed:', err.message)
  console.error(err.stack)
  Bare.exit(1)
})
