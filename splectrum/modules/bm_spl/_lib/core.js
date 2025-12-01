// spl/core - core library functions

/**
 * Create spl wrapper bound to record
 * @param {Object} record - Kafka record
 * @returns {Object} spl wrapper with bound methods
 */
export function createSpl(record) {
  return {
    // Direct access to record parts
    headers: record.headers,
    value: record.value,

    // Bound methods
    complete() {
      record.headers.spl.request.completed = true
    },

    error(message) {
      record.headers.spl.runtime.error = message
      record.headers.spl.request.completed = true
    }
  }
}

export default { createSpl }
