// selfeval_reqs_coverage.js - Selfeval runner for req coverage
//
// Checks that .js files have corresponding req files:
//   _lib/*.js (non-selfeval) → _reqs/<name>_lib_v*.md
//   _lib/selfeval_*.js → _reqs/selfeval_<name>_runner_v*.md
//   _selfevals/**/*.js → _reqs/selfeval_<name>_test_runner_v*.md

import fs from "fs"
import path from "path"

export function create(module) {
  return {
    async run(containerFsPath) {
      const missing = []

      const libDir = path.join(containerFsPath, "_lib")
      const selfevalDir = path.join(containerFsPath, "_selfevals")
      const reqsDir = path.join(containerFsPath, "_reqs")

      // Get list of req files for pattern matching
      let reqFiles = []
      if (fs.existsSync(reqsDir)) {
        reqFiles = fs.readdirSync(reqsDir).filter(f => f.endsWith(".md"))
      }

      // Helper: check if req exists matching pattern
      function hasReq(pattern) {
        return reqFiles.some(f => pattern.test(f))
      }

      // Check _lib/*.js files
      if (fs.existsSync(libDir)) {
        const libFiles = fs.readdirSync(libDir).filter(f => f.endsWith(".js"))

        for (const file of libFiles) {
          const name = file.replace(".js", "")

          if (name.startsWith("selfeval_")) {
            // selfeval runner: expect selfeval_<name>_runner_v*.md
            const runnerName = name.replace("selfeval_", "")
            const pattern = new RegExp(`^selfeval_${runnerName}_runner_v.*\\.md$`)
            if (!hasReq(pattern)) {
              missing.push({
                file: `_lib/${file}`,
                expectedPattern: `selfeval_${runnerName}_runner_v*.md`
              })
            }
          } else {
            // regular lib: expect <name>_lib_v*.md
            const pattern = new RegExp(`^${name}_lib_v.*\\.md$`)
            if (!hasReq(pattern)) {
              missing.push({
                file: `_lib/${file}`,
                expectedPattern: `${name}_lib_v*.md`
              })
            }
          }
        }
      }

      // Check _selfevals/**/*.js files recursively
      function scanSelfevals(dir, relPath = "") {
        if (!fs.existsSync(dir)) return

        const entries = fs.readdirSync(dir, { withFileTypes: true })
        for (const entry of entries) {
          const entryRelPath = relPath ? `${relPath}/${entry.name}` : entry.name

          if (entry.isDirectory()) {
            scanSelfevals(path.join(dir, entry.name), entryRelPath)
          } else if (entry.name.endsWith(".js")) {
            const name = entry.name.replace(".js", "")
            // expect selfeval_<name>_test_runner_v*.md
            const pattern = new RegExp(`^selfeval_${name}_test_runner_v.*\\.md$`)
            if (!hasReq(pattern)) {
              missing.push({
                file: `_selfevals/${entryRelPath}`,
                expectedPattern: `selfeval_${name}_test_runner_v*.md`
              })
            }
          }
        }
      }

      scanSelfevals(selfevalDir)

      const pass = missing.length === 0

      return {
        pass,
        topline: "reqs_coverage | " + (pass ? "PASS" : "FAIL"),
        summary: pass
          ? "all .js files have reqs"
          : `${missing.length} missing req(s)`,
        checks: missing.map(m => ({
          name: m.file,
          pass: false,
          topline: `${m.file} | FAIL`,
          detail: `missing: ${m.expectedPattern}`
        }))
      }
    }
  }
}
