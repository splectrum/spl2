// Data operations - filesystem implementation
// Functional script for iterations 1-4
// Later: becomes spl/data API with proper module structure

const fs = require('fs')
const path = require('path')

// Base directory for events
const EVENTS_DIR = path.join(__dirname, '../events')

// Ensure events directory exists
if (!fs.existsSync(EVENTS_DIR)) {
  fs.mkdirSync(EVENTS_DIR, { recursive: true })
}

/**
 * Generate timestamp for filenames with microsecond precision
 */
function timestamp() {
  const now = new Date()
  const isoString = now.toISOString()
  const microseconds = String(now.getTime() % 1000).padStart(3, '0')
  return isoString.replace(/[:.]/g, '-').replace('Z', `-${microseconds}Z`)
}

/**
 * Ensure topic directory exists
 */
function ensureTopicDir(topic) {
  const topicDir = path.join(EVENTS_DIR, topic)
  if (!fs.existsSync(topicDir)) {
    fs.mkdirSync(topicDir, { recursive: true })
  }
  return topicDir
}

/**
 * Get all files in topic directory, sorted by timestamp (oldest first)
 */
function getTopicFiles(topic) {
  const topicDir = path.join(EVENTS_DIR, topic)
  if (!fs.existsSync(topicDir)) {
    return []
  }

  const files = fs.readdirSync(topicDir)
    .filter(f => f.endsWith('.json'))
    .sort() // Lexicographic sort works with ISO timestamps

  return files.map(f => path.join(topicDir, f))
}

/**
 * PUBLISH - Create new event (append-only)
 *
 * @param {string} topic - Topic identifier (e.g., "pipeline-123")
 * @param {object} event - Event data to publish
 * @returns {object} Published event with metadata
 */
function publish(topic, event) {
  const topicDir = ensureTopicDir(topic)

  // Add metadata if not present
  const eventWithMetadata = {
    ...event,
    metadata: {
      timestamp: new Date().toISOString(),
      topic,
      ...event.metadata
    }
  }

  // Generate filename with timestamp
  const filename = `${timestamp()}.json`
  const filepath = path.join(topicDir, filename)

  // Atomic write: temp file -> rename
  const tempPath = filepath + '.tmp'
  fs.writeFileSync(tempPath, JSON.stringify(eventWithMetadata, null, 2))
  fs.renameSync(tempPath, filepath)

  return eventWithMetadata
}

/**
 * CONSUME - Read events in order
 *
 * @param {string} topic - Topic identifier
 * @param {object} options - Options (offset, limit)
 * @returns {array} Array of events
 */
function consume(topic, options = {}) {
  const { offset = 0, limit = Infinity } = options

  const files = getTopicFiles(topic)
  const selectedFiles = files.slice(offset, offset + limit)

  return selectedFiles.map(filepath => {
    const content = fs.readFileSync(filepath, 'utf8')
    return JSON.parse(content)
  })
}

/**
 * SEEK - Jump to position in stream
 *
 * @param {string} topic - Topic identifier
 * @param {string|number} position - Position ('latest', 'first', or numeric offset)
 * @returns {object|null} Event at position, or null if not found
 */
function seek(topic, position) {
  const files = getTopicFiles(topic)

  if (files.length === 0) {
    return null
  }

  let filepath

  if (position === 'latest') {
    filepath = files[files.length - 1]
  } else if (position === 'first') {
    filepath = files[0]
  } else if (typeof position === 'number') {
    filepath = files[position]
  } else {
    throw new Error(`Invalid position: ${position}`)
  }

  if (!filepath) {
    return null
  }

  const content = fs.readFileSync(filepath, 'utf8')
  return JSON.parse(content)
}

/**
 * READ - Get latest version (convenience wrapper around seek)
 *
 * @param {string} topic - Topic identifier
 * @returns {object|null} Latest event, or null if topic empty
 */
function read(topic) {
  return seek(topic, 'latest')
}

/**
 * WRITE - Create new version (convenience wrapper around publish)
 *
 * @param {string} topic - Topic identifier
 * @param {object} data - Data to write
 * @returns {object} Published event
 */
function write(topic, data) {
  return publish(topic, data)
}

// Export operations
module.exports = {
  publish,
  consume,
  seek,
  read,
  write
}
