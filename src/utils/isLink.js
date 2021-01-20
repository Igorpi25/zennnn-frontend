/**
 * Check string for link
 * @param {string} value string
 * @returns {boolean}
 */
export const isLink = (value) => {
  if (!value || typeof value !== 'string') return false
  const re = /^(http(s)?:\/\/)([^\s]+)/
  value.replace(/\s/, '')
  return re.test(value)
}

export default isLink
