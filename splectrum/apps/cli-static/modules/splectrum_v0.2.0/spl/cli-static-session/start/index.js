// spl/cli-static-session/start - Start session watchers
//
// Starts inbox→processing→outbox watchers.
// Short-TTL mode: watchers self-destruct after processing one request.
// Returns immediately - watchers run in background.

export default async function(module) {
  const nodeRoot = module.getNodeRoot()

  // Load session state
  const sessionStateTopic = "runtime/cli-static/session/state"
  const sessionState = module.consumeLatest(sessionStateTopic)

  if (!sessionState) {
    module.raiseError(`Session state not found: ${sessionStateTopic}`)
    return
  }

  const config = sessionState.headers.spl["cli-static-session"]

  // Get watchers lib
  const watchers = await module.require("lib/spl/cli-static-session/watchers.js")

  // Ensure directories exist
  const { inboxDir, processingDir, outboxDir } = watchers.ensureDirs(nodeRoot, config)

  // Start watchers (one-shot, self-destruct after processing)
  watchers.createInboxWatcher(inboxDir, processingDir)
  watchers.createOutboxWatcher(processingDir, outboxDir, module)

  // Session started - watchers running
  module.output({ started: true, config }, null)
  module.completeRequest()
}