# Bug List

**Updated:** 2025-12-15

## Active Bugs

### 1. "No input schema found" error message not helpful
- **Location:** spl/introspection/whoami/index.js
- **Current:** Just says "No input schema found"
- **Wanted:** Show searched stack, e.g., "searched instantiates stack: [spl/container, spl/api], no input.avsc found"

