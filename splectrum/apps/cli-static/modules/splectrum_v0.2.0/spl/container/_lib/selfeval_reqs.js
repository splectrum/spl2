// selfeval_reqs.js - Selfeval runner for reqs facet
//
// Checks files declared in _reqs/index.json exist,
// and req files are declared in manifest.

export function create(module) {
  return {
    async run(containerFsPath) {
      const fs = await module.require('fs')
      const path = await module.require('path')

      const reqsPath = path.join(containerFsPath, '_reqs')

      // Read reqs manifest
      let manifest
      try {
        manifest = JSON.parse(fs.readFileSync(path.join(reqsPath, 'index.json'), 'utf8'))
      } catch (e) {
        return {
          pass: true,
          topline: 'reqs | SKIP',
          summary: 'no reqs',
          files: []
        }
      }

      // Build set of declared files from requirements array
      const requirements = manifest.requirements || []
      const declaredFiles = new Set(requirements.map(r => r.file))
      const results = []

      // Check manifest → reality (declared files exist)
      for (const req of requirements) {
        let exists = false
        try {
          fs.statSync(path.join(reqsPath, req.file))
          exists = true
        } catch (e) {}

        results.push({
          name: req.name,
          pass: exists,
          topline: `${req.name} | ${exists ? 'PASS' : 'FAIL'}`,
          detail: exists ? req.description : 'file missing'
        })
      }

      // Check reality → manifest (actual files are declared)
      try {
        const actualFiles = fs.readdirSync(reqsPath)
          .filter(f => f.endsWith('.md'))

        for (const fileName of actualFiles) {
          if (!declaredFiles.has(fileName)) {
            results.push({
              name: fileName,
              pass: false,
              topline: `${fileName} | FAIL`,
              detail: 'unregistered file'
            })
          }
        }
      } catch (e) {}

      const allPass = results.every(r => r.pass)
      const passCount = results.filter(r => r.pass).length

      return {
        pass: allPass,
        topline: `reqs | ${allPass ? 'PASS' : 'FAIL'}`,
        summary: `${passCount}/${results.length} requirements`,
        files: results
      }
    }
  }
}
