# spl/api

API type definition - what all APIs must be.

## Overview

API is a container type that groups related methods addressing a single concern. It extends spl/container with:

- Children must be method containers
- Parent must be package container
- Defines argument namespace for child methods
- Owns API-level state shared across methods

## Extends

spl/container

## Type Constraints

See `_reqs/spl_api_type_v1.0.0.md` for full specification.
