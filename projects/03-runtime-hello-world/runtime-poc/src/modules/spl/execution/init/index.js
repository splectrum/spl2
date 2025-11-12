// Requirements: (to be defined)

//  name        Execution Init
//  URI         spl/execution/init
//  type        API Method
//  description Initialize execution context and invoke target method (exploratory Step 3)
///////////////////////////////////////////////////////////////////////////////

import { generateUUID, getCurrentTimestamp } from 'spl_utils';
import { createExecutionHelper } from '../_execution/index.js';

/**
 * Execution init method
 *
 * Step 2: Initializes execution context properties only
 * Step 3: Enhanced with method invocation logic (exploratory)
 *
 * For exploration: hardcoded to invoke pr03/hello/greet
 * Production version would: read invocation request from state, orchestrate pipeline
 *
 * @param {Object} context - Unified context object
 * @param {Object} context.apiState - API state accessor (get/set for hierarchical Kafka record)
 * @param {Object} context.args - Method arguments accessor (get for flat args)
 * @param {Object} context.runtime - Runtime context accessor (get, read-only)
 * @param {Object} context.execution - Execution context accessor (get, read-only)
 * @returns {Promise<Object>} Output property bag
 */
export async function init(context) {
  if (!context || !context.apiState) {
    throw new Error('spl/execution/init: context.apiState is required');
  }

  // Initialize execution context properties in metadata (headers)
  // All platform-specific calls abstracted through spl/_utils
  context.apiState.setMetadata('spl.execution.executionId', generateUUID());
  context.apiState.setMetadata('spl.execution.startTime', getCurrentTimestamp());

  // Step 3: Method invocation logic (exploratory - hardcoded for hello world)
  // Production: would read invocation request from args or state

  // Get raw execution state for helper injection
  const executionApiState = context.apiState.get(''); // Get root record

  // Create execution helper with state injection
  const executionHelper = createExecutionHelper(executionApiState, context.runtime);

  // Invoke pr03/hello/greet (exploratory hardcoded invocation)
  const greetOutput = await executionHelper.invokeMethod('pr03/hello/greet', { name: 'World' });

  // Store output in execution state for inspection
  context.apiState.setData('lastOutput', greetOutput);

  return greetOutput;
}
