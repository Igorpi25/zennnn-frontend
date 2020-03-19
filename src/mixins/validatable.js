export default {
  data () {
    return {
      shouldValidate: false,
      hasError: null,
      errorText: '',
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
    reset () {
      this.internalValue = ''
      this.clearError()
    },
    setError (errorMessage) {
      this.errorText = errorMessage
      this.hasError = true
    },
    clearError () {
      this.errorText = ''
      this.hasError = false
    },
  },
}
