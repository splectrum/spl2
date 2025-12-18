// spl/cli-static/execute - CLI Static App execute method
//
// App handler with proper inbox/outbox pattern:
// 1. Load app state
// 2. Start session (watchers running)
// 3. Handle PAC if requested (dry-run, prompt, execute)
// 4. Or: direct execution (FAF to inbox, wait on outbox)
// 5. Return result to client

import * as readline from 'readline'
import process from 'process'
import fs from 'fs'
import path from 'path'

export default async function(module) {
  const nodeRoot = module.getNodeRoot()

  // 1. Load app state
  const appAPI = 'spl/cli-static'
  const appRoot = 'apps/cli-static'
  const stateTopic = `${appRoot}/state`
  const appState = module.consumeLatest(stateTopic)

  if (!appState) {
    module.raiseError(`App state not found: ${stateTopic}`)
    return
  }

  const sessionConfig = appState.headers.spl['cli-static-session']
  const inboxDir = path.join(nodeRoot, sessionConfig.root, 'inbox')
  const outboxDir = path.join(nodeRoot, sessionConfig.root, 'outbox')

  // 2. Snapshot original record before any modifications
  const originalRecord = module.snapshotRecord()

  // 3. Start session helper (one-shot watchers)
  const sessionStart = await module.require('spl/cli-static-session/start')

  async function startSession() {
    await sessionStart.invoke()
    module.restoreRecord(originalRecord)  // Clear session pollution
  }

  // Helper: watch outbox, FAF to inbox, wait for response
  async function executeAndWait() {
    return new Promise((resolve, reject) => {
      const outboxWatcher = fs.watch(outboxDir, (event, filename) => {
        if (event !== 'rename') return
        if (!filename?.endsWith('.json')) return
        const filePath = path.join(outboxDir, filename)
        if (!fs.existsSync(filePath)) return

        try {
          const content = fs.readFileSync(filePath, 'utf-8')
          const result = JSON.parse(content)
          fs.unlinkSync(filePath)  // consume from outbox
          outboxWatcher.close()
          resolve(result)
        } catch (err) {
          outboxWatcher.close()
          reject(err)
        }
      })

      module.faf(inboxDir, { sync: true })
    })
  }

  // Helper: prompt user for confirmation
  async function promptConfirm(message) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })

    return new Promise((resolve) => {
      rl.question(message, (answer) => {
        rl.close()
        resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes')
      })
    })
  }

  // 3. Check for PAC flow
  const input = module.input()

  if (input.pac) {
    // PAC flow: dry-run → preview → confirm → execute

    // Start session, set dryRun for preview
    await startSession()
    module.setInputFlag('pac', undefined)
    module.setInputFlag('dryRun', true)

    const preview = await executeAndWait()

    // Show preview (metaoutput)
    const metaoutput = preview.headers?.spl?.request?.metaoutput
    if (metaoutput) {
      console.log('\n--- Preview ---')
      console.log(metaoutput)
      console.log('---------------\n')
    }

    // Prompt for confirmation
    const confirmed = await promptConfirm('Proceed? [y/N] ')

    if (confirmed) {
      // Restart session, restore original, set silent for actual execution
      await startSession()
      module.setInputFlag('pac', undefined)
      module.setInputFlag('silent', true)

      const result = await executeAndWait()
      module.extractOutput(result)
    } else {
      module.output('Cancelled.', null)
    }

  } else {
    // Direct execution
    await startSession()
    const result = await executeAndWait()
    module.extractOutput(result)
  }

  module.completeRequest()
}
