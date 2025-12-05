// spl/container - base container type
//
// Default implementation - derived types override as needed.

module.exports = async function(record, { requireSpl }) {
  return { status: 'not_implemented', type: 'container' }
}
