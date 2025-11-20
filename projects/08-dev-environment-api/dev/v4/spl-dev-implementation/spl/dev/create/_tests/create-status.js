// Test: creates environment with correct status
import create from '../index.js';

const result = create({}, { name: 'test-env' });

if (result.output.status !== 'created') {
  console.log('Expected status "created", got:', result.output.status);
  process.exit(1);
}

process.exit(0);
