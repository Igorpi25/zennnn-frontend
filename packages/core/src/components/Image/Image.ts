import {
  h,
  ref,
  watch,
  reactive,
  computed,
  onBeforeMount,
  nextTick,
  vShow,
  Transition,
  withDirectives,
  defineComponent,
  VNode,
  PropType,
  TransitionProps,
  mergeProps,
} from 'vue'

import { useAspectRatioProps, useAspectRatio, useDimensionProps, useDimension, Intersect } from 'vue-supp'

import './Image.css'

const hasIntersect = typeof window !== 'undefined' && 'IntersectionObserver' in window

export interface srcObject {
  src?: string
  srcset?: string
  lazySrc?: string
  aspect: number
}

export default defineComponent({
  name: 'Image',

  props: {
    ...useAspectRatioProps(),
    ...useDimensionProps(),
    alt: String,
    cover: Boolean,
    eager: Boolean,
    lazySrc: String,
    options: {
      type: Object as PropType<IntersectionObserverInit>,
      // For more information on types, navigate to:
      // https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
      default: () => ({
        root: undefined,
        rootMargin: undefined,
        threshold: undefined,
      }),
    },
    position: {
      type: String,
      default: 'center center',
    },
    sizes: String,
    src: {
      type: [String, Object] as PropType<string | srcObject>,
      default: '',
    },
    srcset: String,
    transition: {
      type: [Boolean, String] as PropType<string | false>,
      default: 'fade-transition',
    },
  },

  emits: ['load', 'error', 'loadstart'],

  setup (props, { slots, emit }) {
    const currentSrc = ref<string>('')
    const image = ref<HTMLImageElement>()
    const state = ref<'idle' | 'loading' | 'loaded' | 'error'>('idle')
    const naturalWidth = ref<number>()
    const naturalHeight = ref<number>()

    const { dimensionStyles } = useDimension(props)

    const aspectRatio = computed(() => normalisedSrc.value.aspect || naturalWidth.value! / naturalHeight.value! || 0)

    const aspectRatioProps = reactive({
      aspectRatio,
    })
    const { aspectStyle } = useAspectRatio(aspectRatioProps)

    const normalisedSrc = computed(() => {
      return props.src && typeof props.src === 'object'
        ? {
            src: props.src.src,
            srcset: props.srcset || props.src.srcset,
            lazySrc: props.lazySrc || props.src.lazySrc,
            aspect: Number(props.aspectRatio || props.src.aspect),
          }
        : {
            src: props.src,
            srcset: props.srcset,
            lazySrc: props.lazySrc,
            aspect: Number(props.aspectRatio || 0),
          }
    })

    const containClasses = computed(() => ({
      'bg-cover': props.cover,
      'bg-contain': !props.cover,
    }))

    const __image = computed(() => {
      if (!normalisedSrc.value.src || state.value === 'idle') return

      const img = h('img', {
        ref: image,
        class: ['image__image', containClasses.value],
        src: normalisedSrc.value.src,
        srcset: normalisedSrc.value.srcset,
        sizes: props.sizes,
        onLoad,
        onError,
      })

      const sources = slots.sources?.()

      return genTransition(
        { appear: true },
        withDirectives(
          sources
            ? h('picture', { class: 'image__picture' }, [sources, img])
            : img,
          [[vShow, state.value === 'loaded']],
        ),
      )
    })

    const __preloadImage = computed(() => {
      const img = h('img', {
        src: normalisedSrc.value.lazySrc,
        class: ['image__image image__image--preload', containClasses.value],
      })
      return genTransition(
        {},
        normalisedSrc.value.lazySrc && state.value !== 'loaded' ? img : undefined,
      )
    })

    const __placeholder = computed(() => {
      if (!slots.placeholder) return

      const placeholder = state.value === 'loading' || (state.value === 'error' && !slots.error)
        ? h('div', { class: 'image__placeholder' }, slots.placeholder())
        : undefined

      return genTransition({ appear: true }, placeholder)
    })

    const __error = computed(() => {
      if (!slots.error) return

      const error = state.value === 'error'
        ? h('div', { class: 'image__error' }, slots.error())
        : undefined

      return genTransition({ appear: true }, error)
    })

    watch(() => props.src, () => {
      init(undefined, undefined, state.value !== 'idle')
    })
    // TODO: getSrc when window width changes

    onBeforeMount(() => init())

    const init = (entries?: IntersectionObserverEntry[], observer?: IntersectionObserver, isIntersecting?: boolean) => {
      // If the current browser supports the intersection
      // observer api, the image is not observable, and
      // the eager prop isn't being used, do not load
      if (
        hasIntersect &&
        !isIntersecting &&
        !props.eager
      ) return

      state.value = 'loading'
      nextTick(() => {
        emit('loadstart', image.value?.currentSrc || normalisedSrc.value.src)
        if (!aspectRatio.value) pollForSize(image.value!)
        getSrc()
      })

      if (normalisedSrc.value.lazySrc) {
        const lazyImg = new Image()
        lazyImg.src = normalisedSrc.value.lazySrc
        pollForSize(lazyImg, null)
      }
    }

    const onLoad = () => {
      getSrc()
      state.value = 'loaded'
      emit('load', image.value?.currentSrc || normalisedSrc.value.src)
    }

    const onError = () => {
      state.value = 'error'
      emit('error', image.value?.currentSrc || normalisedSrc.value.src)
    }

    const getSrc = () => {
      if (image.value) currentSrc.value = image.value.currentSrc || image.value.src
    }

    const pollForSize = (img: HTMLImageElement, timeout: number | null = 100) => {
      const poll = () => {
        const { naturalHeight: imgHeight, naturalWidth: imgWidth } = img

        if (imgHeight || imgWidth) {
          naturalWidth.value = imgWidth
          naturalHeight.value = imgHeight
        } else if (!img.complete && state.value === 'loading' && timeout != null) {
          setTimeout(poll, timeout)
        } else if (img.currentSrc.endsWith('.svg') || img.currentSrc.startsWith('data:image/svg+xml')) {
          naturalWidth.value = 1
          naturalHeight.value = 1
        }
      }

      poll()
    }

    const genTransition = (data: TransitionProps, vNodes: VNode | VNode[] | undefined) => {
      if (!props.transition) return vNodes

      return h(
        Transition,
        mergeProps({ name: props.transition }, data as any) as TransitionProps,
        () => vNodes,
      )
    }

    const genContent = () => {
      return h('div', {
        class: 'image__content',
      }, slots.default?.())
    }

    const genDirectives = (content: VNode) => {
      if (!hasIntersect) return content
      return withDirectives(
        content,
        [
          [Intersect, { handler: init, options: props.options }, '', { once: true }],
        ],
      )
    }

    return () => {
      const data = {
        class: 'image',
        style: dimensionStyles.value,
        'aria-label': props.alt,
        role: props.alt ? 'img' : undefined,
      }

      const sizer = h('div', {
        style: aspectStyle.value,
        class: 'image__sizer',
      })

      const children = [
        sizer,
        __image.value,
        __preloadImage.value,
        __placeholder.value,
        __error.value,
        genContent(),
      ]

      return genDirectives(h('div', data, children))
    }
  },
})
