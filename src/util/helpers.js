export function filterObjectOnKeys (obj, keys) {
  const filtered = {}

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]

    if (typeof obj[key] !== 'undefined') {
      filtered[key] = obj[key]
    }
  }

  return filtered
}

export function getObjectValueByPath (obj, path, fallback) {
  // credit: http://stackoverflow.com/questions/6491463/accessing-nested-javascript-objects-with-string-key#comment55278413_6491621
  if (obj == null || !path || typeof path !== 'string') return fallback
  if (obj[path] !== undefined) return obj[path]
  path = path.replace(/\[(\w+)\]/g, '.$1') // convert indexes to properties

  path = path.replace(/^\./, '') // strip a leading dot

  return getNestedValue(obj, path.split('.'), fallback)
}

export function getNestedValue (obj, path, fallback) {
  const last = path.length - 1
  if (last < 0) return obj === undefined ? fallback : obj

  for (let i = 0; i < last; i++) {
    if (obj == null) {
      return fallback
    }

    obj = obj[path[i]]
  }

  if (obj == null) return fallback
  return obj[path[last]] === undefined ? fallback : obj[path[last]]
}

export function defaultFilter (value, search) {
  return value != null &&
    search != null &&
    typeof value !== 'boolean' &&
    value.toString().toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) !== -1
}

export function sortItems (
  items,
  sortBy,
  sortDesc,
  locale,
  customSorters,
) {
  if (sortBy === null || !sortBy.length) return items

  return items.sort((a, b) => {
    for (let i = 0; i < sortBy.length; i++) {
      const sortKey = sortBy[i]

      let sortA = getObjectValueByPath(a, sortKey)
      let sortB = getObjectValueByPath(b, sortKey)

      if (sortDesc[i]) {
        [sortA, sortB] = [sortB, sortA]
      }

      if (customSorters && customSorters[sortKey]) {
        const customResult = customSorters[sortKey](sortA, sortB)

        if (!customResult) continue

        return customResult
      }

      // Check if both cannot be evaluated
      if (sortA === null && sortB === null) {
        continue
      }

      [sortA, sortB] = [sortA, sortB].map(s => (s || '').toString().toLocaleLowerCase())

      if (sortA !== sortB) {
        const sortResult = (!isNaN(sortA) && !isNaN(sortB))
          ? Number(sortA) - Number(sortB)
          : sortA.localeCompare(sortB, locale)

        if (sortResult) return sortResult
      }
    }

    return 0
  })
}

export function deepEqual (a, b) {
  if (a === b) return true

  if (a instanceof Date && b instanceof Date) {
    // If the values are Date, they were convert to timestamp with getTime and compare it
    if (a.getTime() !== b.getTime()) return false
  }

  if (a !== Object(a) || b !== Object(b)) {
    // If the values aren't objects, they were already checked for equality
    return false
  }

  const props = Object.keys(a)

  if (props.length !== Object.keys(b).length) {
    // Different number of props, don't bother to check
    return false
  }

  return props.every(p => deepEqual(a[p], b[p]))
}

/**
 * Convert to unit
 * @param {string,number,null,undefined} str value to convert
 * @param {string} unit convert unit
 * @returns {string,undefined} result
 */
export const convertToUnit = (str, unit = 'px') => {
  if (str == null || str === '') {
    return undefined
  } else if (isNaN(+str)) {
    return String(str)
  } else {
    return `${Number(str)}${unit}`
  }
}

/**
 * uuid
 * @returns {string} uuid
 */
export const uuid = () => {
  const s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4()
}

/**
 * Focus element by id
 * @param {number} id id of element
 * @param {boolean} isEnd if true, set position to end
 */
export function focusElement (id, isEnd) {
  setTimeout(() => {
    const el = document.getElementById(id)
    if (el) {
      el.focus()
      if (isEnd) {
        setCaretToEnd(el)
      }
    }
  }, 0)
}

/**
 * Get all textNodes
 * @param {HTMLElement} target element
 */
export const getAllTextnodes = (target) => {
  let treeWalker = document.createTreeWalker(
    target,
    NodeFilter.SHOW_TEXT,
    null,
    false,
  )
  let nodeList = []
  while (treeWalker.nextNode()) {
    const node = treeWalker.currentNode
    nodeList.push(node)
  }
  return nodeList
}

/**
 * Caret position
 * @param {HTMLElement} target element
 */
export const getCaretPosition = (target) => {
  if (!target) return
  let caretOffset = 0
  if (typeof window.getSelection !== 'undefined') {
    const range = window.getSelection().getRangeAt(0)
    const selected = range.toString().length
    const preCaretRange = range.cloneRange()
    preCaretRange.selectNodeContents(target)
    preCaretRange.setEnd(range.endContainer, range.endOffset)
    caretOffset = preCaretRange.toString().length - selected
  }
  return caretOffset
}

/**
 * Get target textnode and position
 * @param {HTMLElement} target element
 * @param {number} position caret position
 */
export const getCaretData = (target, position) => {
  if (!target) return
  let node
  let nodes = getAllTextnodes(target)
  for (let n = 0; n < nodes.length; n++) {
    if (position > nodes[n].nodeValue.length && nodes[n + 1]) {
      // remove amount from the position, go to next node
      position -= nodes[n].nodeValue.length
    } else {
      node = nodes[n]
      break
    }
  }
  // you'll need the node and the position (offset) to set the caret
  return { node, position }
}

/**
 * Set caret position
 * @param {HTMLElement} target element
 * @param {number} position cursor position
 */
export function setCaretPosition (target, position) {
  if (!target) return
  const d = getCaretData(target, position)
  if (!d.node) return
  // DOMException: Failed to execute 'setStart' on 'Range': The offset OFFSET is larger than the node's length
  const text = d.node.textContent || d.node.innerText
  if (d.position > text.length) return
  const sel = window.getSelection()
  const range = document.createRange()
  range.setStart(d.node, d.position)
  range.collapse(true)
  sel.removeAllRanges()
  sel.addRange(range)
}

/**
 * Set caret to end position
 * @param {HTMLElement} target element
 */
export function setCaretToEnd (target) {
  target.focus()
  if (document.createRange) {
    const range = document.createRange()
    const sel = window.getSelection()
    range.selectNodeContents(target)
    range.collapse(false)
    sel.removeAllRanges()
    sel.addRange(range)
  } else {
    const textRange = document.body.createTextRange()
    textRange.moveToElementText(target)
    textRange.collapse(false)
    textRange.select()
  }
}

/**
 * insert text or orther to editor
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand
 * @module Editor
 */
export const insertText = (content) => {
  document.execCommand('insertText', false, content)
}

/**
 * Promise delay
 * @param {number} ms delay
 * @returns {Promise}
 */
export const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Copy text to clipboard
 * @param {string} text value to copy
 */
export function copyToClipboard (text) {
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

/**
 * Set cursor of input
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

/**
 * Event for dispatch
 * @param {string} name of event
 * @returns {Event}
 */
export const event = (name) => {
  const evt = document.createEvent('Event')
  evt.initEvent(name, true, true)
  return evt
}

/**
 * Unformat number
 * @param {string|number} value
 * @returns {number}
 */
export const unformat = (value) => {
  // Fails silently (need decent errors):
  value = value || 0

  // Return the value as-is if it's already a number:
  if (typeof value === 'number') return value

  // Decimal can be ',' or '.'
  const decimal = '(,|.)'

  // Build regex to strip out everything except digits, decimal point and minus sign:
  const regex = new RegExp('[^0-9-' + decimal + ']', ['g'])
  const unformatted = parseFloat(
    ('' + value)
      .replace(/\((?=\d+)(.*)\)/, '-$1') // replace bracketed values with negatives
      .replace(regex, '') // strip out any cruft
      .replace(',', '.'), // make sure decimal point is standard
  )

  // This will fail silently which may cause trouble, let's wait and see:
  return !isNaN(unformatted) ? unformatted : 0
}

/**
 * Format number
 * @param {number} number
 * @param {Object} options
 * @param {number} options.precision default value 0
 * @param {string} options.thousand default value ''
 * @param {string} options.decimal default value ','
 * @param {boolean} options.fixed default value false, for fixed decimals
 * @returns {string}
 */
export const formatNumber = (number, options = {}) => {
  if (!number) return null
  // Build options object, extending defaults:
  const opts = {
    precision: options.precision || 0,
    thousand: options.thousand || '',
    decimal: options.decimal || ',',
    fixed: options.fixed || false,
  }
  const stringVal = isString(number) ? number.replace('.', opts.decimal) : ''
  const hasDelemiter = stringVal.slice(-1) === opts.decimal && opts.precision > 0

  // Clean up number:
  number = unformat(number, opts.decimal)
  const numberDecimal = number.toString().split('.')[1] || ''
  const numberPrecision = numberDecimal.length > opts.precision || opts.fixed
    ? opts.precision : numberDecimal.length

  // Clean up precision
  const usePrecision = checkPrecision(numberPrecision, opts.precision)

  // Do some calc:
  const negative = number < 0 ? '-' : ''
  const base = parseInt(toFixed(Math.abs(number || 0), usePrecision), 10) + ''
  const mod = base.length > 3 ? base.length % 3 : 0

  // Format the number:
  const formatted = negative + (mod ? base.substr(0, mod) + opts.thousand : '') + base.substr(mod).replace(/(\d{3})(?=\d)/g, '$1' + opts.thousand) + (usePrecision ? opts.decimal + toFixed(Math.abs(number), usePrecision).split('.')[1] : '')
  return hasDelemiter && !opts.fixed ? `${formatted}${opts.decimal}` : formatted
}

/**
 * Fixed number string
 * @param {number} value
 * @param {number} precision
 * @returns {string}
 */
export const toFixed = (value, precision) => {
  precision = checkPrecision(precision, 0)
  const exponentialForm = Number(unformat(value) + 'e' + precision)
  const rounded = Math.round(exponentialForm)
  const finalResult = Number(rounded + 'e-' + precision).toFixed(precision)
  return finalResult
}

/**
 * Check precision of number
 * @param {number} val
 * @param {number} base
 * @returns {number}
 */
export const checkPrecision = (val, base) => {
  val = Math.round(Math.abs(val))
  return isNaN(val) ? base : val
}

/**
 * String type check
 * @param {any} value
 * @returns {boolean}
 */
export function isString (value) {
  return typeof value === 'string' || value instanceof String
}

/**
 * Number type check
 * @param {any} value
 * @returns {boolean}
 */
export function isNumber (value) {
  return typeof value === 'number' && isFinite(value)
}

/**
 * Array type check
 * @param {any} value
 * @returns {boolean}
 */
export function isArray (value) {
  return value && typeof value === 'object' && value.constructor === Array
}

/**
 * Object type check
 * @param {any} value
 * @returns {boolean}
 */
export function isObject (value) {
  return value && typeof value === 'object' && value.constructor === Object
}
