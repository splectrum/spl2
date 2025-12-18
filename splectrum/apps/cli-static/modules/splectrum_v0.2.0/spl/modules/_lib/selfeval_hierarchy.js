// selfeval_hierarchy.js - Selfeval runner for hierarchy facet
//
// Validates hierarchy.json exists and has correct structure:
// - layers array exists
// - Each layer has name and type
// - Each layer folder exists

import fs from 'fs'
import path from 'path'

export function create(module) {
  return {
    async run(containerFsPath) {

      // Read hierarchy.json
      let hierarchy
      try {
        hierarchy = JSON.parse(fs.readFileSync(path.join(containerFsPath, 'hierarchy.json'), 'utf8'))
      } catch (e) {
        return {
          pass: false,
          topline: 'hierarchy | FAIL',
          summary: 'No hierarchy.json',
          checks: []
        }
      }

      const checks = []

      // Check layers array exists
      if (!Array.isArray(hierarchy.layers)) {
        checks.push({
          name: 'layers',
          pass: false,
          topline: 'layers | FAIL',
          detail: 'layers must be an array'
        })
        return {
          pass: false,
          topline: 'hierarchy | FAIL',
          summary: '0/1 checks',
          checks
        }
      }

      checks.push({
        name: 'layers',
        pass: true,
        topline: 'layers | PASS',
        detail: `${hierarchy.layers.length} layers defined`
      })

      // Check each layer
      for (const layer of hierarchy.layers) {
        const layerName = layer.name || '(unnamed)'

        // Check name exists
        if (!layer.name) {
          checks.push({
            name: layerName,
            pass: false,
            topline: `${layerName} | FAIL`,
            detail: 'layer missing name'
          })
          continue
        }

        // Check type exists
        if (!layer.type) {
          checks.push({
            name: layerName,
            pass: false,
            topline: `${layerName} | FAIL`,
            detail: 'layer missing type'
          })
          continue
        }

        // Check folder exists
        let folderExists = false
        try {
          const stat = fs.statSync(path.join(containerFsPath, layer.name))
          folderExists = stat.isDirectory()
        } catch (e) {}

        checks.push({
          name: layerName,
          pass: folderExists,
          topline: `${layerName} | ${folderExists ? 'PASS' : 'FAIL'}`,
          detail: folderExists ? `type: ${layer.type}` : 'folder missing'
        })
      }

      const allPass = checks.every(c => c.pass)
      const passCount = checks.filter(c => c.pass).length

      return {
        pass: allPass,
        topline: `hierarchy | ${allPass ? 'PASS' : 'FAIL'}`,
        summary: `${passCount}/${checks.length} checks`,
        checks
      }
    }
  }
}
