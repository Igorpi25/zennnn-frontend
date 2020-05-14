export default {
  name: 'Button',
  props: {
    tag: {
      type: String,
      default: 'button',
    },
    to: {
      type: [String, Object],
      default: undefined,
    },
    append: Boolean,
    replace: Boolean,
    href: String,
    target: String,
    loading: Boolean,
    disabled: Boolean,
    block: Boolean,
    outlined: Boolean,
    borderless: Boolean,
    contentClass: {
      type: String,
      default: 'w-full flex items-center justify-center',
    },
  },
  computed: {
    staticClass () {
      return 'h-12 inline-flex relative rounded-md focus:outline-none select-none align-middle transition-colors duration-100 ease-out'
    },
    classes () {
      const classes = []
      // text classes
      if (this.disabled) {
        if (this.outlined) {
          classes.push('text-gray-400')
        } else {
          classes.push('text-gray-200')
        }
      } else if (this.outlined) {
        classes.push('text-blue-500')
      } else {
        classes.push('text-white')
      }
      // bg classes
      if (!this.outlined) {
        if (this.disabled) {
          classes.push('bg-gray-400')
        } else {
          classes.push('bg-blue-500', 'hover:bg-blue-600', 'focus:bg-blue-600')
        }
      }
      // border classes
      if (this.outlined) {
        classes.push('border', this.borderless ? 'border-transparent' : 'border-gray-400')
        if (!this.disabled) {
          classes.push('hover:border-blue-500', 'focus:border-blue-500')
        }
      }
      // other classes
      if (this.disabled || this.loading) {
        classes.push('pointer-events-none', 'cursor-default')
      }
      if (this.block) {
        classes.push('w-full justify-center')
      }
      return classes
    },
  },
  methods: {
    click (e) {
      this.$el.blur()
      this.$emit('click', e)
    },
    genContent () {
      const children = []
      const data = {
        class: [
          this.contentClass,
          { 'opacity-0': this.loading },
          this.$slots.icon ? 'px-sm' : 'px-4',
        ],
      }
      if (this.$slots.icon) {
        const icon = this.$createElement('i', {
          class: 'w-6 mr-sm flex items-center justify-center text-2xl',
        }, this.$slots.icon)
        children.push(icon)
      }
      const text = this.$createElement('span', {
        class: { 'leading-none': this.$slots.icon },
      }, this.$slots.default)
      children.push(text)
      return this.$createElement('span', data, children)
    },
    genRouterLink () {
      let tag
      const data = {
        attrs: {
          tabindex: 'tabindex' in this.$attrs ? this.$attrs.tabindex : undefined,
        },
        class: [
          this.staticClass,
          ...this.classes,
        ],
        props: {},
        [this.to ? 'nativeOn' : 'on']: {
          ...this.$listeners,
          click: this.click,
        },
        ref: 'link',
      }
      if (this.to) {
        tag = 'router-link'
        Object.assign(data.props, {
          to: this.to,
          append: this.append,
          replace: this.replace,
        })
      } else {
        tag = (this.href && 'a') || this.tag || 'div'
        if (tag === 'a' && this.href) {
          data.attrs.href = this.href
        }
      }
      if (this.target) {
        data.attrs.target = this.target
      }
      return { tag, data }
    },
    genLoader () {
      return this.$createElement('span', {
        class: 'absolute inset-0 flex items-center justify-center',
      }, this.$slots.loader || [this.$createElement('v-progress-circular', {
        props: {
          indeterminate: true,
          size: 24,
          width: 2,
        },
      })])
    },
  },
  render (h) {
    const children = [
      this.genContent(),
      this.loading && this.genLoader(),
    ]
    const { tag, data } = this.genRouterLink()
    if (tag === 'a' && (this.disabled || this.loading)) {
      data.attrs.href = null
    }
    if (tag === 'button') {
      data.attrs.disabled = this.disabled || this.loading
    }
    return h(tag, data, children)
  },
}
