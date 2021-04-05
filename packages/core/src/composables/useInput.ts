import {
  h,
  ref,
  computed,
  onMounted,
  Slots,
} from 'vue'

import { ziQuestionSign } from '@zennnn/icons'

import { EmitFn } from '../../types'

import Label from '../components/Label'
import Tooltip from '../components/Tooltip'
import Icon from '../components/Icon'

import '../styles/input.css'

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
  loading?: boolean
  singleLine?: boolean
  solo?: boolean // declarated in component props
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
    label: String,
    labelHint: String,
    showLabelWrap: Boolean,
    loading: Boolean,
    singleLine: Boolean,
    inputClass: {
      type: String,
      default: '',
    },
  }
}

export const useInput = (props: InputProps, { slots, emit, id }: InputContext) => {
  const inputElement = ref<HTMLElement>()
  const internalValue = ref<string | number | boolean | any[] | null | undefined>(props.modelValue)
  const isFocused = ref(false)
  const badInput = ref(false)

  const hasLabel = computed(() => {
    return !!(slots.label || props.label) && !props.singleLine && !props.solo
  })

  const isDirty = computed(() => {
    return (internalValue.value && internalValue.value.toString().length > 0) || badInput.value
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

  const emitChange = () => {
    const val = internalValue.value
    if (val !== props.modelValue) {
      emit?.('update:modelValue', val)
    }
  }

  const setInternalValue = (val: any) => {
    internalValue.value = val
  }

  return {
    inputElement,
    internalValue,
    isFocused,
    isDirty,
    badInput,
    focus,
    blur,
    genInput,
    genLabel,
    emitChange,
    setInternalValue,
  }
}
