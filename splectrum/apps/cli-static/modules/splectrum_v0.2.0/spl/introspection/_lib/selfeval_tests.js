// selfeval_tests.js - Selfeval runner for data-driven tests
//
// Scans _tests/ folder for test files, executes tests using declared runners.
// Each test specifies its runner, loaded on demand from test_runners/.

export function create(module) {
  return {
    async run(containerFsPath) {
      const fs = await module.require('fs')
      const path = await module.require('path')

      const testsPath = path.join(containerFsPath, '_tests')

      // Get container identity to know the path
      let containerPath
      try {
        const identity = JSON.parse(fs.readFileSync(path.join(containerFsPath, 'index.json'), 'utf8'))
        containerPath = identity.name
      } catch (e) {
        containerPath = null
      }

      // Check if _tests folder exists
      let testsManifest
      try {
        testsManifest = JSON.parse(fs.readFileSync(path.join(testsPath, 'index.json'), 'utf8'))
      } catch (e) {
        return {
          pass: true,
          topline: 'tests | EMPTY',
          summary: 'No _tests/index.json',
          files: []
        }
      }

      // Get test files from manifest
      const testFiles = testsManifest.files || []
      if (testFiles.length === 0) {
        return {
          pass: true,
          topline: 'tests | EMPTY',
          summary: 'No test files declared',
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
            const result = await runner.run(test, containerPath)
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

      return {
        pass: allPass,
        topline: `tests | ${allPass ? 'PASS' : 'FAIL'}`,
        summary: `${passedTests}/${totalTests} tests in ${fileResults.length} files`,
        files: fileResults
      }
    }
  }
}
