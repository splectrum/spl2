**Type:** plain req
**Instance of:** package_v1.0.0.md

# spl package (work module version)

## Spec

Core Splectrum package - work module implementation containing the `dev/` API.

**Purpose:** Provide Dev Environment API for autonomous development with test-driven implementation.

**Scope (work module):** Single API implementation
- API: `spl/dev/` - Dev Environment API

**Full implementation:** When implemented as base module, will contain multiple APIs:
- `spl/runtime/` - Runtime context management
- `spl/console/` - Console wrapper API
- `spl/dev/` - Dev Environment API (this work module)
- `spl/data/` - Data layer operations
- (others as designed)

**Structure:**
```
spl/
├── README.md
├── _reqs/
│   ├── package_v1.0.0.md
│   ├── spl_package_v1.0.0.md
│   └── [selfevals]
└── dev/               # API (only one in work module)
    ├── README.md
    └── _reqs/
```

**Entry point:** README.md at package level points to `_reqs/` for specifications.

Scope: Package instance (work module version).

Purpose: Define the cut-down spl package for this work module - contains only dev API.

## Self-eval

### Structure verification
- [ ] README.md exists at package root
- [ ] _reqs/ folder exists
- [ ] _reqs/package_v1.0.0.md exists (type spec)
- [ ] _reqs/spl_package_v1.0.0.md exists (this spec)

### Content verification
- [ ] dev/ API folder exists
- [ ] At least dev/ API is present

### Requirements chain
- [ ] Instance of package_v1.0.0.md
- [ ] References valid type spec

## Comments

This is a **cut-down version** for the work module. The instance only contains `dev/` API.

The full base module implementation will have the complete set of APIs under `spl/`.

Self-eval tests only what's required for this work module version.
