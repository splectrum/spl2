// command.js - Test runner for command execution tests
//
// Executes a spl command and checks output against expectations.
// Expects test format:
//   { runner: "command", command: "method", expect: { contains?, notContains?, equals? } }
// Commands are relative to the container being tested (replaces 'selfeval' in method path).

import { execSync } from 'child_process'

export function create(module) {
  return {
    name: 'command',

    async run(test) {

      // Derive command path from method path (spl/container/selfeval + /whoami -> spl/container/whoami)
      const commandPath = module.getMethod().replace('/selfeval', test.command)
      const command = `spl ${commandPath}`
      let output = ''
      let error = null

      try {
        output = execSync(command, {
          encoding: 'utf8',
          timeout: 10000,
          cwd: process.cwd()
        })
      } catch (e) {
        if (e.stdout) output = e.stdout
        if (e.stderr) output += e.stderr
        error = e.message
      }

      const expect = test.expect || {}
      const failures = []

      // Check contains
      if (expect.contains) {
        const patterns = Array.isArray(expect.contains) ? expect.contains : [expect.contains]
        for (const pattern of patterns) {
          if (!output.includes(pattern)) {
            failures.push(`expected to contain: "${pattern}"`)
          }
        }
      }

      // Check notContains
      if (expect.notContains) {
        const patterns = Array.isArray(expect.notContains) ? expect.notContains : [expect.notContains]
        for (const pattern of patterns) {
          if (output.includes(pattern)) {
            failures.push(`expected NOT to contain: "${pattern}"`)
          }
        }
      }

      // Check equals (exact match, trimmed)
      if (expect.equals !== undefined) {
        if (output.trim() !== expect.equals.trim()) {
          failures.push(`expected exact match`)
        }
      }

      // Check matches (regex)
      if (expect.matches) {
        const patterns = Array.isArray(expect.matches) ? expect.matches : [expect.matches]
        for (const pattern of patterns) {
          const regex = new RegExp(pattern)
          if (!regex.test(output)) {
            failures.push(`expected to match regex: "${pattern}"`)
          }
        }
      }

      // Check error expectation
      if (expect.error === true && !error) {
        failures.push('expected command to fail')
      }
      if (expect.error === false && error) {
        failures.push(`expected command to succeed, got: ${error}`)
      }

      const pass = failures.length === 0

      return {
        pass,
        topline: `${test.name} | ${pass ? 'PASS' : 'FAIL'}`,
        detail: pass ? `command: ${test.command}` : failures.join('; '),
        output: pass ? undefined : output.substring(0, 200)
      }
    }
  }
}
