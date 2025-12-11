// selfeval_children.js - Selfeval runner for child type validation
//
// Validates that child containers conform to expected types.
// Reads instanceChildren from runner meta (configured in _selfevals/index.json).
// Checks each child folder's index.json for extends/instantiates.

export function create(module) {
  return {
    async run(containerFsPath, meta) {
      const fs = await module.require('fs')
      const path = await module.require('path')

      // Get instanceChildren from runner meta
      const instanceChildren = meta?.instanceChildren
      if (!instanceChildren) {
        return {
          pass: true,
          topline: 'children | EMPTY',
          summary: 'No instanceChildren configured in runner',
          children: []
        }
      }

      // Get child folders (non-underscore, directories)
      let childFolders = []
      try {
        const entries = fs.readdirSync(containerFsPath, { withFileTypes: true })
        childFolders = entries
          .filter(e => e.isDirectory() && !e.name.startsWith('_'))
          .map(e => e.name)
      } catch (e) {
        return {
          pass: false,
          topline: 'children | FAIL',
          summary: 'Cannot read directory',
          children: []
        }
      }

      const results = []

      for (const childName of childFolders) {
        const childPath = path.join(containerFsPath, childName)

        // Read child's index.json
        let childIdentity
        try {
          childIdentity = JSON.parse(fs.readFileSync(path.join(childPath, 'index.json'), 'utf8'))
        } catch (e) {
          results.push({
            name: childName,
            pass: false,
            topline: `${childName} | FAIL`,
            detail: 'No index.json'
          })
          continue
        }

        // Check if child's instance type matches expected (instantiates = structural type)
        const childInstanceType = childIdentity.instantiates
        const matches = childInstanceType === instanceChildren

        results.push({
          name: childName,
          pass: matches,
          topline: `${childName} | ${matches ? 'PASS' : 'FAIL'}`,
          detail: matches
            ? `instantiates: ${childInstanceType}`
            : `expected ${instanceChildren}, got ${childInstanceType || 'none'}`
        })
      }

      if (results.length === 0) {
        return {
          pass: true,
          topline: 'children | PASS',
          summary: 'No children to validate',
          children: []
        }
      }

      const allPass = results.every(r => r.pass)
      const passCount = results.filter(r => r.pass).length

      return {
        pass: allPass,
        topline: `children | ${allPass ? 'PASS' : 'FAIL'}`,
        summary: `${passCount}/${results.length} children`,
        children: results
      }
    }
  }
}
