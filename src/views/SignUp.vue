<template>
  <div class="content">
    <StatusBar></StatusBar>
    <section class="h-full flex flex-grow">
      <div class="container">
        <div class="flex flex-col md:flex-row">
          <div class="w-full flex flex-col-reverse justify-end md:flex-col">
            <div class="pt-10 md:pt-12">
              <h1 class="hidden md:block">
                <span class="text-gray-lightest mr-2 inline md:block">
                  {{ $t('signup.hello') }}
                </span>
                <span class="text-white inline sm:block" style="max-width:552px;">
                  {{ $t('signup.helloContent') }}
                </span>
              </h1>
              <p class="text-white mb-0 md:mb-5" style="max-width:460px;">
                <span>{{ $t('signup.register') }}</span>&nbsp;
                <span class="text-gray-lightest">
                  {{ $t('signup.registerContent') }}
                </span>
              </p>
            </div>
            <div class="flex-grow">
              <Button
                outline
                secondary
                class="mx-auto md:mx-0 md:mt-0 mt-8 md:mt-24"
                @click="$router.push({name: 'signin'})"
              >
                <template v-slot:text>
                  <span>{{ $t('signup.hasAccount') }}</span>
                </template>
                <span>{{ $t('action.login') }}</span>
              </Button>
            </div>
            <div class="hidden md:flex">
              <Social />
            </div>
          </div>
          <div class="flex-shrink-0">
            <Form
              ref="form"
              :title="$t('signup.registration')"
              :error-message.sync="errorMessage"
              rounded
              shadow
              class="form--max-w-sm mx-auto m-0"
              body-class="pt-8 md:pt-12 pb-10 px-0 md:px-12"
              header
              header-icon="circle"
              header-class="px-6 hidden md:flex"
            >
              <div class="w-full">
                <TextField
                  v-model="formModel.firstName"
                  :label="$t('signup.firstName')"
                  name="firstName"
                  required
                  autofocus
                  state-icon
                />
              </div>
              <div class="w-full">
                <TextField
                  v-model="formModel.lastName"
                  :label="$t('signup.lastName')"
                  name="lastName"
                  required
                  state-icon
                />
              </div>
              <div class="w-full">
                <TextField
                  ref="email"
                  v-model="formModel.email"
                  :label="$t('signup.login')"
                  type="email"
                  name="email"
                  required
                  state-icon
                />
              </div>
              <div class="w-full">
                <TextField
                  v-model="formModel.password"
                  :label="$t('signup.password')"
                  :type="showPassword ? 'text' : 'password'"
                  name="password"
                  required
                  minlength="8"
                  state-icon
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
                      >{{ icons.mdiEyeOutline }}</Icon>
                      <Icon
                        v-else
                        color="#9A9A9A"
                      >{{ icons.mdiEyeOffOutline }}</Icon>
                    </div>
                  </template>
                </TextField>
              </div>
              <div class="relative mx-auto text-secondary">
                <!-- TODO fix position -->
                <Checkbox required secondary>
                  <span class="ml-3 float-left text-gray-light">
                    {{ $t('signup.acceptPolicyAndTerms') }}&nbsp;
                    <a class="text-secondary" href="#">{{ $t('signup.privacyPolicy') }}</a>
                    &nbsp;{{ $t('preposition.and') }}&nbsp;
                    <a class="text-secondary" href="#">{{ $t('signup.termsOfUse') }}</a>
                  </span>
                </Checkbox>
                <div class="flex justify-center">
                  <Button
                    large
                    secondary
                    :disabled="loading"
                    class="mt-5 flex justify-center"
                    @click="onSubmit"
                  >
                    <span v-if="loading">
                      {{ $t('action.loading') }}
                    </span>
                    <span v-else>
                      {{ $t('signup.submit') }}
                    </span>
                  </Button>
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
import { mdiEyeOutline, mdiEyeOffOutline } from '@mdi/js'

import StatusBar from '@/components/StatusBar.vue'
import Social from '@/components/Social.vue'
import Copyright from '@/components/Copyright.vue'

export default {
  name: 'SignUp',
  components: {
    StatusBar,
    Social,
    Copyright,
  },
  data () {
    return {
      loading: false,
      errorMessage: '',
      showPassword: false,
      formModel: {
        firstName: '',
        lastName: '',
        email: '',
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
          const { firstName, lastName, email, password } = this.formModel
          const response = await this.$Auth.signUp(
            email,
            password,
            {
              family_name: lastName,
              given_name: firstName,
              email,
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
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
