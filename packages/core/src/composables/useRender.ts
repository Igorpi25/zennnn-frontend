import { getCurrentInstance } from 'vue'
import type { VNode } from 'vue'

export function useRender(render: () => VNode | VNode[]): void {
  const vm = getCurrentInstance() as any
  vm.render = render
}
