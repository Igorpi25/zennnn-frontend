import {
  h,
  ref,
  computed,
  watch,
  nextTick,
  onMounted,
  onBeforeUnmount,
  withDirectives,
  vShow,
  Teleport,
  Transition,
  defineComponent,
  VNodeProps,
  AllowedComponentProps,
  HTMLAttributes,
} from 'vue'

import {
  useActivatorProps,
  useActivator,
  useLazyContentProps,
  useLazyContent,
  useAttachProps,
  useAttach,
  useTransitionProps,
  ClickOutside,
  convertToUnit,
} from 'vue-supp'

import uid from '../../utils/uid'

const overlayTransition = useTransitionProps({
  enterActiveClass: 'transition ease-out-quart duration-300',
  enterFromClass: 'opacity-0',
  enterToClass: 'opacity-100',
  leaveActiveClass: 'transition ease-out-quart duration-200',
  leaveFromClass: 'opacity-100',
  leaveToClass: 'opacity-0',
}).transition

export default defineComponent({
  name: 'Modal',

  props: {
    ...useActivatorProps(),
    ...useLazyContentProps(),
    ...useAttachProps(),
    ...useTransitionProps({
      appear: true,
      enterActiveClass: 'transition ease-out-quart duration-300',
      enterFromClass: 'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95',
      enterToClass: 'opacity-100 translate-y-0 sm:scale-100',
      leaveActiveClass: 'transition ease-out-quart duration-200',
      leaveFromClass: 'opacity-100 translate-y-0 sm:scale-100',
      leaveToClass: 'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95',
    }),
    overlayTransition,
    openOnHover: {
      type: Boolean,
      default: false,
    },
    openOnFocus: {
      type: Boolean,
      default: false,
    },
    disableKeys: {
      type: Boolean,
      default: true,
    },
    modelValue: {
      type: [Boolean, String, Number],
      default: false,
    },
    disabled: Boolean,
    fullscreen: Boolean,
    maxWidth: {
      type: [String, Number],
      default: 'none',
    },
    noClickAnimation: Boolean,
    persistent: Boolean,
    retainFocus: {
      type: Boolean,
      default: true,
    },
    scrollable: Boolean,
    width: {
      type: [String, Number],
      default: 'auto',
    },
    contentClass: {
      type: String,
      default: '',
    },
    originClass: {
      type: String,
      default: 'origin-center',
    },
    hideOverlay: Boolean,
  },

  emits: ['update:modelValue', 'click:outside', 'keydown'],

  setup(props, { slots, emit }) {
    const id = uid('dialog-')
    // Data
    let previousActiveElement: HTMLElement | undefined
    const animate = ref<boolean>(false)

    const contentElement = ref<HTMLElement>()
    const contentWrapperElement = ref<HTMLElement>()
    const rootElement = ref<HTMLElement>()
    const overlayElement = ref<HTMLElement>()

    const { isActive, genActivator, focusActivator } = useActivator(props, {
      slots,
    })

    const { showLazyContent } = useLazyContent(props, { isActive })

    const { target } = useAttach(props)

    const activatorAttrs = computed(() => {
      return {
        'aria-controls': isActive.value ? id : undefined,
      }
    })

    // Watch
    watch(isActive, (val) => {
      if (val) {
        show()
        hideScroll()
      } else {
        previousActiveElement && previousActiveElement.focus()
        showScroll()
      }
    })

    // Hooks
    onMounted(() => {
      nextTick(() => {
        isActive.value && show()
      })
    })

    onBeforeUnmount(() => {
      showScroll()
    })

    // Methods
    const scrollListener = (e: WheelEvent & KeyboardEvent) => {
      if (e.type === 'keydown') {
        if (
          ['INPUT', 'TEXTAREA', 'SELECT'].includes(
            (e.target as Element).tagName
          ) ||
          // https://github.com/vuetifyjs/vuetify/issues/4715
          (e.target as HTMLElement).isContentEditable
        )
          return

        const up = ['ArrowUp', 'Up', 'PageUp']
        const down = ['ArrowDown', 'Down', 'PageDown']

        if (up.includes(e.key)) {
          (e as any).deltaY = -1
        } else if (down.includes(e.key)) {
          (e as any).deltaY = 1
        } else {
          return
        }
      }

      if (
        e.target === overlayElement.value ||
        (e.type !== 'keydown' && e.target === document.body) ||
        checkPath(e)
      )
        e.preventDefault()
    }

    const hasScrollbar = (el?: Element) => {
      if (!el || el.nodeType !== Node.ELEMENT_NODE) return false

      const style = window.getComputedStyle(el)
      return (
        ['auto', 'scroll'].includes(style.overflowY) &&
        el.scrollHeight > el.clientHeight
      )
    }

    const shouldScroll = (el: Element, delta: number) => {
      if (el.scrollTop === 0 && delta < 0) return true
      return el.scrollTop + el.clientHeight === el.scrollHeight && delta > 0
    }

    const isInside = (el: Element, parent: Element): boolean => {
      if (el === parent) {
        return true
      } else if (el === null || el === document.body) {
        return false
      } else {
        return isInside(el.parentNode as Element, parent)
      }
    }

    const checkPath = (e: WheelEvent) => {
      const path = e.path || composedPath(e)
      const delta = e.deltaY

      if (e.type === 'keydown' && path[0] === document.body) {
        const dialog = contentElement.value
        // getSelection returns null in firefox in some edge cases, can be ignored
        const selected = window.getSelection()?.anchorNode as Element
        if (dialog && hasScrollbar(dialog) && isInside(selected, dialog)) {
          return shouldScroll(dialog, delta)
        }
        return true
      }

      for (let index = 0; index < path.length; index++) {
        const el = path[index]

        if (el === document) return true
        if (el === document.documentElement) return true
        if (el === contentWrapperElement.value) return true

        if (hasScrollbar(el as Element))
          return shouldScroll(el as Element, delta)
      }

      return true
    }

    /**
     * Polyfill for Event.prototype.composedPath
     */
    const composedPath = (e: WheelEvent): EventTarget[] => {
      if (e.composedPath) return e.composedPath()

      const path = []
      let el = e.target as Element

      while (el) {
        path.push(el)

        if (el.tagName === 'HTML') {
          path.push(document)
          path.push(window)

          return path
        }

        el = el.parentElement!
      }
      return path
    }

    const hideScroll = () => {
      document.documentElement.classList.add('overflow-y-hidden')
      window.addEventListener('wheel', scrollListener as EventHandlerNonNull, {
        passive: false,
      })
      window.addEventListener('keydown', scrollListener as EventHandlerNonNull)
    }

    const showScroll = () => {
      document.documentElement.classList.remove('overflow-y-hidden')
      window.removeEventListener('wheel', scrollListener as EventHandlerNonNull)
      window.removeEventListener(
        'keydown',
        scrollListener as EventHandlerNonNull
      )
    }

    const show = () => {
      nextTick(() => {
        previousActiveElement = document.activeElement as HTMLElement
        contentElement.value && contentElement.value.focus()
      })
    }

    const onClickAnimationEnd = () => {
      animate.value = false
      contentElement.value?.removeEventListener(
        'animationend',
        onClickAnimationEnd
      )
    }

    const animateClick = () => {
      animate.value = false
      nextTick(() => {
        animate.value = true
      })
      contentElement.value?.addEventListener(
        'animationend',
        onClickAnimationEnd
      )
    }

    const closeConditional = (e: Event) => {
      const target = e.target as HTMLElement
      return !(
        !isActive.value ||
        contentElement.value?.contains(target) ||
        (overlayElement.value &&
          target &&
          !overlayElement.value.contains(target))
      )
    }

    const onClickOutside = (e: Event) => {
      emit('click:outside', e)

      if (props.persistent) {
        props.noClickAnimation || animateClick()
      } else {
        isActive.value = false
      }
    }

    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Esc' || e.key === 'Escape') {
        if (!props.persistent) {
          isActive.value = false
          nextTick(focusActivator)
        } else if (!props.noClickAnimation) {
          animateClick()
        }
      }
      emit('keydown', e)
    }

    const genOverlay = () => {
      if (props.hideOverlay || props.fullscreen) return undefined

      const overlay = h(
        'div',
        {
          ref: overlayElement,
          class: 'fixed inset-0 transition-opacity pointer-events-auto',
          ariaHidden: true,
        },
        h('div', { class: 'absolute inset-0 bg-gray-500 opacity-75' })
      )

      const content = withDirectives(overlay, [[vShow, isActive.value]])

      if (!props.overlayTransition) return content

      return h(Transition, props.overlayTransition, () => content)
    }

    const genContent = () => {
      const content = genInnerContent()

      if (!props.transition) return content

      return h(Transition, props.transition, () => content)
    }

    const genInnerContent = () => {
      const data: VNodeProps & AllowedComponentProps & HTMLAttributes = {
        ref: contentElement,
        class: {
          'text-left bg-white dark:bg-gray-650': true,
          'transform transition-transform': true,
          'inline-block overflow-auto pointer-events-auto max-h-full': true,
          'focus:outline-none shadow-main-day dark:shadow-main-night': true,
          'w-full h-full': props.fullscreen,
          'rounded-lg m-4 sm:m-8': !props.fullscreen,
          'animate-shake': animate.value,
          [props.contentClass.trim()]: true,
          [props.originClass.trim()]: true,
        },
        id,
        role: 'dialog',
        'aria-modal': true,
        tabindex: isActive.value ? 0 : undefined,
        onKeydown: onKeydown,
      }

      if (!props.fullscreen) {
        data.style = {
          maxWidth:
            props.maxWidth === 'none'
              ? undefined
              : convertToUnit(props.maxWidth),
          width:
            props.width === 'auto' ? undefined : convertToUnit(props.width),
        }
      }

      return withDirectives(h('div', data, slots.default?.()), [
        [
          ClickOutside,
          {
            handler: onClickOutside,
            closeConditional: closeConditional,
            include: () => [contentElement.value],
          },
        ],
        [vShow, isActive.value],
      ])
    }

    const genDialog = () => {
      const dialog = h(
        'div',
        {
          class: 'fixed z-10 inset-0 pointer-events-none',
        },
        h(
          'div',
          {
            ref: contentWrapperElement,
            class:
              'flex items-center justify-center min-h-screen h-full w-full',
          },
          [genOverlay(), genContent()]
        )
      )

      return showLazyContent(() =>
        h(
          Teleport,
          {
            to: target.value,
            disabled: !target.value,
          },
          dialog
        )
      )
    }

    return {
      rootElement,
      activatorAttrs,
      genActivator,
      genDialog,
    }
  },

  render() {
    return h(
      'div',
      {
        ref: 'rootElement',
      },
      [this.genActivator(this.activatorAttrs), this.genDialog()]
    )
  },
})
