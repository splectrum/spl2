// Self-eval: Check API folders have schemas
// Requirement: spl_package_v1.0.0.md

const { existsSync } = require('fs');
const { join } = require('path');

function selfeval(data) {
  const apis = data?.apis || ['dev'];

  console.log('Checking API schemas...');

  for (const api of apis) {
    const inputSchema = join(api, '_schemas', 'input.avsc');
    const outputSchema = join(api, '_schemas', 'output.avsc');

    if (!existsSync(inputSchema)) {
      console.log(`ERROR: API input schema missing: ${inputSchema}`);
      process.exit(1);
    }
    console.log(`  ✓ ${inputSchema}`);

    if (!existsSync(outputSchema)) {
      console.log(`ERROR: API output schema missing: ${outputSchema}`);
      process.exit(1);
    }
    console.log(`  ✓ ${outputSchema}`);
  }

  console.log('✓ All API schemas exist\n');
  process.exit(0);
}

// Run if executed directly
if (require.main === module) {
  let data = null;
  try {
    data = require('./spl_package_v1.0.0_selfeval_data.json');
  } catch (e) {
    // Use defaults
  }
  selfeval(data);
}

module.exports = selfeval;
