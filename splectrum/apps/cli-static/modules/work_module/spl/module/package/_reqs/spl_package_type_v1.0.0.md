**Type:** plain req
**Version:** 1.0.0
**Extends:** spl_container_type_v1.0.0

# spl_package_type

## Spec

Package is a container type that groups related APIs.

**Extends spl/container with:**

**Structural constraints:**
- Parent must be module container (implement spl/module)
- Children must be API containers (implement spl/api)

**Package-level concerns:**
- Organizational grouping of related APIs
- Shared configuration across APIs
- Deployment boundary (APIs in package deploy together)

**Content constraints:** None.

## Self-eval

- [ ] Conforms to spl_container_type structural requirements
- [ ] Parent is module container
- [ ] Children are API containers
- [ ] README.json has type "package"

## Comments

Package is organizational - groups APIs that belong together. The three-layer path `package/api/method` is the standard invocation structure.
