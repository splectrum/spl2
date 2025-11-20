// Test: handles existing directory gracefully
import create from '../index.js';
import { mkdirSync, rmSync } from 'fs';

const testPath = '/tmp/dev-env/existing-test';

// Pre-create the directory
mkdirSync(testPath, { recursive: true });

try {
  // Should handle existing directory without error
  const result = create({}, { name: 'existing-test' });

  if (result.output.status !== 'created') {
    console.log('Expected status "created" even with existing dir, got:', result.output.status);
    process.exit(1);
  }

  // Clean up
  rmSync(testPath, { recursive: true, force: true });
  process.exit(0);

} catch (error) {
  console.log('Should handle existing directory gracefully, but got error:', error.message);
  // Clean up
  rmSync(testPath, { recursive: true, force: true });
  process.exit(1);
}
