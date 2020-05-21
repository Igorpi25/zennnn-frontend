<template>
  <div class="content">
    <Header />
    <section>
      <div class="container">
        <div>
          <div class="mb-8 sm:mt-24 mb-0">
            <div class="w-full">
              <h1 class="text-center md:text-left mb-12 pt-10 md:pt-12">
                <span class="text-white md:text-gray-100">
                  {{ $t('passwordRestore.accessRecoveryHead') }}
                </span>
                <br />
                <span class="text-gray-100 md:text-white">
                  {{ $t('passwordRestore.accessRecoverySubhead') }}
                </span>
              </h1>
              <Form
                ref="form"
                :title="$t('passwordRestore.recoveryByEmail')"
                :error-message.sync="errorMessage"
                lazy-validation
                class="form--max-w-md px-0 md:px-8 pt-8 md:pt-3 pb-1 md:pb-8 mb-16 md:mb-0"
              >
                <template v-slot:alert>
                  <Alert
                    :value="!!successMessage"
                    :text="successMessage"
                    color="green"
                  />
                </template>
                <div class="w-full">
                  <div class="w-full sm:w-1/2">
                    <TextField
                      v-model="formModel.email"
                      :label="$t('passwordRestore.email')"
                      :rules="[rules.required, rules.email]"
                      type="email"
                      name="email"
                      autofocus
                    />
                  </div>
                  <div class="text-gray-150 text-sm">
                    <p>{{ $t('passwordRestore.notRecieveEmailHead') }}&nbsp;
                      <span>
                        {{ $t('passwordRestore.notRecieveEmailSubhead') }}
                      </span>
                      <!-- <router-link
                        :to="{ name: 'login-restore' }"
                        class="text-blue-500"
                      >
                        {{ $t('passwordRestore.restoreBySms') }}
                      </router-link> -->
                    </p>
                  </div>
                </div>
                <template v-slot:append>
                  <Button
                    :loading="loading"
                    @click="onSubmit"
                  >
                    {{ $t('passwordRestore.submit') }}
                  </Button>
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
import Header from '@/components/Header.vue'
import Social from '@/components/Social.vue'
import Copyright from '@/components/Copyright.vue'

export default {
  name: 'PasswordRestore',
  components: {
    Header,
    Social,
    Copyright,
  },
  data () {
    return {
      loading: false,
      errorMessage: '',
      successMessage: '',
      showPassword: false,
      formModel: {
        email: '',
      },
      rules: {
        required: v => !!v || this.$t('rule.required'),
        email: v => /.+@.+\..+/.test(v) || this.$t('rule.email'),
      },
    }
  },
  methods: {
    async onSubmit (e) {
      try {
        e.preventDefault()
        this.loading = true
        this.errorMessage = ''
        this.successMessage = ''
        const isValid = this.$refs.form.validate()
        if (isValid) {
          const response = await this.$Auth.forgotPassword(this.formModel.email)
          this.$logger.info('Password restore response', response)
          if (response) {
            this.successMessage = this.$t('message.emailSent', { email: this.formModel.email })
          }
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
