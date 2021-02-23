import {
  h,
  ref,
  watch,
  computed,
  onMounted,
  withDirectives,
  defineComponent,
  VNode,
} from 'vue'

import {
  Scroll,
  convertToUnit,
  dimensions,
} from 'vue-supp'

import './VScroll.css'

const { useDimensionsProps, useDimensions } = dimensions()

export default defineComponent({
  name: 'VScroll',

  props: {
    ...useDimensionsProps(),
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
  },

  setup (props, { slots }) {
    const rootElement = ref<HTMLElement>()
    const first = ref<number>(0)
    const last = ref<number>(0)
    const scrollTop = ref<number>(0)

    const { dimensionsStyles } = useDimensions(props)

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

    const getChildren = (): VNode[] => {
      return props.items.slice(
        firstToRender.value,
        lastToRender.value,
      ).map(genChild)
    }

    const genChild = (item: any, index: number) => {
      index += firstToRender.value

      const top = convertToUnit(index * itemHeight.value)

      return h('div', {
        class: 'virtual-scroll__item',
        style: { top },
        key: index,
      }, slots.default?.({ index, item }))
    }

    const getFirst = (): number => {
      return Math.floor(scrollTop.value / itemHeight.value)
    }

    const getLast = (first: number): number => {
      const height = parseInt(props.height || 0, 10) || rootElement.value!.clientHeight

      return first + Math.ceil(height / itemHeight.value)
    }

    const onScroll = () => {
      scrollTop.value = rootElement.value!.scrollTop
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
          style: dimensionsStyles.value,
        }, [content]),
        [
          [Scroll, onScroll, '', { self: true }],
        ],
      )
    }
  },
})
