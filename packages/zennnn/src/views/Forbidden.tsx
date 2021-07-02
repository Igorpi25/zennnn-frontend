import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useApolloClient } from '@vue/apollo-composable'
import { Btn } from '@zennnn/core'
import MainAppBar from '@/components/core/MainAppBar'
import { auth } from '@/plugins'

export default defineComponent({
  setup() {
    const router = useRouter()
    const { t } = useI18n()
    const { resolveClient } = useApolloClient()

    async function logout() {
      await auth.signOut()
      resolveClient().resetStore()
      // TODO: clear CURRENT_ORG_STORE_KEY
      await router.push({ name: 'signin' })
    }

    return () => (
      <>
        <MainAppBar />
        <div class="container flex-grow flex flex-col items-center">
          <div class="flex-1"></div>
          <div class="dark:text-white max-w-[330px] mx-auto text-center">
            <div class="flex justify-center space-x-3 mb-4">
              <svg
                width="41"
                height="38"
                viewBox="0 0 41 38"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20.7502 10.8024C19.488 10.8024 18.4648 11.8256 18.4648 13.0878V22.4437C18.4648 23.7059 19.488 24.7291 20.7502 24.7291C22.0124 24.7291 23.0357 23.7059 23.0357 22.4437V13.0878C23.0357 11.8256 22.0124 10.8024 20.7502 10.8024Z"
                  fill="currentColor"
                />
                <path
                  d="M20.7502 26.4081C19.488 26.4081 18.4648 27.4314 18.4648 28.6936C18.4648 29.9558 19.488 30.979 20.7502 30.979C22.0124 30.979 23.0357 29.9558 23.0357 28.6936C23.0357 27.4314 22.0124 26.4081 20.7502 26.4081Z"
                  fill="currentColor"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M15.7198 3.81305C17.9555 -0.059183 23.5445 -0.0591824 25.7802 3.81305L39.9632 28.3787C42.1988 32.2509 39.4043 37.0912 34.933 37.0912H6.56701C2.09574 37.0912 -0.698796 32.2509 1.53684 28.3787L15.7198 3.81305ZM22.8113 5.52711C21.8952 3.94031 19.6048 3.94031 18.6887 5.52711L4.50569 30.0928C3.58954 31.6796 4.73472 33.6631 6.56701 33.6631H34.933C36.7653 33.6631 37.9105 31.6796 36.9943 30.0928L22.8113 5.52711Z"
                  fill="currentColor"
                />
              </svg>

              <div class="font-semibold text-5xl">403</div>
            </div>
            <div class="text-sm mb-8">
              <p v-html={t('forbidden.text')}></p>
            </div>
            <Btn small {...{ onClick: logout }}>
              {t('forbidden.logout')}
            </Btn>
          </div>
          <div class="flex-2"></div>
        </div>
      </>
    )
  },
})
