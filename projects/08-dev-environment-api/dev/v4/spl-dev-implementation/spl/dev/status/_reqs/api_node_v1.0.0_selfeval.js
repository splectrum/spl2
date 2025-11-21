// Self-eval for api_node structure
// Tests that underscore-prefixed internal folders follow api_node pattern
// Only checks CURRENT node - each node runs its own copy of this selfeval

const { existsSync } = require('fs');

function selfeval(data) {
  const errors = [];

  // Get config from data or use defaults
  const config = data || {
    internalFolders: ['_reqs', '_schemas', '_tests']
  };

  // Check this node has required internal folders
  console.log('Checking api_node internal folders (current node)...');

  config.internalFolders.forEach(folder => {
    if (!existsSync(folder)) {
      errors.push(`Internal folder missing: ${folder}`);
    } else {
      console.log(`  ✓ ${folder}/`);
    }
  });

  // Report results
  if (errors.length > 0) {
    console.log('\nERROR: API node structure validation failed:');
    errors.forEach(err => console.log(`  - ${err}`));
    process.exit(1);
  }

  console.log('✓ API node structure valid\n');
  process.exit(0);
}

// If run directly, execute with data file if available
if (require.main === module) {
  let data = null;
  try {
    data = require('./api_node_v1.0.0_selfeval_data.json');
  } catch (e) {
    // No data file, use defaults
  }
  selfeval(data);
}

module.exports = selfeval;
