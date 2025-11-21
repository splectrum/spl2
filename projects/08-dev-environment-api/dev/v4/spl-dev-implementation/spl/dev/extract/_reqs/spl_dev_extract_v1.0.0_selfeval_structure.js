// Self-eval: Check method structure

const { existsSync } = require('fs');

function selfeval(data) {
  const requiredFolders = data?.requiredFolders || ['_reqs', '_schemas'];
  const requiredFiles = data?.requiredFiles || ['README.md', 'index.js'];

  console.log('Checking method structure...');

  for (const folder of requiredFolders) {
    if (!existsSync(folder)) {
      console.log(`ERROR: Required folder missing: ${folder}`);
      process.exit(1);
    }
    console.log(`  ✓ ${folder}/`);
  }

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

if (require.main === module) {
  let data = null;
  try {
    data = require('./spl_dev_extract_v1.0.0_selfeval_data.json');
  } catch (e) {}
  selfeval(data);
}

module.exports = selfeval;
