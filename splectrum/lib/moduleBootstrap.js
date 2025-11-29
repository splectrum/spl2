// moduleBootstrap.js - Bootstrap for requiring splectrum libs and modules
//
// Single function: requireSpl(uri, record) → bound object

import * as cliModule from './cli.js'

const libs = {
  'lib/cli': cliModule
}

/**
 * Require a splectrum lib or module
 * @param {string} uri - 'lib/cli', 'lib/core', or method path
 * @param {Object} record - Record to bind
 * @returns {Object} - Bound object
 */
export function requireSpl(uri, record) {
  const mod = libs[uri]
  if (!mod) {
    throw new Error(`Unknown: ${uri}`)
  }
  return mod.create(record)
}
