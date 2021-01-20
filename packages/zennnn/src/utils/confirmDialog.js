/**
 * Confirm
 * TODO: move to plugin
 * @returns {string} message
 */
export const confirmDialog = (msg) => {
  return new Promise((resolve, reject) => {
    const confirmed = window.confirm(msg)
    return confirmed ? resolve('confirmed') : reject('not_confirmed') // eslint-disable-line
  })
}

export default confirmDialog
