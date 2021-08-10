import { h, ref, computed, onMounted } from 'vue'
import { ziQuestionSign } from '@zennnn/icons'
import Label from '../components/Label'
import Tooltip from '../components/Tooltip'
import Icon from '../components/Icon'

import type { Slots } from 'vue'
import type { EmitFn } from '../../types'

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
  loading?: boolean
  singleLine?: boolean
  solo?: boolean // declarated in component props
  inputClass?: string
  tabindex?: string
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
    loading: Boolean,
    singleLine: Boolean,
    inputClass: {
      type: String,
      default: '',
    },
    tabindex: String,
  }
}

export const useInput = (
  props: InputProps,
  { slots, emit, id }: InputContext
) => {
  const inputElement = ref<HTMLElement>()
  const internalValue = ref<
    string | number | boolean | any[] | null | undefined
  >(props.modelValue)
  const isFocused = ref(false)
  const badInput = ref(false)

  const hasLabel = computed(
    () => !!(slots.label || props.label) && !props.singleLine && !props.solo
  )

  const isDirty = computed(
    () =>
      (internalValue.value && internalValue.value.toString().length > 0) ||
      badInput.value
  )

  const inputData = computed(() => ({
    ref: inputElement,
    name: props.name,
    required: props.required,
    readonly: props.readonly,
    disabled: props.disabled,
    tabindex: props.tabindex,
    onFocus: onFocus,
    onBlur: onBlur,
  }))

  onMounted(() => {
    if (props.autofocus) {
      inputElement.value?.focus()
    }
  })

  function focus() {
    inputElement.value?.focus()
  }

  function blur() {
    // Safari tab order gets broken if called synchronous
    window.requestAnimationFrame(() => {
      inputElement.value?.blur()
    })
  }

  function onFocus() {
    isFocused.value = true
  }
  function onBlur() {
    isFocused.value = false
  }

  function genLabelHint() {
    if (!props.labelHint) return undefined
    return h(
      Tooltip,
      {
        maxWidth: 285,
        placement: 'top-start',
        skidding: -16,
        distance: 5,
        origin: '24px 100%',
        class: 'inline-flex',
      },
      {
        default: () => props.labelHint,
        activator: () => {
          return h(
            Icon,
            {
              class: 'text-blue-500',
            },
            {
              default: () => ziQuestionSign,
            }
          )
        },
      }
    )
  }

  function genLabel() {
    return hasLabel.value
      ? h(
          Label,
          {
            for: id,
            // prevent check on checkbox
            onClick: (e: MouseEvent) => {
              e.preventDefault()
            },
          },
          {
            default: () => slots.label?.() ?? props.label,
            append: () => genLabelHint(),
          }
        )
      : undefined
  }

  function emitChange() {
    const val = internalValue.value
    if (val !== props.modelValue) {
      emit?.('update:modelValue', val)
    }
  }

  function setInternalValue(val: any) {
    internalValue.value = val
  }

  return {
    inputData,
    inputElement,
    internalValue,
    isFocused,
    isDirty,
    badInput,
    focus,
    blur,
    genLabel,
    emitChange,
    setInternalValue,
  }
}
