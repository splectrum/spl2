// spl/console/configure - Configure console settings
// Sets log level, format, output destination

import avro from 'avsc';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const schemasPath = join(__dirname, '..', '_schemas');

// Load schemas
const inputSchema = JSON.parse(readFileSync(join(schemasPath, 'configure-input.avsc'), 'utf-8'));
const errorSchema = JSON.parse(readFileSync(join(schemasPath, 'error.avsc'), 'utf-8'));
const outputSchema = JSON.parse(readFileSync(join(schemasPath, 'configure-output.avsc'), 'utf-8'));

// Create AVRO types
const InputType = avro.Type.forSchema(inputSchema);
const ErrorType = avro.Type.forSchema(errorSchema);
const OutputType = avro.Type.forSchema(outputSchema);

// Valid values
const VALID_LEVELS = ['debug', 'info', 'warn', 'error'];
const VALID_FORMATS = ['text', 'json'];

export default async function configure(ctx, input = {}) {
  // Apply defaults from schema
  const resolvedInput = InputType.clone(input, { wrapUnions: true });

  // Validate level
  if (!VALID_LEVELS.includes(resolvedInput.level)) {
    const error = { code: 'INVALID_LEVEL', message: `Level must be one of: ${VALID_LEVELS.join(', ')}` };
    return {
      ...ctx,
      output: error,
      console: ctx.console // unchanged on error
    };
  }

  // Validate format
  if (!VALID_FORMATS.includes(resolvedInput.format)) {
    const error = { code: 'INVALID_FORMAT', message: `Format must be one of: ${VALID_FORMATS.join(', ')}` };
    return {
      ...ctx,
      output: error,
      console: ctx.console
    };
  }

  const config = {
    level: resolvedInput.level,
    format: resolvedInput.format,
    destination: resolvedInput.destination
  };

  // Success output
  const output = {
    configured: true,
    level: config.level,
    format: config.format,
    destination: config.destination
  };

  // Return updated API state
  return {
    ...ctx,
    output,
    console: {
      data: {
        ...ctx.console?.data,
        config,
        invocationCount: (ctx.console?.data?.invocationCount ?? 0) + 1
      },
      metadata: {
        ...ctx.console?.metadata,
        configuredAt: new Date().toISOString()
      }
    }
  };
}
