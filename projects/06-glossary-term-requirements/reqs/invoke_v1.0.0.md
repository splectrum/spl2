**Type:** plain req
**Extends:** method

# invoke

## Spec

Method name for invoking a single method with execution context. Atomic unit of method invocation.

Input: Method reference and arguments.
Output: Method result with updated context.

Purpose: Core mechanism for calling one method within execution context.

## Self-eval

- [ ] Invokes exactly one method
- [ ] Accepts method reference and arguments
- [ ] Returns result with context
- [ ] Method name is "invoke"

## Comments

Example: `spl/execution/invoke` - core method invocation in spl package.
