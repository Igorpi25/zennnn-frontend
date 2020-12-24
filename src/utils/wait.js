/**
 * Promise delay.
 * @param {number} ms delay
 * @returns {Promise}
 */
export const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

export default wait
