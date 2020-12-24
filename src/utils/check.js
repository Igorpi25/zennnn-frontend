/**
 * String type check.
 * @param {any} v
 * @returns {boolean}
 */
export const isString = v => typeof v === 'string' || v instanceof String

/**
 * Number type check.
 * @param {any} v
 * @returns {boolean}
 */
export const isNumber = v => typeof v === 'number' && isFinite(v)

/**
 * Array type check.
 * @param {any} v
 * @returns {boolean}
 */
export const isArray = v => v && typeof v === 'object' && v.constructor === Array

/**
 * Object type check.
 * @param {any} v
 * @returns {boolean}
 */
export const isObject = v => v && typeof v === 'object' && v.constructor === Object
