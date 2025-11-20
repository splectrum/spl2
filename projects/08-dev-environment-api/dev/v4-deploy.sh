#!/bin/bash
# v4 Deploy - Set up work module structure with proper api_node hierarchy

set -e

echo "=== v4 Deploy - Work Module Structure ==="
echo ""

# Clean slate
rm -rf v4
mkdir -p v4

# Dev env tooling
cd v4

# Package.json
cat > package.json << 'EOF'
{
  "name": "dev-env-v4",
  "version": "1.0.0",
  "type": "module",
  "description": "Dev Environment v4 - Work module with api_node hierarchy",
  "dependencies": {
    "avsc": "^5.7.7"
  }
}
EOF

# Install dependencies
npm install

# Copy harness
cp ../v4/harness.js .

# Create work module structure
mkdir -p modules/spl-dev-implementation/{_reqs,spl/dev/create/{_reqs,_schemas,_tests}}

# Copy work module contents
cp -r ../v4/modules/spl-dev-implementation/spl/dev/create/* modules/spl-dev-implementation/spl/dev/create/

echo ""
echo "=== Structure Created ==="
echo ""
echo "v4/"
echo "├── package.json          # Dev env dependencies"
echo "├── node_modules/         # Installed"
echo "├── harness.js           # Test harness"
echo "└── modules/             # Work modules"
echo "    └── spl-dev-implementation/"
echo "        ├── _reqs/       # Module level (empty)"
echo "        └── spl/         # Package"
echo "            └── dev/     # API"
echo "                └── create/  # Method"
echo "                    ├── _reqs/"
echo "                    ├── _schemas/"
echo "                    ├── _tests/"
echo "                    └── index.js"
echo ""
echo "=== Running Tests ==="
echo ""

# Run tests
node harness.js modules/spl-dev-implementation/spl/dev/create

echo ""
echo "✓ v4 deployed successfully"
