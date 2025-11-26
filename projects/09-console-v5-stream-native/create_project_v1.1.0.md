**Type:** plain req

# create project

## Spec

Procedure to create a project from a backlog item.

### Steps

1. **Read backlog item** - Go to projects/BACKLOG.md, read top item
2. **Identify project type** - From Type field in backlog item (e.g., "Exploration Project")
3. **Look up in glossary** - Find project type in `stepping stones glossary` (e.g., `exploration project`)
4. **Get req** - Read req file from Req column
5. **Follow req phases** - Execute create phase from the req (which extends `blank project`)
6. **Remove backlog item** - Delete the item from BACKLOG.md (it's now a project, not a backlog item)
7. **Clone dev bundle** - Clone model dev env to new project (see below)

### Dev Bundle Cloning

Clone the model dev environment from the most recent project that has one:

```bash
cd projects/NN-new-project/
mkdir dev
cp -r ../09-console-v5-stream-native/dev/v0 dev/v0
cd dev/v0
node clone.js ../v1.0   # Create first working iteration
```

Update the cloned v0's package.json name/description for the new project.

**Note:** The source location (currently pr09) will change as the model evolves. Check `status/CURRENT.md` for the current model dev env location.

### Related

- Stepping stones: `project`, `blank project`, `exploration project`
- Counterpart: `close project` howto

Scope: Procedure.

Purpose: Standard procedure for creating projects from backlog.

## Self-eval

- [ ] Backlog item read
- [ ] Project type identified
- [ ] Glossary lookup performed (via `stepping stones glossary`)
- [ ] Req phases followed
- [ ] Project folder created with required artifacts
- [ ] Backlog item removed from BACKLOG.md
- [ ] Dev bundle cloned (v0 + first iteration)

## Comments

v1.1.0: Added backlog item removal (step 6) and dev bundle cloning (step 7). References use glossary terms, not paths.
