import {
  h,
  computed,
  defineComponent,
  PropType,
} from 'vue'

import { useI18n } from 'vue-i18n'

import startOfYear from 'date-fns/startOfYear'
import endOfYear from 'date-fns/endOfYear'
import eachMonthOfInterval from 'date-fns/eachMonthOfInterval'
import getYear from 'date-fns/getYear'
import subYears from 'date-fns/subYears'
import addYears from 'date-fns/addYears'
import isSameMonth from 'date-fns/isSameMonth'
import isBefore from 'date-fns/isBefore'
import isAfter from 'date-fns/isAfter'
import isSameYear from 'date-fns/isSameYear'
import startOfMonth from 'date-fns/startOfMonth'
import endOfMonth from 'date-fns/endOfMonth'
import isValid from 'date-fns/isValid'

import DatePickerHeader from './DatePickerHeader'

export default defineComponent({
  name: 'DatePickerMonths',

  props: {
    selected: Date as PropType<Date>,
    modelValue: {
      type: Date as PropType<Date>,
      required: true,
    },
    min: Date as PropType<Date>,
    max: Date as PropType<Date>,
  },

  emits: {
    'update:modelValue': (date: Date) => isValid(date),
    select: (date: Date) => isValid(date),
    back: () => true,
  },

  setup (props, { emit }) {
    const { locale } = useI18n()
    const now = new Date()

    const from = computed(() => startOfYear(props.modelValue))

    const to = computed(() => endOfYear(props.modelValue))

    const format = (date: Date | undefined, options: any) => {
      if (!date) return ''
      const intlFormatter = new Intl.DateTimeFormat(locale.value, options)
      return intlFormatter.format(date)
    }

    const months = computed(() => eachMonthOfInterval({
      start: from.value,
      end: to.value,
    }).map((value, i) => ({
      value,
      text: format(value, { month: 'short' }),
      key: i,
      current: isSameMonth(value, now),
      selected: props.selected && isSameMonth(props.selected, value),
      disabled: !isEnabled(value, props.min, props.max),
    })))

    const title = computed(() => getYear(from.value))

    const prevDisabled = computed(() => props.min &&
      (isSameYear(props.min, props.modelValue) ||
        isBefore(props.modelValue, props.min)))

    const nextDisabled = computed(() => props.max &&
      (isSameYear(props.max, props.modelValue) ||
        isAfter(props.modelValue, props.max)))

    const isEnabled = (
      target: Date,
      min?: Date,
      max?: Date,
    ) => {
      if (!min && !max) return true
      if (min && isBefore(target, startOfMonth(min))) return false
      if (max && isAfter(target, endOfMonth(max))) return false
      return true
    }

    const prev = () => emit('update:modelValue', subYears(props.modelValue, 1))

    const next = () => emit('update:modelValue', addYears(props.modelValue, 1))

    const genHeader = () => {
      return h(DatePickerHeader, {
        clickable: true,
        prevDisabled: prevDisabled.value,
        nextDisabled: nextDisabled.value,
        onPrev: prev,
        onNext: next,
        'onTitle:click': () => emit('back'),
      }, {
        default: () => title.value,
      })
    }

    const genItems = () => {
      const children = months.value.map(item => {
        return h('button', {
          key: item.key,
          disabled: item.disabled,
          class: {
            'h-8 rounded focus:outline-none px-4': true,
            transition: !item.disabled,
            'text-gray-100 dark:text-gray-300 cursor-default': item.disabled,
            'hover:bg-light-gray-300 focus:bg-light-gray-300 dark:hover:bg-gray-600 dark:focus:bg-gray-600': !item.selected && !item.disabled,
            'bg-blue-400 text-white': item.selected,
            'ring-2 ring-inset ring-blue-500': !item.selected && !item.disabled && item.current,
          },
          onClick: (e: MouseEvent) => {
            e.preventDefault()
            e.stopPropagation()
            emit('select', item.value)
          },
        }, h('span', item.text))
      })

      return h('div', {
        class: 'grid grid-cols-3 gap-6 items-center justify-items-center py-4 px-md',
      }, children)
    }

    return {
      months,
      title,
      prevDisabled,
      nextDisabled,
      genHeader,
      genItems,
    }
  },

  render () {
    return h('div', {
    }, [
      this.genHeader(),
      this.genItems(),
    ])
  },
})
