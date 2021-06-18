import { defineComponent, ref, reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ziHide, ziVisible } from '@zennnn/icons'
import { Btn, Form, TextField, Icon, Alert } from '@zennnn/core'
import { auth, logger } from '@/plugins'

export default defineComponent({
  props: {
    cognitoUser: Object,
  },

  setup(props) {
    const { t } = useI18n()
    const route = useRoute()
    const router = useRouter()

    const rules = reactive({
      required: (v: any) => !!v || t('rule.required'),
      email: (v: string) => /.+@.+\..+/.test(v) || t('rule.email'),
      passwordMinLength: (v: any) =>
        (v && v.length > 7) || t('rule.minLength', { n: 8 }),
    })

    const formRef = ref()
    const formModel = reactive({
      username: '',
      password: '',
    })
    const validity = ref(false)
    const loading = ref(false)
    const showPassword = ref(false)
    const errorMessage = ref('')
    const username = computed(
      () => props.cognitoUser && props.cognitoUser.username
    )

    async function onSubmit(e: Event) {
      try {
        e.preventDefault()
        errorMessage.value = ''
        loading.value = true
        const isValid = formRef.value.validate()
        if (isValid && props.cognitoUser) {
          const loggedInUser = await auth.completeNewPassword(
            props.cognitoUser,
            formModel.password
          )
          logger.info('Registered complite user', loggedInUser)
          await auth.signIn(username.value, formModel.password)
          if (route.query.redirect) {
            await router.replace({ path: route.query.redirect as string })
          } else {
            await router.replace({ name: 'Words' })
          }
        }
      } catch (error) {
        const message = error.message || error
        errorMessage.value = message
        logger.warn('[CompleteNewPassword]', error)
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
          modelValue={username.value}
          placeholder={t('signin.login')}
          class="pb-6"
          name="username"
          ariaLabel="username input"
          readonly
        />
        <TextField
          v-model={formModel.password}
          placeholder={t('signin.password')}
          type={showPassword.value ? 'text' : 'password'}
          rules={[rules.required, rules.passwordMinLength]}
          hideDetails={false}
          class="pb-6"
          name="new-password"
          autocomplete="new-password"
          ariaLabel="new password input"
          minlength="8"
          validateOnBlur
          stateIcon
          required
        >
          <template v-slot:append>
            <Icon
              class="text-gray-500 hover:text-gray-300 pr-1"
              {...{
                onClick: (e: MouseEvent) => {
                  e.preventDefault()
                  showPassword.value = !showPassword.value
                },
              }}
            >
              {showPassword.value ? ziVisible : ziHide}
            </Icon>
          </template>
        </TextField>
        <Alert
          v-model={errorMessage.value}
          close
          color="error"
          class="mb-6"
          transition="slide-y-transition"
        >
          {errorMessage.value}
        </Alert>
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
