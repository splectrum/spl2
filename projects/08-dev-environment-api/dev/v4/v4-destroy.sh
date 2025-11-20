#!/bin/bash
# v4-destroy.sh - Clean up environments

set -e

echo "=== v4 Destroy - Clean Environments ==="
echo ""

if [ ! -d "environments" ] || [ -z "$(ls -A environments 2>/dev/null)" ]; then
  echo "No environments to destroy"
  exit 0
fi

echo "Environments:"
ls -1 environments/
echo ""

read -p "Destroy all environments? [y/N] " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  rm -rf environments/*
  echo "✓ All environments destroyed"
else
  echo "Cancelled"
fi
