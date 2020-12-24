/**
 * Wrap the value in array.
 * @param {any} v
 * @returns {Array}
 */
export const wrapInArray = v => v != null ? Array.isArray(v) ? v : [v] : []

export default wrapInArray
