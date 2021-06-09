import {
  h,
  ref,
  computed,
  watch,
  nextTick,
  onMounted,
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

import { useLockscreen } from '../../composables/useLockscreen'
import { useStackContext } from '../../composables/useStackContext'

import uid from '../../utils/uid'

const IN_BROWSER = typeof window !== 'undefined'

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
    overlayClass: {
      type: String,
      default: '',
    },
    hideOverlay: Boolean,
    zIndex: [Number, String],
    top: [Number, String],
    hideOverflow: Boolean,
  },

  emits: ['update:modelValue', 'click:outside', 'keydown'],

  setup(props, { attrs, slots, emit }) {
    const id = uid('modal-')

    let previousActiveElement: HTMLElement | undefined
    const animate = ref<boolean>(false)

    const wrapperElement = ref<HTMLElement>()
    const contentElement = ref<HTMLElement>()
    const overlayElement = ref<HTMLElement>()

    const { isActive, genActivator, focusActivator } = useActivator(props, {
      slots,
    })

    const { showLazyContent } = useLazyContent(props, { isActive })

    const { target } = useAttach(props)

    const { activeZIndex, isTopZIndex } = useStackContext(
      props,
      isActive,
      id,
      'modal'
    )

    useLockscreen(isActive)

    const activatorAttrs = computed(() => {
      return {
        'aria-controls': isActive.value ? id : undefined,
      }
    })

    watch(isActive, (val) => {
      if (val) {
        show()
      } else {
        previousActiveElement && previousActiveElement.focus()
      }
    })

    onMounted(() => {
      nextTick(() => {
        isActive.value && show()
      })
    })

    function onFocusin(e: FocusEvent) {
      const before = e.relatedTarget as HTMLElement | null
      const after = e.target as HTMLElement | null

      if (
        before !== after &&
        contentElement.value &&
        // It isn't the document or the dialog body
        ![document, contentElement.value].includes(after!) &&
        // It isn't inside the dialog body
        !contentElement.value.contains(after) &&
        // We're the topmost dialog
        isTopZIndex.value
        // It isn't inside a dependent element (like a menu)
        // TODO: !this.getOpenDependentElements().some(el => el.contains(target))
        // So we must have focused something outside the dialog and its children
      ) {
        const focusable = [
          ...contentElement.value.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          ),
        ].filter((el) => !el.hasAttribute('disabled')) as HTMLElement[]

        if (!focusable.length) return

        const firstElement = focusable[0]
        const lastElement = focusable[focusable.length - 1]

        if (before === firstElement) {
          lastElement.focus()
        } else {
          firstElement.focus()
        }
      }
    }

    if (IN_BROWSER) {
      watch(
        () => isActive.value && props.retainFocus,
        (val) => {
          val
            ? document.addEventListener('focusin', onFocusin)
            : document.removeEventListener('focusin', onFocusin)
        },
        { immediate: true }
      )
    }

    const show = () => {
      nextTick(() => {
        previousActiveElement = document.activeElement as HTMLElement
        contentElement.value && contentElement.value.focus()
        setTimeout(() => {
          if (wrapperElement.value?.parentElement) {
            wrapperElement.value.parentElement.scrollTop = 0
          }
        }, 0)
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
          class: 'fixed inset-0 transition-opacity',
          ariaHidden: true,
        },
        h('div', {
          class: {
            'modal-overlay': true,
            [props.overlayClass.trim()]: true,
          },
        })
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
          'modal-content': true,
          'modal-content--fullscreen': props.fullscreen,
          'animate-shake': animate.value,
          [props.contentClass.trim()]: true,
        },
        tabindex: isActive.value ? 0 : undefined,
        onKeydown: onKeydown,
      }

      if (!props.fullscreen) {
        data.style = {
          marginTop: props.top ? convertToUnit(props.top) : undefined,
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

    const genModal = () => {
      const modal = h(
        'div',
        {
          class: {
            'fixed inset-0': true,
            'overflow-y-auto': !props.fullscreen && !props.hideOverflow,
            'pointer-events-none': !isActive.value,
          },
          style: {
            zIndex: activeZIndex.value,
          },
        },
        h(
          'div',
          {
            ref: wrapperElement,
            class: [
              'modal',
              { 'modal--fullscreen': props.fullscreen },
              attrs.class,
            ],
            id,
            role: 'dialog',
            'aria-modal': true,
          },
          [
            genOverlay(),
            !props.fullscreen && !props.top
              ? h('span', {
                  class: 'inline-block h-screen align-middle',
                  'aria-hidden': true,
                  innerHTML: '&ZeroWidthSpace;',
                })
              : undefined,
            genContent(),
          ]
        )
      )

      return showLazyContent(() =>
        h(
          Teleport,
          {
            to: target.value,
            disabled: !target.value,
          },
          h('div', { 'data-modal-teleport-root': '' }, modal)
        )
      )
    }

    return {
      wrapperElement,
      activatorAttrs,
      genActivator,
      genModal,
    }
  },

  render() {
    const activator = this.genActivator(this.activatorAttrs) || []
    return [...activator, this.genModal()]
  },
})
