import { Sortable } from '@shopify/draggable'

const sortableComponent = {
  name: 'Sortable',
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Array,
      default: () => { return [] },
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
    handle: {
      type: String,
      default: null,
    },
    delay: {
      type: Number,
      default: 150,
    },
  },
  data () {
    return {
      wrapperId: 'sortable-' + Math.round(Math.random() * 100000),
    }
  },
  mounted () {
    if (!this.disabled) {
      this.initialize()
    }
  },
  beforeUnmount () {
    if (this._sortable !== undefined) {
      this._sortable.destroy()
    }
  },
  methods: {
    initialize () {
      const containerSelector = this.wrapper
        ? `#${this.wrapperId} ${this.wrapper}` : `#${this.wrapperId}`
      const draggable = `#${this.wrapperId} ${this.draggable}`
      const opt = {
        draggable,
        handle: this.handle,
        delay: this.delay,
        mirror: {
          appendTo: '#app',
          constrainDimensions: true,
        },
      }
      const containers = document.querySelectorAll(containerSelector)
      this._sortable = new Sortable(containers, opt)
      this._sortable.on('sortable:start', this.onSortableStart)
      this._sortable.on('sortable:sort', this.onSortableSort)
      this._sortable.on('sortable:sorted', this.onSortableSorted)
      this._sortable.on('sortable:stop', this.onSortableStop)
    },
    onSortableStart (e) {
      this.$logger.info('on sortable:start', e)
    },
    onSortableSort (e) {
      this.$logger.debug('on sortable:sort', e)
    },
    onSortableSorted (e) {
      this.$logger.debug('on sortable:sorted', e)
    },
    onSortableStop (e) {
      this.$logger.info('on sortable:stop', e)
      this.$emit('input', e.data)
    },
  },
  render (h) {
    const slots = this.$slots.default
    return h(
      this.tag,
      {
        attrs: {
          id: this.wrapperId,
        },
      },
      slots,
    )
  },
}

export default sortableComponent
