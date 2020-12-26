import {
  h,
} from 'vue'

import { ziChevronLeft, ziChevronRight } from '../../../assets/icons'

import Icon from '../Icon'

export default {
  name: 'DatePickerHeader',

  props: {
    clickable: Boolean,
    prevDisabled: Boolean,
    nextDisabled: Boolean,
  },

  emits: ['prev', 'next', 'title:click'],

  setup (props, { slots, emit }) {
    const genPrevButton = () => {
      return h('button', {
        class: {
          'flex justify-center items-center rounded-md transition': true,
          'hover:bg-gray-300 focus:bg-gray-300 focus:outline-none': true,
        },
        disabled: props.prevDisabled,
        onClick: (e) => {
          e.preventDefault()
          e.stopPropagation()
          emit('prev')
        },
      }, h(Icon, { size: 32 }, { default: () => ziChevronLeft }))
    }

    const genNextButton = () => {
      return h('button', {
        class: {
          'flex justify-center items-center rounded-md transition': true,
          'hover:bg-gray-300 focus:bg-gray-300 focus:outline-none': true,
        },
        disabled: props.nextDisabled,
        onClick: (e) => {
          e.preventDefault()
          e.stopPropagation()
          emit('next')
        },
      }, h(Icon, { size: 32 }, { default: () => ziChevronRight }))
    }

    const genTitle = () => {
      return h('div', {
        class: 'flex flex-1 justify-center items-center h-8',
      }, h(props.clickable ? 'button' : 'span', {
        class: {
          'font-semibold px-3': true,
          'hover:text-blue-500 focus:text-blue-500 focus:outline-none transition': props.clickable,
        },
        onClick: (e) => {
          e.preventDefault()
          e.stopPropagation()
          emit('title:click')
        },
      }, slots.default ? slots.default() : undefined))
    }

    return {
      genPrevButton,
      genNextButton,
      genTitle,
    }
  },

  render () {
    return h('div', {
      class: 'w-full flex h-8',
    }, [
      this.genPrevButton(),
      this.genTitle(),
      this.genNextButton(),
    ])
  },
}
