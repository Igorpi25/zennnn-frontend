import { defineComponent, ref } from 'vue'
import { RouterView } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ziInfoBig } from '@zennnn/icons'
import { Btn } from '@zennnn/core'
import Dialog from 'shared/components/Dialog'
import ZAppBar from '@/components/core/ZAppBar'
import Copyright from '@/components/core/Copyright'
import Navbar from '@/components/core/Navbar'
import { emitter } from '@/plugins'
import { useOrgs } from '@/composables/orgs'

export default defineComponent({
  setup() {
    const { t } = useI18n()
    const { isOwner } = useOrgs()

    const systemMessage = ref('')
    const systemMessageDialog = ref(false)

    emitter.on('showSystemMessage', (message) => {
      systemMessage.value =
        message === 'ForbiddenError: Insufficient access rights'
          ? t('systemMessageModal.needPayment')
          : message
      systemMessageDialog.value = true
    })

    return () => (
      <>
        <ZAppBar />

        <main class="flex-grow">
          <Navbar />
          <RouterView />
        </main>

        <footer class="container h-12 text-center">
          <Copyright />
        </footer>

        <Dialog
          v-model={systemMessageDialog.value}
          title={t('systemMessageModal.title')}
          icon={ziInfoBig}
        >
          <div class="pb-4">{systemMessage.value}</div>
          {isOwner.value && (
            <div class="pt-4">
              <Btn to={{ name: 'subscription' }}>
                {t('systemMessageModal.goToPayment')}
              </Btn>
            </div>
          )}
        </Dialog>
      </>
    )
  },
})
