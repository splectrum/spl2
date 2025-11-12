// Requirements: (to be defined)

//  name        SPL Utilities
//  URI         spl/_utils
//  type        Auxiliary Library
//  description Platform-agnostic utilities for SPL2 methods
//
//  Abstracts platform-specific implementations (Node.js, Bare) away from method code.
//  Methods import from this library - platform switching happens internally.
//
//  Platform detection: Auto-detect at runtime, or explicit via environment/config
///////////////////////////////////////////////////////////////////////////////

/**
 * Detect current platform
 * @returns {String} 'node' or 'bare'
 */
function detectPlatform() {
  // Auto-detection: check for platform-specific globals
  if (typeof process !== 'undefined' && process.versions && process.versions.node) {
    return 'node';
  }
  // Bare detection would go here (check for Bare-specific globals)
  // if (typeof Bare !== 'undefined') return 'bare';

  throw new Error('spl/_utils: Unable to detect platform');
}

const PLATFORM = detectPlatform();

// Platform-specific imports at module level
let nodeCrypto;
if (PLATFORM === 'node') {
  nodeCrypto = await import('crypto');
}

/**
 * Generate a unique identifier (UUID v4)
 * Platform-agnostic - switches implementation based on detected platform
 * @returns {String} UUID string
 */
export function generateUUID() {
  if (PLATFORM === 'node') {
    // Node.js implementation
    return nodeCrypto.randomUUID();
  } else if (PLATFORM === 'bare') {
    // Bare implementation (to be implemented)
    throw new Error('spl/_utils: UUID generation not yet implemented for Bare');
  }

  throw new Error(`spl/_utils: Unsupported platform ${PLATFORM}`);
}

/**
 * Get current ISO 8601 timestamp
 * Platform-agnostic
 * @returns {String} ISO 8601 timestamp
 */
export function getCurrentTimestamp() {
  // Same across platforms
  return new Date().toISOString();
}

/**
 * Get platform version string
 * Platform-agnostic - switches implementation based on detected platform
 * @returns {String} Platform version (e.g., "v18.19.1" for Node)
 */
export function getPlatformVersion() {
  if (PLATFORM === 'node') {
    return process.version;
  } else if (PLATFORM === 'bare') {
    // Bare implementation (to be implemented)
    throw new Error('spl/_utils: Platform version not yet implemented for Bare');
  }

  throw new Error(`spl/_utils: Unsupported platform ${PLATFORM}`);
}

/**
 * Get platform name
 * @returns {String} 'node' or 'bare'
 */
export function getPlatformName() {
  return PLATFORM;
}
