import { FunctionalComponent, cloneVNode } from 'vue'
import { RouteLocationRaw } from 'vue-router'
import { Btn } from '@zennnn/core'

const SidebarItem: FunctionalComponent<{
  class?: string
  to?: RouteLocationRaw
  href?: string
  retainFocusOnClick?: boolean
  onClick?: (e: MouseEvent) => void
}> = (props, { slots, attrs }) => {
  function genSlot(name: 'start' | 'end') {
    if (!slots[name]) return undefined
    const data = {
      class: 'flex-shrink-0',
    }
    const node = slots[name]!()
    return node.map((n) => cloneVNode(n, data))
  }

  function genDefaultSlot() {
    if (!slots.default) return undefined
    const data = {
      class: 'flex-grow truncate',
    }
    const node = slots.default()
    return node.map((n) => cloneVNode(n, data))
  }

  return (
    <Btn
      primary={false}
      to={props.to}
      href={props.href}
      retainFocusOnClick={props.retainFocusOnClick}
      class="hover:text-white hover:bg-blue-400 dark:hover:bg-blue-400 w-full justify-start text-left rounded-none ring-inset"
      contentClass="w-full space-x-4"
      {...attrs}
    >
      {genSlot('start')}
      {genDefaultSlot()}
      {genSlot('end')}
    </Btn>
  )
}

export default SidebarItem
