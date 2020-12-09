import { Draggable } from '@shopify/draggable'
import { DraggableInitializedEvent } from '@shopify/draggable/lib/draggable'

let sourceIndex = null
let currentIndex = null

const draggableComponent = {
  name: 'Draggable',
  props: {
    value: {
      type: Array,
      default: () => { return [] },
    },
    tag: {
      type: String,
      default: 'div',
    },
    draggable: {
      type: String,
      default: '.draggable-source',
    },
    handle: {
      type: String,
      default: null,
    },
    delay: {
      type: Number,
      default: 300,
    },
  },
  mounted () {
    const opt = {
      draggable: this.draggable,
      handle: this.handle,
      delay: this.delay,
      mirror: {
        constrainDimensions: true,
      },
    }
    this._draggable = new Draggable(this.$el, opt)
    // plugin not disabled, or disabled after initialize, tabindex setting issue
    // https://github.com/Shopify/draggable/issues/317
    this._draggable.removePlugin(Draggable.Plugins.Focusable)
    // remove tabindex after initialize
    this._draggable.on('draggable:initialize', () => {
      setTimeout(() => {
        this.$el.removeAttribute('tabindex')
        const childrens = this.$el.childNodes
        childrens.forEach(el => {
          el.removeAttribute('tabindex')
        })
      }, 0)
    })
    // initialization
    this._draggable.trigger(DraggableInitializedEvent)
    this._draggable.on('drag:start', this.onDragStart)
    this._draggable.on('drag:over', this.onDragOver)
    this._draggable.on('drag:stop', this.onDragStop)
    // this._draggable.on('mirror:destroy', () => console.log('mirror:destroy'))
  },
  beforeUnmount () {
    if (this._draggable !== undefined) {
      this._draggable.destroy()
    }
  },
  methods: {
    getIndex (element) {
      return this._draggable
        .getDraggableElementsForContainer(element.parentNode)
        .indexOf(element)
    },
    onDragStart (e) {
      sourceIndex = this.getIndex(e.source)
    },
    onDragOver (e) {
      currentIndex = this.getIndex(e.over)
    },
    onDragStop () {
      const oldIndex = sourceIndex
      const newIndex = currentIndex
      if (oldIndex !== null && newIndex !== null && oldIndex !== newIndex) {
        const newValue = [...this.value]
        newValue.splice(
          newIndex,
          1,
          newValue.splice(oldIndex, 1, newValue[newIndex])[0],
        )
        this.$emit('input', newValue)
      }
      sourceIndex = null
      currentIndex = null
    },
  },
  render (h) {
    const slots = this.$slots.default
    return h(this.tag, {}, slots)
  },
}

export default draggableComponent
