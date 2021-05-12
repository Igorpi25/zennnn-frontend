<template>
  <div class="flex-grow flex flex-col">
    <!-- / HEADER -->
    <Header light :org="orgId">
      <template v-slot:breadcrumbs>
        <div class="flex items-center pl-2 sm:pl-6">
          <Icon class="hidden sm:block text-light-gray-400">
            {{ icons.ziChevronRight }}
          </Icon>
          <div class="hidden sm:block ml-2 sm:ml-6">
            {{ $t('payment.subscriptionManagement') }}
          </div>
        </div>
      </template>
    </Header>
    <!-- HEADER / -->
    <!-- / MAIN -->
    <Modal
      v-model="successDialog"
      max-width="458"
      content-class="relative text-gray-200 bg-light-gray-100 text-center p-8"
    >
      <span class="absolute text-right top-0 right-0 pt-2 pr-2">
        <Icon
          class="text-gray-200 hover:text-gray-300 cursor-pointer"
          @click="successDialog = false"
        >
          {{ icons.ziCloseWindow }}
        </Icon>
      </span>
      <div class="py-10">
        {{ $t('payment.subscriptionPaid', { plan: successProductName }) }}
      </div>
      <div>
        <Btn
          outlined
          class="border-gray-100"
          min-width="185"
          @click="successDialog = false"
        >
          {{ $t('payment.please') }}
        </Btn>
      </div>
    </Modal>
    <main class="container flex-grow max-w-screen-md mx-auto pt-16 pb-32">
      <h1
        class="text-40 font-bold leading-tight mb-6"
      >
        {{ $t('payment.subscriptionManagement') }}
      </h1>
      <!-- PROFILE -->
      <div class="flex flex-col sm:flex-row items-center justify-between bg-white rounded-lg py-4 px-6">
        <div class="flex sm:flex-1 items-center w-full">
          <div class="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0" :class="{ 'bg-gray-100': !profile.picture }">
            <img v-if="profile.picture" :src="profile.picture" alt="Avatar" class="w-full h-full object-cover">
            <Icon v-else large class="text-light-gray-400">
              {{ icons.ziUser }}
            </Icon>
          </div>
          <div class="pl-4">
            <div class="text-lg font-medium">{{ `${profile.givenName} ${profile.familyName}` }}</div>
            <div class="text-gray-100">{{ profile.email }}</div>
          </div>
        </div>
        <div class="sm:flex-1 w-full sm:max-w-xs border-t sm:border-t-0 sm:border-l border-light-gray-400 pt-4 mt-4 sm:mt-0 sm:pt-0 sm:ml-6 sm:pl-6">
          <div class="flex justify-between">
            <div class="">
              <div class="h-6 text-lg font-semibold mb-xs">{{ productName }}</div>
              <!-- CHANGE PLAN DIALOG -->
              <div v-if="(canChange || canSelect)">
                <Modal
                  v-model="changeDialog"
                  max-width="458"
                  eager
                >
                  <template v-slot:activator>
                    <button
                      class="select-none focus:outline-none text-blue-500 focus:text-blue-400 hover:text-blue-400"
                    >
                      {{ canChange ? $t('payment.changePlan') : $t('payment.selectPlan') }}
                    </button>
                  </template>
                  <PriceSelect
                    :change-price="canChange"
                    :init-product-id="$route.query.product"
                    :current-product-id="profile.account && profile.account.productId"
                    :current-price-id="profile.account && profile.account.priceId"
                    @close="changeDialog = false"
                    @select="goToPayment"
                  />
                </Modal>
              </div>
              <div v-else class="text-gray-100">{{ $t('payment.tariffTitle') }}</div>
            </div>
            <div v-if="profile.account" class="text-right">
              <div
                v-if="subscriptionStatus"
                :class="[subscriptionStatus === 'paid' ? 'bg-green-500' : subscriptionStatus === 'trial' ? 'bg-yellow-500' : 'bg-pink-500']"
                class="h-6 inline-flex items-center rounded-md text-sm font-semibold text-white px-2 mb-xs"
              >
                {{ $t(`payment.${subscriptionStatus}`) }}
              </div>
              <div v-if="profile.account.periodEnd">
                <span v-if="subscriptionStatus !== 'expired'" class="mr-1">{{ $t('payment.until') }}</span>
                <span>{{ $d($parseDate(profile.account.periodEnd * 1000)) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- CANCEL SUBSCRIPTION -->
      <div v-if="canChange && canCancel" class="text-right py-2 px-3">
        <Modal
          v-model="cancelSubscriptionDialog"
          max-width="458"
          content-class="relative text-gray-200 bg-light-gray-100 p-8 pt-6"
        >
          <template v-slot:activator>
            <button
              class="select-none focus:outline-none text-pink-500 focus:text-pink-600 hover:text-pink-600"
            >
              {{ $t('payment.cancelSubscription') }}
            </button>
          </template>
          <span class="absolute w-10 text-right top-0 right-0 pt-3 pr-3">
            <Icon
              class="hover:text-gray-300 cursor-pointer"
              @click="cancelSubscriptionDialog = false"
            >
              {{ icons.ziCloseWindow }}
            </Icon>
          </span>
          <div>
            <div class="font-semibold text-lg pb-sm">
              {{ $t('payment.cancelTitle') }}
            </div>
            <div class="py-10" v-html="$t('payment.cancelText')" />
            <div class="flex flex-wrap sm:flex-nowrap sm:justify-between">
              <Btn
                :loading="cancelSubscriptionLoading"
                block
                class="bg-pink-500 hover:bg-pink-600 focus:bg-pink-600 mb-3 sm:mb-0 sm:mr-3"
                @click="cancelSubscription"
              >
              {{ $t('payment.cancelSubscription') }}
              </Btn>
              <Btn
                block
                outlined
                class="border-gray-100 sm:ml-3"
                @click="cancelSubscriptionDialog = false"
              >
                {{ $t('payment.notCancel') }}
              </Btn>
            </div>
          </div>
        </Modal>
      </div>
      <!-- PROMO -->
      <div
        v-if="profile.account && profile.account.canPromo"
        class="flex flex-col sm:flex-row items-center justify-between bg-white rounded-md p-4 mt-12"
      >
        <div class="text-lg text-black leading-snug pl-2 pb-4 sm:pb-0">
          <span v-html="$t('payment.oneUSD')" class="mr-1" />
        </div>
        <Btn
          :to="{ name: 'payment', params: { type: 'promo' } }"
          class="ml-4"
        >
          {{ $t('payment.proceed') }}
        </Btn>
      </div>
      <!-- PAYMENT METHODS LIST -->
      <div v-if="paymentMethods.length > 0 || defaultPm">
        <div class="border-b border-light-gray-400 mt-16 mb-16" />
        <h3 class="text-2xl pb-6">
          {{ $t('payment.paymentMethod') }}
        </h3>
        <template v-if="defaultPm">
          <h4 class="text-gray-200 mb-3">
            {{ $t('payment.defaultCard') }}
          </h4>
          <div class="overflow-x-auto scrolling-touch pb-10">
            <table class="w-full border-separate text-gray-200 border-spacing-y-1">
              <tbody>
                <tr
                  class="h-12 bg-white hover:bg-transparent group"
                >
                  <td width="52" class="rounded-l-md text-gray-100 px-4">
                    <div class="align-middle pb-1">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.9742 1.89202C9.97804 1.88604 9.98065 1.88357 9.98139 1.88289C9.98225 1.8821 9.98294 1.88163 9.98382 1.88117C9.98597 1.88004 9.99155 1.87793 10 1.87793C10.0085 1.87793 10.014 1.88004 10.0162 1.88117C10.0171 1.88163 10.0178 1.8821 10.0186 1.88289C10.0194 1.88357 10.022 1.88604 10.0258 1.89202L12.8067 6.22152C13.0816 6.64966 13.5073 6.95895 13.9995 7.08818L18.9764 8.39504C18.9833 8.39684 18.9865 8.39856 18.9873 8.39905C18.9884 8.39963 18.989 8.40014 18.9897 8.40083C18.9915 8.40253 18.9952 8.40718 18.9978 8.41522C19.0004 8.42326 19.0001 8.42922 18.9997 8.43162C18.9996 8.43259 18.9993 8.43339 18.9988 8.43446C18.9984 8.43537 18.9969 8.43862 18.9924 8.44412L15.7341 12.4268L16.462 13.0222L15.7341 12.4268C15.4119 12.8206 15.2493 13.321 15.2785 13.829L15.5735 18.9662C15.574 18.9733 15.5733 18.9768 15.5731 18.9778C15.573 18.9782 15.5729 18.9785 15.5729 18.9788C15.5727 18.9795 15.5724 18.98 15.5721 18.9806C15.5711 18.9828 15.5678 18.9878 15.561 18.9928C15.5541 18.9978 15.5484 18.9993 15.546 18.9997C15.545 18.9998 15.5441 18.9998 15.543 18.9997C15.542 18.9996 15.5384 18.9991 15.5318 18.9965L10.7372 17.1285C10.2631 16.9437 9.7369 16.9437 9.26278 17.1285L4.46821 18.9965C4.46159 18.9991 4.45802 18.9996 4.45703 18.9997C4.45586 18.9998 4.45503 18.9998 4.45405 18.9997C4.45164 18.9993 4.44589 18.9978 4.43905 18.9928C4.43221 18.9878 4.42893 18.9828 4.42786 18.9806C4.42742 18.9798 4.42714 18.979 4.4269 18.9778C4.4267 18.9768 4.42605 18.9733 4.42646 18.9662L4.72152 13.829C4.75069 13.321 4.58809 12.8206 4.26589 12.4268L1.00762 8.44412C1.00312 8.43862 1.00157 8.43537 1.00116 8.43446C1.00067 8.43339 1.00044 8.43259 1.00027 8.43162C0.999859 8.42922 0.999577 8.42326 1.00219 8.41522C1.0048 8.40718 1.00853 8.40253 1.01027 8.40083C1.01098 8.40014 1.01164 8.39963 1.01266 8.39905C1.01353 8.39856 1.01669 8.39684 1.02357 8.39504L6.0005 7.08818C6.49265 6.95895 6.91835 6.64966 7.19335 6.22152L9.9742 1.89202Z" fill="#AAAAAA" stroke="#AAAAAA" stroke-width="2"/>
                      </svg>
                    </div>
                  </td>
                  <td width="156" class="capitalize px-4">{{ defaultPm.card.brand }}</td>
                  <td class="px-4">
                    <div class="flex items-center">
                      <div
                        v-for="g in 3"
                        :key="`g-${g}`"
                        class="flex pr-3"
                      >
                        <div
                          v-for="i in 4"
                          :key="`i-${i}`"
                          class="bg-gray-100 rounded-full w-sm h-sm mr-1"
                        />
                      </div>
                      <div>
                        {{ defaultPm.card.last4 }}
                      </div>
                    </div>
                  </td>
                  <td class="px-4">{{ defaultPm.card.exp_month.toString().padStart(2, '0') }}/{{ defaultPm.card.exp_year }}</td>
                  <td width="56" class="rounded-r-md text-gray-100 px-4">
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
        <template v-if="paymentMethods.length > 0">
          <h4 class="text-gray-200 mb-3">
            {{ $t('payment.otherCards') }}
          </h4>
          <div class="overflow-x-auto scrolling-touch pb-10">
            <table class="w-full border-separate text-gray-200 border-spacing-y-1">
              <tbody>
                <tr
                  v-for="item in paymentMethods"
                  :key="item.id"
                  class="h-12 bg-white hover:bg-transparent group"
                >
                  <td width="52" class="rounded-l-md text-gray-100 px-4">
                    <Progress
                      v-if="setDefaultPaymentMethodLoading === item.id"
                      indeterminate
                      size="20"
                      width="2"
                    />
                    <button
                      v-else
                      class="align-middle invisible group-hover:visible focus:outline-none focus:text-blue-400 hover:text-blue-400 pb-1"
                      @click="setDefaultPaymentMethod(item.id)"
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.9742 1.89202C9.97804 1.88604 9.98065 1.88357 9.98139 1.88289C9.98225 1.8821 9.98294 1.88163 9.98382 1.88117C9.98597 1.88004 9.99155 1.87793 10 1.87793C10.0085 1.87793 10.014 1.88004 10.0162 1.88117C10.0171 1.88163 10.0178 1.8821 10.0186 1.88289C10.0194 1.88357 10.022 1.88604 10.0258 1.89202L12.8067 6.22152C13.0816 6.64966 13.5073 6.95895 13.9995 7.08818L18.9764 8.39504C18.9833 8.39684 18.9865 8.39856 18.9873 8.39905C18.9884 8.39963 18.989 8.40014 18.9897 8.40083C18.9915 8.40253 18.9952 8.40718 18.9978 8.41522C19.0004 8.42326 19.0001 8.42922 18.9997 8.43162C18.9996 8.43259 18.9993 8.43339 18.9988 8.43446C18.9984 8.43537 18.9969 8.43862 18.9924 8.44412L15.7341 12.4268L16.462 13.0222L15.7341 12.4268C15.4119 12.8206 15.2493 13.321 15.2785 13.829L15.5735 18.9662C15.574 18.9733 15.5733 18.9768 15.5731 18.9778C15.573 18.9782 15.5729 18.9785 15.5729 18.9788C15.5727 18.9795 15.5724 18.98 15.5721 18.9806C15.5711 18.9828 15.5678 18.9878 15.561 18.9928C15.5541 18.9978 15.5484 18.9993 15.546 18.9997C15.545 18.9998 15.5441 18.9998 15.543 18.9997C15.542 18.9996 15.5384 18.9991 15.5318 18.9965L10.7372 17.1285C10.2631 16.9437 9.7369 16.9437 9.26278 17.1285L4.46821 18.9965C4.46159 18.9991 4.45802 18.9996 4.45703 18.9997C4.45586 18.9998 4.45503 18.9998 4.45405 18.9997C4.45164 18.9993 4.44589 18.9978 4.43905 18.9928C4.43221 18.9878 4.42893 18.9828 4.42786 18.9806C4.42742 18.9798 4.42714 18.979 4.4269 18.9778C4.4267 18.9768 4.42605 18.9733 4.42646 18.9662L4.72152 13.829C4.75069 13.321 4.58809 12.8206 4.26589 12.4268L1.00762 8.44412C1.00312 8.43862 1.00157 8.43537 1.00116 8.43446C1.00067 8.43339 1.00044 8.43259 1.00027 8.43162C0.999859 8.42922 0.999577 8.42326 1.00219 8.41522C1.0048 8.40718 1.00853 8.40253 1.01027 8.40083C1.01098 8.40014 1.01164 8.39963 1.01266 8.39905C1.01353 8.39856 1.01669 8.39684 1.02357 8.39504L6.0005 7.08818C6.49265 6.95895 6.91835 6.64966 7.19335 6.22152L9.9742 1.89202Z" stroke="currentColor" stroke-width="2"/>
                      </svg>
                    </button>
                  </td>
                  <td width="156" class="capitalize px-4">{{ item.card.brand }}</td>
                  <td class="px-4">
                    <div class="flex items-center">
                      <div
                        v-for="g in 3"
                        :key="`g-${g}`"
                        class="flex pr-3"
                      >
                        <div
                          v-for="i in 4"
                          :key="`i-${i}`"
                          class="bg-gray-100 rounded-full w-sm h-sm mr-1"
                        />
                      </div>
                      <div>
                        {{ item.card.last4 }}
                      </div>
                    </div>
                  </td>
                  <td class="px-4">{{ item.card.exp_month.toString().padStart(2, '0') }}/{{ item.card.exp_year }}</td>
                  <td width="56" class="rounded-r-md text-gray-100 px-4">
                    <Progress
                      v-if="detachPaymentMethodLoading === item.id"
                      indeterminate
                      size="20"
                      width="2"
                    />
                    <button
                      v-else
                      class="align-middle invisible group-hover:visible focus:outline-none focus:text-blue-400 hover:text-blue-400"
                      @click="detachPaymentMethod(item.id)"
                    >
                      <Icon class="align-middle">
                        {{ icons.ziDelete }}
                      </Icon>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
        <div class="text-right">
          <Modal
            v-model="addPaymentMethodDialog"
            max-width="746"
            content-class="bg-light-gray-100 px-5 pt-8"
          >
            <template v-slot:activator>
              <Btn>
                {{ $t('payment.addCard') }}
              </Btn>
            </template>
            <PaymentCard
              payment-type="newPaymentMethod"
              @complete="addPaymentMethodComplete"
            />
          </Modal>
        </div>
      </div>
      <!-- PAYMENT INVOICES LIST -->
      <div v-if="paymentInvoices.length > 0" class="pb-10">
        <div class="border-b border-light-gray-400 mt-16 mb-16" />
        <h3 class="text-2xl pb-6">
          {{ $t('payment.invoices') }}
        </h3>
        <div class="overflow-x-auto scrolling-touch rounded-md bg-light-gray-300 px-sm pb-2">
          <table class="w-full table-fixed border-separate text-gray-200 border-spacing-y-1">
            <thead>
              <tr class="h-12 text-gray-100">
                <td width="146" class="px-4">{{ $t('payment.invoiceNumber') }}</td>
                <td width="156" class="pl-4 pr-2">{{ $t('payment.invoiceDate') }}</td>
                <td width="116" class="text-right pl-2 pr-4">{{ $t('payment.invoiceAmount') }}</td>
                <td width="146" class="px-4">{{ $t('payment.invoiceStatus') }}</td>
                <td width="100%"></td>
                <td width="56" class="px-4"></td>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in listPaymentInvoices"
                :key="item.id"
                class="h-12 bg-light-gray-100 hover:bg-white group"
              >
                <td class="rounded-l-md px-4">{{ item.number }}</td>
                <td class="whitespace-nowrap pl-4 pr-2">
                  <span class="pr-4">
                    {{ $d($parseDate(item.period_start * 1000)) }}
                  </span>
                  <span class="text-gray-100">
                    {{ $d($parseDate(item.period_start * 1000), 'time') }}
                  </span>
                </td>
                <td class="text-right font-semibold pl-2 pr-4">${{ $n(item.amount_due / 100) }}</td>
                <td :class="[
                  'px-4',
                  item.status === 'open'
                    ? 'text-yellow-500' : item.status === 'paid'
                      ? 'text-green-500' : item.status === 'void'
                        ? 'text-pink-500' : ''
                ]">
                  {{
                    item.status === 'draft'
                      ? $t('payment.invoiceDraft') : item.status === 'open'
                        ? $t('payment.invoiceOpen') : item.status === 'paid'
                          ? $t('payment.invoicePaid') : item.status === 'void'
                             ? $t('payment.invoiceVoid') : item.status === 'uncollectible'
                              ? $t('payment.invoiceUncollectible') : item.status
                  }}
                </td>
                <td>
                  <button
                    v-if="item.status === 'open'"
                    class="text-blue-500 focus:outline-none focus:text-blue-400 hover:text-blue-400"
                    @click="openInvoice(item)"
                  >
                    {{ $t('payment.invoicePay') }}
                  </button>
                </td>
                <td class="rounded-r-md px-4">
                  <a :href="item.invoice_pdf" target="_brank" class="invisible group-hover:visible focus:outline-none text-gray-200 hover:text-blue-400 focus:text-blue-400">
                    <Icon class="align-middle">
                      {{ icons.ziDownload }}
                    </Icon>
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
    <!-- MAIN / -->
    <Footer />
  </div>
</template>

<script>
import axios from 'axios'
import { useApolloClient, useQuery, useResult } from '@vue/apollo-composable'

import { ziUser, ziDelete, ziDownload, ziChevronRight, ziCloseWindow } from '@zennnn/icons'
import { Btn, Icon, Modal, Progress } from '@zennnn/core'

import { GET_PROFILE, LIST_PAYMENT_METHODS, LIST_PAYMENT_INVOICES } from '../graphql/queries'
import { CANCEL_PAYMENT_SUBSCRIPTION, SET_DEFAULT_PAYMENT_METHOD, DETACH_PAYMENT_METHOD } from '../graphql/mutations'
import { PAYMENT_DATA } from '../graphql/subscriptions'

import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import PaymentCard from '../components/PaymentCard.vue'
import PriceSelect from '../components/PriceSelect.vue'

export default {
  name: 'Subscription',
  components: {
    Btn,
    Icon,
    Modal,
    Progress,
    Header,
    Footer,
    PaymentCard,
    PriceSelect,
  },
  // metaInfo: {
  //   style: [
  //     { cssText: 'body { background-color: #F7F7F7!important }', type: 'text/css' },
  //   ],
  // },
  setup () {
    const { resolveClient } = useApolloClient()
    const apolloClient = resolveClient()

    const { result: result1, refetch: getProfileRefetch } = useQuery(GET_PROFILE, null, { fetchPolicy: 'network-only' })
    const getProfile = useResult(result1)

    const { result: result2, refetch: listPaymentMethodsRefetch } = useQuery(LIST_PAYMENT_METHODS, null, { fetchPolicy: 'no-cache' })
    const listPaymentMethods = useResult(result2)

    const { result: result3, refetch: listPaymentInvoicesRefetch } = useQuery(LIST_PAYMENT_INVOICES, null, { fetchPolicy: 'no-cache' })
    const listPaymentInvoices = useResult(result3)

    return {
      icons: {
        ziUser,
        ziDelete,
        ziDownload,
        ziChevronRight,
        ziCloseWindow,
      },
      apolloClient,
      getProfile,
      getProfileRefetch,
      listPaymentMethods,
      listPaymentMethodsRefetch,
      listPaymentInvoices,
      listPaymentInvoicesRefetch,
    }
  },
  data () {
    return {
      successDialog: false,
      successProductName: '',
      currencyRates: {},
      changeDialog: false,
      setDefaultPaymentMethodLoading: null,
      detachPaymentMethodLoading: null,
      addPaymentMethodDialog: false,
      cancelSubscriptionDialog: false,
      cancelSubscriptionLoading: false,
      selectedProduct: null,
    }
  },
  computed: {
    orgId () {
      return this.profile.account && this.profile.account.org
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
    paymentInvoices () {
      return this.listPaymentInvoices || []
    },
    canChange () {
      return this.profile.account &&
        (this.profile.account.subscriptionId &&
          (this.profile.account.subscriptionStatus === 'active' || this.profile.account.subscriptionStatus === 'trialing'))
    },
    canSelect () {
      return this.profile.account && this.profile.account.subscriptionId
    },
    canCancel () {
      return this.profile.account && !this.profile.account.cancelAtPeriodEnd
    },
    isTrialing () {
      return this.profile.account && this.profile.account.subscriptionStatus === 'trialing'
    },
    isCanceled () {
      return this.profile.account &&
        (this.profile.account.subscriptionId && this.profile.account.cancelAtPeriodEnd && !(this.profile.account.price === 'Trial' || this.profile.account.price === 'Promo'))
    },
    profile () {
      return this.getProfile || {}
    },
  },
  created () {
    this.getRates()
  },
  mounted () {
    if (this.$route.query.state === 'success') {
      this.successDialog = true
      this.$router.push({ query: {} })
    }
    const observer = this.apolloClient.subscribe({
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
          this.listPaymentInvoicesRefetch()
        }
        if (operation === 'invoice.payment_failed') {
          // this.$notify({ color: 'error', text: 'Payment failed.' })
          this.listPaymentInvoicesRefetch()
        }
        // update profile
        this.getProfileRefetch()
      },
    })
  },
  methods: {
    openInvoice (invoice) {
      this.$router.push({ name: 'payment', params: { type: 'invoice' }, query: { invoiceId: invoice.id, invoiceNo: invoice.number, amount: (invoice.amount_due / 100).toFixed(2) } })
    },
    showSuccess (name) {
      this.successProductName = name
      this.successDialog = true
    },
    goToPayment (item) {
      this.selectedProduct = item
      this.$router.push({ name: 'payment', params: { type: 'change' }, query: { product: item.id } })
    },
    addPaymentMethodComplete () {
      this.addPaymentMethodDialog = false
      this.listPaymentMethodsRefetch()
    },
    async cancelSubscription () {
      try {
        this.cancelSubscriptionLoading = true
        await this.apolloClient.mutate({
          mutation: CANCEL_PAYMENT_SUBSCRIPTION,
          fetchPolicy: 'no-cache',
        })
        this.cancelSubscriptionLoading = false
        this.cancelSubscriptionDialog = false
        // update profile
        this.getProfileRefetch()
      } catch (error) {
        this.$notify({ color: 'error', text: error.message })
      }
    },
    async setDefaultPaymentMethod (paymentMethodId) {
      try {
        this.setDefaultPaymentMethodLoading = paymentMethodId
        await this.apolloClient.mutate({
          mutation: SET_DEFAULT_PAYMENT_METHOD,
          variables: {
            paymentMethodId,
          },
          fetchPolicy: 'no-cache',
        })
        // update query
        this.listPaymentMethodsRefetch()
      } catch (error) {
        this.$notify({ color: 'error', text: error.message })
      } finally {
        this.setDefaultPaymentMethodLoading = null
      }
    },
    async detachPaymentMethod (paymentMethodId) {
      try {
        this.detachPaymentMethodLoading = paymentMethodId
        await this.apolloClient.mutate({
          mutation: DETACH_PAYMENT_METHOD,
          variables: {
            paymentMethodId,
          },
          fetchPolicy: 'no-cache',
        })
        // update query
        this.listPaymentMethodsRefetch()
      } catch (error) {
        this.$notify({ color: 'error', text: error.message })
      } finally {
        this.detachPaymentMethodLoading = null
      }
    },
    async getRates () {
      try {
        const response = await axios.get('https://api.exchangeratesapi.io/latest?base=USD&symbols=USD,CNY,HKD,RUB,EUR,GBP')
        if (response.data && response.data.success) {
          this.currencyRates = response.data.rates
        }
      } catch (error) {
        this.$logget.info('Error on get currency rates', error)
      }
    },
  },
}
</script>
