// Test script for module.js
//
// Tests:
// 1. moduleBootstrap loads module.js
// 2. module.create(record) works
// 3. Platform require (fs, path)
// 4. Basic module methods (input, output, resolve)

import { loadModule } from '../lib/moduleBootstrap.js'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const nodeRoot = path.join(__dirname, '..')

// Mock record with minimal structure
const mockRecord = {
  headers: {
    spl: {
      runtime: {
        nodeRoot: nodeRoot,
        appAPI: 'spl/cli-static'
      },
      request: {
        timeReceived: Date.now(),
        method: 'spl/container/whoami',
        input: { test: 'value' }
      },
      'cli-static': {
        enableAppOverlay: true
      }
    }
  }
}

async function runTests() {
  console.log('=== Module.js Test ===\n')

  // Test 1: Load module.js via bootstrap
  console.log('1. Loading module.js via bootstrap...')
  try {
    const moduleLib = await loadModule('cli-static')
    console.log('   OK: module.js loaded')
    console.log('   Exports:', Object.keys(moduleLib))
  } catch (err) {
    console.log('   FAIL:', err.message)
    return
  }

  // Test 2: Create module instance
  console.log('\n2. Creating module instance...')
  let module
  try {
    const moduleLib = await loadModule('cli-static')
    module = moduleLib.create(mockRecord)
    console.log('   OK: module created')
    console.log('   Methods:', Object.keys(module))
  } catch (err) {
    console.log('   FAIL:', err.message)
    return
  }

  // Test 3: Platform require (fs)
  console.log('\n3. Testing module.require("fs")...')
  try {
    const fs = await module.require('fs')
    console.log('   OK: fs loaded')
    console.log('   Has existsSync:', typeof fs.existsSync === 'function')
  } catch (err) {
    console.log('   FAIL:', err.message)
  }

  // Test 4: Platform require (path)
  console.log('\n4. Testing module.require("path")...')
  try {
    const pathMod = await module.require('path')
    console.log('   OK: path loaded')
    console.log('   Has join:', typeof pathMod.join === 'function')
  } catch (err) {
    console.log('   FAIL:', err.message)
  }

  // Test 5: Input
  console.log('\n5. Testing module.input()...')
  try {
    const input = module.input()
    console.log('   OK: input =', JSON.stringify(input))
  } catch (err) {
    console.log('   FAIL:', err.message)
  }

  // Test 6: Output
  console.log('\n6. Testing module.output()...')
  try {
    module.output('Test meta', { data: 'value' })
    console.log('   OK: output set')
    console.log('   metaoutput:', mockRecord.headers.spl.request.metaoutput)
    console.log('   output:', JSON.stringify(mockRecord.headers.spl.request.output))
  } catch (err) {
    console.log('   FAIL:', err.message)
  }

  // Test 7: Resolve
  console.log('\n7. Testing module.resolve()...')
  try {
    const resolved = module.resolve('spl/container', 'README.json')
    console.log('   OK: resolved =', resolved)
  } catch (err) {
    console.log('   FAIL:', err.message)
  }

  // Test 8: Runtime getters
  console.log('\n8. Testing runtime getters...')
  try {
    console.log('   getNodeRoot:', module.getNodeRoot())
    console.log('   getAppAPI:', module.getAppAPI())
    console.log('   getRecordId:', module.getRecordId())
  } catch (err) {
    console.log('   FAIL:', err.message)
  }

  console.log('\n=== Tests Complete ===')
}

runTests().catch(console.error)
