import {
  defineComponent,
  ref,
  computed,
  onMounted,
  onBeforeMount,
  watch,
} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useApolloClient, useQuery } from '@vue/apollo-composable'
import { ziChecked } from '@zennnn/icons'
import { Alert, Select, Radio, ExpandTransition, Icon } from '@zennnn/core'
import { LIST_PAYMENT_METHODS } from '@/graphql/queries'
import { PAYMENT_DATA } from '@/graphql/subscriptions'
import MainAppBar from '@/components/core/MainAppBar'
import Footer from '@/components/core/Footer'
import ContactForm from '@/components/price/ContactForm'
import PaymentCard from '@/components/price/PaymentCard'
import ProfileCard from '@/components/price/ProfileCard'
import { useProfile } from '@/composables/profile'
import { usePrices } from '@/composables/prices'
import { logger } from '@/plugins'
import { BillingType, PaymentType } from '@/types'

import type { ListPaymentMethods, PaymentData } from '@/graphql/types'

export default defineComponent({
  setup() {
    const route = useRoute()
    const router = useRouter()
    const { t } = useI18n()
    const { resolveClient } = useApolloClient()
    const apolloClient = resolveClient()
    const { profile, refetch: getProfileRefetch } = useProfile()
    const { products, promoProduct, invoiceProduct } = usePrices()

    const billingType = ref(BillingType.MONTHLY)
    const selectedProductModel = ref()

    const orgId = computed(() => profile.value?.account?.org || undefined)

    const { result: listPaymentMethodsResult } = useQuery<ListPaymentMethods>(
      LIST_PAYMENT_METHODS,
      null,
      {
        fetchPolicy: 'no-cache',
      }
    )

    const invoiceId = computed(() => {
      if (paymentType.value === PaymentType.INVOICE) {
        const account = profile.value && profile.value.account
        const latestInvoiceId =
          account?.subscriptionStatus === 'incomplete' ||
          account?.subscriptionStatus === 'past_due'
            ? account.latestInvoiceId
            : null
        return (route.query.invoiceId as string) || latestInvoiceId || undefined
      }
      return undefined
    })

    const currentPriceId = computed(() => profile.value?.account?.priceId)

    const selectedPriceId = computed(() => {
      const key = billingType.value === BillingType.MONTHLY ? 'mId' : 'aId'
      return selectedProduct.value[key]
    })

    const paymentType = computed(() => {
      const type = route.params.type as PaymentType
      if (type === PaymentType.PROMO) {
        return profile.value &&
          profile.value.account &&
          profile.value.account.canPromo &&
          selectedProduct.value.name === 'Advanced'
          ? PaymentType.PROMO
          : PaymentType.CHANGE
      }
      return type
    })

    const selectedProduct = computed({
      get: () => {
        if (selectedProductModel.value) return selectedProductModel.value
        const routeProduct = products.value.find(
          (el: any) => el.id === route.query.product
        )
        if (routeProduct) return routeProduct
        const productId = profile.value?.account?.productId
        return products.value.find((el: any) => el.id === productId) || {}
      },
      set: (val) => {
        selectedProductModel.value = val
      },
    })

    const isPromo = computed(() => paymentType.value === PaymentType.PROMO)

    const isInvoice = computed(() => paymentType.value === PaymentType.INVOICE)

    const defaultPm = computed(() => {
      const result = listPaymentMethodsResult.value?.listPaymentMethods || []
      return result.find((el: any) => el.isDefault)
    })

    onBeforeMount(() => {
      if (route.query.interval === 'annual') {
        billingType.value = BillingType.ANNUALLY
      }
    })

    onMounted(() => {
      const observer = apolloClient.subscribe<PaymentData>({
        query: PAYMENT_DATA,
        fetchPolicy: 'no-cache',
      })

      observer.subscribe({
        next: ({ data }) => {
          const paymentData = data?.paymentData
          const operation = paymentData?.operation
          const payload = paymentData?.payload
          logger.info('payment', operation, payload)
          if (operation === 'invoice.payment_succeeded') {
            // notify.success('Payment success.')
          }
          if (operation === 'invoice.payment_failed') {
            // notify.error('Payment failed.')
          }
          // update profile
          getProfileRefetch()
        },
      })
    })

    onMounted(() => {
      watch(selectedProduct, (val) => {
        if (val.mId === currentPriceId.value) {
          billingType.value = BillingType.ANNUALLY
        } else if (val.aId === currentPriceId.value) {
          billingType.value = BillingType.MONTHLY
        }
      })
    })

    function selectBillingType(type: BillingType) {
      if (
        type === BillingType.MONTHLY &&
        selectedProduct.value.mId === currentPriceId.value
      ) {
        return
      }
      if (
        type === BillingType.ANNUALLY &&
        selectedProduct.value.aId === currentPriceId.value
      ) {
        return
      }
      billingType.value = type
    }

    function onComplete() {
      router.push({ name: 'subscription', query: { state: 'success' } })
    }

    function goBack() {
      router.go(-1)
    }

    return () => (
      <>
        <MainAppBar orgId={orgId.value} />

        <main class="flex-grow bg-light-gray-100 dark:bg-gray-700 dark:text-white">
          <div class="container h-full max-w-screen-md mx-auto pt-16 pb-32">
            <h1 class="text-[2.5rem] font-bold leading-tight mb-6">
              {t('payment.title')}
            </h1>

            <ProfileCard />

            <div class="pt-6">
              <Alert
                close={false}
                color="warn"
                maxWidth="none"
                iconClass="text-yellow-500"
                contentClass="text-gray-500 dark:text-light-gray-400"
                containerClass="items-start bg-yellow-500 bg-opacity-20"
              >
                <span
                  v-html={t('payment.paymentAlert', {
                    email: profile.value?.email,
                  })}
                />
              </Alert>
            </div>

            <div class="flex flex-col sm:flex-row justify-between pt-16">
              <h3 class="text-2xl pb-6 sm:pb-0">
                {t('payment.selectedPlan')}:
              </h3>
              <Select
                v-model={selectedProduct.value}
                placeholder={t('placeholder.notChosen')}
                items={products.value}
                inputClass={selectedProduct.value && 'font-semibold text-right'}
                readonly={isPromo.value || isInvoice.value}
                returnObject
                itemValue="id"
                itemText="title"
                v-slots={{
                  prepend: () =>
                    selectedProduct.value && (
                      <div class="w-full flex justify-between flex-grow text-base text-gray-900 dark:text-white pl-7">
                        <div>{selectedProduct.value.members}</div>
                      </div>
                    ),
                  item: ({ item, selected }: any) => (
                    <div class="w-full flex">
                      <div class="flex-shrink-0 w-8">
                        {selected.value && <Icon>{ziChecked}</Icon>}
                      </div>
                      <div class="flex-grow pr-2">{item.members}</div>
                      <div class="font-semibold pl-2 pr-6">{item.title}</div>
                    </div>
                  ),
                }}
              />
            </div>
            <div class="border-b border-light-gray-400 dark:border-gray-400 my-16" />

            {selectedProduct.value?.name === 'Premium' ? (
              <div>
                <h3 class="text-2xl pb-4">{t('payment.contactTitle')}:</h3>
                <div class="flex flex-wrap">
                  <div class="w-full sm:w-1/2 sm:pr-5">
                    <ContactForm />
                  </div>
                  <div
                    class="w-full sm:w-1/2 sm:pl-5 pt-8"
                    v-html={t('payment.contactHint')}
                  />
                </div>
              </div>
            ) : (
              <div>
                <h3 class="text-2xl pb-4">{t('payment.selectPaymentType')}:</h3>
                {isInvoice.value ? (
                  <div class="ring-2 ring-blue-500 bg-white dark:bg-gray-900 h-14 flex items-center justify-between rounded-md cursor-pointer p-4">
                    <div class="sm:w-64">{t('payment.invoiceAmount')}</div>
                    <div class="hidden sm:block md:w-64 mx-8">
                      <div class="h-px bg-light-gray-400 dark:bg-gray-400 w-full" />
                    </div>
                    <div class="flex items-center w-full">
                      <span class="font-bold">
                        {invoiceProduct.value?.price}
                      </span>
                      {invoiceProduct.value?.priceInCurrency && (
                        <>
                          <span class="pl-1">~</span>
                          <span class="pl-1">
                            {invoiceProduct.value.priceInCurrency}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                ) : isPromo.value ? (
                  <div class="ring-2 ring-blue-500 bg-white dark:bg-gray-900 h-14 flex items-center justify-between rounded-md cursor-pointer p-4">
                    <div class="sm:w-64">{t('payment.extendMonth')}</div>
                    <div class="hidden sm:block md:w-64 mx-8">
                      <div class="h-px bg-light-gray-400 dark:bg-gray-400 w-full" />
                    </div>
                    <div class="flex items-center w-full">
                      <span class="font-bold">{promoProduct.value?.price}</span>
                      {promoProduct.value?.priceInCurrency && (
                        <>
                          <span class="pl-1">~</span>
                          <span class="pl-1">
                            {promoProduct.value.priceInCurrency}
                          </span>
                        </>
                      )}
                      <span class="whitespace-nowrap pl-1">
                        {t('payment.forMonth')}
                      </span>
                      <div class="whitespace-nowrap relative h-8 flex items-center rounded-md font-semibold text-white bg-yellow-400 border-yellow-400 ml-6 px-2">
                        {t('payment.bonusMonth')}
                        <div
                          class="absolute left-0 top-0 translate-y-1/2 border-transparent -ml-2"
                          style="border-width: 8px 8px 8px 0; border-right-color: inherit"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div
                      v-show={
                        selectedProduct.value.mId !== currentPriceId.value
                      }
                      class={[
                        'h-14 relative flex items-center justify-between rounded-md cursor-pointer p-4 mb-4',
                        {
                          'ring-2 ring-blue-500 bg-white dark:bg-gray-900':
                            billingType.value === BillingType.MONTHLY,
                        },
                      ]}
                      onClick={() => selectBillingType(BillingType.MONTHLY)}
                    >
                      {selectedProduct.value.aId === currentPriceId.value ? (
                        <div class="sm:w-64">{t('payment.monthly')}</div>
                      ) : (
                        <Radio
                          v-model={billingType.value}
                          value={BillingType.MONTHLY}
                          hideDetails
                          class="sm:w-64"
                        >
                          <span class="ml-4">{t('payment.monthly')}</span>
                        </Radio>
                      )}
                      <div class="hidden sm:block md:w-64 mx-8">
                        <div class="h-px bg-light-gray-400 dark:bg-gray-400 w-full" />
                      </div>
                      <div class="flex flex-wrap sm:flex-nowrap justify-end sm:justify-start items-center w-full">
                        <span class="font-bold">
                          {selectedProduct.value.mPrice}
                        </span>
                        {selectedProduct.value.mPriceInCurrency && (
                          <>
                            <span class="pl-1">~</span>
                            <span class="pl-1">
                              {selectedProduct.value.mPriceInCurrency}
                            </span>
                          </>
                        )}
                        <span class="pl-1">{t('payment.inMonth')}</span>
                      </div>
                    </div>
                    <div
                      v-show={
                        selectedProduct.value.aId !== currentPriceId.value
                      }
                      class={[
                        'h-14 relative flex items-center justify-between rounded-md cursor-pointer p-4',
                        {
                          'ring-2 ring-blue-500 bg-white dark:bg-gray-900':
                            billingType.value === BillingType.ANNUALLY,
                        },
                      ]}
                      onClick={() => selectBillingType(BillingType.ANNUALLY)}
                    >
                      {selectedProduct.value.mId === currentPriceId.value ? (
                        <div class="sm:w-64">{t('payment.annual')}</div>
                      ) : (
                        <Radio
                          v-model={billingType.value}
                          value={BillingType.ANNUALLY}
                          class="sm:w-64"
                        >
                          <span class="ml-4">{t('payment.annual')}</span>
                        </Radio>
                      )}
                      <div class="hidden sm:block md:w-64 mx-8">
                        <div class="h-px bg-light-gray-400 dark:bg-gray-400 w-full" />
                      </div>
                      <div class="flex flex-wrap sm:flex-nowrap justify-end sm:justify-start items-center w-full">
                        <span class="font-bold">
                          {selectedProduct.value.aPriceTotal}
                        </span>
                        <span class="pl-1">/</span>
                        {selectedProduct.value.aPriceInCurrency && (
                          <span class="pl-1">~</span>
                        )}

                        <span class="pl-1">
                          {selectedProduct.value.aPriceInCurrency ||
                            selectedProduct.value.aPrice}
                        </span>
                        <span class="whitespace-nowrap pl-1">
                          {t('payment.inMonth')}
                        </span>
                        <div class="whitespace-nowrap relative sm:h-8 flex items-center rounded-md font-semibold text-white bg-yellow-400 border-yellow-400 ml-6 px-2">
                          {t('payment.econ')}
                          <div
                            class="hidden sm:block absolute left-0 top-0 translate-y-1/2 border-transparent -ml-2"
                            style="border-width: 8px 8px 8px 0; border-right-color: inherit;"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
                <div class="flex justify-between text-xl sm:text-2xl pt-10 pr-4 mr-0.5">
                  <div class="sm:w-64">{t('payment.total')}:</div>
                  <div class="hidden sm:block md:w-64 mx-8" />
                  {isInvoice.value ? (
                    <div class="flex items-center w-full pl-4 ml-0.5">
                      <span class="font-bold">
                        {invoiceProduct.value?.price}
                      </span>
                      {invoiceProduct.value?.priceInCurrency && (
                        <>
                          <span class="pl-1">~</span>
                          <span class="pl-1">
                            {invoiceProduct.value.priceInCurrency}
                          </span>
                        </>
                      )}
                    </div>
                  ) : isPromo.value ? (
                    <div class="flex items-center w-full pl-4 ml-0.5">
                      <span class="font-bold">{promoProduct.value?.price}</span>
                      {promoProduct.value?.priceInCurrency && (
                        <>
                          <span class="pl-1">~</span>
                          <span class="pl-1">
                            {promoProduct.value.priceInCurrency}
                          </span>
                        </>
                      )}
                    </div>
                  ) : (
                    <div class="flex flex-wrap sm:flex-nowrap justify-end sm:justify-start items-center w-full pl-4 ml-0.5">
                      <span class="font-bold">
                        {billingType.value === BillingType.ANNUALLY
                          ? selectedProduct.value.aPriceTotal
                          : selectedProduct.value.mPrice}
                      </span>
                      {billingType.value === BillingType.ANNUALLY && (
                        <span class="pl-1">/</span>
                      )}
                      {(selectedProduct.value.mPriceInCurrency ||
                        selectedProduct.value.aPriceInCurrency) && (
                        <span class="pl-1">~</span>
                      )}
                      <span class="pl-1">
                        {billingType.value === BillingType.ANNUALLY
                          ? selectedProduct.value.aPriceInCurrency ||
                            selectedProduct.value.aPrice
                          : selectedProduct.value.mPriceInCurrency || undefined}
                      </span>
                      <span class="pl-1">{t('payment.inMonth')}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            <ExpandTransition>
              {selectedProduct.value.name !== 'Premium' && (
                <div>
                  <div class="border-b border-light-gray-400 dark:border-gray-400 my-16" />
                  <PaymentCard
                    defaultPaymentMethodId={defaultPm.value?.id}
                    paymentType={paymentType.value}
                    selectedPriceId={selectedPriceId.value}
                    invoiceId={invoiceId.value}
                    {...{
                      onBack: goBack,
                      onComplete: onComplete,
                    }}
                  />
                </div>
              )}
            </ExpandTransition>
          </div>
        </main>

        <Footer />
      </>
    )
  },
})
