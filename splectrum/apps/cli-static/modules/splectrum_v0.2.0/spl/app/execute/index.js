// spl/app/execute - Base app execute method
//
// Base implementation - override in derived apps.

export default async function(module) {
  module.output('spl/app/execute: override in derived app', { base: true })
}
