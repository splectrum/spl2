# Tools Product Set

**Purpose:** Comprehensive CLI tool wrappers for AI-driven automation with human security gatekeeping.

**Philosophy:** AI orchestrates, human authorizes. Provide choice - AI picks the right tool for the job.

---

## Core Features

### Schema-driven wrapper parsing (DONE)
- `input.avsc` defines passthrough args and splectrum flags
- cli.js extracts flags, quotes args, passes clean input to handler
- Help passes through to tool, /whoami for splectrum help

### Interactive mode (TODO)
- `--interactive` flag in wrapper schema
- Uses `spawn` with `stdio: 'inherit'` for terminal passthrough
- Enables sudo prompts, password entry, editors
- AI orchestrates, human gatekeeps privileges

---

## Tool Wrappers

**Principle:** Wrap tools that provide truly external capabilities. If JS can do it natively, prefer script helpers over wrappers.

### Tier 1 - Core (truly external, no substitute) — v0.2.0
- [x] `tools/git` - version control
- [x] `tools/docker` - container management
- [x] `tools/pear` - Holepunch Pear runtime (build, deploy, run, manage P2P nodes)
- [x] `tools/ssh` - remote operations

### Tier 2 - Productivity (external capability or major ergonomics) — v0.2.0
- [x] `tools/7zip` - archive management
- [x] `tools/ffmpeg` - media processing
- [x] `tools/gh` - GitHub CLI (PRs, issues, releases, actions)
- [x] `tools/rsync` - efficient file sync/deployment

### Tier 3 - Sysadmin (privileged, security boundary matters) — POSTPONED
- [ ] `tools/apt` - package management (interactive)
- [ ] `tools/systemctl` - service management
- [ ] `tools/ps` - process list
- [ ] `tools/kill` - process control
- [ ] `tools/mount` - filesystem mounting (interactive)
- [ ] `tools/iptables` - firewall rules (interactive)
- [ ] `tools/useradd` - user management (interactive)
- [ ] `tools/cron` - scheduled tasks
- [ ] `tools/journalctl` - system logs

### Tier 4 - Niche (use-case dependent) — POSTPONED
- [ ] `tools/npm` - package management (consider JS programmatic API)
- [ ] `tools/pandoc` - document conversion
- [ ] `tools/imagemagick` - image manipulation
- [ ] `tools/make` - build automation (existing Makefiles)

### Deprioritized (JS-native alternatives exist)

These don't need wrappers - use script helpers instead:

| Tool | JS Alternative |
|------|----------------|
| jq | `JSON.parse()`, object manipulation |
| curl | `fetch()` |
| find | glob libraries |
| grep | regex + file reading |
| tar | archiving libraries |
| chmod/ln | `fs` module |
| watch/xargs | loops |
| df/du | consider if needed |

---

## Script Helper Libraries — POSTPONED

**Purpose:** JS-native capabilities for AI scripting - replacing shell tools with ergonomic JS helpers.

### File System (`lib/spl/fs`)
```javascript
glob(pattern)              // find files by pattern
read(path)                 // read file, auto-detect encoding
write(path, content)       // write file
exists(path)               // check existence
stat(path)                 // file metadata
tree(path, depth)          // directory tree
```

### Data (`lib/spl/data`)
```javascript
json.read(path)            // parse JSON file
json.write(path, obj)      // write JSON file
json.merge(a, b)           // deep merge
csv.parse(content)         // parse CSV
csv.stringify(data)        // generate CSV
```

### HTTP (`lib/spl/http`)
```javascript
fetch(url, opts)           // fetch wrapper with retry, timeout
get(url)                   // convenience GET
post(url, body)            // convenience POST
download(url, path)        // download file
```

### Process (`lib/spl/proc`)
```javascript
exec(cmd, opts)            // promise-based exec
spawn(cmd, args, opts)     // spawn with streaming
which(cmd)                 // find executable
env(key)                   // environment variable
```

### Text (`lib/spl/text`)
```javascript
template(str, vars)        // simple templating
match(str, pattern)        // regex with named groups
lines(str)                 // split into lines
indent(str, n)             // indentation
```

### Archive (`lib/spl/archive`)
```javascript
zip.create(files, dest)    // create zip
zip.extract(src, dest)     // extract zip
tar.create(files, dest)    // create tarball
tar.extract(src, dest)     // extract tarball
```

### Crypto (`lib/spl/crypto`)
```javascript
hash(data, algo)           // hash (sha256, etc)
uuid()                     // generate UUID
base64.encode(data)        // base64 encode
base64.decode(str)         // base64 decode
```

### Status
- [ ] Design helper API patterns
- [ ] Implement core helpers (fs, data, http)
- [ ] Implement extended helpers (proc, text, archive, crypto)

---

## Implementation Notes

### Standard wrapper (existing pattern)
```javascript
const { args, dryRun, silent } = module.input()
const cmd = `tool ${args}`
execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] })
```

### Interactive wrapper (new pattern)
```javascript
const { args, dryRun, silent, interactive } = module.input()
const cmd = `sudo tool ${args}`
if (interactive) {
  // Spawn with inherited stdio for password prompts
  spawnSync('sudo', ['tool', ...argsArray], { stdio: 'inherit' })
} else {
  execSync(cmd, { encoding: 'utf8' })
}
```

### Shared helpers in spl/wrapper/_lib
```javascript
// lib/spl/wrapper helpers
checkInstalled(cmd)           // is tool available?
detectPackageManager()        // apt/brew/winget/etc
installPackage(recipe, opts)  // runs install (interactive)
```

### Local install recipe (tools/X/install)
```javascript
const wrapper = await module.require('lib/spl/wrapper')
const { interactive } = module.input()

// Tool-specific knowledge - package names may differ
const recipe = {
  apt: 'ffmpeg',
  brew: 'ffmpeg',
  winget: 'ffmpeg'
}

await wrapper.installPackage(recipe, { interactive })
```

Lib handles mechanics, tool knows its recipe.

---

## Security Model

- AI drives automation through splectrum wrappers
- `--interactive` pops terminal for human authorization
- Human enters credentials, approves actions
- Control returns to AI to continue workflow

No credentials stored, no privilege escalation without human in loop.

---

## Agent SDK Integration

### Sandboxed Agent Execution
```javascript
import { query } from "@anthropic-ai/claude-agent-sdk";

query({
  prompt: "Set up development environment and deploy",
  options: {
    allowedTools: ["Read", "Bash(spl:*)"],  // ONLY spl commands
    permissionMode: "askHuman"
  }
})
```

Agent can use:
- `spl tools/git push`
- `spl tools/apt --interactive install nodejs`
- `spl tools/docker build`

Agent CANNOT use:
- Raw shell commands
- Arbitrary code execution
- Anything outside splectrum wrappers

**Wrappers become the security boundary.**

### Audit Trail
- All spl commands logged with timestamps
- Request/response capture (Twin Pair 2)
- Human authorization events tracked
- Full replay capability for debugging

### Permission Patterns
- `Bash(spl:*)` - all splectrum commands
- `Bash(spl:tools/*)` - only tool wrappers
- `Bash(spl:tools/git)` - specific tool only

### Human-in-the-Loop
- `--interactive` for sudo/credentials
- Agent pauses, human authorizes, agent continues
- No credential storage
- Clear audit of what was approved
