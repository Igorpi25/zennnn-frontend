export default {
  props: {
    rules: Array,
    patterns: Array,
  },
  data () {
    return {
      shouldValidate: false,
      hasError: null,
      errorText: '',
      hasWarn: null,
      warnText: '',
    }
  },
  watch: {
    'form.wasValidated': {
      handler () {
        this.shouldValidate = true
      },
    },
  },
  mounted () {
    const form = this.form || {}
    if (!form.lazyValidation && this.value) {
      this.shouldValidate = true
      this.validate()
    }
  },
  methods: {
    checkField (e) {
      this.shouldValidate = true
      if (this.form && this.form.lazyValidation && !this.form.wasValidated) return
      this.validate(e.target)
    },
    validate (el) {
      let errorsCount = 0
      const element = el || this.$refs.input
      if (this.rules && this.rules.length > 0) {
        for (let rule of this.rules) {
          const result = rule(this.internalValue)
          if (result !== true) {
            errorsCount++
            this.setError(result)
            break
          }
        }
      } else if (element.willValidate === true && !element.validity.valid) {
        this.setError(element.validationMessage)
        errorsCount++
      }
      if (errorsCount === 0) {
        this.clearError()
      }
      return errorsCount
    },
    validatePatterns (value) {
      let warnsCount = 0
      if (this.patterns && this.patterns.length > 0) {
        for (let rule of this.patterns) {
          const result = rule(value)
          if (result !== true) {
            warnsCount++
            this.setWarn(result)
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
