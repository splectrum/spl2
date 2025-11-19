// spl/console/info - Log an informational message
// Wrapper for console.info

export default async function info(ctx, input) {
  const message = input.message;
  const format = input.format;
  const data = input.data;

  let output;
  if (format === 'json') {
    output = JSON.stringify({ level: 'info', message, data, timestamp: new Date().toISOString() });
  } else {
    output = `[INFO] ${message}`;
  }

  console.info(output);

  const bytesOutput = (ctx.console?.data?.bytesOutput ?? 0) + output.length;

  return {
    output: { logged: true, level: 'info', message, bytesOutput },
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
