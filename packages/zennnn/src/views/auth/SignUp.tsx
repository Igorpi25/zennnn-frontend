import { defineComponent, ref, reactive, computed } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useMutation } from '@vue/apollo-composable'
import {
  ziVisible,
  ziHide,
  ziChecked,
  ziMoon,
  ziMoonOutline,
} from '@zennnn/icons'
import { Btn, Icon, Form, TextField, Checkbox } from '@zennnn/core'
import Logo from 'shared/components/Logo'
import LocalePicker from 'shared/components/LocalePicker'
import { useNotify } from 'shared/composables/notify'
import { useTheme } from 'shared/composables/theme'
import Social from '@/components/core/Social'
import Copyright from '@/components/core/Copyright'
import { SIGNUP } from '@/graphql/mutations'
import { logger } from '@/plugins'

import type { Signup, SignupVariables } from '@/graphql/types'
import type { LocaleActivatorSlotProps } from 'shared/components/LocalePicker'

export default defineComponent({
  setup() {
    const router = useRouter()
    const { t, locale } = useI18n()
    const notify = useNotify()
    const { isDark } = useTheme()

    const { mutate } = useMutation<Signup, SignupVariables>(SIGNUP)

    const formRef = ref()
    const formModel = reactive({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    })

    const formValidity = ref(false)
    const loading = ref(false)
    const showPassword = ref(false)

    const rules = reactive({
      check: (v: any) => !!v || t('signup.check'),
      required: (v: any) => !!v || t('rule.required'),
      email: (v: string) => /.+@.+\..+/.test(v) || t('rule.email'),
      passwordMinLength: (v: string | undefined) =>
        (v && v.length > 7) || t('rule.minLength', { n: 8 }),
    })

    const policyHtml = computed(
      () => `${t(
        'signup.acceptPolicyAndTerms'
      )}&nbsp;<a href="/policy" class="text-blue-500 hover:text-blue-400 focus:ring focus:ring-blue-400 focus:outline-none with-focus-visible">
        ${t('signup.privacyPolicy')}</a> ${t(
        'preposition.and'
      )}&nbsp;<a href="/agreenemt" class="text-blue-500 hover:text-blue-400 focus:ring focus:ring-blue-400 focus:outline-none with-focus-visible">${t(
        'signup.termsOfUse'
      )}</a>`
    )

    async function onSubmit(e: Event) {
      try {
        e.preventDefault()
        loading.value = true
        const isValid = formRef.value.validate()
        if (isValid) {
          const { firstName, lastName, email, password } = formModel
          const response = await mutate({
            email,
            password,
            givenName: firstName,
            familyName: lastName,
            locale: locale.value,
          })
          const user = response?.data?.signup
          logger.info('Registered user', user)
          const username = (user && user.email) || ''
          await router.push({ name: 'welcome', query: { username } })
        }
      } catch (error) {
        notify.error(error.message || error)
        logger.warn('[SignUp]: ', error)
        throw new Error(error)
      } finally {
        loading.value = false
      }
    }

    return () => (
      <div class="flex-grow flex">
        <div class="w-[44%] container flex-shrink-0 hidden sm:flex flex-col bg-light-gray-100 dark:bg-gray-700 px-4 md:px-6 xl:px-[4.5rem]">
          <div class="sm:pt-[15vh] lg:pt-[20vh] xl:pt-[25vh] flex-grow lg:pl-8">
            <div
              class="bg-fixed bg-no-repeat absolute pointer-events-none inset-0"
              style={{
                backgroundPosition: '-300px 380px',
                backgroundImage: `url(${
                  require('@/assets/img/cloud.svg').default
                })`,
              }}
            />
            <div class="flex items-center h-8 mb-10 lg:pl-12">
              <RouterLink
                to="/"
                class="text-gray-900 dark:text-white focus:ring focus:ring-blue-400 focus:outline-none with-focus-visible"
              >
                <Logo />
              </RouterLink>
            </div>
            <div>
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <div class="flex text-lg text-gray-100 pb-6">
                    <div class="mr-4">
                      <Icon large class="text-blue-500">
                        {ziChecked}
                      </Icon>
                    </div>
                    <div v-html={t(`signup.feat${i + 1}`)} class="pt-1" />
                  </div>
                ))}
            </div>
          </div>
          <Social class="mb-2 py-6 md:pb-8 lg:pl-20" />
        </div>
        <div class="container flex-grow flex flex-col px-4 md:px-6 xl:px-[4.5rem]">
          <div class="relative">
            <div class="sm:absolute sm:top-0 sm:right-0">
              <div class="max-w-sm mx-auto sm:max-w-none sm:mx-0 flex items-center justify-between sm:justify-end flex-wrap sm:flex-nowrap text-gray-200 lg:pr-20 pt-5 sm:pt-7">
                <RouterLink
                  to="/"
                  class="sm:hidden text-gray-900 dark:text-white focus:ring focus:ring-blue-400 focus:outline-none with-focus-visible"
                >
                  <Logo />
                </RouterLink>
                <div class="flex space-x-2">
                  <Btn
                    icon
                    small
                    retainFocusOnClick
                    class="bg-light-gray-300 dark:bg-gray-650 text-gray-900 dark:text-white hover:text-white"
                    {...{
                      onClick: () => {
                        isDark.value = !isDark.value
                      },
                    }}
                  >
                    <Icon>{isDark.value ? ziMoon : ziMoonOutline}</Icon>
                  </Btn>
                  <LocalePicker
                    v-slots={{
                      activator: ({
                        active,
                        icon,
                        locale,
                      }: LocaleActivatorSlotProps) => (
                        <Btn
                          icon
                          small
                          class={{
                            'w-10 bg-light-gray-300 dark:bg-gray-650 text-gray-900 dark:text-white hover:text-white':
                              true,
                            'bg-blue-550 dark:bg-blue-550': active,
                          }}
                        >
                          <img
                            src={
                              icon
                                ? require(`@zennnn/icons/flags/${icon}.svg`)
                                    .default
                                : undefined
                            }
                            alt={locale}
                          />
                        </Btn>
                      ),
                    }}
                    class="sm:pr-4"
                  />
                </div>
                <div class="sm:inline-block w-full sm:w-auto text-center py-5 sm:py-0">
                  <span class="pr-1">{t('signup.hasAccount')}</span>
                  <Btn
                    link
                    to={{ name: 'signin' }}
                    class="focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                  >
                    <span>{t('signup.signin')}</span>
                  </Btn>
                </div>
              </div>
            </div>
          </div>
          <div class="sm:pt-[15vh] lg:pt-[20vh] xl:pt-[25vh] flex flex-col justify-center sm:block w-full max-w-sm flex-grow mx-auto sm:mx-0 lg:ml-24">
            <h1 class="pb-10 font-semibold text-2xl">
              {t('signup.registration')}
            </h1>
            <Form ref={formRef} v-model={[formValidity.value, 'valid']}>
              <TextField
                v-model={formModel.firstName}
                placeholder={t('signup.firstName')}
                rules={[rules.required]}
                hideDetails={false}
                class="pb-6"
                controlClass="bg-light-gray-300 dark:bg-gray-800"
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
                v-model={formModel.lastName}
                placeholder={t('signup.lastName')}
                rules={[rules.required]}
                hideDetails={false}
                class="pb-6"
                controlClass="bg-light-gray-300 dark:bg-gray-800"
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
                controlClass="bg-light-gray-300 dark:bg-gray-800"
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
                placeholder={t('signup.password')}
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
              <Checkbox
                rules={[rules.check]}
                hideDetails={false}
                class="pb-6"
                required
              >
                <span class="ml-3 float-left" v-html={policyHtml.value} />
              </Checkbox>
              <Btn
                disabled={!formValidity.value}
                loading={loading.value}
                class="w-full sm:w-48"
                {...{ onClick: onSubmit }}
              >
                {t('signup.submit')}
              </Btn>
            </Form>
          </div>
          <div class="py-5 md:pb-8 lg:pl-24">
            <Social class="sm:hidden justify-center mb-1 pb-6" />
            <Copyright class="mx-auto text-center sm:text-left sm:mx-0" />
          </div>
        </div>
      </div>
    )
  },
})
