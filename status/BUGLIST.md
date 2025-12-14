# Bug List

**Updated:** 2025-12-15

## Active Bugs

### 1. "No input schema found" error message not helpful
- **Location:** spl/introspection/whoami/index.js
- **Current:** Just says "No input schema found"
- **Wanted:** Show searched stack, e.g., "searched instantiates stack: [spl/container, spl/api], no input.avsc found"

### 2. Input schemas audit needed across methods
- **Location:** All methods
- **Expected:** Each method should have input.avsc defining its parameters
- **Actual:** --usage only shows base flags (dryRun, silent, help), method-specific params missing
- **Action:** Systematic audit of input schemas on all methods

## Feature Ideas

### --methods flag for whoami
- Show all available methods on a container and where they come from
- Like --usage for arguments, --methods for method discoverability
