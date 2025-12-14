/*
 * scripts/get-started.js - Quick reference for common SPL commands
 * Usage: spl get-started
 */
console.log(`SPL Quick Reference
==================

Introspection:
  spl spl/container/whoami              # What is this container?
  spl spl/container/whoami --levels=all # Show full type chain
  spl spl/container --help              # Show input flags

Validation:
  spl spl/container/selfeval            # Validate container (all levels)

Fix drift:
  spl spl/container/update --dryRun     # Preview fixes
  spl spl/container/update              # Apply fixes

Examples:
  spl spl/whoami                        # Introspect the spl package
  spl spl/container/whoami/selfeval     # Validate whoami method`)

module.output({ status: 'ok' })
