/*
 * scripts/test-avsc.js - Test avsc lib
 * Usage: spl test-avsc
 */
const path = await module.require('path')
const avsc = await module.require('lib/spl/container/avsc.js')

const containerPath = path.join(module.getNodeRoot(), 'apps/cli-static/modules/work_module/spl/container')
const schemaPath = path.join(containerPath, '_schemas/input.avsc')

console.log('Testing avsc lib...\n')

// Test 1: parseSchema with valid schema
console.log('1. parseSchema (valid schema)')
const result1 = await avsc.parseSchema(schemaPath)
console.log('   ok:', result1.ok)
if (result1.ok) {
  console.log('   type name:', result1.type.name)
}
console.log()

// Test 2: validate with valid data
console.log('2. validate (valid data)')
const validData = { dryRun: true, silent: false }
const errors2 = avsc.validate(result1.type, validData)
console.log('   errors:', errors2)
console.log()

// Test 3: validate with invalid data
console.log('3. validate (invalid data)')
const invalidData = { dryRun: 'not a boolean', silent: 123 }
const errors3 = avsc.validate(result1.type, invalidData)
console.log('   errors:', JSON.stringify(errors3, null, 2))
console.log()

// Test 4: parseSchema with invalid path
console.log('4. parseSchema (invalid path)')
const result4 = await avsc.parseSchema('/nonexistent/path.avsc')
console.log('   ok:', result4.ok)
console.log('   error:', result4.error)
console.log()

console.log('Done.')
module.output({ status: 'ok' })
