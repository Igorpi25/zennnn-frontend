import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { Alert } from '@zennnn/core'

export default defineComponent({
  setup() {
    const { t } = useI18n()

    return () => (
      <div class="container flex justify-center pt-10">
        <Alert>{t('message.documentGenerateLoading')}</Alert>
      </div>
    )
  },
})
