// spl/console/warn - Log a warning message
// Wrapper for console.warn

export default async function warn(ctx, input) {
  const message = input.message;
  const format = input.format;
  const data = input.data;

  let output;
  if (format === 'json') {
    output = JSON.stringify({ level: 'warn', message, data, timestamp: new Date().toISOString() });
  } else {
    output = `[WARN] ${message}`;
  }

  console.warn(output);

  const bytesOutput = (ctx.console?.data?.bytesOutput ?? 0) + output.length;

  return {
    output: { logged: true, level: 'warn', message, bytesOutput },
    console: {
      data: {
        invocationCount: (ctx.console?.data?.invocationCount ?? 0) + 1,
        bytesOutput
      },
      metadata: {
        lastOutputAt: new Date().toISOString()
      }
    }
  };
}
