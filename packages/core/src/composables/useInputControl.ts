import { h, ref, computed } from 'vue'
import Icon from '../components/Icon'

import type { PropType, Ref, Slots, ComputedRef } from 'vue'
import type { EmitFn } from '../../types'

export interface InputControlProps {
  controlClass?: string
  dependencies?: HTMLElement[]
  prependIcon?: string
  appendIcon?: string
}

export interface InputControlContext {
  isFocused: Ref<boolean>
  isDisabled: ComputedRef<boolean>
  inputElement: Ref<HTMLElement | undefined>
  slots: Slots
  emit?: EmitFn
}

// Props
export const useInputControlProps = () => {
  return {
    controlClass: String,
    dependencies: Array as PropType<HTMLElement[]>,
    prependIcon: String,
    appendIcon: String,
  }
}

export const useInputControl = (
  props: InputControlProps,
  { emit, slots, inputElement, isFocused, isDisabled }: InputControlContext
) => {
  const controlElement = ref<HTMLElement>()
  const hasMouseDown = ref<boolean>(false)

  const hasPrependSlot = computed(() => !!(props.prependIcon || slots.prepend))

  const hasAppendSlot = computed(() => !!(props.appendIcon || slots.append))

  function isContains(target: HTMLElement) {
    if (!props.dependencies) return false
    return props.dependencies.some(
      (el: HTMLElement) => el && el.contains(target)
    )
  }

  function onControlClick(e: MouseEvent) {
    if (isContains(e.target as HTMLElement)) return

    if (isFocused.value || isDisabled.value || !inputElement.value) return
    inputElement.value.focus()
  }

  function onControlMouseDown(e: MouseEvent) {
    if (isContains(e.target as HTMLElement)) return

    // Prevent input from being blurred
    if (e.target !== inputElement.value) {
      e.preventDefault()
      e.stopPropagation()
    }
    hasMouseDown.value = true

    emit?.('mousedown', e)
  }

  function onControlMouseUp(e: MouseEvent) {
    if (hasMouseDown.value) inputElement.value?.focus()

    hasMouseDown.value = false

    emit?.('mouseup', e)
  }

  function genIcon(
    icon: string,
    classes = 'text-gray-100 dark:text-gray-200 flex-shrink-0',
    $size?: number
  ) {
    const size = $size || 24
    return h(
      Icon,
      {
        size,
        class: classes,
      },
      {
        default: () => icon,
      }
    )
  }

  function genPrependSlot() {
    if (!hasPrependSlot.value) return []
    return [
      props.prependIcon ? genIcon(props.prependIcon) : undefined,
      slots.prepend?.({ focused: isFocused.value }),
    ]
  }

  function genAppendSlot() {
    if (!hasAppendSlot.value) return []
    return [
      slots.append?.({ focused: isFocused.value }),
      props.appendIcon ? genIcon(props.appendIcon) : undefined,
    ]
  }

  return {
    controlElement,
    hasMouseDown,
    hasPrependSlot,
    hasAppendSlot,
    onControlClick,
    onControlMouseDown,
    onControlMouseUp,
    genPrependSlot,
    genAppendSlot,
  }
}
