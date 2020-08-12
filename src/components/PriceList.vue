<template>
  <div class="tariff-card leading-snug bg-white overflow-hidden rounded-md flex flex-wrap sm:justify-center">
    <div
      v-for="(item, i) of products"
      :key="i"
      :class="{ 'bg-light-gray-100': item.name === 'Advanced' }"
      class="tariff-card__item w-full sm:w-1/2 lg:w-1/4 flex flex-col px-8 pt-8"
    >
      <div class="flex items-center justify-between font-semibold pb-xl">
        <div class="text-xl">{{ item.title }}</div>
        <div
          :class="['h-9 flex items-center text-gray-200 rounded-50 px-2', item.name === 'Advanced' ? 'bg-white' : 'bg-light-gray-100']"
        >
          <i class="zi-users text-2xl mr-2" />
          <span>{{ item.team }}</span>
        </div>
      </div>
      <div class="py-6">
        <div class="h-8">
          <span class="text-32 font-semibold">
            {{ item.aPrice }}
          </span>
          <template v-if="item.aPriceInCurrency">
            <span>~</span>
            <span>
              {{ item.aPriceInCurrency }}
            </span>
          </template>
        </div>
      </div>
      <div style="min-height: 164px;">
        <div class="pb-4">
          <div v-if="item.isCustomPrice">
            {{ $t('pricing.premiumEcon') }}
          </div>
          <div v-else>
            {{ $t('pricing.inMonth') }}, &nbsp; <span class="text-yellow-500" v-html="$t('pricing.econ')" />
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
      <div class="text-sm text-gray-200" style="min-height: 90px;" v-html="item.description" />
      <div class="border-b border-light-gray-100 my-5" />
      <div
        v-for="(feat, fi) of item.feats"
        :key="`feat-${fi}`"
        class="flex pb-6"
      >
        <i class="zi-check text-2xl text-blue-500 -ml-2 pr-2" />
        <span v-html="feat" />
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
      const getUsd = (rate) => this.$n(rate, {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      })
      const prices = {}
      const products = {}
      const amounts = {}
      this.prices.forEach(el => {
        prices[el.nickname] = el.id
        const productName = el.nickname.split(' ')[0]
        products[productName] = el.product
        amounts[el.nickname] = this.getRoundedPriceFromPenny(el.unit_amount)
      })
      return [
        {
          id: products.Start,
          mId: prices['Start Monthly'],
          aId: prices['Start Annual'],
          name: 'Start',
          title: this.$t('pricing.start'),
          team: this.$t('pricing.startUpTo'),
          mPriceInCurrency: getPriceInCurrency(amounts['Start Monthly'] || 30),
          mPrice: getUsd(amounts['Start Monthly'] || 30),
          aPriceInCurrency: getPriceInCurrency((amounts['Start Annual'] || 180) / 12),
          aPriceTotal: getUsd(amounts['Start Annual'] || 180),
          aPrice: getUsd((amounts['Start Annual'] || 180) / 12),
          priceMonthly: this.$t('pricing.monthlyPrice', { price: getUsd(amounts['Start Monthly'] || 30) }),
          description: this.$t('pricing.startDescription'),
          feats: [this.$t('pricing.feat1')],
          to: !this.isLoggedIn ? { name: 'signup' } : null,
        },
        {
          id: products.Standard,
          mId: prices['Standard Monthly'],
          aId: prices['Standard Annual'],
          name: 'Standard',
          title: this.$t('pricing.standard'),
          team: '4-10',
          mPriceInCurrency: getPriceInCurrency(amounts['Standard Monthly'] || 198),
          mPrice: getUsd(amounts['Standard Monthly'] || 198),
          aPriceInCurrency: getPriceInCurrency((amounts['Standard Annual'] || 1188) / 12),
          aPriceTotal: getUsd(amounts['Standard Annual'] || 1188),
          aPrice: getUsd((amounts['Standard Annual'] || 1188) / 12),
          priceMonthly: this.$t('pricing.monthlyPrice', { price: getUsd(amounts['Standard Monthly'] || 198) }),
          description: this.$t('pricing.standardDescription'),
          feats: [this.$t('pricing.feat1')],
          to: !this.isLoggedIn ? { name: 'signup' } : null,
        },
        {
          id: products.Advanced,
          mId: prices['Advanced Monthly'],
          aId: prices['Advanced Annual'],
          name: 'Advanced',
          title: this.$t('pricing.advanced'),
          team: '11+',
          mPriceInCurrency: getPriceInCurrency(amounts['Advanced Monthly'] || 398),
          mPrice: getUsd(amounts['Advanced Monthly'] || 398),
          aPriceInCurrency: getPriceInCurrency((amounts['Advanced Annual'] || 2388) / 12),
          aPriceTotal: getUsd(amounts['Advanced Annual'] || 2388),
          aPrice: getUsd((amounts['Advanced Annual'] || 2388) / 12),
          priceMonthly: this.$t('pricing.monthlyPrice', { price: getUsd(amounts['Advanced Monthly'] || 398) }),
          description: this.$t('pricing.advancedDescription'),
          feats: [this.$t('pricing.feat2'), this.$t('pricing.feat3'), this.$t('pricing.feat4')],
          to: !this.isLoggedIn ? { name: 'signup' } : null,
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
