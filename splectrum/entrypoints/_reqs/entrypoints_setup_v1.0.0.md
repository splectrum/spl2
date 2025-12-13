**Type:** plain req
**Version:** 1.0.0

# entrypoints_setup

## Purpose

Splectrum node entrypoint code (JavaScript) that can't directly target an app. Bootstrap code that runs before the app system is loaded.

## Expected Contents

| File | Purpose |
|------|---------|
| `spl.mjs` | Main CLI entrypoint - bootstraps module system, handles invocation |

## Design Rationale

Entrypoint code lives here because:
- It runs before apps are available
- It bootstraps the module/app system itself
- It can't use app infrastructure (since it creates it)
- Separates bootstrap from runtime code

## Relationship to bin/

| Folder | Contains | Language |
|--------|----------|----------|
| `bin/` | Shell scripts that invoke runtime | Shell |
| `entrypoints/` | JS code that bootstraps splectrum | JavaScript |

Shell scripts in bin/ call JS entrypoints. Entrypoints bootstrap the system, then hand off to apps.

## Self-eval

- [ ] Folder exists at splectrum/entrypoints/
- [ ] spl.mjs present
- [ ] All entrypoints use relative paths for imports (../)
- [ ] No direct app dependencies (apps loaded via module system)

## Comments

The entrypoints folder belongs to the splectrum node. Code here is pre-app infrastructure - it creates the context in which apps run.
