import { h, nextTick, Ref, ComputedRef } from 'vue'

import { ziCloseDelete } from '@zennnn/icons'

import { EmitFn } from '../../types'

import Icon from '../components/Icon'

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
  const genClearInput = (cb?: () => void) => {
    if (!props.clearable) return undefined

    const disabled = !isDirty.value

    return h(
      Icon,
      {
        tag: 'button',
        size: 24,
        class: {
          'text-gray-200 hover:text-gray-400 dark:hover:text-gray-100 focus:ring-offset-0':
            true,
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
        default: () => ziCloseDelete,
      }
    )
  }

  const clearableCallback = () => {
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
