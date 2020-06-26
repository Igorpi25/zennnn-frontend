<template>
  <div class="bg-white relative">
    <span class="absolute top-0 right-0 pt-2 pr-2">
      <i
        class="zi-close text-2xl text-gray-200 hover:text-gray-300 cursor-pointer"
        @click="$emit('close')"
      />
    </span>
    <div class="bg-gray-50 flex px-8 py-5">
      <svg class="text-blue-500" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.8174 1.06641C20.208 0.675781 19.9307 0 19.376 0H0.626708C0.072041 0 -0.209198 0.671875 0.185318 1.06641L8.43891 9.32031V18.4375H4.8453C4.23985 18.4375 3.75159 18.9258 3.75159 19.5312C3.75159 19.7891 3.96252 20 4.22032 20H15.7824C16.0402 20 16.2511 19.7891 16.2511 19.5312C16.2511 18.9258 15.7629 18.4375 15.1574 18.4375H11.5638V9.32031L19.8174 1.06641Z" fill="currentColor"/>
      </svg>
      <div class="text-lg font-semibold text-gray-900 pl-4">
        {{ changePrice ? $t('payment.changePlanTitle') : $t('payment.selectPlan') }}
      </div>
    </div>
    <div class="p-8">
      <div
        v-for="(item, i) of products"
        :key="i"
        :class="{ 'mb-2': i + 1 < products.length }"
        class="flex items-center w-full bg-gray-50 rounded-md px-6 py-4"
      >
        <div class="w-1/2 sm:w-1/3 leading-tight">
          <div class="text-gray-300 font-semibold pb-2">{{ item.title }}</div>
          <div v-if="item.current" class="text-sm text-green-500">
            {{ $t('payment.currentPlan') }}
          </div>
          <div v-else class="text-sm">
            <router-link
              :to="{ name: 'pricing' }"
              class="text-blue-500 hover:text-blue-600 focus:outline-none focus:text-blue-600"
            >
              {{ $t('payment.more') }}
            </router-link>
          </div>
        </div>
        <div v-html="item.annotation" class="hidden sm:block w-1/3 text-sm text-gray-200 leading-tight self-start pt-1 pl-3" />
        <div class="text-right w-1/2 sm:w-1/3 pl-3">
          <PriceContactForm v-if="item.isCustomPrice">
            <template v-slot:activator="{ on }">
              <Button
                block
                outlined
                merge-class="border-gray-100 h-10"
                v-on="on"
              >
                {{ $t('payment.contact') }}
              </Button>
            </template>
          </PriceContactForm>
          <Button
            v-else
            block
            outlined
            merge-class="border-gray-100 h-10"
            @click.prevent="onClick(item)"
          >
            {{ $t('payment.select') }}
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { LIST_PRICES } from '../graphql/queries'
import PriceContactForm from './PriceContactForm.vue'

export default {
  name: 'PriceSelect',
  components: {
    PriceContactForm,
  },
  props: {
    selected: Object,
    currentProductId: String,
    currentPriceId: String,
    changePrice: Boolean,
  },
  apollo: {
    listPrices: {
      query: LIST_PRICES,
    },
  },
  data () {
    return {
      currencyRates: {},
      selectedPriceId: '',
      selectedProductId: '',
      isBooted: false,
    }
  },
  computed: {
    prices () {
      return this.listPrices || []
    },
    selectedPrice () {
      return this.prices.find(el => el.id === this.selectedPriceId) || {}
    },
    selectedProduct () {
      return this.products.find(el => el.id === this.selectedProductId) || {}
    },
    products () {
      const currencyRate = this.currencyRates[this.localeCurrency]
      const getPriceInCurrency = (rate) => this.localeCurrency !== 'USD'
        ? this.$n(Math.round((rate * currencyRate)), {
          style: 'currency',
          currency: this.localeCurrency,
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        })
        : null
      const getUsd = (rate) => this.$n(rate, {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      })
      const prices = {}
      const products = {}
      const amounts = {}
      let isAnnually = false
      this.prices.forEach(el => {
        prices[el.nickname] = el.id
        const productName = el.nickname.split(' ')[0]
        products[productName] = el.product
        if (el.id === this.currentPriceId && el.nickname.includes('Annual')) {
          isAnnually = true
        }
        amounts[el.nickname] = this.getRoundedPriceFromPenny(el.unit_amount)
      })
      return [
        {
          id: products.Start,
          mId: prices['Start Monthly'],
          aId: prices['Start Annual'],
          name: 'Start',
          title: this.$t('pricing.start'),
          mPriceInCurrency: getPriceInCurrency(amounts['Start Monthly'] || 30),
          mPrice: getUsd(amounts['Start Monthly'] || 30),
          aPriceInCurrency: getPriceInCurrency((amounts['Start Annual'] || 180) / 12),
          aPriceTotal: getUsd(amounts['Start Annual'] || 180),
          aPrice: getUsd((amounts['Start Annual'] || 180) / 12),
          current: this.currentProductId === products.Start,
          annotation: `${isAnnually ? '$15' : '$30'}<br>${this.$t('payment.monthly').toLowerCase()}`,
          to: { name: 'payment', params: { type: 'change', product: products.Start } },
        },
        {
          id: products.Standard,
          mId: prices['Standard Monthly'],
          aId: prices['Standard Annual'],
          name: 'Standard',
          title: this.$t('pricing.standard'),
          mPriceInCurrency: getPriceInCurrency(amounts['Standard Monthly'] || 198),
          mPrice: getUsd(amounts['Standard Monthly'] || 198),
          aPriceInCurrency: getPriceInCurrency((amounts['Standard Annual'] || 1188) / 12),
          aPriceTotal: getUsd(amounts['Standard Annual'] || 1188),
          aPrice: getUsd((amounts['Standard Annual'] || 1188) / 12),
          current: this.currentProductId === products.Standard,
          annotation: `${isAnnually ? '$99' : '$198'}<br>${this.$t('payment.monthly').toLowerCase()}`,
          to: { name: 'payment', params: { type: 'change', product: products.Standard } },
        },
        {
          id: products.Advanced,
          mId: prices['Advanced Monthly'],
          aId: prices['Advanced Annual'],
          name: 'Advanced',
          title: this.$t('pricing.advanced'),
          mPriceInCurrency: getPriceInCurrency(amounts['Advanced Monthly'] || 398),
          mPrice: getUsd(amounts['Advanced Monthly'] || 398),
          aPriceInCurrency: getPriceInCurrency((amounts['Advanced Annual'] || 2388) / 12),
          aPriceTotal: getUsd(amounts['Advanced Annual'] || 2388),
          aPrice: getUsd((amounts['Advanced Annual'] || 2388) / 12),
          current: this.currentProductId === products.Advanced,
          annotation: `${isAnnually ? '$199' : '$398'}<br>${this.$t('payment.monthly').toLowerCase()}`,
          to: { name: 'payment', params: { type: 'change', product: products.Advanced } },
        },
        {
          id: products.Premium,
          isCustomPrice: true,
          name: 'Premium',
          title: this.$t('pricing.premium'),
          aPrice: '$~',
          annotation: this.$t('payment.personalPrice'),
          to: { name: 'payment', params: { type: 'change', product: products.Premium } },
        },
      ]
    },
    localeCurrency () {
      switch (this.$i18n.locale) {
        case 'fr': return 'EUR'
        case 'ru': return 'RUB'
        case 'zh-Hans': return 'CNY'
        case 'zh-Hant': return 'HKD'
        default: return 'USD'
      }
    },
  },
  watch: {
    selectedProduct (val) {
      this.$emit('update:selected', val)
    },
  },
  created () {
    this.getRates()
  },
  mounted () {
    if (this.currentProductId) {
      this.selectedProductId = this.currentProductId
    }
  },
  methods: {
    onClick (item) {
      if (item.isCustomPrice) return
      this.selectedProductId = item.id
      this.$emit('select', item)
    },
    async getRates () {
      try {
        const response = await this.$axios.get('https://api.exchangeratesapi.io/latest?base=USD&symbols=USD,CNY,HKD,RUB,EUR,GBP')
        if (response.data) {
          this.currencyRates = response.data.rates
        }
      } catch (error) {
        this.$logget.info('Error on get currency rates', error)
      }
    },
    getRoundedPriceFromPenny (value) {
      value = +value
      if (Number.isNaN(value)) return 0
      return Math.round(value / 100)
    },
  },
}
</script>
