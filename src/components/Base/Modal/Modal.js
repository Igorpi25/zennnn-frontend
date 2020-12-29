import {
  h,
  ref,
  reactive,
  computed,
  watch,
  nextTick,
  onMounted,
  onBeforeUnmount,
  Transition,
  withDirectives,
  vShow,
  Teleport,
} from 'vue'

import {
  useActivatorProps,
  useActivator,
  useLazyContentProps,
  useLazyContent,
  useAttachProps,
  useAttach,
  ClickOutside,
} from 'uipart'

import uid from '../../../utils/uid'
import { convertToUnit } from '../../../utils/convertToUnit'

export default {
  name: 'Modal',

  props: {
    ...useActivatorProps(),
    ...useLazyContentProps(),
    ...useAttachProps(),
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
    dark: Boolean,
    disabled: Boolean,
    fullscreen: Boolean,
    light: Boolean,
    maxWidth: {
      type: [String, Number],
      default: 'none',
    },
    noClickAnimation: Boolean,
    origin: {
      type: String,
      default: 'center center',
    },
    persistent: Boolean,
    retainFocus: {
      type: Boolean,
      default: true,
    },
    scrollable: Boolean,
    transition: {
      type: [String, Object],
      default: {
        enterActiveClass: 'transition ease-out-quart duration-300',
        enterFromClass: 'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95',
        enterToClass: 'opacity-100 translate-y-0 sm:scale-100',
        leaveActiveClass: 'transition ease-out-quart duration-200',
        leaveFromClass: 'opacity-100 translate-y-0 sm:scale-100',
        leaveToClass: 'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95',
      },
    },
    width: {
      type: [String, Number],
      default: 'auto',
    },
    contentClass: {
      type: String,
      default: '',
    },
    hideOverlay: Boolean,
  },

  emits: ['update:modelValue', 'click:outside', 'keydown'],

  setup (props, { slots, emit }) {
    const id = uid('dialog-')
    // Data
    let previousActiveElement = null
    const animate = ref(false)

    const contentElement = ref(null)
    const contentWrapperElement = ref(null)
    const rootElement = ref(null)
    const overlayElement = ref(null)

    const {
      isActive,
      genActivator,
      getActivator,
    } = useActivator(props, { slots, emit })

    const lazyContentProps = reactive({
      isActive: isActive,
      disabled: computed(() => props.disabled),
    })
    const {
      showLazyContent,
    } = useLazyContent(lazyContentProps)

    const attachProps = reactive({
      attach: computed(() => props.attach),
    })
    const { target } = useAttach(attachProps)

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
        unbind()
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
      if (typeof window !== 'undefined') unbind()
    })

    // Methods
    const scrollListener = (e) => {
      if (e.type === 'keydown') {
        if (
          ['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target).tagName) ||
          // https://github.com/vuetifyjs/vuetify/issues/4715
          (e.target).isContentEditable
        ) return

        const up = ['ArrowUp', 'Up', 'PageUp']
        const down = ['ArrowDown', 'Down', 'PageDown']

        if (up.includes(e.key)) {
          e.deltaY = -1
        } else if (down.includes(e.key)) {
          e.deltaY = 1
        } else {
          return
        }
      }

      if (e.target === overlayElement.value ||
        (e.type !== 'keydown' && e.target === document.body) ||
        checkPath(e)) e.preventDefault()
    }

    const hasScrollbar = (el) => {
      if (!el || el.nodeType !== Node.ELEMENT_NODE) return false

      const style = window.getComputedStyle(el)
      return ['auto', 'scroll'].includes(style.overflowY) && el.scrollHeight > el.clientHeight
    }

    const shouldScroll = (el, delta) => {
      if (el.scrollTop === 0 && delta < 0) return true
      return el.scrollTop + el.clientHeight === el.scrollHeight && delta > 0
    }

    const isInside = (el, parent) => {
      if (el === parent) {
        return true
      } else if (el === null || el === document.body) {
        return false
      } else {
        return isInside(el.parentNode, parent)
      }
    }

    const checkPath = (e) => {
      const path = e.path || composedPath(e)
      const delta = e.deltaY

      if (e.type === 'keydown' && path[0] === document.body) {
        const dialog = contentElement.value
        // getSelection returns null in firefox in some edge cases, can be ignored
        const selection = window.getSelection()
        const selected = selection && selection.anchorNode
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

        if (hasScrollbar(el)) return shouldScroll(el, delta)
      }

      return true
    }

    /**
     * Polyfill for Event.prototype.composedPath
     */
    const composedPath = (e) => {
      if (e.composedPath) return e.composedPath()

      const path = []
      let el = e.target

      while (el) {
        path.push(el)

        if (el.tagName === 'HTML') {
          path.push(document)
          path.push(window)

          return path
        }

        el = el.parentElement
      }
      return path
    }

    const hideScroll = () => {
      document.documentElement.classList.add('overflow-y-hidden')
      window.addEventListener('wheel', scrollListener, { passive: false })
      window.addEventListener('keydown', scrollListener)
    }

    const showScroll = () => {
      document.documentElement.classList.remove('overflow-y-hidden')
      window.removeEventListener('wheel', scrollListener, { passive: false })
      window.removeEventListener('keydown', scrollListener)
    }

    const show = () => {
      nextTick(() => {
        previousActiveElement = document.activeElement
        contentElement.value && contentElement.value.focus()
        bind()
      })
    }

    const bind = () => {
      window.addEventListener('focusin', onFocusin)
    }

    const unbind = () => {
      window.removeEventListener('focusin', onFocusin)
    }

    const onClickAnimationEnd = () => {
      animate.value = false
      contentElement.value.removeEventListener('animationend', onClickAnimationEnd)
    }

    const animateClick = () => {
      animate.value = false
      nextTick(() => {
        animate.value = true
      })
      contentElement.value.addEventListener('animationend', onClickAnimationEnd)
    }

    const closeConditional = (e) => {
      const target = e.target
      return !(
        !isActive.value ||
        contentElement.value.contains(target) ||
        (overlayElement.value && target && !overlayElement.value.contains(target))
      )
    }

    const onClickOutside = (e) => {
      emit('click:outside', e)

      if (props.persistent) {
        props.noClickAnimation || animateClick()
      } else {
        isActive.value = false
      }
    }

    const onKeydown = (e) => {
      if (e.key === 'Esc' || e.key === 'Escape') {
        if (!props.persistent) {
          isActive.value = false
          const activator = getActivator()
          nextTick(() => activator && activator.focus())
        } else if (!props.noClickAnimation) {
          animateClick()
        }
      }
      emit('keydown', e)
    }

    // On focus change, wrap focus to stay inside the dialog
    // https://github.com/vuetifyjs/vuetify/issues/6892
    const onFocusin = (e) => {
      if (!e || !props.retainFocus) return

      const target = e.target

      if (
        !!target &&
        // It isn't the document or the dialog body
        ![document, contentElement.value].includes(target) &&
        // It isn't inside the dialog body
        !contentElement.value.contains(target) &&
        ![rootElement.value].some(el => el.contains(target))
        // So we must have focused something outside the dialog and its children
      ) {
        // Find and focus the first available element inside the dialog
        const focusable = contentElement.value.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
        const el = [...focusable].find(el => !el.hasAttribute('disabled'))
        el && el.focus()
      }
    }

    const genOverlay = () => {
      if (props.hideOverlay || props.fullscreen) return undefined

      const overlay = h('div', {
        ref: overlayElement,
        class: 'fixed inset-0 transition-opacity pointer-events-auto',
        ariaHidden: true,
      }, h('div', { class: 'absolute inset-0 bg-gray-500 opacity-75' }))

      return h(Transition, {
        enterActiveClass: 'transition ease-out-quart duration-300',
        enterFromClass: 'opacity-0',
        enterToClass: 'opacity-100',
        leaveActiveClass: 'transition ease-out-quart duration-200',
        leaveFromClass: 'opacity-100',
        leaveToClass: 'opacity-0',
      }, {
        default: () => withDirectives(
          overlay,
          [
            [vShow, isActive.value],
          ],
        ),
      })
    }

    const genContent = () => {
      const content = genInnerContent()

      if (!props.transition) return content

      const transition = typeof props.transition === 'string'
        ? { name: props.transition }
        : { ...props.transition }

      return h(Transition, {
        appear: true,
        ...transition,
        onBeforeEnter (el) {
          el.style.transformOrigin = props.origin
          el.style.webkitTransformOrigin = props.origin
        },
      }, {
        default: () => content,
      })
    }

    const genInnerContent = () => {
      const data = {
        ref: contentElement,
        class: {
          'text-left bg-white dark:bg-gray-650': true,
          'transform transition-transform': true,
          'inline-block overflow-auto pointer-events-auto max-h-full': true,
          'focus:outline-none shadow-xl': true,
          'w-full h-full': props.fullscreen,
          'rounded-lg m-4 sm:m-8': !props.fullscreen,
          'animate-shake': animate.value,
        },
        style: {
          transformOrigin: props.origin,
        },
        role: 'dialog',
        ariaModal: true,
        tabIndex: isActive.value ? 0 : undefined,
        onKeydown: onKeydown,
      }

      if (!props.fullscreen) {
        data.style = {
          ...data.style,
          maxWidth: props.maxWidth === 'none' ? undefined : convertToUnit(props.maxWidth),
          width: props.width === 'auto' ? undefined : convertToUnit(props.width),
        }
      }

      return withDirectives(
        h('div', data, slots.default ? slots.default() : undefined),
        [
          [
            ClickOutside,
            {
              handler: onClickOutside,
              closeConditional: closeConditional,
              include: () => [contentElement.value],
            },
          ],
          [vShow, isActive.value],
        ],
      )
    }

    const genDialog = () => {
      const dialog = h('div', {
        class: 'fixed z-10 inset-0 pointer-events-none',
      }, h('div', {
        ref: contentWrapperElement,
        class: 'flex items-center justify-center min-h-screen h-full w-full',
      }, [
        genOverlay(),
        genContent(),
      ]))

      return showLazyContent(() => h(Teleport, {
        to: target.value,
        disabled: !target.value,
      }, dialog))
    }

    return {
      rootElement,
      activatorAttrs,
      genActivator,
      genDialog,
    }
  },

  render () {
    return h('div', {
      ref: 'rootElement',
    }, [
      this.genActivator(this.activatorAttrs),
      this.genDialog(),
    ])
  },
}
