const masker = function (value, mask, masked = true, tokens) {
  value = value || ''
  mask = mask || ''
  let iMask = 0
  let iValue = 0
  let output = ''
  while (iMask < mask.length && iValue < value.length) {
    let cMask = mask[iMask]
    const masker = tokens[cMask]
    const cValue = value[iValue]
    if (masker && !masker.escape) {
      if (masker.pattern.test(cValue)) {
        output += masker.transform ? masker.transform(cValue) : cValue
        iMask++
      }
      iValue++
    } else {
      if (masker && masker.escape) {
        iMask++ // take the next mask char and treat it as char
        cMask = mask[iMask]
      }
      if (masked) output += cMask
      if (cValue === cMask) iValue++ // user typed the same char
      iMask++
    }
  }

  // fix mask that ends with a char: (#)
  let restOutput = ''
  while (iMask < mask.length && masked) { // eslint-disable-line no-unmodified-loop-condition
    const cMask = mask[iMask]
    if (tokens[cMask]) {
      restOutput = ''
      break
    }
    restOutput += cMask
    iMask++
  }

  return output + restOutput
}

const tokens = {
  '#': { pattern: /\d/ },
  X: { pattern: /[0-9a-zA-Z]/ },
  S: { pattern: /[a-zA-Z]/ },
  A: { pattern: /[a-zA-Z]/, transform: v => v.toLocaleUpperCase() },
  a: { pattern: /[a-zA-Z]/, transform: v => v.toLocaleLowerCase() },
  '!': { escape: true },
}

// https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events#The_old-fashioned_way
function event (name) {
  var evt = document.createEvent('Event')
  evt.initEvent(name, true, true)
  return evt
}

export default function (el, binding) {
  var config = binding.value
  if (Array.isArray(config) || typeof config === 'string') {
    config = {
      mask: config,
      tokens: tokens,
    }
  }

  if (el.tagName.toLocaleUpperCase() !== 'INPUT') {
    var els = el.getElementsByTagName('input')
    if (els.length !== 1) {
      throw new Error('v-mask directive requires 1 input, found ' + els.length)
    } else {
      el = els[0]
    }
  }

  el.oninput = function (evt) {
    if (!evt.isTrusted) return // avoid infinite loop
    /* other properties to try to diferentiate InputEvent of Event (custom)
    InputEvent (native)
      cancelable: false
      isTrusted: true
      composed: true
      isComposing: false
      which: 0
    Event (custom)
      cancelable: true
      isTrusted: false
    */
    // by default, keep cursor at same position as before the mask
    var position = el.selectionEnd
    // save the character just inserted
    var digit = el.value[position - 1]
    el.value = masker(el.value, config.mask, true, config.tokens)
    // if the digit was changed, increment position until find the digit again
    while (position < el.value.length && el.value.charAt(position - 1) !== digit) {
      position++
    }
    if (el === document.activeElement) {
      el.setSelectionRange(position, position)
      setTimeout(function () {
        el.setSelectionRange(position, position)
      }, 0)
    }
    el.dispatchEvent(event('input'))
  }

  var newDisplay = masker(el.value, config.mask, true, config.tokens)
  if (newDisplay !== el.value) {
    el.value = newDisplay
    el.dispatchEvent(event('input'))
  }
}
