import { computed, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { TextField, Select } from '@zennnn/core'
import { useRoleInProject } from '@/composables/roleInProject'
import { SpecCurrency, RoleInProject } from '@/graphql/types'
import { DEFAULT_CURRENCY } from '@/config'

import type { PropType } from 'vue'
import type { EmptyNumber } from '@/types'

export default defineComponent({
  props: {
    finalCost: Number as PropType<number | null>,
    finalObtainCost: Number as PropType<number | null>,
    profit: Number as PropType<number | null>,
    totalPrepay: Number as PropType<number | null>,
    totalClientDebt: Number as PropType<number | null>,
    currency: String as PropType<SpecCurrency | null>,
    currencyRate: Number as PropType<number | null>,
    specId: {
      type: String,
      required: true,
    },
  },

  emits: ['update'],

  setup(props, { emit }) {
    const { t, n } = useI18n()
    const { hasAccess } = useRoleInProject({
      specId: props.specId,
    })

    const currency = computed(() => props.currency || DEFAULT_CURRENCY)

    const isCurrencyDisabled = computed(
      () => currency.value === SpecCurrency.USD
    )

    const currencies = computed(() =>
      Object.values(SpecCurrency).map((el) => ({
        text: el,
        value: el,
      }))
    )

    const currencySymbol = computed(() =>
      t(`currency.${currency.value}.symbol`)
    )

    return () => (
      <div class="w-full">
        <h4 class="text-white text-xl font-semibold leading-6 mb-4">
          {t('shipping.financialInfo')}
        </h4>
        <div class="bg-gray-700 rounded-md leading-5 p-5">
          <div class="flex text-gray-200 px-2.5 pb-3">
            <div class="flex-grow">
              {t('shipping.finalCost')} {currencySymbol.value}
            </div>
            <div class="text-white text-right">
              {n(props.finalCost || 0, 'fixed')}
            </div>
          </div>
          <div class="border-b border-gray-900 mx-2.5" />
          <div class="flex text-gray-200 px-2.5 py-3">
            <div class="flex-grow">
              {t('shipping.finalObtainCost')}
              {currencySymbol.value}
            </div>
            <div class="text-white text-right">
              {n(props.finalObtainCost || 0, 'fixed')}
            </div>
          </div>
          <div class="border-b border-gray-900 mx-2.5" />
          <div class="flex text-gray-200 px-2.5 py-3">
            <div class="flex-grow">
              {t('shipping.profit')} {currencySymbol.value}
            </div>
            <div
              class={[
                'text-right',
                props.profit && props.profit > 0
                  ? 'text-green-500'
                  : ' text-white',
              ]}
            >
              {n(props.profit || 0, 'fixed')}
            </div>
          </div>
          <div class="rounded-md bg-gray-500 text-gray-200 px-2.5 py-2">
            <div class="flex py-2">
              <div class="flex-grow">
                {t('shipping.totalPrepay')}
                {currencySymbol.value}
              </div>
              <div class="text-right">{n(props.totalPrepay || 0, 'fixed')}</div>
            </div>
            <div class="border-b border-gray-900" />
            <div class="flex py-2">
              <div class="flex-grow">
                {t('shipping.totalClientDebt')}
                {currencySymbol.value}
              </div>
              <div
                class={[
                  'text-right',
                  props.totalClientDebt && props.totalClientDebt > 0
                    ? 'text-red-600'
                    : ' text-white',
                ]}
              >
                {n(props.totalClientDebt || 0, 'fixed')}
              </div>
            </div>
          </div>
        </div>
        {hasAccess(RoleInProject.MANAGER) && (
          <div class="flex items-center bg-gray-700 rounded-md p-5 mt-4">
            <div class="flex-grow text-gray-100">
              <span>{t('shipping.documentRate')} </span>
              <Select
                modelValue={currency.value}
                items={currencies.value}
                controlClass="px-0"
                inputClass="w-0 min-h-0 h-0 !m-0"
                class="inline-flex"
                solo
                onSelect={(val: EmptyNumber) =>
                  emit('update', { currency: val })
                }
                // TODO: in select replace input to div
                v-slots={{
                  prepend: () => (
                    <span class="text-sm pl-1">{currency.value}</span>
                  ),
                  item: ({ item }: { item: typeof currencies.value[0] }) => (
                    <span class="text-sm px-1">{item.text}</span>
                  ),
                }}
              />
            </div>
            <div class="w-20 mr-2">
              <TextField
                modelValue={props.currencyRate}
                placeholder={t('placeholder.emptyNumber')}
                disabled={isCurrencyDisabled.value}
                number
                onChange={(val: EmptyNumber) =>
                  emit('update', { currencyRate: val })
                }
              />
            </div>
            <div class="text-gray-200">{t('currency.USD.iso-4217')}</div>
          </div>
        )}
      </div>
    )
  },
})
