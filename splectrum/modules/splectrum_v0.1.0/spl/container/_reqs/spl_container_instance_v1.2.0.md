**Type:** plain req
**Version:** 1.2.0
**Supersedes:** spl_container_instance_v1.1.0

# spl_container_instance

## Spec

The spl/container type - structural constraints for containers.

**Inheritance:**

spl/container extends spl/crud, which extends spl/introspection:

```
spl/introspection: whoami, selfeval
  └── spl/crud: create, lift, update, delete
        └── spl/container: structural constraints
```

All API methods are inherited. spl/container adds no new methods - it defines structural facets.

**Structural facets:**

| Facet | Location | Purpose |
|-------|----------|---------|
| container | index.json | Container identity |
| handler | index.js | Container implementation |
| schemas | _schemas/ | AVRO schemas |
| lib | _lib/ | Shared code |
| reqs | _reqs/ | Requirements |
| selfevals | _selfevals/ | Validation runners |
| tests | _tests/ | Test collections |

**Global flags (base input schema):**

All containers inherit these flags from spl/introspection input.avsc:

- `--dryRun` - Preview only, no action taken
- `--silent` - Omit narrative, data only
- `--help` / `-h` - Show usage information (rewrites to whoami --usage)

**Selfeval runners:**

spl/container defines structural selfeval runners that validate:
- lib: manifest exports match actual exports
- api: declared methods exist as folders
- schemas: schema files are valid AVRO
- handler: index.js exists and exports function
- reqs: declared req files exist
- container: index.json structure valid
- final: no overlap in final resources across type chain

## Self-eval

- [ ] Conforms to spl_container_type structural requirements
- [ ] Structural facets follow type contracts
- [ ] Selfeval runners pass

## Comments

spl/container is about structure, not API. The lifecycle methods (create, lift, update, delete) are in spl/crud. The introspection methods (whoami, selfeval) are in spl/introspection.

Methods use `module.output(freetext, structured)` pattern for output.
Libs use `create(module)` pattern returning object with exports.
Runners are libs with a `run(containerFsPath)` export.
