import {
  h,
  ref,
  watch,
  computed,
  onMounted,
  withDirectives,
  provide,
  inject,
} from 'vue'

import { useGroupProps, useGroup, Touch, wrapInArray } from 'vue-supp'

import { ziArrowLeft, ziArrowRight } from '@zennnn/icons'

import Icon from '../Icon'

import './Window.css'

export const WindowContext = Symbol('WindowContext')

export const useWindowContext = (component) => {
  const context = inject(WindowContext)

  if (context === undefined) {
    const err = new Error(`<${component} /> is missing a parent <Window /> component.`)
    if (Error.captureStackTrace) Error.captureStackTrace(err, useWindowContext)
    throw err
  }

  return context
}

export default {
  name: 'Window',

  props: {
    ...useGroupProps(),
    activeClass: {
      type: String,
      default: 'window-item--active',
    },
    nextIcon: {
      type: [Boolean, String],
      default: ziArrowRight,
    },
    prevIcon: {
      type: [Boolean, String],
      default: ziArrowLeft,
    },
    reverse: {
      type: Boolean,
      default: undefined,
    },
    showArrows: Boolean,
    showArrowsOnHover: Boolean,
    touch: Object,
    touchless: Boolean,
    value: {
      required: false,
    },
    vertical: Boolean,
  },

  emits: ['update:modelValue'],

  setup (props, { slots, emit }) {
    // Data
    const internalHeight = ref(undefined) // This can be fixed by child class.
    const transitionHeight = ref(undefined) // Intermediate height during transition.
    const transitionCount = ref(0) // Number of windows in transition state.
    const isBooted = ref(false)
    const isReverse = ref(false)

    const roolElement = ref(null)

    const groupProps = {
      modelValue: props.modelValue,
      multiple: props.multiple,
      mandatory: props.mandatory,
      continuous: props.continuous,
      max: props.max,
    }

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
    } = useGroup(groupProps, { emit })

    const isActive = computed(() => {
      return transitionCount.value > 0
    })

    const classes = computed(() => {
      return {
        window: true,
        'window--show-arrows-on-hover': props.showArrowsOnHover,
      }
    })

    const computedTransition = computed(() => {
      if (!isBooted.value) return ''

      const axis = props.vertical ? 'y' : 'x'
      const direction = internalReverse.value ? '-reverse' : ''

      return `window-${axis}${direction}-transition`
    })

    const internalReverse = computed(() => {
      return props.reverse ? !isReverse.value : isReverse.value
    })

    // Watch
    watch(selectedIndex, (val, oldVal) => updateReverse(val, oldVal))

    watch(() => props.modelValue, (value, oldVal) => {
      if (props.multiple || value === oldVal) return
      const res = getIds(wrapInArray(value))
      const [id] = res
      if (!id) return
      select(id, value)
    })

    // Hooks
    onMounted(() => {
      window.requestAnimationFrame(() => (isBooted.value = true))
    })

    // Methods
    const genContainer = () => {
      const children = slots.default ? [slots.default()] : []

      if (props.showArrows) {
        children.push(genControlIcons())
      }

      return h('div', {
        class: {
          window__container: true,
          'window__container--is-active': isActive.value,
        },
        style: {
          height: internalHeight.value || transitionHeight.value,
        },
      }, children)
    }

    const genIcon = (direction, icon, fn) => {
      return h('div', {
        class: `window__${direction}`,
      }, [
        h('button', {
          'aria-label': direction,
          class: 'flex rounded-full focus:outline-none text-gray-600 hover:text-gray-900 focus:text-gray-900 dark:text-gray-100 dark:hover:text-white dark:focus:text-white p-2',
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

    const genControlIcons = () => {
      const icons = []

      const prevIcon = props.prevIcon

      if (
        hasPrev.value &&
        prevIcon &&
        typeof prevIcon === 'string'
      ) {
        const icon = genIcon('prev', prevIcon, prev)
        icon && icons.push(icon)
      }

      const nextIcon = props.nextIcon

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

    const next = () => {
      if (!hasActiveItems.value || !hasNext.value) return

      _next()
    }

    const prev = () => {
      if (!hasActiveItems.value || !hasPrev.value) return

      _prev()
    }

    const updateReverse = (val, oldVal) => {
      isReverse.value = val < oldVal
    }

    const api = {
      register,
      unregister,
      isSelected,
      internalReverse,
      computedTransition,
      transitionCount,
      transitionHeight,
      el: roolElement,
    }

    provide(WindowContext, api)

    return {
      roolElement,
      classes,
      next,
      prev,
      genContainer,
    }
  },

  render () {
    const node = h('div', {
      ref: 'roolElement',
      class: this.classes,
    }, this.genContainer())

    if (!this.touchless) return node

    const value = this.touch || {
      left: () => this.next,
      right: () => this.prev,
      end: (e) => {
        e.stopPropagation()
      },
      start: (e) => {
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
}
