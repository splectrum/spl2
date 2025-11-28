// cli-static/index.js - App entry point (POC)
//
// Receives request records from CLI entry point.
// FAF to session inbox, pick from session outbox.

import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import * as faf from './scripts/faf.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Session paths
const sessionRoot = path.resolve(__dirname, '../../runtime/cli-static/requests')
const inboxDir = path.join(sessionRoot, 'inbox')
const outboxDir = path.join(sessionRoot, 'outbox')

/**
 * Handle incoming request record
 * @param {Object} requestRecord - The incoming request record
 * @returns {Object} Response
 */
export async function handleRequest(requestRecord) {
  const timestamp = requestRecord.headers.spl.request.timeReceived
  const filename = `${timestamp}.json`

  // FAF: persist to app's requests/ (audit)
  const requestsFolder = path.join(__dirname, 'requests')
  await faf.write({
    folder: requestsFolder,
    filename: filename,
    dedupe: 'numeric-digit',
    record: requestRecord
  })

  // FAF: send to session inbox
  await faf.write({
    folder: inboxDir,
    filename: filename,
    dedupe: 'numeric-digit',
    record: requestRecord
  })

  // Kick session handlers (POC: synchronous)
  const inboxHandler = await import(path.join(sessionRoot, 'scripts/inbox.js'))
  const processHandler = await import(path.join(sessionRoot, 'scripts/process.js'))

  await inboxHandler.processOne()
  await processHandler.processOne()

  // Pick from outbox
  const response = await pickFromOutbox(filename)

  return response
}

const APP_CONSUMER_ID = 'apps/cli-static'

/**
 * Pick response from outbox
 */
async function pickFromOutbox(expectedFilename) {
  const files = await fs.readdir(outboxDir).catch(() => [])
  const jsonFiles = files.filter(f => f.endsWith('.json')).sort()

  if (jsonFiles.length === 0) {
    throw new Error('No response in outbox')
  }

  // Pick first (should match our request for POC)
  const filename = jsonFiles[0]
  const filepath = path.join(outboxDir, filename)

  const content = await fs.readFile(filepath, 'utf-8')
  const record = JSON.parse(content)

  // Stamp consumer (boundary crossing back to app)
  if (!record.headers.spl.consumers) {
    record.headers.spl.consumers = []
  }
  record.headers.spl.consumers.push({
    id: APP_CONSUMER_ID,
    timestamp: Date.now()
  })

  // Remove from outbox
  await fs.unlink(filepath)

  return record
}
