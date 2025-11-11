**Requirements:** See `../Twin_pair_1_requirements_v1.0.0.md`

# Runtime POC - Development Environment

SPL2 runtime structure proof of concept development environment.

## Prerequisites

- Node.js >= 18.0.0 (Latest LTS recommended)
- npm (included with Node.js)

## Deployment Management

### Build

Creates the development environment from scratch:

```bash
npm run build
```

Validates Node.js version and installs dependencies (if any).

### Validate

Verifies the environment is correctly set up:

```bash
npm run validate
```

Checks:
- Node.js version meets requirements
- File structure exists
- package.json is valid
- Module system works

### Teardown

Removes build artifacts:

```bash
npm run teardown
```

Removes `node_modules/` and `package-lock.json`.

**Note:** To completely remove `runtime-poc/`, delete the directory from parent:
```bash
cd ../
rm -rf runtime-poc/
```

### Full Rebuild Cycle

Test the immutable deployment pattern:

```bash
npm run teardown && npm run build && npm run validate
```

## Philosophy

This deployment follows the **immutable deployment** principle:
- Rebuild from scratch rather than update as default
- Forces clarity of dependencies
- Validates reproducibility
- Prevents drift

## Structure

```
runtime-poc/
├── package.json          # Project manifest and scripts
├── src/                  # Source code (to be populated)
├── scripts/              # Deployment management scripts
│   ├── build.js         # Build from scratch
│   ├── teardown.js      # Remove artifacts
│   └── validate.js      # Validate environment
└── README.md            # This file
```
