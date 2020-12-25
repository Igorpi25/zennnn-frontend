<template>
  <div class="content">
    <Header />
    <section class="h-full flex flex-grow">
      <div class="container">
        <div class="flex flex-col md:flex-row">
          <div class="w-full flex flex-col-reverse justify-end md:flex-col">
            <div class="pt-10 md:pt-12">
              <h1 class="hidden md:block">
                <span class="text-gray-100 mr-2 inline md:block">
                  {{ $t('signup.hello') }}
                </span>
                <span class="text-white inline sm:block" style="max-width: 552px;">
                  {{ $t('signup.helloContent') }}
                </span>
              </h1>
              <p class="text-white mb-0 md:mb-5" style="max-width: 460px;">
                <span>{{ $t('signup.compliteRegistration') }}</span>&nbsp;
                <span class="text-gray-100">
                  {{ $t('signup.registerContent') }}
                </span>
              </p>
            </div>
            <div class="flex-grow">
              <span>{{ $t('signup.hasAccount') }}</span>
              <Btn
                outlined
                class="mx-auto md:mx-0 md:mt-0 mt-8 md:mt-24"
                @click="$router.push({name: 'signin'})"
              >
                <span>{{ $t('signup.signin') }}</span>
              </Btn>
            </div>
            <div class="hidden md:flex">
              <Social />
            </div>
          </div>
          <div class="flex-shrink-0">
            <Form
              ref="form"
              v-model="formValidity"
              :title="$t('signup.registration')"
              v-model:error-message="errorMessage"
              class="mx-auto m-0 pt-8 md:pt-12 pb-10 px-0 md:px-12"
            >
              <div class="w-full">
                <TextField
                  v-model="formModel.firstName"
                  :label="$t('signup.firstName')"
                  :rules="[rules.required]"
                  name="firstName"
                  autofocus
                  state-icon
                />
              </div>
              <div class="w-full">
                <TextField
                  v-model="formModel.lastName"
                  :label="$t('signup.lastName')"
                  :rules="[rules.required]"
                  name="lastName"
                />
              </div>
              <div class="w-full">
                <TextField
                  ref="email"
                  :value="formModel.email"
                  :label="$t('signup.login')"
                  :rules="[rules.required, rules.email]"
                  type="email"
                  name="email"
                  readonly
                />
              </div>
              <div class="w-full">
                <TextField
                  v-model="formModel.password"
                  :label="$t('signup.password')"
                  :type="showPassword ? 'text' : 'password'"
                  :rules="[rules.required, rules.passwordMinLength]"
                  name="password"
                  minlength="8"
                >
                  <template v-slot:append>
                    <div
                      class="cursor-pointer select-none text-gray-500 hover:text-gray-300 pr-1"
                      @click="showPassword = !showPassword"
                    >
                      <i v-if="showPassword" class="zi-eye align-middle" />
                      <i v-else class=" zi-eye-off align-middle text-28" />
                    </div>
                  </template>
                </TextField>
              </div>
              <div class="relative mx-auto text-gray-300">
                <!-- TODO fix position -->
                <Checkbox
                  :rules="[rules.required]"
                  secondary
                >
                  <span class="ml-3 float-left text-gray-200">
                    {{ $t('signup.acceptPolicyAndTerms') }}&nbsp;
                    <a class="text-gray-300" href="#">{{ $t('signup.privacyPolicy') }}</a>
                    &nbsp;{{ $t('preposition.and') }}&nbsp;
                    <a class="text-gray-300" href="#">{{ $t('signup.termsOfUse') }}</a>
                  </span>
                </Checkbox>
                <div class="flex justify-center">
                  <Btn
                    :disabled="formValidity"
                    :loading="loading"
                    class="mt-5 flex justify-center"
                    @click="onSubmit"
                  >
                    {{ $t('signup.submit') }}
                  </Btn>
                </div>
              </div>
            </Form>
          </div>
          <div class="flex md:hidden mt-8 mx-auto">
            <Social />
          </div>
        </div>
      </div>
    </section>
    <Copyright />
    <div class="content-background content-background--main" />
  </div>
</template>

<script>
import Btn from '../components/Base/Btn'
import Form from '../components/Base/Form'
import TextField from '../components/Base/TextField'
import Checkbox from '../components/Base/Checkbox'
import Header from '../components/Header.vue'
import Social from '../components/Social.vue'
import Copyright from '../components/Copyright.vue'

import { auth } from '../plugins/auth'

export default {
  name: 'Registration',
  components: {
    Btn,
    Form,
    TextField,
    Checkbox,
    Header,
    Social,
    Copyright,
  },
  beforeRouteEnter: (to, from, next) => {
    try {
      auth.currentSessionUser()
      next()
    } catch (error) {
      // eslint-disable-next-line
      console.log(error)
      next('not-found')
    }
  },
  data () {
    return {
      formValidity: false,
      loading: false,
      errorMessage: '',
      showTempPassword: false,
      showPassword: false,
      formModel: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
      },
      rules: {
        required: v => !!v || this.$t('rule.required'),
        email: v => /.+@.+\..+/.test(v) || this.$t('rule.email'),
        passwordMinLength: v => (v && v.length > 7) || this.$t('rule.minLength', { n: 8 }),
      },
    }
  },
  created () {
    this.user = this.$auth.currentSessionUser()
    this.formModel.firstName = this.user.given_name || ''
    this.formModel.lastName = this.user.family_name || ''
    this.formModel.email = this.user.email
  },
  methods: {
    async onSubmit (e) {
      try {
        e.preventDefault()
        this.loading = true
        this.errorMessage = ''
        const isValid = this.$refs.form.validate()
        if (isValid) {
          const { firstName, lastName, email, password } = this.formModel
          const attrs = {
            given_name: firstName,
            family_name: lastName,
            locale: this.$i18n.locale,
          }
          const loggedUser = await this.$auth.completeNewPassword(this.user, password, attrs)
          this.$logger.info('Registered complite user', loggedUser)
          await this.$auth.signIn(email, password)
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
