// apps/cli-static/spl.mjs - CLI Static App entry point
//
// Thin shell - wires app module to entry point framework.
// Uses session-based handler (FAF → session → outbox consumer)

import { entryPoint } from '../../lib/entryPoint.js'
import * as app from './app.mjs'

// Override handle to use session pipeline
const sessionApp = {
  name: app.name,
  help: app.help,
  handle: app.handleViaSession
}

export const { handle } = entryPoint(sessionApp, import.meta.url)
