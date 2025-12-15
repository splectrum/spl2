// spl/app/execute - Base app execute method
//
// Pattern: create(record, { requireSpl }) returns { invoke() }
//
// 1. Load app state from app.json
// 2. Merge request (spl.runtime, spl.request) into app record
// 3. Execute handler (override in derived apps)

import fs from 'fs'
import path from 'path'

export async function create(record, { requireSpl }) {
  const spl = await requireSpl('lib/spl', record)

  return {
    async invoke() {
      const input = spl.input()
      const runtime = record.headers.spl.runtime
      const request = record.headers.spl.request

      // 1. Load app state
      const appRoot = input.appRoot || request.handler?.appRoot
      if (!appRoot) {
        throw new Error('spl/app/execute: appRoot required in input or handler')
      }

      const appJsonPath = path.join(runtime.nodeRoot, appRoot, 'app.json')
      const appState = JSON.parse(fs.readFileSync(appJsonPath, 'utf-8'))

      // 2. Merge request into app record
      appState.headers.spl.runtime = runtime
      appState.headers.spl.request = request

      // Set app context on runtime
      runtime.appRoot = appState.headers.spl.app.appRoot
      runtime.sessionRoot = appState.headers.spl.app.sessionRoot

      // 3. Handler - base implementation does nothing, override in derived
      // Derived apps call: await base.execute() then do their handling

      spl.output({
        executed: true,
        app: appState.headers.spl.app.name,
        appRoot: runtime.appRoot,
        sessionRoot: runtime.sessionRoot
      })
      spl.completeRequest()
    }
  }
}
