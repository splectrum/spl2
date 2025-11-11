**Requirements:** See `Twin_pair_1_requirements_v1.0.0.md`

# Deployment Management Template

Template for creating reproducible development environment deployments using the immutable deployment pattern.

**Created:** Project 03 - Runtime Structure "Hello World"
**Validated Through:** runtime-poc/ deployment implementation

---

## Philosophy: Immutable Deployments

**Principle:** Rebuild from scratch rather than update as the default pattern.

**Why this matters:**
- **Forces clarity** - Can't rebuild if you don't understand your dependencies
- **Validates reproducibility** - Proves setup works repeatedly, not just once
- **Prevents drift** - No accumulated cruft from incremental updates
- **Fits testing** - Clean environment for each test cycle
- **Documents truth** - Deployment script IS the documentation

**When to use:**
- Development environment setup
- Testing environments
- Any deployment where reproducibility matters more than update speed

---

## Pattern: Three Core Scripts

Every deployment has three fundamental operations:

### 1. Build (from scratch)

Creates complete working environment starting from empty/clean state.

**Responsibilities:**
- Check prerequisites (Node.js version, required tools)
- Create directory structure
- Install dependencies
- Output clear logging (what's happening, what succeeded/failed)
- Fail gracefully with helpful error messages

**Example (Node.js):**
```javascript
// Check Node.js version
const currentVersion = process.version;
const requiredMajor = 18;
const currentMajor = parseInt(currentVersion.slice(1).split('.')[0]);

if (currentMajor < requiredMajor) {
  console.error(`Node.js >= ${requiredMajor}.0.0 required, found ${currentVersion}`);
  process.exit(1);
}

// Install dependencies
if (hasDependencies) {
  execSync('npm install', { stdio: 'inherit' });
}
```

### 2. Teardown (remove artifacts)

Removes all artifacts created by build, returns to clean state.

**Responsibilities:**
- Remove generated directories (node_modules/, build/, dist/, etc.)
- Remove lock files (package-lock.json, etc.)
- Document any manual cleanup needed
- Output clear logging (what was removed)
- Handle missing artifacts gracefully (already clean)

**Note:** Script running from inside its own directory can't delete that directory. Document full removal command for parent directory execution.

**Example (Node.js):**
```javascript
// Remove build artifacts
const artifacts = ['node_modules', 'package-lock.json', 'dist', 'build'];

for (const artifact of artifacts) {
  if (existsSync(artifact)) {
    rmSync(artifact, { recursive: true, force: true });
    console.log(`✓ Removed ${artifact}`);
  }
}

// Document full removal
console.log('To remove completely: cd .. && rm -rf project-name/');
```

### 3. Validate (prove it works)

Verifies environment is correctly set up and ready for use.

**Responsibilities:**
- Check prerequisites still met
- Verify file structure exists
- Validate configuration files
- Test basic functionality (imports work, tools accessible)
- Output clear success/failure indication
- Exit 0 on success, non-zero on failure

**Validation without test framework:**
Use self-contained validation scripts that run checks and report results. No need for traditional unit test framework - simple Node.js scripts with clear logging and exit codes work well.

**Example (Node.js):**
```javascript
function validateNodeVersion() {
  const version = process.version;
  // ... check version
  return success;
}

function validateFileStructure() {
  const required = ['package.json', 'src', 'scripts'];
  return required.every(path => existsSync(path));
}

// Run all validations
const allPassed = [
  validateNodeVersion(),
  validateFileStructure(),
  // ... other checks
].every(check => check === true);

process.exit(allPassed ? 0 : 1);
```

---

## Integration: npm Scripts

Expose deployment operations via npm scripts in `package.json`:

```json
{
  "scripts": {
    "build": "node scripts/build.js",
    "teardown": "node scripts/teardown.js",
    "validate": "node scripts/validate.js"
  }
}
```

**Benefits:**
- Standard interface across projects
- Portable (works wherever npm works)
- Self-documenting (scripts visible in package.json)
- Easy to invoke: `npm run build`, `npm run validate`, etc.

---

## Project Structure

```
project-name/
├── package.json          # Project manifest with npm scripts
├── scripts/              # Deployment management scripts
│   ├── build.js         # Build from scratch
│   ├── teardown.js      # Remove artifacts
│   └── validate.js      # Validate environment
├── src/                  # Source code
└── README.md            # Usage documentation
```

**Documentation in README.md:**
- Prerequisites (Node.js version, required tools)
- How to build, teardown, validate
- Full rebuild cycle example
- Philosophy explanation (why immutable deployment)

---

## Prerequisites Management

**Document clearly:**
- What must exist before build can run (Node.js version, system tools, etc.)
- How to install prerequisites
- Where to get required tools

**Check in build script:**
- Validate prerequisites before attempting build
- Fail early with clear, actionable error messages
- Show current vs required versions

**Example error message:**
```
✗ Node.js version 16.20.0 found, but >= 18.0.0 required
  Please install Node.js LTS from https://nodejs.org/
```

---

## Testing the Pattern

**Validate deployment through use:**

```bash
# Full rebuild cycle (should succeed)
npm run teardown && npm run build && npm run validate

# Build is idempotent (should handle existing environment)
npm run build && npm run build

# Teardown from clean state (should handle gracefully)
npm run teardown && npm run teardown
```

**Success criteria:**
- Complete teardown/rebuild cycle works (at least 2 cycles)
- Build from clean state succeeds
- Validation passes after build
- Clear logging at each step
- Errors are helpful and actionable

---

## Adaptation Guidance

**For different languages/platforms:**
- Same three-script pattern applies (build, teardown, validate)
- Adapt prerequisite checks (Python version, Java version, etc.)
- Use appropriate package managers (pip, cargo, etc.)
- Adjust artifacts to remove (venv/, target/, etc.)

**For different deployment types:**
- **Testing environments:** Add test data setup to build, cleanup to teardown
- **Docker-based:** Scripts manage docker-compose, container lifecycle
- **Cloud deployments:** Scripts manage infrastructure as code (Terraform, etc.)

**Keep minimal:**
- Only add what's needed NOW
- Discover requirements through use
- Don't speculate about future needs

---

## Learnings from runtime-poc/ Implementation

### What Worked Well
- Self-contained validation scripts (no test framework needed at this stage)
- npm scripts provide clean, standard interface
- Clear logging with colors makes output readable
- Checking prerequisites early prevents confusing errors later

### Discovered Limitations
- Script can't delete its own parent directory (must document manual removal)
- node_modules/ can be large - teardown takes time
- Version checking needs parsing (semver library could help for complex cases)

### Trade-offs Made
- **Teardown limitation:** Accepted - documented full removal command
- **No test framework:** Deferred - validation scripts sufficient for now
- **Simple prerequisite check:** Good enough - can enhance if needed

### Future Considerations
- Parallel dependency installation for speed?
- Caching node_modules/ for faster rebuilds?
- More sophisticated prerequisite checking?

**Note:** These are NOT requirements for using this template. Start minimal, add based on evidence from your specific project.

---

## Template Usage

1. **Copy the pattern:**
   - Create scripts/ directory
   - Implement build.js, teardown.js, validate.js
   - Add npm scripts to package.json

2. **Adapt for your project:**
   - Define your prerequisites
   - List your artifacts to clean
   - Specify your validation checks

3. **Document in README:**
   - Usage instructions
   - Prerequisites
   - Philosophy explanation

4. **Test thoroughly:**
   - Run multiple teardown/rebuild cycles
   - Verify validation catches broken deployments
   - Ensure errors are clear and actionable

5. **Validate through use:**
   - Use throughout development
   - Refine based on pain points
   - Keep it simple and practical

---

## See Also

- **Reference Implementation:** `runtime-poc/` in this project
- **Requirements:** `Twin_pair_1_requirements_v1.0.0.md`
- **Philosophy:** Immutable deployments, minimal and complete
- **Related Concepts:** Infrastructure as Code, Declarative Configuration, Reproducible Builds
