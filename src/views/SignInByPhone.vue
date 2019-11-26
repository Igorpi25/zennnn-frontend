<template>
  <div class="content">
    <StatusBar></StatusBar>
    <section>
      <div class="container">
        <Button
          outline
          secondary
          class="mb-5 mt-8 flex justify-center sm:justify-end"
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
              :title="$t('signin.loginByPhone')"
              :error-message.sync="errorMessage"
              rounded
              shadow
              class="form--max-w-md"
              body-class="px-0 md:p-8 pt-8 py-1 md:py-8"
              append-class="flex-col sm:flex-row items-center"
              header
              header-icon="dots"
              header-class="hidden md:flex"
            >
              <div class="w-full sm:w-1/2 sm:pr-2">
                <TextField
                  v-model="formModel.phone"
                  :label="$t('signin.phoneNumber')"
                  name="phone"
                  autofocus
                  required
                />
              </div>
              <div class="w-full sm:w-1/2 sm:pl-2">
                <TextField
                  v-model="formModel.smsCode"
                  :label="$t('signin.smsCode')"
                  type="tel"
                  name="smsCode"
                  required
                  minlength="6"
                  maxlength="6"
                />
                <Button
                  text
                  secondary
                  @click.prevent
                >
                  <span>{{ $t('action.resendCode') }}</span>
                </Button>
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
import StatusBar from '@/components/StatusBar.vue'
import SocialSignIn from '@/components/SocialSignIn.vue'
import Social from '@/components/Social.vue'
import Copyright from '@/components/Copyright.vue'

export default {
  name: 'SignInByPhone',
  components: {
    StatusBar,
    SocialSignIn,
    Social,
    Copyright,
  },
  data () {
    return {
      loading: false,
      successMessage: '',
      errorMessage: '',
      formModel: {
        phone: '',
        smsCode: '',
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
          const user = await this.$Auth.signIn(this.model.email, this.model.password)
          this.$logger.info('Logged in user', user)
          this.$router.push({ name: 'home' })
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