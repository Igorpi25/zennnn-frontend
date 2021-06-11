import { h, ref, defineComponent } from 'vue'

import uid from '../../utils/uid'

export default defineComponent({
  name: 'Label',

  props: {
    id: String,
    for: String,
    value: String,
  },

  setup(props, { slots }) {
    const id: string = props.id || uid('label-')
    const rootElement = ref<HTMLElement>()
    const contentWrapperElement = ref<HTMLElement>()
    const contentElement = ref<HTMLElement>()
    const hasOverflow = ref<boolean>(false)
    const isHovered = ref(false)
    let timeout: any = null

    const getClosestBackgroundColor = () => {
      let el = rootElement.value
      let color = 'inherit'
      while (el?.parentNode) {
        const { backgroundColor } = getComputedStyle(el)
        if (
          backgroundColor !== 'transparent' &&
          backgroundColor !== 'rgba(0, 0, 0, 0)'
        ) {
          color = backgroundColor
          break
        }
        el = el.parentNode as HTMLElement
      }
      return color
    }

    const onPointerenter = () => {
      const clientWidth = contentWrapperElement.value?.clientWidth || 0
      const scrollWidth = contentElement.value?.scrollWidth || 0
      hasOverflow.value = scrollWidth > clientWidth
      if (hasOverflow.value) {
        timeout = setTimeout(() => {
          if (hasOverflow.value) {
            isHovered.value = true
            contentElement.value!.style.backgroundColor =
              getClosestBackgroundColor()
          }
        }, 120)
      }
    }
    const onPointerleave = () => {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      if (hasOverflow.value) {
        isHovered.value = false
        contentElement.value!.style.backgroundColor = 'unset'
      }
    }

    const genContentWrapper = () => {
      return h(
        'div',
        {
          ref: contentWrapperElement,
          class: 'label__content__wrapper',
          onPointerenter: onPointerenter,
          onPointerleave: onPointerleave,
        },
        genContent()
      )
    }

    const genAppendSlot = () => {
      return slots.append?.()
    }

    const genContent = () => {
      return h(
        'div',
        {
          ref: contentElement,
          class: 'label__content',
        },
        getContent()
      )
    }

    const getContent = () => {
      return slots.default?.() ?? props.value
    }

    return () => {
      return h(
        'label',
        {
          ref: rootElement,
          id: id,
          for: props.for,
          'aria-hidden': !props.for,
          class: {
            label: true,
            'label--show-overflow': hasOverflow.value && isHovered.value,
          },
        },
        h(
          'div',
          {
            class: 'label__wrapper',
          },
          [genContentWrapper(), genAppendSlot()]
        )
      )
    }
  },
})
