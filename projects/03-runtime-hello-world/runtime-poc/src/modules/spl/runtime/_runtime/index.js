// Requirements: (to be defined)

//  name        SPL Runtime Utilities (Bootstrap)
//  URI         spl/runtime/_runtime
//  type        Auxiliary Library
//  description BOOTSTRAP-ONLY: Minimal module resolution for runtime initialization
//
//  IMPORTANT: This is a simplified bootstrap implementation used only to initialize
//             runtime and execution contexts. For normal method invocation, use the
//             execution context helper (spl/execution/_execution) which has proper
//             access to the full state stack and context construction.
//
//             Bootstrap purpose: Break chicken-and-egg problem of initializing
//             the execution infrastructure before the execution infrastructure exists.
///////////////////////////////////////////////////////////////////////////////

import { pathToFileURL } from 'url';
import { resolve } from 'path';

/**
 * Create runtime helper with injected runtime API state
 *
 * Factory pattern: inject state once, use methods with clean signatures
 *
 * @param {Object} runtimeApiState - Runtime API state Kafka record
 * @returns {Object} Helper with resolveModule, invokeMethod, getModuleMetadata methods
 */
export function createRuntimeHelper(runtimeApiState) {
  /**
   * Get modulesBasePath from injected runtime state
   * @returns {String} Base path where modules folder is located
   */
  const getModulesBasePath = () => {
    const path = runtimeApiState?.headers?.spl?.runtime?.modulesBasePath;
    if (!path) {
      throw new Error('spl/runtime/_runtime: modulesBasePath not found in runtime state');
    }
    return path;
  };

  return {
    /**
     * Resolve and load a Splectrum module
     *
     * Convention-based resolution:
     * - Module path: "spl/runtime/run" (package/api/method)
     * - File path: {modulesBasePath}/spl/runtime/run/index.js
     *
     * @param {String} modulePath - Module identifier (e.g., "spl/runtime/run")
     * @returns {Promise<Object>} Resolution result with { path, module, error }
     */
    async resolveModule(modulePath) {
      if (!modulePath) {
        return {
          path: undefined,
          module: null,
          error: new Error('spl/runtime/_runtime: modulePath is required')
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
            error: new Error(`spl/runtime/_runtime: Module ${modulePath} missing export '${methodName}'`)
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
          error: new Error(`spl/runtime/_runtime: Failed to load ${modulePath}: ${error.message}`)
        };
      }
    },

    /**
     * Invoke a Splectrum method by path
     *
     * Resolves module, extracts method function, and invokes it with context
     *
     * @param {String} methodPath - Method identifier (e.g., "spl/runtime/run")
     * @param {Object} context - Unified context object to pass to method
     * @returns {Promise<Object>} Method output (property bag)
     */
    async invokeMethod(methodPath, context) {
      const resolution = await this.resolveModule(methodPath);

      if (resolution.error) {
        throw resolution.error;
      }

      // Extract method name from path
      const parts = methodPath.split('/');
      const methodName = parts[parts.length - 1];
      const methodFunction = resolution.module[methodName];

      // Invoke the method
      return methodFunction(context);
    },

    /**
     * Get module metadata without invoking
     *
     * Useful for introspection, validation, or pre-loading
     *
     * @param {String} modulePath - Module identifier
     * @returns {Promise<Object>} Resolution metadata
     */
    async getModuleMetadata(modulePath) {
      return await this.resolveModule(modulePath);
    }
  };
}
