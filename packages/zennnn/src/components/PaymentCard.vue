<template>
  <!-- CARD INPUT AND PAYMENT INFO -->
  <div ref="container" class="max-w-screen-md mx-auto">
    <div
      v-if="defaultPaymentMethodId && !isNewPaymentMethod"
      class="text-gray-200 pb-6"
    >
      <h3 class="text-black text-2xl pb-6">
        {{ $t('payment.selectPaymentMethod') }}:
      </h3>
      <Radio
        v-model="paymentMethod"
        value="DEFAULT"
        label="DEFAULT"
        hide-details
        class="pb-4"
      >
        <span class="ml-3">{{ $t('payment.defaultCard') }}</span>
      </Radio>
      <Radio
        v-model="paymentMethod"
        value="NEW"
        label="NEW"
        hide-details
        class="pb-4"
      >
        <span class="ml-3">{{ $t('payment.addCard') }}</span>
      </Radio>
      <div
        v-if="paymentMethod === 'DEFAULT'"
        role="alert"
        :class="[cardElementError ? 'opacity-100' : 'opacity-0']"
        style="min-height: 20px"
        class="
          opacity-0
          text-red-500
          leading-tight
          transition-opacity
          duration-100
          ease-in
          px-1
        "
      >
        {{ cardElementError }}
      </div>
    </div>
    <ExpandTransition>
      <div v-show="paymentMethod === 'NEW' || !defaultPaymentMethodId">
        <div class="text-black">
          <h3 class="flex items-center justify-between text-2xl pb-4">
            <div>{{ $t('payment.creditCardData') }}:</div>
            <div class="flex-shrink">
              <a
                href="https://stripe.com/"
                rel="noreferrer noopener"
                target="_blank"
                tabindex="-1"
              >
                <svg
                  width="92"
                  height="21"
                  viewBox="0 0 92 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    opacity="0.349"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M87.385 20.5H5.0773C2.52807 20.5 0.461914 18.4338 0.461914 15.8846V5.11538C0.461914 2.56615 2.52807 0.5 5.0773 0.5H87.385C89.9342 0.5 92.0004 2.56615 92.0004 5.11538V15.8846C92.0004 18.4338 89.9342 20.5 87.385 20.5ZM91.2311 5.11538C91.2311 2.99154 89.5088 1.26923 87.385 1.26923H5.0773C2.95345 1.26923 1.23114 2.99154 1.23114 5.11538V15.8846C1.23114 18.0085 2.95345 19.7308 5.0773 19.7308H87.385C89.5088 19.7308 91.2311 18.0085 91.2311 15.8846V5.11538Z"
                    fill="#424770"
                  />
                  <path
                    opacity="0.502"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M47.1544 14.6823H46.1506L46.9275 12.7638L45.3813 8.86231H46.4421L47.4136 11.5177L48.3929 8.86231H49.4536L47.1544 14.6823ZM43.3006 13.0069C42.9529 13.0069 42.5959 12.8777 42.2729 12.6262V12.91H41.2367V7.08923H42.2729V9.13769C42.5959 8.89461 42.9529 8.76538 43.3006 8.76538C44.3852 8.76538 45.1298 9.63923 45.1298 10.8862C45.1298 12.1323 44.3852 13.0069 43.3006 13.0069ZM43.0821 9.65538C42.799 9.65538 42.5152 9.77692 42.2729 10.02V11.7523C42.5152 11.9946 42.799 12.1162 43.0821 12.1162C43.6652 12.1162 44.0698 11.6146 44.0698 10.8862C44.0698 10.1577 43.6652 9.65538 43.0821 9.65538ZM37.0421 12.6262C36.7267 12.8777 36.3706 13.0069 36.0144 13.0069C34.9375 13.0069 34.1852 12.1323 34.1852 10.8862C34.1852 9.63923 34.9375 8.76538 36.0144 8.76538C36.3706 8.76538 36.7267 8.89461 37.0421 9.13769V7.08923H38.0867V12.91H37.0421V12.6262ZM37.0421 10.02C36.8075 9.77692 36.5244 9.65538 36.2413 9.65538C35.6498 9.65538 35.2452 10.1577 35.2452 10.8862C35.2452 11.6146 35.6498 12.1162 36.2413 12.1162C36.5244 12.1162 36.8075 11.9946 37.0421 11.7523V10.02ZM30.8736 11.1692C30.9383 11.7846 31.4244 12.2054 32.1036 12.2054C32.4767 12.2054 32.889 12.0677 33.3098 11.8246V12.6915C32.849 12.9015 32.3875 13.0069 31.9336 13.0069C30.7113 13.0069 29.8536 12.1162 29.8536 10.8538C29.8536 9.63154 30.6952 8.76538 31.8529 8.76538C32.9136 8.76538 33.6336 9.59923 33.6336 10.7885C33.6336 10.9023 33.6336 11.0315 33.6175 11.1692H30.8736ZM31.8129 9.56615C31.3106 9.56615 30.9221 9.93923 30.8736 10.4977H32.6383C32.6059 9.94692 32.2744 9.56615 31.8129 9.56615ZM28.1452 10.2062V12.91H27.109V8.86231H28.1452V9.26692C28.4367 8.94308 28.7929 8.76538 29.1406 8.76538C29.2544 8.76538 29.3675 8.77308 29.4806 8.80538V9.72846C29.3675 9.69615 29.2383 9.68 29.1167 9.68C28.7767 9.68 28.4121 9.86615 28.1452 10.2062ZM23.5229 11.1692C23.5875 11.7846 24.0729 12.2054 24.7529 12.2054C25.1252 12.2054 25.5383 12.0677 25.959 11.8246V12.6915C25.4975 12.9015 25.0359 13.0069 24.5829 13.0069C23.3606 13.0069 22.5029 12.1162 22.5029 10.8538C22.5029 9.63154 23.3444 8.76538 24.5021 8.76538C25.5621 8.76538 26.2829 9.59923 26.2829 10.7885C26.2829 10.9023 26.2829 11.0315 26.2667 11.1692H23.5229ZM24.4613 9.56615C23.9598 9.56615 23.5713 9.93923 23.5229 10.4977H25.2875C25.2552 9.94692 24.9229 9.56615 24.4613 9.56615ZM19.9036 12.91L19.0775 10.1577L18.2598 12.91H17.329L15.9367 8.86231H16.9729L17.7906 11.6146L18.6083 8.86231H19.5467L20.3644 11.6146L21.1821 8.86231H22.2183L20.8344 12.91H19.9036ZM13.5721 13.0069C12.3498 13.0069 11.4836 12.1246 11.4836 10.8862C11.4836 9.63923 12.3498 8.76538 13.5721 8.76538C14.7944 8.76538 15.6529 9.63923 15.6529 10.8862C15.6529 12.1246 14.7944 13.0069 13.5721 13.0069ZM13.5721 9.63154C12.9652 9.63154 12.5444 10.1415 12.5444 10.8862C12.5444 11.6308 12.9652 12.1408 13.5721 12.1408C14.1713 12.1408 14.5921 11.6308 14.5921 10.8862C14.5921 10.1415 14.1713 9.63154 13.5721 9.63154ZM9.0221 10.91H8.09133V12.91H7.05518V7.34H9.0221C10.1559 7.34 10.9652 8.07692 10.9652 9.12923C10.9652 10.1815 10.1559 10.91 9.0221 10.91ZM8.87671 8.18231H8.09133V10.0685H8.87671C9.47594 10.0685 9.89671 9.68769 9.89671 9.12923C9.89671 8.56308 9.47594 8.18231 8.87671 8.18231ZM85.9359 11.3085H81.6598C81.7575 12.3323 82.5075 12.6338 83.359 12.6338C84.2259 12.6338 84.909 12.4508 85.5044 12.1508V13.91C84.9113 14.2392 84.1275 14.4762 83.0836 14.4762C80.9559 14.4762 79.4652 13.1438 79.4652 10.51C79.4652 8.28538 80.7298 6.51923 82.8075 6.51923C84.8821 6.51923 85.9652 8.28461 85.9652 10.5215C85.9652 10.7331 85.9459 11.1908 85.9359 11.3085ZM82.7936 8.3C82.2475 8.3 81.6406 8.71231 81.6406 9.69615H83.899C83.899 8.71308 83.3298 8.3 82.7936 8.3ZM75.9298 14.4762C75.1652 14.4762 74.6982 14.1538 74.3844 13.9238L74.3798 16.3954L72.1959 16.86L72.1952 6.66461H74.1182L74.2321 7.20385C74.5336 6.92231 75.0867 6.51923 75.9429 6.51923C77.4767 6.51923 78.9213 7.90077 78.9213 10.4438C78.9213 13.2192 77.4921 14.4762 75.9298 14.4762ZM75.4206 8.45385C74.9198 8.45385 74.6052 8.63692 74.3775 8.88692L74.3906 12.1323C74.6029 12.3623 74.9082 12.5469 75.4206 12.5469C76.2282 12.5469 76.7698 11.6677 76.7698 10.4915C76.7698 9.34923 76.2198 8.45385 75.4206 8.45385ZM69.0382 6.66461H71.2306V14.32H69.0382V6.66461ZM69.0382 4.22L71.2306 3.75385V5.53308L69.0382 5.99923V4.22ZM66.7006 9.13V14.32H64.5175V6.66461H66.4059L66.5429 7.31C67.0544 6.37 68.0752 6.56077 68.3659 6.66538V8.67308C68.0882 8.58308 67.2167 8.45231 66.7006 9.13ZM62.019 11.6346C62.019 12.9215 63.3975 12.5208 63.6767 12.4092V14.1869C63.3859 14.3469 62.8582 14.4762 62.1444 14.4762C60.8482 14.4762 59.8752 13.5215 59.8752 12.2285L59.8852 5.22154L62.0175 4.76769L62.019 6.66461H63.6775V8.52692H62.019V11.6346ZM59.2967 12.0069C59.2967 13.5792 58.0452 14.4762 56.229 14.4762C55.4759 14.4762 54.6529 14.33 53.8406 13.9808V11.8954C54.5736 12.2938 55.5075 12.5931 56.2313 12.5931C56.7183 12.5931 57.069 12.4623 57.069 12.0585C57.069 11.0162 53.749 11.4085 53.749 8.99077C53.749 7.44461 54.9298 6.51923 56.7013 6.51923C57.4252 6.51923 58.1483 6.63 58.8721 6.91846V8.97615C58.2075 8.61692 57.3636 8.41385 56.6998 8.41385C56.2421 8.41385 55.9575 8.54615 55.9575 8.88692C55.9575 9.87 59.2967 9.40231 59.2967 12.0069Z"
                    fill="#424770"
                  />
                </svg>
              </a>
            </div>
          </h3>
          <form @submit.prevent.stop>
            <div
              :id="cardInputId"
              :class="[
                isCardElementFocused
                  ? 'shadow-blue-500'
                  : 'shadow-light-gray-400',
              ]"
              class="
                h-12
                bg-white
                rounded
                transition-colors
                duration-150
                ease-in-out
                px-4
                py-3
                mb-1
              "
            />
            <div
              role="alert"
              :class="[cardElementError ? 'opacity-100' : 'opacity-0']"
              style="min-height: 20px"
              class="
                opacity-0
                text-red-500
                leading-tight
                transition-opacity
                duration-100
                ease-in
                px-1
              "
            >
              {{ cardElementError }}
            </div>
          </form>
        </div>
        <template v-if="billingAddress">
          <div class="border-b border-light-gray-400 mt-10 mb-16" />
          <div class="text-black">
            <h3 class="text-2xl pb-6">{{ $t('payment.paymentInfo') }}:</h3>
            <Form
              ref="form"
              lazy-validation
              class="flex flex-wrap"
              @submit="onCardFormSubmit"
            >
              <div class="w-full sm:w-1/2 sm:pr-3 pb-6">
                <Select
                  v-model="country"
                  v-model:search="countriesSearch"
                  :items="countries"
                  :label="$t('payment.countryLabel')"
                  :placeholder="$t('payment.countryPlaceholder')"
                  :rules="[rules.required]"
                  validate-on-blur
                  searchable
                  item-value="value"
                  item-text="text"
                  content-class="bg-white shadow-light-gray-400"
                  input-class="placeholder-gray-100 text-gray-900"
                  label-class="text-black"
                />
              </div>
              <div class="w-full sm:w-1/2 sm:pl-3 pb-6">
                <TextField
                  v-model="city"
                  :label="$t('payment.cityLabel')"
                  :placeholder="$t('payment.cityPlaceholder')"
                  :rules="[rules.required]"
                  validate-on-blur
                  content-class="bg-white shadow-light-gray-400"
                  input-class="placeholder-gray-100 text-gray-900"
                  label-class="text-black"
                />
              </div>
              <div class="w-full sm:w-1/2 sm:pr-3 pb-6">
                <TextField
                  v-model="street"
                  :label="$t('payment.streetLabel')"
                  :placeholder="$t('payment.streetPlaceholder')"
                  :rules="[rules.required]"
                  validate-on-blur
                  content-class="bg-white shadow-light-gray-400"
                  input-class="placeholder-gray-100 text-gray-900"
                  label-class="text-black"
                />
              </div>
              <div class="w-full sm:w-1/2 sm:pl-3 pb-6">
                <TextField
                  v-model="postcode"
                  :label="$t('payment.postcodeLabel')"
                  :placeholder="$t('payment.postcodePlaceholder')"
                  :rules="[rules.required]"
                  validate-on-blur
                  content-class="bg-white shadow-light-gray-400"
                  input-class="placeholder-gray-100 text-gray-900"
                  label-class="text-black"
                />
              </div>
            </Form>
          </div>
        </template>
      </div>
    </ExpandTransition>
    <div
      class="flex bg-light-gray-100 border-t border-light-gray-400 mt-10 py-10"
    >
      <Checkbox
        v-if="isNewPaymentMethod"
        v-model="attachPaymentMethodSetDefault"
        hide-details
        class="flex items-center"
      >
        <span class="ml-3">
          {{ $t('payment.setAsDefault') }}
        </span>
      </Checkbox>
      <Btn v-else outlined class="border-gray-100" @click="$emit('back')">
        {{ isNewPaymentMethod ? $t('action.cancel') : $t('payment.back') }}
      </Btn>
      <div class="flex-grow" />
      <Btn :loading="loading" @click="onCardFormSubmit">
        {{ isNewPaymentMethod ? $t('payment.add') : $t('payment.buy') }}
      </Btn>
    </div>
  </div>
</template>

<script>
import { useApolloClient } from '@vue/apollo-composable'

import {
  RETRY_INVOICE_WITH_NEW_PAYMENT_METHOD,
  UPDATE_PAYMENT_SUBSCRIPTION,
  CREATE_PROMO_SUBSCRIPTION,
  ATTACH_PAYMENT_METHOD,
  SET_BILLING_ADDRESS,
} from '../graphql/mutations'

import Countries from '../config/countries-iso3.json'

import {
  Btn,
  Form,
  Radio,
  Checkbox,
  Select,
  TextField,
  ExpandTransition,
} from '@zennnn/core'

export default {
  name: 'PaymentCard',
  components: {
    Btn,
    Form,
    Radio,
    Checkbox,
    Select,
    TextField,
    ExpandTransition,
  },
  props: {
    // TODO: validate, can be "change", "invoice", "promo", "newPaymentMethod"
    paymentType: {
      type: String,
      required: true,
    },
    defaultPaymentMethodId: String,
    invoiceId: String,
    selectedPriceId: String,
    billingAddress: Boolean,
  },
  setup() {
    const { resolveClient } = useApolloClient()

    return {
      resolveClient,
    }
  },
  data() {
    return {
      cardInputId: 'payment-card-' + Math.round(Math.random() * 100000),
      loading: false,
      isCardElementFocused: false,
      cardElementError: '',
      cardElementComplete: false,
      country: '',
      city: '',
      street: '',
      postcode: '',
      countriesSearch: '',
      rules: {
        required: (v) => !!v || this.$t('rule.required'),
      },
      attachPaymentMethodSetDefault: false,
      paymentMethod: 'DEFAULT',
    }
  },
  computed: {
    isPromo() {
      return this.paymentType === 'promo'
    },
    isNewPaymentMethod() {
      return this.paymentType === 'newPaymentMethod'
    },
    isInvoice() {
      return this.paymentType === 'invoice'
    },
    isChange() {
      return this.paymentType === 'change'
    },
    countries() {
      return Object.entries(Countries).map(([k, v]) => {
        const name = this.$te(`countries.${k}`, 'en')
          ? this.$t(`countries.${k}`, 'en')
          : v
        return {
          text: this.$te(`countries.${k}`) ? this.$t(`countries.${k}`) : name,
          value: k,
          name,
        }
      })
    },
  },
  mounted() {
    this.createStripeScript()
  },
  methods: {
    createStripeScript() {
      // load the Stripe SDK
      if (window.Stripe) {
        this.initStripe()
      } else {
        const script = document.createElement('script')
        script.src = 'https://js.stripe.com/v3/'
        script.async = true
        script.onload = this.initStripe
        document.body.appendChild(script)
      }
    },
    initStripe() {
      const locale =
        this.$i18n.locale === 'zh-Hans' || this.$i18n.locale === 'zh-Hant'
          ? 'zh'
          : this.$i18n.locale
      this.stripe = window.Stripe(process.env.VUE_APP_STRIPE_PUBLISHABLE_KEY)
      this.elements = this.stripe.elements({ locale })
      const style = {
        base: {
          color: '#1E1E1E',
          fontFamily: 'MyriadPro, sans-serif',
          fontSize: '16px',
          '::placeholder': {
            color: '#AAAAAA',
          },
        },
        invalid: {
          color: '#FF212D',
          iconColor: '#FF212D',
        },
      }
      this.cardElement = this.elements.create('card', {
        style,
        hidePostalCode: true,
      })
      this.cardElement.mount(`#${this.cardInputId}`)
      this.cardElement.on('change', this.showCardError)
      this.cardElement.on('focus', () => {
        this.isCardElementFocused = true
      })
      this.cardElement.on('blur', () => {
        this.isCardElementFocused = false
      })
    },
    reset() {
      this.attachPaymentMethodSetDefault = false
      this.cardElementError = ''
      this.country = ''
      this.city = ''
      this.street = ''
      this.postcode = ''
      this.countriesSearch = ''
      this.cardElement.clear()
      this.billingAddress && this.$refs.form && this.$refs.form.reset()
    },
    showCardError(event) {
      if (event) {
        this.cardElementComplete = event.complete
        const message =
          event.error && event.error.message
            ? event.error.message
            : event.error || event
        this.$logger.warn(message)
      }
      this.cardElementError = event.error ? event.error.message : ''
    },
    onCardFormSubmit(e) {
      e.preventDefault()
      if (
        this.paymentMethod === 'DEFAULT' &&
        this.defaultPaymentMethodId &&
        !this.isNewPaymentMethod
      ) {
        if (this.isInvoice) {
          this.retryInvoiceWithNewPaymentMethod({
            paymentMethodId: this.defaultPaymentMethodId,
            invoiceId: this.invoiceId,
          })
        } else {
          this.createSubscription({
            paymentMethodId: this.defaultPaymentMethodId,
            priceId: this.selectedPriceId,
          })
        }
        this.cardElementError = ''
      } else {
        const billingValid = this.billingAddress
          ? this.$refs.form.validate(true)
          : true
        if (this.cardElementComplete && billingValid) {
          this.createPaymentMethod(this.cardElement, this.selectedPriceId)
          this.cardElementError = ''
        } else {
          if (!this.cardElementComplete) {
            this.cardElement.focus()
          } else {
            this.$el.scrollIntoView(false)
          }
        }
      }
    },
    async createPaymentMethod(cardElement, priceId) {
      const client = this.resolveClient()
      this.loading = true
      const props = {
        type: 'card',
        card: cardElement,
      }
      const address = []
      if (this.city) address.push(['city', this.city])
      if (this.country) address.push(['country', this.country])
      if (this.street) address.push(['line1', this.street])
      if (this.postcode) address.push(['postal_code', this.postcode])
      if (address.length > 0) {
        const billingDetails = { address: {} }
        address.forEach(([key, value]) => {
          billingDetails.address[key] = value
        })
        props.billing_details = billingDetails
      }
      const result = await this.stripe.createPaymentMethod(props)
      if (result.error) {
        this.showCardError(result)
        this.loading = false
      } else {
        if (this.billingAddress) {
          const { data: setBillingAddress } = await client.mutate({
            mutation: SET_BILLING_ADDRESS,
            variables: {
              country: this.country,
              city: this.city,
              street: this.street,
              postcode: this.postcode,
            },
          })
          if (setBillingAddress.error) {
            this.$logger.info(
              'SetBillingAddress error: ',
              setBillingAddress.error.message
            )
          }
        }
        if (this.isNewPaymentMethod) {
          this.attachPaymentMethod(result.paymentMethod.id)
        } else if (this.invoiceId) {
          this.retryInvoiceWithNewPaymentMethod({
            paymentMethodId: result.paymentMethod.id,
            invoiceId: this.invoiceId,
          })
        } else {
          this.createSubscription({
            paymentMethodId: result.paymentMethod.id,
            priceId,
          })
        }
      }
    },
    async retryInvoiceWithNewPaymentMethod({ paymentMethodId, invoiceId }) {
      try {
        const client = this.resolveClient()
        this.loading = true
        const { data } = await client.mutate({
          mutation: RETRY_INVOICE_WITH_NEW_PAYMENT_METHOD,
          variables: {
            paymentMethodId,
            invoiceId,
          },
          fetchPolicy: 'no-cache',
        })
        const response = data.retryInvoiceWithNewPaymentMethod
        if (response.error) {
          // The card had an error when trying to attach it to a customer.
          throw response
        }
        // Normalize the response to contain the object returned by Stripe.
        // Add the addional details we need.
        const result = {
          paymentMethodId,
          invoice: response,
          isRetry: true,
          priceId: this.selectedPriceId,
        }
        // Some payment methods require a customer to be on session
        // to complete the payment process. Check the status of the
        // payment intent to handle these actions.
        const customActionResult =
          await this.handlePaymentThatRequiresCustomerAction(result)
        // No more actions required. Provision your service for the user.
        this.onSubscriptionComplete(customActionResult)
      } catch (error) {
        // An error has happened. Display the failure to the user here.
        // We utilize the HTML element we created.
        this.showCardError(error)
      } finally {
        this.loading = false
      }
    },
    async attachPaymentMethod(paymentMethodId) {
      try {
        const client = this.resolveClient()
        this.loading = true
        await client.mutate({
          mutation: ATTACH_PAYMENT_METHOD,
          variables: {
            paymentMethodId,
            setDefault: this.attachPaymentMethodSetDefault,
          },
        })
        this.$emit('complete', this.paymentType)
        setTimeout(() => {
          this.reset()
        }, 250)
      } catch (error) {
        this.showCardError(error)
      } finally {
        this.loading = false
      }
    },
    async createSubscription({ paymentMethodId, priceId }) {
      try {
        const client = this.resolveClient()
        this.loading = true
        const mutation = this.isPromo
          ? CREATE_PROMO_SUBSCRIPTION
          : UPDATE_PAYMENT_SUBSCRIPTION
        const variables = this.isPromo
          ? {
              paymentMethodId,
            }
          : {
              paymentMethodId,
              priceId,
            }
        const { data } = await client.mutate({
          mutation,
          variables,
          fetchPolicy: 'no-cache',
        })
        const response = this.isPromo
          ? data.createPromoSubscription
          : data.updatePaymentSubscription
        if (response.error) {
          // The card had an error when trying to attach it to a customer.
          throw response
        }
        // Normalize the response to contain the object returned by Stripe.
        // Add the addional details we need.
        const result = {
          paymentMethodId,
          priceId,
          subscription: response,
        }
        // Some payment methods require a customer to be on session
        // to complete the payment process. Check the status of the
        // payment intent to handle these actions.
        const customActionResult =
          await this.handlePaymentThatRequiresCustomerAction(result)
        // If attaching this card to a Customer object succeeds,
        // but attempts to charge the customer fail, you
        // get a requires_payment_method error.
        const requiresPaymentMethodResult =
          await this.handleRequiresPaymentMethod(customActionResult)
        // No more actions required. Provision your service for the user.
        this.onSubscriptionComplete(requiresPaymentMethodResult)
      } catch (error) {
        // An error has happened. Display the failure to the user here.
        // We utilize the HTML element we created.
        this.showCardError(error)
      } finally {
        this.loading = false
      }
    },
    async handlePaymentThatRequiresCustomerAction({
      subscription,
      invoice,
      priceId,
      paymentMethodId,
      isRetry,
    }) {
      if (subscription && subscription.status === 'active') {
        // Subscription is active, no customer actions required.
        return { subscription, priceId, paymentMethodId }
      }

      // If it's a first payment attempt, the payment intent is on the subscription latest invoice.
      // If it's a retry, the payment intent will be on the invoice itself.
      const paymentIntent = invoice
        ? invoice.payment_intent
        : subscription.latest_invoice.payment_intent
      if (!paymentIntent) {
        return { subscription, priceId, paymentMethodId }
      }
      if (
        paymentIntent.status === 'requires_action' ||
        (isRetry === true && paymentIntent.status === 'requires_payment_method')
      ) {
        const result = await this.stripe.confirmCardPayment(
          paymentIntent.client_secret,
          {
            payment_method: paymentMethodId,
          }
        )
        if (result.error) {
          // Start code flow to handle updating the payment details.
          // Display error message in your UI.
          // The card was declined (i.e. insufficient funds, card has expired, etc).
          throw result
        } else {
          if (result.paymentIntent.status === 'succeeded') {
            // Show a success message to your customer.
            // There's a risk of the customer closing the window before the callback.
            // We recommend setting up webhook endpoints later in this guide.
            return {
              priceId,
              subscription,
              invoice,
              paymentMethodId,
            }
          }
        }
      } else {
        // No customer action needed.
        return { subscription, priceId, paymentMethodId }
      }
    },
    async handleRequiresPaymentMethod({
      subscription,
      paymentMethodId,
      priceId,
    }) {
      if (subscription && subscription.status === 'active') {
        // subscription is active, no customer actions required.
        return { subscription, priceId, paymentMethodId }
      } else if (
        subscription &&
        subscription.latest_invoice &&
        subscription.latest_invoice.payment_intent &&
        subscription.latest_invoice.payment_intent.status ===
          'requires_payment_method'
      ) {
        // Using localStorage to manage the state of the retry here,
        // feel free to replace with what you prefer.
        // Store the latest invoice ID and status.
        sessionStorage.setItem(
          'latestInvoiceId',
          subscription.latest_invoice.id
        )
        sessionStorage.setItem(
          'latestInvoicePaymentIntentStatus',
          subscription.latest_invoice.payment_intent.status
        )
        // TODO: error after trial end on correct card
        // eslint-disable-next-line
        console.log('subscription.latest_invoice', subscription.latest_invoice)
        throw { error: { message: this.$t('payment.cardDeclined') } } // eslint-disable-line no-throw-literal
      } else {
        return { subscription, priceId, paymentMethodId }
      }
    },
    onSubscriptionComplete({ subscription }) {
      // Payment was successful.
      if (subscription && subscription.status === 'active') {
        // Change your UI to show a success message to your customer.
        // Call your backend to grant access to your service based on
        // `result.subscription.items.data[0].price.product` the customer subscribed to.
        this.$notify({
          color: 'info',
          text: this.$t('payment.operationComplete'),
        })
      }
      this.$emit('complete', this.paymentType)
      setTimeout(() => {
        this.reset()
      }, 250)
    },
  },
}
</script>
