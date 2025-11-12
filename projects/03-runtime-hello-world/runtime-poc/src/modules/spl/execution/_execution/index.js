// Requirements: (to be defined)

//  name        SPL Execution Utilities
//  URI         spl/execution/_execution
//  type        Auxiliary Library
//  description Proper method invocation with full state stack access
//
//  This is the proper execution helper with access to complete state stack.
//  Handles method invocation, context construction, and state management.
///////////////////////////////////////////////////////////////////////////////

import { pathToFileURL } from 'url';
import { resolve } from 'path';
import { createRecordAccessor, createReadOnlyRecordAccessor, createArgsAccessor } from 'spl_context';

/**
 * Create execution helper with injected execution state and runtime accessor
 *
 * Factory pattern: inject state once, use methods with clean signatures
 *
 * @param {Object} executionApiState - Execution API state Kafka record
 * @param {Object} runtimeAccessor - Read-only runtime context accessor
 * @returns {Object} Helper with invokeMethod and related functions
 */
export function createExecutionHelper(executionApiState, runtimeAccessor) {
  /**
   * Get modulesBasePath from runtime context (via injected accessor)
   * @returns {String} Base path where modules folder is located
   */
  const getModulesBasePath = () => {
    const path = runtimeAccessor?.getMetadata('spl.runtime.modulesBasePath');
    if (!path) {
      throw new Error('spl/execution/_execution: modulesBasePath not found in runtime context');
    }
    return path;
  };

  /**
   * Resolve and load a Splectrum module
   *
   * @param {String} modulePath - Module identifier (e.g., "pr03/hello/greet")
   * @returns {Promise<Object>} Resolution result with { path, module, error }
   */
  const resolveModule = async (modulePath) => {
    if (!modulePath) {
      return {
        path: undefined,
        module: null,
        error: new Error('spl/execution/_execution: modulePath is required')
      };
    }

    const modulesBasePath = getModulesBasePath();

    // Construct file path: {basePath}/{package}/{api}/{method}/index.js
    const filePath = resolve(modulesBasePath, modulePath, 'index.js');

    try {
      // Convert to file URL for cross-platform dynamic import
      const fileURL = pathToFileURL(filePath).href;

      // Dynamic import
      const module = await import(fileURL);

      // Extract method name from path (last segment)
      const parts = modulePath.split('/');
      const methodName = parts[parts.length - 1];

      // Verify method exists
      if (!module[methodName]) {
        return {
          path: filePath,
          module: null,
          error: new Error(`spl/execution/_execution: Module ${modulePath} missing export '${methodName}'`)
        };
      }

      return {
        path: filePath,
        module: module,
        error: null
      };
    } catch (error) {
      return {
        path: filePath,
        module: null,
        error: new Error(`spl/execution/_execution: Failed to load ${modulePath}: ${error.message}`)
      };
    }
  };

  return {
    /**
     * Invoke a method with proper context construction
     *
     * Creates context with full state stack:
     * - apiState: Target method's API state (read/write)
     * - args: Method arguments (read-only)
     * - runtime: Runtime context (read-only)
     * - execution: Execution context (read-only)
     *
     * @param {String} methodPath - Method identifier (e.g., "pr03/hello/greet")
     * @param {Object} args - Flat arguments object for method
     * @returns {Promise<Object>} Method output (property bag)
     */
    async invokeMethod(methodPath, args = {}) {
      // Resolve the module
      const resolution = await resolveModule(methodPath);

      if (resolution.error) {
        throw resolution.error;
      }

      // Extract method name from path
      const parts = methodPath.split('/');
      const methodName = parts[parts.length - 1];
      const apiName = parts.slice(0, -1).join('/'); // e.g., "pr03/hello"

      // Create API state for target method (stored in execution context value)
      const targetApiState = {
        key: `${apiName}-state`,
        headers: {},
        value: {}
      };

      // Store API state in execution context (namespace by API path)
      const executionAccessor = createRecordAccessor(executionApiState);
      executionAccessor.setData(apiName, targetApiState);

      // Construct context for target method with full state stack
      const context = {
        apiState: createRecordAccessor(targetApiState),
        args: createArgsAccessor(args),
        runtime: runtimeAccessor, // Read-only runtime (passed in)
        execution: createReadOnlyRecordAccessor(executionApiState) // Read-only execution
      };

      // Invoke the method
      const methodFunction = resolution.module[methodName];
      return methodFunction(context);
    }
  };
}
