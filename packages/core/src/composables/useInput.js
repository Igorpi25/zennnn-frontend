import {
  h,
  ref,
  computed,
  nextTick,
  onMounted,
} from 'vue'

import Label from '../components/Base/Label' // TODO: move to input-control
import Tooltip from '../components/Base/Tooltip' // TODO: move to input-control
import Icon from '../components/Base/Icon' // TODO: move to input-control

import { ziQuestionSign, ziCloseDelete } from '@zennnn/icons' // TODO: move to input-control

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
    inputClass: {
      type: String,
      default: '',
    },
  }
}

// Default
export const useInput = (props, { slots, emit, id }) => {
  const inputElement = ref(null)
  const internalValue = ref(props.modelValue)
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
      inputElement.value.focus()
    }
  })

  const focus = () => {
    inputElement.value && inputElement.value.focus()
  }

  const blur = () => {
    // Safari tab order gets broken if called synchronous
    window.requestAnimationFrame(() => {
      inputElement.value && inputElement.value.blur()
    })
  }

  const onFocus = () => {
    isFocused.value = true
  }
  const onBlur = () => {
    isFocused.value = false
  }

  const genInput = (data) => {
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
    if (!props.labelHint) return null
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
          onClick: (e) => {
            e.preventDefault()
          },
        }, {
          default: () => slots.label ? slots.label() : props.label,
          append: () => genLabelHint(),
        })
      : undefined
  }

  // TODO: move to input-control
  const genIcon = (icon, classes, $size) => {
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
    if (!hasPrependSlot.value) return null
    return h('div', {
      class: 'flex items-center flex-shrink-0',
    }, [
      props.prependIcon ? genIcon(props.prependIcon, 'w-6 text-gray-200 dark:text-gray-300 mr-2') : null,
      slots.prepend ? slots.prepend({ focused: isFocused.value }) : null,
    ])
  }

  // TODO: move to input-control
  const genAppendSlot = () => {
    if (!hasAppendSlot.value) return null
    return h('div', {
      class: 'flex items-center flex-shrink-0',
    }, [
      slots.append ? slots.append({ focused: isFocused.value }) : null,
      props.appendIcon ? genIcon(props.appendIcon, 'w-6 text-gray-200 dark:text-gray-300') : null,
    ])
  }

  // TODO: move to input-control
  const genClearIcon = (cb) => {
    if (!props.clearable) return null

    const disabled = !isDirty.value

    return h('button', {
      disabled: disabled,
      class: {
        'w-6 h-6 flex items-center justify-center focus:outline-none': true,
        'text-gray-200 focus:text-gray-300 hover:text-gray-300 dark:focus:text-gray-100 dark:hover:text-gray-100': true,
        invisible: disabled,
      },
      'aria-label': 'clear icon',
      onClick: (e) => {
        e.preventDefault()
        e.stopPropagation()

        emit('click:clear', e)

        inputElement.value && inputElement.value.focus()
        cb ? cb() : clearableCallback()
      },
    }, genIcon(ziCloseDelete))
  }

  const emitChange = () => {
    const val = internalValue.value
    if (val !== props.modelValue) {
      emit('update:modelValue', val)
    }
  }

  const setInternalValue = (val) => {
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
