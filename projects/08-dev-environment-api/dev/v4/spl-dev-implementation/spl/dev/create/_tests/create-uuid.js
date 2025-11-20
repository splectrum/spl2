// Test: generates valid UUID for envId
import create from '../index.js';

const result = create({}, { name: 'test-env' });

// UUID v4 format: 8-4-4-4-12 hex digits
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

if (!uuidRegex.test(result.output.envId)) {
  console.log('Expected valid UUID v4, got:', result.output.envId);
  process.exit(1);
}

process.exit(0);
