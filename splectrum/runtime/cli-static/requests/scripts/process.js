// process.js - Processing handler (POC)
//
// Kicks processing steps until complete, moves to outbox.
// Simple put-through: no actual execution, just move.

import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import * as faf from './faf.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const processingDir = path.join(__dirname, '..', 'processing')
const outboxDir = path.join(__dirname, '..', 'outbox')

/**
 * Process one request from processing folder
 * @returns {Object|null} The request moved to outbox, or null if processing empty
 */
export async function processOne() {
  // List processing
  const files = await fs.readdir(processingDir).catch(() => [])
  const jsonFiles = files.filter(f => f.endsWith('.json')).sort()

  if (jsonFiles.length === 0) {
    return null
  }

  // Pick first (oldest)
  const filename = jsonFiles[0]
  const filepath = path.join(processingDir, filename)

  // Read request
  const content = await fs.readFile(filepath, 'utf-8')
  const record = JSON.parse(content)

  // POC: no actual processing, just pass through
  // Later: execute method, transform record

  // FAF to outbox
  await faf.write({
    folder: outboxDir,
    filename: filename,
    dedupe: 'numeric-digit',
    record: record
  })

  // Remove from processing
  await fs.unlink(filepath)

  return { filename, record }
}
