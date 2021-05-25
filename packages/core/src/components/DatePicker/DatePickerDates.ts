import { h, computed, defineComponent, PropType } from 'vue'

import { useI18n } from 'vue-i18n'

// import startOfMonth from 'date-fns/startOfMonth'
// import endOfMonth from 'date-fns/endOfMonth'
// import eachDayOfInterval from 'date-fns/eachDayOfInterval'
// import subMonths from 'date-fns/subMonths'
// import addMonths from 'date-fns/addMonths'
// import startOfWeek from 'date-fns/startOfWeek'
// import endOfWeek from 'date-fns/endOfWeek'
// import isSameDay from 'date-fns/isSameDay'
// import setDay from 'date-fns/setDay'
// import isWithinInterval from 'date-fns/isWithinInterval'
// import isBefore from 'date-fns/isBefore'
// import isAfter from 'date-fns/isAfter'
// import isSameMonth from 'date-fns/isSameMonth'
// import endOfDay from 'date-fns/endOfDay'
// import startOfDay from 'date-fns/startOfDay'
// import isValid from 'date-fns/isValid'
// import isWeekend from 'date-fns/isWeekend'
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
  isWeekend,
} from 'date-fns'

import DatePickerHeader from './DatePickerHeader'

export default defineComponent({
  name: 'DatePickerDates',

  props: {
    selected: Date as PropType<Date>,
    modelValue: {
      type: Date as PropType<Date>,
      required: true,
    },
    firstDayOfWeek: {
      type: Number as PropType<1 | 2 | 3 | 4 | 5 | 6 | 0>,
      default: 0,
      validator: (i: unknown): boolean =>
        typeof i === 'number' && Number.isInteger(i) && i >= 0 && i <= 6,
    },
    min: Date as PropType<Date>,
    max: Date as PropType<Date>,
  },

  emits: {
    'update:modelValue': (date: Date) => isValid(date),
    select: (date: Date) => isValid(date),
    back: () => true,
  },

  setup(props, { emit }) {
    const { locale } = useI18n()

    const format = (date: Date | undefined, options: any) => {
      if (!date) return ''
      const intlFormatter = new Intl.DateTimeFormat(locale.value, options)
      return intlFormatter.format(date)
    }

    const weekendIndexes = computed(() => {
      return Array.from(Array(7))
        .map((_, i) => (props.firstDayOfWeek + i) % 7)
        .reduce((acc: any[], v: number, i: number) => {
          return v === 0 || v === 6 ? [...acc, i] : [...acc]
        }, [])
    })

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
      const dayFormat = (v: Date) => format(v, { weekday: 'narrow' })
      return Array.from(Array(7))
        .map((_, i) => (props.firstDayOfWeek + i) % 7)
        .map((v) =>
          setDay(new Date(), v, {
            weekStartsOn: props.firstDayOfWeek,
          })
        )
        .map(dayFormat)
    })

    const days = computed(() => {
      const now = new Date()
      const dayFormat = (v: any) => format(v, { day: 'numeric' })
      return eachDayOfInterval(displayedInterval.value).map((value, i) => ({
        value,
        text: dayFormat(value),
        isWeekend: isWeekend(value),
        current: isSameDay(value, now),
        selected: props.selected && isSameDay(props.selected, value),
        disabled:
          !isWithinInterval(value, currentMonth.value) ||
          !isEnabled(value, props.min, props.max),
        key: i,
      }))
    })

    const title = computed(() =>
      format(props.modelValue, { month: 'long', year: 'numeric' })
    )

    const prevDisabled = computed(
      () =>
        props.min &&
        (isSameMonth(props.min, props.modelValue) ||
          isBefore(props.modelValue, props.min))
    )

    const nextDisabled = computed(
      () =>
        props.max &&
        (isSameMonth(props.max, props.modelValue) ||
          isAfter(props.modelValue, props.max))
    )

    const isEnabled = (target: Date, min?: Date, max?: Date) => {
      if (!min && !max) return true
      if (min && isBefore(target, startOfDay(min))) return false
      if (max && isAfter(target, endOfDay(max))) return false
      return true
    }

    const prev = () => emit('update:modelValue', subMonths(props.modelValue, 1))

    const next = () => emit('update:modelValue', addMonths(props.modelValue, 1))

    const genHeader = () => {
      return h(
        DatePickerHeader,
        {
          clickable: true,
          prevDisabled: prevDisabled.value,
          nextDisabled: nextDisabled.value,
          onPrev: prev,
          onNext: next,
          'onTitle:click': () => emit('back'),
        },
        {
          default: () => title.value,
        }
      )
    }

    const genItemsHead = () => {
      return h(
        'div',
        {
          class:
            'grid grid-cols-7 gap-1 items-center justify-items-center pt-4 px-md',
        },
        weekDays.value.map((day, i) => {
          return h(
            'h5',
            {
              key: i,
              class: {
                'w-8 text-center': true,
                'text-gray-200 dark:text-gray-100':
                  weekendIndexes.value.includes(i),
              },
            },
            day
          )
        })
      )
    }

    const genItems = () => {
      const children = days.value.map((item) => {
        return h(
          'button',
          {
            key: item.key,
            disabled: item.disabled,
            class: {
              'w-8 h-8 rounded focus:outline-none': true,
              transition: !item.disabled,
              'text-gray-100 dark:text-gray-300 cursor-default': item.disabled,
              'hover:bg-light-gray-300 focus:bg-light-gray-300 dark:hover:bg-gray-600 dark:focus:bg-gray-600':
                !item.selected && !item.disabled,
              'bg-blue-400 text-white': item.selected,
              'ring-2 ring-inset ring-blue-500':
                !item.selected && !item.disabled && item.current,
              'text-gray-200 dark:text-gray-100':
                !item.selected && !item.disabled && item.isWeekend,
            },
            onClick: (e: MouseEvent) => {
              e.preventDefault()
              e.stopPropagation()
              emit('select', item.value)
            },
          },
          h('span', item.text)
        )
      })

      return h(
        'div',
        {
          class:
            'grid grid-cols-7 gap-1 items-center justify-items-center text-sm py-4 px-md',
        },
        children
      )
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

  render() {
    return h('div', {}, [
      this.genHeader(),
      this.genItemsHead(),
      this.genItems(),
    ])
  },
})
