import {
  h,
  ref,
  reactive,
  computed,
  nextTick,
  withDirectives,
  defineComponent,
} from 'vue'

import { useClientRect, Mask, setCursor } from 'vue-supp'

import { useInputProps, useInput } from '../../composables/useInput'
import { useInputClearProps, useInputClear } from '../../composables/useInputClear'
import { useInputControlProps, useInputControl } from '../../composables/useInputControl'
import { useInputValidationProps, useInputValidation } from '../../composables/useInputValidation'
import { useInputNumberProps, useInputNumber } from '../../composables/useInputNumber'
import { useInputLazyProps, useInputLazy } from '../../composables/useInputLazy'
import { useInputMessage } from '../../composables/useInputMessage'

import uid from '../../utils/uid'

import './TextField.css'

export default defineComponent({
  name: 'TextField',

  props: {
    ...useInputProps(),
    ...useInputClearProps(),
    ...useInputValidationProps(),
    ...useInputNumberProps(),
    ...useInputControlProps(),
    ...useInputLazyProps(),
    modelValue: {
      type: [String, Number, Date],
      default: null,
    },
    mask: String,
    alignRight: Boolean,
    singleLine: Boolean,
    solo: Boolean,
    dense: Boolean,
    type: {
      type: String,
      default: 'text',
    },
    inputmode: {
      type: String,
      default: 'text',
    },
    minlength: String,
    maxlength: String,
    autocomplete: {
      type: String,
      default: 'off',
    },
    size: [Number, String],
    ariaLabel: String,
    ariaAutocomplete: String,
    placeholder: String,
  },

  emits: ['update:modelValue', 'update:error', 'click:clear', 'focus', 'blur', 'change', 'keydown', 'mousedown', 'mouseup'],

  setup (props, { slots, emit }) {
    const id: string = uid('text-field-')
    const rootElement = ref<HTMLElement>()

    const {
      inputElement,
      internalValue,
      isFocused,
      badInput,
      isDirty,
      focus,
      blur,
      genLabel,
      emitChange,
    } = useInput(props, { slots, emit, id })

    const {
      showDetails,
      isDisabled,
      isReadonly,
      hasState,
      hasError,
      hasMessages,
      messagesToDisplay,
      isPatternMismatch,
      shouldValidate,
      genStateIcon,
      reset,
      resetValidation,
      validate,
    } = useInputValidation(props, { emit, id, internalValue, isFocused })

    const {
      controlElement,
      hasPrependSlot,
      hasAppendSlot,
      onControlClick,
      onControlMouseDown,
      onControlMouseUp,
      genPrependSlot,
      genAppendSlot,
    } = useInputControl(props, { emit, slots, inputElement, isFocused, isDisabled })

    const clientRectProps = reactive({
      element: controlElement,
      hasResizeListener: true,
    })
    const {
      clientRect,
      updateClientRect,
    } = useClientRect(clientRectProps)

    const {
      genInputMessages,
    } = useInputMessage(props, {
      controlElement,
      isFocused,
      isPatternMismatch,
      hasMessages,
      hasError,
      messagesToDisplay,
      showDetails,
      dimensions: clientRect,
    })

    const {
      formattedNumber,
      numberDecimal,
      numberPrecision,
      inputmode,
      computedPlaceholder,
      formatNumber,
      formatInputNumber,
      unformatNumber,
      setInternalValue,
    } = useInputNumber(props, { internalValue, isFocused })

    const {
      genClearInput,
    } = useInputClear(props, { inputElement, isDirty, emit, emitChange, setInternalValue })

    const {
      hasDebounce,
      debounceInput,
      cancelDebounce,
      clearableCallback,
    } = useInputLazy(props, { isFocused, setInternalValue, emitChange })

    const classes = computed(() => {
      return {
        input: true,
        'input--focused': isFocused.value,
        'input--disabled': isDisabled.value,
        'input--align-right': props.alignRight || props.number,
        'input--dirty': internalValue.value,
        'input--has-error': ((hasMessages.value && hasError.value) || isPatternMismatch.value) && showDetails.value,
        'text-field': true,
      }
    })

    const onFocus = (e: Event) => {
      if (document.activeElement !== inputElement.value) {
        inputElement.value?.focus()
      }
      const target = e.target as HTMLInputElement
      updateClientRect()
      if (!isFocused.value) {
        isFocused.value = true

        if (props.number) {
          formattedNumber.value = formatInputNumber(internalValue.value)
          setTimeout(() => {
            target.selectionStart = target.selectionEnd = target.value.length
          })
        }

        e && emit('focus', e)
      }
    }

    const onBlur = (e: Event) => {
      isFocused.value = false

      if (props.number) {
        formattedNumber.value = formatNumber(internalValue.value)
      }
      // immediate call changes
      if (!props.lazy) {
        // cancel debounced
        cancelDebounce()
        emitChange()
      }

      // clear pattern mismatch
      isPatternMismatch.value = false

      e && nextTick(() => emit('blur', e))
    }

    const onInput = (e: Event) => {
      const target = e.target as HTMLInputElement
      let value: any = target.value || ''

      badInput.value = target.validity && target.validity.badInput

      if (props.pattern) {
        isPatternMismatch.value = target.validity && target.validity.patternMismatch
        if (isPatternMismatch.value) {
          let positionFromEnd = target.value.length - target.selectionEnd!
          value = internalValue.value
          target.value = internalValue.value as string
          positionFromEnd = target.value.length - positionFromEnd
          setCursor(target, positionFromEnd)
        }
      }

      if (props.number) {
        let positionFromEnd = target.value.length - target.selectionEnd!
        // update input value with formatted data
        formattedNumber.value = formatInputNumber(value)
        target.value = formattedNumber.value as string
        positionFromEnd = target.value.length - positionFromEnd
        setCursor(target, positionFromEnd)
        value = unformatNumber(value)
      }

      internalValue.value = value

      if (!props.lazy) {
        if (hasDebounce.value) {
          debounceInput.value()
        } else {
          emitChange()
        }
      }
    }

    const onChange = (e: Event) => {
      if (props.lazy) {
        emitChange()
      }

      emit('change', e)
    }

    const onKeydown = (e: KeyboardEvent) => {
      // on esc set value from store
      if (e.key === 'Esc' || e.key === 'Escape') {
        cancelDebounce()
        setInternalValue(props.modelValue)

        e.preventDefault()
      } else if (e.key === 'Enter') {
        // not lazy, immediate call emit changes
        // on lazy, will be called onChange
        if (!props.lazy) {
          cancelDebounce()
          emitChange()
        }
      }

      emit('keydown', e)
    }

    const genTextFieldInput = () => {
      const data: Record<string, unknown> = {
        id,
        ref: inputElement,
        value: props.number ? formattedNumber.value : internalValue.value,
        class: {
          input__input: true,
          'input__input--dense': props.dense || props.solo,
          'text-field__input': true,
          [props.inputClass.trim()]: true,
        },
        name: props.name,
        required: props.required,
        placeholder: computedPlaceholder.value,
        type: props.type,
        autofocus: props.autofocus,
        minlength: props.minlength,
        maxlength: props.maxlength,
        inputmode: inputmode.value,
        readonly: isReadonly.value,
        disabled: isDisabled.value,
        autocomplete: props.autocomplete,
        'aria-label': props.ariaLabel,
        'aria-autocomplete': props.ariaAutocomplete,
        onFocus: onFocus,
        onBlur: onBlur,
        onInput: onInput,
        onChange: onChange,
        onKeydown: onKeydown,
      }
      if (props.size) data.size = props.size
      if (props.pattern) data.pattern = props.pattern
      if (props.mask) {
        return withDirectives(
          h('input', data),
          [
            [Mask, props.mask],
          ],
        )
      }
      return h('input', data)
    }

    const genControl = () => {
      return h('div', {
        ref: controlElement,
        class: {
          input__control: true,
          'input__control--solo': props.solo,
          'input__control--has-prepend': hasPrependSlot.value,
          'input__control--has-append': hasAppendSlot.value || hasState.value || props.clearable,
          'text-field__control': true,
          [props.controlClass.trim()]: true,
        },
        onClick: onControlClick,
        onMousedown: onControlMouseDown,
        onMouseup: onControlMouseUp,
      }, [
        genPrependSlot(),
        genTextFieldInput(),
        genAppendSlot(),
        genStateIcon(),
        genClearInput(clearableCallback),
      ])
    }

    return {
      rootElement,
      classes,
      internalValue,
      formattedNumber,
      numberDecimal,
      numberPrecision,
      hasError,
      shouldValidate,
      reset,
      resetValidation,
      validate,
      focus,
      blur,
      genLabel,
      genControl,
      genInputMessages,
    }
  },

  render () {
    return h('div', {
      ref: 'rootElement',
      class: this.classes,
    }, [
      this.genLabel(),
      this.genInputMessages(),
      this.genControl(),
    ])
  },
})
