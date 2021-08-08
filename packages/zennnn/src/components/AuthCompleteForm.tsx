import { defineComponent, ref, reactive, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMutation } from '@vue/apollo-composable'
import { ziHide, ziVisible } from '@zennnn/icons'
import { Btn, Form, TextField, Icon, Alert, Checkbox } from '@zennnn/core'
import { auth, logger } from '@/plugins'
import { COMPLITE_REGISTRATION } from '@/graphql/mutations'

import type {
  CompliteRegistration,
  CompliteRegistrationVariables,
} from '@/graphql/types'

export default defineComponent({
  props: {
    cognitoUser: Object,
  },

  emits: ['complete'],

  setup(props, { emit }) {
    const { t } = useI18n()

    const { mutate, onDone } = useMutation<
      CompliteRegistration,
      CompliteRegistrationVariables
    >(COMPLITE_REGISTRATION)

    onDone(() => {
      emit('complete')
    })

    const rules = reactive({
      check: (v: any) => !!v || t('signup.check'),
      required: (v: any) => !!v || t('rule.required'),
      email: (v: string) => /.+@.+\..+/.test(v) || t('rule.email'),
      passwordMinLength: (v: any) =>
        (v && v.length > 7) || t('rule.minLength', { n: 8 }),
    })

    const formRef = ref()
    const formModel = reactive({
      email: '',
      givenName: '',
      familyName: '',
      password: '',
    })
    const formValidity = ref(false)
    const loading = ref(false)
    const showPassword = ref(false)
    const errorMessage = ref('')

    const policyHtml = computed(
      () => `${t(
        'signup.acceptPolicyAndTerms'
      )}&nbsp;<a class="text-blue-500 hover:text-blue-400 focus:ring focus:ring-blue-400 focus:outline-none with-focus-visible" href="#">
      ${t('signup.privacyPolicy')}</a> ${t(
        'preposition.and'
      )}&nbsp;<a class="text-blue-500 hover:text-blue-400 focus:ring focus:ring-blue-400 focus:outline-none with-focus-visible" href="#">${t(
        'signup.termsOfUse'
      )}</a>`
    )

    watch(
      () => props.cognitoUser,
      (val) => {
        formModel.email = val?.email
        formModel.givenName = val?.attrs?.given_name
        formModel.familyName = val?.attrs?.family_name
      }
    )

    async function onSubmit(e: Event) {
      try {
        e.preventDefault()
        errorMessage.value = ''
        loading.value = true
        const isValid = formRef.value.validate()
        if (isValid && props.cognitoUser) {
          const { givenName, familyName, password } = formModel
          const loggedInUser = await auth.completeNewPassword(
            props.cognitoUser,
            password,
            {
              given_name: givenName,
              family_name: familyName,
            }
          )
          logger.info('Registered complite user', loggedInUser)
          await auth.signIn(props.cognitoUser.username, formModel.password)
          await mutate({
            givenName,
            familyName,
          })
        }
      } catch (error) {
        const message = error.message || error
        errorMessage.value = message
        logger.warn('[CompleteNewPassword]: ', error)
        throw new Error(error)
      } finally {
        loading.value = false
      }
    }

    return () => (
      <Form
        ref={formRef}
        v-model={[formValidity.value, 'valid']}
        {...{
          onSubmit: onSubmit,
        }}
      >
        <h4 class="text-xl font-semibold pb-6">{t('signup.registration')}</h4>
        <div class="w-full pb-6">
          <p class="text-gray-900 dark:text-white">
            <span>{t('signup.compliteRegistration')}</span>&nbsp;
            <span class="text-gray-100">{t('signup.registerContent')}</span>
          </p>
        </div>
        <TextField
          v-model={formModel.givenName}
          placeholder={t('signup.firstName')}
          rules={[rules.required]}
          hideDetails={false}
          class="pb-6"
          controlClass="bg-light-gray-300 dark:bg-gray-900"
          inputClass="placeholder-gray-200"
          name="given-name"
          autocomplete="given-name"
          ariaLabel="given name input"
          validateOnBlur
          autofocus
          stateIcon
          required
        />
        <TextField
          v-model={formModel.familyName}
          placeholder={t('signup.lastName')}
          rules={[rules.required]}
          hideDetails={false}
          class="pb-6"
          controlClass="bg-light-gray-300 dark:bg-gray-900"
          inputClass="placeholder-gray-200"
          name="family-name"
          autocomplete="family-name"
          ariaLabel="family name input"
          validateOnBlur
          stateIcon
          required
        />
        <TextField
          v-model={formModel.email}
          placeholder={t('signup.login')}
          rules={[rules.required, rules.email]}
          hideDetails={false}
          class="pb-6"
          controlClass="bg-light-gray-300 dark:bg-gray-900"
          inputClass="placeholder-gray-200"
          type="email"
          name="email"
          autocomplete="email"
          ariaLabel="email input"
          validateOnBlur
          stateIcon
          required
        />
        <TextField
          v-model={formModel.password}
          placeholder={t('signin.password')}
          type={showPassword.value ? 'text' : 'password'}
          rules={[rules.required, rules.passwordMinLength]}
          hideDetails={false}
          class="pb-6"
          controlClass="bg-light-gray-300 dark:bg-gray-900"
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
        <Checkbox rules={[rules.check]} hideDetails={false} class="pb-6">
          <span class="ml-3 float-left" v-html={policyHtml.value} />
        </Checkbox>
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
          disabled={!formValidity.value}
          loading={loading.value}
          class="w-full sm:w-48"
          onClick={onSubmit}
        >
          {t('signup.submit')}
        </Btn>
      </Form>
    )
  },
})
