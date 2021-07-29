/**
 * Check string for link
 * @param {string} value string
 * @returns {boolean}
 */
export function isLink(value: string) {
  if (!value || typeof value !== 'string') return false
  const re = /^(http(s)?:\/\/)([^\s]+)/
  value.replace(/\s/, '')
  return re.test(value)
}
