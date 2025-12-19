**Type:** plain req
**Version:** 1.0.0
**Extends:** spl_api_type_v1.0.0

# spl_wrapper_type

## Purpose

Type for wrapping external tools (7zip, git, ffmpeg, etc.) within splectrum. Provides thin passthrough to underlying CLI tools while maintaining splectrum container structure.

## Philosophy

**Wrapper APIs are honest about what they are.** They don't try to abstract or improve the underlying tool's interface. Instead, they provide direct access with minimal splectrum overhead.

**Why wrappers?**
- External tools have established, well-documented CLIs
- Users who know the tool can use it immediately
- No translation layer to maintain or lag behind
- Full power of underlying tool without splectrum limiting it

**Native APIs vs Wrappers:**

| Aspect | Native API (spl/api) | Wrapper (spl/wrapper) |
|--------|---------------------|----------------------|
| Method names | DSL glossary | Tool's conventions |
| Arguments | input.avsc record with named fields | Passthrough string |
| Validation | Schema validation | Let tool validate |
| --help | Shows splectrum schema | Passes through to tool |
| Splectrum help | Automatic | Use /whoami |

## Input Schema

Wrappers use a record schema with passthrough args and splectrum control flags:

```json
{
  "type": "record",
  "name": "spl.wrapper.input",
  "fields": [
    { "name": "args", "type": "string", "doc": "Passthrough args (quoted, ready for shell)" },
    { "name": "dryRun", "type": "boolean", "default": false },
    { "name": "silent", "type": "boolean", "default": false }
  ]
}
```

**cli.js handles all parsing:**
- Extracts splectrum flags (--dryRun, --silent) based on schema
- Quotes and joins remaining args into `args` string
- Handler receives clean, structured input

## Help Behavior

**Wrapper help passes through to external tool:**

```bash
spl tools/git --help      # Shows git's help
spl tools/git -h          # Shows git's help (passthrough)
```

**Splectrum wrapper help via /whoami:**

```bash
spl tools/git/whoami      # Shows splectrum wrapper info
```

This design keeps wrappers as pure passthrough - the user gets the external tool's help, not a splectrum abstraction.

## Splectrum Flags

cli.js extracts these flags (defined in input.avsc) before passthrough:

- `--dryRun` - Show command that would execute, don't run it
- `--silent` - Suppress narrative output

```bash
spl tools/git --dryRun commit -m "message"  # Shows: would run "git commit -m \"message\""
spl tools/git --silent status               # Returns JSON only, no narrative
```

## Base64 Encoding

When args start with `base64=`, the wrapper decodes the base64 string and uses the decoded value as args. This bypasses shell escaping issues for special characters.

```bash
# Encode: commit -m "Hello!"
echo -n 'commit -m "Hello!"' | base64
# Y29tbWl0IC1tICJIZWxsbyEi

spl tools/git base64=Y29tbWl0IC1tICJIZWxsbyEi
# Runs: git commit -m "Hello!"
```

This is useful when content contains characters that cause shell escaping problems (!, quotes, etc.).

## Location Convention

Wrapper APIs go in the `tools/` package, not `spl/`:

- `tools/7zip` - 7-Zip wrapper
- `tools/git` - Git wrapper
- `tools/ffmpeg` - FFmpeg wrapper

This separates splectrum-native APIs from external tool wrappers.

## Handler Pattern

Wrapper handlers use a lib for shell execution - no direct imports in handlers:

**Handler (index.js):**
```javascript
export default async function(module) {
  const wrapper = await module.require('lib/spl/wrapper')
  const { args, dryRun, silent } = module.input()

  if (!args) {
    module.output('Usage: spl tools/mytool <args>', { usage: true })
    return
  }

  wrapper.exec(module, 'mytool', args, { dryRun, silent })
}
```

**Lib (_lib/wrapper.js):**
```javascript
import { execSync } from 'child_process'

export function create(module) {
  return {
    exec(module, tool, args, { dryRun, silent }) {
      const cmd = `${tool} ${args}`

      if (dryRun) {
        module.output(`Would run: ${cmd}`, { dryRun: true, command: cmd })
        return
      }

      try {
        const stdout = execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] })
        if (!silent) {
          module.output(stdout || '(no output)', { ok: true, command: cmd })
        } else {
          module.output(null, { ok: true, command: cmd, stdout })
        }
      } catch (err) {
        module.output(`Error: ${err.stderr || err.message}`, { ok: false, error: err.message })
      }
    }
  }
}
```

## Self-eval

- [ ] Extends spl/api
- [ ] Has _schemas/input.avsc with record type (args, dryRun, silent)
- [ ] Handler uses `module.require('lib/...')` only (no direct imports)
- [ ] Shell execution logic in _lib/ file
- [ ] base64= prefix decoded before execution
- [ ] Documentation explains passthrough philosophy
- [ ] Help behavior documented (--help to tool, /whoami for splectrum)

## Comments

The wrapper pattern acknowledges that external tools are first-class citizens with their own well-designed interfaces. Splectrum's role is access and integration, not abstraction.

Higher-level APIs (e.g., `spl/archive`) can be built ON TOP of wrappers to provide splectrum-native interfaces when needed. The layers are:

1. `tools/7zip` - raw passthrough
2. `spl/archive` (future) - splectrum-native with methods like `pack`, `unpack`

This separation keeps each layer honest about what it provides.
