/** Used to generate unique IDs. */
const idCounter = {}

/**
 * Generates a unique ID. If `prefix` is given, the ID is appended to it.
 * @param {string} [prefix=''] The value to prefix the ID with.
 * @returns {string} Returns the unique ID.
 */

function uid (prefix = '$default') {
  if (!idCounter[prefix]) {
    idCounter[prefix] = 0
  }

  const id = ++idCounter[prefix]
  if (prefix === '$default') {
    return `${id}`
  }

  return `${prefix}${id}`
}

export default uid
