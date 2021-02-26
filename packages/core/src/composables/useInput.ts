import {
  h,
  ref,
  computed,
  nextTick,
  onMounted,
  Slots,
} from 'vue'

import { EmitFn } from '../../types'

import Label from '../components/Label' // TODO: move to input-control
import Tooltip from '../components/Tooltip' // TODO: move to input-control
import Icon from '../components/Icon' // TODO: move to input-control

import { ziQuestionSign, ziCloseDelete } from '@zennnn/icons' // TODO: move to input-control

export interface InputProps {
  modelValue?: any
  name?: string
  required?: boolean
  readonly?: boolean
  disabled?: boolean
  autofocus?: boolean
  placeholder?: string
  label?: string
  labelHint?: string
  showLabelWrap?: boolean
  prependIcon?: string
  appendIcon?: string
  clearable?: boolean
  loading?: boolean
  singleLine?: boolean
  solo?: boolean
  dense?: boolean
  inputClass?: string
}

export interface InputContext {
  id: string
  slots: Slots
  emit?: EmitFn
}

// Props
export const useInputProps = () => {
  return {
    modelValue: {
      type: [String, Number],
      default: null,
    },
    name: String,
    required: Boolean,
    readonly: Boolean,
    disabled: Boolean,
    autofocus: Boolean,
    placeholder: String,
    label: String, // TODO: move to input-control
    labelHint: String, // TODO: move to input-control
    showLabelWrap: Boolean, // TODO: move to input-control
    prependIcon: String, // TODO: move to input-control
    appendIcon: String, // TODO: move to input-control
    clearable: Boolean, // TODO: move to input-control
    loading: Boolean, // TODO: move to input-control
    singleLine: Boolean, // should exclude, where not needed
    solo: Boolean, // should exclude, where not needed
    dense: Boolean, // should exclude, where not needed
    inputClass: {
      type: String,
      default: '',
    },
  }
}

// Default
export const useInput = (props: InputProps, { slots, emit, id }: InputContext) => {
  const inputElement = ref<HTMLElement>()
  const internalValue = ref<string | number | boolean | any[] | null | undefined>(props.modelValue)
  const isFocused = ref(false)
  const badInput = ref(false)

  // TODO: move to input-control
  const hasLabel = computed(() => {
    return !!(slots.label || props.label) && !props.singleLine && !props.solo
  })

  const isDirty = computed(() => {
    return (internalValue.value && internalValue.value.toString().length > 0) || badInput.value
  })

  // TODO: move to input-control
  const hasPrependSlot = computed(() => {
    return props.prependIcon || slots.prepend
  })

  // TODO: move to input-control
  const hasAppendSlot = computed(() => {
    return props.appendIcon || slots.append
  })

  onMounted(() => {
    if (props.autofocus) {
      inputElement.value?.focus()
    }
  })

  const focus = () => {
    inputElement.value?.focus()
  }

  const blur = () => {
    // Safari tab order gets broken if called synchronous
    window.requestAnimationFrame(() => {
      inputElement.value?.blur()
    })
  }

  const onFocus = () => {
    isFocused.value = true
  }
  const onBlur = () => {
    isFocused.value = false
  }

  const genInput = (data: Record<string, unknown>) => {
    return h('input', {
      ref: inputElement,
      name: props.name,
      required: props.required,
      readonly: props.readonly,
      disabled: props.disabled,
      onFocus: onFocus,
      onBlur: onBlur,
      ...data,
    })
  }

  // TODO: move to input-control
  const genLabelHint = () => {
    if (!props.labelHint) return undefined
    return h(Tooltip, {
      maxWidth: 285,
      placement: 'top-start',
      skidding: -16,
      distance: 5,
      zIndex: 4,
      origin: '24px 100%',
      class: 'inline-flex',
    }, {
      default: () => props.labelHint,
      activator: () => {
        return h(Icon, {
          class: 'text-blue-500 ml-1',
        }, {
          default: () => ziQuestionSign,
        })
      },
    })
  }

  // TODO: move to input-control
  const genLabel = () => {
    return hasLabel.value
      ? h(Label, {
        for: id,
        showWrap: props.showLabelWrap,
        // prevent check on checkbox
        onClick: (e: MouseEvent) => {
          e.preventDefault()
        },
      }, {
        default: () => slots.label?.() ?? props.label,
        append: () => genLabelHint(),
      })
      : undefined
  }

  // TODO: move to input-control
  const genIcon = (icon: string, classes?: string, $size?: number) => {
    const size = $size || (props.dense || props.solo ? 20 : 24)
    return h(Icon, {
      size,
      class: classes,
    }, {
      default: () => icon,
    })
  }

  // TODO: move to input-control
  const genPrependSlot = () => {
    if (!hasPrependSlot.value) return undefined
    return h('div', {
      class: 'flex items-center flex-shrink-0',
    }, [
      props.prependIcon ? genIcon(props.prependIcon, 'w-6 text-gray-200 dark:text-gray-300 mr-2') : undefined,
      slots.prepend?.({ focused: isFocused.value }),
    ])
  }

  // TODO: move to input-control
  const genAppendSlot = () => {
    if (!hasAppendSlot.value) return undefined
    return h('div', {
      class: 'flex items-center flex-shrink-0',
    }, [
      slots.append?.({ focused: isFocused.value }),
      props.appendIcon ? genIcon(props.appendIcon, 'w-6 text-gray-200 dark:text-gray-300') : undefined,
    ])
  }

  // TODO: move to input-control
  const genClearIcon = (cb?: () => void) => {
    if (!props.clearable) return undefined

    const disabled = !isDirty.value

    return h('button', {
      disabled: disabled,
      class: {
        'w-6 h-6 flex items-center justify-center rounded focus:outline-none': true,
        'text-gray-200 hover:text-gray-400 dark:hover:text-gray-100 focus:ring-2 focus:ring-blue-400': true,
        invisible: disabled,
      },
      'aria-label': 'clear icon',
      onClick: (e: MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        emit?.('click:clear', e)

        inputElement.value?.focus()
        cb ? cb() : clearableCallback()
      },
    }, genIcon(ziCloseDelete))
  }

  const emitChange = () => {
    const val = internalValue.value
    if (val !== props.modelValue) {
      emit?.('update:modelValue', val)
    }
  }

  const setInternalValue = (val: any) => {
    internalValue.value = val
  }

  // TODO: move to input-control
  const clearableCallback = () => {
    nextTick(() => {
      setInternalValue(null)
      emitChange()
    })
  }

  return {
    inputElement,
    internalValue,
    isFocused,
    isDirty,
    hasPrependSlot, // TODO: move to input-control
    hasAppendSlot, // TODO: move to input-control
    badInput,
    focus, // TODO: move to input-control
    blur, // TODO: move to input-control
    genInput,
    genIcon, // TODO: move to input-control
    genPrependSlot, // TODO: move to input-control
    genAppendSlot, // TODO: move to input-control
    genLabel, // TODO: move to input-control
    genClearIcon, // TODO: move to input-control
    emitChange,
    setInternalValue,
  }
}
