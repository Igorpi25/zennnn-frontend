import { cloneVNode } from 'vue'
import { Btn } from '@zennnn/core'

import type { FunctionalComponent } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

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
      contentClass="w-full space-x-4 leading-normal"
      {...attrs}
    >
      {genSlot('start')}
      {genDefaultSlot()}
      {genSlot('end')}
    </Btn>
  )
}

export default SidebarItem
