// Requirements: (to be defined)

//  name        Runtime Run
//  URI         spl/runtime/run
//  type        API Method
//  description Initialize and run runtime context
///////////////////////////////////////////////////////////////////////////////

import { generateUUID, getPlatformVersion, getCurrentTimestamp } from 'spl_utils';

/**
 * Runtime run method
 *
 * Initialize runtime context with essential properties:
 * - version: SPL2 runtime version
 * - platformVersion: Platform version for reproducibility (Node.js, Bare, etc.)
 * - runtimeId: Unique identifier for this execution
 * - startTime: Execution start timestamp
 *
 * Platform-agnostic: Uses SPL utilities that abstract platform differences
 *
 * @param {Object} context - Unified context object
 * @param {Object} context.apiState - API state accessor (get/set for hierarchical Kafka record)
 * @param {Object} context.args - Method arguments accessor (get for flat args)
 * @param {Object} context.runtime - Runtime context accessor (get, read-only)
 * @param {Object} context.execution - Execution context accessor (get, read-only)
 * @returns {Object} Output property bag
 */
export function run(context) {
  if (!context || !context.apiState) {
    throw new Error('spl/runtime/run: context.apiState is required');
  }

  // Initialize runtime properties in metadata (headers)
  // All platform-specific calls abstracted through spl/_utils
  context.apiState.setMetadata('spl.runtime.version', '0.1.0');
  context.apiState.setMetadata('spl.runtime.platformVersion', getPlatformVersion());
  context.apiState.setMetadata('spl.runtime.runtimeId', generateUUID());
  context.apiState.setMetadata('spl.runtime.startTime', getCurrentTimestamp());

  return { status: 'initialized' };
}
