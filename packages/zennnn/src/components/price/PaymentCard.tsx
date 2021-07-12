import { computed, defineComponent, onMounted, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMutation } from '@vue/apollo-composable'
import {
  Btn,
  Form,
  Radio,
  Checkbox,
  TextField,
  ExpandTransition,
  Autocomplete,
} from '@zennnn/core'
import {
  RETRY_INVOICE_WITH_NEW_PAYMENT_METHOD,
  UPDATE_PAYMENT_SUBSCRIPTION,
  CREATE_PROMO_SUBSCRIPTION,
  ATTACH_PAYMENT_METHOD,
  SET_BILLING_ADDRESS,
} from '@/graphql/mutations'
import countriesCodes from '@/assets/countries/codes.json'
import { useProfile } from '@/composables/profile'
import { logger, useNotify, useTheme } from '@/plugins'
import { PaymentMethod, PaymentType } from '@/types'

import type { PropType } from 'vue'
import type {
  RetryInvoiceWithNewPaymentMethod,
  RetryInvoiceWithNewPaymentMethodVariables,
  UpdatePaymentSubscription,
  UpdatePaymentSubscriptionVariables,
  CreatePromoSubscription,
  CreatePromoSubscriptionVariables,
  AttachPaymentMethod,
  AttachPaymentMethodVariables,
  SetBillingAddress,
  SetBillingAddressVariables,
} from '@/graphql/types'

export default defineComponent({
  props: {
    paymentType: {
      type: String as PropType<PaymentType>,
      required: true,
    },
    defaultPaymentMethodId: String as PropType<string | null>,
    invoiceId: String as PropType<string | null>,
    selectedPriceId: String as PropType<string | null>,
  },

  emits: ['complete', 'back'],

  setup(props, { emit }) {
    const { t, te, locale } = useI18n()
    const notify = useNotify()
    const { isDark } = useTheme()
    const { profile } = useProfile()

    const _stripe = ref<stripe.Stripe>()
    const _elements = ref<stripe.elements.Elements>()
    const _cardElement = ref<stripe.elements.Element>()
    const rootRef = ref()
    const formRef = ref()
    const cardInputId = ref(
      'payment-card-' + Math.round(Math.random() * 100000)
    )
    const loading = ref(false)
    const isCardElementFocused = ref(false)
    const cardElementError = ref('')
    const cardElementComplete = ref(false)
    const formModel = reactive({
      country: '',
      city: '',
      street: '',
      postcode: '',
    })
    const rules = reactive({
      required: (v: any) => !!v || t('rule.required'),
    })
    const attachPaymentMethodSetDefault = ref(false)
    const paymentMethod = ref(PaymentMethod.DEFAULT)

    const isPromo = computed(() => props.paymentType === PaymentType.PROMO)

    const isNewPaymentMethod = computed(
      () => props.paymentType === PaymentType.NEW_PAYMENT_METHOD
    )

    const isInvoice = computed(() => props.paymentType === PaymentType.INVOICE)

    const notHasBillingAddress = computed(
      () => !profile.value?.account?.hasBillingAddress
    )

    const countries = computed(() =>
      Object.entries(countriesCodes).map(([k, v]) => {
        const name = te(`countries.${k}`, 'en') ? t(`countries.${k}`, 'en') : v
        return {
          text: te(`countries.${k}`) ? t(`countries.${k}`) : name,
          value: k,
          name,
        }
      })
    )

    const { mutate: setBillingAddressMutate } = useMutation<
      SetBillingAddress,
      SetBillingAddressVariables
    >(SET_BILLING_ADDRESS)

    const { mutate: retryInvoiceWithNewPaymentMethodMutate } = useMutation<
      RetryInvoiceWithNewPaymentMethod,
      RetryInvoiceWithNewPaymentMethodVariables
    >(RETRY_INVOICE_WITH_NEW_PAYMENT_METHOD, {
      fetchPolicy: 'no-cache',
    })

    const { mutate: attachPaymentMethodMutate } = useMutation<
      AttachPaymentMethod,
      AttachPaymentMethodVariables
    >(ATTACH_PAYMENT_METHOD)

    const { mutate: createPromoSubscriptionMutate } = useMutation<
      CreatePromoSubscription,
      CreatePromoSubscriptionVariables
    >(CREATE_PROMO_SUBSCRIPTION, {
      fetchPolicy: 'no-cache',
    })

    const { mutate: updatePaymentSubscriptionMutate } = useMutation<
      UpdatePaymentSubscription,
      UpdatePaymentSubscriptionVariables
    >(UPDATE_PAYMENT_SUBSCRIPTION, {
      fetchPolicy: 'no-cache',
    })

    onMounted(() => {
      createStripeScript()
      watch(isDark, (val) => {
        if (_cardElement.value) {
          _cardElement.value.update({
            style: {
              base: {
                color: val ? '#FFFFFF' : '#1E1E1E',
                '::placeholder': {
                  color: val ? '#676767' : '#AAAAAA',
                },
              },
            },
          })
        }
      })
    })

    function createStripeScript() {
      // load the Stripe SDK
      // @ts-ignore
      // script dynamically importing
      if (window.Stripe) {
        initStripe()
      } else {
        const script = document.createElement('script')
        script.src = 'https://js.stripe.com/v3/'
        script.async = true
        script.onload = initStripe
        document.body.appendChild(script)
      }
    }

    function initStripe() {
      _stripe.value = window.Stripe(
        process.env.VUE_APP_STRIPE_PUBLISHABLE_KEY as string
      )
      _elements.value = _stripe.value.elements({
        locale:
          locale.value === 'zh-Hans' || locale.value === 'zh-Hant'
            ? 'zh'
            : locale.value,
      })
      const style = {
        base: {
          color: isDark.value ? '#FFFFFF' : '#1E1E1E',
          fontFamily: 'MyriadPro, sans-serif',
          fontSize: '16px',
          '::placeholder': {
            color: isDark.value ? '#676767' : '#AAAAAA',
          },
        },
        invalid: {
          color: '#FF212D',
          iconColor: '#FF212D',
        },
      }
      _cardElement.value = _elements.value.create('card', {
        style,
        hidePostalCode: true,
      })
      _cardElement.value.mount(`#${cardInputId.value}`)
      _cardElement.value.on('change', showCardError)
      _cardElement.value.on('focus', () => {
        isCardElementFocused.value = true
      })
      _cardElement.value.on('blur', () => {
        isCardElementFocused.value = false
      })
    }

    function reset() {
      attachPaymentMethodSetDefault.value = false
      cardElementError.value = ''
      formModel.country = ''
      formModel.city = ''
      formModel.street = ''
      formModel.postcode = ''
      _cardElement.value?.clear()
      notHasBillingAddress.value && formRef.value && formRef.value.reset()
    }

    function showCardError(event: stripe.elements.ElementChangeResponse | any) {
      if (event) {
        cardElementComplete.value = event.complete
        const message =
          event.error && event.error.message
            ? event.error.message
            : event.error || event
        logger.warn(message)
      }
      // TODO: handle graphql errors
      cardElementError.value = event.error ? event.error.message : ''
    }

    function onCardFormSubmit(e: Event) {
      e.preventDefault()
      if (
        paymentMethod.value === PaymentMethod.DEFAULT &&
        props.defaultPaymentMethodId &&
        !isNewPaymentMethod.value
      ) {
        if (isInvoice.value) {
          retryInvoiceWithNewPaymentMethod({
            paymentMethodId: props.defaultPaymentMethodId,
            invoiceId: props.invoiceId as string,
          })
        } else {
          createSubscription({
            paymentMethodId: props.defaultPaymentMethodId,
            priceId: props.selectedPriceId as string,
          })
        }
        cardElementError.value = ''
      } else {
        const billingValid = notHasBillingAddress.value
          ? formRef.value.validate(true)
          : true
        if (cardElementComplete.value && billingValid) {
          createPaymentMethod(
            _cardElement.value,
            props.selectedPriceId as string
          )
          cardElementError.value = ''
        } else {
          if (!cardElementComplete.value) {
            _cardElement.value?.focus()
          } else {
            rootRef.value.scrollIntoView(false)
          }
        }
      }
    }

    async function createPaymentMethod(
      _cardElement: stripe.elements.Element | undefined,
      priceId: string
    ) {
      loading.value = true
      const _props = {
        type: 'card',
        card: _cardElement,
      } as stripe.PaymentMethodData
      const address = []
      if (formModel.city) address.push(['city', formModel.city])
      if (formModel.country) address.push(['country', formModel.country])
      if (formModel.street) address.push(['line1', formModel.street])
      if (formModel.postcode) address.push(['postal_code', formModel.postcode])
      if (address.length > 0) {
        const billingDetails = { address: {} } as {
          address: Record<string, string>
        }
        address.forEach(([key, value]) => {
          billingDetails.address[key] = value
        })
        _props.billing_details = billingDetails
      }
      const result = await _stripe.value?.createPaymentMethod(_props)
      if (result?.error) {
        showCardError(result)
        loading.value = false
      } else {
        if (notHasBillingAddress.value) {
          const { data } = await setBillingAddressMutate({
            country: formModel.country,
            city: formModel.city,
            street: formModel.street,
            postcode: formModel.postcode,
          })
          logger.info('SetBillingAddress', data)
          // TODO: try catch?
          // if (data.error) {
          //   logger.info(
          //     'SetBillingAddress error: ',
          //     data.error.message
          //   )
          // }
        }
        if (isNewPaymentMethod.value) {
          attachPaymentMethod(result!.paymentMethod!.id)
        } else if (props.invoiceId) {
          retryInvoiceWithNewPaymentMethod({
            paymentMethodId: result!.paymentMethod!.id,
            invoiceId: props.invoiceId,
          })
        } else {
          createSubscription({
            paymentMethodId: result!.paymentMethod!.id,
            priceId,
          })
        }
      }
    }

    async function retryInvoiceWithNewPaymentMethod({
      paymentMethodId,
      invoiceId,
    }: {
      paymentMethodId: string
      invoiceId: string
    }) {
      try {
        loading.value = true
        const { data } = await retryInvoiceWithNewPaymentMethodMutate({
          paymentMethodId,
          invoiceId,
        })
        const response = data?.retryInvoiceWithNewPaymentMethod
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
          priceId: props.selectedPriceId,
        }
        // Some payment methods require a customer to be on session
        // to complete the payment process. Check the status of the
        // payment intent to handle these actions.
        const customActionResult =
          await handlePaymentThatRequiresCustomerAction(result)
        // No more actions required. Provision your service for the user.
        onSubscriptionComplete(customActionResult)
      } catch (error) {
        // An error has happened. Display the failure to the user here.
        // We utilize the HTML element we created.
        showCardError(error)
      } finally {
        loading.value = false
      }
    }

    async function attachPaymentMethod(paymentMethodId: string) {
      try {
        loading.value = true
        await attachPaymentMethodMutate({
          paymentMethodId,
          setDefault: attachPaymentMethodSetDefault.value,
        })
        emit('complete', props.paymentType)
        setTimeout(() => {
          reset()
        }, 250)
      } catch (error) {
        showCardError(error)
      } finally {
        loading.value = false
      }
    }

    async function createSubscription({
      paymentMethodId,
      priceId,
    }: {
      paymentMethodId: string
      priceId: string
    }) {
      try {
        loading.value = true

        const { data } = isPromo.value
          ? await createPromoSubscriptionMutate({
              paymentMethodId,
            })
          : await updatePaymentSubscriptionMutate({
              paymentMethodId,
              priceId,
            })

        const response = isPromo.value
          ? (data as CreatePromoSubscription).createPromoSubscription
          : (data as UpdatePaymentSubscription).updatePaymentSubscription

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
          await handlePaymentThatRequiresCustomerAction(result)
        // If attaching this card to a Customer object succeeds,
        // but attempts to charge the customer fail, you
        // get a requires_payment_method error.
        const requiresPaymentMethodResult = await handleRequiresPaymentMethod(
          customActionResult
        )
        // No more actions required. Provision your service for the user.
        onSubscriptionComplete(requiresPaymentMethodResult)
      } catch (error) {
        // An error has happened. Display the failure to the user here.
        // We utilize the HTML element we created.
        showCardError(error)
      } finally {
        loading.value = false
      }
    }

    async function handlePaymentThatRequiresCustomerAction({
      subscription,
      invoice,
      priceId,
      paymentMethodId,
      isRetry,
    }: any) {
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
        const result = await _stripe.value?.confirmCardPayment(
          paymentIntent.client_secret,
          {
            payment_method: paymentMethodId,
          }
        )
        if (result?.error) {
          // Start code flow to handle updating the payment details.
          // Display error message in your UI.
          // The card was declined (i.e. insufficient funds, card has expired, etc).
          throw result
        } else {
          if (result?.paymentIntent?.status === 'succeeded') {
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
    }

    async function handleRequiresPaymentMethod({
      subscription,
      paymentMethodId,
      priceId,
    }: any) {
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
        logger.info('subscription.latest_invoice', subscription.latest_invoice)
        throw { error: { message: t('payment.cardDeclined') } } // eslint-disable-line no-throw-literal
      } else {
        return { subscription, priceId, paymentMethodId }
      }
    }

    function onSubscriptionComplete({ subscription }: any) {
      // Payment was successful.
      if (subscription && subscription.status === 'active') {
        // Change your UI to show a success message to your customer.
        // Call your backend to grant access to your service based on
        // `result.subscription.items.data[0].price.product` the customer subscribed to.
        notify.info(t('payment.operationComplete'))
      }
      emit('complete', props.paymentType)
      setTimeout(() => {
        reset()
      }, 250)
    }

    return () => (
      <div ref={rootRef} class="max-w-screen-md mx-auto">
        {props.defaultPaymentMethodId && !isNewPaymentMethod.value && (
          <div class="pb-6">
            <h3 class="text-2xl pb-6">{t('payment.selectPaymentMethod')}:</h3>
            <Radio
              v-model={paymentMethod.value}
              value={PaymentMethod.DEFAULT}
              class="text-gray-200 dark:text-gray-100 pb-4"
            >
              <span class="ml-3">{t('payment.defaultCard')}</span>
            </Radio>
            <Radio
              v-model={paymentMethod.value}
              value={PaymentMethod.NEW}
              class="text-gray-200 dark:text-gray-100 pb-4"
            >
              <span class="ml-3">{t('payment.addCard')}</span>
            </Radio>
            {paymentMethod.value === PaymentMethod.DEFAULT && (
              <div
                role="alert"
                class={[
                  'min-h-[1.25rem] opacity-0 text-red-500 leading-tight transition-opacity duration-100 ease-in px-1',
                  cardElementError.value ? 'opacity-100' : 'opacity-0',
                ]}
              >
                {cardElementError.value}
              </div>
            )}
          </div>
        )}
        <ExpandTransition>
          <div
            v-show={
              paymentMethod.value === PaymentMethod.NEW ||
              !props.defaultPaymentMethodId
            }
          >
            <h3 class="flex items-center justify-between text-2xl pb-4">
              <div>{t('payment.creditCardData')}:</div>
              <div class="flex-shrink">
                <a
                  href="https://stripe.com/"
                  rel="noreferrer noopener"
                  target="_blank"
                  tabindex="-1"
                >
                  <img
                    src={require('@/assets/img/stripe.svg').default}
                    alt="stripe"
                  />
                </a>
              </div>
            </h3>
            <form
              onSubmit={(e: Event) => {
                e.preventDefault()
                e.stopPropagation()
              }}
            >
              <div
                id={cardInputId.value}
                class={[
                  'h-10 bg-white dark:bg-gray-900 rounded transition-colors duration-150 ease-in-out px-4 py-2.5',
                  {
                    'ring-1 ring-blue-500 ring-inset':
                      isCardElementFocused.value,
                  },
                ]}
              />
              <div
                role="alert"
                class={[
                  'min-h-[1.25rem] opacity-0 text-red-500 leading-tight transition-opacity duration-100 ease-in mt-1 px-1',
                  cardElementError.value ? 'opacity-100' : 'opacity-0',
                ]}
              >
                {cardElementError.value}
              </div>
            </form>
            {notHasBillingAddress.value && (
              <>
                <div class="border-b border-light-gray-400 dark:border-gray-400 mt-10 mb-16" />
                <h3 class="text-2xl pb-6">{t('payment.paymentInfo')}:</h3>
                <Form
                  ref={formRef}
                  lazyValidation
                  class="flex flex-wrap"
                  {...{ onSubmit: onCardFormSubmit }}
                >
                  <div class="w-full sm:w-1/2 sm:pr-3 pb-6">
                    <Autocomplete
                      v-model={formModel.country}
                      items={countries.value}
                      label={t('payment.countryLabel')}
                      placeholder={t('payment.countryPlaceholder')}
                      autocomplete="chrome-off"
                      ariaLabel="country name input"
                      rules={[rules.required]}
                      hideDetails={false}
                      validateOnBlur
                      itemValue="value"
                      itemText="text"
                      required
                    />
                  </div>
                  <div class="w-full sm:w-1/2 sm:pl-3 pb-6">
                    <TextField
                      v-model={formModel.city}
                      label={t('payment.cityLabel')}
                      placeholder={t('payment.cityPlaceholder')}
                      autocomplete="address-level2"
                      ariaLabel="address level2 input"
                      rules={[rules.required]}
                      hideDetails={false}
                      validateOnBlur
                      required
                    />
                  </div>
                  <div class="w-full sm:w-1/2 sm:pr-3 pb-6">
                    <TextField
                      v-model={formModel.street}
                      label={t('payment.streetLabel')}
                      placeholder={t('payment.streetPlaceholder')}
                      autocomplete="street-address"
                      ariaLabel="street address input"
                      rules={[rules.required]}
                      hideDetails={false}
                      validateOnBlur
                      required
                    />
                  </div>
                  <div class="w-full sm:w-1/2 sm:pl-3 pb-6">
                    <TextField
                      v-model={formModel.postcode}
                      label={t('payment.postcodeLabel')}
                      placeholder={t('payment.postcodePlaceholder')}
                      autocomplete="postal-code"
                      ariaLabel="postal code input"
                      rules={[rules.required]}
                      hideDetails={false}
                      validateOnBlur
                      required
                    />
                  </div>
                </Form>
              </>
            )}
          </div>
        </ExpandTransition>
        <div class="flex border-t border-light-gray-400 dark:border-gray-400 mt-10 py-10">
          {isNewPaymentMethod.value ? (
            <Checkbox
              v-model={attachPaymentMethodSetDefault.value}
              class="flex items-center"
            >
              <span class="ml-3">{t('payment.setAsDefault')}</span>
            </Checkbox>
          ) : (
            <Btn
              outlined
              {...{
                onClick: () => {
                  emit('back')
                },
              }}
            >
              {isNewPaymentMethod.value
                ? t('action.cancel')
                : t('payment.back')}
            </Btn>
          )}
          <div class="flex-grow" />
          <Btn loading={loading.value} {...{ onClick: onCardFormSubmit }}>
            {isNewPaymentMethod.value ? t('payment.add') : t('payment.buy')}
          </Btn>
        </div>
      </div>
    )
  },
})
