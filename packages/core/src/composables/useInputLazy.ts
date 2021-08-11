import { ref, watch, onBeforeMount, nextTick } from 'vue'
import { debounce } from 'lodash-es'

import type { Ref } from 'vue'
import type { DebouncedFunc } from 'lodash-es'

export interface InputLazyProps {
  modelValue?: any
  debounce?: number
}

export interface InputLazyContext {
  isFocused: Ref<boolean>
  setInternalValue: (val: any) => void
  emitChange: () => void
}

// Props
export const useInputLazyProps = () => {
  return {
    debounce: {
      type: Number,
      default: 0,
    },
  }
}

// Default
export const useInputLazy = (
  props: InputLazyProps,
  { isFocused, setInternalValue, emitChange }: InputLazyContext
) => {
  const debounceInput = ref<DebouncedFunc<() => void>>()

  watch(
    () => props.modelValue,
    (val) => {
      // do not update value from watcher, for subscription self update
      if (isFocused.value) return
      setInternalValue(val)
    }
  )

  onBeforeMount(() => {
    if (props.debounce) {
      debounceInput.value = debounce(emitChange, props.debounce)
    }
  })

  function cancelDebounce() {
    if (debounceInput.value) {
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
    debounceInput,
    cancelDebounce,
    clearableCallback,
  }
}
