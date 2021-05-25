import { h, ref, computed, PropType, Ref, Slots, ComputedRef } from 'vue'

import { EmitFn } from '../../types'

import Icon from '../components/Icon'

export interface InputControlProps {
  controlClass: string
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
    controlClass: {
      type: String,
      default: '',
    },
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

  const hasPrependSlot = computed(() => {
    return props.prependIcon || slots.prepend
  })

  const hasAppendSlot = computed(() => {
    return props.appendIcon || slots.append
  })

  const isContains = (target: HTMLElement) => {
    if (!props.dependencies) return false
    return props.dependencies.some(
      (el: HTMLElement) => el && el.contains(target)
    )
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

  const genIcon = (icon: string, classes?: string, $size?: number) => {
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

  const genPrependSlot = () => {
    if (!hasPrependSlot.value) return undefined
    return h(
      'div',
      {
        class: 'flex items-center flex-shrink-0',
      },
      [
        props.prependIcon
          ? genIcon(props.prependIcon, 'text-gray-200 dark:text-gray-300')
          : undefined,
        slots.prepend?.({ focused: isFocused.value }),
      ]
    )
  }

  const genAppendSlot = () => {
    if (!hasAppendSlot.value) return undefined
    return h(
      'div',
      {
        class: 'flex items-center flex-shrink-0',
      },
      [
        slots.append?.({ focused: isFocused.value }),
        props.appendIcon
          ? genIcon(props.appendIcon, 'text-gray-200 dark:text-gray-300')
          : undefined,
      ]
    )
  }

  return {
    controlElement,
    hasMouseDown,
    hasPrependSlot,
    hasAppendSlot,
    onControlClick,
    onControlMouseDown,
    onControlMouseUp,
    genIcon,
    genPrependSlot,
    genAppendSlot,
  }
}
