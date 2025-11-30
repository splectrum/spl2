// pr09/console/hello - simple greeting method
// Receives: record, spl, requireSpl, requireNonSpl (same as scripts)

export function handle(record, spl) {
  const input = spl.input()

  console.log(input.message || 'Hello from pr09/console/hello!')

  spl.output({ greeted: true, message: input.message })
  spl.completeRequest()
}
