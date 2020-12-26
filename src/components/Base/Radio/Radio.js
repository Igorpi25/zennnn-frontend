import {
  h,
  ref,
  computed,
  watch,
  vShow,
  withDirectives,
} from 'vue'

import { ziCircleFill } from '../../../assets/icons'

import { useInputProps, useInput } from '../../../composables/useInput'
import { useInputValidationProps, useInputValidation } from '../../../composables/useInputValidation'

import uid from '../../../utils/uid'
import { deepEqual } from '../../../utils/deepEqual'

import Icon from '../Icon'

import './Radio.css'

export default {
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
  },

  emits: ['update:modelValue', 'update:error', 'change'],

  setup (props, { slots, emit }) {
    const id = uid('radio-')
    const rootElement = ref(null)

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
      genMessages,
    } = useInputValidation(props, { emit, id, internalValue, isFocused })

    const isActive = computed(() => {
      const value = props.value
      const input = internalValue.value

      return value
        ? props.valueComparator(value, input)
        : Boolean(input)
    })

    watch(() => props.modelValue, (val) => {
      internalValue.value = val
    })

    watch(internalValue, (val) => {
      emit('update:modelValue', val)
    })

    const onChange = (e) => {
      if (isDisabled.value || isReadonly.value || isActive.value) return

      const value = e.target.value

      internalValue.value = value
      emit('change', value)
    }

    const genRadioLabel = () => {
      const children = slots.default ? slots.default() : undefined
      if (!children) return null
      return h('label', {
        for: id,
        class: 'radio__label',
      }, children)
    }

    const genRadioIcon = () => {
      return h('div', {
        class: 'radio__control__icon',
      }, withDirectives(
        h(Icon, {
          size: 16,
        }, {
          default: () => ziCircleFill,
        }),
        [
          [vShow, isActive.value],
        ],
      ))
    }

    const genRadioInput = () => {
      const data = {
        id,
        class: 'radio__input',
        value: props.value,
        checked: isActive.value,
        type: 'radio',
        role: 'radio',
        readonly: isReadonly.value,
        disabled: isDisabled.value,
        'aria-checked': isActive.value,
        onChange: onChange,
      }
      return genInput(data)
    }

    const genRadio = () => {
      return h('div', {
        class: 'radio__control__input',
      }, [
        genRadioInput(),
        genRadioIcon(),
      ])
    }

    const genControl = () => {
      return h('div', {
        class: {
          radio__control: true,
        },
      }, [
        genRadio(),
        genRadioLabel(),
      ])
    }

    return () => {
      return h('div', {
        ref: rootElement,
        class: {
          radio: true,
          'radio--active': isActive.value,
          'radio--focused': isFocused.value,
          'radio--disabled': isDisabled.value,
          'radio--readonly': isReadonly.value,
          'radio--show-details': showDetails.value,
        },
      }, [
        genLabel(),
        genControl(),
        genMessages(),
      ])
    }
  },
}
