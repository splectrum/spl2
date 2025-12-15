# spl/container/whoami

Returns type and description of a container.

## Overview

Reads README.json from a container and returns its type, purpose, and structure.

## Usage

```
spl/container/whoami
spl/container/whoami --path spl/api
```

## Input

- `path` - (optional) path to container, defaults to current context

## Output

- `type` - container type
- `purpose` - one-line description
- `implements` - what type this container implements
- `children` - visible and internal children

## Implements

spl/method

## Specification

See `_reqs/spl_container_whoami_v1.0.0.md`
