import {
  h,
  ref,
  computed,
  watch,
  nextTick,
  vShow,
  withDirectives,
  defineComponent,
  mergeProps,
} from 'vue'
import { deepEqual } from 'vue-supp'
import { ziCheckboxMarked, ziMinus } from '@zennnn/icons'
import { useInputProps, useInput } from '../../composables/useInput'
import {
  useInputValidationProps,
  useInputValidation,
} from '../../composables/useInputValidation'
import uid from '../../utils/uid'
import Icon from '../Icon'

import type { PropType } from 'vue'

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
    id: String,
    controlClass: String,
    checkedIcon: String,
    indeterminateIcon: String,
    onChange: Function as PropType<(val: any) => void>,
  },

  slots: ['label', 'default'],

  emits: [
    'update:modelValue',
    'update:indeterminate',
    'update:error',
    'change',
  ],

  setup(props, { slots, emit }) {
    const id: string = props.id || uid('checkbox-')

    const { inputElement, internalValue, isFocused, inputData, genLabel } =
      useInput(props, {
        slots,
        id,
      })

    const { showDetails, isDisabled, isReadonly, isInteractive, genMessages } =
      useInputValidation(props, { emit, id, internalValue, isFocused })

    const inputIndeterminate = ref<boolean>(props.indeterminate)

    const isActive = computed(() => {
      const value = props.value
      const input = internalValue.value

      if (isMultiple.value) {
        if (!Array.isArray(input)) return false

        return input.some((item) => props.valueComparator(item, value))
      }

      if (props.trueValue === undefined || props.falseValue === undefined) {
        return value ? props.valueComparator(value, input) : Boolean(input)
      }

      return props.valueComparator(input, props.trueValue)
    })

    const isMultiple = computed(
      () =>
        props.multiple === true ||
        (props.multiple === null && Array.isArray(internalValue.value))
    )

    const icon = computed(() => {
      const checkedIcon = props.checkedIcon || ziCheckboxMarked
      const indeterminateIcon = props.indeterminateIcon || ziMinus
      return inputIndeterminate.value ? indeterminateIcon : checkedIcon
    })

    watch(
      () => props.modelValue,
      (val) => {
        internalValue.value = val
      }
    )

    watch(
      () => props.indeterminate,
      (val) => {
        nextTick(() => {
          inputIndeterminate.value = val
        })
      }
    )

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

    function onIconClick() {
      if (isDisabled.value || isReadonly.value) return
      ;(inputElement.value as HTMLInputElement).click()
    }

    function onChange() {
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
      } else if (
        props.trueValue !== undefined &&
        props.falseValue !== undefined
      ) {
        input = props.valueComparator(input, props.trueValue)
          ? props.falseValue
          : props.trueValue
      } else if (value) {
        input = props.valueComparator(input, value) ? null : value
      } else {
        input = !input
      }

      internalValue.value = input
      emit('change', internalValue.value)
    }

    function genCheckboxLabel() {
      const children = slots.default?.()
      if (!children) return undefined
      return h(
        'label',
        {
          for: id,
          class: 'checkbox__label',
        },
        children
      )
    }

    function genCheckboxIcon() {
      return h(
        'div',
        {
          class: ['checkbox__icon', props.inputClass],
          onClick: onIconClick,
        },
        withDirectives(
          h(
            Icon,
            {
              size: 20,
            },
            {
              default: () => icon.value,
            }
          ),
          [[vShow, isActive.value || inputIndeterminate.value]]
        )
      )
    }

    function genCheckboxInput() {
      return h(
        'input',
        mergeProps(inputData.value, {
          id,
          class: 'peer sr-only',
          value: props.value,
          checked: isActive.value,
          type: 'checkbox',
          role: 'checkbox',
          readonly: isReadonly.value,
          disabled: isDisabled.value,
          indeterminate: inputIndeterminate.value,
          'aria-checked': inputIndeterminate.value ? 'mixed' : isActive.value,
          onChange: onChange,
        })
      )
    }

    function genControl() {
      return h(
        'div',
        {
          class: [
            'checkbox__control',
            {
              'checkbox__control--show-details': showDetails.value,
            },
            props.controlClass,
          ],
        },
        [genCheckboxInput(), genCheckboxIcon(), genCheckboxLabel()]
      )
    }

    return () => {
      return h(
        'div',
        {
          class: {
            checkbox: true,
            'checkbox--disabled': isDisabled.value,
            'checkbox--readonly': isReadonly.value,
          },
        },
        [genLabel(), genControl(), genMessages()]
      )
    }
  },
})
