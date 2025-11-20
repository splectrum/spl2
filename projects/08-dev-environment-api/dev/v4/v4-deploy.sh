#!/bin/bash
# v4-deploy.sh - Create dev environment, install dependencies, submit work module

set -e

echo "=== v4 Deploy - Create Dev Environment ==="
echo ""

# Environment name
ENV_NAME="test-env-$(date +%s)"
ENV_PATH="environments/${ENV_NAME}"

echo "Creating environment: ${ENV_NAME}"
echo "Path: ${ENV_PATH}"
echo ""

# Create environment structure
mkdir -p "${ENV_PATH}/modules"

# Copy work module to environment
cp -r spl-dev-implementation "${ENV_PATH}/modules/"

# Create package.json in environment
cat > "${ENV_PATH}/package.json" << 'EOF'
{
  "name": "dev-env",
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "avsc": "^5.7.7"
  }
}
EOF

# Install dependencies in environment
echo "Installing dependencies..."
cd "${ENV_PATH}"
npm install --silent
cd - > /dev/null

echo ""
echo "✓ Environment deployed: ${ENV_PATH}"
echo ""
echo "Structure:"
echo "  ${ENV_PATH}/"
echo "  ├── package.json"
echo "  ├── node_modules/"
echo "  └── modules/"
echo "      └── spl-dev-implementation/"
echo ""
echo "Next: Run v4-cycle.sh to test"
