#!/usr/bin/env node
// test.js - Run tests in environment

import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

console.log('=== Test - Run Environment Tests ===')
console.log('')

// Find environment to test
let envName
let envPath

if (process.argv[2]) {
  // Specific environment provided
  envName = process.argv[2]
  envPath = `environments/${envName}`
} else {
  // Find most recent environment
  if (!fs.existsSync('environments')) {
    console.error('Error: No environments found')
    console.error('Run ./deploy.js first')
    process.exit(1)
  }

  const envDirs = fs.readdirSync('environments')
    .filter(name => fs.statSync(`environments/${name}`).isDirectory())
    .sort()
    .reverse()

  if (envDirs.length === 0) {
    console.error('Error: No environments found')
    console.error('Run ./deploy.js first')
    process.exit(1)
  }

  envName = envDirs[0]
  envPath = `environments/${envName}`
}

if (!fs.existsSync(envPath)) {
  console.error(`Error: Environment not found: ${envPath}`)
  process.exit(1)
}

console.log(`Testing environment: ${envName}`)
console.log(`Path: ${envPath}`)
console.log('')

// Track test results
let testsRun = 0
let testsPassed = 0

// Find and run test files in modules/pr09
const modulesPath = `${envPath}/modules/pr09`

if (fs.existsSync(modulesPath)) {
  // Find all test files recursively
  const findTestFiles = (dir) => {
    const files = []
    const items = fs.readdirSync(dir, { withFileTypes: true })

    for (const item of items) {
      const fullPath = path.join(dir, item.name)
      if (item.isDirectory()) {
        files.push(...findTestFiles(fullPath))
      } else if (item.name.endsWith('-test.js') || item.name.endsWith('-test.mjs')) {
        files.push(fullPath)
      }
    }

    return files
  }

  const testFiles = findTestFiles(modulesPath)

  if (testFiles.length === 0) {
    console.log('No test files found in modules/pr09/')
    console.log('')
    console.log('=== Test Summary ===')
    console.log('Tests run: 0')
    console.log('')
    console.log('⚠ No tests found')
    process.exit(0)
  }

  // Run each test
  for (const testFile of testFiles) {
    const relativePath = path.relative(envPath, testFile)
    console.log(`Running: ${relativePath}`)
    testsRun++

    try {
      execSync(`node ${testFile}`, {
        cwd: envPath,
        stdio: 'inherit'
      })
      testsPassed++
      console.log('✓ Passed')
    } catch (error) {
      console.log('✗ Failed')
    }
    console.log('')
  }
} else {
  console.log('No modules/pr09/ directory found')
  console.log('')
  console.log('=== Test Summary ===')
  console.log('Tests run: 0')
  console.log('')
  console.log('⚠ No modules found')
  process.exit(0)
}

// Report results
console.log('=== Test Summary ===')
console.log(`Environment: ${envName}`)
console.log(`Tests run: ${testsRun}`)
console.log(`Tests passed: ${testsPassed}`)

if (testsRun === testsPassed) {
  console.log('')
  console.log('✓ All tests passed')
  process.exit(0)
} else {
  console.log('')
  console.log('✗ Some tests failed')
  process.exit(1)
}
