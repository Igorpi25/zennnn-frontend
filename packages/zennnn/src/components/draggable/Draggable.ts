import { Draggable, DraggableInitializedEvent } from '@shopify/draggable'
import { defineComponent, onBeforeUnmount, onMounted, ref, h } from 'vue'

import type { DragStartEvent, DragOverEvent } from '@shopify/draggable'

export default defineComponent({
  name: 'Draggable',
  props: {
    modelValue: {
      type: Array,
      default: () => [],
    },
    tag: {
      type: String,
      default: 'div',
    },
    draggable: {
      type: String,
      default: '.draggable-source',
    },
    handle: String,
    delay: {
      type: Number,
      default: 300,
    },
  },

  emits: ['update:modelValue'],

  setup(props, { emit, slots }) {
    const sourceIndex = ref()
    const currentIndex = ref()
    const rootRef = ref()
    const _draggable = ref()

    onMounted(() => {
      const opt = {
        draggable: props.draggable,
        handle: props.handle,
        delay: props.delay,
        mirror: {
          constrainDimensions: true,
        },
      }

      _draggable.value = new Draggable(rootRef.value, opt)
      // plugin not disabled, or disabled after initialize, tabindex setting issue
      // https://github.com/Shopify/draggable/issues/317
      _draggable.value.removePlugin(Draggable.Plugins.Focusable)
      // remove tabindex after initialize
      _draggable.value.on('draggable:initialize', () => {
        setTimeout(() => {
          ;(rootRef.value as Element).removeAttribute('tabindex')
          const childrens = (rootRef.value as Element).childNodes
          childrens.forEach((el) => {
            ;(el as Element).removeAttribute('tabindex')
          })
        }, 0)
      })
      // initialization
      _draggable.value.trigger(DraggableInitializedEvent)
      _draggable.value.on('drag:start', onDragStart)
      _draggable.value.on('drag:over', onDragOver)
      _draggable.value.on('drag:stop', onDragStop)
      // _draggable.value.on('mirror:destroy', () => console.log('mirror:destroy'))
    })

    onBeforeUnmount(() => {
      if (_draggable.value !== undefined) {
        _draggable.value.destroy()
      }
    })

    function getIndex(element: HTMLElement) {
      return _draggable.value
        .getDraggableElementsForContainer(element.parentNode)
        .indexOf(element)
    }

    function onDragStart(e: DragStartEvent) {
      sourceIndex.value = getIndex(e.source)
    }

    function onDragOver(e: DragOverEvent) {
      currentIndex.value = getIndex(e.over)
    }

    function onDragStop() {
      const oldIndex = sourceIndex.value
      const newIndex = currentIndex.value
      if (oldIndex !== null && newIndex !== null && oldIndex !== newIndex) {
        const newValue = [...props.modelValue]
        newValue.splice(
          newIndex,
          1,
          newValue.splice(oldIndex, 1, newValue[newIndex])[0]
        )
        emit('update:modelValue', newValue)
      }
      sourceIndex.value = undefined
      currentIndex.value = undefined
    }

    return () => h(props.tag, { ref: rootRef }, slots.default?.())
  },
})
