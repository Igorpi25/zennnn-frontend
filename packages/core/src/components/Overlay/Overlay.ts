import {
  h,
  ref,
  watch,
  computed,
  defineComponent,
} from 'vue'

export default defineComponent({
  name: 'Overlay',

  props: {
    modelValue: {
      default: true,
    },
    absolute: Boolean,
    overlayClass: {
      type: String,
      default: '',
    },
    dark: {
      type: Boolean,
      default: true,
    },
    opacity: {
      type: [Number, String],
      default: 0.46,
    },
    zIndex: {
      type: [Number, String],
      default: 5,
    },
    transition: [Boolean, String],
    attach: [String, Boolean],
  },

  emits: ['update:modelValue'],

  setup (props, { slots, emit }) {
    // Data
    const isActive = ref<boolean>(!!props.modelValue)

    // Computed
    const classes = computed(() => {
      return {
        'overlay-wrapper': true,
        absolute: props.absolute,
        'pointer-events-auto': isActive.value,
      }
    })

    const computedOpacity = computed(() => {
      return Number(isActive.value ? props.opacity : 0)
    })

    const styles = computed(() => {
      return {
        zIndex: props.zIndex,
      }
    })

    // Watch
    watch(() => props.modelValue, (val) => {
      isActive.value = !!val
    })

    watch(isActive, (val) => {
      !!val !== props.modelValue && emit('update:modelValue', val)
    })

    // Methods
    const genOverlay = () => {
      const data = {
        class: {
          overlay: true,
          [props.overlayClass.trim()]: true,
        },
        style: {
          opacity: computedOpacity.value,
        },
      }

      return h('div', data)
    }

    const genContent = () => {
      return h('div', {
        class: 'relative',
      }, slots.default ? slots.default() : undefined)
    }

    return {
      classes,
      styles,
      isActive,
      genOverlay,
      genContent,
    }
  },

  render () {
    const children = [this.genOverlay()]

    if (this.isActive) children.push(this.genContent())

    return h('div', {
      class: this.classes,
      style: this.styles,
    }, children)
  },
})
