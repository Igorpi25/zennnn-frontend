import {
  h,
  ref,
  computed,
  watch,
  nextTick,
  onMounted,
  defineComponent,
} from 'vue'

import { useInputProps, useInput } from '../../composables/useInput'
import {
  useInputClearProps,
  useInputClear,
} from '../../composables/useInputClear'
import {
  useInputControlProps,
  useInputControl,
} from '../../composables/useInputControl'
import {
  useInputValidationProps,
  useInputValidation,
} from '../../composables/useInputValidation'
import { useInputLazyProps, useInputLazy } from '../../composables/useInputLazy'
import { useInputMessage } from '../../composables/useInputMessage'

import uid from '../../utils/uid'

export default defineComponent({
  name: 'TextArea',

  props: {
    ...useInputProps(),
    ...useInputClearProps(),
    ...useInputValidationProps(),
    ...useInputControlProps(),
    ...useInputLazyProps(),
    modelValue: {
      type: String,
      default: null,
    },
    autoGrow: {
      type: Boolean,
      default: true,
    },
    noResize: {
      type: Boolean,
      default: true,
    },
    rows: {
      type: [String, Number],
      default: 2,
    },
    rowHeight: {
      type: [Number, String],
      default: 24,
      validator: (v: number | string) => !isNaN(parseFloat(v)),
    },
    singleLine: Boolean,
    minlength: String,
    maxlength: String,
    placeholder: String,
  },

  emits: [
    'update:modelValue',
    'update:error',
    'click:clear',
    'focus',
    'blur',
    'change',
    'keydown',
    'mousedown',
    'mouseup',
  ],

  setup(props, { slots, emit }) {
    const id: string = uid('text-area-')
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
      setInternalValue,
    } = useInput(props, { slots, emit, id })

    const { genClearInput } = useInputClear(props, {
      inputElement,
      isDirty,
      emit,
      emitChange,
      setInternalValue,
    })

    const {
      showDetails,
      isDisabled,
      isReadonly,
      hasState,
      hasError,
      hasMessages,
      messagesToDisplay,
      genStateIcon,
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
    } = useInputControl(props, {
      emit,
      slots,
      inputElement,
      isFocused,
      isDisabled,
    })

    const { genInputMessages } = useInputMessage(props, {
      inputElement,
      isFocused,
      hasMessages,
      hasError,
      messagesToDisplay,
      showDetails,
    })

    const { hasDebounce, debounceInput, cancelDebounce, clearableCallback } =
      useInputLazy(props, { isFocused, setInternalValue, emitChange })

    const classes = computed(() => {
      return {
        input: true,
        'input--focused': isFocused.value,
        'input--disabled': isDisabled.value,
        'input--has-error':
          hasMessages.value && hasError.value && showDetails.value,
        'text-area': true,
      }
    })

    watch(
      () => props.modelValue,
      (val) => {
        setInternalValue(val)
      }
    )

    watch(internalValue, () => {
      props.autoGrow && nextTick(calculateInputHeight)
    })

    watch(
      () => props.rowHeight,
      () => {
        props.autoGrow && nextTick(calculateInputHeight)
      }
    )

    onMounted(() => {
      setTimeout(() => {
        props.autoGrow && calculateInputHeight()
      }, 0)
    })

    const onFocus = (e: Event) => {
      if (document.activeElement !== inputElement.value) {
        inputElement.value?.focus()
      }
      if (!isFocused.value) {
        isFocused.value = true

        e && emit('focus', e)
      }
    }

    const onBlur = (e: Event) => {
      isFocused.value = false

      // immediate call changes
      if (!props.lazy) {
        // cancel debounced
        cancelDebounce()
        emitChange()
      }

      e && nextTick(() => emit('blur', e))
    }

    const onInput = (e: Event) => {
      const target = e.target as HTMLInputElement
      const value = target.value || ''

      badInput.value = target.validity && target.validity.badInput

      internalValue.value = value

      props.autoGrow && calculateInputHeight()

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

    const calculateInputHeight = () => {
      if (!inputElement.value) return

      inputElement.value.style.height = '0'
      const height = inputElement.value.scrollHeight
      const minHeight = parseInt(props.rows, 10) * parseFloat(props.rowHeight)
      // This has to be done ASAP, waiting for Vue
      // to update the DOM causes ugly layout jumping
      inputElement.value.style.height = Math.max(minHeight, height) + 'px'
    }

    const genTextAreaInput = () => {
      const data = {
        id,
        ref: inputElement,
        value: internalValue.value,
        class: {
          input__input: true,
          'text-area__input': true,
          'resize-none': props.noResize || props.autoGrow,
          [props.inputClass.trim()]: true,
        },
        name: props.name,
        required: props.required,
        placeholder: props.placeholder,
        autofocus: props.autofocus,
        minlength: props.minlength,
        maxlength: props.maxlength,
        readonly: isReadonly.value,
        disabled: isDisabled.value,
        onFocus: onFocus,
        onBlur: onBlur,
        onInput: onInput,
        onChange: onChange,
        onKeydown: onKeydown,
      }
      return h('textarea', data)
    }

    const genControl = () => {
      return h(
        'div',
        {
          ref: controlElement,
          class: {
            input__control: true,
            'input__control--has-prepend': hasPrependSlot.value,
            'input__control--has-append':
              hasAppendSlot.value || hasState.value || props.clearable,
            'text-area__control': true,
            [props.controlClass.trim()]: true,
          },
          onClick: onControlClick,
          onMousedown: onControlMouseDown,
          onMouseup: onControlMouseUp,
        },
        [
          genPrependSlot(),
          genTextAreaInput(),
          genAppendSlot(),
          genStateIcon(),
          genClearInput(clearableCallback),
        ]
      )
    }

    return {
      rootElement,
      classes,
      internalValue,
      focus,
      blur,
      genLabel,
      genControl,
      genInputMessages,
    }
  },

  render() {
    return h(
      'div',
      {
        ref: 'rootElement',
        class: this.classes,
      },
      [this.genLabel(), this.genInputMessages(), this.genControl()]
    )
  },
})
