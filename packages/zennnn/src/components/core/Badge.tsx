import { FunctionalComponent, computed } from 'vue'

const Badge: FunctionalComponent<{
  class?: string
  colorClass?: string
}> = (props, { slots }) => {
  const colorClass = computed(() => {
    return props.colorClass || 'bg-purple-500'
  })

  return (
    <div
      class={[
        'w-6 h-6 flex-shrink-0 rounded-full inline-flex items-center justify-center text-white',
        colorClass.value,
      ]}
    >
      {slots.default?.()}
    </div>
  )
}

export default Badge
