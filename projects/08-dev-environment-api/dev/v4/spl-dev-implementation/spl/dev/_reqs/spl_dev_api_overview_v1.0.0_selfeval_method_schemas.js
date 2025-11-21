// Self-eval: Check method folders have schemas
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

  console.log('Checking method schemas...');

  for (const method of methods) {
    const inputSchema = join(method, '_schemas', 'input.avsc');
    const outputSchema = join(method, '_schemas', 'output.avsc');

    if (!existsSync(inputSchema)) {
      console.log(`ERROR: Method input schema missing: ${inputSchema}`);
      process.exit(1);
    }
    console.log(`  ✓ ${inputSchema}`);

    if (!existsSync(outputSchema)) {
      console.log(`ERROR: Method output schema missing: ${outputSchema}`);
      process.exit(1);
    }
    console.log(`  ✓ ${outputSchema}`);
  }

  console.log('✓ All method schemas exist\n');
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
