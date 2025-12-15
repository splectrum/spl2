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
| Arguments | input.avsc record with named fields | String passthrough |
| Validation | Schema validation | Let tool validate |
| --help | Shows splectrum schema | Shows tool's help |
| Purpose | Splectrum-native functionality | Access external tools |

## Input Schema

Wrappers use `input.avsc` with `type: string`:

```json
{
  "type": "string",
  "name": "spl.wrapper.input",
  "doc": "Passthrough arguments for wrapped tool"
}
```

**Schema inheritance stops at string type.** No field merging from parent records.

## Global Flags Convention

Handlers MAY implement global flags for splectrum integration:

- `--help` - Run underlying tool's help (e.g., `7z --help`)
- `--dryRun` - Show command that would execute, don't run it
- `--silent` - Suppress narrative output

**Global flags must come first**, before passthrough args:

```bash
spl tools/7zip --help                      # Shows 7z help
spl tools/7zip --dryRun a archive.7z ./src # Shows: would run "7z a archive.7z ./src"
spl tools/7zip a archive.7z ./src          # Runs: 7z a archive.7z ./src
```

Handlers collect positional args (input[0], input[1], etc.) and join them for the underlying tool.

## Location Convention

Wrapper APIs go in the `tools/` package, not `spl/`:

- `tools/7zip` - 7-Zip wrapper
- `tools/git` - Git wrapper
- `tools/ffmpeg` - FFmpeg wrapper

This separates splectrum-native APIs from external tool wrappers.

## Handler Pattern

Typical wrapper handler:

```javascript
export default async function(module) {
  const { execSync } = await module.require('child_process')
  const input = module.input()

  // Collect positional args
  const args = []
  for (let i = 0; input[i] !== undefined; i++) {
    args.push(input[i])
  }

  // Handle global flags
  if (input.help) {
    const output = execSync('tool --help', { encoding: 'utf8' })
    return module.output(output)
  }

  const cmd = `tool ${args.join(' ')}`

  if (input.dryRun) {
    return module.output(`Would run: ${cmd}`, { dryRun: true, command: cmd })
  }

  // Execute
  try {
    const output = execSync(cmd, { encoding: 'utf8' })
    module.output(output, { ok: true, command: cmd })
  } catch (err) {
    module.output(`Error: ${err.message}`, { ok: false, error: err.message })
  }
}
```

## Self-eval

- [ ] Extends spl/api
- [ ] Has _schemas/input.avsc with type: string
- [ ] Documentation explains passthrough philosophy
- [ ] Global flags convention documented

## Comments

The wrapper pattern acknowledges that external tools are first-class citizens with their own well-designed interfaces. Splectrum's role is access and integration, not abstraction.

Higher-level APIs (e.g., `spl/archive`) can be built ON TOP of wrappers to provide splectrum-native interfaces when needed. The layers are:

1. `tools/7zip` - raw passthrough
2. `spl/archive` (future) - splectrum-native with methods like `pack`, `unpack`

This separation keeps each layer honest about what it provides.
