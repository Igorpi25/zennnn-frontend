import {
  h,
  ref,
  computed,
  watch,
  onBeforeMount,
  onBeforeUnmount,
} from 'vue'

import { useFormContext } from '../components/Form' // TODO: use/input
import Messages from '../components/Messages' // TODO: use/input
import Icon from '../components/Icon' // TODO: use/input

import { ziCheckedSm, ziStatusPointSm } from '@zennnn/icons' // TODO: use/input

// Props
export const useInputValidationProps = () => {
  return {
    rules: {
      type: Array,
      default: () => ([]),
    },
    pattern: String,
    patternMessage: String,
    validateOnBlur: Boolean,
    forceValidate: Boolean,
    error: Boolean,
    errorMessages: {
      type: Array,
      default: () => ([]),
    },
    messagesOnFocused: {
      type: Boolean,
      default: true,
    },
    hideDetails: {
      type: [Boolean, String],
      default: undefined,
    },
    errorCount: {
      type: Number,
      default: 1,
    },
    // state
    stateIcon: Boolean, // TODO: use/input
    stateSuccessIcon: String, // TODO: use/input
    stateErrorIcon: String, // TODO: use/input
    // tailwindcss text class
    stateSuccessColor: String, // TODO: use/input
    // warn, none or tailwindcss text class
    stateErrorColor: String, // TODO: use/input
  }
}

// Default
export const useInputValidation = (props, { emit, id, internalValue, isFocused }) => {
  const formApi = useFormContext()
  const valid = ref(false)

  const hasInput = ref(false)
  const hasFocused = ref(false)
  const errorBucket = ref([])
  const isResetting = ref(false)
  const isPatternMismatch = ref(false)

  const isDisabled = computed(() => props.disabled || (!!formApi && formApi.disabled))
  const isReadonly = computed(() => props.readonly || (!!formApi && formApi.readonly))

  const isInteractive = computed(() => {
    return !isDisabled.value && !isReadonly.value
  })

  const internalErrorMessages = computed(() => {
    return props.error ? props.errorMessages : []
  })

  const hasError = computed(() => {
    return (
      errorBucket.value.length > 0 ||
      internalErrorMessages.value.length > 0
    )
  })

  const hasMessages = computed(() => {
    return errorMessages.value.length > 0 || internalErrorMessages.value.length > 0
  })

  const showDetails = computed(() => {
    return props.hideDetails === false || (props.hideDetails === 'auto' && hasMessages.value)
  })

  const errorMessages = computed(() => {
    if (internalErrorMessages.value.length > 0) {
      return internalErrorMessages.value
    } else if (shouldValidate.value) {
      return errorBucket.value
    } else return []
  })

  const messagesToDisplay = computed(() => {
    return errorMessages.value.slice(0, props.errorCount)
  })

  const shouldValidate = computed(() => {
    if (props.forceValidate) return true
    if (isResetting.value) return false

    return props.validateOnBlur
      ? hasFocused.value
      : (hasInput.value || hasFocused.value)
  })

  const hasSuccess = computed(() => {
    return !props.validateOnBlur || valid.value
  })

  const hasState = computed(() => {
    if (isDisabled.value || !props.stateIcon) return false

    return (
      hasSuccess.value ||
      (shouldValidate.value && hasError.value)
    )
  })

  const validationState = computed(() => {
    return valid.value ? 'success' : 'error'
  })

  watch(internalValue, () => {
    hasInput.value = true
    // skip validation if not focused
    ;(props.validateOnBlur && !hasFocused.value) || validate()
  })

  // validate on blur
  watch(isFocused, (val) => {
    if (
      !val &&
      !isDisabled.value
    ) {
      hasFocused.value = true
      props.validateOnBlur && validate()
    }
  })

  watch(isResetting, () => {
    setTimeout(() => {
      hasInput.value = false
      hasFocused.value = false
      isResetting.value = false
      validate()
    }, 0)
  })

  watch(hasError, (val) => {
    if (shouldValidate.value) {
      emit('update:error', val)
    }
  })

  onBeforeMount(() => {
    formApi && formApi.register(input)
    validate()
  })

  onBeforeUnmount(() => {
    formApi && formApi.unregister(input)
  })

  const reset = () => {
    isResetting.value = true
    internalValue.value = Array.isArray(internalValue.value)
      ? []
      : undefined
  }

  const resetValidation = () => {
    isResetting.value = true
  }

  const validate = (force = false, value) => {
    const _errorBucket = []
    value = value || internalValue.value

    if (force) hasInput.value = hasFocused.value = true

    for (let index = 0; index < props.rules.length; index++) {
      const rule = props.rules[index]
      const valid = typeof rule === 'function' ? rule(value) : rule

      if (valid === false || typeof valid === 'string') {
        _errorBucket.push(valid || '')
      } else if (typeof valid !== 'boolean') {
        // eslint-disable-next-line
        console.log(`Rules should return a string or boolean, received '${typeof valid}' instead`)
      }
    }

    errorBucket.value = _errorBucket
    valid.value = _errorBucket.length === 0

    return valid.value
  }

  // TODO: use/input
  const genMessages = () => {
    if (!showDetails.value) return null

    return h(Messages, {
      value: messagesToDisplay.value,
      error: hasError.value,
      role: hasMessages.value ? 'alert' : null,
    })
  }

  // TODO: use/input
  const genStateIcon = () => {
    if (!hasState.value) return null
    const successIcon = props.stateSuccessIcon || ziCheckedSm
    const errorIcon = props.stateErrorIcon || ziStatusPointSm
    const successColor = props.stateSuccessColor || 'text-green-500'
    const errorColor = props.stateErrorColor === 'none'
      ? 'text-transparent'
      : props.stateErrorColor === 'warn' || (!props.required && !props.stateErrorColor)
        ? 'text-yellow-500'
        : props.stateErrorColor
          ? props.stateErrorColor
          : 'text-pink-500'
    const icon = validationState.value === 'success' ? successIcon : errorIcon
    const color = validationState.value === 'success' ? successColor : errorColor

    return h(Icon, {
      size: 24,
      class: {
        'w-6 flex-shrink-0': true,
        [color]: true,
      },
    }, {
      default: () => icon,
    })
  }

  // For form
  const input = {
    id,
    hasError,
    shouldValidate,
    reset,
    resetValidation,
    validate,
  }

  return {
    valid,
    isDisabled,
    isReadonly,
    isInteractive,
    hasError,
    hasMessages,
    showDetails,
    errorMessages,
    messagesToDisplay,
    shouldValidate,
    hasState,
    validationState,
    isPatternMismatch,
    reset,
    resetValidation,
    validate,
    genMessages, // TODO: use/input
    genStateIcon, // TODO: use/input
  }
}
