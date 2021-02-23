import {
  h,
  ref,
  watch,
  Transition,
  withDirectives,
  defineComponent,
  Prop,
} from 'vue'

import { Intersect } from 'vue-supp'

export default defineComponent({
  name: 'Intersection',

  props: {
    modelValue: Boolean,

    tag: {
      type: String,
      default: 'div',
    },

    transition: String,

    once: Boolean,
    quiet: Boolean,

    // For more information on types, navigate to:
    // https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
    options: {
      type: Object,
      default: () => ({
        root: undefined,
        rootMargin: undefined,
        threshold: undefined,
      }),
    } as Prop<IntersectionObserverInit>,
  },

  emits: ['update:modelValue'],

  setup (props, { slots, emit }) {
    const _isIntersecting = ref<boolean>(false)

    watch(() => props.modelValue, (val) => {
      _isIntersecting.value = val
    })

    watch(_isIntersecting, (val) => {
      emit('update:modelValue', val)
    })

    // More information about these options
    // is located here: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
    const onIntersect = (entries: IntersectionObserverEntry[], observer: IntersectionObserver, isIntersecting: boolean) => {
      if (props.once) {
        if (!_isIntersecting.value) _isIntersecting.value = isIntersecting
      } else if (_isIntersecting.value !== isIntersecting) {
        _isIntersecting.value = isIntersecting
      }
    }

    return () => {
      const content = _isIntersecting.value
        ? slots.default?.()
        : undefined

      const transition = props.transition
        ? h(Transition, { name: props.transition }, { default: () => content })
        : content

      const value = {
        handler: onIntersect,
        options: props.options,
      }

      return withDirectives(
        h(props.tag, null, transition),
        [
          [Intersect, value, '', { once: props.once, quiet: props.quiet }],
        ],
      )
    }
  },
})
