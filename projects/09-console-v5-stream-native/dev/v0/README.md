# v0 - Reusable Dev Environment Package

**Purpose:** Template for creating isolated development environments with work modules.

## What This Is

A **dev environment package** provides:
1. **Source work module** (`implementation/`) - Your code to develop/test
2. **Deploy script** - Creates isolated environment with your work module
3. **Test script** - Runs tests in the environment
4. **Destroy script** - Cleans up environments

Each deployment creates a fresh environment in `environments/` with:
- Its own `package.json` and `node_modules/`
- Copy of the work module from `implementation/`
- Isolated from other environments

## Structure

```
v0/
├── README.md                    # This file
├── package.json                # Enable ES modules for scripts
├── deploy.js                   # Create new environment
├── test.js                     # Test latest environment
├── destroy.js                  # Remove environment(s)
├── install/                    # Assets copied to each environment
│   ├── package.json.template   # Template for environment package.json
│   ├── install.js              # Optional: Custom install hook
│   └── ...                     # Any other files to copy
├── implementation/             # Source work module
│   └── pr09/                   # Your code lives here
│       ├── state/
│       ├── handling/
│       └── ...
└── environments/               # Created environments
    └── env-{timestamp}/        # Each deployment
        ├── package.json        # From install/package.json.template
        ├── node_modules/
        └── modules/
            └── pr09/           # Copied from implementation/
```

## How It Works

### 1. Add Your Code

Put your work module in `implementation/pr09/`:

```bash
cd implementation
mkdir -p pr09/state pr09/handling
# Create your modules
```

### 2. Deploy

Creates a fresh environment with your code:

```bash
node deploy.js
```

This:
1. Creates `environments/env-{timestamp}/`
2. Copies `implementation/pr09/` to `modules/pr09/`
3. Copies `install/package.json.template` to environment
4. Runs `install/install.js` hook (if it exists)
5. Runs `npm install`
6. Runs tests (if any)

### 3. Test

Run tests in the latest environment:

```bash
node test.js                    # Test latest environment
node test.js env-123456         # Test specific environment
```

Finds all `*-test.js` files in the environment and runs them.

### 4. Destroy

Clean up environments:

```bash
node destroy.js                 # Remove all environments (prompts)
node destroy.js env-123456      # Remove specific environment
```

## Cloning for New Iterations

When starting a new iteration (v1.1, v2.0, etc.), clone this package:

```bash
# From dev/ directory
cp -r v0 v1.1
cd v1.1

# Update implementation/ with your iteration code
# Run ./deploy.sh to create environment
# Work in environments/env-*/
```

Each iteration (v0, v1.0, v1.1, etc.) is independent with its own:
- Source work module
- Deployed environments
- Deploy/test/destroy scripts

## Install Assets

The `install/` folder contains files that are copied into each new environment:

- **package.json.template** - Template for environment package.json
  - Default dependencies: `avsc` (AVRO schema validation)
  - Edit this to change dependencies for all future environments

- **install.js** - Optional custom install hook
  - Runs after environment creation but before `npm install`
  - Use for: creating directories, generating files, custom setup
  - Export default async function: `export default async function(envPath, envName) { ... }`
  - Example included shows structure

- **Other files** - Any file in `install/` (except .template and .js files) gets copied to environment root

This keeps the root clean - templates and install assets stay in `install/`.

## Pattern

Based on pr08/v4 dev environment pattern:
- **Source** in `implementation/` (version controlled)
- **Environments** in `environments/` (gitignored, ephemeral)
- **Deploy script** creates isolated environment
- Each environment is self-contained

## Files

### deploy.sh

Creates new environment:
1. Generate timestamp-based environment name
2. Create `environments/env-{timestamp}/`
3. Generate `package.json`
4. Copy `implementation/pr09/` to `modules/pr09/`
5. Run `npm install`
6. Run tests

### test.sh

Runs tests in latest environment:
1. Find most recent environment
2. Find all `*-test.js` files
3. Run each test
4. Report results

### destroy.sh

Removes environments:
1. Prompt for confirmation
2. Remove specified environment(s)
3. Report what was removed

## Usage Examples

### Example 1: First Deployment

```bash
# Add your code
cd implementation
mkdir -p pr09/state
echo "module.exports = { hello: 'world' }" > pr09/state/context.js

# Deploy
cd ..
./deploy.sh
# Creates: environments/env-1732473021/

# Test
./test.sh
# Runs tests in env-1732473021/
```

### Example 2: Multiple Deployments

```bash
# First deployment
./deploy.sh
# Creates: env-1732473021/

# Modify code
cd implementation/pr09
# ... make changes ...

# Deploy again (new environment)
cd ../..
./deploy.sh
# Creates: env-1732473100/

# Both environments exist independently
ls environments/
# env-1732473021/
# env-1732473100/
```

### Example 3: Clone for New Iteration

```bash
# From dev/ directory
cp -r v0 v1.1
cd v1.1

# Update for iteration 1.1
cd implementation/pr09
# ... add iteration 1.1 code ...

# Deploy iteration 1.1
cd ../..
node deploy.js
# Creates: v1.1/environments/env-1732473200/
```

## Why This Structure?

**Source/Deploy Separation:**
- `implementation/` is version controlled (source of truth)
- `environments/` is gitignored (ephemeral, generated)
- Can create multiple environments from same source
- Each environment is isolated for testing

**Timestamp-Based Environments:**
- No conflicts between deployments
- Easy to keep multiple versions
- Clear chronological ordering
- Clean up old environments as needed

**Self-Contained Environments:**
- Own `package.json` and `node_modules/`
- Own copy of work module
- No shared dependencies between environments
- Delete environment = complete cleanup

## Reusability

This v0 package is designed to be cloned:

1. **Within project:** Clone to v1.0, v1.1, v2.0 for iterations
2. **Across projects:** Copy to other projects as dev env template
3. **Customize:** Modify deploy script for project-specific needs

The pattern scales from simple prototypes to complex work modules.

## Next Steps

1. Add your code to `implementation/pr09/`
2. Run `./deploy.sh` to create environment
3. Work and test in the environment
4. When ready for next iteration, clone this v0 package

---

**Pattern Source:** pr08/v4 dev environment API
**First Use:** Project 09 - Console v5 Stream Native
