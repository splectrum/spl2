// 10-detection-overhead.js - Measure performance overhead of runtime detection
// Self-testing: Quantifies cost of platform detection
// Run with: bare 10-detection-overhead.js
// Run with: node 10-detection-overhead.js

console.log('Detection Overhead Benchmark\n')

const iterations = 10000000 // 10 million iterations

// Setup platform value (pre-detected once)
const isBare = typeof Bare !== 'undefined'
const platformValue = isBare ? Bare.platform : process.platform

console.log('=== Benchmark Setup ===')
console.log('Runtime:', isBare ? 'Bare' : 'Node.js')
console.log('Iterations:', iterations.toLocaleString())

// Benchmark 1: Direct access (no detection)
console.log('\n=== Benchmark 1: Direct Access (baseline) ===')
const start1 = Date.now()

let result1
for (let i = 0; i < iterations; i++) {
  result1 = platformValue
}

const duration1 = Date.now() - start1
console.log('Duration:', duration1, 'ms')
console.log('Ops/sec:', Math.floor(iterations / (duration1 / 1000)).toLocaleString())

// Benchmark 2: With detection on every call
console.log('\n=== Benchmark 2: With Detection (overhead) ===')
const start2 = Date.now()

let result2
for (let i = 0; i < iterations; i++) {
  result2 = typeof Bare !== 'undefined' ? Bare.platform : process.platform
}

const duration2 = Date.now() - start2
console.log('Duration:', duration2, 'ms')
console.log('Ops/sec:', Math.floor(iterations / (duration2 / 1000)).toLocaleString())

// Calculate overhead
const overhead = duration2 - duration1
const overheadPercent = ((overhead / duration1) * 100).toFixed(2)

console.log('\n=== Overhead Analysis ===')
console.log('Baseline:', duration1, 'ms')
console.log('With detection:', duration2, 'ms')
console.log('Overhead:', overhead, 'ms (' + overheadPercent + '%)')

// Self-test validation
if (result1 !== result2) {
  console.error('\n✗ FAIL: Results don\'t match')
  if (isBare) Bare.exit(1)
  else process.exit(1)
}

console.log('\n✓ Benchmark complete')
console.log('Conclusion: Detection overhead is', overhead < 100 ? 'negligible' : 'measurable')
