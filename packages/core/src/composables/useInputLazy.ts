import { ref, computed, watch, onBeforeMount, nextTick, Ref } from 'vue'

import { debounce } from 'lodash-es'

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
export const useInputLazy = (props: InputLazyProps, { isFocused, setInternalValue, emitChange }: InputLazyContext) => {
  const debounceInput = ref<any>()

  const hasDebounce = computed(() => {
    return props.debounce && !props.lazy
  })

  watch(() => props.modelValue, (val) => {
    if (props.forceUpdate) {
      setInternalValue(val)
      return
    }
    // do not update value from watcher, for subscription self update
    if (isFocused.value) return
    setInternalValue(val)
  })

  onBeforeMount(() => {
    if (hasDebounce.value) {
      debounceInput.value = debounce(emitChange, props.debounce)
    }
  })

  const cancelDebounce = () => {
    if (hasDebounce.value) {
      debounceInput.value.cancel()
    }
  }

  const clearableCallback = () => {
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
