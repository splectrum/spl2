// selfeval_handler.js - Selfeval runner for handler facet
//
// Checks index.js exists (via overlay), exports a function,
// and uses only module.require() for dependencies (no direct imports).

import fs from "fs"
import path from "path"

export function create(module) {
  return {
    async run(containerFsPath) {

      // Get container path from filesystem path
      const indexJson = JSON.parse(fs.readFileSync(path.join(containerFsPath, "index.json"), "utf8"))
      const containerPath = indexJson.name

      // Resolve index.js through overlay (inherits from parent types)
      const handlerPath = module.resolve(containerPath, "index.js")

      // Check file exists
      let content
      if (!handlerPath) {
        return {
          pass: false,
          topline: "handler | FAIL",
          summary: "No index.js",
          checks: []
        }
      }

      try {
        content = fs.readFileSync(handlerPath, "utf8")
      } catch (e) {
        return {
          pass: false,
          topline: "handler | FAIL",
          summary: "No index.js",
          checks: []
        }
      }

      const checks = []

      // Check exports a function (default export, create pattern, or module.exports)
      const hasDefaultExport = /export\s+default\s+(async\s+)?function/.test(content)
      const hasCreateExport = /export\s+(async\s+)?function\s+create\s*\(/.test(content)
      const hasModuleExports = /module\.exports\s*=\s*(async\s+)?function/.test(content)
      const hasExport = hasDefaultExport || hasCreateExport || hasModuleExports

      checks.push({
        name: "export",
        pass: hasExport,
        topline: "export | " + (hasExport ? "PASS" : "FAIL"),
        detail: hasExport ? "exports function" : "no function export found"
      })

      // Check no import statements (must use module.require)
      const importMatches = content.match(/^import\s+.+\s+from\s+['"].+['"]/gm) || []
      const hasImports = importMatches.length > 0

      checks.push({
        name: "no-imports",
        pass: !hasImports,
        topline: "no-imports | " + (!hasImports ? "PASS" : "FAIL"),
        detail: hasImports ? `found ${importMatches.length} import(s): ${importMatches.join(', ')}` : "no import statements"
      })

      // Check no direct require() calls (must use module.require)
      // Match require('...') but not module.require('...')
      const requirePattern = /(?<!module\.)require\s*\(\s*['"][^'"]+['"]\s*\)/g
      const requireMatches = content.match(requirePattern) || []
      const hasDirectRequire = requireMatches.length > 0

      checks.push({
        name: "no-require",
        pass: !hasDirectRequire,
        topline: "no-require | " + (!hasDirectRequire ? "PASS" : "FAIL"),
        detail: hasDirectRequire ? `found ${requireMatches.length} require(s): ${requireMatches.join(', ')}` : "no direct require calls"
      })

      const allPass = checks.every(c => c.pass)
      const passCount = checks.filter(c => c.pass).length

      return {
        pass: allPass,
        topline: "handler | " + (allPass ? "PASS" : "FAIL"),
        summary: passCount + "/" + checks.length + " checks",
        checks: checks
      }
    }
  }
}
