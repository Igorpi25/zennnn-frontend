import {
  h,
  ref,
  computed,
  watch,
  nextTick,
  Transition,
  withDirectives,
  vShow,
  onBeforeMount,
  onBeforeUnmount,
  reactive,
  defineComponent,
  TransitionProps,
} from 'vue'

import {
  useLazyContentProps,
  useLazyContent,
  convertToUnit,
} from 'vue-supp'

import uid from '../../utils/uid'

import { useWindowContext } from './Window'

export default defineComponent({
  name: 'WindowItem',

  props: {
    ...useLazyContentProps(),
    disabled: Boolean,
    transition: Object,
    value: {
      required: false,
    },
    index: Number,
  },

  setup (props, { slots }) {
    const {
      isVertical,
      transitionCount,
      transitionHeight,
      internalReverse,
      containerElement,
      register,
      unregister,
      isSelected,
    } = useWindowContext('WindowItem') as Record<string, any>
    const id: string = uid()
    const inTransition = ref<boolean>(false)

    const isActive = computed(() => {
      return isSelected(id)
    })

    const lazyContentProps = reactive({
      isActive,
      eager: computed(() => props.eager),
    })
    const { showLazyContent } = useLazyContent(lazyContentProps)

    const transitionData = computed((): TransitionProps => {
      let leaveTranslate, enterTranslate
      if (isVertical.value) {
        leaveTranslate = internalReverse.value ? 'translate-y-full' : '-translate-y-full'
        enterTranslate = internalReverse.value ? '-translate-y-full' : 'translate-y-full'
      } else {
        leaveTranslate = internalReverse.value ? 'translate-x-full' : '-translate-x-full'
        enterTranslate = internalReverse.value ? '-translate-x-full' : 'translate-x-full'
      }

      const classes = props.transition || {
        enterActiveClass: 'transition-transform ease-out-quart duration-300',
        leaveActiveClass: 'transition-transform ease-out-quart duration-300',
        leaveFromClass: 'absolute top-0 w-full',
        leaveToClass: `absolute top-0 w-full transform ${leaveTranslate}`,
        enterFromClass: `transform ${enterTranslate}`,
      }

      const hooks = {
        onBeforeEnter: onBeforeTransition,
        onAfterEnter: onAfterTransition,
        onEnterCancelled: onAfterTransition,

        onBeforeLeave: onBeforeTransition,
        onAfterLeave: onAfterTransition,
        onLeaveCancelled: onAfterTransition,

        onEnter: onEnter,
      }
      return {
        ...classes,
        ...hooks,
      }
    })

    watch(transitionHeight, (val) => {
      containerElement.value.style.height = val
    })

    onBeforeMount(() => {
      register({ id, value: props.value, disabled: props.disabled }, props.index)
    })

    onBeforeUnmount(() => {
      unregister(id)
    })

    function genWindowItem () {
      return withDirectives(
        h('div', {
        }, slots.default && slots.default()),
        [
          [vShow, isActive.value],
        ],
      )
    }

    function onAfterTransition () {
      if (!inTransition.value) return

      // Finalize transition state.
      inTransition.value = false
      if (transitionCount.value > 0) {
        transitionCount.value--

        // Remove container height if we are out of transition.
        if (transitionCount.value === 0) {
          transitionHeight.value = undefined
        }
      }
    }

    function onBeforeTransition () {
      if (inTransition.value) return

      // Initialize transition state here.
      inTransition.value = true
      if (transitionCount.value === 0) {
        // Set initial height for height transition.
        transitionHeight.value = convertToUnit(containerElement.value.parentNode.clientHeight)
      }
      transitionCount.value++
    }

    function onEnter (el: Element) {
      if (!inTransition.value) return

      nextTick(() => {
        // Do not set height if no transition or cancelled.
        if (!inTransition.value) return

        // Set transition target height.
        transitionHeight.value = convertToUnit(el.clientHeight)
      })
    }

    return {
      transitionData,
      showLazyContent,
      genWindowItem,
    }
  },

  render () {
    return h(Transition, this.transitionData, {
      default: () => this.showLazyContent(this.genWindowItem),
    })
  },
})
