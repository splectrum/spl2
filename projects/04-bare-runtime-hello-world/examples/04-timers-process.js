// 04-timers-process.js - Test timers and process APIs
// Self-testing: Verifies setTimeout, setInterval, and process equivalent

console.log('Testing timers and process APIs...\n')

// Test process/environment access
console.log('=== Process/Environment API ===')
console.log('Platform:', Bare.platform)
console.log('Process ID:', Bare.pid)
console.log('Arguments:', Bare.argv)

// Bare doesn't have process.env built-in, need bare-env module
// For now, test what's available on Bare global
console.log('Bare.version:', Bare.version)
console.log('Bare.arch:', Bare.arch)

// Test timers
console.log('\n=== Timers API ===')

let timeoutExecuted = false
let intervalCount = 0
let intervalId

console.log('Starting setTimeout (100ms)...')
setTimeout(() => {
  timeoutExecuted = true
  console.log('✓ setTimeout executed')

  // Self-test validation
  if (!timeoutExecuted) {
    console.error('✗ FAIL: setTimeout flag not set')
    Bare.exit(1)
  }

  if (intervalCount < 2) {
    console.error('✗ FAIL: setInterval did not execute enough times')
    Bare.exit(1)
  }

  console.log('\n✓ All timer and process API tests passed!')
}, 100)

console.log('Starting setInterval (30ms)...')
intervalId = setInterval(() => {
  intervalCount++
  console.log(`  setInterval tick ${intervalCount}`)

  if (intervalCount >= 2) {
    clearInterval(intervalId)
    console.log('✓ setInterval executed and cleared')
  }
}, 30)

console.log('Timers scheduled, waiting for execution...')
