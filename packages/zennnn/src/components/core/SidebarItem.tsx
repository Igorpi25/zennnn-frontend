import { FunctionalComponent, cloneVNode } from 'vue'
import { RouteLocationRaw } from 'vue-router'
import { Btn } from '@zennnn/core'

const SidebarItem: FunctionalComponent<{
  class?: string
  to?: RouteLocationRaw
  onClick?: (e?: MouseEvent) => void
}> = (props, { slots }) => {
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
      class="dark:text-white hover:bg-light-gray-200 dark:hover:bg-gray-800 w-full justify-start text-left rounded-none ring-inset focus:ring-offset-0"
      contentClass="w-full space-x-4"
    >
      {genSlot('start')}
      {genDefaultSlot()}
      {genSlot('end')}
    </Btn>
  )
}

export default SidebarItem
