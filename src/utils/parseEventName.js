const optionsModifierRE = /(?:Once|Passive|Capture)$/

/**
 * Parse event name to type and modifiers.
 * @param {string} name The value to parse.
 * @returns {Array} Returns an array that contains type and modifiers.
 */
export const parseEventName = (name) => {
  let options
  if (optionsModifierRE.test(name)) {
    options = {}
    let m
    while ((m = name.match(optionsModifierRE))) {
      name = name.slice(0, name.length - m[0].length)
      options[m[0].toLowerCase()] = true
    }
  }
  return [name.slice(2).toLowerCase(), options]
}

export default parseEventName
