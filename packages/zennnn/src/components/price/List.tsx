import {
  computed,
  defineComponent,
  nextTick,
  onBeforeMount,
  onMounted,
  ref,
  watch,
} from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useQuery } from '@vue/apollo-composable'
import axios from 'axios'
import { ziChecked, ziUsers, ziEmail } from '@zennnn/icons'
import { Btn, Icon } from '@zennnn/core'
import Dialog from 'shared/components/Dialog'
import { useReactiveVar } from 'shared/composables/reactiveVar'
import { LIST_PRICES } from '@/graphql/queries'
import ContactForm from '@/components/price/ContactForm'
import { logger } from '@/plugins'
import { isLoggedInVar } from '@/plugins/apollo'

import type { ListPrices } from '@/graphql/types'

interface ProductItem {
  id: string
  mId?: string
  aId?: string
  name: string
  title: string
  team: string
  mPriceInCurrency?: string
  mPrice?: string
  aPriceInCurrency?: string
  aPriceTotal?: string
  aPrice: string
  priceMonthly?: string
  description: string
  feats: string[]
  isCustomPrice?: boolean
}

export default defineComponent({
  props: {
    selected: Object,
    orgId: String,
    currentProductId: String,
    currentPriceId: String,
  },

  emits: ['update:selected', 'select'],

  setup(props, { emit }) {
    const router = useRouter()
    const { locale, t } = useI18n()

    const { result } = useQuery<ListPrices>(LIST_PRICES)

    const isLoggedIn = useReactiveVar(isLoggedInVar)

    const currencyRates = ref<Record<string, number>>({})
    const selectedProductId = ref('')
    const contactDialog = ref(false)
    const contactForm = ref()

    const prices = computed(() => result.value?.listPrices || [])

    const localeCurrency = computed(() => {
      switch (locale.value) {
        case 'fr':
          return 'EUR'
        case 'ru':
          return 'RUB'
        case 'zh-Hans':
          return 'CNY'
        case 'zh-Hant':
          return 'HKD'
        default:
          return 'USD'
      }
    })

    const products = computed(() => {
      const _currencyRate = currencyRates.value[localeCurrency.value]
      const format = (
        number: number,
        locale: string,
        options?: Intl.NumberFormatOptions
      ) => {
        return new Intl.NumberFormat(locale, options).format(number)
      }
      const getPriceInCurrency = (rate: number) =>
        localeCurrency.value !== 'USD'
          ? format(Math.round(rate * _currencyRate), locale.value, {
              style: 'currency',
              currency: localeCurrency.value,
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            })
          : undefined
      const getUsd = (rate: number) =>
        format(rate, 'en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        })
      const _prices = {} as Record<string, string>
      const _products = {} as Record<string, string>
      const _amounts = {} as Record<string, number>
      prices.value
        .filter((el: any) => el.nickname)
        .forEach((el: any) => {
          _prices[el.nickname] = el.id
          const productName = el.nickname.split(' ')[0]
          _products[productName] = el.product
          _amounts[el.nickname] = getRoundedPriceFromPenny(el.unit_amount)
        })
      return [
        {
          id: _products.Start,
          mId: _prices['Start Monthly'],
          aId: _prices['Start Annual'],
          name: 'Start',
          title: t('pricing.start'),
          team: t('pricing.startUpTo'),
          mPriceInCurrency: getPriceInCurrency(_amounts['Start Monthly'] || 30),
          mPrice: getUsd(_amounts['Start Monthly'] || 30),
          aPriceInCurrency: getPriceInCurrency(
            (_amounts['Start Annual'] || 180) / 12
          ),
          aPriceTotal: getUsd(_amounts['Start Annual'] || 180),
          aPrice: getUsd((_amounts['Start Annual'] || 180) / 12),
          priceMonthly: t('pricing.monthlyPrice', {
            price: getUsd(_amounts['Start Monthly'] || 30),
          }),
          description: t('pricing.startDescription'),
          feats: [t('pricing.feat1')],
        },
        {
          id: _products.Standard,
          mId: _prices['Standard Monthly'],
          aId: _prices['Standard Annual'],
          name: 'Standard',
          title: t('pricing.standard'),
          team: '4-10',
          mPriceInCurrency: getPriceInCurrency(
            _amounts['Standard Monthly'] || 198
          ),
          mPrice: getUsd(_amounts['Standard Monthly'] || 198),
          aPriceInCurrency: getPriceInCurrency(
            (_amounts['Standard Annual'] || 1188) / 12
          ),
          aPriceTotal: getUsd(_amounts['Standard Annual'] || 1188),
          aPrice: getUsd((_amounts['Standard Annual'] || 1188) / 12),
          priceMonthly: t('pricing.monthlyPrice', {
            price: getUsd(_amounts['Standard Monthly'] || 198),
          }),
          description: t('pricing.standardDescription'),
          feats: [t('pricing.feat1')],
        },
        {
          id: _products.Advanced,
          mId: _prices['Advanced Monthly'],
          aId: _prices['Advanced Annual'],
          name: 'Advanced',
          title: t('pricing.advanced'),
          team: '11+',
          mPriceInCurrency: getPriceInCurrency(
            _amounts['Advanced Monthly'] || 398
          ),
          mPrice: getUsd(_amounts['Advanced Monthly'] || 398),
          aPriceInCurrency: getPriceInCurrency(
            (_amounts['Advanced Annual'] || 2388) / 12
          ),
          aPriceTotal: getUsd(_amounts['Advanced Annual'] || 2388),
          aPrice: getUsd((_amounts['Advanced Annual'] || 2388) / 12),
          priceMonthly: t('pricing.monthlyPrice', {
            price: getUsd(_amounts['Advanced Monthly'] || 398),
          }),
          description: t('pricing.advancedDescription'),
          feats: [t('pricing.feat2'), t('pricing.feat3'), t('pricing.feat4')],
        },
        {
          id: _products.Premium || 'Premium',
          isCustomPrice: true,
          name: 'Premium',
          title: t('pricing.premium'),
          team: '25+',
          aPrice: '$~',
          description: t('pricing.premiumDescription'),
          feats: [
            t('pricing.feat5'),
            t('pricing.feat6'),
            t('pricing.feat7'),
            t('pricing.feat2'),
            t('pricing.feat3'),
            t('pricing.feat8'),
            t('pricing.feat4'),
          ],
        },
      ]
    })

    const selectedProduct = computed(
      () => products.value.find((el) => el.id === selectedProductId.value) || {}
    )

    watch(selectedProduct, (val) => {
      emit('update:selected', val)
    })

    watch(contactDialog, (val) => {
      if (val) {
        nextTick(() => {
          contactForm.value && contactForm.value.focus()
        })
      } else {
        nextTick(() => {
          contactForm.value && contactForm.value.reset()
        })
      }
    })

    function onItemClick(item: ProductItem) {
      selectedProductId.value = item.id
      emit('select', item)
      if (isLoggedIn.value && !item.isCustomPrice) {
        router.push({
          name: 'payment',
          params: { type: 'change' },
          query: { product: item.id, interval: 'annual' },
        })
      }
    }

    async function getRates() {
      try {
        const response = await axios.get(
          'https://api.exchangeratesapi.io/latest?base=USD&symbols=USD,CNY,HKD,RUB,EUR,GBP'
        )
        if (response.data && response.data.success) {
          currencyRates.value = response.data.rates
        }
      } catch (error) {
        logger.info('Error on get currency rates', error)
      }
    }

    function getRoundedPriceFromPenny(value: string | number) {
      value = +value
      if (Number.isNaN(value)) return 0
      return Math.round(value / 100)
    }

    function closeContactDialog() {
      contactDialog.value = false
    }

    onBeforeMount(getRates)

    onMounted(() => {
      if (props.currentProductId) {
        selectedProductId.value = props.currentProductId
      }
    })

    return () => (
      <div class="border border-light-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 leading-snug overflow-x-auto rounded-md grid sm:grid-cols-[repeat(4,minmax(282px,1fr))]">
        {products.value.map((item) => (
          <div
            class={{
              'border-b sm:border-b-0 sm:border-r border-light-gray-300 dark:border-gray-600 sm:last:border-r-0 flex flex-col px-8 pt-8':
                true,
              'bg-light-gray-100 dark:bg-gray-700': item.name === 'Advanced',
            }}
          >
            <div class="flex items-center justify-between font-semibold pb-7.5">
              <div class="text-xl">{item.title}</div>
              <div
                class={[
                  'h-9 flex items-center text-gray-200 rounded-50 px-2',
                  item.name === 'Advanced'
                    ? 'bg-white dark:bg-gray-800'
                    : 'bg-light-gray-100 dark:bg-gray-700',
                ]}
              >
                <Icon class="mr-2">{ziUsers}</Icon>
                <span>{item.team}</span>
              </div>
            </div>
            <div class="py-6">
              <div class="h-8">
                <span class="text-32 font-semibold">{item.aPrice}</span>
                {item.aPriceInCurrency && (
                  <>
                    <span>~</span>
                    <span>{item.aPriceInCurrency}</span>
                  </>
                )}
              </div>
            </div>
            <div style="min-height: 164px">
              <div class="pb-4">
                {item.isCustomPrice ? (
                  <div v-html={t('pricing.premiumEcon')} />
                ) : (
                  <div>
                    {t('pricing.inMonth')}, &nbsp;
                    <span v-html={t('pricing.econ')} class="text-yellow-500" />
                  </div>
                )}
              </div>
              <div class="text-gray-200">{item.priceMonthly}</div>
            </div>
            <div class="pb-4">
              {item.isCustomPrice ? (
                <Dialog
                  v-model={contactDialog.value}
                  icon={ziEmail}
                  title={t('pricing.contact')}
                  v-slots={{
                    activator: () => (
                      <Btn block outlined>
                        {t('pricing.contact')}
                      </Btn>
                    ),
                  }}
                  bodyClass="p-6"
                >
                  <ContactForm
                    ref={contactForm}
                    has-cancel
                    {...{
                      onSucces: closeContactDialog,
                      onCancel: closeContactDialog,
                    }}
                  />
                </Dialog>
              ) : (
                <Btn
                  to={
                    !isLoggedIn.value && !item.isCustomPrice
                      ? { name: 'signup' }
                      : undefined
                  }
                  block
                  outlined
                  {...{
                    onClick: (e: MouseEvent) => {
                      e.preventDefault()
                      onItemClick(item)
                    },
                  }}
                >
                  {t('pricing.select')}
                </Btn>
              )}
            </div>
            <div
              class="text-sm text-gray-200"
              style="min-height: 90px"
              v-html={item.description}
            />
            <div class="border-b border-light-gray-100 dark:border-gray-400 my-5" />
            {item.feats.map((feat) => (
              <div class="flex pb-6">
                <Icon class="text-blue-500 -ml-2 pr-2">{ziChecked}</Icon>
                <span v-html={feat} />
              </div>
            ))}
          </div>
        ))}
      </div>
    )
  },
})
