// module-loader.js - Dynamic module loading for both Bare and Node
// Tests if dynamic require works on both platforms

const platform = require('./platform')

// For CommonJS, we use require with dynamic path
// Note: This is sync on Node, need to test on Bare
function loadMethod(methodPath) {
  try {
    const module = require(methodPath)
    return module
  } catch (error) {
    throw new Error(`Failed to load method from ${methodPath}: ${error.message}`)
  }
}

module.exports = { loadMethod }
