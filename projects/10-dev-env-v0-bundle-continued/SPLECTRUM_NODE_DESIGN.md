# Splectrum Node Design

**Project:** 10 - Dev Env v0 Bundle Continued
**Created:** 2025-11-26
**Status:** Design proposal

---

## Overview

Design for deploying Splectrum nodes at the repository level, enabling:
- Central entry point (`./spl`) for all Splectrum operations
- Root node for production use
- Ops sidecar for safe upgrade/rollback
- Dev environments for isolated development

## Repository Structure

```
spl2/
├── spl                          # Entry point (shell wrapper → splectrum/)
├── splectrum/                   # Root node (production)
│   ├── spl.mjs                  # CLI implementation
│   ├── run.js                   # Core runner
│   ├── package.json
│   ├── lib/                     # Symlinks to module _lib/
│   ├── node_modules/lib/        # Re-exports for clean imports
│   ├── modules/
│   │   ├── bm_spl/              # Active base module (symlink → versions/)
│   │   └── versions/            # Version history
│   │       ├── bm_spl-1764157292442/
│   │       └── bm_spl-{previous}/
│   └── ops/                     # Sidecar node (operations)
│       ├── spl                  # Local entry point
│       ├── spl.mjs
│       ├── run.js
│       ├── package.json
│       ├── lib/
│       ├── node_modules/lib/
│       └── modules/
│           └── bm_spl_ops/      # Ops-only module
├── projects/
│   └── NN-xxx/dev/v0/           # Development bundles
│       ├── implementation/
│       │   ├── types/
│       │   ├── wm_spl_dev/      # Work in progress
│       │   └── bm_spl/          # Upgrade candidate
│       ├── environments/
│       └── spl                  # Local entry point (dev)
└── ...
```

## Nodes

### Root Node (`splectrum/`)

The primary Splectrum node. User-facing, production.

**Entry point:** `./spl` (repo root)

**Contains:**
- All production APIs (`spl/dev`, `spl/runtime`, `spl/request`, future APIs)
- Version history for rollback capability

**Invocation:**
```bash
./spl spl/dev/deploy              # Create dev environment
./spl spl/dev/cycle               # Run tests
./spl spl/dev/publish             # Create upgrade candidate
```

### Ops Sidecar (`splectrum/ops/`)

Minimal node dedicated to managing the root node. Independent process.

**Entry point:** `./splectrum/ops/spl`

**Contains:**
- `spl/ops` API only (upgrade, rollback, status, list)
- Minimal footprint, rarely changes

**Invocation:**
```bash
./splectrum/ops/spl spl/ops/status                    # Show root node status
./splectrum/ops/spl spl/ops/upgrade --candidate=...   # Deploy to root
./splectrum/ops/spl spl/ops/rollback                  # Revert to previous
./splectrum/ops/spl spl/ops/list                      # Show versions
```

**Why sidecar?**
- Independent from root - can fix root if broken
- No bootstrap paradox - doesn't manage itself
- Direct filesystem access to `../modules/`

### Dev Nodes (`projects/NN-xxx/dev/v0/`)

Isolated development environments within projects.

**Entry point:** `./spl` (within dev bundle)

**Contains:**
- Work module (`wm_*`) in development
- Local splectrum install for testing
- Types for development

**Invocation:**
```bash
cd projects/10-.../dev/v0
./spl spl/dev/deploy              # Create environment
./spl spl/dev/cycle               # Test
./spl spl/dev/publish             # Create candidate
```

## APIs

### spl/dev (Root Node)

Development workflow management.

| Method | Purpose |
|--------|---------|
| `deploy` | Create dev environment from implementation |
| `prepare` | Build hierarchy.json |
| `test` | Run selfevals |
| `cycle` | prepare + test |
| `publish` | Create timestamped artifacts |
| `upgrade` | Install module to local splectrum |
| `clone` | Clone dev bundle to new location |
| `destroy` | Remove environments |

### spl/ops (Sidecar Only)

Root node operations.

| Method | Purpose |
|--------|---------|
| `status` | Show current version, health check |
| `upgrade` | Deploy candidate to root node |
| `rollback` | Revert to previous version |
| `list` | Show available versions |

## Workflow

### Development Cycle

```
1. Developer works in project dev bundle
   └── projects/NN-xxx/dev/v0/

2. Test locally
   └── ./spl spl/dev/cycle

3. Publish candidate
   └── ./spl spl/dev/publish
   └── Creates: implementation/bm_spl-{timestamp}/

4. Upgrade root node (via sidecar)
   └── ./splectrum/ops/spl spl/ops/upgrade --candidate=projects/.../bm_spl-{ts}
   └── Copies to splectrum/modules/versions/
   └── Updates symlink splectrum/modules/bm_spl

5. Root node now has new capabilities
   └── ./spl spl/new/feature
```

### Rollback

```
1. Discover issue with current version

2. List available versions
   └── ./splectrum/ops/spl spl/ops/list

3. Rollback
   └── ./splectrum/ops/spl spl/ops/rollback
   └── Updates symlink to previous version

4. Root node restored
```

## Version Management

### Symlink Pattern

```
splectrum/modules/
├── bm_spl -> versions/bm_spl-1764157292442   # Symlink to active
└── versions/
    ├── bm_spl-1764157292442/                  # Current
    ├── bm_spl-1764150000000/                  # Previous
    └── bm_spl-1764140000000/                  # Older
```

**Benefits:**
- Atomic switch (symlink update)
- Instant rollback
- Version history preserved
- Clear audit trail

### Version Retention

Keep N versions (configurable, default 5). Prune old versions on upgrade.

## Bootstrap

### Initial Setup

```bash
# From project 10 dev bundle
cd projects/10-dev-env-v0-bundle-continued/dev/v0

# Create root node at repo level
node upgrade.js ../../../..

# This creates:
#   spl2/spl
#   spl2/splectrum/
```

### Sidecar Setup

After root node exists, create sidecar:
1. Create `splectrum/ops/` structure
2. Deploy `bm_spl_ops` module (minimal, ops API only)
3. Sidecar ready for operations

## Gitignore

```gitignore
# Root node generated
/splectrum/lib/
/splectrum/node_modules/
/splectrum/ops/lib/
/splectrum/ops/node_modules/

# Environments (all dev bundles)
**/dev/v*/environments/
**/dev/v*/splectrum/
**/dev/v*/spl
```

**Tracked:**
- `splectrum/modules/` - production modules
- `splectrum/ops/modules/` - ops module
- `splectrum/spl.mjs`, `run.js`, `package.json` - infrastructure

## Future Considerations

### Multi-Node Routing

When multiple nodes exist beyond ops:

```
spl2/
├── spl                      # Router
├── splectrum/
│   ├── router.mjs           # Route by API prefix
│   ├── nodes.json           # Node registry
│   ├── nodes/
│   │   ├── main/            # Main node (was root)
│   │   ├── ops/             # Ops sidecar
│   │   └── other/           # Future nodes
```

### Node-to-Node Communication

Eventually nodes may communicate internally rather than through CLI.

---

**Next Steps:**
1. Review this design
2. Create `splectrum/` spot with root node
3. Create `splectrum/ops/` with sidecar
4. Test workflow end-to-end
