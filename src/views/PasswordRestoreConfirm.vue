<template>
  <div>
    <form
      ref="form"
      :class="[
        'form',
        { 'was-validated': wasValidated }
      ]"
      @submit.prevent.stop="submit"
    >
      <div v-if="successMessage">
        {{ successMessage }}
      </div>
      <div v-if="errorMessages.length > 0">
        <div
          v-for="(err, i) in errorMessages"
          :key="i"
          class="error"
        >
          {{ err.message || err }}
        </div>
      </div>
      <input
        v-model="code"
        type="text"
        placeholder="Code"
        minlength="6"
        required
      >
      <input
        v-model="password"
        type="password"
        placeholder="New password"
        minlength="8"
        required
      >
      <button type="submit">
        Restore password
      </button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'SignUp',
  data () {
    return {
      wasValidated: false,
      errorMessages: [],
      successMessage: '',
      email: '',
      password: '',
      code: '',
    }
  },
  mounted () {
    this.code = this.$route.query.code
    this.email = this.$route.query.username
  },
  methods: {
    setErrorMessages () {
      this.errorMessages = []
      const elements = this.$refs.form.elements
      for (let element of elements) {
        if (element.willValidate === true && !element.validity.valid) {
          this.errorMessages.push(element.validationMessage || '')
        }
      }
    },
    async submit () {
      try {
        this.wasValidated = true
        if (this.$refs.form.checkValidity() === false) {
          this.setErrorMessages()
        } else {
          this.successMessage = ''
          this.errorMessages = []
          await this.$Auth.forgotPasswordConfirm(this.email, this.code, this.password)
          this.successMessage = 'Password restored.'
        }
      } catch (error) {
        this.errorMessages.push(error)
        throw new Error(error)
      }
    },
  },
}
</script>
