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
                  {{ $t('passwordRestore.changePasswordStart') }}
                </span>
                <br />
                <span class="text-gray-lightest md:text-white">
                  {{ $t('passwordRestore.changePasswordEnd') }}
                </span>
              </h1>
              <Form
                ref="form"
                rounded
                shadow
                class="form--max-w-md"
                body-class="px-0 md:px-8 pt-8 md:pt-3 pb-1 md:pb-8"
                :error-message.sync="errorMessage"
              >
                <div class="w-full sm:w-1/2 sm:pr-2">
                  <TextField
                    v-model="formModel.password"
                    :label="$t('passwordRestore.newPassword')"
                    :type="showPassword ? 'text' : 'password'"
                    name="password"
                    required
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
                      >{{ icons.mdiEyeOffOutline }}</Icon>
                      <Icon
                        v-else
                        color="#9A9A9A"
                      >{{ icons.mdiEyeOutline }}</Icon>
                      </div>
                    </template>
                  </TextField>
                </div>
                <div class="w-full sm:w-1/2 sm:pl-2">
                  <TextField
                    v-model="formModel.passwordConfirm"
                    :label="$t('passwordRestore.newPasswordConfirm')"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    :rules="confirmRules"
                    name="password"
                    required
                    minlength="8"
                  >
                    <template v-slot:append-outer>
                      <div
                        class="cursor-pointer select-none"
                        @click="showConfirmPassword = !showConfirmPassword"
                      >
                        <Icon
                          v-if="showPassword"
                          color="#9A9A9A"
                          style="transform:rotateY(-180deg)"
                        >{{ icons.mdiEyeOffOutline }}</Icon>
                        <Icon
                          v-else
                          color="#9A9A9A"
                        >{{ icons.mdiEyeOutline }}</Icon>
                      </div>
                    </template>
                  </TextField>
                </div>
                <template v-slot:append>
                  <Button
                    large
                    :disabled="loading"
                    class="mt-10 mb-12 mx-auto"
                    @click="onSubmit"
                  >
                    <span v-if="loading">
                      {{ $t('action.loading') }}
                    </span>
                    <span v-else>
                      {{ $t('action.change') }}
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
        email: '',
        code: '',
        password: '',
        passwordConfirm: '',
      },
      icons: {
        mdiEyeOutline,
        mdiEyeOffOutline,
      },
      confirmRules: [
        v => (v && v === this.formModel.password) || this.$t('passwordRestore.passwordsDoNotMatch'),
      ],
    }
  },
  mounted () {
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
            this.formModel.email,
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
