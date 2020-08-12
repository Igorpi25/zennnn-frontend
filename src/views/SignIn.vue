<template>
  <div class="flex-grow flex">
    <div class="auth-left container flex-shrink-0 hidden sm:flex flex-col bg-gray-700">
      <div class="signin--top flex-grow lg:pl-8">
        <div class="auth-left--bg absolute pointer-events-none bottom-0 left-0 top-0 right-1/2" />
        <div class="pt-2 pb-12 lg:pl-12">
          <router-link to="/" class="focus:outline-none">
            <img src="@/assets/img/logo-dark.svg" alt="Logo">
          </router-link>
        </div>
        <div class="pt-1 lg:pl-12">
          <h2
            v-html="$t('signin.title')"
            class="text-4xl text-gray-100 font-semibold leading-tight pb-4"
          />
          <h3 class="text-2xl text-gray-200 leading-relaxed" v-html="$t('signin.subtitle')" />
        </div>
      </div>
      <Social class="mb-2 py-6 md:pb-8 lg:pl-20" />
    </div>
    <div class="container flex-grow flex flex-col">
      <div class="relative">
        <div class="sm:absolute sm:top-0 sm:right-0">
          <div class="max-w-sm mx-auto sm:max-w-none sm:mx-0 flex items-center justify-between sm:justify-end flex-wrap sm:flex-no-wrap text-gray-200 lg:pr-20 pt-6 sm:pt-8">
            <router-link to="/" class="focus:outline-none">
              <img src="@/assets/img/logo-dark.svg" alt="Logo" class="sm:hidden">
            </router-link>
            <LocalePicker nudge-bottom="24" class="sm:pr-4" />
            <div class="sm:inline-block w-full sm:w-auto text-center py-5 sm:py-0">
              <span class="pr-1">{{ $t('signin.noAccount') }}</span>
              <router-link
                :to="{ name: 'signup' }"
                class="text-blue-500 hover:text-blue-600 focus:text-blue-600 focus:outline-none"
              >
                <span>{{ $t('signin.signup') }}</span>
              </router-link>
            </div>
          </div>
        </div>
      </div>
      <div class="signin--top flex flex-col justify-center sm:block w-full max-w-sm flex-grow mx-auto sm:mx-0 lg:ml-24">
        <h1 class="pb-10 font-semibold text-2xl">
          {{ $t('signin.formTitle') }}
        </h1>
        <Form
          ref="form"
          v-model="formValidity"
          @submit="onSubmit"
        >
          <TextField
            v-model="formModel.login"
            :placeholder="$t('signin.login')"
            :rules="[rules.required, rules.email]"
            class="pb-6"
            type="email"
            autocomplete="on"
            name="login"
            autofocus
            validate-on-blur
          />
          <TextField
            v-model="formModel.password"
            :placeholder="$t('signin.password')"
            :type="showPassword ? 'text' : 'password'"
            :rules="[rules.required, rules.passwordMinLength]"
            class="pb-6"
            name="password"
            autocomplete="on"
            minlength="8"
            validate-on-blur
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
          <div class="pb-6">
            <router-link
              :to="{ name: 'password-restore' }"
              class="text-blue-500 hover:text-blue-600 focus:text-blue-600 focus:outline-none"
            >
              {{ $t('signin.forgotPassword') }}
            </router-link>
          </div>
          <Button
            :disabled="formValidity"
            :loading="loading"
            class="w-full sm:w-48"
            @click="onSubmit"
          >
            {{ $t('signin.submit') }}
          </Button>
        </Form>
      </div>
      <div class="py-5 md:pb-8 lg:pl-24">
        <Social class="sm:hidden justify-center mb-1 pb-6" />
        <Copyright class="mx-auto text-center sm:text-left sm:mx-0" />
      </div>
    </div>
    <v-dialog
      v-model="compliteFormDialog"
      max-width="385"
      persistent
      content-class="p-5 bg-gray-900"
    >
      <Form
        ref="compliteForm"
        v-model="compliteFormValidity"
        :title="$t('signup.registration')"
        :error-message.sync="compliteErrorMessage"
        class="mx-auto"
      >
        <div class="w-full pb-6">
          <p class="text-white">
            <span>{{ $t('signup.compliteRegistration') }}</span>&nbsp;
            <span class="text-gray-100">
              {{ $t('signup.registerContent') }}
            </span>
          </p>
        </div>
        <TextField
          v-model="compliteFormModel.firstName"
          :placeholder="$t('signup.firstName')"
          :rules="[rules.required]"
          class="pb-6"
          name="firstName"
          autocomplete="on"
          autofocus
          force-validate
          validate-on-blur
          state-icon
          state-icon-on-validate
          required
        />
        <TextField
          v-model="compliteFormModel.lastName"
          :placeholder="$t('signup.lastName')"
          :rules="[rules.required]"
          class="pb-6"
          name="lastName"
          autocomplete="on"
          force-validate
          validate-on-blur
          state-icon
          state-icon-on-validate
          required
        />
        <TextField
          ref="email"
          v-model="compliteFormModel.email"
          :placeholder="$t('signin.login')"
          :rules="[rules.required, rules.email]"
          class="pb-6"
          type="email"
          name="email"
          autocomplete="on"
          disabled
          force-validate
          validate-on-blur
          state-icon
          state-icon-on-validate
          required
        />
        <TextField
          v-model="compliteFormModel.password"
          :placeholder="$t('signup.password')"
          :type="compliteShowPassword ? 'text' : 'password'"
          :rules="[rules.required, rules.passwordMinLength]"
          class="pb-6"
          name="password"
          autocomplete="on"
          minlength="8"
          validate-on-blur
          state-icon
          state-icon-on-validate
          required
        >
          <template v-slot:append>
            <div
              class="cursor-pointer select-none text-gray-500 hover:text-gray-300 pr-1"
              @click="compliteShowPassword = !compliteShowPassword"
            >
              <i v-if="compliteShowPassword" class="zi-eye align-middle" />
              <i v-else class="zi-eye-off align-middle text-28" />
            </div>
          </template>
        </TextField>
        <Checkbox
          :rules="[rules.check]"
          lazy-validation
          class="pb-6"
        >
          <span class="ml-3 float-left" v-html="policyHtml" />
        </Checkbox>
        <Button
          :disabled="compliteFormValidity"
          :loading="compliteLoading"
          class="w-full sm:w-48"
          @click="completeNewPassword"
        >
          {{ $t('signup.submit') }}
        </Button>
      </Form>
    </v-dialog>
  </div>
</template>

<script>
import Social from '../components/Social.vue'
import Copyright from '../components/Copyright.vue'
import LocalePicker from '../components/LocalePicker.vue'

import { apolloClient } from '../plugins/apollo'

import { GET_PROFILE, GET_ORGS } from '../graphql/queries'
import { COMPLITE_REGISTRATION, INIT_SPEC_SIMPLE_UI } from '../graphql/mutations'

export default {
  name: 'SignIn',
  components: {
    Social,
    Copyright,
    LocalePicker,
  },
  data () {
    return {
      formValidity: false,
      compliteFormValidity: false,
      loading: false,
      infoMessage: '',
      errorMessage: '',
      showPassword: false,
      formModel: {
        login: '',
        password: '',
      },
      compliteFormDialog: false,
      compliteErrorMessage: '',
      compliteLoading: false,
      compliteFormModel: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
      },
      compliteShowPassword: false,
      rules: {
        check: v => !!v || this.$t('signup.check'),
        required: v => !!v || this.$t('rule.required'),
        email: v => /.+@.+\..+/.test(v) || this.$t('rule.email'),
        passwordMinLength: v => (v && v.length > 7) || this.$t('rule.minLength', { n: 8 }),
      },
    }
  },
  computed: {
    policyHtml () {
      return `${this.$t('signup.acceptPolicyAndTerms')}&nbsp;<a class="text-blue-500 hover:text-blue-600 focus:text-blue-600 focus:outline-none" href="#">
        ${this.$t('signup.privacyPolicy')}</a> ${this.$t('preposition.and')}&nbsp;<a class="text-blue-500 hover:text-blue-600 focus:text-blue-600 focus:outline-none" href="#">${this.$t('signup.termsOfUse')}</a>`
    },
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
          if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
            this.user = user
            const attrs = user.challengeParam.userAttributes
            this.compliteFormModel.firstName = attrs.given_name || ''
            this.compliteFormModel.lastName = attrs.family_name || ''
            this.compliteFormModel.email = attrs.email
            this.compliteFormDialog = true
            // TODO: save user to cache and redirect to Registration.vue view
            // this.$router.push({ name: 'registration', query: this.$route.query })
          } else {
            apolloClient.cache.writeData({
              data: {
                isLoggedIn: true,
              },
            })
            await this.$apollo.mutate({
              mutation: INIT_SPEC_SIMPLE_UI,
            })
            this.$logger.info('Logged in user', user)
            const { data: { getProfile } } = await apolloClient.query({
              query: GET_PROFILE,
              fetchPolicy: 'network-only',
            })
            if (!getProfile.isGreeted) {
              const { data: { getOrgs } } = await apolloClient.query({
                query: GET_ORGS,
                fetchPolicy: 'cache-first',
              })
              const [org] = getOrgs
              this.$router.replace({
                name: 'requisite-create',
                params: { orgId: org.id },
                query: { q: 'welcome' },
              })
            } else {
              if (this.$route.query.redirect) {
                this.$router.replace({ path: this.$route.query.redirect }).catch(() => {})
              } else {
                this.$router.replace({ name: 'home' }).catch(() => {})
              }
            }
          }
        }
      } catch (error) {
        let message = error.message || error
        if (error.code === 'UserNotConfirmedException') {
          message = this.$t('message.userNotConfirmed')
        }
        this.errorMessage = message
        this.$logger.warn('Error: ', error)
        this.$notify({
          color: 'error',
          text: message,
        })
      } finally {
        setTimeout(() => {
          this.loading = false
        }, 100)
      }
    },
    async completeNewPassword (e) {
      try {
        e.preventDefault()
        this.compliteLoading = true
        this.compliteErrorMessage = ''
        const isValid = this.$refs.compliteForm.validate()
        if (isValid) {
          const { firstName, lastName, email, password } = this.compliteFormModel
          const attrs = {
            given_name: firstName,
            family_name: lastName,
          }
          const loggedUser = await this.$Auth.completeNewPassword(this.user, password, attrs)
          this.$logger.info('Registered complite user', loggedUser)
          await this.$Auth.signIn(email, password)
          await this.$apollo.mutate({
            mutation: COMPLITE_REGISTRATION,
            variables: {
              givenName: firstName,
              familyName: lastName,
            },
          })
          if (this.$route.query.redirect) {
            this.$router.replace({ path: this.$route.query.redirect })
          } else {
            this.$router.replace({ name: 'home' })
          }
        }
      } catch (error) {
        this.compliteErrorMessage = error.message || error
        this.$logger.warn('Error: ', error)
        this.$notify({
          color: 'error',
          text: this.compliteErrorMessage,
        })
      } finally {
        setTimeout(() => {
          this.compliteLoading = false
        }, 100)
      }
    },
  },
}
</script>

<style lang="postcss" scoped>
@screen sm {
 .signin--top {
    padding-top: 25vh;
  }
}
@screen lg {
 .signin--top {
    padding-top: 30vh;
  }
}
@screen xl {
 .signin--top {
    padding-top: 34vh;
  }
}
</style>
