// pr09/console/hello - simple greeting method
// Tests the complete pattern

import { createSpl } from 'lib/core.js'

export function handle(record) {
  const spl = createSpl(record)

  console.log(spl.headers.pr09.console.hello.message)
  spl.complete()
}
