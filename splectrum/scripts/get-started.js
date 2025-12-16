/*
 * scripts/get-started.js - Quick reference for common SPL commands
 * Usage: spl get-started
 */
console.log(`SPL Quick Reference
==================

Quick Queries (info):
  spl spl/container/info --stack        # Type stack (extends chain)
  spl spl/container/info --stack=instantiates  # Instance chain
  spl spl/container/info --methods      # Available methods
  spl spl/container/info --children     # Allowed children

Full Introspection (whoami):
  spl spl/container/whoami              # What is this container?
  spl spl/container/whoami --levels=all # Show full type chain
  spl spl/container --help              # Show input flags

Validation:
  spl spl/container/selfeval            # Validate container (all levels)
  spl selfeval-all spl/container        # Validate container + all descendants
  spl selfeval-all spl --detail         # Show selfeval breakdown per container
  spl selfeval-all spl --failFast       # Stop at first failure

Lifecycle (CRUD):
  spl spl/foo/bar/create                # Create new container
  spl spl/foo/update --dryRun           # Preview drift fixes
  spl spl/foo/lift --resource=index.js  # Copy overlay resource for editing
  spl spl/foo/delete                    # Remove container

Property Mutation (set):
  spl spl/foo/set container.extends="spl/bar"
  spl spl/foo/set container.instance.children.list+="new"
  spl spl/foo/set container.instance.children.list-="old"

Inline Scripts:
  spl '/* tag */ module.output("hello")'

  # With ai.js helpers:
  spl '/* explore */
  const ai = await module.require("lib/spl/script/ai.js")
  module.output(ai.table(await ai.methods("spl/container")))
  '

ai.js helpers:
  ai.stack(path, mode)     # Type stack ('full', 'extends', 'instantiates')
  ai.methods(path)         # List methods with definition source
  ai.children(path)        # Allowed children
  ai.readJson(path, file)  # Read JSON through resolution
  ai.exists(path)          # Check if container exists
  ai.json(obj)             # Pretty print JSON
  ai.table(arr)            # Format array as table`)

module.output({ status: 'ok' })
