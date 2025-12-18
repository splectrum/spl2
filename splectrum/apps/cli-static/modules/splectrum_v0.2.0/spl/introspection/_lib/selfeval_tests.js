// selfeval_tests.js - Selfeval runner for data-driven tests
//
// Scans _tests/ folder for test files, executes tests using declared runners.
// Each test specifies its runner, loaded on demand from test_runners/.

import fs from 'fs'
import path from 'path'

export function create(module) {
  return {
    async run(containerFsPath) {

      const testsPath = path.join(containerFsPath, '_tests')

      // Check if _tests folder exists
      let testsManifest
      try {
        testsManifest = JSON.parse(fs.readFileSync(path.join(testsPath, 'index.json'), 'utf8'))
      } catch (e) {
        return {
          pass: true,
          topline: 'tests | SKIP',
          summary: 'no tests',
          files: []
        }
      }

      // Get test files from manifest
      const testFiles = testsManifest.files || []
      if (testFiles.length === 0) {
        return {
          pass: true,
          topline: 'tests | SKIP',
          summary: 'no test files',
          files: []
        }
      }

      const methodPath = module.getMethod()
      const fileResults = []
      let totalTests = 0
      let passedTests = 0

      // Execute tests file by file
      for (const fileName of testFiles) {
        const filePath = path.join(testsPath, fileName)
        let testFile

        try {
          testFile = JSON.parse(fs.readFileSync(filePath, 'utf8'))
        } catch (e) {
          fileResults.push({
            name: fileName,
            pass: false,
            topline: `${fileName} | FAIL`,
            detail: `failed to read: ${e.message}`,
            tests: []
          })
          continue
        }

        const tests = testFile.tests || []
        const testResults = []

        for (const test of tests) {
          totalTests++
          const runnerName = test.runner || 'command'

          // Load runner on demand (resolves through overlay from _selfevals/test_runners/)
          let runner
          try {
            const runnerPath = module.resolve(methodPath, `_selfevals/test_runners/${runnerName}.js`)
            if (!runnerPath) throw new Error('not found')
            const runnerModule = await import(runnerPath)
            runner = runnerModule.create(module)
          } catch (e) {
            testResults.push({
              name: test.name,
              pass: false,
              topline: `${test.name} | FAIL`,
              detail: `unknown runner: ${runnerName}`
            })
            continue
          }

          try {
            const result = await runner.run(test)
            if (result.pass) passedTests++
            testResults.push(result)
          } catch (e) {
            testResults.push({
              name: test.name,
              pass: false,
              topline: `${test.name} | FAIL`,
              detail: `runner error: ${e.message}`
            })
          }
        }

        const filePass = testResults.every(t => t.pass)
        const filePassCount = testResults.filter(t => t.pass).length

        fileResults.push({
          name: testFile.name || fileName,
          pass: filePass,
          topline: `${testFile.name || fileName} | ${filePass ? 'PASS' : 'FAIL'}`,
          summary: `${filePassCount}/${testResults.length} tests`,
          category: testFile.category,
          tests: testResults
        })
      }

      const allPass = fileResults.every(f => f.pass)

      // Build summary: filename (count), ...
      // For pass: just total tests per file
      // For fail: pass/total per file
      const fileSummaries = fileResults.map(f => {
        const testCount = f.tests?.length || 0
        const passCount = f.tests?.filter(t => t.pass).length || 0
        if (f.pass) {
          return `${f.name} (${testCount})`
        } else {
          return `${f.name} (${passCount}/${testCount})`
        }
      })
      const summary = fileSummaries.join(', ')

      // For failures, build detail with failed test names and errors
      let detail = null
      if (!allPass) {
        const failedLines = []
        for (const file of fileResults) {
          if (file.pass) continue
          for (const test of (file.tests || [])) {
            if (test.pass) continue
            const error = test.detail || test.error || 'failed'
            failedLines.push(`"${test.name}" - ${error}`)
          }
        }
        if (failedLines.length > 0) {
          detail = failedLines.join('\n')
        }
      }

      const result = {
        pass: allPass,
        topline: `tests | ${allPass ? 'PASS' : 'FAIL'}`,
        summary,
        files: fileResults
      }
      if (detail) result.detail = detail

      return result
    }
  }
}
