import {
  h,
  ref,
  computed,
  watch,
  nextTick,
  vShow,
  withDirectives,
  defineComponent,
} from 'vue'
import { deepEqual } from 'vue-supp'

import { ziCheckboxMarked, ziMinus } from '@zennnn/icons'

import { useInputProps, useInput } from '../../composables/useInput'
import { useInputValidationProps, useInputValidation } from '../../composables/useInputValidation'

import uid from '../../utils/uid'

import Icon from '../Icon'

export default defineComponent({
  name: 'Checkbox',

  props: {
    ...useInputProps(),
    ...useInputValidationProps(),
    modelValue: {
      type: [Boolean, String, Number, Array],
      default: false,
    },
    value: {
      type: [Boolean, String, Number],
      default: false,
    },
    indeterminate: {
      type: Boolean,
      defalt: false,
    },
    multiple: {
      type: Boolean,
      default: null,
    },
    valueComparator: {
      type: Function,
      default: deepEqual,
    },
    trueValue: null,
    falseValue: null,
  },

  emits: ['update:modelValue', 'update:indeterminate', 'update:error', 'change'],

  setup (props, { slots, emit }) {
    const id: string = uid('checkbox-')
    const rootElement = ref<HTMLElement>()

    const {
      internalValue,
      isFocused,
      genInput,
      genLabel,
    } = useInput(props, { slots, id })

    const {
      showDetails,
      isDisabled,
      isReadonly,
      isInteractive,
      genMessages,
    } = useInputValidation(props, { emit, id, internalValue, isFocused })

    const inputIndeterminate = ref<boolean>(props.indeterminate)

    const isActive = computed(() => {
      const value = props.value
      const input = internalValue.value

      if (isMultiple.value) {
        if (!Array.isArray(input)) return false

        return input.some(item => props.valueComparator(item, value))
      }

      if (props.trueValue === undefined || props.falseValue === undefined) {
        return value
          ? props.valueComparator(value, input)
          : Boolean(input)
      }

      return props.valueComparator(input, props.trueValue)
    })

    const isMultiple = computed(() => props.multiple === true ||
      (props.multiple === null && Array.isArray(internalValue.value)))

    watch(() => props.modelValue, (val) => {
      internalValue.value = val
    })

    watch(() => props.indeterminate, (val) => {
      nextTick(() => {
        inputIndeterminate.value = val
      })
    })

    watch(inputIndeterminate, (val) => {
      emit('update:indeterminate', val)
    })

    watch(isActive, () => {
      if (!props.indeterminate) return
      inputIndeterminate.value = false
    })

    watch(internalValue, (val) => {
      emit('update:modelValue', val)
    })

    const onChange = () => {
      if (!isInteractive.value) return

      const value = props.value
      let input = internalValue.value

      if (isMultiple.value) {
        if (!Array.isArray(input)) {
          input = []
        }

        const length = input.length

        input = input.filter((item: any) => !props.valueComparator(item, value))

        if (input.length === length) {
          input.push(value)
        }
      } else if (props.trueValue !== undefined && props.falseValue !== undefined) {
        input = props.valueComparator(input, props.trueValue) ? props.falseValue : props.trueValue
      } else if (value) {
        input = props.valueComparator(input, value) ? null : value
      } else {
        input = !input
      }

      internalValue.value = input
      emit('change', internalValue.value)
    }

    const genCheckboxLabel = () => {
      const children = slots.default?.()
      if (!children) return undefined
      return h('label', {
        for: id,
        class: 'checkbox__label',
      }, children)
    }

    const genCheckboxIcon = () => {
      return h('div', {
        class: 'checkbox__control__icon',
      }, withDirectives(
        h(Icon, {
          size: 20,
        }, {
          default: () => inputIndeterminate.value ? ziMinus : ziCheckboxMarked,
        }),
        [
          [vShow, isActive.value || inputIndeterminate.value],
        ],
      ))
    }

    const genCheckboxInput = () => {
      const data = {
        id,
        class: 'checkbox__input',
        value: props.value,
        checked: isActive.value,
        type: 'checkbox',
        role: 'checkbox',
        readonly: isReadonly.value,
        disabled: isDisabled.value,
        'aria-checked': inputIndeterminate.value
          ? 'mixed'
          : isActive.value,
        onChange: onChange,
      }
      return genInput(data)
    }

    const genCheckbox = () => {
      return h('div', {
        class: 'checkbox__control__input',
      }, [
        genCheckboxInput(),
        genCheckboxIcon(),
      ])
    }

    const genControl = () => {
      return h('div', {
        class: {
          checkbox__control: true,
        },
      }, [
        genCheckbox(),
        genCheckboxLabel(),
      ])
    }

    return () => {
      return h('div', {
        ref: rootElement,
        class: {
          checkbox: true,
          'checkbox--active': isActive.value,
          'checkbox--focused': isFocused.value,
          'checkbox--disabled': isDisabled.value,
          'checkbox--readonly': isReadonly.value,
          'checkbox--indeterminate': inputIndeterminate.value,
          'checkbox--show-details': showDetails.value,
        },
      }, [
        genLabel(),
        genControl(),
        genMessages(),
      ])
    }
  },
})
