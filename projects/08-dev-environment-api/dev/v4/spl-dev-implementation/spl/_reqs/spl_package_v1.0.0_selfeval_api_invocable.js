// Self-eval: Check API folders have index.js (invocable)
// Requirement: spl_package_v1.0.0.md

const { existsSync } = require('fs');
const { join } = require('path');

function selfeval(data) {
  const apis = data?.apis || ['dev'];

  console.log('Checking API invocability...');

  for (const api of apis) {
    const indexFile = join(api, 'index.js');

    if (!existsSync(indexFile)) {
      console.log(`ERROR: API index.js missing: ${indexFile}`);
      process.exit(1);
    }
    console.log(`  ✓ ${indexFile}`);
  }

  console.log('✓ All APIs are invocable\n');
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
