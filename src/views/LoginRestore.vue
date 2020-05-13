<template>
  <div class="content">
    <StatusBar></StatusBar>
    <section>
      <div class="container">
        <div>
          <div class="mb-8 sm:mt-24 mb-0">
            <div class="w-full">
              <h1 class="text-center md:text-left mb-12 pt-10 md:pt-12">
                <span class="text-white md:text-gary0-lightest">
                  {{ $t('loginRestore.accessRecoveryHead') }}
                </span>
                <br />
                <span class="text-gary0-lightest md:text-white">
                  {{ $t('loginRestore.accessRecoverySubhead') }}
                </span>
              </h1>
              <Form
                ref="form"
                :title="$t('loginRestore.recoveryByPhone')"
                :error-message.sync="errorMessage"
                lazy-validation
                class="form--max-w-md px-0 md:px-8 pt-8 md:pt-3 pb-1 md:pb-8 mb-16 md:mb-0"
              >
                <div class="w-full sm:w-1/2 sm:pr-2">
                  <TextField
                    v-model="formModel.phone"
                    :label="$t('loginRestore.phoneNumber')"
                    :rules="[rules.required]"
                    name="phone"
                    autofocus
                  />
                </div>
                <div class="w-full sm:w-1/2 sm:pl-2">
                  <TextField
                    v-model="formModel.smsCode"
                    :label="$t('loginRestore.smsCode')"
                    :rules="[rules.required, rules.codeMinLength]"
                    type="tel"
                    name="smsCode"
                    minlength="6"
                    maxlength="6"
                  />
                  <Button
                    outlined
                    borderless
                    @click.prevent
                  >
                    <span>{{ $t('loginRestore.resendCode') }}</span>
                  </Button>
                </div>
                <template v-slot:append>
                  <Button
                    :loading="loading"
                    @click="onSubmit"
                  >
                    {{ $t('loginRestore.submit') }}
                  </Button>
                  <div class="mx-6 pt-10 pb-4 md:py-2 text-white whitespace-no-wrap">
                    <span>{{ $t('preposition.or') }}</span>&nbsp;
                    <span class="lowercase">{{ $t('loginRestore.signin') }}</span>&nbsp;
                    <span>{{ $t('preposition.through') }}</span>
                  </div>
                  <SocialSignIn />
                </template>
              </Form>
            </div>
          </div>
          <div class="mb:mb-8">
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
import StatusBar from '@/components/StatusBar.vue'
import SocialSignIn from '@/components/SocialSignIn.vue'
import Social from '@/components/Social.vue'
import Copyright from '@/components/Copyright.vue'

export default {
  name: 'LoginRestore',
  components: {
    StatusBar,
    SocialSignIn,
    Social,
    Copyright,
  },
  data () {
    return {
      loading: false,
      errorMessage: '',
      showPassword: false,
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
          // TODO action
          // eslint-disable-next-line
          console.log('Submit')
        }
      } catch (error) {
        this.errorMessage = error.message || error
        throw new Error(error)
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
