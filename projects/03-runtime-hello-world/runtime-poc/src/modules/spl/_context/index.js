// Requirements: (to be defined)

//  name        SPL Context Accessors
//  URI         spl/_context
//  type        Auxiliary Library
//  description Generic context accessor utilities for hierarchical records
//              Provides uniform get/set interface for Kafka records and arguments
///////////////////////////////////////////////////////////////////////////////

/**
 * Navigate nested object using dot notation path
 * @param {Object} obj - Object to navigate
 * @param {String} path - Dot notation path (e.g., 'spl.runtime.version')
 * @returns {*} Value at path, or undefined if not found
 */
function getNestedValue(obj, path) {
  if (!path) return obj;

  const keys = path.split('.');
  let current = obj;

  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return undefined;
    }
    current = current[key];
  }

  return current;
}

/**
 * Set nested value using dot notation path, creating intermediate objects as needed
 * @param {Object} obj - Object to modify
 * @param {String} path - Dot notation path (e.g., 'spl.runtime.version')
 * @param {*} value - Value to set
 */
function setNestedValue(obj, path, value) {
  if (!path) {
    throw new Error('spl/_context: path is required for setNestedValue');
  }

  const keys = path.split('.');
  let current = obj;

  // Navigate to parent, creating intermediate objects
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in current) || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }

  // Set final value
  current[keys[keys.length - 1]] = value;
}

/**
 * Create read/write accessor for homogeneous hierarchical record
 * @param {Object} record - Any hierarchical object
 * @returns {Object} Accessor with get/set methods
 */
export function createRecordAccessor(record) {
  return {
    get(path) {
      return getNestedValue(record, path);
    },
    set(path, value) {
      setNestedValue(record, path, value);
    },
    // Convenience methods for common hives
    getMetadata(path) {
      return getNestedValue(record, path ? `headers.${path}` : 'headers');
    },
    setMetadata(path, value) {
      if (!path) throw new Error('spl/_context: path required for setMetadata');
      setNestedValue(record, `headers.${path}`, value);
    },
    getData(path) {
      return getNestedValue(record, path ? `value.${path}` : 'value');
    },
    setData(path, value) {
      if (path) {
        setNestedValue(record, `value.${path}`, value);
      } else {
        record.value = value;
      }
    }
  };
}

/**
 * Create read-only accessor for homogeneous hierarchical record
 * @param {Object} record - Any hierarchical object
 * @returns {Object} Accessor with get method only
 */
export function createReadOnlyRecordAccessor(record) {
  return {
    get(path) {
      return getNestedValue(record, path);
    },
    // Convenience methods for common hives
    getMetadata(path) {
      return getNestedValue(record, path ? `headers.${path}` : 'headers');
    },
    getData(path) {
      return getNestedValue(record, path ? `value.${path}` : 'value');
    }
  };
}

/**
 * Create read-only accessor for flat arguments object
 * @param {Object} args - Flat key-value arguments
 * @returns {Object} Accessor with get method
 */
export function createArgsAccessor(args) {
  return {
    get(key) {
      return args[key];
    }
  };
}
