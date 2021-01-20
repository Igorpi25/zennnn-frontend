const uidCounter = {}

/**
 * Generates a unique id.
 * @param {string} [prefix=$default] The value to prefix the id with.
 * @returns {string} Returns the unique id.
 */
export const uid = (prefix = '$default') => {
  if (!uidCounter[prefix]) {
    uidCounter[prefix] = 0
  }

  const id = ++uidCounter[prefix]
  if (prefix === '$default') {
    return `${id}`
  }

  return `${prefix}${id}`
}

export default uid
