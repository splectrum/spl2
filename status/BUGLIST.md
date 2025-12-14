# Bug List

**Created:** 2025-12-14

## Fixed

### 1. --help returns "No input schema found"
- **Location:** cli.js rewriteHelp()
- **Fix:** Check if method already ends with /whoami before appending
- **Fixed:** 2025-12-14

### 4. spl index.json structure incorrect
- **Location:** All index.json files
- **Fix:** New type/instance children structure implemented
- **Fixed:** 2025-12-14

## Active Bugs

### 2. Input schemas not properly implemented across methods
- **Location:** All methods
- **Expected:** Each method should have input.avsc defining its parameters, --usage should show all params
- **Actual:** --usage only shows base flags (dryRun, silent, help), method-specific params missing
- **Action:** Systematic audit of input schemas on all methods

### 3. spl/whoami doesn't show expected children
- **Location:** whoami output for containers with children
- **Expected:** Should display instance.children info in whoami output
- **Actual:** Children list not visible in whoami output
- **Note:** Now easier to implement with new type/instance structure
