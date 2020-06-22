<template>
  <div class="tariff-card leading-snug bg-white overflow-hidden rounded-md flex flex-wrap sm:justify-center">
    <div
      v-for="(item, i) of products"
      :key="i"
      :class="{ 'bg-gray-50': item.name === 'Advanced' }"
      class="tariff-card__item w-full sm:w-1/2 lg:w-1/4 flex flex-col px-8 pt-8"
    >
      <div class="flex items-center justify-between font-semibold pb-lg">
        <div class="text-xl">{{ item.title }}</div>
        <div class="h-9 flex items-center text-gray-200 bg-gray-50 rounded-xl px-2">
          <i class="zi-users text-2xl mr-2" />
          <span>{{ item.team }}</span>
        </div>
      </div>
      <div class="py-6">
        <div class="h-8">
          <span class="text-32 font-semibold">
            {{ item.aPrice }}
          </span>
          <template v-if="item.mPriceInCurrency">
            <span>~</span>
            <span>
              {{ item.mPriceInCurrency }}
            </span>
          </template>
        </div>
      </div>
      <div style="min-height: 164px">
        <div class="pb-4">
          <div v-if="item.isCustomPrice">
            {{ $t('pricing.premiumEcon') }}
          </div>
          <div v-else>
            {{ $t('pricing.inMonth') }}, &nbsp; <span class="text-yellow-500">{{ $t('pricing.econ') }}</span>
          </div>
        </div>
        <div class="text-gray-200">
          {{ item.priceMonthly }}
        </div>
      </div>
      <div class="pb-4">
        <PriceContactForm v-if="item.isCustomPrice">
          <template v-slot:activator="{ on }">
            <Button
              block
              outlined
              merge-class="border-gray-100"
              v-on="on"
            >
              {{ $t('pricing.contact') }}
            </Button>
          </template>
        </PriceContactForm>
        <Button
          v-else
          :to="item.to || null"
          block
          outlined
          merge-class="border-gray-100"
          @click.prevent="onClick(item)"
        >
          {{ $t('pricing.select') }}
        </Button>
      </div>
      <div class="text-sm text-gray-200" style="min-height: 90px">
        {{ item.description }}
      </div>
      <div class="border-b border-gray-50 my-5" />
      <div
        v-for="(feat, fi) of item.feats"
        :key="`feat-${fi}`"
        class="flex pb-6"
      >
        <i class="zi-check text-2xl text-blue-500 -ml-2 pr-2" />
        <span>
          {{ feat }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { LIST_PRICES } from '../graphql/queries'
import PriceContactForm from './PriceContactForm.vue'

export default {
  name: 'PriceList',
  components: {
    PriceContactForm,
  },
  props: {
    selected: Object,
    isLoggedIn: Boolean,
    orgId: String,
    currentProductId: String,
    currentPriceId: String,
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
      const prices = {}
      const products = {}
      this.prices.forEach(el => {
        prices[el.nickname] = el.id
        const productName = el.nickname.split(' ')[0]
        products[productName] = el.product
      })
      return [
        {
          id: products.Start,
          mId: prices['Start Monthly'],
          aId: prices['Start Annual'],
          name: 'Start',
          title: this.$t('pricing.start'),
          team: this.$t('pricing.startUpTo'),
          mPriceInCurrency: getPriceInCurrency(30),
          mPrice: '$30',
          aPriceInCurrency: getPriceInCurrency(15),
          aPriceTotal: '$180',
          aPrice: '$15',
          priceMonthly: this.$t('pricing.monthlyPrice', { price: '$30' }),
          description: this.$t('pricing.startDescription'),
          feats: [this.$t('pricing.feat1')],
          to: !this.isLoggedIn ? { name: 'signup', query: { price: prices['Start Annual'] } } : null,
        },
        {
          id: products.Standard,
          mId: prices['Standard Monthly'],
          aId: prices['Standard Annual'],
          name: 'Standard',
          title: this.$t('pricing.standard'),
          team: '4-10',
          mPriceInCurrency: getPriceInCurrency(198),
          mPrice: '$198',
          aPriceInCurrency: getPriceInCurrency(99),
          aPriceTotal: '$1188',
          aPrice: '$99',
          priceMonthly: this.$t('pricing.monthlyPrice', { price: '$198' }),
          description: this.$t('pricing.standardDescription'),
          feats: [this.$t('pricing.feat1')],
          to: !this.isLoggedIn ? { name: 'signup', query: { price: prices['Standard Annual'] } } : null,
        },
        {
          id: products.Advanced,
          mId: prices['Advanced Monthly'],
          aId: prices['Advanced Annual'],
          name: 'Advanced',
          title: this.$t('pricing.advanced'),
          team: '11+',
          mPriceInCurrency: getPriceInCurrency(398),
          mPrice: '$398',
          aPriceInCurrency: getPriceInCurrency(199),
          aPriceTotal: '$2388',
          aPrice: '$199',
          priceMonthly: this.$t('pricing.monthlyPrice', { price: '$398' }),
          description: this.$t('pricing.advancedDescription'),
          feats: [this.$t('pricing.feat2'), this.$t('pricing.feat3'), this.$t('pricing.feat4')],
          to: !this.isLoggedIn ? { name: 'signup', query: { price: prices['Advanced Annual'] } } : null,
        },
        {
          id: products.Premium || 'Premium',
          isCustomPrice: true,
          name: 'Premium',
          title: this.$t('pricing.premium'),
          team: '25+',
          aPrice: '$~',
          description: this.$t('pricing.premiumDescription'),
          feats: [this.$t('pricing.feat5'), this.$t('pricing.feat6'), this.$t('pricing.feat7'), this.$t('pricing.feat2'), this.$t('pricing.feat3'), this.$t('pricing.feat8'), this.$t('pricing.feat4')],
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
      this.selectedProductId = item.id
      this.$emit('select', item)
      if (this.isLoggedIn && !item.isCustomPrice) {
        this.$router.push({ name: 'payment', params: { type: 'change' }, query: { product: item.id, interval: 'annual' } })
      }
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

<style lang="postcss">
.tariff-card {
  border: 1px solid #F0F0F0;
}
.tariff-card .tariff-card__item:not(:last-child) {
  border-bottom: 1px solid #F0F0F0;
}
@screen sm {
  .tariff-card .tariff-card__item:not(:last-child) {
    border-bottom: none;
  }
  .tariff-card .tariff-card__item:nth-child(odd) {
    border-right: 1px solid #F0F0F0;
  }
  .tariff-card .tariff-card__item:nth-child(1),
  .tariff-card .tariff-card__item:nth-child(2) {
    border-bottom: 1px solid #F0F0F0;
  }
}
@screen lg {
  .tariff-card .tariff-card__item:nth-child(1),
  .tariff-card .tariff-card__item:nth-child(2) {
    border-bottom: none;
    border-right: 1px solid #F0F0F0;
  }
}
</style>
