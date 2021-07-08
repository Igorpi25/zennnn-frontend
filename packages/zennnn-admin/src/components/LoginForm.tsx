import { defineComponent, ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ziHide, ziVisible } from '@zennnn/icons'
import { Btn, Form, TextField, Icon } from '@zennnn/core'
import { auth, logger, useNotify } from '@/plugins'

export default defineComponent({
  emits: {
    complete: (v) => !!v,
  },

  setup(props, { emit }) {
    const { t } = useI18n()
    const notify = useNotify()
    const route = useRoute()
    const router = useRouter()

    const rules = reactive({
      required: (v: any) => !!v || t('rule.required'),
      passwordMinLength: (v: any) =>
        (v && v.length > 7) || t('rule.minLength', { n: 8 }),
    })

    const formRef = ref()
    const formModel = reactive({
      login: '',
      password: '',
    })
    const validity = ref(false)
    const loading = ref(false)
    const showPassword = ref(false)

    async function onSubmit(e: Event) {
      try {
        e.preventDefault()
        loading.value = true
        const isValid = formRef.value.validate()
        if (isValid) {
          const user = await auth.signIn(formModel.login, formModel.password)
          if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
            emit('complete', user)
          } else {
            if (route.query.redirect) {
              await router.replace({ path: route.query.redirect as string })
            } else {
              await router.replace({ name: 'Words' })
            }
          }
        }
      } catch (error) {
        let message = error.message || error
        if (error.code === 'UserNotConfirmedException') {
          message = t('message.userNotConfirmed')
        }
        logger.warn('[Login]', error)
        notify.error(message as string)
      } finally {
        loading.value = false
      }
    }

    return () => (
      <Form
        ref={formRef}
        v-model={[validity.value, 'valid']}
        {...{
          onSubmit: onSubmit,
        }}
      >
        <TextField
          v-model={formModel.login}
          placeholder={t('signin.login')}
          rules={[rules.required]}
          hideDetails={false}
          class="pb-6"
          controlClass="bg-light-gray-300 dark:bg-gray-800"
          inputClass="placeholder-gray-200"
          name="login"
          autocomplete="username"
          ariaLabel="login input"
          autofocus
          validateOnBlur
          required
        />
        <TextField
          v-model={formModel.password}
          placeholder={t('signin.password')}
          type={showPassword.value ? 'text' : 'password'}
          rules={[rules.required, rules.passwordMinLength]}
          hideDetails={false}
          class="pb-6"
          controlClass="bg-light-gray-300 dark:bg-gray-800"
          inputClass="placeholder-gray-200"
          name="password"
          autocomplete="current-password"
          ariaLabel="password input"
          minlength="8"
          validateOnBlur
          required
          v-slots={{
            append: () => (
              <Icon
                class="text-gray-200 dark:text-gray-500 hover:text-gray-300 pr-1"
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
        <Btn
          loading={loading.value}
          class="w-full sm:w-48"
          {...{
            onClick: onSubmit,
          }}
        >
          {t('signin.submit')}
        </Btn>
      </Form>
    )
  },
})
