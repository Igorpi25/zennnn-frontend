import {
  h,
  ref,
  computed,
  watch,
  vShow,
  withDirectives,
  defineComponent,
  mergeProps,
} from 'vue'
import { deepEqual } from 'vue-supp'
import { ziStatusPoint } from '@zennnn/icons'
import { useInputProps, useInput } from '../../composables/useInput'
import {
  useInputValidationProps,
  useInputValidation,
} from '../../composables/useInputValidation'
import uid from '../../utils/uid'
import Icon from '../Icon'

import type { PropType } from 'vue'

export default defineComponent({
  name: 'Radio',

  props: {
    ...useInputProps(),
    ...useInputValidationProps(),
    modelValue: {
      type: [String, Number],
      default: '',
    },
    value: {
      type: [String, Number],
      default: '',
    },
    valueComparator: {
      type: Function,
      default: deepEqual,
    },
    controlClass: String,
    checkedIcon: String,
    onChange: Function as PropType<(val: any) => void>,
  },

  slots: ['label', 'default'],

  emits: ['update:modelValue', 'update:error', 'change'],

  setup(props, { slots, emit }) {
    const id: string = uid('radio-')
    const rootElement = ref<HTMLElement>()

    const { inputElement, internalValue, isFocused, inputData, genLabel } =
      useInput(props, {
        slots,
        id,
      })

    const { showDetails, isDisabled, isReadonly, genMessages } =
      useInputValidation(props, { emit, id, internalValue, isFocused })

    const isActive = computed(() => {
      const value = props.value
      const input = internalValue.value

      return value ? props.valueComparator(value, input) : Boolean(input)
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

    function onChange(e: Event) {
      if (isDisabled.value || isReadonly.value || isActive.value) return

      const target = e.target as HTMLInputElement

      const value = target.value

      internalValue.value = value
      emit('change', value)
    }

    function onIconClick() {
      if (isDisabled.value || isReadonly.value) return
      ;(inputElement.value as HTMLInputElement).click()
    }

    function genRadioLabel() {
      const children = slots.default?.()
      if (!children) return undefined
      return h(
        'label',
        {
          for: id,
          class: 'radio__label',
        },
        children
      )
    }

    function genRadioIcon() {
      return h(
        'div',
        {
          class: ['radio__icon', props.inputClass],
          onClick: onIconClick,
        },
        withDirectives(
          h(
            Icon,
            {
              size: 16,
            },
            {
              default: () => props.checkedIcon || ziStatusPoint,
            }
          ),
          [[vShow, isActive.value]]
        )
      )
    }

    function genRadioInput() {
      return h(
        'input',
        mergeProps(inputData.value, {
          id,
          class: 'peer sr-only',
          value: props.value,
          checked: isActive.value,
          type: 'radio',
          role: 'radio',
          readonly: isReadonly.value,
          disabled: isDisabled.value,
          'aria-checked': isActive.value,
          onChange: onChange,
        })
      )
    }

    function genControl() {
      return h(
        'div',
        {
          class: [
            'radio__control',
            {
              'radio__control--show-details': showDetails.value,
            },
            props.controlClass,
          ],
        },
        [genRadioInput(), genRadioIcon(), genRadioLabel()]
      )
    }

    return () => {
      return h(
        'div',
        {
          ref: rootElement,
          class: {
            radio: true,
            'radio--disabled': isDisabled.value,
            'radio--readonly': isReadonly.value,
          },
        },
        [genLabel(), genControl(), genMessages()]
      )
    }
  },
})
