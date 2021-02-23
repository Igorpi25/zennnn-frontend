import { ref, PropType, Ref, ComputedRef } from 'vue'

import { EmitFn } from '../../types'

export interface InputControlProps {
  controlClass: string
  dependencies?: HTMLElement[]
}

export interface InputControlContext {
  isFocused: Ref<boolean>
  isDisabled: ComputedRef<boolean>
  inputElement: Ref<HTMLElement | undefined>
  emit?: EmitFn
}

// Props
export const useInputControlProps = () => {
  return {
    controlClass: {
      type: String,
      default: '',
    },
    dependencies: Array as PropType<HTMLElement[]>,
  }
}

// Default
export const useInputControl = (props: InputControlProps, { emit, inputElement, isFocused, isDisabled }: InputControlContext) => {
  const controlElement = ref<HTMLElement>()
  const hasMouseDown = ref<boolean>(false)

  const isContains = (target: HTMLElement) => {
    if (!props.dependencies) return false
    return props.dependencies.some((el: HTMLElement) => el && el.contains(target))
  }

  const onControlClick = (e: MouseEvent) => {
    if (isContains(e.target as HTMLElement)) return

    if (isFocused.value || isDisabled.value || !inputElement.value) return
    inputElement.value.focus()
  }

  const onControlMouseDown = (e: MouseEvent) => {
    if (isContains(e.target as HTMLElement)) return

    // Prevent input from being blurred
    if (e.target !== inputElement.value) {
      e.preventDefault()
      e.stopPropagation()
    }
    hasMouseDown.value = true

    emit?.('mousedown', e)
  }

  const onControlMouseUp = (e: MouseEvent) => {
    if (hasMouseDown.value) inputElement.value?.focus()

    hasMouseDown.value = false

    emit?.('mouseup', e)
  }

  return {
    controlElement,
    hasMouseDown,
    onControlClick,
    onControlMouseDown,
    onControlMouseUp,
  }
}
