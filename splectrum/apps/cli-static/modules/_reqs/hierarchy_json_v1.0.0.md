**Type:** plain req
**Version:** 1.0.0

# hierarchy_json

## Spec

Configuration file defining the active module layers and their resolution order.

**Location:** `splectrum/modules/hierarchy.json`

**Purpose:** Declares which module layers are active and their precedence for overlay resolution.

**Schema:**

```json
{
  "layers": [
    { "name": "module_name", "type": "work_module" }
  ]
}
```

**Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `layers` | array | Ordered list of active module layers |
| `layers[].name` | string | Folder name within modules/ directory |
| `layers[].type` | string | Module type: `work_module` (development) or `release` (frozen) |

**Resolution Order:**

Layers listed first have highest precedence. When resolving resources:
1. Check first layer
2. Fall through to subsequent layers
3. Fail if not found in any layer

**Work Module Convention:**

During development, a work module layer is added as the first entry:
```json
{
  "layers": [
    { "name": "splectrum_v0.2.0", "type": "work_module" },
    { "name": "splectrum_v0.1.0", "type": "release" }
  ]
}
```

Work module (type: `work_module`) captures changes during development. At release, type changes to `release` and module becomes frozen.

## Self-eval

- [ ] File exists at splectrum/modules/hierarchy.json
- [ ] Contains valid JSON
- [ ] Has layers array
- [ ] Each layer has name property
- [ ] Each layer has type property (work_module or release)
- [ ] Named folders exist in modules/

## Comments

Apps can have their own hierarchy.json at `apps/{appName}/modules/hierarchy.json` which takes precedence over splectrum hierarchy for that app's context.
