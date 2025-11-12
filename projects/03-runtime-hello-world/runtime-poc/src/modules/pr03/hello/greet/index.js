// Requirements: (to be defined)

//  name        Hello Greet
//  URI         pr03/hello/greet
//  type        API Method
//  description Output hello world greeting
///////////////////////////////////////////////////////////////////////////////

import { getCurrentTimestamp } from 'spl_utils';

/**
 * Hello greet method
 *
 * Generates a "Hello World" greeting message, demonstrating:
 * - Access to runtime context (read-only)
 * - Access to execution context (read-only)
 * - API state manipulation
 * - Output generation
 *
 * @param {Object} context - Unified context object
 * @param {Object} context.apiState - API state accessor (get/set for hierarchical Kafka record)
 * @param {Object} context.args - Method arguments accessor (get for flat args)
 * @param {Object} context.runtime - Runtime context accessor (get, read-only)
 * @param {Object} context.execution - Execution context accessor (get, read-only)
 * @returns {Object} Output property bag
 */
export function greet(context) {
  if (!context || !context.apiState) {
    throw new Error('pr03/hello/greet: context.apiState is required');
  }

  // Get name from arguments (if provided)
  const name = context.args?.get('name') || 'World';

  // Generate greeting message
  const message = `Hello ${name}!`;

  // Store greeting in API state
  context.apiState.setData('greeting', message);
  context.apiState.setMetadata('pr03.hello.greetedAt', getCurrentTimestamp());

  // Return output for potential chaining
  return {
    message,
    name
  };
}
