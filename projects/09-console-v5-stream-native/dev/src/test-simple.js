// Simple test to verify basic functionality

try {
  const { invoke } = require('./invoke.js')

  console.log('Testing invoke...')
  const requestId = invoke('3 + 5 - 2')
  console.log('Success! Request ID:', requestId)
} catch (err) {
  console.error('Error:', err.message)
  console.error(err.stack)
}
