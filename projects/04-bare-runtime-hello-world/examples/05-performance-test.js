// 05-performance-test.js - Simple performance benchmarks
// Self-testing: Measures execution speed for basic operations

console.log('Performance benchmarks...\n')

// Benchmark 1: Array operations
console.log('=== Benchmark 1: Array Operations ===')
const iterations = 1000000
const start1 = Date.now()

const arr = []
for (let i = 0; i < iterations; i++) {
  arr.push(i)
}

const sum = arr.reduce((acc, val) => acc + val, 0)
const duration1 = Date.now() - start1

console.log(`Iterations: ${iterations}`)
console.log(`Sum: ${sum}`)
console.log(`Duration: ${duration1}ms`)
console.log(`Ops/sec: ${Math.floor(iterations / (duration1 / 1000))}`)

// Benchmark 2: Object creation
console.log('\n=== Benchmark 2: Object Creation ===')
const objIterations = 100000
const start2 = Date.now()

const objects = []
for (let i = 0; i < objIterations; i++) {
  objects.push({
    id: i,
    name: `Object ${i}`,
    value: Math.random(),
    nested: { x: i, y: i * 2 }
  })
}

const duration2 = Date.now() - start2

console.log(`Objects created: ${objIterations}`)
console.log(`Duration: ${duration2}ms`)
console.log(`Objects/sec: ${Math.floor(objIterations / (duration2 / 1000))}`)

// Benchmark 3: String operations
console.log('\n=== Benchmark 3: String Operations ===')
const strIterations = 100000
const start3 = Date.now()

let result = ''
for (let i = 0; i < strIterations; i++) {
  result += 'x'
}

const duration3 = Date.now() - start3

console.log(`String length: ${result.length}`)
console.log(`Duration: ${duration3}ms`)
console.log(`Ops/sec: ${Math.floor(strIterations / (duration3 / 1000))}`)

// Self-test validation
if (arr.length !== iterations) {
  console.error('\n✗ FAIL: Array benchmark produced wrong length')
  Bare.exit(1)
}

if (objects.length !== objIterations) {
  console.error('\n✗ FAIL: Object benchmark produced wrong count')
  Bare.exit(1)
}

if (result.length !== strIterations) {
  console.error('\n✗ FAIL: String benchmark produced wrong length')
  Bare.exit(1)
}

console.log('\n✓ Performance benchmarks completed successfully')
console.log('Note: These are basic operations, not comprehensive benchmarks')
