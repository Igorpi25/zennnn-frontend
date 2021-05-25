import { h, Transition, FunctionalComponent } from 'vue'
import { upperFirst } from 'vue-supp'

interface HTMLExpandElement extends HTMLElement {
  _parent?: (Node & ParentNode & HTMLElement) | null
  _initialStyle?: {
    transition: string
    overflow: string
    height?: string | null
    width?: string | null
  }
}

const ExpandTransition: FunctionalComponent<{
  mode?: 'in-out' | 'out-in' | 'default'
  x?: boolean
  expandedParentClass?: string
}> = (props, { slots }) => {
  const mode = props.mode || 'in-out'
  const name = props.x ? 'expand-x-transition' : 'expand-transition'
  const expandedParentClass = props.expandedParentClass
  const sizeProperty = props.x ? 'width' : ('height' as 'width' | 'height')
  const offsetProperty = `offset${upperFirst(sizeProperty)}` as
    | 'offsetHeight'
    | 'offsetWidth'

  const resetStyles = (_el: Element) => {
    const el = _el as HTMLExpandElement

    const size = el._initialStyle![sizeProperty]
    el.style.overflow = el._initialStyle!.overflow
    if (size != null) el.style[sizeProperty] = size
    delete el._initialStyle
  }

  const onBeforeEnter = (_el: Element) => {
    const el = _el as HTMLExpandElement

    el._parent = el.parentNode as (Node & ParentNode & HTMLElement) | null
    el._initialStyle = {
      transition: el.style.transition,
      overflow: el.style.overflow,
      [sizeProperty]: el.style[sizeProperty],
    }
  }

  const onEnter = (_el: Element) => {
    const el = _el as HTMLExpandElement

    const initialStyle = el._initialStyle!

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

  const onLeave = (_el: Element) => {
    const el = _el as HTMLExpandElement

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

  const onAfterLeave = (_el: Element) => {
    const el = _el as HTMLExpandElement

    if (expandedParentClass && el._parent) {
      el._parent.classList.remove(expandedParentClass)
    }
    resetStyles(el)
  }

  const onLeaveCancelled = onAfterLeave

  return h(
    Transition,
    {
      name: name,
      mode: mode,
      onBeforeEnter,
      onEnter,
      onAfterEnter,
      onEnterCancelled,
      onLeave,
      onAfterLeave,
      onLeaveCancelled,
    },
    {
      default: () => slots.default?.(),
    }
  )
}

export default ExpandTransition
