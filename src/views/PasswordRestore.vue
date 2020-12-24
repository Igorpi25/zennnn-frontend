<template>
  <div class="content">
    <Header />
    <section class="flex-grow container welcome--top">
      <h2 class="text-32 text-light-gray-400 font-semibold leading-none pb-6">
        {{ $t('passwordRestore.accessRecoveryHead') }}
      </h2>
      <div class="w-full md:w-1/2">
        <p v-html="$t('passwordRestore.subtitle')" class="pb-6" />
        <div class="pb-10">
          <Form
            ref="form"
            lazy-validation
            @submit="onSubmit"
          >
            <TextField
              ref="email"
              v-model="formModel.email"
              :label="$t('passwordRestore.emailLabel')"
              :placeholder="$t('companyDetail.placeholder.email')"
              :rules="[rules.required, rules.email]"
              state-icon
              validate-on-blur
              required
              type="email"
              autocomplete="on"
              name="login"
              autofocus
            />
          </Form>
        </div>
        <div class="pb-6">
          <Btn
            :loading="loading"
            min-width="120"
            @click.prevent="onSubmit"
          >
            <span>{{ $t('welcome.resend') }}</span>
          </Btn>
        </div>
        <p v-html="$t('passwordRestore.hint')" class="text-gray-200 leading-tight pb-6" />
      </div>
    </section>
    <footer class="container">
      <Copyright class="pb-6" />
    </footer>
  </div>
</template>

<script>
import Header from '../components/Header.vue'
import Copyright from '../components/Copyright.vue'

export default {
  name: 'PasswordRestore',
  components: {
    Header,
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
      e.preventDefault()
      try {
        this.loading = true
        this.errorMessage = ''
        this.successMessage = ''
        const isValid = this.$refs.form.validate()
        if (isValid) {
          const response = await this.$auth.forgotPassword(this.formModel.email)
          this.$logger.info('Password restore response', response)
          if (response) {
            this.successMessage = this.$t('message.emailSent', { email: this.formModel.email })
            this.$notify({ color: 'success', text: this.successMessage })
            this.$refs.form.reset()
          }
        } else {
          this.$refs.email.focus()
        }
      } catch (error) {
        this.errorMessage = error.message || error
        this.$notify({ color: 'error', text: this.errorMessage })
        throw new Error(error)
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style lang="postcss" scoped>
.welcome--top {
  padding-top: 5vh;
}
@screen sm {
 .welcome--top {
    padding-top: 15vh;
  }
}
</style>
