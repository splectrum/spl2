// spl/console/error - Log an error message (stderr)
// Wrapper for console.error

export default async function error(ctx, input) {
  const message = input.message;
  const format = input.format;
  const data = input.data;

  let output;
  if (format === 'json') {
    output = JSON.stringify({ level: 'error', message, data, timestamp: new Date().toISOString() });
  } else {
    output = `[ERROR] ${message}`;
  }

  console.error(output);

  const bytesOutput = (ctx.console?.data?.bytesOutput ?? 0) + output.length;

  return {
    output: { logged: true, level: 'error', message, bytesOutput },
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
