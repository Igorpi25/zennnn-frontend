<template>
  <div id="app">
    <div id="nav">
      <template v-if="isLoggedIn">
        {{ getProfile }}
        <a
          href="#"
          @click.prevent="logout"
        >Log out</a>
      </template>
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
import { apolloClient } from './main'
import { GET_PROFILE_CLIENT, GET_IS_LOGGED_IN } from './schema'

export default {
  name: 'app',
  apollo: {
    isLoggedIn: {
      query: GET_IS_LOGGED_IN
    },
    getProfile: {
      query: GET_PROFILE_CLIENT,
      skip () {
        return !this.isLoggedIn
      }
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
