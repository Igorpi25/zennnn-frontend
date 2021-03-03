import {
  h,
  ref,
  reactive,
  computed,
  watch,
  nextTick,
  onMounted,
  defineComponent,
} from 'vue'

import { useClientRect } from 'vue-supp'

import { useInputProps, useInput } from '../../composables/useInput'
import { useInputClearProps, useInputClear } from '../../composables/useInputClear'
import { useInputControlProps, useInputControl } from '../../composables/useInputControl'
import { useInputValidationProps, useInputValidation } from '../../composables/useInputValidation'
import { useInputLazyProps, useInputLazy } from '../../composables/useInputLazy'
import { useInputMessage } from '../../composables/useInputMessage'

import uid from '../../utils/uid'

import './TextArea.css'

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

  emits: ['update:modelValue', 'update:error', 'click:clear', 'focus', 'blur', 'change', 'keydown', 'mousedown', 'mouseup'],

  setup (props, { slots, emit }) {
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

    const {
      genClearInput,
    } = useInputClear(props, { inputElement, isDirty, emit, emitChange, setInternalValue })

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
      hasMessages,
      hasError,
      messagesToDisplay,
      showDetails,
      dimensions: clientRect,
    })

    const {
      hasDebounce,
      debounceInput,
      cancelDebounce,
      clearableCallback,
    } = useInputLazy(props, { isFocused, setInternalValue, emitChange })

    const classes = computed(() => {
      return {
        'text-area': true,
        'text-area--focused': isFocused.value,
        'text-area--disabled': isDisabled.value,
        'text-area--readonly': isReadonly.value,
        'text-area--has-error': (hasMessages.value && hasError.value) && showDetails.value,
      }
    })

    watch(() => props.modelValue, (val) => {
      setInternalValue(val)
    })

    watch(internalValue, () => {
      props.autoGrow && nextTick(calculateInputHeight)
    })

    watch(() => props.rowHeight, () => {
      props.autoGrow && nextTick(calculateInputHeight)
    })

    onMounted(() => {
      setTimeout(() => {
        props.autoGrow && calculateInputHeight()
      }, 0)
    })

    const onFocus = (e: Event) => {
      if (document.activeElement !== inputElement.value) {
        inputElement.value?.focus()
      }
      updateClientRect()
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

    const onKeyDown = (e: KeyboardEvent) => {
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
      // update dimensions
      updateClientRect()
    }

    const genTextAreaInput = () => {
      const data = {
        id,
        ref: inputElement,
        value: internalValue.value,
        class: {
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
        onKeyDown: onKeyDown,
      }
      return h('textarea', data)
    }

    const genControl = () => {
      return h('div', {
        ref: controlElement,
        class: {
          'text-area__control': true,
          'text-area__control--has-prepend': hasPrependSlot.value,
          'text-area__control--has-append': hasAppendSlot.value || hasState.value || props.clearable,
          [props.controlClass.trim()]: true,
        },
        onClick: onControlClick,
        onMousedown: onControlMouseDown,
        onMouseup: onControlMouseUp,
      }, [
        genPrependSlot(),
        genTextAreaInput(),
        genAppendSlot(),
        genStateIcon(),
        genClearInput(clearableCallback),
      ])
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
