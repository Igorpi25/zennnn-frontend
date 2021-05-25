import {
  h,
  ref,
  computed,
  watch,
  defineComponent,
  vShow,
  Teleport,
  Transition,
  withDirectives,
  ComponentPublicInstance
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
  ClickOutside
} from 'vue-supp'

import { usePopperProps, usePopper } from '../../composables/usePopper'

import uid from '../../utils/uid'

export default defineComponent({
  name: 'Tooltip',

  props: {
    ...usePopperProps(),
    ...useActivatorProps(),
    ...useLazyContentProps(),
    ...useTransitionProps({
      enterActiveClass: 'transition ease-out duration-150',
      enterFromClass: 'transform scale-50 opacity-0',
      enterToClass: 'transform scale-100 opacity-100',
      leaveActiveClass: 'transition ease-out duration-75',
      leaveFromClass: 'opacity-100',
      leaveToClass: 'opacity-0'
    }),
    ...useDimensionProps(),
    ...useAttachProps(),
    tag: {
      type: String,
      default: 'span'
    },
    contentClass: {
      type: String,
      default: ''
    },
    origin: String
  },

  emits: ['update:modelValue'],

  setup(props, { slots }) {
    const id: string = uid('tooltip-')
    const rootElement = ref<HTMLElement>()
    const isVisible = ref(false)

    const { dimensionStyles } = useDimension(props)

    const { target } = useAttach(props)

    const { reference, popper, create, destroy, genArrow } = usePopper(props)

    const { isActive, genActivator } = useActivator(props, { slots, reference })

    const { showLazyContent } = useLazyContent(props, { isActive })

    const activatorAttrs = computed(() => {
      return {
        role: undefined,
        'aria-describedby': isActive.value ? id : undefined,
        'aria-controls': isActive.value ? id : undefined
      }
    })

    const activatorListeners = computed(() => {
      return {
        onBlur: () => {
          isActive.value = false
        }
      }
    })

    watch(isActive, val => {
      if (props.disabled) return
      if (val) {
        requestAnimationFrame(() => {
          isVisible.value = val
          create()
        })
      } else {
        isVisible.value = val
        if (!props.transition) {
          destroy()
        }
      }
    })

    const genContent = () => {
      return h(
        'div',
        {
          class: {
            tooltip__content: true,
            [props.contentClass.trim()]: true
          }
        },
        slots.default?.()
      )
    }

    const genPopperBox = () => {
      const data = {
        id,
        role: 'tooltip',
        tabindex: '-1',
        class: {
          'popper__box tooltip__box': true
        },
        style: dimensionStyles.value
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
          onBeforeEnter(el: Element) {
            if (props.origin) {
              ;(el as HTMLElement).style.transformOrigin = props.origin
              ;(el as HTMLElement).style.webkitTransformOrigin = props.origin
            }
          },
          onAfterEnter() {
            if (!isActive.value) destroy()
          },
          onAfterLeave() {
            destroy()
          }
        },
        () => content
      )
    }

    const genPopper = () => {
      const children = genPopperBox()

      const data = {
        ref: popper,
        style: {
          zIndex: props.zIndex
        },
        'data-popper-root': ''
      }

      const content = withDirectives(h('div', data, children), [
        [
          ClickOutside,
          {
            handler: () => {
              isActive.value = false
            },
            closeConditional: (e: Event) => {
              const wrapper = ((popper.value as ComponentPublicInstance)?.$el ||
                popper.value) as Element
              return isActive.value && !wrapper?.contains(e.target as Element)
            },
            include: () => [rootElement.value]
          }
        ]
      ])

      return showLazyContent(() =>
        h(
          Teleport,
          {
            to: target.value,
            disabled: !target.value
          },
          content
        )
      )
    }

    return {
      isActive,
      isVisible,
      rootElement,
      activatorAttrs,
      activatorListeners,
      genPopper,
      genActivator
    }
  },

  render() {
    return h(
      this.tag,
      {
        ref: 'rootElement',
        class: {
          tooltip: true
        }
      },
      [
        this.genPopper(),
        this.genActivator(this.activatorAttrs, this.activatorListeners)
      ]
    )
  }
})
