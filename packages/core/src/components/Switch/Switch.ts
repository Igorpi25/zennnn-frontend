import { h, ref, computed, watch, defineComponent, mergeProps } from 'vue'
import { deepEqual } from 'vue-supp'
import { useInputProps, useInput } from '../../composables/useInput'
import {
  useInputValidationProps,
  useInputValidation,
} from '../../composables/useInputValidation'
import uid from '../../utils/uid'

import type { PropType } from 'vue'

export default defineComponent({
  name: 'Switch',

  props: {
    ...useInputProps(),
    ...useInputValidationProps(),
    modelValue: {
      type: [Boolean, String, Number],
      default: false,
    },
    value: {
      type: [Boolean, String, Number],
      default: false,
    },
    valueComparator: {
      type: Function,
      default: deepEqual,
    },
    trueValue: null,
    falseValue: null,
    small: Boolean,
    controlClass: String,
    onChange: Function as PropType<(val: any) => void>,
  },

  slots: ['label', 'default'],

  emits: ['update:modelValue', 'update:error', 'change'],

  setup(props, { slots, emit }) {
    const id: string = uid('switch-')
    const rootElement = ref<HTMLElement>()

    const { inputElement, internalValue, isFocused, inputData, genLabel } =
      useInput(props, {
        slots,
        id,
      })

    const { showDetails, isDisabled, isReadonly, isInteractive, genMessages } =
      useInputValidation(props, { emit, id, internalValue, isFocused })

    const isActive = computed(() => {
      const value = props.value
      const input = internalValue.value

      if (props.trueValue === undefined || props.falseValue === undefined) {
        return value ? props.valueComparator(value, input) : Boolean(input)
      }

      return props.valueComparator(input, props.trueValue)
    })

    watch(
      () => props.modelValue,
      (val) => {
        internalValue.value = val
      }
    )

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

      if (props.trueValue !== undefined && props.falseValue !== undefined) {
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

    function onKeydown(e: KeyboardEvent) {
      if (
        ((e.key === 'ArrowLeft' || e.key === 'Left') && isActive.value) ||
        ((e.key === 'ArrowRight' || e.key === 'Right') && !isActive.value)
      )
        onChange()
    }

    function genSwitchLabel() {
      const children = slots.default?.()
      if (!children) return undefined
      return h(
        'label',
        {
          for: id,
          class: 'switch__label',
        },
        children
      )
    }

    function genSwitchInput() {
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
          'aria-checked': isActive.value,
          onChange: onChange,
          onKeydown: onKeydown,
        })
      )
    }

    function genSwitchIcon() {
      return h('div', {
        class: [
          'switch__icon',
          {
            'switch__icon--small': props.small,
          },
          props.inputClass,
        ],
        onClick: onIconClick,
      })
    }

    function genControl() {
      return h(
        'div',
        {
          class: [
            'switch__control',
            {
              'switch__control--show-details': showDetails.value,
            },
            props.controlClass,
          ],
        },
        [genSwitchInput(), genSwitchIcon(), genSwitchLabel()]
      )
    }

    return () => {
      return h(
        'div',
        {
          ref: rootElement,
          class: {
            switch: true,
            'switch--disabled': isDisabled.value,
            'switch--readonly': isReadonly.value,
          },
        },
        [genLabel(), genControl(), genMessages()]
      )
    }
  },
})
