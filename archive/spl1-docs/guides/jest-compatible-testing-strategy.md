# Jest-Compatible Testing Strategy for SPL Platform

## Overview

This document outlines a strategy for implementing Jest-compatible testing syntax for the SPL platform while preserving SPL's unique architectural principles and cross-runtime compatibility goals.

## Background

### Current SPL Testing Approach

SPL currently implements a comprehensive testing framework (`gp/test`) using JSON-based test definitions:

```json
{
    "key": "basic-test__api_method__description",
    "name": "Descriptive test name",
    "command": "api/method/command --param=value",
    "selectors": {
        "status": "$.headers.spl.execute.status",
        "errorMessage": "$.headers.spl.execute.error.message"
    },
    "expect": [
        {
            "key": "status",
            "operation": "equals",
            "expectation": "completed"
        }
    ]
}
```

### Jest Testing Paradigm

Jest provides an industry-standard JavaScript testing syntax:

```javascript
describe('API Method Tests', () => {
    beforeEach(() => {
        // Setup logic
    });
    
    it('should complete successfully', async () => {
        const result = await executeCommand('api/method/command --param=value');
        expect(result.headers.spl.execute.status).toBe('completed');
        expect(result.headers.spl.execute.error.message).toBeNull();
    });
});
```

## Core Design Philosophy

### SPL's Architectural Principles

1. **Command-Line First**: APIs exposed as CLI commands for universal accessibility
2. **Language Agnostic**: Any tool/language can invoke SPL commands
3. **Controlled Access**: Framework-managed context via `spl.action()` patterns
4. **Runtime Independence**: Compatible with Node.js, Bare runtime, and future engines

### Jest Compatibility Goals

1. **Developer Ergonomics**: Familiar syntax for JavaScript developers
2. **Rich Assertions**: Expressive test expectations
3. **Test Organization**: Grouped test suites with setup/teardown
4. **Better Error Messages**: Clear, descriptive failure reporting

## Architecture Overview

### Multi-Layer Generation from AVRO

```
AVRO Schema (foundation)
    ↓
┌─────────────────┬─────────────────┐
│   CLI Interface │  Jest Interface │  (parallel generated layers)
│   (current)     │  (new)          │
└─────────────────┴─────────────────┘
    ↓                       ↓
SPL Execution Engine (shared)
```

Both the CLI interface and Jest interface are **peer layers** generated from the same AVRO foundation, rather than Jest being a wrapper around CLI.

## Implementation Strategy

### Phase 1: JavaScript Test Interface

Create a Jest-compatible interface that generates SPL execution calls parallel to the CLI interface:

```javascript
// Jest-style test definition
describe('File Operations', () => {
    beforeEach(async () => {
        await spl.execute('gp/config/set-session-working-dir --path=/tmp/test-session');
    });
    
    it('should write file successfully', async () => {
        const result = await spl.execute('gp/fs/write --file=test.txt --content=hello');
        
        expect(result.headers.spl.execute.status).toBe('completed');
        expect(result.value.filePath).toContain('/tmp/test-session/test.txt');
    });
    
    afterEach(async () => {
        await spl.execute('gp/config/clear-session-working-dir');
    });
});
```

**Implementation Details:**
- `spl.execute()` function calls SPL execution engine directly (parallel to CLI)
- Returns structured response objects (eliminates JSONPath selectors)
- Uses standard Jest assertions (`expect().toBe()`, etc.)
- Maintains SPL's workspace isolation and error handling

### Phase 2: Auto-Generated Tooling

Leverage SPL's existing infrastructure for comprehensive code generation:

#### Current Foundation
- Command schemas (transitioning to AVRO)
- `command-line-args` parsing
- `command-line-usage` generation
- Consistent `spl.action()` patterns

#### Dual Interface Generation

From a single AVRO schema, generate both interfaces:

**CLI Interface (current):**
```bash
# Generated command-line-args parsing
spl_execute dev gp/fs/write --file=test.txt --content=hello
```

**Jest Interface (new):**
```javascript
// Generated JavaScript API
await spl.gp.fs.write({ file: 'test.txt', content: 'hello' });
```

#### Generated Artifacts

**1. TypeScript Definitions**
```typescript
// Auto-generated from AVRO schemas
interface GpFsWriteArgs {
    file: string;
    content: string;
    encoding?: string;
}

interface SplResponse<T = any> {
    headers: {
        spl: {
            execute: {
                status: 'completed' | 'error';
                error?: { message: string };
                appRoot: string;
            }
        }
    };
    value: T;
}
```

**2. Fluent API Wrappers**
```javascript
// Generated command builders
const spl = {
    gp: {
        fs: {
            write: (args: GpFsWriteArgs) => 
                `gp/fs/write --file=${args.file} --content="${args.content}"`
        }
    }
};
```

**3. Jest Test Helpers**
```javascript
// Generated test utilities
const splTest = {
    expect: (command: string) => ({
        toComplete: () => /* assertion logic */,
        toReturn: (selector: string, value: any) => /* selector validation */,
        toHaveStatus: (status: string) => /* status checking */
    })
};
```

**4. IDE Support**
```json
// Generated for VS Code extensions
{
    "gp/fs/write": {
        "description": "Write content to file",
        "parameters": [
            {"name": "file", "type": "string", "required": true},
            {"name": "content", "type": "string", "required": true},
            {"name": "encoding", "type": "string", "required": false}
        ]
    }
}
```

### Phase 3: Cross-Runtime Compatibility

#### Bare Runtime Integration

The auto-generation approach ensures full compatibility with SPL's Bare runtime ambitions:

**Platform-Agnostic Generation Pipeline:**
```
AVRO Schema (universal)
    ↓
command-line-args (universal)
    ↓
Generated tooling (runtime-specific)
```

**Benefits:**
- **Core logic** ports once to Bare runtime
- **Generated tooling** works automatically across runtimes
- **Same schemas** drive everything
- **CLI interface** remains universal

#### Browser Compatibility

For testing scenarios requiring browser execution:
- Pure JavaScript generation (no Node.js-specific APIs)
- Bundling compatibility via tools like Vite/Webpack
- Polyfills for platform-specific functionality where needed

## Technical Implementation

### Core SPL Test Wrapper

```javascript
// spl-jest-wrapper.js
class SplTestRunner {
    async execute(command) {
        // Delegate to existing SPL execution
        const result = await this.executeSplCommand(command);
        return this.parseResponse(result);
    }
    
    async executeSplCommand(command) {
        // Implementation depends on runtime:
        // - Node.js: child_process.exec()
        // - Bare runtime: appropriate Bare execution method
        // - Browser: WebAssembly or server delegation
    }
    
    parseResponse(rawOutput) {
        // Parse SPL JSON response
        // Apply response structure normalization
        // Return typed response object
    }
}

// Jest-compatible globals
global.spl = new SplTestRunner();
```

### Test Transformation Layer

```javascript
// Transform Jest syntax to SPL execution
class JestToSplTransformer {
    transformTestSuite(jestTests) {
        // Convert describe/it blocks to SPL test definitions
        // Generate appropriate workspace isolation
        // Map Jest assertions to SPL expectations
    }
    
    generateSplTestConfig(testDefinition) {
        // Output: JSON compatible with existing gp/test framework
        // Enables reuse of existing test execution infrastructure
    }
}
```

## Migration Strategy

### Backward Compatibility

- **Existing JSON tests** continue to work unchanged
- **New Jest-style tests** can be added incrementally
- **Unified reporting** from both test types
- **Same execution pipeline** for both approaches

### Developer Adoption

1. **Gradual Introduction**: New tests can use Jest syntax
2. **Training Materials**: Documentation showing JSON → Jest equivalent patterns
3. **Tooling Support**: IDE extensions for both formats
4. **Team Choice**: Projects can choose preferred syntax

## Benefits

### For Developers

1. **Familiar Syntax**: Industry-standard Jest patterns
2. **Better IDE Support**: Autocomplete, type checking, debugging
3. **Expressive Tests**: Rich assertion library
4. **Improved Productivity**: Faster test writing and debugging

### For SPL Platform

1. **Architectural Integrity**: No changes to core execution model
2. **Universal Compatibility**: Works across all target runtimes
3. **Enhanced Adoption**: Lower barrier to entry for JavaScript developers
4. **Future-Proof**: Generated tooling scales with schema evolution

### For Cross-Runtime Goals

1. **Bare Runtime Ready**: Auto-generated code works on Bare out of the box
2. **Browser Compatible**: Bundling and polyfills enable web testing
3. **Consistent Interface**: Same Jest syntax across all runtimes
4. **Maintenance Efficiency**: Single schema drives all tooling

## Implementation Timeline

### Phase 1: Foundation (4-6 weeks)
- Implement basic `spl.execute()` wrapper
- Create Jest assertion helpers
- Develop JSON ↔ Jest transformation utilities

### Phase 2: Auto-Generation (6-8 weeks)
- AVRO schema integration
- TypeScript definition generation
- Fluent API wrapper generation
- IDE support file generation

### Phase 3: Cross-Runtime (8-12 weeks)
- Bare runtime execution backend
- Browser compatibility layer
- Performance optimization
- Comprehensive testing

## Conclusion

This strategy provides a path to Jest-compatible testing while preserving SPL's core architectural principles. By leveraging auto-generation from existing infrastructure, we can deliver superior developer experience without compromising the platform's universal accessibility and cross-runtime compatibility goals.

The approach respects SPL's "lifted out of code" philosophy by treating both CLI and Jest interfaces as **peer generated layers** from the same AVRO foundation, ensuring consistency and eliminating the hierarchy between them.

---

*This document outlines the strategic approach for implementing Jest-compatible testing in the SPL platform, balancing developer ergonomics with architectural integrity and cross-runtime compatibility.*