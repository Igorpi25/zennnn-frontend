<template>
  <div class="content">
    <StatusBar></StatusBar>
    <section>
      <div class="container">
        <Button
          outline
          secondary
          class="mb-5 mt-8 mx-auto md:mx-0 md:ml-auto"
          @click="$router.push({name: 'signup'})"
        >
          <template v-slot:text>
            <span>{{ $t('signin.noAccount') }}</span>
          </template>
          <span>{{ $t('action.register') }}</span>
        </Button>
        <div class="mb-8">
          <div class="w-full">
            <h1 class="headline">
              <span>{{ $t('signin.welcome') }}</span>
              <span>{{ $t('signin.welcomeMiddle') }}&nbsp;
                <span class="block sm:inline">{{ $t('signin.welcomeContent') }}</span>
              </span>
            </h1>
            <Form
              ref="form"
              rounded
              shadow
              class="form--max-w-md"
              body-class="px-0 md:p-8 pt-8 py-1 md:py-8"
              append-class="flex-col sm:flex-row items-center"
              :error-message.sync="errorMessage"
            >
              <template v-slot:alert>
                <Alert
                  :value="!!infoMessage"
                  :text="infoMessage"
                  color="primary"
                />
              </template>
              <div class="w-full sm:w-1/2 sm:pr-2">
                <TextField
                  v-model="formModel.login"
                  :label="$t('signin.login')"
                  type="email"
                  name="login"
                  autofocus
                  required
                />
              </div>
              <div class="w-full sm:w-1/2 sm:pl-2">
                <TextField
                  v-model="formModel.password"
                  :label="$t('signin.password')"
                  :type="showPassword ? 'text' : 'password'"
                  name="password"
                  required
                  minlength="8"
                >
                  <template v-slot:append-outer>
                    <div
                      class="cursor-pointer select-none"
                      @click="showPassword = !showPassword"
                    >
                      <Icon
                        v-if="showPassword"
                        color="#9A9A9A"
                        style="transform:rotateY(-180deg)"
                      >{{ icons.mdiEyeOffOutline }}</Icon>
                      <Icon
                        v-else
                        color="#9A9A9A"
                      >{{ icons.mdiEyeOutline }}</Icon>
                    </div>
                  </template>
                </TextField>
                <div>
                  <router-link
                    class="button button--secondary button--text"
                    :to="{ name: 'password-restore' }">
                    {{ $t('signin.forgotPassword') }}
                  </router-link>
                </div>
              </div>
              <template v-slot:append>
                <Button
                  large
                  secondary
                  :disabled="loading"
                  @click="onSubmit"
                >
                  <span v-if="loading">
                    {{ $t('action.loading') }}
                  </span>
                  <span v-else>
                    {{ $t('action.login') }}
                  </span>
                </Button>
                <div class="mx-6 pt-10 pb-4 md:py-2 text-white whitespace-no-wrap">
                  <span>{{ $t('preposition.or') }}</span>&nbsp;
                  <span>{{ $t('preposition.through') }}</span>
                </div>
                <SocialSignIn />
              </template>
            </Form>
          </div>
        </div>
        <div class="mb:mb-8 mt-8">
          <Social />
        </div>
      </div>
    </section>
    <Copyright />
    <div class="content-background content-background--main" />
  </div>
</template>

<script>
import { mdiEyeOutline, mdiEyeOffOutline } from '@mdi/js'

import StatusBar from '@/components/StatusBar.vue'
import SocialSignIn from '@/components/SocialSignIn.vue'
import Social from '@/components/Social.vue'
import Copyright from '@/components/Copyright.vue'

export default {
  name: 'SignIn',
  components: {
    StatusBar,
    SocialSignIn,
    Social,
    Copyright,
  },
  data () {
    return {
      loading: false,
      infoMessage: '',
      errorMessage: '',
      showPassword: false,
      formModel: {
        login: '',
        password: '',
      },
      icons: {
        mdiEyeOutline,
        mdiEyeOffOutline,
      },
    }
  },
  methods: {
    async onSubmit (e) {
      try {
        e.preventDefault()
        this.loading = true
        this.errorMessage = ''
        const isValid = this.$refs.form.validate()
        if (isValid) {
          const user = await this.$Auth.signIn(this.formModel.login, this.formModel.password)
          this.$logger.info('Logged in user', user)
          if (this.$route.query.redirect) {
            this.$router.replace({ path: this.$route.query.redirect })
          } else {
            this.$router.replace({ name: 'home' })
          }
        }
      } catch (error) {
        this.errorMessage = error.message || error
        this.$logger.warn('Error: ', error)
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
