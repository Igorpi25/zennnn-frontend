import { defineComponent, ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { Btn, Form, TextField } from '@zennnn/core'
import MainAppBar from '@/components/core/MainAppBar'
import Copyright from '@/components/core/Copyright'
import { auth, logger, useNotify } from '@/plugins'

export default defineComponent({
  setup() {
    const { t } = useI18n()
    const notify = useNotify()

    const emailInputRef = ref()
    const formRef = ref()
    const loading = ref(false)
    const successMessage = ref('')
    const formModel = reactive({
      email: '',
    })
    const rules = reactive({
      required: (v: any) => !!v || t('rule.required'),
      email: (v: string) => /.+@.+\..+/.test(v) || t('rule.email'),
    })

    async function onSubmit(e: Event) {
      try {
        e.preventDefault()
        loading.value = true
        successMessage.value = ''
        const isValid = formRef.value.validate()
        if (isValid) {
          const response = await auth.forgotPassword(formModel.email)
          logger.info('[PasswordRestore response]: ', response)
          if (response) {
            successMessage.value = t('message.emailSent', {
              email: formModel.email,
            })
            notify.success(successMessage.value)
            formRef.value.reset()
          }
        } else {
          emailInputRef.value?.focus()
        }
      } catch (error) {
        notify.error(error.message || error)
        logger.warn('[PasswordRestore]: ', error)
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
            {t('passwordRestore.accessRecoveryHead')}
          </h2>
          <div class="w-full md:w-1/2">
            <p v-html={t('passwordRestore.subtitle')} class="pb-6" />
            <div class="pb-10">
              <Form
                ref={formRef}
                lazyValidation
                class="max-w-lg"
                {...{ onSubmit: onSubmit }}
              >
                <TextField
                  ref={emailInputRef}
                  v-model={formModel.email}
                  label={t('passwordRestore.emailLabel')}
                  placeholder={t('companyDetail.placeholder.email')}
                  rules={[rules.required, rules.email]}
                  hideDetails={false}
                  controlClass="bg-light-gray-300 dark:bg-gray-800"
                  inputClass="placeholder-gray-200"
                  type="email"
                  name="email"
                  autocomplete="email"
                  ariaLabel="email input"
                  autofocus
                  validateOnBlur
                  stateIcon
                  required
                />
              </Form>
            </div>
            <div class="pb-6">
              <Btn loading={loading.value} {...{ onClick: onSubmit }}>
                <span>{t('welcome.resend')}</span>
              </Btn>
            </div>
            <p
              v-html={t('passwordRestore.hint')}
              class="text-gray-200 leading-tight pb-6"
            />
          </div>
        </main>
        <footer class="container">
          <Copyright class="pb-6" />
        </footer>
      </>
    )
  },
})
