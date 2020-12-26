import {
  h,
  ref,
  reactive,
  computed,
  watch,
} from 'vue'

import {
  usePopperProps,
  usePopper,
  useActivatorProps,
  useActivator,
  useLazyContentProps,
  useLazyContent,
  ClickOutside,
} from 'uipart'

import uid from '../../../utils/uid'

import './Tooltip.css'

export default {
  name: 'Tooltip',

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
    transition: {
      type: [String, Object],
      default: {
        enterActiveClass: 'transition ease-out duration-150',
        enterFromClass: 'transform opacity-0 scale-50',
        enterToClass: 'transform opacity-100 scale-100',
        leaveActiveClass: 'transition ease-out duration-75',
        leaveFromClass: 'transform opacity-100',
        leaveToClass: 'transform opacity-0',
      },
    },
  },

  emits: ['update:modelValue'],

  setup (props, { slots, emit }) {
    const id = uid('tooltip-')
    const rootElement = ref(null)

    const {
      isVisible,
      isContentVisible,
      wrapperElement,
      create: createPopper,
      destroy: destroyPopper,
      genBox,
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

    const activatorAttrs = computed(() => {
      return {
        'aria-describedby': isActive.value ? id : undefined,
        'aria-controls': isActive.value ? id : undefined,
      }
    })

    const activatorListeners = computed(() => {
      return {
        onBlur: () => {
          isActive.value = false
        },
      }
    })

    watch(isActive, (val) => {
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

    const activate = () => {
      getActivator()
      requestAnimationFrame(() => {
        isContentVisible.value = true
        createPopper(activatorElement.value, wrapperElement.value)
      })
    }

    const deactivate = () => {
      isContentVisible.value = false
    }

    const genContent = () => {
      return h('div', {
        class: {
          tooltip__content: true,
          [props.contentClass.trim()]: true,
        },
      }, slots.default ? slots.default() : undefined)
    }

    const genPopper = () => {
      const children = genBox(
        {
          id,
          role: 'tooltip',
          tabindex: '-1',
          class: 'tooltip__box',
        },
        [genContent()],
      )

      const directives = [
        [
          ClickOutside,
          {
            handler: () => {
              isActive.value = false
            },
            closeConditional: (e) => {
              const target = e.target
              return isActive.value &&
                !(wrapperElement.value && wrapperElement.value.contains(target))
            },
            include: () => [rootElement.value],
          },
        ],
      ]

      return genWrapper(
        undefined,
        children,
        directives,
      )
    }

    return {
      isActive,
      isVisible,
      isContentVisible,
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
        tooltip: true,
      },
    }, [
      this.showLazyContent(this.genPopper),
      this.genActivator(this.activatorAttrs, this.activatorListeners),
    ])
  },
}
