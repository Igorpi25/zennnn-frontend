import { defineComponent, Transition } from 'vue'
import { useI18n } from 'vue-i18n'
import { ziStatusPointSm } from '@zennnn/icons'
import { Icon } from '@zennnn/core'

import type { PropType } from 'vue'

export default defineComponent({
  props: {
    requiredFilled: Boolean as PropType<boolean | null>,
    optionalFilled: Boolean as PropType<boolean | null>,
  },

  setup(props) {
    const { t } = useI18n()

    return () => (
      <div class="flex items-center justify-end text-gray-200 dark:text-gray-100 space-x-5">
        <Transition name="slide-x-reverse-transition">
          {!props.requiredFilled && (
            <div class="flex items-center whitespace-nowrap py-1">
              <Icon class="text-pink-500">{ziStatusPointSm}</Icon>
              <span>{t('print.required')}</span>
            </div>
          )}
        </Transition>
        <Transition name="slide-x-reverse-transition">
          {!props.optionalFilled && (
            <div class="flex items-center whitespace-nowrap py-1">
              <Icon class="text-yellow-500">{ziStatusPointSm}</Icon>
              <span>{t('print.warning')}</span>
            </div>
          )}
        </Transition>
      </div>
    )
  },
})
