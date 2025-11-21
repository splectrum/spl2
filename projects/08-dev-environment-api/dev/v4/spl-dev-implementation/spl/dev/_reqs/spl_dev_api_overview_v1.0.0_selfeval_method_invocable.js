// Self-eval: Check method folders have index.js (invocable)
// Requirement: spl_dev_api_overview_v1.0.0.md

const { existsSync } = require('fs');
const { join } = require('path');

function selfeval(data) {
  const methods = data?.methods || [
    'create',
    'install',
    'submit',
    'cycle',
    'status',
    'extract',
    'destroy'
  ];

  console.log('Checking method invocability...');

  for (const method of methods) {
    const indexFile = join(method, 'index.js');

    if (!existsSync(indexFile)) {
      console.log(`ERROR: Method index.js missing: ${indexFile}`);
      process.exit(1);
    }
    console.log(`  ✓ ${indexFile}`);
  }

  console.log('✓ All methods are invocable\n');
  process.exit(0);
}

// Run if executed directly
if (require.main === module) {
  let data = null;
  try {
    data = require('./spl_dev_api_overview_v1.0.0_selfeval_data.json');
  } catch (e) {
    // Use defaults
  }
  selfeval(data);
}

module.exports = selfeval;
