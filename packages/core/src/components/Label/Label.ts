import {
  h,
  ref,
  defineComponent,
} from 'vue'

import uid from '../../utils/uid'

export default defineComponent({
  name: 'Label',

  props: {
    id: String,
    for: String,
    value: String,
    showWrap: Boolean,
  },

  setup (props, { slots }) {
    const id: string = props.id || uid('label-')
    const rootElement = ref<HTMLElement>()
    const contentWrapperElement = ref<HTMLElement>()
    const contentElement = ref<HTMLElement>()
    const closestBackgroundColor = ref<string>('transparent')
    const hasOverflow = ref<boolean>(false)
    let timeout: any = null

    const getClosestBackgroundColor = () => {
      let el = rootElement.value
      while (el?.parentNode) {
        const { backgroundColor } = getComputedStyle(el)
        if (backgroundColor !== 'transparent' && backgroundColor !== 'rgba(0, 0, 0, 0)') {
          closestBackgroundColor.value = backgroundColor
          break
        }
        el = el.parentNode as HTMLElement
      }
    }

    const onPointerenter = () => {
      timeout = setTimeout(() => {
        const clientWidth = contentWrapperElement.value?.clientWidth || 0
        const scrollWidth = contentElement.value?.scrollWidth || 0
        hasOverflow.value = scrollWidth > clientWidth
        if (hasOverflow.value) {
          getClosestBackgroundColor()
          contentElement.value!.style.backgroundColor = closestBackgroundColor.value
          contentElement.value!.style.overflow = 'visible'
          contentElement.value!.style.whiteSpace = 'normal'
          contentElement.value!.style.zIndex = '1'
        }
      }, 120)
    }
    const onPointerleave = () => {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      if (hasOverflow.value) {
        contentElement.value!.style.backgroundColor = 'unset'
        contentElement.value!.style.overflow = 'hidden'
        contentElement.value!.style.whiteSpace = 'nowrap'
        contentElement.value!.style.zIndex = 'unset'
      }
    }

    const genContentWrapper = () => {
      const data = {
        ref: contentWrapperElement,
        class: 'label__content__wrapper',
      } as any
      if (props.showWrap) {
        data.onPointerenter = onPointerenter
        data.onPointerleave = onPointerleave
      }
      return h('div', data, genContent())
    }

    const genAppendSlot = () => {
      return slots.append?.()
    }

    const genContent = () => {
      return h('div', {
        ref: contentElement,
        class: 'label__content',
      }, getContent())
    }

    const getContent = () => {
      return slots.default?.() ?? props.value
    }

    return () => {
      return h('label', {
        ref: rootElement,
        id: id,
        for: props.for,
        'aria-hidden': !props.for,
        class: {
          label: true,
          'label--show-wrap': props.showWrap,
        },
      }, h('div', {
        class: 'label__wrapper',
      }, [genContentWrapper(), genAppendSlot()]))
    }
  },
})
