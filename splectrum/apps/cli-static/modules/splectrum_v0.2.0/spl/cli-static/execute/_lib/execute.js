// execute.js - CLI Static execute helpers
//
// Provides inbox/outbox execution and user prompts.

import * as readline from 'readline'
import process from 'process'
import fs from 'fs'
import path from 'path'

export function create(module) {
  return {
    // Watch outbox, FAF to inbox, wait for response
    executeAndWait(inboxDir, outboxDir) {
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
    },

    // Prompt user for confirmation
    promptConfirm(message) {
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
    },

    // Build inbox/outbox paths from session config
    buildPaths(nodeRoot, sessionConfig) {
      return {
        inboxDir: path.join(nodeRoot, sessionConfig.root, 'inbox'),
        outboxDir: path.join(nodeRoot, sessionConfig.root, 'outbox')
      }
    }
  }
}
