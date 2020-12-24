import {
  h,
  computed,
} from 'vue'

import { useI18n } from 'vue-i18n'

import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  subMonths,
  addMonths,
  startOfWeek,
  endOfWeek,
  isSameDay,
  setDay,
  isWithinInterval,
  isBefore,
  isAfter,
  isSameMonth,
  endOfDay,
  startOfDay,
  isValid,
} from 'date-fns'

import DatePickerHeader from './DatePickerHeader'

export default {
  name: 'DatePickerDates',

  props: {
    selected: Date,
    modelValue: {
      type: Date,
      required: true,
    },
    firstDayOfWeek: {
      type: Number,
      default: 0,
      validator: (i) =>
        typeof i === 'number' && Number.isInteger(i) && i >= 0 && i <= 6,
    },
    min: Date,
    max: Date,
  },

  emits: {
    'update:modelValue': (date) => isValid(date),
    select: (date) => isValid(date),
    back: () => true,
  },

  setup (props, { emit }) {
    const { locale } = useI18n()

    const format = (date, options) => {
      if (!date) return ''
      const intlFormatter = new Intl.DateTimeFormat(locale.value, options)
      return intlFormatter.format(date)
    }

    const monthStart = computed(() => startOfMonth(props.modelValue))

    const monthEnd = computed(() => endOfMonth(props.modelValue))

    const currentMonth = computed(() => ({
      start: monthStart.value,
      end: monthEnd.value,
    }))

    const displayedInterval = computed(() => ({
      start: startOfWeek(monthStart.value, {
        weekStartsOn: props.firstDayOfWeek,
      }),
      end: endOfWeek(monthEnd.value, {
        weekStartsOn: props.firstDayOfWeek,
      }),
    }))

    const weekDays = computed(() => {
      const dayFormat = (v) => format(v, { weekday: 'narrow' })
      return Array.from(Array(7))
        .map((_, i) => (props.firstDayOfWeek + i) % 7)
        .map((v) =>
          setDay(new Date(), v, {
            weekStartsOn: props.firstDayOfWeek,
          }))
        .map(dayFormat)
    })

    const days = computed(() => {
      const now = new Date()
      const dayFormat = (v) => format(v, { day: 'numeric' })
      return eachDayOfInterval(displayedInterval.value).map((value, i) => ({
        value,
        text: dayFormat(value),
        current: isSameDay(value, now),
        selected: props.selected && isSameDay(props.selected, value),
        disabled: !isWithinInterval(value, currentMonth.value) ||
          !isEnabled(value, props.min, props.max),
        key: i,
      }))
    })

    const title = computed(() => format(props.modelValue, { month: 'long', year: 'numeric' }))

    const prevDisabled = computed(() => props.min &&
      (isSameMonth(props.min, props.modelValue) ||
        isBefore(props.modelValue, props.min)))

    const nextDisabled = computed(() => props.max &&
      (isSameMonth(props.max, props.modelValue) ||
        isAfter(props.modelValue, props.max)))

    const isEnabled = (
      target,
      min,
      max,
    ) => {
      if (!min && !max) return true
      if (min && isBefore(target, startOfDay(min))) return false
      if (max && isAfter(target, endOfDay(max))) return false
      return true
    }

    const prev = () => emit('update:modelValue', subMonths(props.modelValue, 1))

    const next = () => emit('update:modelValue', addMonths(props.modelValue, 1))

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

    const genItemsHead = () => {
      return h('div', {
        class: 'grid grid-cols-7 gap-2 items-center justify-items-center text-sm font-semibold pt-3',
      }, weekDays.value.map((day, i) => {
        return h('span', {
          key: i,
        }, day)
      }))
    }

    const genItems = () => {
      const children = days.value.map(item => {
        return h('button', {
          key: item.key,
          disabled: item.disabled,
          class: {
            'w-8 h-8 rounded-md focus:outline-none': true,
            transition: !item.disabled,
            'text-gray-200 cursor-default': item.disabled,
            'hover:bg-gray-300 focus:bg-gray-300': !item.selected && !item.disabled,
            'bg-blue-500 text-white': item.selected,
            'ring-1 ring-blue-500 ring-opacity-50': !item.selected && !item.disabled && item.current,
          },
          onClick: (e) => {
            e.preventDefault()
            e.stopPropagation()
            emit('select', item.value)
          },
        }, h('span', item.text))
      })

      return h('div', {
        class: 'grid grid-cols-7 gap-2 items-center justify-items-center text-sm pt-4',
      }, children)
    }

    return {
      weekDays,
      days,
      title,
      genHeader,
      genItems,
      genItemsHead,
    }
  },

  render () {
    return h('div', {
    }, [
      this.genHeader(),
      this.genItemsHead(),
      this.genItems(),
    ])
  },
}
