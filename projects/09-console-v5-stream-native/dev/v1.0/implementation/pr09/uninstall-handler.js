#!/usr/bin/env node
// Uninstall handler daemon - Stop gracefully

import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PID_FILE = path.join(__dirname, '../.handler-daemon.pid')

// Check if daemon is running
if (!fs.existsSync(PID_FILE)) {
  console.log('ℹ️  No handler daemon running (PID file not found)')
  process.exit(0)
}

// Read PID
const pid = parseInt(fs.readFileSync(PID_FILE, 'utf8'))

console.log(`Stopping handler daemon (PID: ${pid})...`)

try {
  // Send SIGTERM for graceful shutdown
  process.kill(pid, 'SIGTERM')

  // Wait a moment for cleanup
  setTimeout(() => {
    // Check if process still exists
    try {
      process.kill(pid, 0) // Signal 0 checks existence
      console.log('⚠️  Daemon still running, forcing shutdown...')
      process.kill(pid, 'SIGKILL')
    } catch (err) {
      // Process already stopped
    }

    // Remove PID file
    if (fs.existsSync(PID_FILE)) {
      fs.unlinkSync(PID_FILE)
    }

    console.log('✅ Handler daemon stopped')
  }, 1000)

} catch (err) {
  if (err.code === 'ESRCH') {
    console.log('⚠️  Process not found (cleaning up PID file)')
    fs.unlinkSync(PID_FILE)
  } else {
    console.error('❌ Error stopping daemon:', err.message)
    process.exit(1)
  }
}
