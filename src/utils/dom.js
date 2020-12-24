/**
 * Set cursor of input.
 * @param {HTMLElement} el
 * @param {position} position
 * @returns {Event}
 */
export const setCursor = (el, position) => {
  const setSelectionRange = function () { el.setSelectionRange(position, position) }
  if (el === document.activeElement) {
    setSelectionRange()
    setTimeout(setSelectionRange, 1) // Android Fix
  }
}
