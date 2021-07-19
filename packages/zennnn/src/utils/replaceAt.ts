/**
 * Replace char at index
 * @param {string} str source string
 * @param {number} index destination classes
 * @param {string} replacement replace value
 * @returns {string} result
 */
export function replaceAt(str: string, index: number, replacement: string) {
  if (!str) return str
  return str.substring(0, index) + replacement + str.substring(index + 1)
}
