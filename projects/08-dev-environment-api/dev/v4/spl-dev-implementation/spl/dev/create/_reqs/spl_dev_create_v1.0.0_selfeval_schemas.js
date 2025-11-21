// Self-eval: Check method schemas exist
// Requirement: spl_dev_create_v1.0.0.md

const { existsSync } = require('fs');

function selfeval(data) {
  const schemas = data?.schemas || [
    '_schemas/input.avsc',
    '_schemas/output.avsc'
  ];

  console.log('Checking method schemas...');

  for (const schema of schemas) {
    if (!existsSync(schema)) {
      console.log(`ERROR: Schema missing: ${schema}`);
      process.exit(1);
    }
    console.log(`  ✓ ${schema}`);
  }

  console.log('✓ Method schemas valid\n');
  process.exit(0);
}

// Run if executed directly
if (require.main === module) {
  let data = null;
  try {
    data = require('./spl_dev_create_v1.0.0_selfeval_data.json');
  } catch (e) {
    // Use defaults
  }
  selfeval(data);
}

module.exports = selfeval;
