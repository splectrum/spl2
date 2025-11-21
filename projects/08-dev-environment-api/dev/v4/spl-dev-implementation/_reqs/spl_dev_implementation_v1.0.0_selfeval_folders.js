// Self-eval: Check required folders exist
// Requirement: spl_dev_implementation_v1.0.0.md

const { existsSync } = require('fs');

function selfeval(data) {
  const folders = data?.requiredFolders || ['spl', 'spl/dev'];

  console.log('Checking required folders...');

  for (const folder of folders) {
    if (!existsSync(folder)) {
      console.log(`ERROR: Required folder missing: ${folder}`);
      process.exit(1);
    }
    console.log(`  ✓ ${folder}/`);
  }

  console.log('✓ Required folders exist\n');
  process.exit(0);
}

// Run if executed directly
if (require.main === module) {
  let data = null;
  try {
    data = require('./spl_dev_implementation_v1.0.0_selfeval_data.json');
  } catch (e) {
    // Use defaults
  }
  selfeval(data);
}

module.exports = selfeval;
