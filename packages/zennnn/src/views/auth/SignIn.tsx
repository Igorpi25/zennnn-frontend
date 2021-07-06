import { defineComponent, ref, reactive } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ziVisible, ziHide, ziMoon, ziMoonOutline } from '@zennnn/icons'
import { Icon, Btn, Form, TextField, Modal } from '@zennnn/core'
import Logo from 'shared/components/Logo'
import LocalePicker from 'shared/components/LocalePicker'
import Social from '@/components/core/Social'
import Copyright from '@/components/core/Copyright'
import AuthCompleteForm from '@/components/AuthCompleteForm'
import { auth, logger, useNotify, useTheme } from '@/plugins'

import type { LocaleActivatorSlotProps } from 'shared/components/LocalePicker'

export default defineComponent({
  setup() {
    const route = useRoute()
    const router = useRouter()
    const { t } = useI18n()
    const notify = useNotify()
    const { isDark } = useTheme()

    const cognitoUser = ref<any>()
    const completeFormDialog = ref(false)

    const formRef = ref()
    const formModel = reactive({
      login: '',
      password: '',
    })
    const formValidity = ref(false)
    const loading = ref(false)
    const showPassword = ref(false)

    const rules = reactive({
      required: (v: any) => !!v || t('rule.required'),
      email: (v: string) => /.+@.+\..+/.test(v) || t('rule.email'),
      passwordMinLength: (v: string | undefined) =>
        (v && v.length > 7) || t('rule.minLength', { n: 8 }),
    })

    async function onSubmit(e: MouseEvent) {
      try {
        e.preventDefault()
        loading.value = true
        const isValid = formRef.value.validate()
        if (isValid) {
          const user = await auth.signIn(formModel.login, formModel.password)
          if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
            cognitoUser.value = user
            completeFormDialog.value = true
            // TODO: save user to cache and redirect to Registration.vue view
            // await router.push({ path: '/complete-registration' })
          } else {
            logger.info('Logged in user', user)
            if (route.query.redirect) {
              await router.replace({ path: route.query.redirect as string })
            } else {
              await router.replace({ name: 'main' })
            }
          }
        }
      } catch (error) {
        let message = error.message || error
        if (error.code === 'UserNotConfirmedException') {
          message = t('message.userNotConfirmed')
        }
        notify.error(message)
        logger.warn('[SignIn]: ', error)
        throw new Error(error)
      } finally {
        loading.value = false
      }
    }

    async function onAuthComplete() {
      try {
        if (route.query.redirect) {
          await router.replace({ path: route.query.redirect as string })
        } else {
          await router.replace({ name: 'main' })
        }
      } catch (error) {
        logger.warn('[SignIn]: ', error.message || error)
      }
    }

    return () => (
      <>
        <div class="flex-grow flex">
          <div class="w-[44%] container flex-shrink-0 hidden sm:flex flex-col bg-light-gray-100 dark:bg-gray-700 px-4 md:px-6 xl:px-[4.5rem]">
            <div class="sm:pt-[25vh] lg:pt-[30vh] flex-grow lg:pl-8">
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
              <div class="lg:pl-12">
                <h2
                  v-html={t('signin.title')}
                  class="text-3xl md:text-4xl text-gray-200 dark:text-gray-100 font-semibold leading-tight md:leading-tight pb-4"
                />
                <h3
                  class="text-xl md:text-2xl text-gray-100 dark:text-gray-200 leading-relaxed md:leading-relaxed"
                  v-html={t('signin.subtitle')}
                />
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
                    <span class="pr-1">{t('signin.noAccount')}</span>
                    <Btn
                      text
                      link
                      to={{ name: 'signup' }}
                      class="focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                    >
                      {t('signin.signup')}
                    </Btn>
                  </div>
                </div>
              </div>
            </div>
            <div class="sm:pt-[25vh] lg:pt-[30vh] flex flex-col justify-center sm:block w-full max-w-sm flex-grow mx-auto sm:mx-0 lg:ml-24">
              <h1 class="pb-10 font-semibold text-2xl">
                {t('signin.formTitle')}
              </h1>
              <Form
                ref={formRef}
                v-model={[formValidity.value, 'valid']}
                {...{
                  onSubmit: onSubmit,
                }}
              >
                <TextField
                  v-model={formModel.login}
                  placeholder={t('signin.login')}
                  rules={[rules.required, rules.email]}
                  hideDetails={false}
                  class="pb-6"
                  controlClass="bg-light-gray-300 dark:bg-gray-800"
                  inputClass="placeholder-gray-200"
                  type="email"
                  name="email"
                  autocomplete="email"
                  ariaLabel="email input"
                  autofocus
                  validateOnBlur
                />
                <TextField
                  v-model={formModel.password}
                  placeholder={t('signin.password')}
                  type={showPassword.value ? 'text' : 'password'}
                  rules={[rules.required, rules.passwordMinLength]}
                  hideDetails={false}
                  class="pb-6"
                  controlClass="bg-light-gray-300 dark:bg-gray-800" // for autofill: h-10 justify-end pr-0
                  inputClass="placeholder-gray-200" // for autofill: absolute w-full pr-9
                  name="password"
                  autocomplete="current-password"
                  ariaLabel="password input"
                  minlength="8"
                  validateOnBlur
                  v-slots={{
                    append: () => (
                      <Icon
                        class="text-gray-200 dark:text-gray-500 hover:text-gray-300 mr-1" // for autofill: relative mr-2
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
                <div class="pb-6">
                  <Btn
                    text
                    link
                    to={{ name: 'password-restore' }}
                    class="focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                  >
                    {t('signin.forgotPassword')}
                  </Btn>
                </div>
                <Btn
                  disabled={!formValidity.value}
                  loading={loading.value}
                  class="w-full sm:w-48"
                  {...{ onClick: onSubmit }}
                >
                  {t('signin.submit')}
                </Btn>
              </Form>
            </div>
            <div class="py-5 md:pb-8 lg:pl-24">
              <Social class="sm:hidden justify-center mb-1 pb-6" />
              <Copyright class="mx-auto text-center sm:text-left sm:mx-0" />
            </div>
          </div>
        </div>
        <Modal
          v-model={completeFormDialog.value}
          persistent
          maxWidth="448"
          contentClass="p-6"
        >
          <AuthCompleteForm
            cognitoUser={cognitoUser.value}
            {...{ onComplete: onAuthComplete }}
          />
        </Modal>
      </>
    )
  },
})
