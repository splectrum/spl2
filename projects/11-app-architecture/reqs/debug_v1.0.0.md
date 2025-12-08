# debug

**Type:** plain req
**Version:** 1.0.0
**Project:** 11-app-architecture

---

## Spec

Maximal information; mainly used in metadata.

Everything including internal state and diagnostic information. For troubleshooting, development, and deep understanding.

### Character

- All information included
- Internal state visible
- Diagnostic data present
- DSL glossary meanings shown
- Implementation details exposed

### Usage

As output level:
- `gradedOutput({ debug: "schemas:\n  input.avsc - ...\n    DSL: key - primary key component...", ... })`

As flag:
- `spl spl/container/whoami --debug`

### Mappings

None - debug is both native term and conventional flag. Same word, same meaning.

### Examples

```
schemas:
  input.avsc - input schema for method invocation
    key (string)
      Doc: record identifier
      DSL: Property - primary key component of Kafka-compatible record
    headers (object)
      Doc: metadata headers
      DSL: Property - metadata component of Kafka-compatible record
```

Includes DSL glossary meanings, internal documentation, diagnostic info.

## Self-eval

- [ ] Maximal information provided
- [ ] Internal state visible
- [ ] DSL glossary meanings included where relevant
- [ ] Diagnostic/troubleshooting information present

## Comments

Part of the four-level output system: topline → summary → detail → debug.

Debug answers "show me everything, including internals" - for developers, troubleshooting, and AI understanding the system deeply.

Note: debug is native to Splectrum AND a conventional flag term - no mapping needed, same word same meaning.
