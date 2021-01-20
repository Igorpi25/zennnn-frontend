import { h, Transition } from 'vue'
import { upperFirst } from 'vue-supp'

/**
 * Props
 * @param {string} [props.mode=in-out] Transition mode.
 * @param {boolean} [props.x=in-out] Transition direction.
 * @param {string} expandedParentClass Class names to add parent.
 */
export default (props, { slots }) => {
  const mode = props.mode || 'in-out'
  const name = props.x ? 'expand-x-transition' : 'expand-transition'
  const expandedParentClass = props.expandedParentClass
  const sizeProperty = props.x ? 'width' : 'height'
  const offsetProperty = `offset${upperFirst(sizeProperty)}`

  const resetStyles = (el) => {
    const size = el._initialStyle[sizeProperty]
    el.style.overflow = el._initialStyle.overflow
    if (size != null) el.style[sizeProperty] = size
    delete el._initialStyle
  }

  const onBeforeEnter = (el) => {
    el._parent = el.parentNode
    el._initialStyle = {
      transition: el.style.transition,
      overflow: el.style.overflow,
      [sizeProperty]: el.style[sizeProperty],
    }
  }

  const onEnter = (el) => {
    const initialStyle = el._initialStyle

    el.style.setProperty('transition', 'none', 'important')
    // Hide overflow to account for collapsed margins in the calculated height
    el.style.overflow = 'hidden'
    const offset = `${el[offsetProperty]}px`

    el.style[sizeProperty] = '0'

    // eslint-disable-next-line no-void
    void el.offsetHeight // force reflow

    el.style.transition = initialStyle.transition

    if (expandedParentClass && el._parent) {
      el._parent.classList.add(expandedParentClass)
    }

    requestAnimationFrame(() => {
      el.style[sizeProperty] = offset
    })
  }

  const onAfterEnter = resetStyles
  const onEnterCancelled = resetStyles

  const onLeave = (el) => {
    el._initialStyle = {
      transition: '',
      overflow: el.style.overflow,
      [sizeProperty]: el.style[sizeProperty],
    }

    el.style.overflow = 'hidden'
    el.style[sizeProperty] = `${el[offsetProperty]}px`
    // eslint-disable-next-line no-void
    void el.offsetHeight // force reflow

    requestAnimationFrame(() => (el.style[sizeProperty] = '0'))
  }

  const onAfterLeave = (el) => {
    if (expandedParentClass && el._parent) {
      el._parent.classList.remove(expandedParentClass)
    }
    resetStyles(el)
  }

  const onLeaveCancelled = onAfterLeave

  return h(Transition, {
    name: name,
    mode: mode,
    onBeforeEnter,
    onEnter,
    onAfterEnter,
    onEnterCancelled,
    onLeave,
    onAfterLeave,
    onLeaveCancelled,
  }, {
    default: () => {
      return slots.default ? slots.default() : null
    },
  })
}
