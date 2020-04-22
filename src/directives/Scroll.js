function inserted (el, binding) {
  const callback = binding.value
  const options = binding.options || { passive: true }
  let target = binding.arg ? document.querySelector(binding.arg) : el
  if (!target) return
  target.addEventListener('scroll', callback, options)
  el._onScroll = {
    callback,
    options,
    target,
  }
}
function unbind (el) {
  if (!el._onScroll) return
  const _el$OnScroll = el._onScroll
  const callback = _el$OnScroll.callback
  const options = _el$OnScroll.options
  const target = _el$OnScroll.target

  target.removeEventListener('scroll', callback, options)
  delete el._onScroll
}

export default {
  inserted,
  unbind,
}
