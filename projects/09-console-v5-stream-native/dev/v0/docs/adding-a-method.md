# Adding a Method

Step-by-step guide to add a new method to the work module.

## 1. Create the Folder Structure

```bash
# In deployed environment: environments/env-*/modules/work_module/
mkdir -p {package}/{api}/{method}
```

Example for `spl/console/warn`:
```bash
mkdir -p spl/console/warn
```

## 2. Create README.json

Every node needs README.json declaring its type:

```json
{
  "type": "method",
  "extends": "module_node"
}
```

For the full path, each level needs its README.json:
- `spl/README.json` → `{ "type": "package", "extends": "branch" }`
- `spl/console/README.json` → `{ "type": "api", "extends": "branch" }`
- `spl/console/warn/README.json` → `{ "type": "method", "extends": "module_node" }`

## 3. Create index.js

Minimal method:

```javascript
import { createSpl } from 'lib/core.js'

export function handle(record) {
  const spl = createSpl(record)

  // Your implementation here

  spl.complete()
}
```

## 4. Add Method-Level Lib (Optional)

If your method needs helper functions:

```bash
mkdir -p {package}/{api}/{method}/_lib
```

Create the lib file:

```javascript
// spl/console/warn/_lib/warn.js
import { createSpl } from 'lib/core.js'

export function createWarn(record) {
  const spl = createSpl(record)
  const input = spl.headers.spl.console.warn

  return {
    ...spl,
    warn() {
      console.warn(input.message)
    }
  }
}
```

## 5. Register Lib Symlinks

After adding new `_lib/` files, re-run deploy to create symlinks:

```bash
node destroy.js
node deploy.js
```

Or manually create symlinks in `lib/`:
```bash
ln -s ../modules/work_module/spl/console/warn/_lib/warn.js lib/spl/console/warn.js
```

## 6. Test

```bash
node cycle.js
```

The type selfevals will validate:
- README.json exists and has valid type
- Folder structure matches type requirements

## Complete Example

```
work_module/
└── spl/
    ├── README.json           # { "type": "package", "extends": "branch" }
    └── console/
        ├── README.json       # { "type": "api", "extends": "branch" }
        └── warn/
            ├── README.json   # { "type": "method", "extends": "module_node" }
            ├── index.js      # Method implementation
            └── _lib/
                └── warn.js   # Method helpers (optional)
```

---

**Version:** 1.0.0
