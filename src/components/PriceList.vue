<template>
  <div class="tariff-card leading-snug bg-white overflow-hidden rounded-md flex flex-wrap sm:justify-center">
    <div
      v-for="(item, i) of plans"
      :key="i"
      :class="{ 'bg-gray-50': !selectable && item.name === 'advanced' || selectable && item.id === selectedProductId }"
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
          {{ item.econ }}
        </div>
        <div class="text-gray-200">
          {{ item.priceMonthly }}
        </div>
      </div>
      <div class="pb-4">
        <Button
          :href="!selectable && !item.isCustomPrice ? '/signup' : null"
          :disabled="(selectable && item.id === selectedProductId)"
          block
          outlined
          merge-class="border-gray-100"
          @click.prevent="onClick(item)"
        >
          {{ item.isCustomPrice ? contactText : currentProductId === item.id ? currentText : selectText }}
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

export default {
  name: 'PriceList',
  props: {
    selected: Object,
    isLoggedIn: Boolean,
    selectable: Boolean,
    selectText: String,
    contactText: String,
    selectedText: String,
    currentText: String,
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
      tr: {
        monthly: 'Ежемесячно',
        annual: 'Годовой',
      },
      currencyRates: {},
      selectedPriceId: 'price_1GpvdQL0ixdq6yFA9VnT5AhJ',
      selectedProductId: 'prod_HOj4MaSQePRFeJ',
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
    // TODO: get prices from api
    plans () {
      const currencyRate = this.currencyRates[this.localeCurrency]
      const getPriceInCurrency = (rate) => this.localeCurrency !== 'USD'
        ? Math.round((rate * currencyRate)).toLocaleString(this.$i18n.locale, { minimumFractionDigits: 0, maximumFractionDigits: 2, style: 'currency', currency: this.localeCurrency })
        : null
      return [
        {
          id: 'prod_HOj4MaSQePRFeJ',
          mId: 'price_1GpvdQL0ixdq6yFA9VnT5AhJ',
          aId: 'price_1GpvdaL0ixdq6yFAIdL8OKol',
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
          active: this.selectedPrice.product === 'prod_HOj4MaSQePRFeJ',
        },
        {
          id: 'prod_HOj4b9GTu9flo4',
          mId: 'price_1GpvdkL0ixdq6yFA8HTMAaKe',
          aId: 'price_1GpvdsL0ixdq6yFAePSviaPj',
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
          active: this.selectedPrice.product === 'prod_HOj4b9GTu9flo4',
        },
        {
          id: 'prod_HOj46NmDdiNA7K',
          mId: 'price_1GpveIL0ixdq6yFAPc5mS8UO',
          aId: 'price_1GpveSL0ixdq6yFARApKbzyu',
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
          active: this.selectedPrice.product === 'prod_HOj46NmDdiNA7K',
        },
        {
          id: 'prod_HOj4kf4CvQ5wpV',
          isCustomPrice: true,
          name: 'Premium',
          title: 'Премиум',
          team: '25+',
          aPrice: '$~',
          econ: 'Индивидуальная цена зависит от условий обслуживания',
          description: 'Индивидуальный подход — индивидуален во всем',
          feats: ['Помощь всей компании перейти на логику ZENNNN', 'Поддержка 24/7', 'Серверная инфраструктура', 'Оформление аккаунта в соответствии с фирменным стилем компании', 'Настраиваемая реклама на странице кабинета клиента', 'Синяя галочка «Авторизовано ZENNNN»', 'Отправка СМС уведомлений'],
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
      // TODO: on premiuim show contact dialog
      if (item.isCustomPrice) return
      if (this.selectable) {
        this.selectedProductId = item.id
      } else {
        // TODO: save price to storage with guest session for init in registration
        // if is not selectable and isLoggedIn redirect to price change page
        this.$router.push({ name: 'signup' }).catch(() => {})
      }
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
