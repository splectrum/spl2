// pr09/state/context.js
// Execution context wrapper - provides structured access to event state

/**
 * ExecutionContext wraps an event for handler processing
 *
 * Structure:
 * - headers.pr09.* - Namespaced metadata (request, runtime, handler-specific)
 * - value - Direct data payload (owned by primary handler)
 *
 * Principle: Single event is minimal & complete for processing
 */
class ExecutionContext {
  constructor(event) {
    // headers.pr09.* - Structured metadata
    this.headers = {
      pr09: {
        // Request context
        request: {
          id: event.headers?.pr09?.request?.id || event.requestId || this._generateId()
        },

        // Runtime state
        runtime: {
          requestcomplete: event.headers?.pr09?.runtime?.requestcomplete || false,
          errorthrown: event.headers?.pr09?.runtime?.errorthrown || false,
          status: event.headers?.pr09?.runtime?.status || 'pending',
          handler: event.headers?.pr09?.runtime?.handler,
          timestamp: new Date().toISOString()
        },

        // Handler-specific hives (each handler owns its namespace)
        arithmetic: event.headers?.pr09?.arithmetic || {},
        validation: event.headers?.pr09?.validation || {},
        logging: event.headers?.pr09?.logging || {}
      }
    }

    // value - Direct data payload (no namespacing)
    // This is the working data for the primary handler
    this.value = event.value
  }

  /**
   * Convert context back to event for publishing
   * Fire-and-forget: dump internal state AS IS
   */
  toEvent() {
    return {
      headers: this.headers,
      value: this.value
    }
  }

  /**
   * Check if request is complete
   */
  isComplete() {
    return this.headers.pr09.runtime.requestcomplete
  }

  /**
   * Check if error was thrown
   */
  hasError() {
    return this.headers.pr09.runtime.errorthrown
  }

  /**
   * Mark request as complete
   */
  markComplete() {
    this.headers.pr09.runtime.requestcomplete = true
    this.headers.pr09.runtime.status = 'completed'
  }

  /**
   * Mark error thrown
   */
  markError(message) {
    this.headers.pr09.runtime.errorthrown = true
    this.headers.pr09.runtime.status = 'error'
    this.headers.pr09.runtime.errormessage = message
  }

  /**
   * Generate unique request ID
   */
  _generateId() {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 11)
    return `req-${timestamp}-${random}`
  }
}

module.exports = { ExecutionContext }
