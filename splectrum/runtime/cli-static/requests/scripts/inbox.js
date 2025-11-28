// inbox.js - Inbox consumer (POC)
//
// Consumes requests from inbox, moves to processing.
// Stamps consumer ID on boundary crossing.

import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import * as faf from './faf.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const CONSUMER_ID = 'runtime/cli-static'

const inboxDir = path.join(__dirname, '..', 'inbox')
const processingDir = path.join(__dirname, '..', 'processing')

/**
 * Consume one request from inbox
 * @returns {Object|null} The request moved to processing, or null if inbox empty
 */
export async function processOne() {
  // List inbox
  const files = await fs.readdir(inboxDir).catch(() => [])
  const jsonFiles = files.filter(f => f.endsWith('.json')).sort()

  if (jsonFiles.length === 0) {
    return null
  }

  // Pick first (oldest)
  const filename = jsonFiles[0]
  const filepath = path.join(inboxDir, filename)

  // Read request
  const content = await fs.readFile(filepath, 'utf-8')
  const record = JSON.parse(content)

  // Stamp consumer (boundary crossing)
  if (!record.headers.spl.consumers) {
    record.headers.spl.consumers = []
  }
  record.headers.spl.consumers.push({
    id: CONSUMER_ID,
    timestamp: Date.now()
  })

  // FAF to processing
  await faf.write({
    folder: processingDir,
    filename: filename,
    dedupe: 'numeric-digit',
    record: record
  })

  // Remove from inbox
  await fs.unlink(filepath)

  return { filename, record }
}
