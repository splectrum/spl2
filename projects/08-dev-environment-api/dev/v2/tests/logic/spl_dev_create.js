// Logic test for spl/dev/create
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async function test({ req, cases }) {
  const methodPath = join(__dirname, '..', '..', 'src', 'spl', 'dev', 'create', 'index.js');

  let create;
  try {
    const module = await import(methodPath);
    create = module.default;
  } catch (err) {
    return {
      status: 'fail',
      message: `Cannot load create method: ${err.message}`,
      guidance: `Implement the create method in src/spl/dev/create/index.js

export default async function create(ctx, input) {
  const { name, template } = input;

  return {
    output: {
      envId: crypto.randomUUID(),
      path: \`/path/to/\${name}\`,
      status: 'created'
    }
  };
}`
    };
  }

  // Run test cases
  for (const testCase of cases) {
    const mockCtx = { runtime: {}, execution: {} };

    try {
      const result = await create(mockCtx, testCase.input);

      // Check expected fields
      for (const [key, expected] of Object.entries(testCase.expect)) {
        if (expected === 'uuid') {
          // Just check it exists and looks like UUID
          if (!result.output[key] || result.output[key].length < 10) {
            return {
              status: 'fail',
              message: `Case "${testCase.name}": expected ${key} to be UUID`,
              guidance: `Ensure create returns a valid UUID for ${key}`
            };
          }
        } else if (result.output[key] !== expected) {
          return {
            status: 'fail',
            message: `Case "${testCase.name}": expected ${key}="${expected}", got "${result.output[key]}"`,
            guidance: `Fix create method to return correct ${key}`
          };
        }
      }
    } catch (err) {
      return {
        status: 'fail',
        message: `Case "${testCase.name}" threw: ${err.message}`,
        guidance: 'Fix error in create method'
      };
    }
  }

  return {
    status: 'pass',
    message: `All ${cases.length} test cases passed`
  };
}
