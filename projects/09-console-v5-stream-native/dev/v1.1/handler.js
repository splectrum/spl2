// Dumb free handler - executes request records until complete or TTL
// No domain logic - just loop, invoke method, check termination

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const EVENTS_DIR = path.join(__dirname, 'events')
const REQUESTS_DIR = path.join(EVENTS_DIR, 'requests')

// Ensure directories exist
if (!fs.existsSync(REQUESTS_DIR)) {
  fs.mkdirSync(REQUESTS_DIR, { recursive: true })
}

/**
 * Generate timestamp for event filename
 */
function timestamp() {
  const now = new Date()
  return now.toISOString().replace(/[:.]/g, '-')
}

/**
 * Fire new event (append-only, collision-safe)
 */
function fireEvent(record) {
  const ts = timestamp()
  let digit = 0
  let filepath

  // Find unused filename by incrementing digit
  do {
    const filename = `${ts}-${digit}.json`
    filepath = path.join(REQUESTS_DIR, filename)
    digit++
  } while (fs.existsSync(filepath) && digit < 10)

  fs.writeFileSync(filepath, JSON.stringify(record, null, 2))
  return filepath
}

/**
 * Get pending request files (not yet complete)
 */
function getPendingRequests() {
  if (!fs.existsSync(REQUESTS_DIR)) return []

  return fs.readdirSync(REQUESTS_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => path.join(REQUESTS_DIR, f))
}

/**
 * Load method handler by URI
 * URI format: pr09/console/hello
 */
async function loadMethod(uri) {
  const methodPath = path.join(__dirname, 'modules/work_module', uri, 'index.js')

  if (!fs.existsSync(methodPath)) {
    throw new Error(`Method not found: ${uri} (looked in ${methodPath})`)
  }

  const module = await import(methodPath)
  return module.handle
}

/**
 * Process a single request record
 */
async function processRequest(requestFile) {
  const content = fs.readFileSync(requestFile, 'utf8')
  const record = JSON.parse(content)

  const { spl } = record.headers
  const { uri, ttl, completed } = spl.request

  console.log(`\n[${new Date().toISOString()}] Processing request`)
  console.log(`  URI: ${uri}`)
  console.log(`  TTL: ${ttl}`)

  // Check if already complete
  if (completed) {
    console.log(`  ✓ Already complete - skipping`)
    return false // Stop processing
  }

  // Check TTL
  if (ttl <= 0) {
    console.log(`  ✗ TTL expired - stopping`)
    spl.runtime.error = 'TTL expired'
    spl.request.completed = true
    fireEvent(record)
    return false // Stop processing
  }

  // Decrement TTL
  spl.request.ttl = ttl - 1

  // Load and invoke method
  try {
    const handle = await loadMethod(uri)
    handle(record)

    // Update timestamp
    spl.runtime.timestamp = new Date().toISOString()

    // Log result
    if (spl.runtime.error) {
      console.log(`  ✗ Error: ${spl.runtime.error}`)
    } else if (spl.request.completed) {
      console.log(`  ✓ Complete`)
    } else {
      console.log(`  → Pending - will continue`)
    }

    // Fire and forget - write new event
    fireEvent(record)

    // Return whether to continue
    return !spl.request.completed

  } catch (err) {
    spl.runtime.error = err.message
    spl.request.completed = true
    spl.runtime.timestamp = new Date().toISOString()
    fireEvent(record)
    console.log(`  ✗ Exception: ${err.message}`)
    return false
  }
}

/**
 * Handler loop - process all pending requests
 */
async function runHandler() {
  console.log('=== Dumb Handler Started ===')
  console.log(`Events dir: ${EVENTS_DIR}`)

  const requestFiles = getPendingRequests()

  if (requestFiles.length === 0) {
    console.log('No pending requests')
    return
  }

  for (const requestFile of requestFiles) {
    let shouldContinue = true

    while (shouldContinue) {
      shouldContinue = await processRequest(requestFile)
    }
  }

  console.log('\n=== Handler Complete ===')
}

// Run if executed directly
runHandler().catch(console.error)
