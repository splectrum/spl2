// spl/cli-static-session/_lib/watchers.js - Session watcher creators
//
// Provides factory for creating inbox and outbox watchers.
// Handles: directory setup, file watching, request processing.

import fs from "fs"
import path from "path"

export function create(module) {
  return {
    /**
     * Ensure session directories exist.
     *
     * @param {string} nodeRoot - Node root path
     * @param {object} config - Session config with inboxRoot, processingRoot, outboxRoot
     * @returns {{ inboxDir: string, processingDir: string, outboxDir: string }}
     */
    ensureDirs(nodeRoot, config) {
      const inboxDir = path.join(nodeRoot, config.inboxRoot)
      const processingDir = path.join(nodeRoot, config.processingRoot)
      const outboxDir = path.join(nodeRoot, config.outboxRoot)

      fs.mkdirSync(inboxDir, { recursive: true })
      fs.mkdirSync(processingDir, { recursive: true })
      fs.mkdirSync(outboxDir, { recursive: true })

      return { inboxDir, processingDir, outboxDir }
    },

    /**
     * Create inbox watcher - moves files from inbox to processing.
     * One-shot: self-destructs after processing one file.
     *
     * @param {string} inboxDir - Inbox directory path
     * @param {string} processingDir - Processing directory path
     * @returns {fs.FSWatcher} The watcher instance
     */
    createInboxWatcher(inboxDir, processingDir) {
      const watcher = fs.watch(inboxDir, (event, filename) => {
        if (event !== "rename") return
        if (!filename?.endsWith(".json")) return
        const sourcePath = path.join(inboxDir, filename)
        if (!fs.existsSync(sourcePath)) return

        // Move to processing
        const destPath = path.join(processingDir, filename)
        fs.renameSync(sourcePath, destPath)

        // Self-destruct
        watcher.close()
      })

      return watcher
    },

    /**
     * Create outbox watcher - processes files and outputs to outbox.
     * One-shot: self-destructs after processing one file.
     *
     * @param {string} processingDir - Processing directory path
     * @param {string} outboxDir - Outbox directory path
     * @param {object} parentModule - Parent module for creating request modules
     * @returns {fs.FSWatcher} The watcher instance
     */
    createOutboxWatcher(processingDir, outboxDir, parentModule) {
      const watcher = fs.watch(processingDir, async (event, filename) => {
        if (event !== "rename") return
        if (!filename?.endsWith(".json")) return
        const sourcePath = path.join(processingDir, filename)
        if (!fs.existsSync(sourcePath)) return

        // Read and parse request
        const content = fs.readFileSync(sourcePath, "utf-8")
        const requestRecord = JSON.parse(content)

        // Create module instance for this request
        const requestModule = await parentModule.createForRecord(requestRecord)

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
        watcher.close()
      })

      return watcher
    }
  }
}