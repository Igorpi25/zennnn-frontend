<template>
  <div class="content">
    <StatusBar></StatusBar>
    <section>
      <div class="container">
        <div>
          <div class="mb-8 sm:mt-24 mb-0">
            <div class="w-full">
              <h1 class="text-center md:text-left mb-0 md:mb-8 pt-10 md:pt-12">
                <span class="text-white md:text-gray-lightest">
                  {{ $t('passwordRestoreConfirm.changePasswordHead') }}
                </span>
                <br />
                <span class="text-gray-lightest md:text-white">
                  {{ $t('passwordRestoreConfirm.changePasswordSubhead') }}
                </span>
              </h1>
              <Form
                ref="form"
                :error-message.sync="errorMessage"
                lazy-validation
                rounded
                shadow
                class="form--max-w-md"
                body-class="px-0 md:px-8 pt-8 md:pt-3 pb-1 md:pb-8"
              >
                <div class="w-full sm:w-1/2 sm:pr-2">
                  <TextField
                    v-model="formModel.password"
                    :label="$t('passwordRestoreConfirm.newPassword')"
                    :type="showPassword ? 'text' : 'password'"
                    :rules="[rules.required, rules.passwordMinLength]"
                    name="password"
                    autofocus
                    minlength="8"
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
                <div class="w-full sm:w-1/2 sm:pl-2">
                  <TextField
                    v-model="formModel.passwordConfirm"
                    :label="$t('passwordRestoreConfirm.newPasswordConfirm')"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    :rules="[rules.required, rules.passwordMinLength, rules.passwordConfirmRules]"
                    name="password"
                    minlength="8"
                  >
                    <template v-slot:append-outer>
                      <div
                        class="cursor-pointer select-none"
                        @click="showConfirmPassword = !showConfirmPassword"
                      >
                        <Icon
                          v-if="showConfirmPassword"
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
                <template v-slot:append>
                  <Button
                    :disabled="loading"
                    large
                    secondary
                    @click="onSubmit"
                  >
                    <span v-if="loading">
                      {{ $t('action.loading') }}
                    </span>
                    <span v-else>
                      {{ $t('passwordRestoreConfirm.submit') }}
                    </span>
                  </Button>
                </template>
              </Form>
            </div>
          </div>
          <div class="mt-16">
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
  name: 'PasswordRestoreConfirm',
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
      showConfirmPassword: false,
      formModel: {
        username: '',
        email: '',
        code: '',
        password: '',
        passwordConfirm: '',
      },
      icons: {
        mdiEyeOutline,
        mdiEyeOffOutline,
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
          await this.$Auth.forgotPasswordConfirm(
            this.formModel.username,
            this.formModel.code,
            this.formModel.password,
          )
          this.$notify({ color: 'primary', text: this.$t('message.passwordChanged'), timeout: 10000 })
          this.$router.push({ name: 'signin' })
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
