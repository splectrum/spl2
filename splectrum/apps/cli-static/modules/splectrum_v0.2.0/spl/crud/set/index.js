// spl/crud/set - Set container properties using dot-path syntax
//
// Targeted property modification with operators:
//   container.extends="spl/bar"           - set value
//   container.instance.children.list+="info"  - append to array
//   container.instance.children.list-="info"  - remove from array
//   container.extends=null                - delete key
//
// Facet mapping (first segment):
//   container → index.json
//   lib       → _lib/index.json
//   reqs      → _reqs/index.json
//   schemas   → _schemas/index.json
//
// Invocation: spl spl/foo/set container.extends="spl/bar"

import fs from 'fs'
import path from 'path'

export default async function(module) {
  const crud = await module.require('lib/spl/crud')

  const input = module.input()
  const dryRun = input.dryRun || false

  // Get target container from method path
  const methodPath = module.getMethod()
  const segments = methodPath.split('/')

  if (segments[segments.length - 1] !== 'set') {
    module.output('Invalid invocation: method must end with /set', { error: 'invalid_invocation' })
    return
  }

  const targetPath = segments.slice(0, -1).join('/')

  // Get the expression from positional args (numbered keys: 0, 1, 2...)
  const positionalArgs = []
  for (let i = 0; input[i] !== undefined; i++) {
    positionalArgs.push(input[i])
  }
  const expression = positionalArgs.join(' ').trim()

  if (!expression) {
    module.output('Usage: spl <container>/set <facet>.<path>=<value>\n\nExamples:\n  spl spl/foo/set container.extends="spl/bar"\n  spl spl/foo/set container.instance.children.list+="newChild"',
      { error: 'missing_expression' })
    return
  }

  // Parse the expression: path[operator]value
  // Operators: = (set), += (append), -= (remove)
  const match = expression.match(/^([a-zA-Z0-9_.]+)(\+?=|-=)(.+)$/)

  if (!match) {
    module.output(`Invalid expression: ${expression}\n\nExpected format: <path>=<value> or <path>+=<value> or <path>-=<value>`,
      { error: 'invalid_expression', expression })
    return
  }

  const [, dotPath, operator, rawValue] = match

  // Parse the value
  let value
  try {
    // Handle quoted strings
    if ((rawValue.startsWith('"') && rawValue.endsWith('"')) ||
        (rawValue.startsWith("'") && rawValue.endsWith("'"))) {
      value = rawValue.slice(1, -1)
    } else if (rawValue === 'null') {
      value = null
    } else if (rawValue === 'true') {
      value = true
    } else if (rawValue === 'false') {
      value = false
    } else if (!isNaN(rawValue)) {
      value = Number(rawValue)
    } else {
      // Try JSON parse for arrays/objects
      value = JSON.parse(rawValue)
    }
  } catch (e) {
    // Treat as string if not valid JSON
    value = rawValue
  }

  // Parse dot path - first segment is facet
  const pathParts = dotPath.split('.')
  const facet = pathParts[0]
  const keyPath = pathParts.slice(1)

  // Facet mapping
  const facetFiles = {
    container: 'index.json',
    lib: '_lib/index.json',
    reqs: '_reqs/index.json',
    schemas: '_schemas/index.json'
  }

  const targetFile = facetFiles[facet]
  if (!targetFile) {
    module.output(`Unknown facet: ${facet}\n\nValid facets: ${Object.keys(facetFiles).join(', ')}`,
      { error: 'unknown_facet', facet, validFacets: Object.keys(facetFiles) })
    return
  }

  // Resolve the file path - must exist in work module or be created there
  const workModulePath = await crud.getWorkModulePath()
  if (!workModulePath) {
    module.output('No work module found in hierarchy.json', { error: 'no_work_module' })
    return
  }

  const fileFsPath = path.join(workModulePath, targetPath, targetFile)

  // Read existing content or start with empty object
  let content = {}
  if (fs.existsSync(fileFsPath)) {
    content = JSON.parse(fs.readFileSync(fileFsPath, 'utf8'))
  } else {
    // Check if we can resolve it from overlay (read-only)
    const resolvedPath = module.resolve(targetPath, targetFile)
    if (resolvedPath) {
      content = JSON.parse(fs.readFileSync(resolvedPath, 'utf8'))
    }
  }

  const originalContent = JSON.stringify(content, null, 2)

  // Navigate to the parent of the target key
  let current = content
  for (let i = 0; i < keyPath.length - 1; i++) {
    const key = keyPath[i]
    if (current[key] === undefined) {
      current[key] = {}
    }
    current = current[key]
  }

  const finalKey = keyPath[keyPath.length - 1]

  // Apply the operation
  if (operator === '=' || operator === '+=') {
    if (operator === '+=') {
      // Append to array
      if (!Array.isArray(current[finalKey])) {
        current[finalKey] = []
      }
      if (!current[finalKey].includes(value)) {
        current[finalKey].push(value)
      }
    } else {
      // Set value (null means delete)
      if (value === null) {
        delete current[finalKey]
      } else {
        current[finalKey] = value
      }
    }
  } else if (operator === '-=') {
    // Remove from array
    if (Array.isArray(current[finalKey])) {
      current[finalKey] = current[finalKey].filter(item => item !== value)
    }
  }

  const newContent = JSON.stringify(content, null, 2)

  if (originalContent === newContent) {
    module.output(`No changes needed`, { status: 'unchanged', targetPath, file: targetFile })
    return
  }

  if (dryRun) {
    module.output(`Would update ${targetFile}:\n\nBefore:\n${originalContent}\n\nAfter:\n${newContent}`,
      { status: 'dry_run', targetPath, file: targetFile, before: JSON.parse(originalContent), after: content })
    return
  }

  // Ensure directory exists
  const dirPath = path.dirname(fileFsPath)
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }

  fs.writeFileSync(fileFsPath, newContent + '\n', 'utf8')

  module.output(`Updated ${targetPath}/${targetFile}: ${dotPath} ${operator} ${JSON.stringify(value)}`,
    { status: 'updated', targetPath, file: targetFile, path: dotPath, operator, value, content })
}
