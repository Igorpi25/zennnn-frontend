import { h } from 'vue'

import { ziChevronLeft, ziChevronRight } from '@zennnn/icons'

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
          'w-6 h-6 rounded transition': true,
          'text-blue-500 hover:bg-blue-400 hover:text-white focus:bg-blue-400 focus:text-white focus:outline-none': true,
        },
        disabled: props.prevDisabled,
        onClick: (e) => {
          e.preventDefault()
          e.stopPropagation()
          emit('prev')
        },
      }, h(Icon, { size: 24 }, { default: () => ziChevronLeft }))
    }

    const genNextButton = () => {
      return h('button', {
        class: {
          'w-6 h-6 rounded transition': true,
          'text-blue-500 hover:bg-blue-400 hover:text-white focus:bg-blue-400 focus:text-white focus:outline-none': true,
        },
        disabled: props.nextDisabled,
        onClick: (e) => {
          e.preventDefault()
          e.stopPropagation()
          emit('next')
        },
      }, h(Icon, { size: 24 }, { default: () => ziChevronRight }))
    }

    const genTitle = () => {
      return h(props.clickable ? 'button' : 'span', {
        class: {
          'px-4': true,
          'text-blue-500 hover:text-blue-400 focus:text-blue-400 focus:outline-none transition': props.clickable,
        },
        onClick: (e) => {
          e.preventDefault()
          e.stopPropagation()
          emit('title:click')
        },
      }, slots.default && slots.default())
    }

    return {
      genPrevButton,
      genNextButton,
      genTitle,
    }
  },

  render () {
    return h('div', {
      class: 'flex items-center justify-between h-12 px-4',
    }, [
      this.genPrevButton(),
      this.genTitle(),
      this.genNextButton(),
    ])
  },
}
