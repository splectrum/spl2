// apps/cli-static/spl.mjs - CLI Static App entry point
//
// Thin shell - wires app module to entry point framework.

import { entryPoint } from '../../lib/entryPoint.js'
import * as app from './app.mjs'

export const { handle } = entryPoint(app, import.meta.url)
