import {
  h,
  ref,
  watch,
  computed,
  onMounted,
  withDirectives,
} from 'vue'

import {
  Scroll,
  convertToUnit,
} from 'vue-supp'

import './VScroll.css'

export default {
  name: 'VScroll',

  props: {
    bench: {
      type: [Number, String],
      default: 0,
    },
    itemHeight: {
      type: [Number, String],
      required: true,
    },
    items: {
      type: Array,
      default: () => ([]),
    },
    height: [Number, String],
    maxHeight: [Number, String],
    maxWidth: [Number, String],
    minHeight: [Number, String],
    minWidth: [Number, String],
    width: [Number, String],
  },

  setup (props, { slots }) {
    const rootElement = ref(null)
    const first = ref(0)
    const last = ref(0)
    const scrollTop = ref(0)

    const measurableStyles = computed(() => {
      const styles = {}

      const height = convertToUnit(props.height)
      const minHeight = convertToUnit(props.minHeight)
      const minWidth = convertToUnit(props.minWidth)
      const maxHeight = convertToUnit(props.maxHeight)
      const maxWidth = convertToUnit(props.maxWidth)
      const width = convertToUnit(props.width)

      if (height) styles.height = height
      if (minHeight) styles.minHeight = minHeight
      if (minWidth) styles.minWidth = minWidth
      if (maxHeight) styles.maxHeight = maxHeight
      if (maxWidth) styles.maxWidth = maxWidth
      if (width) styles.width = width

      return styles
    })

    const bench = computed(() => {
      return parseInt(props.bench, 10)
    })

    const itemHeight = computed(() => {
      return parseInt(props.itemHeight, 10)
    })

    const firstToRender = computed(() => {
      return Math.max(0, first.value - bench.value)
    })

    const lastToRender = computed(() => {
      return Math.min(props.items.length, last.value + bench.value)
    })

    watch([() => props.height, () => props.itemHeight], () => onScroll)

    onMounted(() => {
      last.value = getLast(0)
    })

    const getChildren = () => {
      return props.items.slice(
        firstToRender.value,
        lastToRender.value,
      ).map(genChild)
    }

    const genChild = (item, index) => {
      index += firstToRender.value

      const top = convertToUnit(index * itemHeight.value)

      return h('div', {
        class: 'virtual-scroll__item',
        style: { top },
        key: index,
      }, slots.default ? slots.default({ index, item }) : null)
    }

    const getFirst = () => {
      return Math.floor(scrollTop.value / itemHeight.value)
    }

    const getLast = (first) => {
      const height = parseInt(props.height || 0, 10) || rootElement.value.clientHeight

      return first + Math.ceil(height / itemHeight.value)
    }

    const onScroll = () => {
      scrollTop.value = rootElement.value.scrollTop
      first.value = getFirst()
      last.value = getLast(first.value)
    }

    return () => {
      const content = h('div', {
        class: 'virtual-scroll__container',
        style: {
          height: convertToUnit(props.items.length * itemHeight.value),
        },
      }, getChildren())

      return withDirectives(
        h('div', {
          ref: rootElement,
          class: 'virtual-scroll',
          style: measurableStyles.value,
        }, [content]),
        [
          [Scroll, onScroll, null, { self: true }],
        ],
      )
    }
  },
}
