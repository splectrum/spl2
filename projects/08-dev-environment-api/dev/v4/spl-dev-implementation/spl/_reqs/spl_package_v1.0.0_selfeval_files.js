// Self-eval: Check required files exist
// Requirement: spl_package_v1.0.0.md

const { existsSync } = require('fs');

function selfeval(data) {
  const files = data?.requiredFiles || [
    'README.md',
    '_reqs/package_v1.0.0.md',
    '_reqs/spl_package_v1.0.0.md'
  ];

  console.log('Checking required files...');

  for (const file of files) {
    if (!existsSync(file)) {
      console.log(`ERROR: Required file missing: ${file}`);
      process.exit(1);
    }
    console.log(`  ✓ ${file}`);
  }

  console.log('✓ Required files exist\n');
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
