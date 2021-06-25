import { ref, computed, watch, onMounted } from 'vue'

import type { ComputedRef, UnwrapRef } from 'vue'
import type { ReactiveVar } from '@apollo/client/core'

export function useReactiveVar<T>(rv: ReactiveVar<T>): ComputedRef<T> {
  const internal = ref<T>(rv())

  const setValue = (v: T) => {
    internal.value = v as UnwrapRef<T>
  }

  watch(internal, () => {
    rv.onNextChange(setValue)
  })

  onMounted(() => {
    rv.onNextChange(setValue)
  })

  return computed(() => internal.value as T)
}
