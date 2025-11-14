// context.js - Simplified context structure from Project 03
// Provides state management for runtime execution

function createContext(initialState = {}) {
  const state = { ...initialState }

  return {
    // Read state
    getState: (key) => {
      const keys = key.split('.')
      let value = state
      for (const k of keys) {
        value = value?.[k]
        if (value === undefined) return undefined
      }
      return value
    },

    // Write state
    setState: (key, value) => {
      const keys = key.split('.')
      const lastKey = keys.pop()
      let target = state

      for (const k of keys) {
        if (!target[k]) target[k] = {}
        target = target[k]
      }

      target[lastKey] = value
    },

    // Get entire state (for debugging)
    getAll: () => state
  }
}

module.exports = { createContext }
