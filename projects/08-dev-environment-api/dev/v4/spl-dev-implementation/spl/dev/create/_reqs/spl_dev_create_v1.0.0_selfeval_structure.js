// Self-eval: Check method structure
// Requirement: spl_dev_create_v1.0.0.md

const { existsSync } = require('fs');

function selfeval(data) {
  const requiredFolders = data?.requiredFolders || ['_reqs', '_schemas', '_tests'];
  const requiredFiles = data?.requiredFiles || [
    'README.md',
    'index.js',
    '_reqs/spl_dev_create_v1.0.0.md',
    '_reqs/api_method_req_v1.0.0.md'
  ];

  console.log('Checking method structure...');

  // Check folders
  for (const folder of requiredFolders) {
    if (!existsSync(folder)) {
      console.log(`ERROR: Required folder missing: ${folder}`);
      process.exit(1);
    }
    console.log(`  ✓ ${folder}/`);
  }

  // Check files
  for (const file of requiredFiles) {
    if (!existsSync(file)) {
      console.log(`ERROR: Required file missing: ${file}`);
      process.exit(1);
    }
    console.log(`  ✓ ${file}`);
  }

  console.log('✓ Method structure valid\n');
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
