import {
  h,
  ref,
  reactive,
  watch,
  provide,
  inject,
  computed,
  onBeforeUpdate,
  nextTick,
  defineComponent,
  PropType,
} from 'vue'

import {
  usePopperProps,
  usePopper,
  useActivatorProps,
  useActivator,
  useLazyContentProps,
  useLazyContent,
  useClientRect,
  ClickOutside,
} from 'vue-supp'

import uid from '../../utils/uid'

import './Menu.css'

export const MenuContext = Symbol('MenuContext')

export const useMenuContext = (component: string) => {
  const context = inject(MenuContext)

  if (context === undefined) {
    const err = new Error(`<${component} /> is missing a parent <Menu /> component.`)
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
      default: () => ([]),
    },
    id: String,
    transition: {
      type: [String, Object] as PropType<string | Record<string, unknown> | null | undefined>,
      default: 'menu-transition',
    },
  },

  emits: ['update:modelValue', 'update:value'],

  setup (props, { slots, emit }) {
    const id: string = props.id || uid('menu-')
    const items = ref<any[]>([])
    const rootElement = ref<HTMLElement>()
    const contentElement = ref<HTMLElement>()
    const activeItemIndex = ref<number>(-1)
    const activeItem = ref<HTMLElement>()
    const activeItemId = ref<string>()

    const {
      isVisible,
      isContentVisible,
      boxOffsetElement,
      wrapperElement,
      create: createPopper,
      destroy: destroyPopper,
      genBox,
      genBoxOffset,
      genWrapper,
    } = usePopper(props)

    const {
      isActive,
      activatorElement,
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

    const clientRectProps = reactive({
      element: props.width === 'auto' ? rootElement : undefined,
      hasResizeListener: props.width === 'auto',
    })
    const {
      clientRect,
      updateClientRect,
    } = useClientRect(clientRectProps)

    const internalValue = computed(() => props.value)

    const hasClickableMenuItems = computed(() => {
      return Boolean(items.value.find(item => !item.ariaDisabled))
    })

    const activatorAttrs = computed(() => {
      return {
        'aria-controls': isActive.value ? id : undefined,
      }
    })

    const activatorListeners = computed(() => {
      const listeners: Record<string, unknown> = {}

      if (props.openOnHover) {
        listeners.onMouseenter = () => {
          isActive.value = true
          focusMenu()
        }
        listeners.onMouseleave = (e: MouseEvent) => {
          const target = e.relatedTarget as HTMLElement
          if (
            wrapperElement.value?.contains(target) ||
            boxOffsetElement.value?.contains(target)
          ) return
          isActive.value = false
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
        listeners.onKeyDown = onActivatorKeyDown
      }

      return listeners
    })

    // computed value create "Maximum recursive updates exceeded."
    watch(activeItemIndex, (val) => {
      activeItem.value = items.value[val]
      activeItemId.value = activeItem.value ? activeItem.value.id : undefined
    })

    watch(isActive, (val) => {
      if (!val) {
        nextTick(() => {
          activeItemIndex.value = -1
        })
      }

      if (props.disabled) return
      // show popper root from isActive, hide after transition end
      if (val) isVisible.value = val
      val ? activate() : deactivate()
    })

    watch(isVisible, (val) => {
      if (val !== isActive.value) {
        isActive.value = val
      }
    })

    watch(() => props.activator, () => {
      destroyPopper()
    })

    // make sure to reset the refs before each update
    onBeforeUpdate(() => {
      items.value = []
    })

    const focusMenu = () => {
      if (isContentVisible.value) {
        nextTick(() => {
          contentElement.value && contentElement.value.focus({ preventScroll: true })
        })
      } else {
        // focus not firing, because content activated in requestAnimationFrame
        const unwatch = watch(isContentVisible, (val) => {
          nextTick(() => val && contentElement.value && contentElement.value.focus({ preventScroll: true }))
          unwatch()
        })
      }
    }

    const closeMenu = () => {
      nextTick(() => {
        const _activator = getActivator()
        _activator && _activator.focus({ preventScroll: true })
      })
      isActive.value = false
    }

    const selectItem = (value: any) => {
      emit('update:value', value)
    }

    const setItemRef = (el: Element, i: number) => {
      if (el) items.value[i] = el
    }

    const activate = () => {
      getActivator()
      if (props.width === 'auto') updateClientRect()
      requestAnimationFrame(() => {
        isContentVisible.value = isActive.value
        createPopper(activatorElement.value, wrapperElement.value)
      })
    }

    const deactivate = () => {
      isContentVisible.value = false
    }

    // Ref: https://www.w3.org/TR/wai-aria-practices-1.2/#keyboard-interaction-13
    const onActivatorKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Esc' || e.key === 'Escape') {
        closeMenu()
      } else if (
        !isActive.value &&
        (
          e.key === 'ArrowUp' || e.key === 'Up' ||
          e.key === 'ArrowDown' || e.key === 'Down' ||
          e.key === 'Enter' ||
          e.key === ' ' || e.key === 'Spacebar'
        )
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
      } else { return }
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
      return h('div', {
        class: {
          menu__content: true,
          [props.contentClass.trim()]: true,
        },
      }, slots.default?.())
    }

    const genPopper = () => {
      const boxData: Record<string, unknown> = {
        ref: contentElement,
        id,
        role: props.role,
        class: 'menu__box',
        tabindex: props.tabindex,
        'aria-activedescendant': isActive.value && activeItemId.value ? activeItemId.value : undefined,
      }
      if (props.width === 'auto') {
        boxData.style = { width: clientRect.value?.width + 'px' }
      }
      if (!props.disableKeys) {
        boxData.onKeyDown = onContentKeyDown
      }
      const children = genBox(
        boxData,
        [
          props.openOnHover ? genBoxOffset() : undefined,
          genContent(),
        ],
      )

      const data: Record<string, unknown> = {
        onClick (e: Event) {
          const target = e.target as HTMLElement
          if (target.getAttribute('disabled')) return
          if (props.closeOnContentClick) isActive.value = false
        },
      }
      if (!props.disabled && props.openOnHover) {
        data.onMouseenter = () => {
          isActive.value = true
        }
      }
      if (props.openOnHover) {
        data.onMouseleave = (e: MouseEvent) => {
          const target = e.relatedTarget as HTMLElement
          if (
            rootElement.value?.contains(target) ||
            boxOffsetElement.value?.contains(target)
          ) return
          isActive.value = false
        }
      }

      const directives = [
        [
          ClickOutside,
          {
            handler: () => {
              isActive.value = false
            },
            closeConditional: (e: Event) => {
              const target = e.target as HTMLElement
              return isActive.value &&
                props.closeOnClick &&
                !(wrapperElement.value && wrapperElement.value.contains(target))
            },
            include: () => [rootElement.value, ...props.includeElements],
          },
        ],
      ]

      return genWrapper(
        data,
        children,
        directives,
      )
    }

    const api = {
      id,
      isActive,
      isVisible,
      isContentVisible,
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
      showLazyContent,
      genActivator,
    }
  },

  render () {
    return h(this.tag, {
      ref: 'rootElement',
      class: {
        menu: true,
      },
    }, [
      this.showLazyContent(this.genPopper),
      this.genActivator(this.activatorAttrs, this.activatorListeners),
    ])
  },
})
