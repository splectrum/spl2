// spl/console/configure - Configure console settings
// Pure business logic - no validation (handled at boundaries)

// Valid values - business rules
const VALID_LEVELS = ['debug', 'info', 'warn', 'error'];
const VALID_FORMATS = ['text', 'json'];

export default async function configure(ctx, input) {
  // Validate business rules (not schema - that's at boundary)
  if (!VALID_LEVELS.includes(input.level)) {
    return {
      ...ctx,
      output: { code: 'INVALID_LEVEL', message: `Level must be one of: ${VALID_LEVELS.join(', ')}` },
      console: ctx.console
    };
  }

  if (!VALID_FORMATS.includes(input.format)) {
    return {
      ...ctx,
      output: { code: 'INVALID_FORMAT', message: `Format must be one of: ${VALID_FORMATS.join(', ')}` },
      console: ctx.console
    };
  }

  // Business logic - create config
  const config = {
    level: input.level,
    format: input.format,
    destination: input.destination
  };

  // Return result
  return {
    ...ctx,
    output: {
      configured: true,
      level: config.level,
      format: config.format,
      destination: config.destination
    },
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
