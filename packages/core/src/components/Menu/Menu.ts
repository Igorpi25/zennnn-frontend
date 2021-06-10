import {
  h,
  ref,
  watch,
  provide,
  inject,
  computed,
  onBeforeUpdate,
  nextTick,
  vShow,
  Teleport,
  Transition,
  withDirectives,
  defineComponent,
  ComponentPublicInstance,
} from 'vue'

import {
  useTransitionProps,
  useDimensionProps,
  useDimension,
  useAttachProps,
  useAttach,
  useActivatorProps,
  useActivator,
  useLazyContentProps,
  useLazyContent,
  ClickOutside,
} from 'vue-supp'

import { usePopperProps, usePopper } from '../../composables/usePopper'
import { useDelayProps, useDelay } from '../../composables/useDelay'
import { useStackContext } from '../../composables/useStackContext'

import uid from '../../utils/uid'
import { debounce } from '../../utils/debounce'

export const MenuContext = Symbol('MenuContext')

export const useMenuContext = (component: string) => {
  const context = inject(MenuContext)

  if (context === undefined) {
    const err = new Error(
      `<${component} /> is missing a parent <Menu /> component.`
    )
    if (Error.captureStackTrace) Error.captureStackTrace(err, useMenuContext)
    throw err
  }

  return context
}

export default defineComponent({
  name: 'Menu',

  props: {
    ...usePopperProps(),
    ...useActivatorProps(),
    ...useLazyContentProps(),
    ...useTransitionProps({
      enterActiveClass: 'transition-opacity ease-out-quart duration-200',
      leaveActiveClass: 'transition-opacity ease-out-quart duration-150',
      enterFromClass: 'opacity-0',
      leaveToClass: 'opacity-0',
    }),
    ...useDimensionProps(),
    ...useAttachProps(),
    ...useDelayProps(),
    tag: {
      type: String,
      default: 'span',
    },
    contentClass: {
      type: String,
      default: '',
    },
    closeOnClick: {
      type: Boolean,
      default: true,
    },
    closeOnContentClick: {
      type: Boolean,
      default: true,
    },
    openOnHover: {
      type: Boolean,
      default: false,
    },
    openOnFocus: {
      type: Boolean,
      default: false,
    },
    value: {
      type: [String, Number, Object] as any,
      default: null,
    },
    role: {
      type: String,
      default: 'menu',
    },
    tabindex: {
      type: [Number, String],
      default: '0',
    },
    includeElements: {
      type: Array,
      default: () => [],
    },
    id: String,
    visibleOnReferenceHidden: Boolean,
  },

  emits: ['update:modelValue', 'update:value'],

  setup(props, { slots, emit }) {
    const id: string = props.id || uid('menu-')
    const items = ref<any[]>([])
    const rootElement = ref<HTMLElement>()
    const contentElement = ref<HTMLElement>()
    const activeItemIndex = ref<number>(-1)
    const activeItem = ref<HTMLElement>()
    const activeItemId = ref<string>()
    const isVisible = ref(false)

    const { dimensionStyles } = useDimension(props)

    const { target } = useAttach(props)

    const { reference, popper, create, destroy, genArrow, isCursorOutside } =
      usePopper(props)

    const { isActive, genActivator, focusActivator } = useActivator(props, {
      slots,
      reference,
    })

    const { showLazyContent } = useLazyContent(props, { isActive })

    const { activeZIndex } = useStackContext(props, isActive, id)

    function activate() {
      requestAnimationFrame(() => {
        isVisible.value = isActive.value
        create()
      })
    }

    function deactivate() {
      isVisible.value = isActive.value
      if (!props.transition) {
        destroy()
      }
      nextTick(() => {
        activeItemIndex.value = -1
      })
    }

    const { runCloseDelay, runOpenDelay } = useDelay(props, (value) => {
      value ? activate() : deactivate()
    })

    const internalValue = computed(() => props.value)

    const hasClickableMenuItems = computed(() => {
      return Boolean(items.value.find((item) => !item.ariaDisabled))
    })

    const activatorAttrs = computed(() => {
      return {
        'aria-controls': isActive.value ? id : undefined,
      }
    })

    const activatorListeners = computed(() => {
      const listeners: Record<string, (e?: any) => void> = {}

      if (props.openOnHover) {
        listeners.onMouseenter = () => {
          isActive.value = true
          focusMenu()
        }
        // override event from useActivator
        listeners.onMouseleave = (e) => {
          e.stopPropagation()
        }
      }

      if (props.openOnClick) {
        listeners.onClick = (e: MouseEvent) => {
          isActive.value = !isActive.value
          e.stopPropagation()
          if (isActive.value) {
            e.preventDefault()
            focusMenu()
            if (!props.value) goToNextItem()
          }
        }
      } else {
        // override event from useActivator
        listeners.onClick = (e: MouseEvent) => {
          e.stopPropagation()
        }
      }

      if (!props.disableKeys) {
        listeners.onKeydown = onActivatorKeyDown
      }

      return listeners
    })

    const onMousemove = (e: MouseEvent) => {
      if (isCursorOutside(e)) {
        isActive.value = false
      }
    }

    const debouncedOnMousemove = debounce(onMousemove, 45)

    // computed value create "Maximum recursive updates exceeded."
    watch(activeItemIndex, (val) => {
      activeItem.value = items.value[val]
      activeItemId.value = activeItem.value ? activeItem.value.id : undefined
    })

    watch(isActive, (val) => {
      if (props.disabled) return

      if (val) {
        runOpenDelay()
      } else {
        runCloseDelay()
      }
    })

    watch(isVisible, (val) => {
      if (props.openOnHover) {
        if (val) {
          document.addEventListener('mousemove', debouncedOnMousemove)
        } else {
          document.removeEventListener('mousemove', debouncedOnMousemove)
        }
      }
    })

    // make sure to reset the refs before each update
    onBeforeUpdate(() => {
      items.value = []
    })

    const focusMenu = () => {
      if (isVisible.value) {
        nextTick(() => {
          contentElement.value &&
            contentElement.value.focus({ preventScroll: true })
        })
      } else {
        // focus not firing, because content activated in requestAnimationFrame
        const unwatch = watch(isVisible, (val) => {
          nextTick(
            () =>
              val &&
              contentElement.value &&
              contentElement.value.focus({ preventScroll: true })
          )
          unwatch()
        })
      }
    }

    const closeMenu = () => {
      nextTick(() => focusActivator({ preventScroll: true }))
      isActive.value = false
    }

    const selectItem = (value: any) => {
      emit('update:value', value)
    }

    const setItemRef = (el: Element, i: number) => {
      if (el) items.value[i] = el
    }

    // Ref: https://www.w3.org/TR/wai-aria-practices-1.2/#keyboard-interaction-13
    const onActivatorKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Esc' || e.key === 'Escape') {
        closeMenu()
      } else if (
        !isActive.value &&
        (e.key === 'ArrowUp' ||
          e.key === 'Up' ||
          e.key === 'ArrowDown' ||
          e.key === 'Down' ||
          e.key === 'Enter' ||
          e.key === ' ' ||
          e.key === 'Spacebar')
      ) {
        e.preventDefault()
        isActive.value = true
        nextTick(() => {
          focusMenu()
          if (e.key === 'ArrowUp' || e.key === 'Up') {
            !props.value && setTimeout(goToPrevItem)
          } else {
            !props.value && setTimeout(goToNextItem)
          }
        })
      }
    }

    // Ref: https://www.w3.org/TR/wai-aria-practices-1.2/#keyboard-interaction-12
    const onContentKeyDown = (e: KeyboardEvent) => {
      if (props.disableKeys) return
      if (e.key === 'Esc' || e.key === 'Escape' || e.key === 'Tab') {
        closeMenu()
      }

      // Allow for isActive watcher to generate item list
      nextTick(() => changeItemIndex(e))
    }

    const changeItemIndex = (e: KeyboardEvent) => {
      if (!isActive.value || !hasClickableMenuItems.value) {
        return
      } else if (e.key === 'Tab') {
        isActive.value = false
        return
      } else if (e.key === 'ArrowDown' || e.key === 'Down') {
        goToNextItem()
      } else if (e.key === 'ArrowUp' || e.key === 'Up') {
        goToPrevItem()
      } else if (e.key === 'Enter' && activeItemIndex.value !== -1) {
        items.value[activeItemIndex.value].click()
      } else if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault()
      } else {
        return
      }
      // One of the conditions was met, prevent default action (#2988)
      e.preventDefault()
    }

    const goToNextItem = () => {
      if (!hasClickableMenuItems.value) return

      const menuItem = items.value[activeItemIndex.value + 1]

      if (!menuItem) {
        if (!items.value.length) return

        activeItemIndex.value = -1
        goToNextItem()

        return
      }

      activeItemIndex.value++
      if (menuItem.ariaDisabled) goToNextItem()
    }

    const goToPrevItem = () => {
      if (!hasClickableMenuItems.value) return

      const menuItem = items.value[activeItemIndex.value - 1]

      if (!menuItem) {
        if (!items.value.length) return

        activeItemIndex.value = items.value.length
        goToPrevItem()

        return
      }

      activeItemIndex.value--
      if (menuItem.ariaDisabled) goToPrevItem()
    }

    const goToItem = (index: number) => {
      if (!hasClickableMenuItems.value) return

      if (index === -1) {
        activeItemIndex.value = -1
        return
      }
      const menuItem = items.value[index]

      if (menuItem) {
        activeItemIndex.value = index
      }
    }

    const genContent = () => {
      return h(
        'div',
        {
          class: {
            menu__content: true,
            [props.contentClass.trim()]: true,
          },
        },
        slots.default?.()
      )
    }

    const genPopperBox = () => {
      const data = {
        ref: contentElement,
        id,
        role: props.role,
        tabindex: props.tabindex,
        'aria-activedescendant':
          isActive.value && activeItemId.value ? activeItemId.value : undefined,
        class: {
          'popper__box menu__box': true,
          [props.boxClass.trim()]: true,
        },
        style: {
          ...dimensionStyles.value,
        },
        onKeydown: !props.disableKeys ? onContentKeyDown : undefined,
      }

      const content = withDirectives(
        h('div', data, [genContent(), genArrow()]),
        [[vShow, isVisible.value]]
      )

      if (!props.transition) return content

      return h(
        Transition,
        {
          ...props.transition,
          onAfterLeave() {
            destroy()
          },
        },
        () => content
      )
    }

    const genPopper = () => {
      const children = genPopperBox()

      const data = {
        ref: popper,
        style: {
          zIndex: activeZIndex.value,
        },
        'data-popper-root': '',
        'data-popper-visible-on-reference-hidden':
          props.visibleOnReferenceHidden ? '' : undefined,
        onClick(e: Event) {
          const target = e.target as HTMLElement
          if (target.getAttribute('disabled')) return
          if (props.closeOnContentClick) isActive.value = false
        },
      }

      const content = withDirectives(h('div', data, children), [
        [
          ClickOutside,
          {
            handler: () => {
              isActive.value = false
            },
            closeConditional: (e: Event) => {
              const target = e.target as Element
              const wrapper = ((popper.value as ComponentPublicInstance)?.$el ||
                popper.value) as Element
              return (
                isActive.value &&
                props.closeOnClick &&
                !(wrapper && wrapper.contains(target))
              )
            },
            include: () => [rootElement.value, ...props.includeElements],
          },
        ],
      ])

      return showLazyContent(() =>
        h(
          Teleport,
          {
            to: target.value,
            disabled: !target.value,
          },
          content
        )
      )
    }

    const api = {
      id,
      isActive,
      isVisible,
      internalValue,
      activeItemIndex,
      focusMenu,
      setItemRef,
      goToNextItem,
      goToPrevItem,
      goToItem,
      closeMenu,
      selectItem,
    }

    provide(MenuContext, api)

    return {
      ...api,
      items,
      activeItem,
      activeItemId,
      rootElement,
      activatorAttrs,
      activatorListeners,
      genPopper,
      genActivator,
    }
  },

  render() {
    return h(
      this.tag,
      {
        ref: 'rootElement',
        class: {
          menu: true,
        },
      },
      [
        this.genPopper(),
        this.genActivator(this.activatorAttrs, this.activatorListeners),
      ]
    )
  },
})
