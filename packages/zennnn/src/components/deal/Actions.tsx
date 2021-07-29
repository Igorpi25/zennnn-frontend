import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import {
  ziVisible,
  ziSettings,
  ziPrint,
  ziUserPlus,
  ziEmail,
} from '@zennnn/icons'
import { Btn, Icon } from '@zennnn/core'

export default defineComponent({
  emits: ['document', 'print', 'share'],

  setup(_, { emit }) {
    const route = useRoute()
    const { t } = useI18n()

    return () => (
      <div class="pb-12">
        <h4 class="text-white text-xl font-semibold leading-6 mb-4">
          {t('shipping.actions')}
        </h4>
        <div class="bg-gray-700 rounded-md p-3 select-none">
          <div class="flex flex-wrap lg:justify-between">
            <div class="w-full md:w-auto p-2">
              <Btn
                href={`/preview/${route.params.specId}`}
                outlined
                darkIcon
                class="w-full px-3"
                contentClass="w-full flex items-center"
                {...{
                  target: '_blank',
                }}
              >
                <Icon class="text-gray-100 mr-2.5">{ziVisible}</Icon>
                {t('shipping.previewAsCustomer')}
              </Btn>
            </div>
            <div class="w-full md:w-auto p-2">
              <Btn
                outlined
                darkIcon
                class="w-full border-transparent dark:border-transparent px-3"
                contentClass="w-full flex items-center"
                {...{
                  onClick: () => {
                    emit('document')
                  },
                }}
              >
                <Icon class="text-gray-100 mr-2.5">{ziSettings}</Icon>
                {t('shipping.paperConfigurator')}
              </Btn>
            </div>
            <div class="w-full md:w-auto p-2">
              <Btn
                outlined
                darkIcon
                class="w-full border-transparent dark:border-transparent px-3"
                contentClass="w-full flex items-center"
                {...{
                  onClick: () => {
                    emit('print')
                  },
                }}
              >
                <Icon class="text-gray-100 mr-2.5">{ziPrint}</Icon>
                {t('shipping.print')}
              </Btn>
            </div>
            <div class="w-full md:w-auto p-2">
              <Btn
                outlined
                darkIcon
                class="w-full border-transparent dark:border-transparent px-3"
                contentClass="w-full flex items-center"
                {...{
                  onClick: () => {
                    emit('share')
                  },
                }}
              >
                <Icon class="text-gray-100 mr-2.5">{ziUserPlus}</Icon>
                {t('shipping.inviteCustomer')}
              </Btn>
            </div>
            <div class="w-full md:w-auto p-2">
              <Btn
                outlined
                darkIcon
                disabled
                class="w-full !border-transparent dark:!border-transparent px-3"
                contentClass="w-full flex items-center"
              >
                <Icon class="mr-2.5">{ziEmail}</Icon>
                {t('shipping.notifyCustomer')}
              </Btn>
            </div>
          </div>
        </div>
      </div>
    )
  },
})
