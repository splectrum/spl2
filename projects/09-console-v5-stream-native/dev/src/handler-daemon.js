// Handler daemon - Iteration 1
// Combines daemon-core with iteration-1-handler

const path = require('path')
const { createDaemon } = require('./daemon-core.js')
const { processRequest } = require('./iteration-1-handler.js')

const REQUEST_DIR = path.join(__dirname, '../events/request')

// Create and start the daemon
const daemon = createDaemon({
  requestDir: REQUEST_DIR,
  processEvent: processRequest,
  pollInterval: 100
})

// Start the daemon if this is the main module
if (require.main === module) {
  daemon.start()

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    daemon.stop()
    process.exit(0)
  })
}

module.exports = daemon
