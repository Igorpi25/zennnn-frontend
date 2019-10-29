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
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails
} from 'amazon-cognito-identity-js'
import { GET_PROFILE_CLIENT, LOGIN } from '../schema'

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
          const response = await this.signIn()
          console.log('Sign In', response)
          this.$router.push({ name: 'home' })
        }
      } catch (error) {
        this.errorMessages.push(error)
        throw new Error(error)
      }
    },
    signIn () {
      const authenticationData = {
        Username: this.email,
        Password: this.password,
      }
      const authenticationDetails = new AuthenticationDetails(
        authenticationData
      )
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
        cognitoUser.authenticateUser(authenticationDetails, {
          onSuccess: (result) => {
            const idToken = result.getIdToken().getJwtToken()
            localStorage.setItem('token', idToken)
            const data = {
              isLoggedIn: true
            }
            this.$apollo.provider.defaultClient.cache.writeData({ data })
            this.$apollo.mutate({
              mutation: LOGIN
            }).then(result => {
              console.log('User', result)
              if (result && result.data && result.data.login) {
                this.$apollo.provider.defaultClient.cache.writeQuery({
                  query: GET_PROFILE_CLIENT,
                  data: {
                    getProfile: result.data.login
                  }
                })
              }
            }).catch(error => {
              console.log('Error', error)
            })
            resolve(result)
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
