<template>
  <div class="flex-grow flex flex-col">
    <!-- / HEADER -->
    <Header light :org="orgId">
      <template v-slot:breadcrumbs>
        <div class="flex items-center pl-2 sm:pl-6">
          <i class="hidden sm:block zi-chevron-up text-2xl text-gray-75 transform rotate-90" />
          <div class="hidden sm:block ml-2 sm:ml-6">
            {{ $t('payment.title') }}
          </div>
        </div>
      </template>
    </Header>
    <!-- HEADER / -->
    <!-- / MAIN -->
    <v-dialog
      v-model="successDialog"
      max-width="458"
      content-class="relative text-gray-200 bg-gray-50 text-center p-8"
    >
      <span class="absolute text-right top-0 right-0 pt-2 pr-2">
        <i
          class="zi-close text-2xl text-gray-200 hover:text-gray-300 cursor-pointer"
          @click="successDialog = false"
        />
      </span>
      <div class="py-10">
        {{ $t('payment.subscriptionPaid', { plan: successProductName }) }}
      </div>
      <div>
        <Button
          outlined
          merge-class="border-gray-100"
          @click="successDialog = false"
        >
          {{ $t('payment.please') }}
        </Button>
      </div>
    </v-dialog>
    <main class="container container--xs flex-grow max-w-screen-md mx-auto pt-16 pb-32">
      <h1
        class="text-40 font-bold leading-tight mb-6"
      >
        {{ $t('payment.title') }}
      </h1>
      <!-- PROFILE -->
      <div class="flex flex-col sm:flex-row items-center justify-between bg-white rounded-lg py-4 px-6">
        <div class="flex sm:flex-1 items-center w-full">
          <div class="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0" :class="{ 'bg-gray-100': !profile.picture }">
            <img v-if="profile.picture" :src="profile.picture" alt="Avatar" class="w-full h-full object-cover">
            <i v-else class="zi-user text-3xl text-gray-75" />
          </div>
          <div class="pl-4">
            <div class="text-lg font-medium">{{ `${profile.givenName} ${profile.familyName}` }}</div>
            <div class="text-gray-100">{{ profile.email }}</div>
          </div>
        </div>
        <div class="sm:flex-1 w-full sm:max-w-xs border-t sm:border-t-0 sm:border-l border-gray-75 pt-4 mt-4 sm:mt-0 sm:pt-0 sm:ml-6 sm:pl-6">
          <div class="flex justify-between">
            <div>
              <div class="h-6 text-lg font-semibold mb-xs">{{ productName }}</div>
              <!-- CHANGE PLAN DIALOG -->
              <div class="text-gray-100">{{ $t('payment.tariffTitle') }}</div>
            </div>
            <div v-if="profile.account" class="text-right">
              <div
                v-if="subscriptionStatus"
                :class="[subscriptionStatus === 'paid' ? 'bg-green-500' : subscriptionStatus === 'trial' ? 'bg-yellow-500' : 'bg-pink-500']"
                class="h-6 inline-flex items-center rounded-md text-sm font-semibold text-white px-2 mb-xs"
              >
                {{ $t(`payment.${subscriptionStatus}`) }}
              </div>
              <div v-if="profile.account.periodEnd" class="text-gray-100">
                <span v-if="subscriptionStatus !== 'expired'" class="mr-1">{{ $t('payment.until') }}</span>
                <span>{{ $d($parseDate(profile.account.periodEnd * 1000)) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- ALERT -->
      <div class="pt-6">
        <Alert
          :value="true"
          :close="false"
          color="warn"
          max-width="none"
          text-color="text-gray-500"
          icon-color="text-yellow-500"
          bg-color="bg-yellow-500 bg-opacity-20"
        >
          <span v-html="$t('payment.paymentAlert', { email: profile.email })" />
        </Alert>
      </div>
      <!-- TARIFF CHANGE -->
      <div class="text-black flex flex-col sm:flex-row justify-between pt-16">
        <h3 class="text-2xl pb-6 sm:pb-0">
          {{ $t('payment.selectedPlan') }}:
        </h3>
        <Select
          v-model="selectedProduct"
          :placeholder="$t('placeholder.notChosen')"
          :items="products"
          :padded="false"
          :input-class="selectedProduct ? 'placeholder-gray-100 text-gray-900 font-semibold text-right' : 'placeholder-gray-100'"
          :disabled="isInvoice"
          readonly
          return-object
          item-value="id"
          item-text="title"
          content-class="bg-white shadow-gray-75"
          prepend-slot-class="w-auto flex-grow text-base text-gray-900"
        >
          <template v-if="selectedProduct" v-slot:prepend>
            <div class="w-full flex justify-between pl-4">
              <div>{{ selectedProduct && selectedProduct.members }}</div>
            </div>
          </template>
          <template v-slot:item="{ item }">
            <div class="w-full flex justify-between pl-2">
              <div class="pr-5">{{ item.members }}</div>
              <div class="font-semibold pl-5 pr-8">{{ item.title }}</div>
            </div>
          </template>
        </Select>
      </div>
      <div class="border-b border-gray-75 my-16" />
      <!-- PAYMENT TYPE -->
      <div v-if="selectedProduct && selectedProduct.name === 'Premium'">
        <h3 class="text-2xl pb-4">{{ $t('payment.contactTitle') }}:</h3>
        <div class="flex flex-wrap">
          <div class="w-full sm:w-1/2 sm:pr-5">
            <PriceContactForm no-dialog />
          </div>
          <div class="w-full sm:w-1/2 sm:pl-5 pt-8">
            {{ $t('payment.contactHint') }}
          </div>
        </div>
      </div>
      <div v-else class="text-black">
        <h3 class="text-2xl pb-4">
          {{ $t('payment.selectPaymentType') }}:
        </h3>
        <div
          v-if="isInvoice"
          class="border-blue-500 bg-white h-14 flex items-center justify-between rounded-md cursor-pointer border-2 border-transparent p-4"
        >
          <div class="sm:w-64">{{ $t('payment.invoiceAmount') }}</div>
          <div class="hidden sm:block md:w-64 mx-8">
            <div class="h-px bg-gray-75 w-full" />
          </div>
          <div class="flex items-center w-full">
            <span class="font-bold">{{ invoiceProduct.price }}</span>
            <span v-if="invoiceProduct.priceInCurrency" class="pl-1">~</span>
            <span v-if="invoiceProduct.priceInCurrency" class="pl-1">{{ invoiceProduct.priceInCurrency }}</span>
          </div>
        </div>
        <div
          v-else-if="isPromo"
          class="border-blue-500 bg-white h-14 flex items-center justify-between rounded-md cursor-pointer border-2 border-transparent p-4"
        >
          <div class="sm:w-64">{{ $t('payment.extendMonth') }}</div>
          <div class="hidden sm:block md:w-64 mx-8">
            <div class="h-px bg-gray-75 w-full" />
          </div>
          <div class="flex items-center w-full">
            <span class="font-bold">{{ promoProduct.price }}</span>
            <span v-if="promoProduct.priceInCurrency" class="pl-1">~</span>
            <span v-if="promoProduct.priceInCurrency" class="pl-1">{{ promoProduct.priceInCurrency }}</span>
            <span class="pl-1">{{ $t('payment.forMonth') }}</span>
            <div class="relative h-8 flex items-center rounded-md font-semibold text-white bg-yellow-400 border-yellow-400 ml-6 px-2">
              {{ $t('payment.bonusMonth') }}
              <div class="absolute left-0 top-0 transform translate-y-1/2 border-transparent -ml-2" style="border-width: 8px 8px 8px 0; border-right-color: inherit;" />
            </div>
          </div>
        </div>
        <template v-else>
          <div
            v-show="selectedProduct.mId !== currentPriceId"
            :class="[{ 'border-blue-500 bg-white': currentPaymentType === 'MONTHLY' }]"
            class="h-14 relative flex items-center justify-between rounded-md cursor-pointer border-2 border-transparent p-4 mb-4"
            @click="selectPaymentType('MONTHLY')"
          >
            <div v-if="selectedProduct.aId === currentPriceId" class="sm:w-64">
              {{ $t('payment.monthly') }}
            </div>
            <RadioInput
              v-else
              v-model="currentPaymentType"
              value="MONTHLY"
              label="MONTHLY"
              hide-details
              class="sm:w-64"
            >
              <span class="ml-4">{{ $t('payment.monthly') }}</span>
            </RadioInput>
            <div class="hidden sm:block md:w-64 mx-8">
              <div class="h-px bg-gray-75 w-full" />
            </div>
            <div class="flex flex-wrap sm:flex-no-wrap justify-end sm:justify-start items-center w-full">
              <span class="font-bold">{{ selectedProduct.mPrice }}</span>
              <span v-if="selectedProduct.mPriceInCurrency" class="pl-1">~</span>
              <span v-if="selectedProduct.mPriceInCurrency" class="pl-1">{{ selectedProduct.mPriceInCurrency }}</span>
              <span class="pl-1">{{ $t('payment.inMonth') }}</span>
            </div>
          </div>
          <div
            v-show="selectedProduct.aId !== currentPriceId"
            :class="[{ 'border-blue-500 bg-white': currentPaymentType === 'ANNUALLY' }]"
            class="h-14 relative flex items-center justify-between rounded-md border-2 border-transparent p-4"
            @click="selectPaymentType('ANNUALLY')"
          >
            <div v-if="selectedProduct.mId === currentPriceId" class="sm:w-64">
              {{ $t('payment.annual') }}
            </div>
            <RadioInput
              v-else
              v-model="currentPaymentType"
              value="ANNUALLY"
              label="ANNUALLY"
              hide-details
              class="sm:w-64"
            >
              <span class="ml-4">{{ $t('payment.annual') }}</span>
            </RadioInput>
            <div class="hidden sm:block md:w-64 mx-8">
              <div class="h-px bg-gray-75 w-full" />
            </div>
            <div class="flex flex-wrap sm:flex-no-wrap justify-end sm:justify-start items-center w-full">
              <span class="font-bold">{{ selectedProduct.aPriceTotal }}</span>
              <span class="pl-1">/</span>
              <span v-if="selectedProduct.aPriceInCurrency" class="pl-1">~</span>
              <span class="pl-1">{{ selectedProduct.aPriceInCurrency || selectedProduct.aPrice }}</span>
              <span class="pl-1">{{ $t('payment.inMonth') }}</span>
              <div class="relative sm:h-8 flex items-center rounded-md font-semibold text-white bg-yellow-400 border-yellow-400 ml-6 px-2">
                {{ $t('payment.econ') }}
                <div class="hidden sm:block absolute left-0 top-0 transform translate-y-1/2 border-transparent -ml-2" style="border-width: 8px 8px 8px 0; border-right-color: inherit;" />
              </div>
            </div>
          </div>
        </template>
        <div class="flex justify-between text-xl sm:text-2xl pt-10 pr-4 mr-xs">
          <div class="sm:w-64">{{ $t('payment.total') }}:</div>
          <div class="hidden sm:block md:w-64 mx-8" />
          <div v-if="isInvoice" class="flex items-center w-full pl-4 ml-xs">
            <span class="font-bold">{{ invoiceProduct.price }}</span>
            <span v-if="invoiceProduct.priceInCurrency" class="pl-1">~</span>
            <span v-if="invoiceProduct.priceInCurrency" class="pl-1">{{ invoiceProduct.priceInCurrency }}</span>
          </div>
          <div v-else-if="isPromo" class="flex items-center w-full pl-4 ml-xs">
            <span class="font-bold">{{ promoProduct.price }}</span>
            <span v-if="promoProduct.priceInCurrency" class="pl-1">~</span>
            <span v-if="promoProduct.priceInCurrency" class="pl-1">{{ promoProduct.priceInCurrency }}</span>
          </div>
          <div v-else class="flex flex-wrap sm:flex-no-wrap justify-end sm:justify-start items-center w-full pl-4 ml-xs">
            <span class="font-bold">{{ currentPaymentType === 'ANNUALLY' ? selectedProduct.aPriceTotal : selectedProduct.mPrice }}</span>
            <span v-if="currentPaymentType === 'ANNUALLY'" class="pl-1">/</span>
            <span v-if="selectedProduct.mPriceInCurrency || selectedProduct.aPriceInCurrency" class="pl-1">~</span>
            <span class="pl-1">{{ currentPaymentType === 'ANNUALLY' ? selectedProduct.aPriceInCurrency || selectedProduct.aPrice : selectedProduct.mPriceInCurrency }}</span>
            <span class="pl-1">{{ $t('payment.inMonth') }}</span>
          </div>
        </div>
      </div>
      <v-expand-transition>
        <div v-show="selectedProduct && selectedProduct.name !== 'Premium'">
          <div class="border-b border-gray-75 my-16" />
          <PaymentCard
            :default-payment-method-id="defaultPm && defaultPm.id"
            :payment-type="paymentType"
            :selected-price-id="selectedPriceId"
            :invoice-id="invoiceId"
            :billing-address="profile.account && !profile.account.hasBillingAddress"
            @back="goBack"
            @complete="onComplete"
          />
        </div>
      </v-expand-transition>
    </main>
    <!-- MAIN / -->
    <Footer />
  </div>
</template>

<script>
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import PaymentCard from '../components/PaymentCard.vue'
import PriceContactForm from '../components/PriceContactForm.vue'

import { GET_PROFILE, LIST_PRICES, LIST_PAYMENT_METHODS } from '../graphql/queries'
import { PAYMENT_DATA } from '../graphql/subscriptions'

export default {
  name: 'Payment',
  components: {
    Header,
    Footer,
    PaymentCard,
    PriceContactForm,
  },
  metaInfo: {
    style: [
      { cssText: 'body { background-color: #F7F7F7!important }', type: 'text/css' },
    ],
  },
  apollo: {
    getProfile: {
      query: GET_PROFILE,
      fetchPolicy: 'cache-first',
    },
    listPrices: {
      query: LIST_PRICES,
    },
    listPaymentMethods: {
      query: LIST_PAYMENT_METHODS,
      fetchPolicy: 'no-cache',
    },
  },
  data () {
    return {
      currentPaymentType: 'MONTHLY',
      retryInvoiceDialog: false,
      retryInvoice: null,
      successDialog: false,
      successProductName: '',
      currencyRates: {},
      changeDialog: false,
      changePaymentDialog: false,
      lazySelectedProduct: null,
    }
  },
  computed: {
    paymentType () {
      const type = this.$route.params.type
      if (type === 'promo') {
        return this.profile.account && this.profile.account.canPromo && this.selectedProduct.name === 'Advanced'
          ? 'promo' : 'change'
      }
      return type
    },
    invoiceId () {
      if (this.paymentType === 'invoice') {
        const account = this.profile.account || {}
        const latestInvoiceId = (account.subscriptionStatus === 'incomplete' || account.subscriptionStatus === 'past_due') ? account.latestInvoiceId : null
        return this.$route.query.invoiceId || latestInvoiceId
      }
      return null
    },
    currentProductId () {
      return this.profile.account && this.profile.account.productId
    },
    currentPriceId () {
      return this.profile.account && this.profile.account.priceId
    },
    selectedProduct: {
      get () {
        if (this.lazySelectedProduct) return this.lazySelectedProduct
        const routeProduct = this.products.find(el => el.id === this.$route.query.product)
        if (routeProduct) return routeProduct
        const productId = this.profile.account && this.profile.account.productId
        return this.products.find(el => el.id === productId) || {}
      },
      set (val) {
        this.lazySelectedProduct = val
      },
    },
    selectedPriceId () {
      const key = this.currentPaymentType === 'MONTHLY' ? 'mId' : 'aId'
      return this.selectedProduct[key]
    },
    prices () {
      return this.listPrices || []
    },
    promoProduct () {
      const currencyRate = this.currencyRates[this.localeCurrency]
      const priceInCurrency = this.localeCurrency !== 'USD'
        ? this.$n(Math.round(1 * currencyRate), {
          style: 'currency',
          currency: this.localeCurrency,
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        })
        : null
      return {
        price: '$1',
        priceInCurrency,
      }
    },
    invoiceProduct () {
      const invoiceAmount = Number(this.$route.query.amount || 0)
      const currencyRate = this.currencyRates[this.localeCurrency]
      const priceInCurrency = this.localeCurrency !== 'USD'
        ? this.$n(Math.round(invoiceAmount * currencyRate), {
          style: 'currency',
          currency: this.localeCurrency,
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        })
        : null
      return {
        price: this.$n(Math.round(invoiceAmount * currencyRate), {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        }),
        priceInCurrency,
      }
    },
    products () {
      const currencyRate = this.currencyRates[this.localeCurrency]
      const getPriceInCurrency = (rate) => this.localeCurrency !== 'USD'
        ? this.$n(Math.round(rate * currencyRate), {
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
          title: this.$t('payment.start'),
          mPriceInCurrency: getPriceInCurrency(30),
          mPrice: '$30',
          aPriceInCurrency: getPriceInCurrency(15),
          aPriceTotal: '$180',
          aPrice: '$15',
          current: this.currentProductId === products.Start,
          members: this.$t('payment.startMembers'),
        },
        {
          id: products.Standard,
          mId: prices['Standard Monthly'],
          aId: prices['Standard Annual'],
          name: 'Standard',
          title: this.$t('payment.standard'),
          mPriceInCurrency: getPriceInCurrency(198),
          mPrice: '$198',
          aPriceInCurrency: getPriceInCurrency(99),
          aPriceTotal: '$1188',
          aPrice: '$99',
          current: this.currentProductId === products.Standard,
          members: this.$t('payment.standardMembers'),
        },
        {
          id: products.Advanced,
          mId: prices['Advanced Monthly'],
          aId: prices['Advanced Annual'],
          name: 'Advanced',
          title: this.$t('payment.advanced'),
          mPriceInCurrency: getPriceInCurrency(398),
          mPrice: '$398',
          aPriceInCurrency: getPriceInCurrency(199),
          aPriceTotal: '$2388',
          aPrice: '$199',
          current: this.currentProductId === products.Advanced,
          members: this.$t('payment.advancedMembers'),
        },
        {
          id: products.Premium || 'Premium',
          isCustomPrice: true,
          name: 'Premium',
          title: this.$t('payment.premium'),
          aPrice: '$~',
          members: this.$t('payment.premiumMembers'),
        },
      ]
    },
    orgId () {
      return this.profile.account && this.profile.account.org
    },
    isTrialing () {
      return this.profile.account && this.profile.account.subscriptionStatus === 'trialing'
    },
    isPromo () {
      return this.paymentType === 'promo'
    },
    isInvoice () {
      return this.paymentType === 'invoice'
    },
    productName () {
      if (
        this.profile.account &&
        (!this.profile.account.subscriptionId || this.profile.account.price === 'Trial' || this.profile.account.price === 'Promo')
      ) return ''
      const price = (this.profile.account && this.profile.account.price) || ''
      if (price.includes('Start')) return this.$t('payment.start')
      if (price.includes('Standard')) return this.$t('payment.standard')
      if (price.includes('Advanced')) return this.$t('payment.advanced')
      if (price.includes('Premium')) return this.$t('payment.premium')
      return ''
    },
    subscriptionStatus () {
      const account = this.profile.account || {}
      if (account.price === 'Trial' || account.price === 'Promo' || account.subscriptionStatus === 'trialing') return 'trial'
      if (account.subscriptionStatus === 'active') return 'paid'
      if (account.subscriptionStatus && account.periodEnd) return 'expired'
      return ''
    },
    defaultPm () {
      const result = this.listPaymentMethods || []
      return result.find(el => el.isDefault)
    },
    paymentMethods () {
      const result = this.listPaymentMethods || []
      return result.filter(el => !el.isDefault)
    },
    canChange () {
      return this.profile.account &&
        (this.profile.account.subscriptionId &&
          (this.profile.account.subscriptionStatus === 'active' || this.profile.account.subscriptionStatus === 'trialing') &&
          !(this.profile.account.price === 'Trial' || this.profile.account.price === 'Promo'))
    },
    canSelect () {
      return this.profile.account &&
        (!this.profile.account.subscriptionId || this.profile.account.price === 'Trial' || this.profile.account.price === 'Promo')
    },
    canCancel () {
      return this.profile.account && !this.profile.account.cancelAtPeriodEnd
    },
    isCanceled () {
      return this.profile.account &&
        (this.profile.account.subscriptionId && this.profile.account.cancelAtPeriodEnd && !(this.profile.account.price === 'Trial' || this.profile.account.price === 'Promo'))
    },
    profile () {
      return this.getProfile || {}
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
      if (val && val.id === this.currentProductId) {
        if (this.currentPriceId === val.mId) {
          this.currentPaymentType = 'ANNUALLY'
        }
        if (this.currentPriceId === val.aId) {
          this.currentPaymentType = 'MONTHLY'
        }
      }
    },
    retryInvoiceDialog (val) {
      if (!val) {
        setTimeout(() => {
          this.retryInvoice = null
        }, 150)
      }
    },
    changePaymentDialog (val) {
      if (val) {
        const el = document.querySelector('.payment-dialog')
        if (el) {
          setTimeout(() => {
            el.scrollTop = 0
          }, 0)
        }
      }
    },
  },
  created () {
    this.getRates()
    if (this.$route.query.interval === 'annual') {
      this.currentPaymentType = 'ANNUALLY'
    }
  },
  mounted () {
    this.getRates()
    const observer = this.$apollo.subscribe({
      query: PAYMENT_DATA,
      fetchPolicy: 'no-cache',
    })

    observer.subscribe({
      next: ({ data }) => {
        const paymentData = data.paymentData
        const operation = paymentData.operation
        const payload = paymentData.payload
        this.$logger.info('payment', operation, payload)
        if (operation === 'invoice.payment_succeeded') {
          // this.$notify({ color: 'success', text: 'Payment success.' })
        }
        if (operation === 'invoice.payment_failed') {
          // this.$notify({ color: 'error', text: 'Payment failed.' })
        }
        // update profile
        this.$apollo.queries.getProfile.refetch()
      },
    })
  },
  methods: {
    selectPaymentType (type) {
      if (type === 'MONTHLY' && this.selectedProduct.mId === this.currentPriceId) return
      if (type === 'ANNUALLY' && this.selectedProduct.aId === this.currentPriceId) return
      this.currentPaymentType = type
    },
    onComplete (type) {
      this.$router.push({ name: 'subscription', query: { state: 'success' } })
    },
    openInvoice (invoice) {
      this.retryInvoice = invoice
      this.retryInvoiceDialog = true
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
    showSuccess (name) {
      this.successProductName = name
      this.successDialog = true
    },
    changeComplete () {
      this.changeDialog = false
      this.changePaymentDialog = false
      this.$apollo.queries.listPaymentMethods.refetch()
    },
    retryInvoiceComplete () {
      this.retryInvoiceDialog = false
      this.$apollo.queries.listPaymentMethods.refetch()
    },
    goBack () {
      this.$router.go(-1)
    },
  },
}
</script>
