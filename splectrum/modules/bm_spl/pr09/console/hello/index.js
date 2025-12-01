// pr09/console/hello - simple greeting method
//
// Pattern: create(record, { requireSpl }) returns { invoke() }

export async function create(record, { requireSpl }) {
  const spl = await requireSpl('lib/spl', record)

  return {
    async invoke() {
      const input = spl.input()

      console.log(input.message || 'Hello from pr09/console/hello!')

      spl.output({ greeted: true, message: input.message })
      spl.completeRequest()
    }
  }
}
