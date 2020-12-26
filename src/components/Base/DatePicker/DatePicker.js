import {
  computed,
  h,
  ref,
  watchEffect,
} from 'vue'

import { useI18n } from 'vue-i18n'

import parse from 'date-fns/parse'
import isValid from 'date-fns/isValid'

import { convertToUnit } from '../../../utils/convertToUnit'

import Btn from '../Btn'
import Menu from '../Menu'
import DatePickerYears from './DatePickerYears'
import DatePickerMonths from './DatePickerMonths'
import DatePickerDates from './DatePickerDates'

export default {
  name: 'DatePicker',

  props: {
    placeholder: {
      type: String,
      default: '',
    },
    modelValue: {
      type: Date,
      required: false,
    },
    max: {
      type: Date,
      required: false,
    },
    min: {
      type: Date,
      required: false,
    },
    inputFormat: {
      type: String,
      required: false,
      default: 'yyyy-MM-dd',
    },
    disabled: Boolean,
    type: {
      type: String,
      default: 'date',
      validator: (type) => ['date', 'month'].includes(type),
    },
    width: {
      type: [String, Number],
      default: 276,
    },
    minHeight: {
      type: [String, Number],
      default: 302,
    },
  },

  emits: ['update:modelValue'],

  setup (props, { emit, slots }) {
    const activePicker = ref(props.type.toUpperCase())
    const internal = ref(new Date())
    const input = ref('')

    const { locale, d } = useI18n()

    const firstDayOfWeek = computed(() => {
      return (locale.value === 'fr' || locale.value === 'ru' || locale.value === 'uk')
        ? 1
        : 0
    })

    watchEffect(() => {
      const parsed = parse(input.value, props.inputFormat, new Date())
      if (isValid(parsed)) {
        internal.value = parsed
      }
    })

    // watchEffect(() => (input.value = props.modelValue && isValid(props.modelValue)
    //   ? lightFormat(props.modelValue, props.inputFormat)
    //   : ''))

    const selectYear = (date) => {
      internal.value = date
      activePicker.value = 'MONTH'
    }
    const selectMonth = (date) => {
      internal.value = date
      activePicker.value = 'DATE'
    }
    const selectDay = (date) => {
      emit('update:modelValue', date)
    }

    const genInput = () => {
      return h('input', {
        type: 'text',
        readonly: 'readonly',
        value: input.value,
        placeholder: props.placeholder,
        disabled: props.disabled,
        tabindex: props.disabled ? -1 : 0,
      })
    }

    const genActivator = () => {
      if (slots.activator) return slots.activator()
      return h(Btn, {
        outlined: true,
        small: true,
      }, isValid(internal.value) ? d(internal.value, 'short') : props.placeholder || 'Date')
    }

    const genYearPicker = () => {
      return h(DatePickerYears, {
        modelValue: internal.value,
        selected: props.modelValue,
        min: props.min,
        max: props.max,
        'onUpdate:modelValue': v => {
          internal.value = v
        },
        onSelect: selectYear,
      })
    }

    const genMonthPicker = () => {
      return h(DatePickerMonths, {
        modelValue: internal.value,
        selected: props.modelValue,
        min: props.min,
        max: props.max,
        'onUpdate:modelValue': v => {
          internal.value = v
        },
        onSelect: selectMonth,
        onBack: () => {
          activePicker.value = 'YEAR'
        },
      })
    }

    const genDayPicker = () => {
      return h(DatePickerDates, {
        modelValue: internal.value,
        selected: props.modelValue,
        firstDayOfWeek: firstDayOfWeek.value,
        min: props.min,
        max: props.max,
        'onUpdate:modelValue': v => {
          internal.value = v
        },
        onSelect: selectDay,
        onBack: () => {
          activePicker.value = 'MONTH'
        },
      })
    }

    const genPicker = () => {
      return activePicker.value === 'YEAR'
        ? genYearPicker()
        : activePicker.value === 'MONTH'
          ? genMonthPicker()
          : activePicker.value === 'DATE'
            ? genDayPicker()
            : undefined
    }

    return {
      input,
      internal,
      activePicker,
      genPicker,
      selectYear,
      selectMonth,
      selectDay,
      genInput,
      genYearPicker,
      genMonthPicker,
      genDayPicker,
      genActivator,
    }
  },

  render () {
    return h(Menu, {
      bottom: true,
    }, {
      activator: () => this.genActivator(),
      default: () => {
        return h('div', {
          class: 'bg-gray-400 rounded-md p-2 py-3',
          style: {
            width: convertToUnit(this.width),
            minHeight: convertToUnit(this.minHeight),
          },
        }, this.genPicker())
      },
    })
  },
}