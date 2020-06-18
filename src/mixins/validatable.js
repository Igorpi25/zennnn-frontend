export default {
  inject: {
    form: {
      default: null,
    },
  },
  props: {
    rules: Array,
    patterns: Array,
    validateOnBlur: Boolean,
    lazyValidation: Boolean,
    hideWarn: Boolean,
  },
  data () {
    return {
      badInput: null,
      hasInput: false,
      hasFocused: false,
      hasError: null,
      errorText: '',
      hasWarn: null,
      warnText: '',
      valid: false,
    }
  },
  computed: {
    shouldValidate () {
      if (this.hasError || this.hasWarn) return true
      return (this.hasInput || this.hasFocused)
    },
  },
  watch: {
    internalValue () {
      this.hasInput = true
      if (!(this.validateOnBlur && !this.hasFocused)) {
        this.$nextTick(this.validate)
      }
    },
    hasFocus (val) {
      if (
        !val &&
        !this.disabled
      ) {
        this.hasFocused = true
        this.$nextTick(this.validate)
      }
    },
  },
  beforeMount () {
    this.validateOnBlur || this.lazyValidation || this.validate()
  },
  created () {
    this.form && this.form.register(this)
  },
  beforeDestroy () {
    this.form && this.form.unregister(this)
  },
  methods: {
    validate (force = false, value) {
      // TODO: prevent validation on not has input and lazyValidation
      if (!force && !this.hasInput) return
      if (force) this.hasInput = this.hasFocused = true
      value = value || this.internalValue
      let errorsCount = 0
      if (this.rules && this.rules.length > 0) {
        for (const rule of this.rules) {
          const result = rule(value)
          if (result !== true) {
            errorsCount++
            this.setError(result)
            break
          }
        }
      }
      this.valid = errorsCount === 0
      if (this.rules && this.valid) {
        this.clearError()
      }
      return errorsCount
    },
    validatePatterns (value) {
      let warnsCount = 0
      if (this.patterns && this.patterns.length > 0) {
        for (const rule of this.patterns) {
          const result = rule(value)
          if (result !== true) {
            warnsCount++
            if (!this.hideWarn) {
              this.setWarn(result)
            }
            break
          }
        }
      }
      if (warnsCount === 0) {
        this.clearWarn()
      }
      return warnsCount
    },
    reset () {
      this.internalValue = ''
      this.clearError()
      this.clearWarn()
      if (this.validateOnBlur) {
        this.hasFocused = false
        this.valid = false
      }
    },
    resetValidation () {
      this.clearError()
      this.clearWarn()
    },
    setError (msg) {
      this.errorText = msg
      this.hasError = true
    },
    clearError () {
      this.errorText = ''
      this.hasError = false
    },
    setWarn (msg) {
      this.warnText = msg
      this.hasWarn = true
    },
    clearWarn () {
      this.warnText = ''
      this.hasWarn = false
    },
  },
}
