// Self-eval: Check subfolders have entry points (README.md)
// Requirement: api_overview_v1.0.0 (type requirement - generic for all API overviews)

const { existsSync, readdirSync, statSync } = require('fs');
const { join } = require('path');

function selfeval(data) {
  // Get list of subfolders (methods) - either from data or scan current directory
  let subfolders = data?.subfolders;

  if (!subfolders) {
    // Auto-discover: find all non-underscore folders
    subfolders = readdirSync('.')
      .filter(name => !name.startsWith('_') && !name.startsWith('.'))
      .filter(name => {
        try {
          return statSync(name).isDirectory();
        } catch (e) {
          return false;
        }
      });
  }

  if (subfolders.length === 0) {
    console.log('No subfolders found to check (this is OK for APIs with no methods yet)\n');
    process.exit(0);
  }

  console.log('Checking subfolder entry points...');

  for (const folder of subfolders) {
    const entryPoint = join(folder, 'README.md');
    if (!existsSync(entryPoint)) {
      console.log(`ERROR: Entry point missing: ${entryPoint}`);
      process.exit(1);
    }
    console.log(`  ✓ ${folder}/README.md`);
  }

  console.log('✓ All subfolders have entry points\n');
  process.exit(0);
}

// Run if executed directly
if (require.main === module) {
  let data = null;
  try {
    data = require('./api_overview_v1.0.0_selfeval_data.json');
  } catch (e) {
    // Use defaults (auto-discover)
  }
  selfeval(data);
}

module.exports = selfeval;
