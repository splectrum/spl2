# Overlay + Extraction Pattern

**Created:** 2025-11-24
**Context:** Design principle emerging from v1.0 → v1.1 transition

---

## Pattern Summary

**Development uses overlay resolution. Extraction merges layers for deployment.**

---

## The Problem

**Without overlay system:**
- Work modules must contain ALL files (base + changes)
- Massive duplication and maintenance burden
- Hard to see "what changed"
- Self-evals must be copied into work module
- Work module is "fat" with mostly unchanged content

---

## The Solution: Multi-Layer Overlay + Merge on Extract

### During Development (Overlay Resolution)

**Layer priority for file resolution:**
1. **Work module** - Specifics being implemented (thin layer)
2. **Base modules** - Generic implementations (reusable code)
3. **Models** - Schemas, self-evals, requirements
4. **API definitions** - Ultimate source specifications

**Structure in dev environment:**
```
environment/
├── base/                    # Base nodes layer
│   └── spl/
│       ├── data/
│       ├── console/
│       └── ...
├── modules/
│   └── pr09/               # Work module - ONLY changes
│       └── spl/
│           └── console/
│               └── create/
│                   └── index.js    # Only what's new/different
├── models/                 # Model/schema/selfeval layer
│   └── _reqs/
│       └── spl_console_create_v1.0.0_selfeval.js
└── ... (package.json, etc.)
```

**Benefits:**
- Work module shows "delta" clearly
- No duplication during development
- Self-evals automatically available via overlay
- Fast iteration (minimal files to modify)
- Clear separation of concerns

### During Extraction (Layer Merge)

**Extract phase merges all layers:**
```
base files + work module changes → complete implementation/
```

**Extraction produces:**
1. **Merged work module** → `implementation/pr09-v1.1/` (or similar)
   - Self-contained, no overlay needed
   - Ready for install/ or production deployment
   - Contains base + all changes = fully resolved

2. **Test reports** → `reports/{envName}/`
   - Test outputs, validation logs
   - Event streams (if preserved)
   - Metrics, timing data

**Why extraction must merge:**
- Production/non-dev environments don't have overlay system
- Extracted module must be self-contained
- Install candidate needs no external dependencies
- Clear versioning of "complete" implementation

---

## Implementation Requirements

### 1. Overlay Resolution Function

**For imports/requires within work module:**
```javascript
// Instead of: require('../../lib/data-layer')
// Use: lib('data-layer')  or  base('spl/console/log')

function resolveModule(path) {
  // Check layers in priority order:
  // 1. modules/pr09/{path}
  // 2. base/{path}
  // 3. models/{path}
  // 4. fail
}
```

**For self-eval execution:**
```javascript
// Look for: spl/console/create/_reqs/selfeval.js
// Resolution: work module → base → models → fail
```

### 2. Extract Script Enhancement

**Current extract.js:**
- Copies work module only
- Creates MANIFEST.json

**Enhanced extract.js:**
```javascript
extract({
  environment: 'env-123',
  outputDir: 'implementation/pr09-v1.1'
})

// 1. Enumerate all files needed (from all layers)
// 2. Merge layers (work overlays base overlays models)
// 3. Copy merged files to outputDir
// 4. Generate MANIFEST with layer sources
// 5. Extract reports separately to reports/env-123/
```

### 3. Base Layer Population

**Where does base/ come from?**
- Option A: Cloned from install/ spot (existing implementations)
- Option B: Downloaded from registry/repository
- Option C: Part of dev package template

**For v1.1:**
- Start simple: manual copy or reference
- Later: automated base layer management

---

## File Path Traversal Problem

**Challenge:** Work module code needs to reference library functions without `../../lib/`

**Solutions:**

**Option 1: Custom resolution function**
```javascript
import { lib } from '@pr09/resolve'
const dataLayer = lib('data-layer')
```

**Option 2: Package.json paths mapping**
```json
{
  "imports": {
    "#lib/*": "./base/lib/*",
    "#pr09/*": "./modules/pr09/*"
  }
}
```

**Option 3: Build-time resolution**
- Extract phase resolves all paths
- Work module uses symbolic references
- Output has concrete paths

**For v1.1:** Choose based on simplicity and Node.js compatibility

---

## Benefits

**Development:**
- Thin work modules (only changes)
- No duplication
- Self-evals automatically available
- Fast iteration
- Clear delta

**Extraction:**
- Complete, self-contained output
- Ready for deployment
- Clear versioning
- Traceability via MANIFEST

**Testing:**
- Test in dev (overlay active)
- Extract merges automatically
- Output is tested version

---

## Example Workflow

**1. Start v1.1 iteration:**
```bash
cd dev/v1.1
node deploy.js
# Creates environment with base + work module layers
```

**2. Develop (work module only):**
```
modules/pr09/
└── state/
    └── context.js     # NEW FILE (only this in work module)
```

**3. Test (overlay active):**
```bash
node test.js
# Resolves: context.js from work module
#           selfeval.js from models layer
#           base files from base layer
```

**4. Extract (merge layers):**
```bash
node extract.js
# Output: implementation/pr09-v1.1/
#   Contains: base files + context.js merged
#   MANIFEST: shows layer sources
# Also: reports/env-123/
#   Contains: test outputs, logs
```

**5. Deploy extracted module:**
```bash
# implementation/pr09-v1.1/ is complete, ready to install
# No overlay needed in production
```

---

## Key Insights

1. **Overlay enables thin work modules** - Focus on delta, not duplication
2. **Extract creates deployment artifact** - Merge happens at boundary
3. **Dev and prod have different needs** - Overlay for dev, merged for prod
4. **Self-evals benefit from overlay** - Don't duplicate into work module
5. **Clear versioning via extraction** - Each extract = versioned implementation

---

## Questions for v1.1 Implementation

1. **Overlay resolution mechanism** - Custom function vs package.json imports?
2. **Base layer source** - Where do base files come from initially?
3. **Extract merge logic** - How to handle file conflicts/precedence?
4. **MANIFEST detail level** - What layer provenance to track?
5. **Reports structure** - What belongs in reports vs implementation?

---

**Status:** Design principle captured, ready for v1.1 implementation exploration.
