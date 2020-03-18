<template>
  <form
    ref="form"
    :class="['form', {
      'was-validated': wasValidated,
      'form--rounded': rounded,
      'form--shadow': shadow
    }]"
    @submit.prevent.stop
  >
    <div class="form-content">
      <div
        v-if="header"
        :class="['form-header', headerClass]"
      >
        <div class="mr-2">
          <div v-if="headerIcon=='circle'">
            <i>
              <img src="@/assets/icons/circle-zennnn.svg">
            </i>
          </div>
          <div v-if="headerIcon=='dots'">
            <i>
              <img src="@/assets/icons/circle-dots.svg">
            </i>
          </div>
        </div>
        <div class="leading-normal">{{ title }}</div>
      </div>
      <slot name="alert" />
      <Alert
        :value="error"
        :text="errorMessage"
        color="red"
        close
        @input="$emit('update:error-message', '')"
      />
      <div :class="['form-body', bodyClass]">
        <slot />
      </div>
    </div>
    <div v-if="$slots.append" :class="['form-append', appendClass]">
      <slot name="append" />
    </div>
  </form>
</template>

<script>
export default {
  name: 'Form',
  provide () {
    return {
      form: this,
    }
  },
  props: {
    title: {
      type: String,
      default: '',
    },
    headerIcon: {
      type: String,
      default: '',
    },
    header: {
      type: Boolean,
      default: false,
    },
    headerClass: {
      type: [String, Object, Array],
      default: '',
    },
    bodyClass: {
      type: [String, Object, Array],
      default: '',
    },
    appendClass: {
      type: [String, Object, Array],
      default: '',
    },
    rounded: {
      type: Boolean,
      default: false,
    },
    shadow: {
      type: Boolean,
      default: false,
    },
    errorMessage: {
      type: String,
      default: '',
    },
    lazyValidation: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      inputs: [],
      watchers: [],
      errorBag: {},
      wasValidated: false,
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
          if (this.errorBag.hasOwnProperty(input._uid)) return

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
      this.wasValidated = true
      let result = 0
      this.inputs.forEach(input => {
        const errorsCount = input.validate()
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
}
</script>
