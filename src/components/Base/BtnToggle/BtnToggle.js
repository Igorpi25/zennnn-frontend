import { h, ref, watch } from 'vue'

import { convertToUnit } from '../../../utils/convertToUnit'

import './BtnToggle.css'

export default {
  name: 'BtnToggle',

  props: {
    modelValue: [String, Number],
    items: {
      type: Array,
      default: () => ([]),
    },
    disabled: Boolean,
    minWidth: [String, Number],
  },

  emits: ['update:modelValue'],

  setup (props, { emit }) {
    const MIN_WIDTH = 130

    const internalValue = ref(props.modelValue)

    watch(internalValue, (val) => {
      emit('update:modelValue', val)
    })

    const genButton = ({ value, text, disabled }) => {
      return h('button', {
        class: {
          'btn-toggle__item': true,
          'btn-toggle__item--active': internalValue.value === value,
        },
        style: {
          minWidth: convertToUnit(props.minWidth || MIN_WIDTH),
        },
        disabled: props.disabled || disabled,
        onClick () {
          internalValue.value = value
        },
      }, text)
    }

    const genContent = () => {
      return props.items.map(genButton)
    }

    return () => {
      return h('div', {
        class: {
          'btn-toggle': true,
          'btn-toggle--disabled': props.disabled,
        },
      }, genContent())
    }
  },
}
