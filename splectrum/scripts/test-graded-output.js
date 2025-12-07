// Test script for module.gradedOutput
//
// Run: spl ./splectrum/scripts/test-graded-output.js

const chunk1 = {
  topline: '✓',
  summary: 'Container valid',
  detail: 'Container valid: 3 facets checked',
  debug: 'Container valid: 3 facets checked [structure, schemas, methods]'
}

const chunk2 = {
  topline: '2',
  summary: '  methods: 2 found',
  detail: '  methods: 2 found\n    selfeval\n    whoami',
  debug: '  methods: 2 found\n    selfeval (spl/container/selfeval)\n    whoami (spl/container/whoami)'
}

function test(name, inputFlags, expected) {
  // Reset record state
  module.setInputFlag('silent', undefined)
  module.setInputFlag('verbose', undefined)
  module.setInputFlag('debug', undefined)
  module.setInputFlag('report', undefined)

  // Clear output
  module.output(null, null)

  // Set test flags
  for (const [key, value] of Object.entries(inputFlags)) {
    module.setInputFlag(key, value)
  }

  // Call gradedOutput with chunks
  module.gradedOutput(chunk1)
  module.gradedOutput(chunk2)

  // Get results via snapshot
  const snap = module.snapshotRecord()
  const meta = snap.headers.spl.request.metaoutput
  const data = snap.headers.spl.request.output

  // Check
  const metaOk = meta === expected.meta
  const dataOk = JSON.stringify(data) === JSON.stringify(expected.data)
  const pass = metaOk && dataOk

  console.log(`${pass ? '✓' : '✗'} ${name}`)
  if (!pass) {
    if (!metaOk) {
      console.log(`  meta expected: ${JSON.stringify(expected.meta)}`)
      console.log(`  meta actual:   ${JSON.stringify(meta)}`)
    }
    if (!dataOk) {
      console.log(`  data expected: ${JSON.stringify(expected.data)}`)
      console.log(`  data actual:   ${JSON.stringify(data)}`)
    }
  }

  return pass
}

console.log('Testing module.gradedOutput\n')

let passed = 0
let total = 0

// Text level tests
total++; if (test('default → summary', {}, {
  meta: 'Container valid\n  methods: 2 found',
  data: null
})) passed++

total++; if (test('--silent → topline', { silent: true }, {
  meta: '✓\n2',
  data: null
})) passed++

total++; if (test('--verbose → detail', { verbose: true }, {
  meta: 'Container valid: 3 facets checked\n  methods: 2 found\n    selfeval\n    whoami',
  data: null
})) passed++

total++; if (test('--debug → debug', { debug: true }, {
  meta: 'Container valid: 3 facets checked [structure, schemas, methods]\n  methods: 2 found\n    selfeval (spl/container/selfeval)\n    whoami (spl/container/whoami)',
  data: null
})) passed++

// Most verbose wins
total++; if (test('--silent --verbose → detail (most verbose wins)', { silent: true, verbose: true }, {
  meta: 'Container valid: 3 facets checked\n  methods: 2 found\n    selfeval\n    whoami',
  data: null
})) passed++

total++; if (test('--verbose --debug → debug (debug wins)', { verbose: true, debug: true }, {
  meta: 'Container valid: 3 facets checked [structure, schemas, methods]\n  methods: 2 found\n    selfeval (spl/container/selfeval)\n    whoami (spl/container/whoami)',
  data: null
})) passed++

// Data tests
total++; if (test('--report → summary data', { report: true }, {
  meta: 'Container valid\n  methods: 2 found',
  data: ['Container valid', '  methods: 2 found']
})) passed++

total++; if (test('--report=detail → detail data', { report: 'detail' }, {
  meta: 'Container valid\n  methods: 2 found',
  data: ['Container valid: 3 facets checked', '  methods: 2 found\n    selfeval\n    whoami']
})) passed++

total++; if (test('--report=debug → debug data', { report: 'debug' }, {
  meta: 'Container valid\n  methods: 2 found',
  data: ['Container valid: 3 facets checked [structure, schemas, methods]', '  methods: 2 found\n    selfeval (spl/container/selfeval)\n    whoami (spl/container/whoami)']
})) passed++

// Combined
total++; if (test('--silent --report → topline text, summary data', { silent: true, report: true }, {
  meta: '✓\n2',
  data: ['Container valid', '  methods: 2 found']
})) passed++

total++; if (test('--verbose --report=debug → detail text, debug data', { verbose: true, report: 'debug' }, {
  meta: 'Container valid: 3 facets checked\n  methods: 2 found\n    selfeval\n    whoami',
  data: ['Container valid: 3 facets checked [structure, schemas, methods]', '  methods: 2 found\n    selfeval (spl/container/selfeval)\n    whoami (spl/container/whoami)']
})) passed++

// requiredLevel tests
console.log('\nTesting module.requiredLevel\n')

function testLevel(name, inputFlags, expected) {
  // Reset
  module.setInputFlag('silent', undefined)
  module.setInputFlag('verbose', undefined)
  module.setInputFlag('debug', undefined)
  module.setInputFlag('report', undefined)

  // Set flags
  for (const [key, value] of Object.entries(inputFlags)) {
    module.setInputFlag(key, value)
  }

  const actual = module.requiredLevel()
  const pass = actual === expected

  console.log(`${pass ? '✓' : '✗'} ${name}`)
  if (!pass) {
    console.log(`  expected: ${expected}`)
    console.log(`  actual:   ${actual}`)
  }

  return pass
}

total++; if (testLevel('default → summary', {}, 'summary')) passed++
total++; if (testLevel('--silent → topline', { silent: true }, 'topline')) passed++
total++; if (testLevel('--verbose → detail', { verbose: true }, 'detail')) passed++
total++; if (testLevel('--debug → debug', { debug: true }, 'debug')) passed++
total++; if (testLevel('--report → summary', { report: true }, 'summary')) passed++
total++; if (testLevel('--report=debug → debug', { report: 'debug' }, 'debug')) passed++
total++; if (testLevel('--silent --report=debug → debug (max)', { silent: true, report: 'debug' }, 'debug')) passed++
total++; if (testLevel('--verbose --report → detail (max)', { verbose: true, report: true }, 'detail')) passed++

console.log(`\n${passed}/${total} tests passed`)

// Clean up
module.setInputFlag('silent', undefined)
module.setInputFlag('verbose', undefined)
module.setInputFlag('debug', undefined)
module.setInputFlag('report', undefined)
module.output(`gradedOutput tests: ${passed}/${total} passed`, { passed, total })
