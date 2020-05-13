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
    label: {
      type: String,
      default: '',
    },
    labelNoWrap: Boolean,
    labelHint: String,
    // props 'right' renamed to 'text-align'
    // TODO: remove prop use 'input-class' instead
    alignRight: Boolean,
    clearable: Boolean,
    singleLine: Boolean,
    solo: Boolean,
    number: Boolean,
    // integer, decimal, currency, fixed
    // 'formatStyle' renamed to 'numberFormat'
    numberFormat: {
      type: String,
      default: 'decimal',
    },
    type: {
      type: String,
      default: 'text',
    },
    id: String,
    name: String,
    required: Boolean,
    readonly: Boolean,
    disabled: Boolean,
    minlength: String,
    maxlength: String,
    autofocus: Boolean,
    placeholder: String,
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
    // preferably validation icon
    adlib: Boolean,
    stateIcon: Boolean,
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
    inputmode () {
      if (this.number) {
        return this.numberFormat === 'integer' ? 'numeric' : 'decimal'
      }
      return 'text'
    },
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
      const isFixed = this.numberFormat === 'currency' || this.numberFormat === 'fixed'
      // precision numbers digits must be between 0 and 20
      const precision = this.numberFormat === 'integer'
        ? 0 : isFixed
          ? 2 : 20
      return {
        precision,
        thousand: this.editMode ? '' : this.computedFormatOptions.thousand,
        decimal: this.computedFormatOptions.decimal,
        fixed: !this.editMode && isFixed,
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
        this.disabled ? 'text-gray-200 cursor-not-allowed' : this.solo ? 'text-blue-500' : 'text-white',
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
      const genericClasses = ['placeholder-gray-200']
      if (this.disabled) {
        genericClasses.push('cursor-not-allowed')
      }
      if (this.number || this.alignRight) {
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

    onBlur (e) {
      this.wasBlurred = true
      if (this.validateOnBlur) {
        this.checkField(e)
      }
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
        value: (this.hasWarn || this.hasError) && this.hasFocus,
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

    genLabelHint () {
      if (!this.labelHint) return null
      return this.$createElement('v-tooltip', {
        props: {
          top: true,
          maxWidth: 285,
          nudgeBottom: 5,
          nudgeRight: 104,
        },
        scopedSlots: {
          activator: props => {
            return this.$createElement('i', {
              class: 'ml-1 icon-add text-base text-blue-500 hover:text-blue-600 cursor-pointer',
              on: props.on,
            })
          },
        },
      }, this.labelHint)
    },

    genLabel () {
      if (this.$slots.label) return this.$slots.label
      if (this.singleLine || this.solo || !this.label) return null
      const props = {
        ref: 'label-content',
        class: [
          'leading-5 py-2',
          { 'overflow-hidden text-overflow-ellipsis': !this.labelNoWrap },
        ],
      }
      if (!this.labelNoWrap) {
        props.on = {
          mouseenter: () => {
            const target = this.$refs['label-content']
            const child = this.$refs['label-content'].firstChild
            const spanWidth = Math.round(child.getBoundingClientRect().width)
            const parentWidth = this.$refs['label'].clientWidth
            if (spanWidth > parentWidth) {
              target.style.overflow = 'visible'
              child.style.backgroundColor = this.backgroundColor
              child.style.zIndex = '1'
            }
          },
          mouseleave: () => {
            const target = this.$refs['label-content']
            const child = this.$refs['label-content'].firstChild
            const spanWidth = child.getBoundingClientRect().width
            const parentWidth = this.$refs['label'].clientWidth
            if (spanWidth > parentWidth) {
              target.style.overflow = 'hidden'
              child.style.backgroundColor = 'unset'
              child.style.zIndex = 'unset'
            }
          },
        }
      }
      const content = this.$createElement('div', props, [this.$createElement('span', {
        class: 'text-base text-gray-100 whitespace-no-wrap relative pointer-events-none py-xs pr-xs',
      }, this.label)])
      return this.$createElement('label', {
        ref: 'label',
        class: 'flex items-center',
      }, [content, this.genLabelHint()])
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
          inputmode: this.inputmode,
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

    genStateIndicator () {
      const svg = []
      const color = this.adlib && !this.internalValue
        ? 'text-yellow-500'
        : !this.hasError && !this.hasWarn && this.shouldValidate
          ? 'text-green-500' : 'text-pink-500'
      const isValid = color === 'text-green-500'
      const svgData = {
        class: color,
        attrs: {
          xmlns: 'http://www.w3.org/2000/svg',
          fill: 'none',
          width: isValid ? 11 : 8,
          height: isValid ? 9 : 8,
          viewBox: isValid ? '0 0 11 9' : '0 0 8 8',
        },
      }
      if (isValid) {
        svg.push(this.$createElement('svg', svgData, [this.$createElement('path', {
          attrs: {
            d: 'M1.41421 1L6.07107 5.65685L4.65685 7.07107L0 2.41421L1.41421 1Z M10.3137 1.41421L4.65685 7.07107L3.24264 5.65685L8.8995 0L10.3137 1.41421Z',
            fill: 'currentColor',
          },
        })]))
      } else {
        svg.push(this.$createElement('svg', svgData, [this.$createElement('circle', {
          attrs: {
            cx: 4,
            cy: 4,
            r: 4,
            fill: 'currentColor',
          },
        })]))
      }
      return this.$createElement('div', {
        class: 'px-1 flex items-center flex-shrink-0',
      }, svg)
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
        'w-10 flex items-center flex-shrink-0 justify-center select-none',
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
      if (this.required || this.adlib) {
        children.push(this.genStateIndicator())
      } else if (this.stateIcon && this.wasBlurred) {
        children.push(this.genStateIndicator())
      }
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
      class: [
        'flex flex-col relative',
        { 'opacity-40': this.disabled },
      ],
    }
    return h('div', data, children)
  },
}
