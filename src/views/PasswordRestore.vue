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
        v-model="email"
        type="email"
        placeholder="Email"
        required
      >
      <button type="submit">
        Get link
      </button>
    </form>
  </div>
</template>

<script>
import {
  CognitoUserPool,
  CognitoUser
} from 'amazon-cognito-identity-js'

export default {
  name: 'SignUp',
  data () {
    return {
      wasValidated: false,
      errorMessages: [],
      successMessage: '',
      email: ''
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
          const response = await this.forgotPassword()
          this.successMessage = 'Password restore link send in the email.'
          console.log('Forgot password', response)
        }
      } catch (error) {
        this.errorMessages.push(error)
        throw new Error(error)
      }
    },
    forgotPassword () {
      const userPoolData = {
        UserPoolId: 'ap-northeast-1_NEJZeLMhQ',
        ClientId: '1nmop1fsfqa28cvapbgd1rffqo'
      }
      const userPool = new CognitoUserPool(userPoolData)
      const userData = {
        Username: this.email,
        Pool: userPool,
      }
      const cognitoUser = new CognitoUser(userData)
      return new Promise((resolve, reject) => {
        cognitoUser.forgotPassword({
          onSuccess: (data) => {
            console.log('CodeDeliveryData from forgotPassword: ' + data)
            resolve(data)
          },

          onFailure: (err) => {
            reject(err)
          },
        })
      })
    }
  }
}
</script>
