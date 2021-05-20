import {
  h,
  ref,
  computed,
  watch,
  vShow,
  withDirectives,
  defineComponent,
} from 'vue'
import { deepEqual } from 'vue-supp'

import { ziStatusPoint } from '@zennnn/icons'

import { useInputProps, useInput } from '../../composables/useInput'
import { useInputValidationProps, useInputValidation } from '../../composables/useInputValidation'

import uid from '../../utils/uid'

import Icon from '../Icon'

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
  },

  emits: ['update:modelValue', 'update:error', 'change'],

  setup (props, { slots, emit }) {
    const id: string = uid('radio-')
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

    const onChange = (e: Event) => {
      if (isDisabled.value || isReadonly.value || isActive.value) return

      const target = e.target as HTMLInputElement

      const value = target.value

      internalValue.value = value
      emit('change', value)
    }

    const genRadioLabel = () => {
      const children = slots.default?.()
      if (!children) return undefined
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
          default: () => ziStatusPoint,
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
})
