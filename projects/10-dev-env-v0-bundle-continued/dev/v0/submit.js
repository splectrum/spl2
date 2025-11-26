// Test harness - submit a request for the handler to pick up

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const REQUESTS_DIR = path.join(__dirname, 'events/requests')

// Ensure directory exists
if (!fs.existsSync(REQUESTS_DIR)) {
  fs.mkdirSync(REQUESTS_DIR, { recursive: true })
}

/**
 * Generate GUID
 */
function generateGuid() {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  return `req-${timestamp}-${random}`
}

/**
 * Generate timestamp for event filename
 */
function timestamp() {
  const now = new Date()
  return now.toISOString().replace(/[:.]/g, '-')
}

/**
 * Generate collision-safe filename
 */
function generateFilename() {
  const ts = timestamp()
  let digit = 0
  let filepath

  do {
    const filename = `${ts}-${digit}.json`
    filepath = path.join(REQUESTS_DIR, filename)
    digit++
  } while (fs.existsSync(filepath) && digit < 10)

  return filepath
}

/**
 * Submit a request
 * @param {string} uri - method URI (e.g., "pr09/console/hello")
 * @param {object} methodInput - input for the method
 * @param {object} options - ttl, etc.
 */
function submitRequest(uri, methodInput = {}, options = {}) {
  const guid = generateGuid()
  const ttl = options.ttl ?? 10

  // Build headers path from URI: pr09/console/hello -> headers.pr09.console.hello
  const parts = uri.split('/')

  const request = {
    headers: {
      spl: {
        runtime: {
          error: null,
          timestamp: new Date().toISOString()
        },
        request: {
          guid,
          completed: false,
          ttl,
          uri
        }
      }
    }
  }

  // Build nested path for method input: pr09.console.hello = methodInput
  let current = request.headers
  for (let i = 0; i < parts.length - 1; i++) {
    current[parts[i]] = current[parts[i]] || {}
    current = current[parts[i]]
  }
  current[parts[parts.length - 1]] = methodInput

  const filepath = generateFilename()

  fs.writeFileSync(filepath, JSON.stringify(request, null, 2))

  console.log(`Request submitted: ${guid}`)
  console.log(`  URI: ${uri}`)
  console.log(`  Input:`, methodInput)
  console.log(`  TTL: ${ttl}`)
  console.log(`  File: ${filepath}`)

  return guid
}

// Submit hello request
const guid = submitRequest('pr09/console/hello', { message: 'hello friend' }, { ttl: 5 })

console.log(`\nRun handler with: node handler.js`)
