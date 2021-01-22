import {
  h,
  ref,
  computed,
  nextTick,
  Transition,
  withDirectives,
  vShow,
  onBeforeMount,
  onBeforeUnmount,
  reactive,
} from 'vue'

import {
  useLazyContentProps,
  useLazyContent,
  convertToUnit,
} from 'vue-supp'

import uid from '../../utils/uid'

import { useWindowContext } from './Window'

export default {
  name: 'WindowItem',

  props: {
    ...useLazyContentProps(),
    disabled: Boolean,
    reverseTransition: {
      type: [Boolean, String],
      default: undefined,
    },
    transition: {
      type: [Boolean, String],
      default: undefined,
    },
    value: {
      required: false,
    },
    index: Number,
  },

  setup (props, { slots }) {
    const windowGroup = useWindowContext('WindowItem')
    // Data
    const id = uid()
    const inTransition = ref(false)

    // Computed
    const isActive = computed(() => {
      return windowGroup.isSelected(id)
    })

    const lazyContentProps = reactive({
      isActive,
      eager: computed(() => props.eager),
    })
    const { showLazyContent } = useLazyContent(lazyContentProps)

    const classes = computed(() => {
      return {
        'window-item': true,
        'window-item--active': isActive.value,
      }
    })

    const computedTransition = computed(() => {
      if (!windowGroup.internalReverse.value) {
        return typeof props.transition !== 'undefined'
          ? props.transition || ''
          : windowGroup.computedTransition.value
      }

      return typeof props.reverseTransition !== 'undefined'
        ? props.reverseTransition || ''
        : windowGroup.computedTransition.value
    })

    // Hooks
    onBeforeMount(() => {
      windowGroup.register({ id, value: props.value, disabled: props.disabled }, props.index)
    })

    onBeforeUnmount(() => {
      windowGroup.unregister(id)
    })

    // Methods
    const genDefaultSlot = () => {
      return slots.default ? slots.default() : undefined
    }

    const genWindowItem = () => {
      return withDirectives(
        h('div', {
          class: classes.value,
        }, genDefaultSlot()),
        [
          [vShow, isActive.value],
        ],
      )
    }

    const onAfterTransition = () => {
      if (!inTransition.value) {
        return
      }

      // Finalize transition state.
      inTransition.value = false
      if (windowGroup.transitionCount.value > 0) {
        windowGroup.transitionCount.value--

        // Remove container height if we are out of transition.
        if (windowGroup.transitionCount.value === 0) {
          windowGroup.transitionHeight.value = undefined
        }
      }
    }

    const onBeforeTransition = () => {
      if (inTransition.value) {
        return
      }

      // Initialize transition state here.
      inTransition.value = true
      if (windowGroup.transitionCount.value === 0) {
        // Set initial height for height transition.
        windowGroup.transitionHeight.value = convertToUnit(windowGroup.el.value.clientHeight)
      }
      windowGroup.transitionCount.value++
    }

    const onTransitionCancelled = () => {
      onAfterTransition() // This should have the same path as normal transition end.
    }

    const onEnter = (el) => {
      if (!inTransition.value) {
        return
      }

      nextTick(() => {
        // Do not set height if no transition or cancelled.
        if (!computedTransition.value || !inTransition.value) {
          return
        }

        // Set transition target height.
        windowGroup.transitionHeight.value = convertToUnit(el.clientHeight)
      })
    }

    return {
      computedTransition,
      onBeforeTransition,
      onAfterTransition,
      onTransitionCancelled,
      onEnter,
      showLazyContent,
      genWindowItem,
    }
  },

  render () {
    return h(Transition, {
      name: this.computedTransition,

      // Handlers for enter windows.
      onBeforeEnter: this.onBeforeTransition,
      onAfterEnter: this.onAfterTransition,
      onEnterCancelled: this.onTransitionCancelled,

      // Handlers for leave windows.
      onBeforeLeave: this.onBeforeTransition,
      onAfterLeave: this.onAfterTransition,
      onLeaveCancelled: this.onTransitionCancelled,

      // Enter handler for height transition.
      onEnter: this.onEnter,
    }, {
      default: () => this.showLazyContent(this.genWindowItem),
    })
  },
}
