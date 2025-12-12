# SPL Package Requirement

**Version:** 1.0.0
**Container:** spl
**Type:** Package Instance

## Purpose

SPL core package containing base container types and introspection APIs.

## Contents

### Types (api.types)

| Type | Purpose |
|------|---------|
| `container` | Base container type - identity, lifecycle, introspection |
| `api` | API container type - method collections with declared interface |
| `method` | Method type - executable units with handler |
| `package` | Package type - distributable container collections |
| `module` | Module type - runtime interface provider |
| `modules` | Modules type - module layer collections |

### Resource Folders

| Folder | Contents |
|--------|----------|
| `_lib/` | Shared libraries (empty for spl root) |
| `_reqs/` | Requirements documentation |
| `_schemas/` | AVRO schemas (empty for spl root) |

## Identity

```json
{
  "name": "spl",
  "type": "Instance",
  "instantiates": "spl/package"
}
```

The spl package is an instance of spl/package - it uses the package type to define itself.
