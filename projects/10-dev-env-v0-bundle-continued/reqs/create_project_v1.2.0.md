**Type:** plain req

# create project

## Spec

Procedure to create a project from a backlog item.

### Steps

1. **Read backlog item** - Go to projects/BACKLOG.md, read top item
2. **Determine/validate project type** - See recipe below
3. **Look up in glossary** - Find project type in `stepping stones glossary` (e.g., `exploration project`)
4. **Get req** - Read req file from Req column
5. **Follow req phases** - Execute create phase from the req (which extends `blank project`)
6. **Remove backlog item** - Delete the item from BACKLOG.md (it's now a project, not a backlog item)
7. **Clone dev bundle** - Clone model dev env to new project (see below)

### Project Type Recipe

**Criterion:** Can all work be executed autonomously from existing reqs?

| Situation | Action |
|-----------|--------|
| Type specified in backlog item | Validate against criterion; question if mismatch |
| Type not specified | Determine using criterion |

| Answer | Project Type |
|--------|--------------|
| Yes - reqs exist for autonomous execution | `blank project` |
| No - requires discovering reqs through collaboration | `exploration project` |

### Dev Bundle Cloning

Clone the model dev environment to the new project:

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
- [ ] Project type determined/validated (using autonomy criterion)
- [ ] Glossary lookup performed (via `stepping stones glossary`)
- [ ] Req phases followed
- [ ] Project folder created with required artifacts (including reqs/)
- [ ] Backlog item removed from BACKLOG.md
- [ ] Dev bundle cloned (v0 + first iteration)

## Comments

v1.2.0: Added project type recipe with autonomy criterion (discover when not specified, validate when specified). Added reqs/ folder to project artifacts.

v1.1.0: Added backlog item removal (step 6) and dev bundle cloning (step 7). References use glossary terms, not paths.
