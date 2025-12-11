// selfeval_lib.js - Selfeval runner for lib facet
//
// Compares manifest exports vs actual exports for each lib file.
// Checks both directions: declared exist, and existing are declared.

export function create(module) {
  return {
    async run(containerFsPath) {
      const fs = await module.require('fs')
      const path = await module.require('path')

      const libPath = path.join(containerFsPath, '_lib')

      // Read lib manifest
      const manifestPath = path.join(libPath, 'index.json')
      let manifest
      try {
        manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
      } catch (e) {
        return {
          pass: true,
          topline: 'lib | EMPTY',
          summary: 'No _lib/index.json',
          files: []
        }
      }

      const manifestFiles = manifest.files || {}
      const results = []

      // Check manifest → reality (declared files/exports exist)
      for (const [fileName, fileMeta] of Object.entries(manifestFiles)) {
        const expected = fileMeta.exports || []

        // Read actual file
        let fileExists = true
        let content = ''
        try {
          content = fs.readFileSync(path.join(libPath, fileName), 'utf8')
        } catch (e) {
          fileExists = false
        }

        if (!fileExists) {
          results.push({
            name: fileName,
            pass: false,
            topline: `${fileName} | FAIL`,
            detail: 'file missing'
          })
          continue
        }

        // Skip export checking if no exports declared (single function files)
        if (expected.length === 0) {
          results.push({
            name: fileName,
            pass: true,
            topline: `${fileName} | PASS`,
            detail: 'file exists'
          })
          continue
        }

        // Check exports
        const actual = extractExports(content)
        const missing = expected.filter(e => !actual.includes(e))
        const extra = actual.filter(a => !expected.includes(a))
        const pass = missing.length === 0 && extra.length === 0

        const result = {
          name: fileName,
          pass,
          topline: `${fileName} | ${pass ? 'PASS' : 'FAIL'}`,
          detail: `${actual.length}/${expected.length} exports, missing(${missing.length}), extra(${extra.length})`
        }

        if (missing.length > 0 || extra.length > 0) {
          const parts = []
          if (missing.length > 0) parts.push(`missing: ${missing.join(', ')}`)
          if (extra.length > 0) parts.push(`extra: ${extra.join(', ')}`)
          result.enriched = parts.join('\n')
        }

        results.push(result)
      }

      // Check reality → manifest (actual files are declared)
      try {
        const actualFiles = fs.readdirSync(libPath)
          .filter(f => f.endsWith('.js'))

        for (const fileName of actualFiles) {
          if (!manifestFiles[fileName]) {
            results.push({
              name: fileName,
              pass: false,
              topline: `${fileName} | FAIL`,
              detail: 'unregistered file'
            })
          }
        }
      } catch (e) {
        // Can't read directory
      }

      const allPass = results.every(r => r.pass)
      const passCount = results.filter(r => r.pass).length

      return {
        pass: allPass,
        topline: `lib | ${allPass ? 'PASS' : 'FAIL'}`,
        summary: `${passCount}/${results.length} files`,
        files: results
      }
    }
  }
}

// Extract exports from source - either ES6 exports or methods in create() return object
function extractExports(content) {
  const exports = []

  // Check if this is a create() pattern lib
  const hasCreatePattern = /^export\s+function\s+create\s*\(/m.test(content)

  if (hasCreatePattern) {
    // Libs with `export function create(module)` pattern - extract instance methods from return block
    // Find the FINAL return { ... } at function end (indented by 2 spaces)
    const returnMatch = content.match(/^  return \{([\s\S]*?)^  \}/m)
    if (returnMatch) {
      const returnBlock = returnMatch[1]
      // Method shorthand: name() { or async name() { - must start with proper indent (4+ spaces)
      // Exclude JS keywords that look like method calls
      const jsKeywords = ['if', 'for', 'while', 'switch', 'catch', 'with']
      const methodMatches = returnBlock.matchAll(/^\s{4,}(?:async\s+)?(\w+)\s*\([^)]*\)\s*\{/gm)
      for (const match of methodMatches) {
        if (!jsKeywords.includes(match[1])) {
          exports.push(match[1])
        }
      }
    }
    // If no methods found, it's a single-method lib - export is 'create'
    if (exports.length === 0) {
      exports.push('create')
    }
  } else {
    // Standard ES6 exports

    // export function name
    const funcMatches = content.matchAll(/^export\s+(?:async\s+)?function\s+(\w+)/gm)
    for (const match of funcMatches) {
      exports.push(match[1])
    }

    // export const name
    const constMatches = content.matchAll(/^export\s+const\s+(\w+)/gm)
    for (const match of constMatches) {
      exports.push(match[1])
    }

    // export { name1, name2 }
    const namedMatches = content.matchAll(/^export\s*\{([^}]+)\}/gm)
    for (const match of namedMatches) {
      const names = match[1].split(',').map(n => n.trim().split(/\s+as\s+/)[0].trim())
      exports.push(...names)
    }

    // export default - track as 'default'
    if (/^export\s+default/m.test(content)) {
      exports.push('default')
    }
  }

  return [...new Set(exports)]
}
