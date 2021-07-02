import { defineComponent, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Btn } from '@zennnn/core'

import { useReactiveVar } from 'shared/composables/reactiveVar'
import { backendVersionVar } from '@/plugins/apollo'

export default defineComponent({
  props: {
    hideUserAgreement: Boolean,
  },

  setup(props) {
    const { t } = useI18n()
    const backendVersion = useReactiveVar(backendVersionVar)
    const frontendVersion = ref(process.env.FRONTEND_VERSION || '')

    const version = computed(() => {
      return backendVersion.value
        ? `front/${frontendVersion.value} | backend/${backendVersion.value}`
        : `front/${frontendVersion.value}`
    })

    return () => (
      <div class="text-sm text-gray-100 dark:text-gray-400 leading-snug">
        <div>
          <span>&copy; 2021 ZENNNN. </span>
          {!props.hideUserAgreement && (
            <Btn
              v-html={t('app.userAgreement')}
              text
              small
              link
              to="/agreement"
            />
          )}
        </div>
        <div>{version.value}</div>
      </div>
    )
  },
})
