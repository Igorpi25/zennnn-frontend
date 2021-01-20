/**
 * Copy text to clipboard
 * @param {string} text value to copy
 */
export const copyToClipboard = (text) => {
  return new Promise((resolve, reject) => {
    const el = document.createElement('textarea')
    el.value = text
    el.setAttribute('readonly', '')
    el.style.position = 'absolute'
    el.style.left = '-9999px'
    document.body.appendChild(el)
    let selected

    try {
      // Check if there is any content selected previously
      // Store selection if found
      // Mark as false to know no selection existed before
      // eslint-disable-next-line
      document.getSelection().rangeCount > 0
        ? document.getSelection().getRangeAt(0)
        : false
      el.select()
      // Copy - only works as a result of a user action (e.g. click events)
      const successful = document.execCommand('copy')
      const msg = successful ? 'successful' : 'unsuccessful'
      resolve(msg)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Unable to copy, ', error)
      reject(error)
    }

    document.body.removeChild(el)
    // If a selection existed before copying
    // Unselect everything on the HTML document
    // Restore the original selection
    if (selected) {
      document.getSelection().removeAllRanges()
      document.getSelection().addRange(selected)
    }
  })
}

export default copyToClipboard
