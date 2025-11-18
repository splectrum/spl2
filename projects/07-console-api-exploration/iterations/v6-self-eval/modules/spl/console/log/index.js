// spl/console/log - Log a message
// Pure business logic - no validation (handled at boundaries)

export default async function log(ctx, input) {
  const level = input.level;
  const message = input.message;
  const data = input.data;

  // Get config from API state
  const config = ctx.console?.data?.config ?? { level: 'info', format: 'text' };

  // Level filtering
  const levels = ['debug', 'info', 'warn', 'error'];
  const configLevelIndex = levels.indexOf(config.level);
  const messageLevelIndex = levels.indexOf(level);

  let bytesOutput = ctx.console?.data?.bytesOutput ?? 0;
  let logged = false;

  if (messageLevelIndex >= configLevelIndex) {
    // Output based on format
    let output;
    if (config.format === 'json') {
      output = JSON.stringify({ level, message, data, timestamp: new Date().toISOString() });
    } else {
      const prefix = `[${level.toUpperCase()}]`;
      output = `${prefix} ${message}`;
    }
    console.log(output);
    bytesOutput += output.length;
    logged = true;
  }

  // Return result
  return {
    ...ctx,
    output: {
      logged,
      level,
      message,
      bytesOutput
    },
    console: {
      data: {
        ...ctx.console?.data,
        invocationCount: (ctx.console?.data?.invocationCount ?? 0) + 1,
        bytesOutput
      },
      metadata: {
        ...ctx.console?.metadata,
        lastLogAt: new Date().toISOString()
      }
    }
  };
}
