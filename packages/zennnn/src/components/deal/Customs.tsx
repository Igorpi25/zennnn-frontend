import { computed, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { ziGlobe } from '@zennnn/icons'
import { TextField, TextArea, Select, Autocomplete, Icon } from '@zennnn/core'
import { ShipmentType } from '@/graphql/types'
import Countries from '@/assets/countries/codes.json'
import { CustomsTerms, CustomsTermsMore } from '@/types'

import type { PropType } from 'vue'
import type { GetSpec_getSpec_customs } from '@/graphql/types'
import type { EmptyNumber, EmptyString } from '@/types'

export default defineComponent({
  props: {
    shipmentType: {
      type: String as PropType<ShipmentType | null>,
      default: null,
    },
    item: {
      type: Object as PropType<GetSpec_getSpec_customs | null>,
      default: () => ({}),
    },
    amount: {
      type: Number as PropType<number | null>,
      default: 0,
    },
    amountInWords: String as PropType<string | null>,
    amountInWordsClientLang: String as PropType<string | null>,
  },

  emits: ['update'],

  setup(props, { emit }) {
    const { t, te, n } = useI18n()

    const isTermsDisabled = computed(
      () =>
        props.shipmentType === ShipmentType.AIR ||
        props.shipmentType === ShipmentType.EXPRESS
    )

    const countries = computed(() =>
      Object.entries(Countries).map(([k, v]) => {
        const name = te(`countries.${k}`, 'en') ? t(`countries.${k}`, 'en') : v
        return {
          text: te(`countries.${k}`) ? t(`countries.${k}`) : name,
          value: k,
          name,
        }
      })
    )

    const customsTermsItems = computed(() =>
      Object.values(CustomsTerms).map((el) => ({
        text: t(`customsTerms.${el}`),
        value: el,
      }))
    )

    const customsTermsMoreItems = computed(() =>
      Object.values(CustomsTermsMore).map((el) => ({
        text: t(`customsTerms.${el}`),
        value: el,
      }))
    )

    const customsTerms = computed(() => {
      let items = [] as unknown[]
      if (
        props.shipmentType === ShipmentType.RAILWAY ||
        props.shipmentType === ShipmentType.CAR
      ) {
        items = customsTermsItems.value
      }
      if (
        props.shipmentType === ShipmentType.MARINE ||
        props.shipmentType === ShipmentType.MIXED
      ) {
        items = [
          ...customsTermsItems.value,
          { divider: true },
          ...customsTermsMoreItems.value,
        ]
      }
      return items
    })

    return () => (
      <div class="w-full flex-shrink-0 text-base lg:max-w-sm lg:pl-3">
        <h4 class="text-white text-xl font-semibold leading-6 mb-4">
          {t('shipping.customsAndTaxes')}
        </h4>
        <div class="bg-gray-700 text-gray-200 rounded-md pt-2 pb-5 px-2.5">
          <div class="pb-2">
            <Autocomplete
              modelValue={props.item?.countryOfOrigin}
              placeholder={t('shipping.countryOfOrigin')}
              items={countries.value}
              dense
              onSelect={(val: EmptyString) =>
                emit('update', { customs: { countryOfOrigin: val } })
              }
              v-slots={{
                prepend: () =>
                  props.item?.countryOfOrigin ? (
                    <img
                      src={
                        require(`@/assets/img/flags/${props.item.countryOfOrigin}.svg`)
                          .default
                      }
                      alt={props.item.countryOfOrigin}
                      class="h-6 w-6 mx-2"
                    />
                  ) : (
                    <Icon class="mx-2">{ziGlobe}</Icon>
                  ),
                item: ({ item }: { item: typeof countries.value[0] }) => (
                  <>
                    <img
                      src={
                        require(`@/assets/img/flags/${item.value}.svg`).default
                      }
                      alt={item.value}
                      class="h-6 w-6 ml-1 mr-3"
                    />
                    <span>{item.text}</span>
                  </>
                ),
              }}
            />
          </div>
          <div class="flex items-center pb-2">
            <div
              class="pl-2.5 pr-1 w-3/5 truncate"
              title={t('shipping.termsLabel')}
            >
              {t('shipping.termsLabel')}:
            </div>
            <div class="w-2/5">
              <Autocomplete
                modelValue={props.item?.terms}
                placeholder={t('placeholder.notChosen')}
                items={customsTerms.value}
                disabled={isTermsDisabled.value}
                dense
                onSelect={(val: EmptyString) =>
                  emit('update', { customs: { terms: val } })
                }
              />
            </div>
          </div>
          <div class="flex items-center">
            <div
              class="pl-2.5 pr-1 w-3/5 truncate"
              title={t('shipping.costLabel')}
            >
              {t('shipping.costLabel')}:
            </div>
            <div class="w-2/5">
              <TextField
                modelValue={props.item?.cost}
                placeholder={t('placeholder.emptyNumber')}
                dense
                number
                numberFormat="currency"
                onChange={(val: EmptyNumber) =>
                  emit('update', { customs: { cost: val } })
                }
                v-slots={{
                  append: () => (
                    <span class="text-base text-white pl-0.5 pr-2.5">
                      {t(`currency.USD.symbol`)}
                    </span>
                  ),
                }}
              />
            </div>
          </div>
          <div class="border-t border-gray-900 my-4 mx-5" />
          <div class="flex items-center pb-2">
            <div
              class="pl-2.5 pr-1 w-3/5 truncate"
              title={t('shipping.discountLabel')}
            >
              {t('shipping.discountLabel')}:
            </div>
            <div class="w-2/5">
              <TextField
                modelValue={props.item?.discount}
                placeholder={t('placeholder.emptyNumber')}
                dense
                number
                numberFormat="currency"
                onChange={(val: EmptyNumber) =>
                  emit('update', { customs: { discount: val } })
                }
                v-slots={{
                  append: () => (
                    <span class="text-base text-white pl-0.5 pr-2.5">
                      {t(`currency.USD.symbol`)}
                    </span>
                  ),
                }}
              />
            </div>
          </div>
          <div class="flex items-center pb-2">
            <div
              class="pl-2.5 pr-1 w-3/5 truncate"
              title={t('shipping.vatLabel')}
            >
              {t('shipping.vatLabel')}:
            </div>
            <div class="w-2/5">
              <Select
                placeholder={t('placeholder.notChosen')}
                items={[]}
                dense
                disabled
              />
            </div>
          </div>
          <div class="flex items-center">
            <div
              class="pl-2.5 pr-1 w-3/5 truncate"
              title={t('shipping.incomeTaxLabel')}
            >
              {t('shipping.incomeTaxLabel')}:
            </div>
            <div class="w-2/5">
              <Select
                placeholder={t('placeholder.notChosen')}
                items={[]}
                dense
                disabled
              />
            </div>
          </div>
        </div>

        <div class="bg-gray-700 rounded-md py-5 px-2.5 mt-5">
          <div class="text-white text-lg text-center font-bold px-2 pt-2.5 pb-6">
            {n(props.amount || 0, 'fixed')} {t('currency.USD.symbol')}
          </div>
          <div class="pb-2">
            <TextArea
              modelValue={props.amountInWords}
              debounce={250}
              placeholder={t('shipping.amountInWords')}
              rows="2"
              onInput={(val: EmptyString) =>
                emit('update', { amountInWords: val })
              }
            />
          </div>
          <div>
            <TextArea
              modelValue={props.amountInWordsClientLang}
              debounce={250}
              placeholder={t('shipping.amountInWordsClientLang')}
              rows="2"
              onInput={(val: EmptyString) =>
                emit('update', { amountInWordsClientLang: val })
              }
            />
          </div>
        </div>
      </div>
    )
  },
})
