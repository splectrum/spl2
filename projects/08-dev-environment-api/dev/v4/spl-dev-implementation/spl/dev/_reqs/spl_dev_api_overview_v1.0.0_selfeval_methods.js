// Self-eval: Check method folders exist
// Requirement: spl_dev_api_overview_v1.0.0.md

const { existsSync } = require('fs');

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

  console.log('Checking method folders exist...');

  for (const method of methods) {
    if (!existsSync(method)) {
      console.log(`ERROR: Method folder missing: ${method}/`);
      process.exit(1);
    }
    console.log(`  ✓ ${method}/`);
  }

  console.log('✓ All method folders exist\n');
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
