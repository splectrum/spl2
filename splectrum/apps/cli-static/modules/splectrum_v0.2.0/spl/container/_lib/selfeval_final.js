// selfeval_final.js - Selfeval runner for final resources overlap detection
//
// Validates that final resources don't overlap across the type chain.
// Final resources: _reqs/*.md, _lib/*.js, _tests/*.js
// These should be unique across the entire type hierarchy.

import fs from 'fs'
import path from 'path'

export function create(module) {
  return {
    async run(containerFsPath) {
      const selfeval = await module.require('lib/spl/container/selfeval.js')

      // Get container path from filesystem path
      const indexJson = JSON.parse(fs.readFileSync(path.join(containerFsPath, 'index.json'), 'utf8'))
      const containerPath = indexJson.name

      // Build type stack
      const { stack } = selfeval.buildTypeStack(containerPath)

      // If only one level, no overlap possible
      if (stack.length <= 1) {
        return {
          pass: true,
          topline: 'final | PASS',
          summary: 'Single level, no overlap possible',
          overlaps: []
        }
      }

      // Collect files from each level
      const finalDirs = ['_reqs', '_lib', '_tests']
      const extensions = {
        '_reqs': '.md',
        '_lib': '.js',
        '_tests': '.js'
      }

      // Map: filename -> first type that has it
      const fileOwners = new Map()
      const overlaps = []

      for (const typeName of stack) {
        // Get fs path for this type
        const typeIndexPath = module.resolve(typeName, 'index.json')
        if (!typeIndexPath) continue
        const typeFsPath = path.dirname(typeIndexPath)

        for (const dir of finalDirs) {
          const dirPath = path.join(typeFsPath, dir)
          let files = []
          try {
            files = fs.readdirSync(dirPath)
              .filter(f => f.endsWith(extensions[dir]))
              .filter(f => f !== 'index.json')
          } catch (e) {
            continue
          }

          for (const file of files) {
            const key = `${dir}/${file}`
            if (fileOwners.has(key)) {
              overlaps.push({
                file: key,
                pass: false,
                topline: `${key} | FAIL`,
                detail: `overlaps: ${fileOwners.get(key)} and ${typeName}`
              })
            } else {
              fileOwners.set(key, typeName)
            }
          }
        }
      }

      const allPass = overlaps.length === 0

      // Build summary with overlap details
      let summary
      if (allPass) {
        summary = `${fileOwners.size} files, no overlaps`
      } else {
        const overlapFiles = overlaps.map(o => o.file).join(', ')
        summary = `${overlaps.length} overlaps: ${overlapFiles}`
      }

      return {
        pass: allPass,
        topline: `final | ${allPass ? 'PASS' : 'FAIL'}`,
        summary,
        overlaps
      }
    }
  }
}
