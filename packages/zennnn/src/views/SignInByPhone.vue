<template>
  <div class="content">
    <Header />
    <section>
      <div class="container">
        <Btn
          outlined
          class="mb-5 mt-8 flex justify-center sm:justify-end"
          @click="$router.push({name: 'signup'})"
        >
          <template v-slot:text>
            <span>{{ $t('signin.noAccount') }}</span>
          </template>
          <span>{{ $t('signin.signup') }}</span>
        </Btn>
        <div class="mb-8">
          <div class="w-full">
            <h1 class="headline">
              <span>{{ $t('signin.welcomeHead') }}</span>
              <span>{{ $t('signin.welcomeSubhead') }}&nbsp;
                <span class="block sm:inline">{{ $t('signin.welcomeContent') }}</span>
              </span>
            </h1>
            <Form
              ref="form"
              :title="$t('signinByPhone.loginByPhone')"
              v-model:error-message="errorMessage"
              lazy-validation
              class="form--max-w-md px-0 md:p-8 pt-8 py-1 md:py-8 flex-col sm:flex-row items-center"
            >
              <div class="w-full sm:w-1/2 sm:pr-2">
                <TextField
                  v-model="formModel.phone"
                  :label="$t('signinByPhone.phoneNumber')"
                  :rules="[rules.required]"
                  name="phone"
                  autofocus
                />
              </div>
              <div class="w-full sm:w-1/2 sm:pl-2">
                <TextField
                  v-model="formModel.smsCode"
                  :label="$t('signinByPhone.smsCode')"
                  :rules="[rules.required, rules.codeMinLength]"
                  type="tel"
                  name="smsCode"
                  minlength="6"
                  maxlength="6"
                />
                <Btn
                  outlined
                  borderless
                  @click.prevent
                >
                  <span>{{ $t('signinByPhone.resendCode') }}</span>
                </Btn>
              </div>
              <template v-slot:append>
                <Btn
                  :loading="loading"
                  @click="onSubmit"
                >
                  {{ $t('signinByPhone.submit') }}
                </Btn>
                <div class="mx-6 pt-10 pb-4 md:py-2 text-white whitespace-nowrap">
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
import { Btn, Form, TextField } from '@zennnn/core'
import Header from '../components/Header.vue'
import SocialSignIn from '../components/SocialSignIn.vue'
import Social from '../components/Social.vue'
import Copyright from '../components/Copyright.vue'

export default {
  name: 'SignInByPhone',
  components: {
    Btn,
    Form,
    TextField,
    Header,
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
      rules: {
        required: v => !!v || this.$t('rule.required'),
        codeMinLength: v => (v && v.length > 5) || this.$t('rule.minLength', { n: 6 }),
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
          const user = await this.$auth.signIn(this.model.email, this.model.password)
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
