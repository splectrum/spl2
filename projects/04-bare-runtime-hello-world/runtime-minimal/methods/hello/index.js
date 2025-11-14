// methods/hello/index.js - Simple hello world method
// Follows SPL method pattern: receives context, returns result

async function hello(context) {
  const runtime = context.getState('platform.name')
  const platform = context.getState('platform.platform')

  // Store greeting in context (simulating API state)
  const greeting = `Hello from SPL on ${runtime} (${platform})!`
  context.setState('hello.greeting', greeting)

  return {
    message: greeting,
    timestamp: new Date().toISOString()
  }
}

module.exports = hello
