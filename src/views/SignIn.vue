<template>
  <div class="min-h-screen h-full flex">
    <div class="auth-left container flex-shrink-0 hidden sm:flex flex-col bg-gray-700">
      <div class="signin--top flex-grow lg:pl-8">
        <div class="auth-left--bg absolute pointer-events-none bottom-0 left-0 top-0" style="right: 50%" />
        <div class="pt-2 pb-12 lg:pl-12">
          <router-link to="/">
            <img src="@/assets/img/logo-dark.svg" alt="Logo">
          </router-link>
        </div>
        <div class="pt-1 lg:pl-12">
          <div
            v-html="'Ре&shy;во&shy;лю&shy;ци&shy;он&shy;ный<br>сервис для ве&shy;де&shy;ния<br>меж&shy;ду&shy;на&shy;род&shy;ной<br>тор&shy;гов&shy;ли.'"
            class="text-4xl text-gray-100 font-semibold leading-tight pb-4"
          />
          <div class="text-2xl text-gray-200 leading-relaxed">
            Простой. Мультиязычный.<br>Мощный.
          </div>
        </div>
      </div>
      <Social class="mb-2 py-6 md:pb-8 lg:pl-20" />
    </div>
    <div class="container flex-grow flex flex-col">
      <div class="relative">
        <div class="sm:absolute sm:top-0 sm:right-0">
          <div class="max-w-sm mx-auto sm:max-w-none sm:mx-0 flex items-center justify-between sm:justify-end flex-wrap sm:flex-no-wrap text-gray-200 lg:pr-20 pt-6 sm:pt-8">
            <router-link to="/">
              <img src="@/assets/img/logo-dark.svg" alt="Logo" class="sm:hidden">
            </router-link>
            <LocalePicker nudge-bottom="24" class="sm:pr-4" />
            <div class="sm:inline-block w-full sm:w-auto text-center py-5 sm:py-0">
              <span class="pr-1">{{ $t('signin.noAccount') }}</span>
              <router-link
                :to="{ name: 'signup' }"
                class="text-blue-500 hover:text-blue-600"
              >
                <span>{{ $t('signin.signup') }}</span>
              </router-link>
            </div>
          </div>
        </div>
      </div>
      <div class="signin--top flex flex-col justify-center sm:block w-full max-w-sm flex-grow mx-auto sm:mx-0 lg:ml-24">
        <div class="pb-10 font-semibold text-2xl">Войти</div>
        <ZForm
          ref="form"
        >
          <ZTextField
            v-model="formModel.login"
            :placeholder="$t('signin.login')"
            :rules="[rules.required, rules.email]"
            class="pb-6"
            type="email"
            name="login"
            autofocus
          >
          </ZTextField>
          <ZTextField
            v-model="formModel.password"
            :placeholder="$t('signin.password')"
            :type="showPassword ? 'text' : 'password'"
            :rules="[rules.required, rules.passwordMinLength]"
            class="pb-6"
            name="password"
            minlength="8"
          >
            <template v-slot:append>
              <div
                class="cursor-pointer select-none text-gray-500 hover:text-blue-500"
                @click="showPassword = !showPassword"
              >
                <svg v-if="showPassword" width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z" fill="currentColor"/>
                </svg>
                <svg  v-else width="24" height="18" viewBox="0 0 24 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.3684 3.63488L20.3158 2.68752C21.0526 1.95067 21.1579 1.0033 20.5263 0.371726C19.8947 -0.15459 18.9474 -0.15459 18.2105 0.582252L16.6316 2.1612C15.1579 1.63488 13.6842 1.31909 12.1053 1.31909C6.84211 1.31909 2.21053 4.37173 0 8.89804C1.05263 11.0033 2.63158 12.898 4.63158 14.1612L3.47368 15.2138C2.73684 15.9507 2.63158 16.898 3.26316 17.5296C3.89474 18.0559 4.84211 18.0559 5.57895 17.3191L7.26316 15.6349C7.26316 15.6349 7.26316 15.6349 7.36842 15.6349L9.05263 13.8454L17.7895 5.10857L19.3684 3.63488ZM6.10526 12.6875C6.10526 12.6875 6 12.6875 6 12.5823C4.63158 11.5296 3.36842 10.3717 2.42105 8.89804C3.36842 7.52962 4.52632 6.26646 6 5.3191C6.10526 5.21383 6.21053 5.21383 6.31579 5.10857C9.47368 3.0033 12.6316 3.21383 14.8421 3.84541L6.10526 12.6875Z" fill="currentColor"/>
                  <path d="M21.6842 5.63489L20.1052 7.21384C20.6316 7.74015 21.1579 8.37173 21.4737 8.89805C20.5263 10.2665 19.3684 11.5296 17.8947 12.477C16.421 13.4244 14.7368 13.9507 13.0526 14.0559L10.7368 16.3717C11.1579 16.3717 11.5789 16.477 11.8947 16.477C17.1579 16.477 21.7894 13.4244 24 8.89805C23.3684 7.74015 22.6316 6.68752 21.6842 5.63489Z" fill="currentColor"/>
                </svg>
              </div>
            </template>
          </ZTextField>
          <div class="pb-6">
            <router-link
              :to="{ name: 'password-restore' }"
              class="text-blue-500 hover:text-blue-600"
            >
              {{ $t('signin.forgotPassword') }}
            </router-link>
          </div>
        </ZForm>
        <ZButton
          :loading="loading"
          class="w-full sm:w-48"
          @click="onSubmit"
        >
          {{ $t('signin.submit') }}
        </ZButton>
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
      <ZForm
        ref="compliteForm"
        v-model="compliteFormValidity"
        :title="$t('signup.registration')"
        :error-message.sync="compliteErrorMessage"
        class="mx-auto"
      >
        <div class="w-full pb-6">
          <p class="text-white">
            <span>{{ $t('signup.compliteRegistration') }}</span>&nbsp;
            <span class="text-gray-lightest">
              {{ $t('signup.registerContent') }}
            </span>
          </p>
        </div>
        <ZTextField
          v-model="compliteFormModel.firstName"
          :placeholder="$t('signup.firstName')"
          :rules="[rules.required]"
          class="pb-6"
          name="firstName"
          autofocus
        >
        </ZTextField>
        <ZTextField
          v-model="compliteFormModel.lastName"
          :placeholder="$t('signup.lastName')"
          :rules="[rules.required]"
          class="pb-6"
          name="lastName"
        >
        </ZTextField>
        <ZTextField
          ref="email"
          v-model="compliteFormModel.email"
          :placeholder="$t('signin.login')"
          :rules="[rules.required, rules.email]"
          class="pb-6"
          type="email"
          name="email"
        >
        </ZTextField>
        <ZTextField
          v-model="compliteFormModel.password"
          :placeholder="$t('signup.password')"
          :type="compliteShowPassword ? 'text' : 'password'"
          :rules="[rules.required, rules.passwordMinLength]"
          class="pb-6"
          name="password"
          minlength="8"
        >
          <template v-slot:append>
            <div
              class="cursor-pointer select-none text-gray-500 hover:text-blue-500"
              @click="compliteShowPassword = !compliteShowPassword"
            >
              <svg v-if="compliteShowPassword" width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z" fill="currentColor"/>
              </svg>
              <svg  v-else width="24" height="18" viewBox="0 0 24 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.3684 3.63488L20.3158 2.68752C21.0526 1.95067 21.1579 1.0033 20.5263 0.371726C19.8947 -0.15459 18.9474 -0.15459 18.2105 0.582252L16.6316 2.1612C15.1579 1.63488 13.6842 1.31909 12.1053 1.31909C6.84211 1.31909 2.21053 4.37173 0 8.89804C1.05263 11.0033 2.63158 12.898 4.63158 14.1612L3.47368 15.2138C2.73684 15.9507 2.63158 16.898 3.26316 17.5296C3.89474 18.0559 4.84211 18.0559 5.57895 17.3191L7.26316 15.6349C7.26316 15.6349 7.26316 15.6349 7.36842 15.6349L9.05263 13.8454L17.7895 5.10857L19.3684 3.63488ZM6.10526 12.6875C6.10526 12.6875 6 12.6875 6 12.5823C4.63158 11.5296 3.36842 10.3717 2.42105 8.89804C3.36842 7.52962 4.52632 6.26646 6 5.3191C6.10526 5.21383 6.21053 5.21383 6.31579 5.10857C9.47368 3.0033 12.6316 3.21383 14.8421 3.84541L6.10526 12.6875Z" fill="currentColor"/>
                <path d="M21.6842 5.63489L20.1052 7.21384C20.6316 7.74015 21.1579 8.37173 21.4737 8.89805C20.5263 10.2665 19.3684 11.5296 17.8947 12.477C16.421 13.4244 14.7368 13.9507 13.0526 14.0559L10.7368 16.3717C11.1579 16.3717 11.5789 16.477 11.8947 16.477C17.1579 16.477 21.7894 13.4244 24 8.89805C23.3684 7.74015 22.6316 6.68752 21.6842 5.63489Z" fill="currentColor"/>
              </svg>
            </div>
          </template>
        </ZTextField>
        <Checkbox
          :rules="[rules.required]"
          class="pb-12"
        >
          <span class="ml-3 float-left">
            {{ $t('signup.acceptPolicyAndTerms') }}&nbsp;
            <a class="text-blue-500 hover:text-blue-600" href="#">{{ $t('signup.privacyPolicy') }}</a>
            &nbsp;{{ $t('preposition.and') }}&nbsp;
            <a class="text-blue-500 hover:text-blue-600" href="#">{{ $t('signup.termsOfUse') }}</a>
          </span>
        </Checkbox>
      </ZForm>
      <ZButton
        :disabled="compliteFormValidity"
        :loading="compliteLoading"
        class="w-full sm:w-48"
        @click="completeNewPassword"
      >
        {{ $t('signup.submit') }}
      </ZButton>
    </v-dialog>
  </div>
</template>

<script>
import Social from '../components/Social.vue'
import Copyright from '../components/Copyright.vue'
import LocalePicker from '../components/LocalePicker.vue'

import { apolloClient } from '../plugins/apollo'

import { GET_PROFILE, GET_ORGS } from '../graphql/queries'
import { COMPLITE_REGISTRATION } from '../graphql/mutations'

export default {
  name: 'SignIn',
  components: {
    Social,
    Copyright,
    LocalePicker,
  },
  data () {
    return {
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
        required: v => !!v || this.$t('rule.required'),
        email: v => /.+@.+\..+/.test(v) || this.$t('rule.email'),
        passwordMinLength: v => (v && v.length > 7) || this.$t('rule.minLength', { n: 8 }),
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
            this.$logger.info('Logged in user', user)
            const { data: { getProfile } } = await apolloClient.query({
              query: GET_PROFILE,
              fetchPolicy: 'cache-only',
            })
            if (getProfile.initialized) {
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
                this.$router.replace({ path: this.$route.query.redirect })
              } else {
                this.$router.replace({ name: 'home' })
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
