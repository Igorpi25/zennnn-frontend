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
import { GET_PROFILE_CLIENT, GET_IS_LOGGED_IN } from './graphql/queries'

export default {
  name: 'app',
  metaInfo () {
    return {
      htmlAttrs: {
        lang: this.$i18n.locale,
      },
    }
  },
  apollo: {
    isLoggedIn: {
      query: GET_IS_LOGGED_IN,
    },
    getProfile: {
      query: GET_PROFILE_CLIENT,
      skip () {
        return !this.isLoggedIn
      },
    },
  },
  methods: {
    logout () {
      this.$apollo.provider.defaultClient.store.reset()
      this.$Auth.signOut()
      this.$router.push({ name: 'signin' })
    },
  },
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

[contenteditable=true] {
  width: 26px;
}
[contenteditable=true]:empty::before {
  content: attr(placeholder);
}

/* Loading spinner */

.spinner {
  display: inline-flex;
  vertical-align: middle;
  width: 20px;
}
.lds-spinner {
  display: inline-block;
  position: relative;
  width: 18px;
  height: 18px;
}
.lds-spinner div {
  transform-origin: 9px 9px;
  animation: lds-spinner 1.2s linear infinite;
}
.lds-spinner div:after {
  content: " ";
  display: block;
  position: absolute;
  top: 1px;
  left: 8px;
  width: 1px;
  height: 4px;
  border-radius: 20%;
  background: #272727;
}
.lds-spinner div:nth-child(1) {
  transform: rotate(0deg);
  animation-delay: -1.1s;
}
.lds-spinner div:nth-child(2) {
  transform: rotate(30deg);
  animation-delay: -1s;
}
.lds-spinner div:nth-child(3) {
  transform: rotate(60deg);
  animation-delay: -0.9s;
}
.lds-spinner div:nth-child(4) {
  transform: rotate(90deg);
  animation-delay: -0.8s;
}
.lds-spinner div:nth-child(5) {
  transform: rotate(120deg);
  animation-delay: -0.7s;
}
.lds-spinner div:nth-child(6) {
  transform: rotate(150deg);
  animation-delay: -0.6s;
}
.lds-spinner div:nth-child(7) {
  transform: rotate(180deg);
  animation-delay: -0.5s;
}
.lds-spinner div:nth-child(8) {
  transform: rotate(210deg);
  animation-delay: -0.4s;
}
.lds-spinner div:nth-child(9) {
  transform: rotate(240deg);
  animation-delay: -0.3s;
}
.lds-spinner div:nth-child(10) {
  transform: rotate(270deg);
  animation-delay: -0.2s;
}
.lds-spinner div:nth-child(11) {
  transform: rotate(300deg);
  animation-delay: -0.1s;
}
.lds-spinner div:nth-child(12) {
  transform: rotate(330deg);
  animation-delay: 0s;
}
@keyframes lds-spinner {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
