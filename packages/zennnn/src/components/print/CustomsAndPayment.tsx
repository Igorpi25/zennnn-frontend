import { defineComponent, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ziGlobe } from '@zennnn/icons'
import { Autocomplete, Select, TextField, TextArea, Icon } from '@zennnn/core'
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

    const rules = reactive({
      required: (v: EmptyNumber | EmptyString) => !!v || t('rule.required'),
    })

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
      <>
        <h5 class="flex-grow text-lg leading-tight mb-3">
          <span class="text-white uppercase font-semibold tracking-widest">
            {t('shipping.customsAndTaxes')}
          </span>
        </h5>
        <div class="flex flex-wrap">
          <div class="w-full lg:w-1/2 lg:pr-5">
            <div class="pb-2">
              <Autocomplete
                modelValue={props.item?.countryOfOrigin}
                label={t('shipping.countryOfOrigin')}
                placeholder={t('companyDetail.placeholder.citizenship')}
                items={countries.value}
                rules={[rules.required]}
                stateIcon
                required
                {...{
                  'onUpdate:modelValue': (val: EmptyString) => {
                    emit('update', { customs: { countryOfOrigin: val } })
                  },
                }}
                v-slots={{
                  prepend: () =>
                    props.item?.countryOfOrigin ? (
                      <img
                        src={
                          require(`@/assets/img/flags/square/${props.item.countryOfOrigin}.svg`)
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
                          require(`@/assets/img/flags/square/${item.value}.svg`)
                            .default
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
            <div class="flex pb-2">
              <div class="w-1/2 pr-2.5">
                <Autocomplete
                  modelValue={props.item?.terms}
                  label={t('shipping.termsLabel')}
                  placeholder={t('shipping.termsPlaceholder')}
                  items={customsTerms.value}
                  disabled={isTermsDisabled.value}
                  rules={[rules.required]}
                  stateIcon
                  required
                  {...{
                    'onUpdate:modelValue': (val: EmptyString) => {
                      emit('update', { customs: { terms: val } })
                    },
                  }}
                />
              </div>
              <div class="w-1/2">
                <TextField
                  modelValue={props.item?.cost}
                  label={t('shipping.costLabel')}
                  placeholder={t('placeholder.notChosen')}
                  lazy
                  number
                  numberFormat="currency"
                  {...{
                    'onUpdate:modelValue': (val: EmptyNumber) => {
                      emit('update', { customs: { cost: val } })
                    },
                  }}
                  v-slots={{
                    append: () => (
                      <span class="text-base w-auto pl-0.5 pr-2.5">
                        {t('currency.USD.symbol')}
                      </span>
                    ),
                  }}
                />
              </div>
            </div>
            <div class="pb-2 flex">
              <div class="w-1/2 pr-2.5">
                <Select
                  modelValue={t('currency.USD.iso-4217')}
                  label={t('shipping.invoiceCurrency')}
                  placeholder={t('currency.USD.iso-4217')}
                  items={[
                    {
                      value: t('currency.USD.iso-4217'),
                      text: t('currency.USD.iso-4217'),
                    },
                  ]}
                />
              </div>
            </div>
          </div>
          <div class="w-full lg:w-1/2 lg:pl-5">
            <div class="flex flex-wrap pb-2">
              <div class="w-full lg:w-1/3 lg:pr-2">
                <TextField
                  modelValue={props.item?.discount}
                  label={t('shipping.discountLabel')}
                  placeholder={t('placeholder.notChosen')}
                  lazy
                  number
                  numberFormat="currency"
                  {...{
                    'onUpdate:modelValue': (val: EmptyNumber) => {
                      emit('update', { customs: { discount: val } })
                    },
                  }}
                  v-slots={{
                    append: () => (
                      <span class="text-base w-auto pl-0.5 pr-2.5">
                        {t('currency.USD.symbol')}
                      </span>
                    ),
                  }}
                />
              </div>
              <div class="w-1/2 lg:w-1/3 pr-2 lg:px-2">
                <Select
                  label={t('shipping.vatLabel')}
                  placeholder={t('placeholder.notChosen')}
                  items={[]}
                  disabled
                />
              </div>
              <div class="w-1/2 lg:w-1/3 pl-2">
                <Select
                  label={t('shipping.incomeTaxLabel')}
                  placeholder={t('placeholder.notChosen')}
                  items={[]}
                  disabled
                />
              </div>
            </div>
            <div class="hidden lg:block pt-9 pb-2">
              <div class="h-10" />
            </div>
            <div class="pt-9 pb-2">
              <div class="h-10 flex items-center">
                <div class="text-white w-full flex items-baseline">
                  <div class="text-2xl whitespace-nowrap">
                    {t('shipping.invoiceAmount')}
                  </div>
                  <div class="flex-grow h-[1em] border-b border-dashed mx-2" />
                  <div class="text-2xl whitespace-nowrap">
                    {n(props.amount || 0, 'fixed')}
                    {t('currency.USD.symbol')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="my-10 border-t border-gray-400" />

        <h5 class="flex-grow text-lg leading-tight mb-3">
          <span class="text-white uppercase font-semibold tracking-widest">
            {t('shipping.amount')}
          </span>
        </h5>
        <div class="flex flex-wrap">
          <div class="w-full lg:w-1/2 lg:pr-5">
            <TextArea
              modelValue={props.amountInWords}
              debounce={500}
              rules={[rules.required]}
              label={t('shipping.amountInWords')}
              placeholder={t('placeholder.notIndicated')}
              class="pb-2"
              rows="2"
              stateIcon
              stateErrorColor="warn"
              {...{
                'onUpdate:modelValue': (val: EmptyString) => {
                  emit('update', { amountInWords: val })
                },
              }}
            />
          </div>
          <div class="w-full lg:w-1/2 lg:pl-5">
            <TextArea
              modelValue={props.amountInWordsClientLang}
              debounce={500}
              rules={[rules.required]}
              label={t('shipping.amountInWordsClientLang')}
              placeholder={t('placeholder.notIndicated')}
              class="pb-2"
              rows="2"
              stateIcon
              stateErrorColor="warn"
              {...{
                'onUpdate:modelValue': (val: EmptyString) => {
                  emit('update', { amountInWordsClientLang: val })
                },
              }}
            />
          </div>
        </div>
      </>
    )
  },
})
