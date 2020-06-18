<template>
  <div class="flex-grow flex flex-col">
    <!-- / HEADER -->
    <Header light />
    <!-- HEADER / -->
    <!-- / MAIN -->
    <v-dialog
      v-model="oneUsdDialog"
      max-width="746"
    >
      <PaymentCard
        :default-payment-method-id="defaultPm && defaultPm.id"
        :currency-rates="currencyRates"
        one-usd
        @complete="oneUsdComplete"
      />
    </v-dialog>
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
    <main class="container container--sm flex-grow max-w-screen-md mx-auto py-16">
      <h1
        class="text-40 font-bold mb-6"
      >
        {{ $t('payment.title') }}
      </h1>
      <!-- PROFILE -->
      <div class="flex flex-col sm:flex-row items-center justify-between bg-white rounded-lg py-4 px-6 max-w-screen-md">
        <div class="flex-1 flex items-center">
          <div class="w-16 h-16 rounded-full overflow-hidden">
            <img v-if="profile.picture" :src="profile.picture" alt="Avatar">
          </div>
          <div>
            <div class="text-lg">{{ `${profile.givenName} ${profile.familyName}` }}</div>
            <div class="text-gray-100">{{ profile.email }}</div>
          </div>
        </div>
        <div class="flex-1 w-full max-w-xs border-t sm:border-t-0 sm:border-l border-gray-75 pt-4 mt-4 sm:mt-0 sm:pt-0 sm:ml-6 sm:pl-6">
          <div class="flex justify-between">
            <div class="">
              <div class="h-6 mb-xs text-lg">{{ productName }}</div>
              <!-- CHANGE PLAN DIALOG -->
              <div v-if="(canChange || canSelect) && !isCanceled">
                <v-dialog
                  v-model="changeDialog"
                  max-width="458"
                  eager
                >
                  <template v-slot:activator="{ on }">
                    <button
                      class="select-none focus:outline-none text-blue-500 focus:text-blue-600 hover:text-blue-600"
                      v-on="on"
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
                    @select="selectTariff"
                  />
                </v-dialog>
                <v-dialog
                  v-model="changePaymentDialog"
                  max-width="746"
                  content-class="payment-dialog"
                >
                  <PaymentCard
                    :default-payment-method-id="defaultPm && defaultPm.id"
                    :selected-product="selectedProduct"
                    :latest-invoice-id="hasIncompliteSubscription ? profile.account.latestInvoiceId : undefined"
                    :change-price="canChange"
                    :visibility="changePaymentDialog"
                    :current-product-id="profile.account && profile.account.productId"
                    :current-price-id="profile.account && profile.account.priceId"
                    @complete="changeComplete"
                    @back="toTariffList"
                  />
                </v-dialog>
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
      <div v-if="canChange && canCancel" class="text-right max-w-screen-md py-2 px-3">
        <v-dialog
          v-model="cancelSubscriptionDialog"
          max-width="458"
          content-class="relative text-gray-200 bg-gray-50 p-8 pt-6"
        >
          <template v-slot:activator="{ on }">
            <button
              class="select-none focus:outline-none text-pink-500 focus:text-pink-600 hover:text-pink-600"
              v-on="on"
            >
              {{ $t('payment.cancelSubscription') }}
            </button>
          </template>
          <span class="absolute w-10 text-right top-0 right-0 pt-3 pr-3">
            <i
              class="zi-close text-2xl hover:text-gray-300 cursor-pointer"
              @click="cancelSubscriptionDialog = false"
            />
          </span>
          <div>
            <div class="font-semibold text-lg pb-sm">
              {{ $t('payment.cancelTitle') }}
            </div>
            <div class="py-10">
              {{ $t('payment.cancelText') }}
            </div>
            <div class="flex flex-wrap sm:flex-no-wrap sm:justify-between">
              <Button
                :loading="cancelSubscriptionLoading"
                block
                class="mb-3 sm:mb-0 sm:mr-3"
                merge-class="bg-pink-500 hover:bg-pink-600 focus:bg-pink-600"
                @click="cancelSubscription"
              >
              {{ $t('payment.cancelSubscription') }}
              </Button>
              <Button
                block
                outlined
                class="sm:ml-3"
                merge-class="border-gray-100"
                @click="cancelSubscriptionDialog = false"
              >
                {{ $t('payment.notCancel') }}
              </Button>
            </div>
          </div>
        </v-dialog>
      </div>
      <!-- ONE USD -->
      <div
        v-if="profile.account && profile.account.canTrial"
        class="flex flex-col sm:flex-row items-center justify-between bg-white rounded-md p-4 mt-12"
      >
        <div class="text-lg text-black leading-snug pl-2 pb-4 sm:pb-0">
          <span v-html="$t('payment.oneUSD')" class="mr-1" />
        </div>
        <Button
          class="ml-4"
          @click="oneUsdDialog = true"
        >
          {{ $t('payment.extend') }}
        </Button>
      </div>
      <!-- PAYMENT METHODS LIST -->
      <div v-if="paymentMethods.length > 0 || defaultPm">
        <div class="border-b border-gray-75 mt-16 mb-16" />
        <h3 class="text-2xl pb-6">
          {{ $t('payment.paymentMethod') }}
        </h3>
        <template v-if="defaultPm">
          <h4 class="text-gray-200 mb-3">
            {{ $t('payment.defaultCard') }}
          </h4>
          <div class="max-w-screen-md overflow-x-auto overflow-scroll-touch pb-10">
            <table class="w-full border-separate text-gray-200" style="border-spacing: 0 4px">
              <tbody>
                <tr
                  class="h-12 bg-white hover:bg-transparent group"
                >
                  <td width="52" class="rounded-l-md text-gray-100 px-4">
                    <div class="align-middle">
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
          <div class="max-w-screen-md overflow-x-auto overflow-scroll-touch pb-10">
            <table class="w-full border-separate text-gray-200" style="border-spacing: 0 4px">
              <tbody>
                <tr
                  v-for="item in paymentMethods"
                  :key="item.id"
                  class="h-12 bg-white hover:bg-transparent group"
                >
                  <td width="52" class="rounded-l-md text-gray-100 px-4">
                    <v-progress-circular
                      v-if="setDefaultPaymentMethodLoading === item.id"
                      indeterminate
                      size="20"
                      width="2"
                    />
                    <button
                      v-else
                      class="align-middle invisible group-hover:visible focus:outline-none focus:text-blue-500"
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
                    <v-progress-circular
                      v-if="detachPaymentMethodLoading === item.id"
                      indeterminate
                      size="20"
                      width="2"
                    />
                    <button
                      v-else
                      class="text-2xl align-middle invisible group-hover:visible focus:outline-none focus:text-blue-500"
                      @click="detachPaymentMethod(item.id)"
                    >
                      <i class="zi-delete align-middle" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
        <div class="text-right">
          <v-dialog
            v-model="addPaymentMethodDialog"
            max-width="746"
          >
            <template v-slot:activator="{ on }">
              <Button
                v-on="on"
              >
                {{ $t('payment.addCard') }}
              </Button>
            </template>
            <PaymentCard
              add-payment-method
              @complete="addPaymentMethodComplete"
            />
          </v-dialog>
        </div>
      </div>
      <!-- PAYMENT INVOICES LIST -->
      <div v-if="paymentInvoices.length > 0" class="pb-10">
        <div class="border-b border-gray-75 mt-16 mb-16" />
        <h3 class="text-2xl pb-6">
          {{ $t('payment.invoices') }}
        </h3>
        <div class="max-w-screen-md overflow-x-auto overflow-scroll-touch rounded-md px-sm pb-2" style="background-color: #f0f0f0">
          <table class="w-full table-fixed border-separate text-gray-200" style="border-spacing: 0 4px">
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
                class="h-12 bg-gray-50 hover:bg-white group"
              >
                <td class="rounded-l-md px-4">{{ item.number }}</td>
                <td class="whitespace-no-wrap pl-4 pr-2">
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
                    class="text-blue-500 focus:outline-none focus:text-blue-600 hover:text-blue-600"
                    @click="openInvoice(item)"
                  >
                    {{ $t('payment.invoicePay') }}
                  </button>
                </td>
                <td class="rounded-r-md px-4">
                  <a :href="item.invoice_pdf" target="_brank" class="focus:outline-none text-gray-200 hover:text-blue-500 focus:text-blue-500">
                    <i class="zi-download text-2xl align-middle" />
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <v-dialog
        v-model="retryInvoiceDialog"
        max-width="746"
      >
        <PaymentCard
          :latest-invoice-id="retryInvoice && retryInvoice.id"
          :default-payment-method-id="defaultPm && defaultPm.id"
          @complete="retryInvoiceComplete"
        />
      </v-dialog>
    </main>
    <!-- MAIN / -->
    <Footer />
  </div>
</template>

<script>
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import PaymentCard from '../components/PaymentCard.vue'
import PriceSelect from '../components/PriceSelect.vue'

import { GET_PROFILE, LIST_PAYMENT_METHODS, LIST_PAYMENT_INVOICES } from '../graphql/queries'
import { CANCEL_PAYMENT_SUBSCRIPTION, SET_DEFAULT_PAYMENT_METHOD, DETACH_PAYMENT_METHOD } from '../graphql/mutations'
import { PAYMENT_DATA } from '../graphql/subscriptions'

export default {
  name: 'Payment',
  components: {
    Header,
    Footer,
    PaymentCard,
    PriceSelect,
  },
  metaInfo: {
    style: [
      { cssText: 'body { background-color: #F7F7F7!important }', type: 'text/css' },
    ],
    meta: [
      { hid: 'title', name: 'title', content: 'Сервис для международной оптовой торговли с удаленным управлением | ZENNNN' },
      { hid: 'description', name: 'description', content: 'Представляем вам революционной сервис международной оптовой торговли с возможностью удаленного контроля и управления закупками. Вся операционная деятельность компании в одной системе.' },
      { vmid: 'og:title', property: 'og:title', content: 'Сервис для международной оптовой торговли с удаленным управлением | ZENNNN' },
      { vmid: 'og:description', property: 'og:description', content: 'Представляем вам революционной сервис международной оптовой торговли с возможностью удаленного контроля и управления закупками. Вся операционная деятельность компании в одной системе.' },
      { vmid: 'og:site_name', property: 'og:site_name', content: 'ZENNNN' },
      { vmid: 'og:url', property: 'og:url', content: `${process.env.VUE_APP_HOSTNAME}${window.location.pathname}` },
      { vmid: 'og:image', property: 'og:image', content: `${process.env.VUE_APP_IMAGE_DOWNLOAD_HOSTNAME}/ses/zennnn_logo_light_2x.png` },
    ],
  },
  apollo: {
    getProfile: {
      query: GET_PROFILE,
      fetchPolicy: 'cache-only',
    },
    listPaymentMethods: {
      query: LIST_PAYMENT_METHODS,
      fetchPolicy: 'no-cache',
    },
    listPaymentInvoices: {
      query: LIST_PAYMENT_INVOICES,
      fetchPolicy: 'no-cache',
    },
  },
  data () {
    return {
      retryInvoiceDialog: false,
      retryInvoice: null,
      successDialog: false,
      successProductName: '',
      currencyRates: {},
      changeDialog: false,
      oneUsdDialog: false,
      setDefaultPaymentMethodLoading: null,
      detachPaymentMethodLoading: null,
      addPaymentMethodDialog: false,
      cancelSubscriptionDialog: false,
      cancelSubscriptionLoading: false,
      changePaymentDialog: false,
      selectedProduct: null,
    }
  },
  computed: {
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
    hasIncompliteSubscription () {
      return this.profile.account &&
        (this.profile.account.subscriptionStatus === 'incomplete' || this.profile.account.subscriptionStatus === 'past_due')
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
  },
  watch: {
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
          this.successDialog = true
          this.$apollo.queries.listPaymentInvoices.refetch()
        }
        if (operation === 'invoice.payment_failed') {
          // this.$notify({ color: 'error', text: 'Payment failed.' })
          this.$apollo.queries.listPaymentInvoices.refetch()
        }
        // update profile
        this.$apollo.query({
          query: GET_PROFILE,
          fetchPolicy: 'network-only',
        })
      },
    })
  },
  methods: {
    openInvoice (invoice) {
      this.retryInvoice = invoice
      this.retryInvoiceDialog = true
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
    showSuccess (name) {
      this.successProductName = name
      this.successDialog = true
    },
    selectTariff (item) {
      this.selectedProduct = item
      this.changeDialog = false
      this.$nextTick(() => {
        this.changePaymentDialog = true
      })
    },
    toTariffList () {
      setTimeout(() => {
        this.selectedProduct = null
      }, 250)
      this.changePaymentDialog = false
      this.$nextTick(() => {
        this.changeDialog = true
      })
    },
    oneUsdComplete () {
      this.oneUsdDialog = false
      this.$apollo.queries.listPaymentMethods.refetch()
      this.$apollo.queries.listPaymentInvoices.refetch()
    },
    changeComplete () {
      this.changeDialog = false
      this.changePaymentDialog = false
      this.$apollo.queries.listPaymentMethods.refetch()
      this.$apollo.queries.listPaymentInvoices.refetch()
    },
    addPaymentMethodComplete () {
      this.addPaymentMethodDialog = false
      this.$apollo.queries.listPaymentMethods.refetch()
    },
    retryInvoiceComplete () {
      this.retryInvoiceDialog = false
      this.$apollo.queries.listPaymentMethods.refetch()
      this.$apollo.queries.listPaymentInvoices.refetch()
    },
    async cancelSubscription () {
      try {
        this.cancelSubscriptionLoading = true
        await this.$apollo.mutate({
          mutation: CANCEL_PAYMENT_SUBSCRIPTION,
          fetchPolicy: 'no-cache',
        })
        // update profile
        this.$apollo.query({
          query: GET_PROFILE,
          fetchPolicy: 'network-only',
        })
        this.cancelSubscriptionLoading = false
        this.cancelSubscriptionDialog = false
        // update profile
        this.$apollo.query({
          query: GET_PROFILE,
          fetchPolicy: 'network-only',
        })
      } catch (error) {
        this.$notify({ color: 'error', text: error.message })
      }
    },
    async setDefaultPaymentMethod (paymentMethodId) {
      try {
        this.setDefaultPaymentMethodLoading = paymentMethodId
        await this.$apollo.mutate({
          mutation: SET_DEFAULT_PAYMENT_METHOD,
          variables: {
            paymentMethodId,
          },
          fetchPolicy: 'no-cache',
        })
        // update query
        this.$apollo.queries.listPaymentMethods.refetch()
      } catch (error) {
        this.$notify({ color: 'error', text: error.message })
      } finally {
        this.setDefaultPaymentMethodLoading = null
      }
    },
    async detachPaymentMethod (paymentMethodId) {
      try {
        this.detachPaymentMethodLoading = paymentMethodId
        await this.$apollo.mutate({
          mutation: DETACH_PAYMENT_METHOD,
          variables: {
            paymentMethodId,
          },
          fetchPolicy: 'no-cache',
        })
        // update query
        this.$apollo.queries.listPaymentMethods.refetch()
      } catch (error) {
        this.$notify({ color: 'error', text: error.message })
      } finally {
        this.detachPaymentMethodLoading = null
      }
    },
  },
}
</script>
