import {
  h,
  computed,
} from 'vue'

import startOfDecade from 'date-fns/startOfDecade'
import eachYearOfInterval from 'date-fns/eachYearOfInterval'
import getYear from 'date-fns/getYear'
import subYears from 'date-fns/subYears'
import addYears from 'date-fns/addYears'
import isAfter from 'date-fns/isAfter'
import isBefore from 'date-fns/isBefore'
import isSameYear from 'date-fns/isSameYear'
import getDecade from 'date-fns/getDecade'
import isValid from 'date-fns/isValid'

import DatePickerHeader from './DatePickerHeader'

export default {
  name: 'DatePickerYears',

  props: {
    selected: Date,
    modelValue: {
      type: Date,
      required: true,
    },
    min: Date,
    max: Date,
  },

  emits: {
    'update:modelValue': (date) => isValid(date),
    select: (date) => isValid(date),
  },

  setup (props, { emit }) {
    const now = new Date()
    // TODO: change positions calc
    const startOffset = computed(() => {
      const now = new Date()
      const sub = getYear(now) - getYear(startOfDecade(now))
      return sub === 0 ? 1 : sub
    })

    const endOffset = computed(() => {
      return 11 - startOffset.value
    })

    const from = computed(() => subYears(props.modelValue, startOffset.value))

    const to = computed(() => addYears(props.modelValue, endOffset.value))

    const years = computed(() => eachYearOfInterval({
      start: from.value,
      end: to.value,
    }).map((value) => ({
      value,
      key: String(getYear(value)),
      text: getYear(value),
      current: isSameYear(value, now),
      selected: props.selected && getYear(value) === getYear(props.selected),
      disabled: !isEnabled(value, props.min, props.max),
    })))

    const title = computed(() => {
      const start = getYear(from.value)
      const end = getYear(to.value)
      return `${start} - ${end}`
    })

    const prevDisabled = computed(() => props.min &&
      (getDecade(props.min) === getDecade(props.modelValue) ||
        isBefore(props.modelValue, props.min)))

    const nextDisabled = computed(() => props.max &&
      (getDecade(props.max) === getDecade(props.modelValue) ||
        isAfter(props.modelValue, props.max)))

    const isEnabled = (
      target,
      min,
      max,
    ) => {
      if (!min && !max) return true
      if (min && getYear(target) < getYear(min)) return false
      if (max && getYear(target) > getYear(max)) return false
      return true
    }

    const prev = () => emit('update:modelValue', subYears(props.modelValue, 12))

    const next = () => emit('update:modelValue', addYears(props.modelValue, 12))

    const genHeader = () => {
      return h(DatePickerHeader, {
        prevDisabled: prevDisabled.value,
        nextDisabled: nextDisabled.value,
        onPrev: prev,
        onNext: next,
      }, {
        default: () => title.value,
      })
    }

    const genItems = () => {
      const children = years.value.map(item => {
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
          onClick: (e) => {
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
      years,
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
}
