import {
  h,
  ref,
  watch,
  reactive,
  computed,
  onMounted,
  Transition,
  withDirectives,
} from 'vue'

import './Image.css'

import { useAspectRatioProps, useAspectRatio, dimensions, Intersect } from 'uipart'

const { useDimensionsProps, useDimensions } = dimensions()

const hasIntersect = typeof window !== 'undefined' && 'IntersectionObserver' in window

export default {
  name: 'Image',

  props: {
    ...useAspectRatioProps(),
    ...useDimensionsProps(),
    alt: String,
    contain: Boolean,
    eager: Boolean,
    gradient: String,
    lazySrc: String,
    options: {
      type: Object,
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
      type: [String, Object],
      default: '',
    },
    srcset: String,
    transition: {
      type: [Boolean, String],
      default: 'fade-transition',
    },
  },

  emits: ['load', 'error'],

  setup (props, { slots, emit }) {
    // Data
    const currentSrc = ref('')
    const image = ref(null)
    const isLoading = ref(true)
    const calculatedAspectRatio = ref(undefined)
    const naturalWidth = ref(undefined)
    const hasError = ref(false)

    const measureProps = reactive({
      height: computed(() => props.height),
      maxHeight: computed(() => props.maxHeight),
      maxWidth: computed(() => props.maxWidth),
      minHeight: computed(() => props.minHeight),
      minWidth: computed(() => props.minWidth),
      width: computed(() => props.width),
    })
    const { dimensionsStyles } = useDimensions(measureProps)

    const aspectRatioProps = reactive({
      aspectRatio: computed(() => Number(normalisedSrc.value.aspect || calculatedAspectRatio.value)),
    })
    const { aspectStyle } = useAspectRatio(aspectRatioProps)

    const normalisedSrc = computed(() => {
      return props.src && typeof props.src === 'object'
        ? {
          src: props.src.src,
          srcset: props.srcset || props.src.srcset,
          lazySrc: props.lazySrc || props.src.lazySrc,
          aspect: Number(props.aspectRatio || props.src.aspect),
        } : {
          src: props.src,
          srcset: props.srcset,
          lazySrc: props.lazySrc,
          aspect: Number(props.aspectRatio || 0),
        }
    })

    const cachedSizer = computed(() => {
      if (!aspectStyle.value) return undefined

      return h('div', {
        style: aspectStyle.value,
        class: 'image__sizer',
      })
    })

    const cachedImage = computed(() => {
      if (!(normalisedSrc.value.src || normalisedSrc.value.lazySrc || props.gradient)) return []

      const backgroundImage = []
      const src = isLoading.value ? normalisedSrc.value.lazySrc : currentSrc.value

      if (props.gradient) backgroundImage.push(`linear-gradient(${props.gradient})`)
      if (src) backgroundImage.push(`url("${src}")`)

      const image = h('div', {
        class: {
          image__image: true,
          'image__image--preload': isLoading.value,
          'image__image--contain': props.contain,
          'image__image--cover': !props.contain,
        },
        style: {
          backgroundImage: backgroundImage.join(', '),
          backgroundPosition: props.position,
        },
        key: +isLoading.value,
      })

      if (!props.transition) return image

      return h(Transition, {
        name: props.transition,
        mode: 'in-out',
      }, {
        default: () => image,
      })
    })

    // Watch
    watch(() => props.src, () => {
      // Force re-init when src changes
      if (!isLoading.value) init(undefined, undefined, true)
      else loadImage()
    })
    // TODO: add watcher for client width change with 'getSrc' function

    // Hooks
    onMounted(() => {
      init()
    })

    // Methods
    const init = (entries, observer, isIntersecting) => {
      // If the current browser supports the intersection
      // observer api, the image is not observable, and
      // the eager prop isn't being used, do not load
      if (
        hasIntersect &&
        !isIntersecting &&
        !props.eager
      ) return

      if (normalisedSrc.value.lazySrc) {
        const lazyImg = new Image()
        lazyImg.src = normalisedSrc.value.lazySrc
        pollForSize(lazyImg, null)
      }

      if (normalisedSrc.value.src) loadImage()
    }

    const onLoad = () => {
      getSrc()
      isLoading.value = false
      emit('load', props.src)
    }

    const onError = () => {
      hasError.value = true
      emit('error', props.src)
    }

    const getSrc = () => {
      if (image.value) currentSrc.value = image.value.currentSrc || image.value.src
    }

    const loadImage = () => {
      const _image = new Image()
      image.value = _image

      _image.onload = () => {
        if (_image.decode) {
          _image.decode().catch((err) => {
            // eslint-disable-next-line
            console.warn(
              'Failed to decode image, trying to render anyway\n\n' +
              `src: ${normalisedSrc.value.src}` +
              (err.message ? `\nOriginal error: ${err.message}` : ''),
            )
          }).then(onLoad)
        } else {
          onLoad()
        }
      }
      _image.onerror = onError

      hasError.value = false
      _image.src = normalisedSrc.value.src
      props.sizes && (_image.sizes = props.sizes)
      normalisedSrc.value.srcset && (_image.srcset = normalisedSrc.value.srcset)

      props.aspectRatio || pollForSize(_image)
      getSrc()
    }

    const pollForSize = (img, timeout = 100) => {
      const poll = () => {
        const { naturalHeight: _naturalHeight, naturalWidth: _naturalWidth } = img

        if (_naturalHeight || _naturalWidth) {
          naturalWidth.value = _naturalWidth
          calculatedAspectRatio.value = _naturalWidth / _naturalHeight
        } else {
          timeout != null && !hasError.value && setTimeout(poll, timeout)
        }
      }

      poll()
    }

    const genContent = () => {
      const data = {
        class: 'image__content',
      }
      if (naturalWidth.value) {
        data.style = { width: `${naturalWidth.value}px` }
      }

      return h('div', data, slots.default ? slots.default() : undefined)
    }

    const genPlaceholder = () => {
      if (slots.placeholder) {
        const placeholder = isLoading.value
          ? h('div', {
            class: 'image__placeholder',
          }, slots.placeholder())
          : undefined

        if (!props.transition) return placeholder

        return h(Transition, {
          appear: true,
          name: props.transition,
        }, {
          default: () => placeholder,
        })
      }
    }

    const genDirectives = (content) => {
      if (!hasIntersect) return content
      return withDirectives(
        content,
        [
          [Intersect, { handler: init, options: props.options }, null, { once: true }],
        ],
      )
    }

    return {
      aspectStyle,
      dimensionsStyles,
      cachedSizer,
      cachedImage,
      genContent,
      genPlaceholder,
      genDirectives,
    }
  },

  render () {
    const data = {
      class: 'image',
      style: this.dimensionsStyles,
      'aria-label': this.alt,
      role: this.alt ? 'img' : undefined,
    }

    const children = [
      this.cachedSizer,
      this.cachedImage,
      this.genPlaceholder(),
      this.genContent(),
    ]

    return this.genDirectives(h('div', data, children))
  },
}
