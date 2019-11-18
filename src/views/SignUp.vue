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
        v-model="firstName"
        type="text"
        placeholder="First name"
        required
      >
      <input
        v-model="lastName"
        type="text"
        placeholder="Last name"
        required
      >
      <input
        v-model="email"
        type="email"
        placeholder="Email"
        required
      >
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        minlength="8"
        required
      >
      <button type="submit">
        Register
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
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    }
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
          const attrs = {
            family_name: this.lastName,
            given_name: this.firstName,
            email: this.email,
          }
          await this.signUp(this.email, this.password, attrs)
          this.successMessage = 'Register success. Follow the link in the email.'
        }
      } catch (error) {
        this.errorMessages.push(error)
        throw new Error(error)
      }
    },
  },
}
</script>
