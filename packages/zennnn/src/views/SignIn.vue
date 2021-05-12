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
          <div class="max-w-sm mx-auto sm:max-w-none sm:mx-0 flex items-center justify-between sm:justify-end flex-wrap sm:flex-nowrap text-gray-200 lg:pr-20 pt-6 sm:pt-8">
            <router-link to="/" class="focus:outline-none">
              <img src="@/assets/img/logo-dark.svg" alt="Logo" class="sm:hidden">
            </router-link>
            <LocalePicker distance="16" class="sm:pr-4" />
            <div class="sm:inline-block w-full sm:w-auto text-center py-5 sm:py-0">
              <span class="pr-1">{{ $t('signin.noAccount') }}</span>
              <router-link
                :to="{ name: 'signup' }"
                class="text-blue-500 hover:text-blue-400 focus:text-blue-400 focus:outline-none"
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
          v-model:valid="formValidity"
          @submit="onSubmit"
        >
          <TextField
            v-model="formModel.login"
            :placeholder="$t('signin.login')"
            :rules="[rules.required, rules.email]"
            :hide-details="false"
            class="pb-6"
            control-class="dark:bg-gray-800"
            type="email"
            name="email"
            autocomplete="email"
            aria-label="email input"
            autofocus
            validate-on-blur
          />
          <TextField
            v-model="formModel.password"
            :placeholder="$t('signin.password')"
            :type="showPassword ? 'text' : 'password'"
            :rules="[rules.required, rules.passwordMinLength]"
            :hide-details="false"
            class="pb-6"
            control-class="dark:bg-gray-800"
            name="password"
            autocomplete="current-password"
            aria-label="password input"
            minlength="8"
            validate-on-blur
          >
            <template v-slot:append>
              <Icon
                class="text-gray-500 hover:text-gray-300 pr-1"
                @click="showPassword = !showPassword"
              >
                {{ showPassword ? icons.ziVisible : icons.ziHide }}
              </Icon>
            </template>
          </TextField>
          <div class="pb-6">
            <router-link
              :to="{ name: 'password-restore' }"
              class="text-blue-500 hover:text-blue-400 focus:text-blue-400 focus:outline-none"
            >
              {{ $t('signin.forgotPassword') }}
            </router-link>
          </div>
          <Btn
            :disabled="!formValidity"
            :loading="loading"
            class="w-full sm:w-48"
            @click="onSubmit"
          >
            {{ $t('signin.submit') }}
          </Btn>
        </Form>
      </div>
      <div class="py-5 md:pb-8 lg:pl-24">
        <Social class="sm:hidden justify-center mb-1 pb-6" />
        <Copyright class="mx-auto text-center sm:text-left sm:mx-0" />
      </div>
    </div>
    <Modal
      v-model="compliteFormDialog"
      max-width="385"
      persistent
    >
      <Form
        ref="compliteForm"
        v-model:valid="compliteFormValidity"
        class="mx-auto p-5"
      >
        <h4 class="text-xl pb-6">
          {{ $t('signup.registration') }}
        </h4>
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
          :hide-details="false"
          class="pb-6"
          name="given-name"
          autocomplete="given-name"
          aria-label="given name input"
          autofocus
          force-validate
          validate-on-blur
          state-icon
          required
        />
        <TextField
          v-model="compliteFormModel.lastName"
          :placeholder="$t('signup.lastName')"
          :rules="[rules.required]"
          :hide-details="false"
          class="pb-6"
          name="family-name"
          autocomplete="family-name"
          aria-label="family name input"
          force-validate
          validate-on-blur
          state-icon
          required
        />
        <TextField
          ref="email"
          v-model="compliteFormModel.email"
          :placeholder="$t('signin.login')"
          :rules="[rules.required, rules.email]"
          :hide-details="false"
          class="pb-6"
          type="email"
          name="email"
          autocomplete="email"
          aria-label="email input"
          disabled
          force-validate
          validate-on-blur
          state-icon
          required
        />
        <TextField
          v-model="compliteFormModel.password"
          :placeholder="$t('signup.password')"
          :type="compliteShowPassword ? 'text' : 'password'"
          :rules="[rules.required, rules.passwordMinLength]"
          :hide-details="false"
          class="pb-6"
          name="new-password"
          autocomplete="new-password"
          aria-label="new password input"
          minlength="8"
          validate-on-blur
          state-icon
          required
        >
          <template v-slot:append>
            <Icon
              class="text-gray-500 hover:text-gray-300 pr-1"
              @click="compliteShowPassword = !compliteShowPassword"
            >
              {{ compliteShowPassword ? icons.ziVisible : icons.ziHide }}
            </Icon>
          </template>
        </TextField>
        <Checkbox
          :rules="[rules.check]"
          :hide-details="false"
          class="pb-6"
        >
          <span class="ml-3 float-left" v-html="policyHtml" />
        </Checkbox>
        <Alert
          v-model="compliteErrorMessage"
          close
          color="error"
          class="mb-6"
          transition="slide-y-transition"
        >
          {{ compliteErrorMessage }}
        </Alert>
        <Btn
          :disabled="!compliteFormValidity"
          :loading="compliteLoading"
          class="w-full sm:w-48"
          @click="completeNewPassword"
        >
          {{ $t('signup.submit') }}
        </Btn>
      </Form>
    </Modal>
  </div>
</template>

<script>
import { useApolloClient } from '@vue/apollo-composable'

import { ziVisible, ziHide } from '@zennnn/icons'
import { Alert, Icon, Btn, Form, TextField, Modal, Checkbox } from '@zennnn/core'

import { GET_PROFILE, GET_ORGS, GET_IS_LOGGED_IN } from '../graphql/queries'
import { COMPLITE_REGISTRATION, INIT_SPEC_SIMPLE_UI } from '../graphql/mutations'

import Social from '../components/Social.vue'
import Copyright from '../components/Copyright.vue'
import LocalePicker from '../components/LocalePicker.vue'

export default {
  name: 'SignIn',
  components: {
    Alert,
    Icon,
    Btn,
    Form,
    TextField,
    Modal,
    Checkbox,
    Social,
    Copyright,
    LocalePicker,
  },
  setup () {
    const { resolveClient } = useApolloClient()
    const apolloClient = resolveClient()

    return {
      icons: {
        ziVisible,
        ziHide,
      },
      apolloClient,
    }
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
      return `${this.$t('signup.acceptPolicyAndTerms')}&nbsp;<a class="text-blue-500 hover:text-blue-400 focus:text-blue-400 focus:outline-none" href="#">
        ${this.$t('signup.privacyPolicy')}</a> ${this.$t('preposition.and')}&nbsp;<a class="text-blue-500 hover:text-blue-400 focus:text-blue-400 focus:outline-none" href="#">${this.$t('signup.termsOfUse')}</a>`
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
          const user = await this.$auth.signIn(this.formModel.login, this.formModel.password)
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
            this.apolloClient.writeQuery({
              query: GET_IS_LOGGED_IN,
              data: { isLoggedIn: true },
            })
            await this.apolloClient.mutate({
              mutation: INIT_SPEC_SIMPLE_UI,
            })
            this.$logger.info('Logged in user', user)
            const { data: { getProfile } } = await this.apolloClient.query({
              query: GET_PROFILE,
              fetchPolicy: 'network-only',
            })
            if (!getProfile.isGreeted) {
              const { data: { getOrgs } } = await this.apolloClient.query({
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
          const loggedUser = await this.$auth.completeNewPassword(this.user, password, attrs)
          this.$logger.info('Registered complite user', loggedUser)
          await this.$auth.signIn(email, password)
          await this.apolloClient.mutate({
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
