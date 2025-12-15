# spl Tooling and Release Documentation

## Summary

Complete spl tool coverage, implement systematic history tracking (faf), and build release documentation generator for validation and session transfer support.

## Motivation

- Current sessions drift to non-splectrum tooling (bash, grep, raw file ops)
- No systematic history tracking - can't audit what we're not tracking
- Release documentation would enable defect/omission detection
- Generated docs support session transfer and CLAUDE.md context

## Scope

### Part 1: Tool Coverage + History

**Improve existing tooling:**
- Fill gaps in current spl tools
- Ensure all common operations have spl equivalents
- Move away from bash/external tools

**Create additional tooling:**
- Tools for operations currently done manually
- Scripting helpers where needed

**Systematic history tracking (faf):**
- Fire-and-forget event capture
- Record spl operations
- Foundation for later audit capability

### Part 2: Release Documentation Generator

**Generate from release:**
- Container catalog with hierarchy
- API reference (methods, inputs, outputs)
- Type documentation
- Req summaries per container
- Schema documentation

**Use cases:**
- Detect defects/omissions in req/implementation/structure
- Collaborative review of intentions vs reality
- Evaluate work done against roadmap vision
- Feed CLAUDE.md with fresh context

## Dependencies

- Project 12 (Wrapper APIs) - Complete ✅
- v0.1.0 release in place ✅

## Enables

- Audit processing (subsequent project)
- Dynamic CLAUDE.md session entry
- Structured release workflow

## Project Type

Exploration Project - tool discovery and documentation patterns

## Priority

High - foundational for all future structured work
