// spl/cli-static-session/start - Start session watchers
//
// Pattern: create(record, { requireSpl }) returns { invoke() }
//
// Starts inbox→processing→outbox watchers.
// Short-TTL mode: watchers self-destruct after processing one request.
// Returns immediately - watchers run in background.

import fs from 'fs'
import path from 'path'

export async function create(record, { requireSpl }) {
  const spl = await requireSpl('lib/spl', record)

  return {
    async invoke() {
      const runtime = record.headers.spl.runtime
      const nodeRoot = runtime.nodeRoot

      // Load session state
      const sessionStateTopic = 'runtime/cli-static/session/state'
      const sessionState = spl.consumeLatest(sessionStateTopic)

      if (!sessionState) {
        spl.raiseError(`Session state not found: ${sessionStateTopic}`)
        return
      }

      const config = sessionState.headers.spl['cli-static-session']
      const inboxDir = path.join(nodeRoot, config.inboxRoot)
      const processingDir = path.join(nodeRoot, config.processingRoot)
      const outboxDir = path.join(nodeRoot, config.outboxRoot)

      // Ensure directories exist
      fs.mkdirSync(inboxDir, { recursive: true })
      fs.mkdirSync(processingDir, { recursive: true })
      fs.mkdirSync(outboxDir, { recursive: true })

      // Inbox → Processing watcher (one-shot)
      const inboxWatcher = fs.watch(inboxDir, (event, filename) => {
        if (event !== 'rename') return
        if (!filename?.endsWith('.json')) return
        const sourcePath = path.join(inboxDir, filename)
        if (!fs.existsSync(sourcePath)) return

        // Move to processing
        const destPath = path.join(processingDir, filename)
        fs.renameSync(sourcePath, destPath)

        // Self-destruct
        inboxWatcher.close()
      })

      // Processing → Outbox watcher (one-shot, executes request)
      const processingWatcher = fs.watch(processingDir, async (event, filename) => {
        if (event !== 'rename') return
        if (!filename?.endsWith('.json')) return
        const sourcePath = path.join(processingDir, filename)
        if (!fs.existsSync(sourcePath)) return

        // Read and parse request
        const content = fs.readFileSync(sourcePath, 'utf-8')
        const requestRecord = JSON.parse(content)
        const requestSpl = await requireSpl('lib/spl', requestRecord)

        try {
          // Execute the method
          const method = requestRecord.headers.spl.request.method
          const executable = await requireSpl(method, requestRecord)
          await executable.invoke()
        } catch (err) {
          // Set error in metaoutput
          requestSpl.output(`Error: ${err.message}`, null)
        }

        // Remove from processing
        fs.unlinkSync(sourcePath)

        // FAF result to outbox
        requestSpl.faf(outboxDir, { sync: true })

        // Self-destruct
        processingWatcher.close()
      })

      // Session started - watchers running
      spl.output({ started: true, config })
      spl.completeRequest()
    }
  }
}
