import { Sortable } from '@shopify/draggable'
import { defineComponent, onBeforeUnmount, onMounted, ref, h } from 'vue'
import { logger } from '@/plugins'

import type {
  SortableStartEvent,
  SortableSortEvent,
  SortableSortedEvent,
  SortableStopEvent,
} from '@shopify/draggable'

export default defineComponent({
  name: 'Sortable',
  props: {
    disabled: Boolean,
    modelValue: {
      type: Array,
      default: () => [],
    },
    tag: {
      type: String,
      default: 'div',
    },
    wrapper: {
      type: String,
      default: '',
    },
    draggable: {
      type: String,
      default: '',
    },
    handle: String,
    delay: {
      type: Number,
      default: 150,
    },
  },

  emits: ['update:modelValue'],

  setup(props, { emit, slots }) {
    const wrapperId = ref('sortable-' + Math.round(Math.random() * 100000))
    const _sortable = ref()

    onMounted(() => {
      if (!props.disabled) {
        initialize()
      }
    })

    onBeforeUnmount(() => {
      if (_sortable.value !== undefined) {
        _sortable.value.destroy()
      }
    })

    function initialize() {
      const containerSelector = props.wrapper
        ? `#${wrapperId.value} ${props.wrapper}`
        : `#${wrapperId.value}`
      const draggable = `#${wrapperId.value} ${props.draggable}`
      const opt = {
        draggable,
        handle: props.handle,
        delay: props.delay,
        mirror: {
          appendTo: '#app',
          constrainDimensions: true,
        },
      }
      const containers = document.querySelectorAll(containerSelector)
      _sortable.value = new Sortable(containers, opt)
      _sortable.value.on('sortable:start', onSortableStart)
      _sortable.value.on('sortable:sort', onSortableSort)
      _sortable.value.on('sortable:sorted', onSortableSorted)
      _sortable.value.on('sortable:stop', onSortableStop)
    }

    function onSortableStart(e: SortableStartEvent) {
      logger.info('on sortable:start', e)
    }

    function onSortableSort(e: SortableSortEvent) {
      logger.debug('on sortable:sort', e)
    }

    function onSortableSorted(e: SortableSortedEvent) {
      logger.debug('on sortable:sorted', e)
    }

    function onSortableStop(e: SortableStopEvent) {
      logger.info('on sortable:stop', e)
      emit('update:modelValue', e)
    }

    return () => h(props.tag, { id: wrapperId.value }, slots.default?.())
  },
})
