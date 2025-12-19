// spl/introspection/info/_lib/info.js - Info business logic
//
// Contains fs operations for info method.

import fs from 'fs'

export function create(module) {
  return {
    /**
     * Read JSON file, return null on error
     */
    readJson(filePath) {
      try {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'))
      } catch (e) {
        return null
      }
    }
  }
}
