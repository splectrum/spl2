#!/bin/bash
# v4-cycle.sh - Run test cycle on latest environment

set -e

echo "=== v4 Cycle - Run Tests ==="
echo ""

# Find latest environment
LATEST_ENV=$(ls -t environments/ | head -1)

if [ -z "$LATEST_ENV" ]; then
  echo "✗ No environment found. Run v4-deploy.sh first"
  exit 1
fi

ENV_PATH="environments/${LATEST_ENV}"

echo "Environment: ${LATEST_ENV}"
echo "Path: ${ENV_PATH}"
echo ""

# Copy harness to environment
cp harness.js "${ENV_PATH}/"

# Run tests
cd "${ENV_PATH}"
node harness.js modules/spl-dev-implementation/spl/dev/create

echo ""
echo "✓ Cycle complete"
