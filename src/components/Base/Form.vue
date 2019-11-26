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
  },
  data () {
    return {
      inputs: [],
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
    errorMessage: {
      handler (val) {
        this.error = !!val
      },
      immediate: true,
    },
  },
  methods: {
    register (input) {
      this.inputs.push(input)
    },
    unregister (input) {
      const index = this.inputs.indexOf(input)
      this.inputs.splice(index, 1)
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
    },
  },
}
</script>
