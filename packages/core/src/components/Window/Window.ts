import {
  h,
  ref,
  watch,
  computed,
  onMounted,
  withDirectives,
  provide,
  inject,
  defineComponent,
  SetupContext,
} from 'vue'

import { useGroupProps, useGroup, Touch, wrapInArray } from 'vue-supp'

import { ziArrowLeft, ziArrowRight } from '@zennnn/icons'

import Icon from '../Icon'

export const WindowContext = Symbol('WindowContext')

export const useWindowContext = (component: string) => {
  const context = inject(WindowContext)

  if (context === undefined) {
    const err = new Error(`<${component} /> is missing a parent <Window /> component.`)
    if (Error.captureStackTrace) Error.captureStackTrace(err, useWindowContext)
    throw err
  }

  return context
}

export default defineComponent({
  name: 'Window',

  props: {
    ...useGroupProps(),
    activeClass: {
      type: String,
      default: 'window-item--active',
    },
    nextIcon: {
      type: [Boolean, String],
      default: true,
    },
    prevIcon: {
      type: [Boolean, String],
      default: true,
    },
    reverse: {
      type: Boolean,
      default: undefined,
    },
    showArrows: Boolean,
    touch: Object,
    touchless: Boolean,
    vertical: Boolean,
  },

  emits: ['update:modelValue'],

  setup (props, ctx) {
    const transitionHeight = ref<string>()
    const transitionCount = ref<number>(0)
    const isBooted = ref<boolean>(false)
    const isReverse = ref<boolean>(false)

    const roolElement = ref<HTMLElement>()
    const containerElement = ref<HTMLElement>()

    const {
      selectedIndex,
      hasActiveItems,
      hasNext,
      hasPrev,
      register,
      unregister,
      select,
      prev: _prev,
      next: _next,
      isSelected,
      getIds,
    } = useGroup(props, ctx as SetupContext)

    const isActive = computed(() => transitionCount.value > 0)

    const internalReverse = computed(() => props.reverse ? !isReverse.value : isReverse.value)

    const isVertical = computed(() => props.vertical)

    watch(selectedIndex, (val, oldVal) => updateReverse(val, oldVal))

    watch(() => props.modelValue, (value, oldVal) => {
      if (props.multiple || value === oldVal) return
      const res = getIds(wrapInArray(value))
      const [id] = res
      if (!id) return
      select(id, value)
    })

    onMounted(() => {
      window.requestAnimationFrame(() => (isBooted.value = true))
    })

    function genIcon (direction: 'prev' | 'next', icon: string, fn: () => void) {
      return h('div', {
        class: {
          'z-1 mx-4 absolute rounded-full bg-black bg-opacity-10 dark:bg-opacity-30': true,
          'left-0': direction === 'prev',
          'right-0': direction === 'next',
        },
        style: {
          top: 'calc(50% - 1.25rem)',
        },
      }, [
        h('button', {
          'aria-label': direction,
          class: {
            'rounded-full w-10 h-10 flex items-center justify-center': true,
            'text-white opacity-50 hover:opacity-100': true,
            'focus:outline-none focus:opacity-100': true,
          },
          onClick: () => {
            fn()
          },
        }, h(Icon, {
          large: true,
        }, {
          default: () => icon,
        })),
      ])
    }

    function genControlIcons () {
      const icons = []

      const prevIcon = props.prevIcon === true
        ? ziArrowLeft
        : props.prevIcon

      if (
        hasPrev.value &&
        prevIcon &&
        typeof prevIcon === 'string'
      ) {
        const icon = genIcon('prev', prevIcon, prev)
        icon && icons.push(icon)
      }

      const nextIcon = props.nextIcon === true
        ? ziArrowRight
        : props.nextIcon

      if (
        hasNext.value &&
        nextIcon &&
        typeof nextIcon === 'string'
      ) {
        const icon = genIcon('next', nextIcon, next)
        icon && icons.push(icon)
      }

      return icons
    }

    function next () {
      if (!hasActiveItems.value || !hasNext.value) return

      _next()
    }

    function prev () {
      if (!hasActiveItems.value || !hasPrev.value) return

      _prev()
    }

    function updateReverse (val: any, oldVal: any) {
      isReverse.value = val < oldVal
    }

    const api = {
      register,
      unregister,
      isSelected,
      internalReverse,
      transitionCount,
      transitionHeight,
      containerElement,
      isVertical,
    }

    provide(WindowContext, api)

    return {
      isActive,
      roolElement,
      containerElement,
      next,
      prev,
      genControlIcons,
    }
  },

  render () {
    const container = h('div', {
      ref: 'containerElement',
      class: {
        'transition-all duration-300': true,
      },
      // leave transition not working, then setted inline to element
      // style: { height: transitionHeight.value },
    }, this.$slots.default && this.$slots.default())

    const node = h('div', {
      ref: 'roolElement',
      class: {
        'relative overflow-hidden': true,
      },
    }, [container, this.showArrows && this.genControlIcons()])

    if (!this.touchless) return node

    const value = this.touch || {
      left: () => this.next,
      right: () => this.prev,
      end: (e: TouchEvent) => {
        e.stopPropagation()
      },
      start: (e: TouchEvent) => {
        e.stopPropagation()
      },
    }

    return withDirectives(
      node,
      [
        [Touch, value],
      ],
    )
  },
})