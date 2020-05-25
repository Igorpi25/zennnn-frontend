<template>
  <div class="min-h-screen h-full flex">
    <div class="auth-left container flex-shrink-0 hidden sm:flex flex-col bg-gray-700">
      <div class="signup--top flex-grow lg:pl-8">
        <div class="auth-left--bg absolute pointer-events-none bottom-0 left-0 top-0" style="right: 50%" />
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
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.58947 11.9648L16.8212 21.1965L14.0176 24L4.78595 14.7683L7.58947 11.9648Z" fill="#7E99D0"/>
                <path d="M27.2141 10.8035L14.0176 24L11.2141 21.1965L24.4106 8L27.2141 10.8035Z" fill="#7E99D0"/>
              </svg>
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
          <div class="max-w-sm mx-auto sm:max-w-none sm:mx-0 flex items-center justify-between sm:justify-end flex-wrap sm:flex-no-wrap text-gray-200 lg:pr-20 pt-6 sm:pt-8">
            <router-link to="/">
              <img src="@/assets/img/logo-dark.svg" alt="Logo" class="sm:hidden">
            </router-link>
            <LocalePicker nudge-bottom="24" class="sm:pr-4" />
            <div class="sm:inline-block w-full sm:w-auto text-center py-5 sm:py-0">
              <span class="pr-1">{{ $t('signup.hasAccount') }}</span>
              <router-link
                :to="{ name: 'signin' }"
                class="text-blue-500 hover:text-blue-600 focus:text-blue-600 focus:outline-none"
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
          v-model="formValidity"
        >
          <TextField
            v-model="formModel.firstName"
            :placeholder="$t('signup.firstName')"
            :rules="[rules.required]"
            class="pb-6"
            name="firstName"
            autocomplete="on"
            validate-on-blur
            autofocus
            state-icon
            state-icon-on-validate
            required
            emit-invalid
          >
          </TextField>
          <TextField
            v-model="formModel.lastName"
            :placeholder="$t('signup.lastName')"
            :rules="[rules.required]"
            class="pb-6"
            name="lastName"
            autocomplete="on"
            validate-on-blur
            state-icon
            state-icon-on-validate
            required
            emit-invalid
          >
          </TextField>
          <TextField
            ref="email"
            v-model="formModel.email"
            :placeholder="$t('signup.login')"
            :rules="[rules.required, rules.email]"
            class="pb-6"
            type="email"
            name="email"
            autocomplete="on"
            validate-on-blur
            state-icon
            state-icon-on-validate
            required
            emit-invalid
          >
          </TextField>
          <TextField
            v-model="formModel.password"
            :placeholder="$t('signup.password')"
            :type="showPassword ? 'text' : 'password'"
            :rules="[rules.required, rules.passwordMinLength]"
            class="pb-6"
            name="password"
            autocomplete="on"
            minlength="8"
            validate-on-blur
            state-icon
            state-icon-on-validate
            required
            emit-invalid
          >
            <template v-slot:append>
              <div
                class="cursor-pointer select-none text-gray-500 hover:text-gray-300 pr-1"
                @click="showPassword = !showPassword"
              >
                <i v-if="showPassword" class="zi-eye align-middle" />
                <i v-else class=" zi-eye-off align-middle" style="font-size: 28px" />
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
            :disabled="formValidity"
            :loading="loading"
            class="w-full sm:w-48"
            @click="onSubmit"
          >
            {{ $t('signup.submit') }}
          </Button>
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
import Social from '../components/Social.vue'
import Copyright from '../components/Copyright.vue'
import LocalePicker from '../components/LocalePicker.vue'

export default {
  name: 'SignUp',
  components: {
    Social,
    Copyright,
    LocalePicker,
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
      return `${this.$t('signup.acceptPolicyAndTerms')}&nbsp;<a class="text-blue-500 hover:text-blue-600 focus:text-blue-600 focus:outline-none" href="#">
        ${this.$t('signup.privacyPolicy')}</a> ${this.$t('preposition.and')}&nbsp;<a class="text-blue-500 hover:text-blue-600 focus:text-blue-600 focus:outline-none" href="#">${this.$t('signup.termsOfUse')}</a>`
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
          const response = await this.$Auth.signUp(
            email,
            password,
            {
              family_name: lastName,
              given_name: firstName,
              email,
              locale: this.$i18n.locale,
            },
          )
          this.$logger.info('Registered user', response.user)
          const username = response.user && response.user.username
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
