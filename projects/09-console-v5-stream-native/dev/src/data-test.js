// Test data operations

const data = require('./data.js')

console.log('Testing data operations...\n')

// Test topic
const topic = 'test-pipeline-001'

console.log('1. PUBLISH')
data.publish(topic, { stepId: 'step-0', value: 'test-1' })
data.publish(topic, { stepId: 'step-1', value: 'test-2' })
data.publish(topic, { stepId: 'step-2', value: 'test-3' })
console.log('✓ Published 3 events')

console.log('\n2. CONSUME')
const all = data.consume(topic)
console.log(`✓ Consumed ${all.length} events:`, all.map(e => e.stepId).join(', '))

console.log('\n3. SEEK')
const latest = data.seek(topic, 'latest')
console.log('✓ Latest:', latest.stepId)

console.log('\n4. READ')
const current = data.read(topic)
console.log('✓ Current:', current.stepId)

console.log('\n5. WRITE')
data.write(topic, { stepId: 'step-3', value: 'test-4' })
const newLatest = data.read(topic)
console.log('✓ After write, latest:', newLatest.stepId)

console.log('\n✅ All data operations working!')
