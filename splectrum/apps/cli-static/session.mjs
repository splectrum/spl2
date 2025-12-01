// apps/cli-static/session.mjs - Session entry point
//
// Starts inbox→processing and processing→outbox watchers.
// Single-event mode: each watcher handles one event then stops.

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { requireSpl } from '../../lib/moduleBootstrap.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const sessionRoot = path.resolve(__dirname, '../../runtime/cli-static/requests')

const inboxDir = path.join(sessionRoot, 'inbox')
const processingDir = path.join(sessionRoot, 'processing')
const outboxDir = path.join(sessionRoot, 'outbox')

/**
 * Start session watchers
 * @returns {{ stop: Function }} Handle to stop all watchers
 */
export function startSession() {
  const watchers = []

  // Inbox → Processing watcher (move only)
  const inboxWatcher = fs.watch(inboxDir, (event, filename) => {
    if (event !== 'rename') return
    if (!filename?.endsWith('.json')) return

    const sourcePath = path.join(inboxDir, filename)
    if (!fs.existsSync(sourcePath)) return

    // Move to processing
    const destPath = path.join(processingDir, filename)
    fs.renameSync(sourcePath, destPath)
  })
  watchers.push(inboxWatcher)

  // Processing → Outbox watcher (execute request)
  const processingWatcher = fs.watch(processingDir, async (event, filename) => {
    if (event !== 'rename') return
    if (!filename?.endsWith('.json')) return

    const sourcePath = path.join(processingDir, filename)
    if (!fs.existsSync(sourcePath)) return

    try {
      // Read and parse record
      const content = fs.readFileSync(sourcePath, 'utf-8')
      const record = JSON.parse(content)

      // Execute via unified requireSpl
      const method = record.headers.spl.request.method
      const executable = await requireSpl(method, record)
      await executable.invoke()

      // Remove from processing
      fs.unlinkSync(sourcePath)

      // FAF result to outbox
      const spl = await requireSpl('lib/spl', record)
      spl.faf(outboxDir, { sync: true })
    } catch (err) {
      console.error(`Session error processing ${filename}:`, err.message)
    }
  })
  watchers.push(processingWatcher)

  return {
    stop() {
      for (const w of watchers) {
        w.close()
      }
    }
  }
}
