// selfeval_api.js - Selfeval runner for api facet
//
// Checks children declared in instance.children.list exist as folders,
// and child folders are declared in the list.

export function create(module) {
  return {
    async run(containerFsPath) {
      const fs = await module.require('fs')
      const path = await module.require('path')

      // Read container identity
      let identity
      try {
        identity = JSON.parse(fs.readFileSync(path.join(containerFsPath, 'index.json'), 'utf8'))
      } catch (e) {
        return {
          pass: false,
          topline: 'api | FAIL',
          summary: 'No index.json',
          methods: []
        }
      }

      const childrenList = identity.instance?.children?.list
      if (!childrenList || childrenList.length === 0) {
        return {
          pass: true,
          topline: 'api | EMPTY',
          summary: 'No api declared',
          methods: []
        }
      }

      const results = []

      // Collect all declared methods from instance.children.list
      const declaredMethods = new Set(childrenList)

      // Check manifest → reality (declared methods exist as folders)
      for (const method of declaredMethods) {
        const methodPath = path.join(containerFsPath, method)
        let exists = false
        try {
          const stat = fs.statSync(methodPath)
          exists = stat.isDirectory()
        } catch (e) {}

        if (exists) {
          // Check for index.js
          let hasIndex = false
          try {
            fs.statSync(path.join(methodPath, 'index.js'))
            hasIndex = true
          } catch (e) {}

          results.push({
            name: method,
            pass: hasIndex,
            topline: `${method} | ${hasIndex ? 'PASS' : 'FAIL'}`,
            detail: hasIndex ? 'folder with index.js' : 'missing index.js'
          })
        } else {
          results.push({
            name: method,
            pass: false,
            topline: `${method} | FAIL`,
            detail: 'folder missing'
          })
        }
      }

      // Check reality → manifest (method folders are declared)
      try {
        const entries = fs.readdirSync(containerFsPath, { withFileTypes: true })
        for (const entry of entries) {
          if (!entry.isDirectory()) continue
          if (entry.name.startsWith('_')) continue  // Skip _lib, _reqs, etc.

          // Check if it looks like a method (has index.js)
          try {
            fs.statSync(path.join(containerFsPath, entry.name, 'index.js'))
            // It's a method folder
            if (!declaredMethods.has(entry.name)) {
              results.push({
                name: entry.name,
                pass: false,
                topline: `${entry.name} | FAIL`,
                detail: 'unregistered method'
              })
            }
          } catch (e) {
            // Not a method folder, ignore
          }
        }
      } catch (e) {}

      const allPass = results.every(r => r.pass)
      const passCount = results.filter(r => r.pass).length

      return {
        pass: allPass,
        topline: `api | ${allPass ? 'PASS' : 'FAIL'}`,
        summary: `${passCount}/${results.length} methods`,
        methods: results
      }
    }
  }
}
