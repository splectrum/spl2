// 03-esm-modules.mjs - Test ESM import/export support
// Self-testing: Verifies ESM syntax works in Bare
// Note: Requires .mjs extension for ESM in Bare

import { readFile, writeFile, unlink } from 'bare-fs'

console.log('Testing ESM modules in Bare...\n')

const testFile = 'esm-test.txt'
const content = 'ESM module test content'

console.log('1. Writing file using ESM-imported writeFile...')
await writeFile(testFile, content)
console.log('   ✓ File written')

console.log('\n2. Reading file using ESM-imported readFile...')
const readContent = await readFile(testFile, 'utf8')
console.log('   Content:', readContent)

// Self-test validation
if (readContent !== content) {
  console.error('\n✗ FAIL: Content mismatch in ESM test')
  Bare.exit(1)
}

console.log('\n3. Cleaning up...')
await unlink(testFile)
console.log('   ✓ Test file removed')

console.log('\n✓ ESM imports working correctly!')
console.log('Note: Requires .mjs file extension')
