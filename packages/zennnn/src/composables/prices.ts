import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useQuery } from '@vue/apollo-composable'
import { useReactiveVar } from 'shared/composables/reactiveVar'
import { LIST_PRICES } from '@/graphql/queries'
import { useCurrencyRates } from '@/composables/currencyRates'
import { isLoggedInVar } from '@/plugins/apollo'

import type { ListPrices } from '@/graphql/types'

export interface ProductItem {
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
  members: string
  annotation: string
}

export function usePrices() {
  const route = useRoute()
  const { locale, t } = useI18n()
  const { currencyRates } = useCurrencyRates()
  const isLoggedIn = useReactiveVar(isLoggedInVar)

  const { result } = useQuery<ListPrices>(LIST_PRICES, null, () => ({
    enabled: isLoggedIn.value,
  }))

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
        annotation: t('payment.monthly').toLowerCase(),
        feats: [t('pricing.feat1')],
        members: t('payment.startMembers'),
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
        annotation: t('payment.monthly').toLowerCase(),
        feats: [t('pricing.feat1')],
        members: t('payment.standardMembers'),
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
        annotation: t('payment.monthly').toLowerCase(),
        feats: [t('pricing.feat2'), t('pricing.feat3'), t('pricing.feat4')],
        members: t('payment.advancedMembers'),
      },
      {
        id: _products.Premium || 'Premium',
        isCustomPrice: true,
        name: 'Premium',
        title: t('pricing.premium'),
        team: '25+',
        aPrice: '$~',
        description: t('pricing.premiumDescription'),
        annotation: t('payment.personalPrice'),
        feats: [
          t('pricing.feat5'),
          t('pricing.feat6'),
          t('pricing.feat7'),
          t('pricing.feat2'),
          t('pricing.feat3'),
          t('pricing.feat8'),
          t('pricing.feat4'),
        ],
        members: t('payment.premiumMembers'),
      },
    ]
  })

  const promoProduct = computed(() => {
    const _currencyRate = currencyRates.value[localeCurrency.value]
    const _rate = Math.round(1 * _currencyRate)
    return {
      price: '$1',
      priceInCurrency: getPriceInCurrency(_rate),
    }
  })

  const invoiceProduct = computed(() => {
    const invoiceAmount = Number(route.query.amount || 0)
    const _currencyRate = currencyRates.value[localeCurrency.value]
    const _rate = Math.round(invoiceAmount * _currencyRate)
    return {
      price: getUsd(invoiceAmount),
      priceInCurrency: getPriceInCurrency(_rate),
    }
  })

  function format(
    number: number,
    locale: string,
    options?: Intl.NumberFormatOptions
  ) {
    return new Intl.NumberFormat(locale, options).format(number)
  }

  function getPriceInCurrency(rate: number) {
    const _currencyRate = currencyRates.value[localeCurrency.value]

    return localeCurrency.value !== 'USD'
      ? format(Math.round(rate * _currencyRate), locale.value, {
          style: 'currency',
          currency: localeCurrency.value,
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        })
      : undefined
  }

  function getUsd(rate: number) {
    return format(rate, 'en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })
  }

  function getRoundedPriceFromPenny(value: string | number) {
    value = +value
    if (Number.isNaN(value)) return 0
    return Math.round(value / 100)
  }

  return {
    prices,
    products,
    promoProduct,
    invoiceProduct,
  }
}
