<template>
  <div class="bg-white relative">
    <span class="absolute top-0 right-0 pt-2 pr-2">
      <i
        class="zi-close text-2xl text-gray-200 hover:text-gray-300 cursor-pointer"
        @click="$emit('close')"
      />
    </span>
    <div class="bg-gray-50 flex px-8 py-5">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21.8174 3.06641C22.208 2.67578 21.9307 2 21.376 2H2.62671C2.07204 2 1.7908 2.67188 2.18532 3.06641L10.4389 11.3203V20.4375H6.8453C6.23985 20.4375 5.75159 20.9258 5.75159 21.5312C5.75159 21.7891 5.96252 22 6.22032 22H17.7824C18.0402 22 18.2511 21.7891 18.2511 21.5312C18.2511 20.9258 17.7629 20.4375 17.1574 20.4375H13.5638V11.3203L21.8174 3.06641Z" fill="black"/>
        <mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="2" y="2" width="20" height="20">
        <path d="M21.8174 3.06641C22.208 2.67578 21.9307 2 21.376 2H2.62671C2.07204 2 1.7908 2.67188 2.18532 3.06641L10.4389 11.3203V20.4375H6.8453C6.23985 20.4375 5.75159 20.9258 5.75159 21.5312C5.75159 21.7891 5.96252 22 6.22032 22H17.7824C18.0402 22 18.2511 21.7891 18.2511 21.5312C18.2511 20.9258 17.7629 20.4375 17.1574 20.4375H13.5638V11.3203L21.8174 3.06641Z" fill="white"/>
        </mask>
        <g mask="url(#mask0)">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M0 0H24V24H0V0Z" fill="#7E99D0"/>
        </g>
      </svg>
      <div class="text-lg font-semibold text-gray-900 pl-4">
        {{ changePrice ? $t('payment.changePlanTitle') : $t('payment.selectPlan') }}
      </div>
    </div>
    <div class="p-8">
      <div
        v-for="(item, i) of plans"
        :key="i"
        :class="{ 'mb-2': i + 1 < plans.length }"
        class="flex items-center w-full bg-gray-50 rounded-md px-6 py-4"
      >
        <div class="w-1/2 sm:w-1/3 leading-tight">
          <div class="text-gray-300 font-semibold pb-2">{{ item.name }}</div>
          <div v-if="item.active" class="text-sm text-green-500">
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
    initProductId: String,
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
      return this.plans.find(el => el.id === this.selectedProductId) || {}
    },
    plans () {
      const currencyRate = this.currencyRates[this.localeCurrency]
      const getPriceInCurrency = (rate) => this.localeCurrency !== 'USD'
        ? Math.round((rate * currencyRate)).toLocaleString(this.$i18n.locale, { minimumFractionDigits: 0, maximumFractionDigits: 2, style: 'currency', currency: this.localeCurrency })
        : null
      const prices = {}
      const products = {}
      let isAnnually = false
      this.prices.forEach(el => {
        prices[el.nickname] = el.id
        const productName = el.nickname.split(' ')[0]
        products[productName] = el.product
        if (el.id === this.currentPriceId && el.nickname.includes('Annual')) {
          isAnnually = true
        }
      })
      return [
        {
          id: products.Start,
          mId: prices['Start Monthly'],
          aId: prices['Start Annual'],
          name: 'Start',
          title: 'Старт',
          team: 'до 3-х',
          mPriceInCurrency: getPriceInCurrency(30),
          mPrice: '$30',
          aPriceInCurrency: getPriceInCurrency(15),
          aPriceTotal: '$180',
          aPrice: '$15',
          priceMonthly: '$30 / месяц, при оплате ежемесячно',
          econ: 'в месяц, экономия 50% при оплате за год',
          description: 'Все необходимые функции для начала работы в международной торговле',
          feats: ['Отправка уведомлений на эл. почту'],
          active: this.currentProductId === products.Start,
          annotation: `${isAnnually ? '$15' : '$30'}<br>${this.$t('payment.monthly').toLowerCase()}`,
        },
        {
          id: products.Standard,
          mId: prices['Standard Monthly'],
          aId: prices['Standard Annual'],
          name: 'Standard',
          title: 'Стандарт',
          team: '4-10',
          mPriceInCurrency: getPriceInCurrency(198),
          mPrice: '$198',
          aPriceInCurrency: getPriceInCurrency(99),
          aPriceTotal: '$1188',
          aPrice: '$99',
          priceMonthly: '$198 в месяц, при оплате ежемесячно',
          econ: 'в месяц, экономия 50% при оплате за год',
          description: 'Полноценная работа офиса на удаленке',
          feats: ['Отправка уведомлений на эл. почту'],
          active: this.currentProductId === products.Standard,
          annotation: `${isAnnually ? '$99' : '$198'}<br>${this.$t('payment.monthly').toLowerCase()}`,
        },
        {
          id: products.Advanced,
          mId: prices['Advanced Monthly'],
          aId: prices['Advanced Annual'],
          name: 'Advanced',
          title: 'Продвинутый',
          team: '11+',
          mPriceInCurrency: getPriceInCurrency(398),
          mPrice: '$398',
          aPriceInCurrency: getPriceInCurrency(199),
          aPriceTotal: '$2388',
          aPrice: '$199',
          priceMonthly: '$398 в месяц, при оплате ежемесячно',
          econ: 'в месяц, экономия 50% при оплате за год',
          description: 'Идеально подойдет малому и среднему бизнесу для повышения дохода компании',
          feats: ['Оформление аккаунта в соответствии с фирменным стилем компании', 'Настраиваемая реклама на странице кабинета клиента', 'Отправка СМС уведомлений'],
          active: this.currentProductId === products.Advanced,
          annotation: `${isAnnually ? '$199' : '$398'}<br>${this.$t('payment.monthly').toLowerCase()}`,
        },
        {
          id: products.Premium || 'Premium',
          isCustomPrice: true,
          name: 'Premium',
          title: 'Премиум',
          team: '25+',
          aPrice: '$~',
          econ: 'Индивидуальная цена зависит от условий обслуживания',
          description: 'Индивидуальный подход — индивидуален во всем',
          feats: ['Помощь всей компании перейти на логику ZENNNN', 'Поддержка 24/7', 'Серверная инфраструктура', 'Оформление аккаунта в соответствии с фирменным стилем компании', 'Настраиваемая реклама на странице кабинета клиента', 'Синяя галочка «Авторизовано ZENNNN»', 'Отправка СМС уведомлений'],
          annotation: this.$t('payment.personalPrice'),
        },
      ]
    },
    localeCurrency () {
      switch (this.$i18n.locale) {
        case 'fr': return 'EUR'
        case 'ru': return 'RUB'
        case 'zh-Hans':
        case 'zh-Hant': return 'CNY'
        default: return 'USD'
      }
    },
  },
  watch: {
    selectedProduct (val) {
      this.$emit('update:selected', val)
      if (this.initProductId && !this.isBooted && val.id) {
        this.$emit('select', val)
        this.isBooted = true
      }
    },
  },
  created () {
    this.getRates()
  },
  mounted () {
    if (this.currentProductId) {
      this.selectedProductId = this.currentProductId
    }
    if (this.initProductId) {
      this.selectedProductId = this.initProductId
    }
  },
  methods: {
    onClick (item) {
      // TODO: on premiuim show contact dialog
      if (item.isCustomPrice) return
      this.selectedProductId = item.id
      this.$emit('select', item)
    },
    async getRates () {
      try {
        const response = await this.$axios.get('https://api.exchangeratesapi.io/latest?base=USD&symbols=USD,CNY,RUB,EUR,GBP')
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
