import {
  h,
  ref,
} from 'vue'

import uid from '../../utils/uid'

import './Label.css'

export default {
  name: 'Label',

  props: {
    id: String,
    for: String,
    value: String,
    showWrap: Boolean,
  },

  setup (props, { slots }) {
    const id = props.id || uid('label-')
    const rootElement = ref(null)
    const contentWrapperElement = ref(null)
    const contentElement = ref(null)
    const closestBackgroundColor = ref('transparent')
    const hasOverflow = ref(false)
    let timeout = null

    const getClosestBackgroundColor = () => {
      let el = rootElement.value
      while (el.parentNode) {
        const { backgroundColor } = getComputedStyle(el)
        if (backgroundColor !== 'transparent' && backgroundColor !== 'rgba(0, 0, 0, 0)') {
          closestBackgroundColor.value = backgroundColor
          break
        }
        el = el.parentNode
      }
    }

    const onPointerenter = () => {
      timeout = setTimeout(() => {
        const clientWidth = contentWrapperElement.value && contentWrapperElement.value.clientWidth
        const scrollWidth = contentElement.value && contentElement.value.scrollWidth
        hasOverflow.value = scrollWidth > clientWidth
        if (hasOverflow.value) {
          getClosestBackgroundColor()
          contentElement.value.style.backgroundColor = closestBackgroundColor.value
          contentElement.value.style.overflow = 'visible'
          contentElement.value.style.whiteSpace = 'normal'
          contentElement.value.style.zIndex = 1
        }
      }, 120)
    }
    const onPointerleave = () => {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      if (hasOverflow.value) {
        contentElement.value.style.backgroundColor = 'unset'
        contentElement.value.style.overflow = 'hidden'
        contentElement.value.style.whiteSpace = 'nowrap'
        contentElement.value.style.zIndex = 'unset'
      }
    }

    const genContentWrapper = () => {
      const data = {
        ref: contentWrapperElement,
        class: 'label__content__wrapper',
      }
      if (props.showWrap) {
        data.onPointerenter = onPointerenter
        data.onPointerleave = onPointerleave
      }
      return h('div', data, genContent())
    }

    const genAppendSlot = () => {
      return slots.append && slots.append()
    }

    const genContent = () => {
      return h('div', {
        ref: contentElement,
        class: 'label__content',
      }, getContent())
    }

    const getContent = () => {
      return slots.default ? slots.default() : props.value
    }

    return {
      rootElement,
      id,
      closestBackgroundColor,
      genContentWrapper,
      genAppendSlot,
    }
  },

  render () {
    return h('label', {
      ref: 'rootElement',
      id: this.id,
      for: this.for,
      'aria-hidden': !this.for,
      class: {
        label: true,
        'label--show-wrap': this.showWrap,
      },
    }, h('div', {
      class: 'label__wrapper',
    }, [this.genContentWrapper(), this.genAppendSlot()]))
  },
}
