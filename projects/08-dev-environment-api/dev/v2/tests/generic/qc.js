// Generic QC test - schema validation
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import avro from 'avsc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async function test({ req, method }) {
  const methodParts = method.split('/');
  const apiPath = methodParts.slice(0, -1).join('/');
  const methodName = methodParts[methodParts.length - 1];

  const schemasDir = join(__dirname, '..', '..', 'src', apiPath, '_schemas');

  // Check input schema exists and is valid
  const inputSchemaPath = join(schemasDir, req.schemas.input);
  if (!existsSync(inputSchemaPath)) {
    return {
      status: 'fail',
      message: `Input schema not found: ${req.schemas.input}`,
      guidance: `Create ${inputSchemaPath}`
    };
  }

  try {
    const inputSchema = JSON.parse(readFileSync(inputSchemaPath, 'utf-8'));
    avro.Type.forSchema(inputSchema);
  } catch (err) {
    return {
      status: 'fail',
      message: `Invalid input schema: ${err.message}`,
      guidance: 'Fix AVRO schema syntax'
    };
  }

  // Check output schema exists and is valid
  const outputSchemaPath = join(schemasDir, req.schemas.output);
  if (!existsSync(outputSchemaPath)) {
    return {
      status: 'fail',
      message: `Output schema not found: ${req.schemas.output}`,
      guidance: `Create ${outputSchemaPath}`
    };
  }

  try {
    const outputSchema = JSON.parse(readFileSync(outputSchemaPath, 'utf-8'));
    avro.Type.forSchema(outputSchema);
  } catch (err) {
    return {
      status: 'fail',
      message: `Invalid output schema: ${err.message}`,
      guidance: 'Fix AVRO schema syntax'
    };
  }

  return {
    status: 'pass',
    message: 'Schemas valid'
  };
}
