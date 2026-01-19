// spl/cli-static/execute - CLI Static App execute method
//
// App handler with proper inbox/outbox pattern:
// 1. Load app state
// 2. FAF request to audit topic (entrance)
// 3. Start session (watchers running)
// 4. Handle PAC if requested (dry-run, prompt, execute)
// 5. Or: direct execution (FAF to inbox, wait on outbox)
// 6. FAF response to audit topic (exit)
// 7. Return result to client

export default async function(module) {
  const exec = await module.require('lib/spl/cli-static/execute')
  const nodeRoot = module.getNodeRoot()

  // 1. Load app state
  const appRoot = 'apps/cli-static'
  const stateTopic = `${appRoot}/state`
  const requestsTopic = `${appRoot}/requests`
  const appState = module.consumeLatest(stateTopic)

  if (!appState) {
    module.raiseError(`App state not found: ${stateTopic}`)
    return
  }

  const sessionConfig = appState.headers.spl['cli-static-session']
  const { inboxDir, outboxDir } = exec.buildPaths(nodeRoot, sessionConfig)

  // 2. FAF request record (entrance)
  const timestamp = module.getMetaData().spl.request.timeReceived
  module.faf(requestsTopic, { sync: true })

  // 3. Snapshot original record before any modifications
  const originalRecord = module.snapshotRecord()

  // 4. Start session helper (one-shot watchers)
  const sessionStart = await module.require('spl/cli-static-session/start')

  async function startSession() {
    await sessionStart.invoke()
    module.restoreRecord(originalRecord)  // Clear session pollution
  }

  // 5. Check for PAC flow
  const input = module.input()

  if (input.pac) {
    // PAC flow: dry-run → preview → confirm → execute

    // Start session, set dryRun for preview
    await startSession()
    module.setInputFlag('pac', undefined)
    module.setInputFlag('dryRun', true)

    const preview = await exec.executeAndWait(inboxDir, outboxDir)

    // Show preview (metaoutput)
    const metaoutput = preview.headers?.spl?.request?.metaoutput
    if (metaoutput) {
      console.log('\n--- Preview ---')
      console.log(metaoutput)
      console.log('---------------\n')
    }

    // Prompt for confirmation
    const confirmed = await exec.promptConfirm('Proceed? [y/N] ')

    if (confirmed) {
      // Restart session, restore original, set silent for actual execution
      await startSession()
      module.setInputFlag('pac', undefined)
      module.setInputFlag('silent', true)

      const result = await exec.executeAndWait(inboxDir, outboxDir)
      module.extractOutput(result)
    } else {
      module.output('Cancelled.', null)
    }

  } else {
    // Direct execution
    await startSession()
    const result = await exec.executeAndWait(inboxDir, outboxDir)
    module.extractOutput(result)
  }

  // 6. FAF response record (exit)
  module.faf(requestsTopic, { sync: true, filename: `${timestamp}.response.json` })

  module.completeRequest()
}
