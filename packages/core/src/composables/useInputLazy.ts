import { ref, computed, watch, onBeforeMount, nextTick } from 'vue'
import { debounce } from 'lodash-es'

import type { Ref } from 'vue'

export interface InputLazyProps {
  modelValue?: any
  lazy?: boolean
  debounce?: number
  forceUpdate?: boolean
}

export interface InputLazyContext {
  isFocused: Ref<boolean>
  setInternalValue: (val: any) => void
  emitChange: () => void
}

// Props
export const useInputLazyProps = () => {
  return {
    lazy: Boolean,
    debounce: {
      type: Number,
      default: 0,
    },
    forceUpdate: Boolean,
  }
}

// Default
export const useInputLazy = (
  props: InputLazyProps,
  { isFocused, setInternalValue, emitChange }: InputLazyContext
) => {
  const debounceInput = ref<any>()

  const hasDebounce = computed(() => !!(props.debounce && !props.lazy))

  watch(
    () => props.modelValue,
    (val) => {
      if (props.forceUpdate) {
        setInternalValue(val)
        return
      }
      // do not update value from watcher, for subscription self update
      if (isFocused.value) return
      setInternalValue(val)
    }
  )

  onBeforeMount(() => {
    if (hasDebounce.value) {
      debounceInput.value = debounce(emitChange, props.debounce)
    }
  })

  function cancelDebounce() {
    if (hasDebounce.value) {
      debounceInput.value.cancel()
    }
  }

  function clearableCallback() {
    nextTick(() => {
      setInternalValue(null)
      cancelDebounce()
      emitChange()
    })
  }

  return {
    hasDebounce,
    debounceInput,
    cancelDebounce,
    clearableCallback,
  }
}
