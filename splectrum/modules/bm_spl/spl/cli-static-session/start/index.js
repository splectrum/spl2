// spl/cli-static-session/start - Start session watchers
//
// Starts inbox→processing→outbox watchers.
// Short-TTL mode: watchers self-destruct after processing one request.
// Returns immediately - watchers run in background.

import { loadModule } from '../../../../../lib/moduleBootstrap.js'

export default async function(module) {
  const fs = await module.require('fs')
  const path = await module.require('path')
  const nodeRoot = module.getNodeRoot()

  // Load session state
  const sessionStateTopic = 'runtime/cli-static/session/state'
  const sessionState = module.consumeLatest(sessionStateTopic)

  if (!sessionState) {
    module.raiseError(`Session state not found: ${sessionStateTopic}`)
    return
  }

  const config = sessionState.headers.spl['cli-static-session']
  const inboxDir = path.join(nodeRoot, config.inboxRoot)
  const processingDir = path.join(nodeRoot, config.processingRoot)
  const outboxDir = path.join(nodeRoot, config.outboxRoot)

  // Ensure directories exist
  fs.mkdirSync(inboxDir, { recursive: true })
  fs.mkdirSync(processingDir, { recursive: true })
  fs.mkdirSync(outboxDir, { recursive: true })

  // Get app name for module loading
  const appAPI = module.getAppAPI()
  const appName = appAPI?.replace('spl/', '')

  // Load moduleLib once for request processing
  const moduleLib = await loadModule(appName)

  // Inbox → Processing watcher (one-shot)
  const inboxWatcher = fs.watch(inboxDir, (event, filename) => {
    if (event !== 'rename') return
    if (!filename?.endsWith('.json')) return
    const sourcePath = path.join(inboxDir, filename)
    if (!fs.existsSync(sourcePath)) return

    // Move to processing
    const destPath = path.join(processingDir, filename)
    fs.renameSync(sourcePath, destPath)

    // Self-destruct
    inboxWatcher.close()
  })

  // Processing → Outbox watcher (one-shot, executes request)
  const processingWatcher = fs.watch(processingDir, async (event, filename) => {
    if (event !== 'rename') return
    if (!filename?.endsWith('.json')) return
    const sourcePath = path.join(processingDir, filename)
    if (!fs.existsSync(sourcePath)) return

    // Read and parse request
    const content = fs.readFileSync(sourcePath, 'utf-8')
    const requestRecord = JSON.parse(content)

    // Create module instance for this request
    const requestModule = moduleLib.create(requestRecord)

    try {
      // Execute the method
      const method = requestRecord.headers.spl.request.method
      const executable = await requestModule.require(method)
      await executable.invoke()
    } catch (err) {
      // Set error in metaoutput
      requestModule.output(`Error: ${err.message}`, null)
    }

    // Remove from processing
    fs.unlinkSync(sourcePath)

    // FAF result to outbox
    requestModule.faf(outboxDir, { sync: true })

    // Self-destruct
    processingWatcher.close()
  })

  // Session started - watchers running
  module.output({ started: true, config }, null)
  module.completeRequest()
}
