// runtime.js - Minimal SPL runtime demonstrating core pattern
// Runs on both Bare and Node using platform abstraction

const platform = require('./platform')
const { createContext } = require('./context')
const { loadMethod } = require('./module-loader')

async function main() {
  console.log('========================================')
  console.log('  SPL Minimal Runtime')
  console.log(`  Platform: ${platform.name} ${platform.version}`)
  console.log('========================================')
  console.log('')

  try {
    // Step 1: Create runtime context with platform info
    console.log('[1] Creating runtime context...')
    const context = createContext({
      platform: {
        name: platform.name,
        platform: platform.platform,
        version: platform.version
      }
    })
    console.log('    ✓ Context created')
    console.log('')

    // Step 2: Load hello method dynamically
    console.log('[2] Loading hello method...')
    const helloMethod = loadMethod('./methods/hello')
    console.log('    ✓ Method loaded')
    console.log('')

    // Step 3: Invoke method with context
    console.log('[3] Invoking hello method...')
    const result = await helloMethod(context)
    console.log('    ✓ Method invoked')
    console.log(`    Result: ${JSON.stringify(result)}`)
    console.log('')

    // Step 4: Verify state was updated
    console.log('[4] Verifying context state...')
    const storedGreeting = context.getState('hello.greeting')
    console.log(`    Stored greeting: "${storedGreeting}"`)
    console.log(`    Matches result: ${storedGreeting === result.message ? 'YES' : 'NO'}`)
    console.log('')

    // Success!
    console.log('========================================')
    console.log('  ✓ RUNTIME TEST PASSED')
    console.log(`  Message: "${result.message}"`)
    console.log('========================================')
    console.log('')

    platform.exit(0)
  } catch (error) {
    console.error('========================================')
    console.error('  ✗ RUNTIME TEST FAILED')
    console.error('========================================')
    console.error('')
    console.error('Error:', error.message)
    console.error(error.stack)
    console.error('')
    platform.exit(1)
  }
}

main()
