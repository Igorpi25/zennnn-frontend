import { defineComponent, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

import { Btn } from '@zennnn/core'
import MainAppBar from '@/components/core/MainAppBar'
import Copyright from '@/components/core/Copyright'
import { auth, logger, useNotify } from '@/plugins'

export default defineComponent({
  setup() {
    const { t } = useI18n()
    const route = useRoute()
    const notify = useNotify()

    const loading = ref(false)

    async function resendSignUp() {
      try {
        if (!route.query.username) {
          throw new Error('User name not setted on "resendSignUp".')
        }
        loading.value = true
        await auth.resendSignUp(route.query.username as string)
        notify.success(t('message.emailResent'))
      } catch (error) {
        logger.warn('[Resend SignUp]: ', error)
        notify.warn(t('message.failedToSent'))
        throw new Error(error)
      } finally {
        loading.value = false
      }
    }

    return () => (
      <>
        <MainAppBar class="static" />
        <main class="flex-grow container relative pt-[5vh] sm:pt-[15vh]">
          <h2 class="text-[2rem] dark:text-light-gray-400 font-semibold leading-none pb-6">
            {t('welcome.title')}
          </h2>
          <div class="w-full md:w-1/2">
            <p v-html={t('welcome.subtitle')} class="pb-6" />
            {route.query.username && (
              <>
                <p class="text-2xl dark:text-white pb-10">
                  {route.query.username}
                </p>
                <div class="pb-6">
                  <Btn loading={loading.value} {...{ onClick: resendSignUp }}>
                    <span>{t('welcome.resend')}</span>
                  </Btn>
                </div>
              </>
            )}
            <p
              v-html={t('welcome.hint')}
              class="text-gray-200 leading-tight pb-6"
            />
          </div>
          <div class="hidden md:block absolute container right-0 bottom-0 pb-16">
            <img
              class="ml-auto pb-2"
              src={require('@/assets/img/person-sitting.svg').default}
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
