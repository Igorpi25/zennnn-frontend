import { FunctionalComponent } from 'vue'

const Divider: FunctionalComponent<{
  class?: string
}> = () => {
  return <div class="border-t border-light-gray-550 dark:border-gray-400" />
}

export default Divider
