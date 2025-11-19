// spl/console/debug - Log a debug message
// Wrapper for console.debug

export default async function debug(ctx, input) {
  const message = input.message;
  const format = input.format;
  const data = input.data;

  let output;
  if (format === 'json') {
    output = JSON.stringify({ level: 'debug', message, data, timestamp: new Date().toISOString() });
  } else {
    output = `[DEBUG] ${message}`;
  }

  console.debug(output);

  const bytesOutput = (ctx.console?.data?.bytesOutput ?? 0) + output.length;

  return {
    output: { logged: true, level: 'debug', message, bytesOutput },
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
