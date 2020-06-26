import { convertToUnit } from '../../util/helpers'

export default {
  name: 'Alert',
  props: {
    value: Boolean,
    // type, can be: primary, error, warn, success, info
    color: {
      type: String,
      default: 'primary',
    },
    icon: {
      type: Boolean,
      default: true,
    },
    close: Boolean,
    text: {
      type: String,
      default: '',
    },
    transition: String,
    minWidth: {
      type: [String, Number],
      default: null,
    },
    maxWidth: {
      type: [String, Number],
      default: 494,
    },
    textColor: String,
    bgColor: String,
    iconColor: String,
  },
  computed: {
    compTextColor () {
      if (this.textColor) return this.textColor
      switch (this.color) {
        case 'error': return 'text-white'
        case 'warn': return 'text-yellow-500'
        case 'success': return 'text-green-500'
        case 'info': return 'text-gray-100'
        default: return 'text-blue-500'
      }
    },
    compBgColor () {
      if (this.bgColor) return this.bgColor
      switch (this.color) {
        case 'error': return 'bg-red-900'
        case 'warn': return 'bg-yellow-500 bg-opacity-10'
        case 'success': return 'bg-green-500 bg-opacity-10'
        case 'info': return 'bg-gray-100 bg-opacity-10'
        default: return 'bg-blue-500 bg-opacity-10'
      }
    },
    compIconColor () {
      if (this.iconColor) return this.iconColor
      switch (this.color) {
        case 'error': return 'text-pink-500'
        case 'info': return 'text-green-500'
        default: return this.compTextColor
      }
    },
  },
  methods: {
    closeAlert () {
      this.$emit('input', false)
    },
    genContent () {
      const children = []
      if (this.icon) {
        children.push(this.$createElement('i', {
          class: ['zi-info text-2xl flex-shrink-0 pr-4', this.compIconColor],
        }))
      }
      const content = this.$slots.default ? this.$slots.default : this.text
      children.push(this.$createElement('div', {
        class: ['flex-grow flex items-center text-sm leading-tight'],
      }, content))
      if (this.close) {
        children.push(this.$createElement('i', {
          class: ['zi-close text-2xl flex-shrink-0 pl-3 cursor-pointer select-none', this.compTextColor],
          on: {
            click: this.closeAlert,
          },
        }))
      }
      return this.$createElement('div', {
        class: [
          'flex rounded-md relative text-white py-3 px-4',
          this.compTextColor,
          this.compBgColor,
        ],
        style: {
          maxWidth: this.maxWidth && !isNaN(Number(this.maxWidth)) ? convertToUnit(this.maxWidth) : this.maxWidth,
          minWidth: this.minWidth && !isNaN(Number(this.minWidth)) ? convertToUnit(this.minWidth) : this.minWidth,
        },
        attrs: {
          role: 'alert',
        },
        directives: [{
          name: 'show',
          value: this.value,
        }],
      }, children)
    },
  },
  render (h) {
    if (this.transition) {
      return h('transition', {
        props: {
          name: this.transition,
        },
      }, [this.genContent()])
    } else {
      return this.value ? [this.genContent()] : null
    }
  },
}
