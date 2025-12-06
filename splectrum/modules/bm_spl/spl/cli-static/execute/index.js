// spl/cli-static/execute - CLI Static App execute method
//
// Pattern: create(record, { requireSpl }) returns { invoke() }
//
// App handler with proper inbox/outbox pattern:
// 1. Load app state
// 2. Start session (watchers running)
// 3. Start outbox watcher
// 4. FAF request to session inbox
// 5. Wait for response on outbox
// 6. Return result to client

import fs from 'fs'
import path from 'path'

export async function create(record, { requireSpl }) {
  const spl = await requireSpl('lib/spl', record)

  return {
    async invoke() {
      const runtime = record.headers.spl.runtime
      const nodeRoot = runtime.nodeRoot

      // 1. Load app state
      const appAPI = 'spl/cli-static'
      const appRoot = 'apps/cli-static'
      const stateTopic = `${appRoot}/state`
      const appState = spl.consumeLatest(stateTopic)

      if (!appState) {
        spl.raiseError(`App state not found: ${stateTopic}`)
        return
      }

      // Set up headers from app state
      record.headers.spl['cli-static'] = appState.headers.spl['cli-static']
      record.headers.spl['cli-static-session'] = appState.headers.spl['cli-static-session']

      // Set runtime
      runtime.appAPI = appAPI
      runtime.sessionAPI = 'spl/cli-static-session'

      // Get session paths from app state
      const sessionConfig = appState.headers.spl['cli-static-session']
      const inboxDir = path.join(nodeRoot, sessionConfig.root, 'inbox')
      const outboxDir = path.join(nodeRoot, sessionConfig.root, 'outbox')

      // 2. Start session (watchers running in background)
      const sessionStart = await requireSpl('spl/cli-static-session/start', record)
      await sessionStart.invoke()

      // 3. Start outbox watcher (app's responsibility)
      const resultPromise = new Promise((resolve, reject) => {
        const outboxWatcher = fs.watch(outboxDir, (event, filename) => {
          if (event !== 'rename') return
          if (!filename?.endsWith('.json')) return
          const filePath = path.join(outboxDir, filename)
          if (!fs.existsSync(filePath)) return

          try {
            const content = fs.readFileSync(filePath, 'utf-8')
            const result = JSON.parse(content)
            fs.unlinkSync(filePath)  // consume from outbox
            outboxWatcher.close()
            resolve(result)
          } catch (err) {
            outboxWatcher.close()
            reject(err)
          }
        })
      })

      // 4. FAF request to session inbox
      spl.faf(inboxDir, { sync: true })

      // 5. Wait for response on outbox
      const result = await resultPromise

      // 6. Return result - extract output pair from session response
      spl.extractOutput(result)
      spl.completeRequest()
    }
  }
}
