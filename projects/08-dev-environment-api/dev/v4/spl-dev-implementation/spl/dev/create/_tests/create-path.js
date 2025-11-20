// Test: returns correct filesystem path
import create from '../index.js';
import { existsSync } from 'fs';

const result = create({}, { name: 'test-env' });

const expectedPath = '/tmp/dev-env/test-env';

if (result.output.path !== expectedPath) {
  console.log('Expected path:', expectedPath);
  console.log('Got:', result.output.path);
  process.exit(1);
}

// Verify directory was actually created
if (!existsSync(result.output.path)) {
  console.log('Directory was not created at:', result.output.path);
  process.exit(1);
}

process.exit(0);
