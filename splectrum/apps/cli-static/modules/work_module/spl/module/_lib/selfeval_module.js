// selfeval_module.js - Selfeval runner for module.js implementation
//
// Validates that _lib/module.js exists, exports create(), and the
// created instance has all documented methods per module_lib_v1.0.0.md.
//
// Note: This runner validates instances, not the type. If run on spl/module
// itself (the type definition), it skips since types define contracts, not implementations.

export function create(module) {
  return {
    async run(containerFsPath) {
      const fs = await module.require('fs')
      const path = await module.require('path')

      // Read index.json to get container name
      const indexPath = path.join(containerFsPath, 'index.json')
      let containerName = null
      try {
        const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'))
        containerName = index.name
      } catch (e) {
        // If can't read, continue with validation
      }

      // Skip if running on the type itself (spl/module) - types define contracts, not implementations
      if (containerName === 'spl/module') {
        return {
          pass: true,
          topline: 'module | SKIP',
          summary: 'Type definition - implementation validated on instances',
          checks: []
        }
      }

      const modulePath = path.join(containerFsPath, '_lib/module.js')

      // Check file exists
      if (!fs.existsSync(modulePath)) {
        return {
          pass: false,
          topline: 'module | FAIL',
          summary: 'File missing: _lib/module.js',
          checks: []
        }
      }

      // Load and check exports
      let moduleLib
      try {
        moduleLib = await import(modulePath)
      } catch (e) {
        return {
          pass: false,
          topline: 'module | FAIL',
          summary: `Cannot load module.js: ${e.message}`,
          checks: []
        }
      }

      if (typeof moduleLib.create !== 'function') {
        return {
          pass: false,
          topline: 'module | FAIL',
          summary: 'module.js does not export create() function',
          checks: []
        }
      }

      // Create instance with mock record to check methods
      const mockRecord = {
        headers: {
          spl: {
            request: {
              input: {},
              timeReceived: Date.now()
            },
            runtime: {
              nodeRoot: null
            }
          }
        }
      }

      let instance
      try {
        instance = moduleLib.create(mockRecord)
      } catch (e) {
        return {
          pass: false,
          topline: 'module | FAIL',
          summary: `create() threw: ${e.message}`,
          checks: []
        }
      }

      // Required methods per module_lib_v1.0.0.md
      const requiredMethods = [
        'input',
        'setInputFlag',
        'output',
        'getMetaLevel',
        'getReportLevel',
        'getDetailLevel',
        'extractOutput',
        'snapshotRecord',
        'restoreRecord',
        'require',
        'resolve',
        'faf',
        'consumeLatest',
        'getRecordId',
        'getMethod',
        'raiseError',
        'raiseAsyncError',
        'completeRequest',
        'getNodeRoot',
        'getAppAPI'
      ]

      const checks = []
      for (const method of requiredMethods) {
        const exists = typeof instance[method] === 'function'
        checks.push({
          name: method,
          pass: exists,
          topline: `${method} | ${exists ? 'PASS' : 'FAIL'}`,
          detail: exists ? 'method exists' : 'method missing'
        })
      }

      const allPass = checks.every(c => c.pass)
      const passCount = checks.filter(c => c.pass).length

      return {
        pass: allPass,
        topline: `module | ${allPass ? 'PASS' : 'FAIL'}`,
        summary: `${passCount}/${checks.length} methods`,
        checks
      }
    }
  }
}
