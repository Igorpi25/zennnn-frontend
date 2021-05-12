<template>
  <div class="flex-grow flex">
    <div class="auth-left container flex-shrink-0 hidden sm:flex flex-col bg-gray-700">
      <div class="signup--top flex-grow lg:pl-8">
        <div class="auth-left--bg absolute pointer-events-none bottom-0 left-0 top-0 right-1/2" />
        <div class="pt-2 lg:pl-12 pb-12">
          <router-link to="/" class="focus:outline-none">
            <img src="@/assets/img/logo-dark.svg" alt="Logo">
          </router-link>
        </div>
        <div class="pt-1">
          <div
            v-for="(item, i) in items"
            :key="i"
            class="flex text-lg text-gray-100 pb-6"
          >
            <div class="mr-4">
              <Icon large class="text-blue-500">
                {{ icons.ziChecked }}
              </Icon>
            </div>
            <div v-html="item.text" class="pt-1" />
          </div>
        </div>
      </div>
      <Social class="mb-2 py-6 md:pb-8 lg:pl-20" />
    </div>
    <div class="container flex-grow flex flex-col">
      <div class="relative">
        <div class="sm:absolute sm:top-0 sm:right-0">
          <div class="max-w-sm mx-auto sm:max-w-none sm:mx-0 flex items-center justify-between sm:justify-end flex-wrap sm:flex-nowrap text-gray-200 lg:pr-20 pt-6 sm:pt-8">
            <router-link to="/">
              <img src="@/assets/img/logo-dark.svg" alt="Logo" class="sm:hidden">
            </router-link>
            <LocalePicker distance="16" class="sm:pr-4" />
            <div class="sm:inline-block w-full sm:w-auto text-center py-5 sm:py-0">
              <span class="pr-1">{{ $t('signup.hasAccount') }}</span>
              <router-link
                :to="{ name: 'signin' }"
                class="text-blue-500 hover:text-blue-400 focus:text-blue-400 focus:outline-none"
              >
                <span>{{ $t('signup.signin') }}</span>
              </router-link>
            </div>
          </div>
        </div>
      </div>
      <div class="signup--top flex flex-col justify-center sm:block w-full max-w-sm flex-grow mx-auto sm:mx-0 lg:ml-24">
        <h1 class="pb-10 font-semibold text-2xl">
          {{ $t('signup.registration') }}
        </h1>
        <Form
          ref="form"
          v-model:valid="formValidity"
        >
          <TextField
            v-model="formModel.firstName"
            :placeholder="$t('signup.firstName')"
            :rules="[rules.required]"
            :hide-details="false"
            class="pb-6"
            control-class="dark:bg-gray-800"
            name="given-name"
            autocomplete="given-name"
            aria-label="given name input"
            validate-on-blur
            autofocus
            state-icon
            required
          />
          <TextField
            v-model="formModel.lastName"
            :placeholder="$t('signup.lastName')"
            :rules="[rules.required]"
            :hide-details="false"
            class="pb-6"
            control-class="dark:bg-gray-800"
            name="family-name"
            autocomplete="family-name"
            aria-label="family name input"
            validate-on-blur
            state-icon
            required
          />
          <TextField
            ref="email"
            v-model="formModel.email"
            :placeholder="$t('signup.login')"
            :rules="[rules.required, rules.email]"
            :hide-details="false"
            class="pb-6"
            control-class="dark:bg-gray-800"
            type="email"
            name="email"
            autocomplete="email"
            aria-label="email input"
            validate-on-blur
            state-icon
            required
          />
          <TextField
            v-model="formModel.password"
            :placeholder="$t('signup.password')"
            :type="showPassword ? 'text' : 'password'"
            :rules="[rules.required, rules.passwordMinLength]"
            :hide-details="false"
            class="pb-6"
            control-class="dark:bg-gray-800"
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
                @click="showPassword = !showPassword"
              >
                {{ showPassword ? icons.ziVisible : icons.ziHide }}
              </Icon>
            </template>
          </TextField>
          <Checkbox
            :rules="[rules.check]"
            :hide-details="false"
            class="pb-6"
            required
          >
            <span class="ml-3 float-left" v-html="policyHtml" />
          </Checkbox>
          <Btn
            :disabled="!formValidity"
            :loading="loading"
            class="w-full sm:w-48"
            @click="onSubmit"
          >
            {{ $t('signup.submit') }}
          </Btn>
        </Form>
      </div>
      <div class="py-5 md:pb-8 lg:pl-24">
        <Social class="sm:hidden justify-center mb-1 pb-6" />
        <Copyright class="mx-auto text-center sm:text-left sm:mx-0" />
      </div>
    </div>
  </div>
</template>

<script>
import { useMutation } from '@vue/apollo-composable'

import { ziVisible, ziHide, ziChecked } from '../assets/icons'

import { Btn, Icon, Form, TextField, Checkbox } from '@zennnn/core'
import Social from '../components/Social.vue'
import Copyright from '../components/Copyright.vue'
import LocalePicker from '../components/LocalePicker.vue'
import { SIGNUP } from '../graphql/mutations'

export default {
  name: 'SignUp',
  components: {
    Btn,
    Icon,
    Form,
    TextField,
    Checkbox,
    Social,
    Copyright,
    LocalePicker,
  },
  setup () {
    const { mutate: signupMutate } = useMutation(SIGNUP)

    return {
      icons: {
        ziVisible,
        ziHide,
        ziChecked,
      },
      signupMutate,
    }
  },
  data () {
    return {
      frontendVersion: process.env.FRONTEND_VERSION || '',
      formValidity: false,
      loading: false,
      errorMessage: '',
      showPassword: false,
      formModel: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
      },
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
      return `${this.$t('signup.acceptPolicyAndTerms')}&nbsp;<a href="/policy" class="text-blue-500 hover:text-blue-400 focus:text-blue-400 focus:outline-none">
        ${this.$t('signup.privacyPolicy')}</a> ${this.$t('preposition.and')}&nbsp;<a href="/agreenemt" class="text-blue-500 hover:text-blue-400 focus:text-blue-400 focus:outline-none">${this.$t('signup.termsOfUse')}</a>`
    },
    items () {
      return [
        { text: this.$t('signup.feat1') },
        { text: this.$t('signup.feat2') },
        { text: this.$t('signup.feat3') },
        { text: this.$t('signup.feat4') },
      ]
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
          const { firstName, lastName, email, password } = this.formModel
          const variables = {
            email,
            password,
            givenName: firstName,
            familyName: lastName,
            locale: this.$i18n.locale,
          }
          const { data } = await this.signupMutate({
            mutation: SIGNUP,
            variables,
          })
          const user = data.signup
          this.$logger.info('Registered user', user)
          const username = (user && user.email) || null
          // set username to sessionStorage and check on Welcome page mounted
          // moved from on apollo cache, removed on page reload
          sessionStorage.setItem('Cognito-registered-username', username)
          this.$router.push({ name: 'welcome' })
        }
      } catch (error) {
        this.errorMessage = error.message || error
        this.$logger.warn('Error: ', error)
        this.$notify({
          color: 'error',
          text: this.errorMessage,
        })
      } finally {
        setTimeout(() => {
          this.loading = false
        }, 100)
      }
    },
  },
}
</script>

<style lang="postcss" scoped>
@screen sm {
 .signup--top {
    padding-top: 15vh;
  }
}
@screen lg {
 .signup--top {
    padding-top: 20vh;
  }
}
@screen xl {
 .signup--top {
    padding-top: 25vh;
  }
}
</style>
