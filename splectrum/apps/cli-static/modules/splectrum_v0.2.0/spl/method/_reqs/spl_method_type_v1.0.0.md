**Type:** plain req
**Version:** 1.0.0
**Extends:** spl_container_type_v1.0.0

# spl_method_type

## Spec

Method is a container type representing an invokable leaf in the API hierarchy.

**Extends spl/container with:**

**Structural constraints:**
- Parent must be API container (implement spl/api)
- No children (leaf node)
- index.js required (the implementation)

**Method-level concerns:**
- Single operation
- Receives input from record
- Produces output to record
- May update API-level state (via parent)

**index.js responsibilities:**
- The actual implementation
- Plain function: `async function(record, requireSpl)`
- Self-contained, testable

**_schemas requirements:**
- `input.avsc` / `metainput.avsc` - method input record
- `output.avsc` / `metaoutput.avsc` - method output record

**README.json additions:**
```json
{
  "type": "method",
  "signature": {
    "input": "input.avsc",
    "output": "output.avsc"
  }
}
```

**Content constraints:** None.

## Self-eval

- [ ] Conforms to spl_container_type structural requirements
- [ ] Parent is API container
- [ ] No child containers
- [ ] index.js present with implementation
- [ ] README.json has type "method"

## Comments

Method is the leaf - the actual executable code. Everything above (package, API) is organizational; methods do the work.

**Inheritance:**
All container structure inherited from spl/container. This type adds method-specific constraints (leaf, required index.js, input/output schemas).

**Testing:**
Methods are self-contained functions. Test by calling directly with mock record and requireSpl.
