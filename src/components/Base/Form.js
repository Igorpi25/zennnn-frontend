export default {
  name: 'Form',
  provide () {
    return {
      form: this,
    }
  },
  props: {
    title: String,
    errorMessage: String,
    lazyValidation: Boolean,
  },
  data () {
    return {
      inputs: [],
      watchers: [],
      errorBag: {},
      error: false,
    }
  },
  computed: {
    form () {
      return this.$refs.form
    },
  },
  watch: {
    errorBag: {
      handler (val) {
        const errors = Object.values(val).includes(true)

        this.$emit('input', errors)
      },
      deep: true,
      immediate: true,
    },
    errorMessage: {
      handler (val) {
        this.error = !!val
      },
      immediate: true,
    },
  },
  methods: {
    watchInput (input) {
      const watcher = (input) => {
        return input.$watch('hasError', (val) => {
          const v = val === null ? true : val
          this.$set(this.errorBag, input._uid, v)
        }, { immediate: true })
      }

      const watchers = {
        _uid: input._uid,
        valid: () => {},
        shouldValidate: () => {},
      }

      if (this.lazyValidation) {
        // Only start watching inputs if we need to
        watchers.shouldValidate = input.$watch('shouldValidate', (val) => {
          if (!val) return

          // Only watch if we're not already doing it
          if (Object.prototype.hasOwnProperty.call(this.errorBag, input._uid)) return

          watchers.valid = watcher(input)
        })
      } else {
        watchers.valid = watcher(input)
      }

      return watchers
    },
    register (input) {
      this.inputs.push(input)
      this.watchers.push(this.watchInput(input))
    },
    unregister (input) {
      const found = this.inputs.find(i => i._uid === input._uid)

      if (!found) return

      const unwatch = this.watchers.find(i => i._uid === found._uid)
      if (unwatch) {
        unwatch.valid()
        unwatch.shouldValidate()
      }

      this.watchers = this.watchers.filter(i => i._uid !== found._uid)
      this.inputs = this.inputs.filter(i => i._uid !== found._uid)
      this.$delete(this.errorBag, found._uid)
    },
    validate () {
      let result = 0
      this.inputs.forEach(input => {
        const errorsCount = input.validate(true)
        result = result + errorsCount
      })
      return result === 0
    },
    reset () {
      this.inputs.forEach(input => {
        input.reset()
      })
      this.form.reset()
      this.resetErrorBag()
    },
    resetErrorBag () {
      // Account for timeout in validatable
      setTimeout(() => {
        this.errorBag = {}
      }, 0)
    },
  },
  render (h) {
    return h('form', {
      ref: 'form',
      on: {
        submit (e) {
          e.preventDefault()
          e.stopPropagation()
        },
      },
    }, this.$slots.default)
  },
}
