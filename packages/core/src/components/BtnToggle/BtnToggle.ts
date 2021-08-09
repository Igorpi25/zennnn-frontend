import { h, ref, watch, defineComponent } from 'vue'
import { convertToUnit } from 'vue-supp'

import type { PropType } from 'vue'

interface BtnToggleItem {
  value: string | number
  text: string
  disabled?: boolean
}

export default defineComponent({
  name: 'BtnToggle',

  props: {
    modelValue: [String, Number],
    items: {
      type: Array as PropType<BtnToggleItem[]>,
      default: () => [],
    },
    disabled: Boolean,
    minWidth: {
      type: [String, Number],
      default: 132,
    },
  },

  emits: ['update:modelValue'],

  setup(props, { emit }) {
    const internalValue = ref(props.modelValue)

    watch(internalValue, (val) => {
      emit('update:modelValue', val)
    })

    function genButton({ value, text, disabled }: BtnToggleItem) {
      return h(
        'button',
        {
          class: {
            'btn-toggle__item': true,
            'btn-toggle__item--active': internalValue.value === value,
          },
          style: {
            minWidth: convertToUnit(props.minWidth),
          },
          disabled: props.disabled || disabled,
          onClick() {
            internalValue.value = value
          },
        },
        text
      )
    }

    function genContent() {
      return props.items.map(genButton)
    }

    return () => {
      return h(
        'div',
        {
          class: {
            'btn-toggle': true,
            'btn-toggle--disabled': props.disabled,
          },
        },
        genContent()
      )
    }
  },
})
