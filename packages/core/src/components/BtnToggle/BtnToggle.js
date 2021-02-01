import { h, ref, watch } from 'vue'
import { convertToUnit } from 'vue-supp'

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
    minWidth: {
      type: [String, Number],
      default: 132,
    },
  },

  emits: ['update:modelValue'],

  setup (props, { emit }) {
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
          minWidth: convertToUnit(props.minWidth),
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
