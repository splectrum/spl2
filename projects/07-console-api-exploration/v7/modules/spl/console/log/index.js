// spl/console/log - Log a message (general output)
// Wrapper for console.log

export default async function log(ctx, input) {
  const message = input.message;
  const format = input.format;
  const data = input.data;

  let output;
  if (format === 'json') {
    output = JSON.stringify({ level: 'log', message, data, timestamp: new Date().toISOString() });
  } else {
    output = `[LOG] ${message}`;
  }

  console.log(output);

  const bytesOutput = (ctx.console?.data?.bytesOutput ?? 0) + output.length;

  return {
    output: { logged: true, level: 'log', message, bytesOutput },
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
