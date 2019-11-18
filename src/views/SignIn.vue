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
        Login
      </button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'SignIn',
  data () {
    return {
      wasValidated: false,
      errorMessages: [],
      email: '',
      password: ''
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
          this.errorMessages = []
          const response = await this.$Auth.signIn(this.email, this.password)
          console.log('Sign In', response)
          const route = this.$route.query.redirect
            ? this.$route.query.redirect : { name: 'home' }
          this.$router.push(route)
        }
      } catch (error) {
        this.errorMessages.push(error)
        throw new Error(error)
      }
    }
  }
}
</script>
