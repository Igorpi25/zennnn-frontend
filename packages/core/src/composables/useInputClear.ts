import { h, nextTick } from 'vue'
import { ziCloseDelete } from '@zennnn/icons'
import Btn from '../components/Btn'
import Icon from '../components/Icon'

import type { Ref, ComputedRef } from 'vue'
import type { EmitFn } from '../../types'

export interface InputClearProps {
  clearable?: boolean
}

export interface InputClearContext {
  inputElement: Ref<HTMLElement | undefined>
  isDirty: ComputedRef<boolean>
  emitChange: () => void
  setInternalValue: (val: any) => void
  emit?: EmitFn
}

// Props
export const useInputClearProps = () => {
  return {
    clearable: Boolean,
  }
}

export const useInputClear = (
  props: InputClearProps,
  {
    isDirty,
    inputElement,
    emit,
    emitChange,
    setInternalValue,
  }: InputClearContext
) => {
  function genClearInput(cb?: () => void) {
    if (!props.clearable) return undefined

    const disabled = !isDirty.value

    return h(
      Btn,
      {
        text: true,
        icon: true,
        mini: true,
        class: {
          'rounded-full ring-inset': true,
          invisible: disabled,
        },
        disabled: disabled,
        'aria-label': 'clear icon',
        onClick: (e: MouseEvent) => {
          e.preventDefault()
          e.stopPropagation()

          emit?.('click:clear', e)

          inputElement.value?.focus()
          cb ? cb() : clearableCallback()
        },
      },
      {
        default: () =>
          h(
            Icon,
            {
              base: false,
              class: 'rounded-full text-lg bg-light-gray-200 dark:bg-gray-600',
            },
            {
              default: () => ziCloseDelete,
            }
          ),
      }
    )
  }

  function clearableCallback() {
    nextTick(() => {
      setInternalValue(null)
      emitChange()
    })
  }

  return {
    genClearInput,
    clearableCallback,
  }
}
