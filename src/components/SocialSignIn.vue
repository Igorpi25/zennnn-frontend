<template>
  <div class="social-sign-in">
    <!-- <a
      href="#"
      class="social-sign-in__icon social-sign-in__icon--google"
      :class="{ disabled: googleLoading }"
      @click.prevent="googleSignIn"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
        <path
          d="M20,0A20,20,0,1,0,40,20,20,20,0,0,0,20,0ZM30.72,22.29A11,11,0,0,1,10.34,25.2h0A11,11,0,0,1,27,11.56l-3.55,2.91a6.52,6.52,0,0,0-9.61,3.41h0a6.54,6.54,0,0,0,.06,4.41h0a6.52,6.52,0,0,0,9.4,3.34h0a6.53,6.53,0,0,0,2.81-3.34H20.24V18H30.77A11,11,0,0,1,30.72,22.29Z"
          class="fill-current"
        />
      </svg>
    </a> -->
    <!-- <a
      href="#"
      class="social-sign-in__icon"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
        <g><g><path fill="#245be7" d="M17.063 19.92h-2.381v-3.715h2.286V13.92c0-3.048 1.238-4.857 4.857-4.857h3.047v3.713h-1.904c-1.43 0-1.524.573-1.524 1.525v1.904h3.428l-.38 3.715h-2.953v10.856h-4.476zm2.857 20c11.048 0 20-8.952 20-20s-8.952-20-20-20-20 8.952-20 20 8.952 20 20 20z"/></g></g>
      </svg>
    </a>
    <a href="#" class="social-sign-in__icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
        <g><g><path fill="#5c85ed" d="M39.92 19.92c0 11.048-8.952 20-20 20s-20-8.952-20-20 8.952-20 20-20 20 8.952 20 20zm-19.238 8.762s.476-.096.762-.286c.19-.285.19-.666.19-.666s0-2.096.952-2.38c.953-.287 2.191 2 3.524 2.951.953.667 1.715.571 1.715.571l3.523-.095s1.81-.095.953-1.524c-.095-.094-.476-1.048-2.572-3.048-2.19-2-1.904-1.713.762-5.237 1.619-2.19 2.286-3.429 2.095-4-.19-.572-1.333-.382-1.333-.382h-3.905s-.285 0-.476.096c-.19.095-.381.381-.381.381s-.666 1.62-1.428 3.048c-1.715 2.952-2.477 3.142-2.762 2.952-.667-.477-.476-1.714-.476-2.667 0-2.857.476-4.095-.857-4.38-.477-.096-.762-.19-1.81-.19-1.429 0-2.572 0-3.238.38-.476.19-.762.666-.572.762.286 0 .858.191 1.143.571.381.572.381 1.81.381 1.81s.191 3.428-.571 3.81c-.572.285-1.238-.287-2.857-3.048a48.953 48.953 0 0 1-1.429-2.952s-.095-.287-.286-.477c-.285-.19-.571-.286-.571-.286H7.444s-.572 0-.762.286c-.191.19 0 .667 0 .667s2.952 6.856 6.286 10.381c2.761 3.142 6.19 2.952 6.19 2.952z"/></g></g>
      </svg>
    </a>
    <a href="#" class="social-sign-in__icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="41" height="40" viewBox="0 0 41 40">
        <g><g><path fill="#63bee9" d="M23.25 12.11c.665-.19 1.713-.286 2.285-.19.19.095.762.381 1.142.666l.667.477.762-.287c.381-.094.953-.38 1.238-.475.286-.19.476-.19.476-.19 0 .285-.476 1.047-.952 1.523-.57.667-.38.667.762.286.667-.286.667-.286.571 0-.095.095-.476.571-.952 1.048-.857.762-.857.856-.857 1.523 0 .952-.477 3.048-.953 4.191-.857 2.19-2.762 4.381-4.666 5.523-2.667 1.525-6.19 2-9.143 1.048-.953-.285-2.667-1.143-2.667-1.238 0 0 .476-.095 1.143-.095 1.238 0 2.571-.38 3.714-1.048l.762-.476-.857-.286c-1.143-.38-2.286-1.334-2.57-2.286-.096-.285 0-.285.76-.285h.858l-.667-.286c-.762-.38-1.524-1.143-1.905-1.81-.286-.475-.57-1.809-.476-1.904 0 0 .286.095.667.191 1.047.38 1.143.285.571-.287-1.048-1.047-1.333-2.667-.857-4.19l.095-.667.953.953c1.905 1.81 4.095 2.952 6.666 3.237l.667.096v-.667c-.095-1.809 1.048-3.429 2.762-4.095zm-2.763 27.81c11.048 0 20-8.952 20-20s-8.952-20-20-20-20 8.952-20 20 8.952 20 20 20z"/></g></g>
      </svg>
    </a> -->
    <!-- TODO menu in dropdown -->
    <!-- <router-link :to="{ name: 'signin-by-phone' }" class="social-sign-in__icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="41" height="40" viewBox="0 0 41 40">
        <g><g><path fill="#fff" d="M39.228 19.92c0 10.477-8.523 19-19 19s-19-8.523-19-19 8.523-19 19-19 19 8.523 19 19zm-39 0c0 11.045 8.955 20 20 20 11.046 0 20-8.955 20-20 0-11.046-8.954-20-20-20-11.045 0-20 8.954-20 20z"/></g><g><path fill="#fff" d="M15.978 19.92a1.75 1.75 0 1 1-3.5 0 1.75 1.75 0 0 1 3.5 0z" /></g><g><path fill="#fff" d="M21.978 19.92a1.75 1.75 0 1 1-3.5 0 1.75 1.75 0 0 1 3.5 0z"/></g><g><path fill="#fff" d="M27.978 19.92a1.75 1.75 0 1 1-3.5 0 1.75 1.75 0 0 1 3.5 0z"/></g></g>
      </svg>
    </router-link> -->
  </div>
</template>

<script>
export default {
  name: 'SocialSignIn',
  data () {
    return {
      googleLoading: false,
      googleWindowTimer: null,
      googleWindowTimerDelay: 500,
    }
  },
  methods: {
    async googleSignIn () {
      try {
        this.googleLoading = true
        // TODO
        // not implemented
        const credentials = await this.$Auth.federatedSignIn({ provider: 'Google' })
        // eslint-disable-next-line
        console.log(credentials)
      } catch (error) {
        this.googleLoading = false
        this.errorMessage = error.message || error
        throw new Error(error)
      }
    },
    openGoogleSignIn () {
      this.clearGoogleWindowTimer()
      const features = 'width=600,height=660,menubar=no,toolbar=no,status=noe,resizable=no,scrollbars=no'
      this.googleWindow = window.open('/start-google-signin', 'GoogleSignin', features)
      window.addEventListener('googlesignin', this.onGoogleSignInFinish, false)
      this.googleWindowTimer = setInterval(this.checkGoogleWindow, this.googleWindowTimerDelay)
    },
    checkGoogleWindow () {
      if (this.googleWindow && this.googleWindow.closed) {
        this.clearGoogleWindowTimer()
        window.removeEventListener('googlesignin', this.onGoogleSignInFinish, false)
        this.$notify({
          color: 'error',
          text: this.$t('message.authByGoogleError'),
        })
      }
    },
    onGoogleSignInFinish (e) {
      this.$notify({
        color: 'primary',
        text: this.$t('message.authByGoogle'),
        close: false,
        name: 'social-signin-info',
      })
      // eslint-disable-next-line
      console.log('CODE', e.detail)
      // TODO temporary
      // if (this.googleWindow && !this.googleWindow.closed) {
      //   this.clearGoogleWindowTimer()
      //   this.googleWindow.close()
      // }
      window.removeEventListener('googlesignin', this.onGoogleSignInFinish, false)
    },
    async refreshToken () {
      try {
        // TODO
        // not implemented
        const cognitoUser = await this.$Auth.currentAuthenticatedUser()
        const currentSession = await this.$Auth.currentSession()
        cognitoUser.refreshSession(currentSession.refreshToken, (err, session) => {
          // eslint-disable-next-line
          console.log('session', err, session)
          // const { idToken, refreshToken, accessToken } = session
          // eslint-disable-next-line
          console.log('SESSION', session)
        })
      } catch (e) {
        // eslint-disable-next-line
        console.log('Unable to refresh Token', e)
      }
    },
    clearGoogleWindowTimer () {
      clearInterval(this.googleWindowTimer)
      this.googleWindowTimer = null
    },
  },
}
</script>

<style scoped>
.social-sign-in {
  display: flex;
}
.social-sign-in__icon:not(:last-child) {
  margin-right: 14px;
}
.social-sign-in__icon--google {
  color: #f14336;
}
a.disabled.social-sign-in__icon {
  pointer-events: none;
  cursor: not-allowed;
}
a.disabled.social-sign-in__icon svg {
  color: #777777;
}
.social-sign-in__icon svg {
  color: currentColor;
}
</style>
