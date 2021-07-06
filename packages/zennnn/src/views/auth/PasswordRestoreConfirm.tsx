import { defineComponent, ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ziVisible, ziHide } from '@zennnn/icons'
import { Btn, Icon, Form, TextField } from '@zennnn/core'
import MainAppBar from '@/components/core/MainAppBar'
import Copyright from '@/components/core/Copyright'
import { auth, logger, useNotify } from '@/plugins'

export default defineComponent({
  setup() {
    const router = useRouter()
    const { t } = useI18n()
    const notify = useNotify()

    const formRef = ref()
    const loading = ref(false)
    const showPassword = ref(false)
    const showConfirmPassword = ref(false)
    const formModel = reactive({
      username: '',
      email: '',
      code: '',
      password: '',
      passwordConfirm: '',
    })
    const rules = reactive({
      required: (v: any) => !!v || t('rule.required'),
      passwordMinLength: (v: any) =>
        (v && v.length > 7) || t('rule.minLength', { n: 8 }),
      passwordConfirmRules: (v: any) =>
        (v && v === formModel.password) || t('rule.passwordsDoNotMatch'),
    })

    async function onSubmit(e: Event) {
      try {
        e.preventDefault()
        loading.value = true
        const isValid = formRef.value.validate()
        if (isValid) {
          await auth.forgotPasswordSubmit(
            formModel.username,
            formModel.code,
            formModel.password
          )
          notify(t('message.passwordChanged'))
          await router.push({ name: 'signin' })
        }
      } catch (error) {
        notify.error(error.message || error)
        logger.warn('[PasswordRestoreConfirm]: ', error)
        throw new Error(error)
      } finally {
        loading.value = false
      }
    }

    return () => (
      <>
        <MainAppBar class="static" />
        <main class="flex-grow container pt-[5vh] sm:pt-[15vh]">
          <h2 class="text-[2rem] dark:text-light-gray-400 font-semibold leading-none pb-6">
            {t('passwordRestoreConfirm.changePasswordHead')}
          </h2>
          <div class="w-full md:w-1/2">
            <p
              v-html={t('passwordRestoreConfirm.changePasswordSubhead')}
              class="pb-6"
            />
            <div class="pb-10">
              <Form
                ref={formRef}
                lazyValidation
                class="max-w-lg"
                {...{ onSubmit: onSubmit }}
              >
                <TextField
                  v-model={formModel.password}
                  placeholder={t('passwordRestoreConfirm.newPassword')}
                  type={showPassword.value ? 'text' : 'password'}
                  rules={[rules.required, rules.passwordMinLength]}
                  hideDetails={false}
                  class="pb-6"
                  controlClass="bg-light-gray-300 dark:bg-gray-800"
                  inputClass="placeholder-gray-200"
                  name="new-password"
                  autocomplete="new-password"
                  ariaLabel="new password input"
                  minlength="8"
                  validateOnBlur
                  stateIcon
                  required
                  v-slots={{
                    append: () => (
                      <Icon
                        class="text-gray-200 dark:text-gray-500 hover:text-gray-300 mr-1"
                        {...{
                          onClick: (e: MouseEvent) => {
                            e.preventDefault()
                            showPassword.value = !showPassword.value
                          },
                        }}
                      >
                        {showPassword.value ? ziVisible : ziHide}
                      </Icon>
                    ),
                  }}
                />
                <TextField
                  v-model={formModel.passwordConfirm}
                  placeholder={t('passwordRestoreConfirm.newPasswordConfirm')}
                  type={showConfirmPassword.value ? 'text' : 'password'}
                  rules={[
                    rules.required,
                    rules.passwordMinLength,
                    rules.passwordConfirmRules,
                  ]}
                  hideDetails={false}
                  controlClass="bg-light-gray-300 dark:bg-gray-800"
                  inputClass="placeholder-gray-200"
                  name="new-password"
                  autocomplete="new-password"
                  ariaLabel="new password input"
                  minlength="8"
                  validateOnBlur
                  stateIcon
                  required
                  v-slots={{
                    append: () => (
                      <Icon
                        class="text-gray-200 dark:text-gray-500 hover:text-gray-300 mr-1"
                        {...{
                          onClick: (e: MouseEvent) => {
                            e.preventDefault()
                            showConfirmPassword.value =
                              !showConfirmPassword.value
                          },
                        }}
                      >
                        {showConfirmPassword.value ? ziVisible : ziHide}
                      </Icon>
                    ),
                  }}
                />
              </Form>
            </div>
            <div class="pb-6">
              <Btn loading={loading.value} {...{ onClick: onSubmit }}>
                <span>{t('passwordRestoreConfirm.submit')}</span>
              </Btn>
            </div>
          </div>
        </main>
        <footer class="container">
          <Copyright class="pb-6" />
        </footer>
      </>
    )
  },
})
