import { computed, FunctionalComponent } from 'vue'

const SubscriptionLabel: FunctionalComponent<{
  class?: string
  status?: string
}> = (props, { slots }) => {
  const statusClass = computed(() => {
    switch (props.status) {
      case 'paid':
        return 'bg-green-500'
      case 'trial':
        return 'bg-yellow-500'
      default:
        return 'bg-pink-500'
    }
  })

  return (
    <div
      class={[
        'h-6 flex-shrink-0 rounded-xl inline-flex items-center justify-center text-sm text-gray-900 px-2',
        statusClass.value,
      ]}
    >
      {slots.default?.()}
    </div>
  )
}

export default SubscriptionLabel
