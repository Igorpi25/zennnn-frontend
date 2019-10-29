<template>
  <div id="app">
    <div id="nav">
      <a
        v-if="isLoggedIn"
        href="#"
        @click.prevent="logout"
      >Log out</a>
      <template v-else>
        <router-link to="/signin">Sign In</router-link> |
        <router-link to="/signup">Sign Up</router-link> |
        <router-link to="/password-restore">Password restore</router-link>
      </template>
    </div>
    <router-view/>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import { apolloClient } from './main'

export default {
  name: 'app',
  apollo: {
    isLoggedIn: {
      query: gql`
        query IsLoggedIn {
          isLoggedIn @client
        }
      `
    }
  },
  methods: {
    logout () {
      localStorage.removeItem('token')
      apolloClient.store.reset()
      this.$router.push({ name: 'signin' })
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

#nav {
  padding: 12px;
}

.form {
  max-width: 320px;
  margin-left: auto;
  margin-right: auto;
}
.form .error {
  color: red;
}
.form > input {
  width: 100%;
}
.form > button {
  font-size: 16px;
  margin-top: 12px;
  margin-bottom: 12px;
  margin-left: auto;
  margin-right: auto;
}
</style>
