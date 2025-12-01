# spl/dev/prepare v1.0.0

Build hierarchy.json for overlay resolution in a dev environment.

## Purpose

Builds a map of all nodes with their layer sequences for file resolution. The hierarchy map enables the overlay system to resolve files through type inheritance and module path chains.

## Inputs

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | No | Environment name (default: most recent env-*) |

### Input Constraints

- name: If provided, must exist in environments/

## Outputs

| Field | Type | Description |
|-------|------|-------------|
| environment | string | Environment name processed |
| hierarchyPath | string | Absolute path to hierarchy.json |
| nodeCount | integer | Number of nodes in hierarchy |
| typeCount | integer | Number of types in registry |

## Behavior

1. Resolve environment path from runtime.cwd
2. Find environment (by name or most recent env-*)
3. Build type registry from modules/types/
4. Find work module (wm_* pattern) in modules/
5. Find all nodes in work module (directories with README.json)
6. For each node, build layer sequence:
   - Module path chain (node → ancestors in work module)
   - Type chain (node type → extends chain)
7. Write hierarchy.json to environment root
8. Return output with stats

## Error Conditions

| Condition | Error Message |
|-----------|---------------|
| No environments folder | "No environments/ folder found" |
| No environments found | "No environments found" |
| Environment not found | "Environment not found: {name}" |
| No work module found | "No work module (wm_*) found in modules/" |

## Selfevals

### SE-1: hierarchy.json created
Verify that hierarchy.json is created in the environment root.

### SE-2: All nodes included
Verify that all directories with README.json in work module are in hierarchy.

### SE-3: Type chain correct
Verify that nodes with types have correct type chain through extends.

### SE-4: Module path chain correct
Verify that module path chain walks from node to work module root.

### SE-5: Dynamic work module discovery
Verify that wm_* pattern is found dynamically, not hardcoded.

### SE-6: Error when no environments
Verify error when environments/ is empty or missing.

## Notes

- Run after spl/dev/deploy, or anytime structure changes
- Hierarchy map is used by overlay resolution for file lookups
- v1.0.0: Based on prepare.js with wm_* pattern fix
