<template>
  <div class="content">
    <Header />
    <section class="flex-grow container welcome--top">
      <h2 class="text-32 text-light-gray-400 font-semibold leading-none pb-6">
        {{ $t('passwordRestoreConfirm.changePasswordHead') }}
      </h2>
      <div class="w-full md:w-1/2">
        <p v-html="$t('passwordRestoreConfirm.changePasswordSubhead')" class="pb-6" />
        <div class="pb-10">
          <Form
            ref="form"
            lazy-validation
            @submit="onSubmit"
          >
            <TextField
              v-model="formModel.password"
              :placeholder="$t('passwordRestoreConfirm.newPassword')"
              :type="showPassword ? 'text' : 'password'"
              :rules="[rules.required, rules.passwordMinLength]"
              class="pb-6"
              name="password"
              autocomplete="on"
              minlength="8"
              validate-on-blur
              state-icon
              required
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
            <TextField
              v-model="formModel.passwordConfirm"
              :placeholder="$t('passwordRestoreConfirm.newPasswordConfirm')"
              :type="showConfirmPassword ? 'text' : 'password'"
              :rules="[rules.required, rules.passwordMinLength, rules.passwordConfirmRules]"
              name="password"
              autocomplete="on"
              minlength="8"
              validate-on-blur
              state-icon
              required
            >
              <template v-slot:append>
                <div
                  class="cursor-pointer select-none text-gray-500 hover:text-gray-300 pr-1"
                  @click="showConfirmPassword = !showConfirmPassword"
                >
                  <i v-if="showConfirmPassword" class="zi-eye align-middle" />
                  <i v-else class=" zi-eye-off align-middle text-28" />
                </div>
              </template>
            </TextField>
          </Form>
        </div>
        <div class="pb-6">
          <Btn
            :loading="loading"
            min-width="120"
            @click.prevent="onSubmit"
          >
            <span>{{$t('passwordRestoreConfirm.submit') }}</span>
          </Btn>
        </div>
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
  name: 'PasswordRestoreConfirm',
  components: {
    Header,
    Copyright,
  },
  data () {
    return {
      loading: false,
      errorMessage: '',
      showPassword: false,
      showConfirmPassword: false,
      formModel: {
        username: '',
        email: '',
        code: '',
        password: '',
        passwordConfirm: '',
      },
      rules: {
        required: v => !!v || this.$t('rule.required'),
        passwordMinLength: v => (v && v.length > 7) || this.$t('rule.minLength', { n: 8 }),
        passwordConfirmRules: v => (v && v === this.formModel.password) || this.$t('rule.passwordsDoNotMatch'),
      },
    }
  },
  mounted () {
    this.formModel.username = this.$route.query.username
    this.formModel.code = this.$route.query.code
    this.formModel.email = this.$route.query.email
  },
  methods: {
    async onSubmit (e) {
      try {
        e.preventDefault()
        this.loading = true
        this.errorMessage = ''
        const isValid = this.$refs.form.validate()
        if (isValid) {
          await this.$auth.forgotPasswordSubmit(
            this.formModel.username,
            this.formModel.code,
            this.formModel.password,
          )
          this.$notify({ color: 'primary', text: this.$t('message.passwordChanged') })
          this.$router.push({ name: 'signin' })
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
