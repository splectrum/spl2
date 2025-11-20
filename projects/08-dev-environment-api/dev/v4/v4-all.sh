#!/bin/bash
# v4-all.sh - Deploy, cycle, and prompt to destroy

set -e

echo "=== v4 All - Full Cycle ==="
echo ""

# Deploy
./v4-deploy.sh

echo ""
echo "---"
echo ""

# Cycle
./v4-cycle.sh

echo ""
echo "---"
echo ""

# Prompt for destroy
./v4-destroy.sh
