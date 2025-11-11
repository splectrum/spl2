// Requirements: (to be defined)

//  name        SPL Runtime Utilities
//  URI         spl/runtime/_runtime
//  type        Auxiliary Library
//  description Runtime-specific utilities including module resolution
///////////////////////////////////////////////////////////////////////////////

import { pathToFileURL } from 'url';
import { resolve } from 'path';

/**
 * Resolve and load a Splectrum module
 *
 * Convention-based resolution:
 * - Module path: "spl/runtime/run" (package/api/method)
 * - File path: {modulesBasePath}/spl/runtime/run/index.js
 *
 * @param {String} modulePath - Module identifier (e.g., "spl/runtime/run")
 * @param {String} modulesBasePath - Base path where modules folder is located
 * @returns {Promise<Object>} Resolution result with { path, module, error }
 */
export async function resolveModule(modulePath, modulesBasePath) {
  if (!modulePath) {
    return {
      path: undefined,
      module: null,
      error: new Error('spl/runtime/_runtime: modulePath is required')
    };
  }

  if (!modulesBasePath) {
    return {
      path: undefined,
      module: null,
      error: new Error('spl/runtime/_runtime: modulesBasePath is required')
    };
  }

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
}

/**
 * Invoke a Splectrum method by path
 *
 * Resolves module, extracts method function, and invokes it with context
 *
 * @param {String} methodPath - Method identifier (e.g., "spl/runtime/run")
 * @param {Object} context - Unified context object to pass to method
 * @param {String} modulesBasePath - Base path where modules folder is located
 * @returns {Promise<Object>} Method output (property bag)
 */
export async function invokeMethod(methodPath, context, modulesBasePath) {
  const resolution = await resolveModule(methodPath, modulesBasePath);

  if (resolution.error) {
    throw resolution.error;
  }

  // Extract method name from path
  const parts = methodPath.split('/');
  const methodName = parts[parts.length - 1];
  const methodFunction = resolution.module[methodName];

  // Invoke the method
  return methodFunction(context);
}

/**
 * Get module metadata without invoking
 *
 * Useful for introspection, validation, or pre-loading
 *
 * @param {String} modulePath - Module identifier
 * @param {String} modulesBasePath - Base path where modules folder is located
 * @returns {Promise<Object>} Resolution metadata
 */
export async function getModuleMetadata(modulePath, modulesBasePath) {
  return await resolveModule(modulePath, modulesBasePath);
}
