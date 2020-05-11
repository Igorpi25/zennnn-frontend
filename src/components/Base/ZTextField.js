import debounce from 'lodash.debounce'

import validatable from '@/mixins/validatable'

import {
  formatNumber,
  unformatNumber,
  setCursor,
} from '../../util/helpers'

export default {
  name: 'TextField',

  inject: {
    form: {
      default: null,
    },
  },

  mixins: [validatable],

  props: {
    value: {
      type: [String, Number, Date],
      default: null,
    },
    lazy: Boolean,
    id: String,
    label: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'text',
    },
    number: Boolean,
    // text, numeric, decimal
    // TODO: compute for number numberic/decimal, else text or tel
    inputmode: {
      type: String,
      default: 'text',
    },
    // decimal, currency
    // TODO: rename to format, used only for numbers,
    // can be integer, decimal, currency of formatter style
    format: {
      type: String,
      default: 'decimal',
    },
    name: String,
    required: Boolean,
    readonly: Boolean,
    disabled: Boolean,
    minlength: String,
    maxlength: String,
    // TODO: props 'right' renamed to 'text-align', remove use 'input-class' instead
    alighRight: Boolean,
    autofocus: Boolean,
    placeholder: String,
    clearable: Boolean,
    singleLine: Boolean,
    solo: Boolean,
    debounce: {
      type: Number,
      default: 0,
    },
    contentClass: {
      type: [String, Object],
      default: '',
    },
    inputClass: {
      type: [String, Object],
      default: '',
    },
  },

  data () {
    return {
      blurWithoutUpdate: false,
      hasFocus: false,
      editMode: false,
      lazyValue: this.value,
      backgroundColor: 'transparent',
    }
  },

  computed: {
    currentLang () {
      return this.$i18n.locale
    },
    computedId () {
      return this.id || `input-${this._uid}`
    },
    compPlaceholder () {
      // ignore placeholder on number
      return this.number
        ? '' : this.placeholder
    },
    computedFormatOptions () {
      const n = this.$n(1000.1)
      return {
        thousand: n.slice(1, 2),
        decimal: n.slice(-2, -1),
      }
    },
    formatNumberOptions () {
      // precision numbers digits must be between 0 and 20
      const precision = this.inputmode === 'numeric'
        ? 0 : this.format === 'currency'
          ? 2 : 20
      return {
        precision,
        thousand: this.editMode ? '' : this.computedFormatOptions.thousand,
        decimal: this.computedFormatOptions.decimal,
        fixed: !this.editMode && this.format === 'currency',
        fallback: !this.editMode ? 0 : null,
      }
    },
    internalValue: {
      get () {
        return this.lazyValue
      },
      set (val) {
        this.lazyValue = val || null
      },
    },
    computedContentClass () {
      const staticClasses = ['relative flex items-center focus:outline-none transition-colors duration-100 ease-out']
      let genericClasses = [
        'rounded',
        this.hasWarn || this.hasError ? 'shadow-yellow-400' : 'focus-within:shadow-blue-500',
        this.disabled ? 'text-gray-600 cursor-not-allowed' : this.solo ? 'text-blue-500' : 'text-white',
        this.solo
          ? 'h-8 text-sm bg-transparent focus-within:bg-gray-800'
          : 'h-10 text-base bg-gray-800',
      ]
      if (this.solo && !this.internalValue) {
        genericClasses.push('bg-gray-800')
      }
      if (!this.$slots.prepend) {
        genericClasses.push('pl-sm')
      }
      if (!this.$slots.append) {
        genericClasses.push('pr-sm')
      }
      // should merge props classes
      if (this.contentClass) {
        genericClasses.push(this.contentClass)
      }
      return staticClasses.concat(genericClasses)
    },
    computedInputClass () {
      const staticClasses = ['w-full text-current appearence-none bg-transparent focus:outline-none transition-colors duration-100 ease-out']
      const genericClasses = [
        this.disabled ? 'placeholder-gray-600' : 'placeholder-gray-200',
      ]
      if (this.disabled) {
        genericClasses.push('cursor-not-allowed')
      }
      if (this.number || this.alighRight) {
        genericClasses.push('text-right')
      }
      // should merge props classes
      if (this.inputClass) {
        genericClasses.push(this.inputClass)
      }
      return staticClasses.concat(genericClasses)
    },
  },

  watch: {
    currentLang (val, oldVal) {
      if (this.number) {
        // TODO: re-format on lang change
        const n = this.$n(1000.1, null, oldVal)
        const opt = Object.assign({}, this.formatNumberOptions, { decimal: n.slice(-2, -1) })
        this.internalValue = formatNumber(this.internalValue, opt)
      }
    },
    value: {
      handler (val) {
        if (this.editMode) return
        this.internalValue = this.number ? this.formatNumber(val) : val
      },
      immediate: true,
    },
  },

  created () {
    if (this.debounce) {
      this.debounceInput = debounce(this.emitChange, this.debounce)
    }
    if (this.form) {
      this.form.register(this)
    }
  },
  mounted () {
    let el = this.$el
    while (el.parentNode) {
      const { backgroundColor } = getComputedStyle(el)
      if (backgroundColor !== 'transparent' && backgroundColor !== 'rgba(0, 0, 0, 0)') {
        this.backgroundColor = backgroundColor
        break
      }
      el = el.parentNode
    }
    if (this.autofocus) {
      this.$refs.input.focus()
    }
  },
  beforeDestroy () {
    if (this.form) {
      this.form.unregister(this)
    }
  },

  methods: {
    formatNumber (val) {
      return formatNumber(val, this.formatNumberOptions)
    },

    unformat (val) {
      return unformatNumber(val, this.formatNumberOptions.decimal)
    },

    onFocus (e) {
      // edit mode start on focus
      this.editMode = true
      this.hasFocus = true
      if (this.number) {
        const n = this.unformat(this.internalValue)
        this.internalValue = this.value ? this.formatNumber(n) : null
        setTimeout(() => {
          e.target.selectionStart = e.target.selectionEnd = e.target.value.length
        })
      }
    },

    onBlur () {
      this.hasFocus = false
      // stop edit mode and call emit
      this.editMode = false
      if (this.number) {
        this.internalValue = this.formatNumber(this.internalValue)
      }
      // cancel debounced
      if (this.debounce) {
        this.debounceInput.cancel()
      }
      // on esc blur without update
      if (this.blurWithoutUpdate) {
        this.blurWithoutUpdate = false
        return
      }
      // immediate call changes
      if (this.internalValue !== this.value && !this.lazy) {
        this.emitChange()
      }
    },

    onInput (e) {
      let value = e.target.value || ''
      if (this.patterns) {
        const result = this.validatePatterns(value)
        if (result) {
          const el = e.target
          let positionFromEnd = el.value.length - el.selectionEnd
          el.value = this.internalValue
          positionFromEnd = el.value.length - positionFromEnd
          setCursor(el, positionFromEnd)
          return
        }
      }
      if (this.number) {
        const el = e.target
        let positionFromEnd = el.value.length - el.selectionEnd
        // update input value with formatted data
        value = this.formatNumber(el.value)
        el.value = value
        positionFromEnd = el.value.length - positionFromEnd
        setCursor(el, positionFromEnd)

        this.hasError = e.target.validity.badInput
      }
      this.internalValue = value
      if (!this.lazy) {
        if (this.debounce) {
          this.debounceInput()
        } else {
          this.emitChange()
        }
      }
      this.checkField(e)
    },

    onChange () {
      if (this.lazy) {
        this.emitChange()
      }
    },

    onKeyDown (e) {
      if (this.debounce) {
        // on esc set value from store
        if (e.key === 'Esc' || e.key === 'Escape') {
          this.internalValue = this.value
          this.blurWithoutUpdate = true
          this.$refs.input.blur()
          e.preventDefault()
        } else if (e.key === 'Enter') {
          // on enter blur normally
          this.$refs.input.blur()
          e.preventDefault()
        }
      }
    },

    focus () {
      this.$refs.input.focus()
    },

    emitChange () {
      // on number type return internal value, without formatting
      const val = this.number
        ? this.unformat(this.internalValue)
        : this.internalValue
      this.$emit('input', val)
    },

    genWarnMenu () {
      const props = {
        activator: this.$refs['content'],
        attach: this.$refs['alert'],
        value: this.hasWarn || this.hasError,
        top: true,
        offsetY: true,
        zIndex: 'unset',
        nudgeBottom: this.solo ? '32' : '40',
        allowOverflow: true,
        contentClass: 'shadow-yellow-400',
        openOnClick: false,
        disableKeys: true,
        closeOnClick: false,
        closeOnContentClick: false,
        closeDelay: 75,
        origin: 'bottom center',
      }
      return this.$createElement('v-menu', {
        attrs: {
          role: 'alert',
        },
        props,
      }, [this.$createElement('div', {
        class: [
          'text-black bg-yellow-400 flex items-center',
          this.solo ? 'pb-8' : 'pb-10',
        ],
        on: {
          click: () => {
            this.focus()
          },
        },
      }, [
        this.$createElement('div', {
          class: 'w-full flex items-center py-1 px-sm',
          style: { 'min-height': this.solo ? '2rem' : '2.5rem' },
        }, [
          this.$createElement('div', { class: 'flex-grow' }, this.warnText || this.errorText),
          this.hasWarn ? this.$createElement('div', {
            class: 'flex items-center',
          }, [
            this.$createElement('i', {
              class: [
                'icon-close text-gray-200 hover:text-gray-300 cursor-pointer',
                this.solo ? 'text-lg' : 'text-xl',
              ],
              on: {
                click: () => {
                  this.clearWarn()
                },
              },
            }),
          ]) : null,
        ]),
      ])])
    },

    genLabel () {
      if (this.$slots.label) return this.$slots.label
      if (this.singleLine || this.solo || !this.label) return null
      return this.$createElement('label', {
        ref: 'label',
        class: 'pt-2 py-1 overflow-hidden text-overflow-ellipsis',
        on: {
          mouseenter: () => {
            const target = this.$refs.label
            const child = this.$refs.label.firstChild
            const spanWidth = Math.round(child.getBoundingClientRect().width)
            const parentWidth = target.clientWidth
            if (spanWidth > parentWidth) {
              target.style.overflow = 'visible'
              child.style.backgroundColor = this.backgroundColor
              child.style.zIndex = '1'
            }
          },
          mouseleave: () => {
            const target = this.$refs.label
            const child = this.$refs.label.firstChild
            const spanWidth = child.getBoundingClientRect().width
            const parentWidth = target.clientWidth
            if (spanWidth > parentWidth) {
              target.style.overflow = 'hidden'
              child.style.backgroundColor = 'unset'
              child.style.zIndex = 'unset'
            }
          },
        },
      }, [this.$createElement('span', {
        class: 'text-base text-gray-100 whitespace-no-wrap leading-5 relative pointer-events-none py-xs pr-xs',
      }, this.label)])
    },

    genInput () {
      const listeners = Object.assign({}, this.$listeners)
      delete listeners['change'] // Change should not be bound externally
      return this.$createElement('input', {
        ref: 'input',
        domProps: {
          value: this.lazyValue,
        },
        attrs: {
          ...this.$attrs,
          autofocus: this.autofocus,
          disabled: this.disabled,
          id: this.computedId,
          placeholder: this.compPlaceholder,
          readonly: this.readonly,
          type: this.type,
          required: this.required,
          name: this.name,
          minlength: this.minlength,
          maxlength: this.maxlength,
        },
        class: this.computedInputClass,
        on: Object.assign(listeners, {
          input: this.onInput,
          change: this.onChange,
          keydown: this.onKeyDown,
          focus: this.onFocus,
          blur: this.onBlur,
        }),
      })
    },

    genContent () {
      const children = []
      const data = {
        ref: 'content',
        class: this.computedContentClass,
        on: {
          click: () => {
            if (this.hasFocus || this.disabled || !this.$refs.input) return
            this.focus()
          },
        },
      }
      const slotClass = [
        'w-10 flex items-center justify-center select-none',
        this.disabled ? 'text-gray-600' : this.solo ? 'text-gray-300' : 'text-gray-200',
        this.solo ? 'text-xl' : 'text-2xl',
      ]
      if (this.$slots.prepend) {
        const prepend = this.$createElement('div', {
          class: slotClass,
        }, this.$slots.prepend)
        children.push(prepend)
      }
      children.push(this.genInput())
      if (this.$slots.append) {
        const append = this.$createElement('div', {
          class: slotClass,
        }, this.$slots.append)
        children.push(append)
      }
      return this.$createElement('div', data, children)
    },
  },
  render (h) {
    const children = [
      this.genLabel(),
      // container for alert popup
      h('div', { ref: 'alert' }),
      this.genContent(),
      this.genWarnMenu(),
    ]
    const data = {
      class: 'flex flex-col relative',
    }
    return h('div', data, children)
  },
}