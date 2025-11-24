#!/usr/bin/env node
// Install handler daemon - Start queue watcher + handler

const path = require('path')
const fs = require('fs')
const { createDaemon } = require('./daemon-core-v2.js')
const { processRequest } = require('./iteration-1-handler-v2.js')

const REQUEST_DIR = path.join(__dirname, '../events/request')
const PID_FILE = path.join(__dirname, '../.handler-daemon.pid')

// Create and start the daemon
const daemon = createDaemon({
  requestDir: REQUEST_DIR,
  processEvent: processRequest,
  pollInterval: 100
})

// Check if already running
if (fs.existsSync(PID_FILE)) {
  console.error('❌ Handler daemon already running (PID file exists)')
  console.error(`   Remove ${PID_FILE} if this is incorrect`)
  process.exit(1)
}

// Save PID
fs.writeFileSync(PID_FILE, String(process.pid))

// Start daemon
daemon.start()

// Handle graceful shutdown
function shutdown() {
  daemon.stop()

  // Remove PID file
  if (fs.existsSync(PID_FILE)) {
    fs.unlinkSync(PID_FILE)
  }

  process.exit(0)
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)

console.log(`✅ Handler daemon installed (PID: ${process.pid})`)
console.log(`   Run 'node uninstall-handler.js' to stop`)
