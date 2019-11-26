export default {
  data () {
    return {
      hasError: false,
      errorText: '',
    }
  },
  methods: {
    checkField (e) {
      if (this.form) {
        if (!this.form.wasValidated) return
        this.validate(e.target)
      }
    },
    validate (el) {
      let errorsCount = 0
      const element = el || this.$refs.input
      if (element.willValidate === true && !element.validity.valid) {
        this.setError(element.validationMessage)
        errorsCount++
      } else if (this.rules && this.rules.length > 0) {
        for (let rule of this.rules) {
          const result = rule(this.internalValue)
          if (result !== true) {
            errorsCount++
            this.setError(result)
            break
          }
        }
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