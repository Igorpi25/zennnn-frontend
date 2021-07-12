import { defineComponent, ref, computed, onMounted, onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useApolloClient, useQuery, useMutation } from '@vue/apollo-composable'
import {
  ziDelete,
  ziDownload,
  ziStop,
  ziStarLg,
  ziStarOutlineLg,
} from '@zennnn/icons'
import { Btn, Icon, Modal, DataTable, Image } from '@zennnn/core'
import { LIST_PAYMENT_METHODS, LIST_PAYMENT_INVOICES } from '@/graphql/queries'
import {
  CANCEL_PAYMENT_SUBSCRIPTION,
  SET_DEFAULT_PAYMENT_METHOD,
  DETACH_PAYMENT_METHOD,
} from '@/graphql/mutations'
import { PAYMENT_DATA } from '@/graphql/subscriptions'
import Dialog from 'shared/components/Dialog'
import { parseDate } from 'shared/utils/date'
import MainAppBar from '@/components/core/MainAppBar'
import Footer from '@/components/core/Footer'
import PaymentCard from '@/components/price/PaymentCard'
import ProfileCard from '@/components/price/ProfileCard'
import { useProfile } from '@/composables/profile'
import { useSubscription } from '@/composables/subscription'
import { logger } from '@/plugins'
import { PaymentType } from '@/types'

import type {
  ListPaymentMethods,
  ListPaymentInvoices,
  CancelPaymentSubscription,
  SetDefaultPaymentMethod,
  SetDefaultPaymentMethodVariables,
  DetachPaymentMethod,
  DetachPaymentMethodVariables,
  PaymentData,
} from '@/graphql/types'

export default defineComponent({
  setup() {
    const route = useRoute()
    const router = useRouter()
    const { t, n, d } = useI18n()
    const { resolveClient } = useApolloClient()
    const apolloClient = resolveClient()
    const { profile, refetch: getProfileRefetch } = useProfile()
    const { canChange, canCancel } = useSubscription()

    const successDialog = ref(false)
    const setDefaultPaymentMethodId = ref<string>()
    const detachPaymentMethodId = ref<string>()
    const addPaymentMethodDialog = ref(false)

    const orgId = computed(() => profile.value?.account?.org)

    const {
      result: listPaymentMethodsResult,
      refetch: listPaymentMethodsRefetch,
    } = useQuery<ListPaymentMethods>(LIST_PAYMENT_METHODS, null, {
      fetchPolicy: 'no-cache',
    })

    const {
      result: listPaymentInvoicesResult,
      loading: listPaymentInvoicesLoading,
      refetch: listPaymentInvoicesRefetch,
    } = useQuery<ListPaymentInvoices>(LIST_PAYMENT_INVOICES, null, {
      fetchPolicy: 'no-cache',
    })
    const listPaymentInvoices = computed(
      () => listPaymentInvoicesResult.value?.listPaymentInvoices
    )

    const {
      mutate: cancelPaymentSubscriptionMutate,
      loading: cancelPaymentSubscriptionLoading,
      onDone: onCancelPaymentSubscriptionDone,
    } = useMutation<CancelPaymentSubscription>(CANCEL_PAYMENT_SUBSCRIPTION)

    const {
      mutate: setDefaultPaymentMethodMutate,
      loading: setDefaultPaymentMethodLoading,
    } = useMutation<SetDefaultPaymentMethod, SetDefaultPaymentMethodVariables>(
      SET_DEFAULT_PAYMENT_METHOD,
      {
        refetchQueries: ['ListPaymentMethods'],
      }
    )

    const {
      mutate: detachPaymentMethodMutate,
      loading: detachPaymentMethodLoading,
    } = useMutation<DetachPaymentMethod, DetachPaymentMethodVariables>(
      DETACH_PAYMENT_METHOD,
      {
        refetchQueries: ['ListPaymentMethods'],
      }
    )

    onCancelPaymentSubscriptionDone(() => {
      getProfileRefetch()
    })

    const defaultPm = computed(() => {
      const result = listPaymentMethodsResult.value?.listPaymentMethods || []
      return result.find((el: any) => el.isDefault)
    })

    const paymentMethods = computed(() => {
      const result = listPaymentMethodsResult.value?.listPaymentMethods || []
      return result.filter((el: any) => !el.isDefault)
    })

    const paymentInvoicesHeaders = computed(() => [
      {
        text: t('payment.invoiceNumber'),
        value: 'number',
        width: 146,
        class: 'px-4',
        align: 'left' as const,
      },
      {
        text: t('payment.invoiceDate'),
        value: 'period_start',
        width: 162,
        class: 'pl-4 pr-2',
        align: 'left' as const,
      },
      {
        text: t('payment.invoiceAmount'),
        value: 'amount_due',
        width: 110,
        class: 'pl-2 pr-4',
        align: 'right' as const,
      },
      {
        text: t('payment.invoiceStatus'),
        value: 'status',
        width: 146,
        class: 'px-4',
        align: 'right' as const,
      },
      {
        text: '',
        value: 'open',
        width: '100%',
      },
      {
        text: '',
        value: 'status',
        width: 56,
      },
    ])

    onBeforeMount(() => {
      if (route.query.state === 'success') {
        successDialog.value = true
        router.replace({ query: {} })
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
            // notify.succes('Payment success.')
            listPaymentInvoicesRefetch()
          }
          if (operation === 'invoice.payment_failed') {
            // notify.error('Payment failed.')
            listPaymentInvoicesRefetch()
          }
          // update profile
          getProfileRefetch()
        },
      })
    })

    function openInvoice(invoice: any) {
      router.push({
        name: 'payment',
        params: { type: PaymentType.INVOICE },
        query: {
          invoiceId: invoice.id,
          invoiceNo: invoice.number,
          amount: (invoice.amount_due / 100).toFixed(2),
        },
      })
    }

    return () => (
      <>
        <MainAppBar orgId={orgId.value} />

        <Modal
          v-model={successDialog.value}
          width="100%"
          maxWidth="448"
          contentClass="text-center p-6"
          hideOverlay
        >
          <Image
            width="241"
            height="241"
            class="mx-auto mb-4"
            src={require('@/assets/img/IMG_8AACC873C31E-1.png').default}
            alt="ok"
          />
          <h2 class="text-center font-semibold text-2xl mb-8">
            {/* TODO: add to locales */}
            {t('payment.subscriptionPaid')}
          </h2>
          <Btn
            primary
            {...{
              onClick: () => {
                successDialog.value = false
              },
            }}
          >
            {t('payment.ok')}
          </Btn>
        </Modal>

        <main class=" flex-grow bg-light-gray-100 dark:bg-gray-700 dark:text-white">
          <div class="container h-full max-w-screen-md mx-auto pt-16 pb-32">
            <h1 class="text-[2.5rem] font-bold leading-tight mb-6">
              {t('payment.subscriptionManagement')}
            </h1>

            <ProfileCard planSelect />

            {canChange.value && canCancel.value && (
              <div class="text-right py-2 px-3">
                <Dialog
                  v-slots={{
                    activator: () => (
                      <Btn link class="text-red-600 hover:text-pink-500">
                        {t('payment.cancelSubscription')}
                      </Btn>
                    ),
                    actionStart: () => (
                      <Btn
                        loading={cancelPaymentSubscriptionLoading.value}
                        primary={false}
                        class="text-white bg-red-700 hover:bg-red-600 active:bg-red-600 focus:ring-red-600"
                        {...{ onClick: cancelPaymentSubscriptionMutate }}
                      >
                        {t('payment.cancelSubscription')}
                      </Btn>
                    ),
                  }}
                  bodyClass="dark:text-white p-6"
                  icon={ziStop}
                  title={t('payment.cancelTitle')}
                  showActions
                  cancelText={t('action.cancel')}
                  loading={cancelPaymentSubscriptionLoading.value}
                >
                  <div class="text-yellow-400 font-semibold pb-4">
                    {/* TODO: add to locales */}
                    {t('payment.cancelTitle')}
                  </div>
                  {/* TODO: add to locales */}
                  <div v-html={t('payment.cancelText')} />
                </Dialog>
              </div>
            )}

            {profile.value?.account?.canPromo && (
              <div class="flex flex-col sm:flex-row items-center justify-between bg-white rounded-md p-4 mt-12">
                <div class="text-lg text-black dark:text-white leading-snug pl-2 pb-4 sm:pb-0">
                  <span v-html={t('payment.oneUSD')} class="mr-1" />
                </div>
                <Btn
                  to={{ name: 'payment', params: { type: PaymentType.PROMO } }}
                  class="ml-4"
                >
                  {t('payment.proceed')}
                </Btn>
              </div>
            )}

            <div class="border-b border-light-gray-400 dark:border-gray-400 mt-16 mb-16" />
            <h3 class="text-2xl pb-6">{t('payment.paymentMethod')}</h3>

            {defaultPm.value && (
              <>
                <h4 class="text-gray-200 dark:text-gray-100 mb-3">
                  {t('payment.defaultCard')}
                </h4>
                <div class="overflow-x-auto scrolling-touch pb-10">
                  <table class="w-full border-separate text-gray-200 dark:text-gray-100 border-spacing-y-1">
                    <tbody>
                      <tr class="h-12 bg-white dark:bg-gray-600 group">
                        <td style="width: 52px" class="rounded-l-md px-4">
                          <Icon>{ziStarLg}</Icon>
                        </td>
                        <td style="width: 156px" class="capitalize px-4">
                          {defaultPm.value.card.brand}
                        </td>
                        <td class="px-4">
                          <div class="flex items-center">
                            {Array(3)
                              .fill(0)
                              .map((_, g) => (
                                <div key={`g-${g}`} class="flex pr-3">
                                  {Array(4)
                                    .fill(0)
                                    .map((_, i) => (
                                      <div
                                        key={`i-${i}`}
                                        class="bg-gray-100 dark:bg-gray-200 rounded-full w-2.5 h-2.5 mr-1"
                                      />
                                    ))}
                                </div>
                              ))}
                            <div>{defaultPm.value.card.last4}</div>
                          </div>
                        </td>
                        <td class="px-4">
                          {defaultPm.value.card.exp_month
                            .toString()
                            .padStart(2, '0')}
                          /{defaultPm.value.card.exp_year}
                        </td>
                        <td
                          style="width:56px"
                          class="rounded-r-md text-gray-100 px-4"
                        ></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {paymentMethods.value.length > 0 && (
              <>
                <h4 class="text-gray-200 dark:text-gray-100 mb-3">
                  {t('payment.otherCards')}
                </h4>
                <div class="overflow-x-auto scrolling-touch pb-10">
                  <table class="w-full border-separate text-gray-200 dark:text-gray-100 border-spacing-y-1">
                    <tbody>
                      {paymentMethods.value.map((item: any) => (
                        <tr
                          key={item.id}
                          class="h-12 bg-white dark:bg-gray-600 hover:bg-transparent dark:hover:bg-transparent group"
                        >
                          <td
                            style="width:52px"
                            class="rounded-l-md text-gray-100 px-4"
                          >
                            <Btn
                              icon
                              text
                              mini
                              loading={
                                setDefaultPaymentMethodLoading.value &&
                                setDefaultPaymentMethodId.value === item.id
                              }
                              class="align-middle invisible group-hover:visible text-gray-200 dark:text-gray-100"
                              {...{
                                onClick: async () => {
                                  try {
                                    setDefaultPaymentMethodId.value = item.id
                                    await setDefaultPaymentMethodMutate({
                                      paymentMethodId: item.id,
                                    })
                                  } catch (error) {
                                    // eslint-disable-line
                                  } finally {
                                    setDefaultPaymentMethodId.value = undefined
                                  }
                                },
                              }}
                            >
                              <Icon>{ziStarOutlineLg}</Icon>
                            </Btn>
                          </td>
                          <td style="width:156px" class="capitalize px-4">
                            {item.card.brand}
                          </td>
                          <td class="px-4">
                            <div class="flex items-center">
                              {Array(3)
                                .fill(0)
                                .map((_, g) => (
                                  <div key={`g-${g}`} class="flex pr-3">
                                    {Array(4)
                                      .fill(0)
                                      .map((_, i) => (
                                        <div
                                          key={`i-${i}`}
                                          class="bg-gray-100 dark:bg-gray-200 rounded-full w-2.5 h-2.5 mr-1"
                                        />
                                      ))}
                                  </div>
                                ))}
                              <div>{item.card.last4}</div>
                            </div>
                          </td>
                          <td class="px-4">
                            {item.card.exp_month.toString().padStart(2, '0')}/
                            {item.card.exp_year}
                          </td>
                          <td style="width:56px" class="rounded-r-md px-4">
                            <Btn
                              icon
                              text
                              mini
                              loading={
                                detachPaymentMethodLoading.value &&
                                detachPaymentMethodId.value === item.id
                              }
                              class="align-middle invisible group-hover:visible text-gray-200 dark:text-gray-100"
                              {...{
                                onClick: async () => {
                                  try {
                                    detachPaymentMethodId.value = item.id
                                    await detachPaymentMethodMutate({
                                      paymentMethodId: item.id,
                                    })
                                  } catch (error) {
                                    // eslint-disable-line
                                  } finally {
                                    detachPaymentMethodId.value = undefined
                                  }
                                },
                              }}
                            >
                              <Icon class="align-middle">{ziDelete}</Icon>
                            </Btn>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            <div class="text-right">
              <Modal
                v-model={addPaymentMethodDialog.value}
                width="100%"
                maxWidth="672"
                contentClass="bg-light-gray-100 px-5 pt-8"
                v-slots={{
                  activator: () => <Btn>{t('payment.addCard')}</Btn>,
                }}
              >
                <PaymentCard
                  paymentType={PaymentType.NEW_PAYMENT_METHOD}
                  {...{
                    onComplete: () => {
                      addPaymentMethodDialog.value = false
                      listPaymentMethodsRefetch()
                    },
                  }}
                />
              </Modal>
            </div>

            {listPaymentInvoices.value?.length > 0 && (
              <div class="pb-10">
                <div class="border-b border-light-gray-400 dark:border-gray-400 mt-16 mb-16" />
                <h3 class="text-2xl pb-6">{t('payment.invoices')}</h3>

                <DataTable
                  headers={paymentInvoicesHeaders.value}
                  items={listPaymentInvoices.value}
                  loading={listPaymentInvoicesLoading.value}
                  tableClass="w-full table-fixed bg-light-gray-300 dark:bg-gray-800"
                  v-slots={{
                    items: ({ items }: { items: any[] }) =>
                      items.map((item) => (
                        <tr
                          key={item.id}
                          class="group !bg-light-gray-100 hover:!bg-white dark:!bg-gray-600 dark:hover:!bg-gray-700 text-gray-200 dark:text-gray-100"
                        >
                          <td class="rounded-l-md px-4">{item.number}</td>
                          <td class="whitespace-nowrap pl-4">
                            <span class="pr-4">
                              {d(parseDate(item.period_start * 1000))}
                            </span>
                            <span class="text-gray-100">
                              {d(parseDate(item.period_start * 1000), 'time')}
                            </span>
                          </td>
                          <td class="text-right font-semibold pl-2 pr-4">
                            ${n(item.amount_due / 100)}
                          </td>
                          <td
                            class={[
                              'px-4',
                              item.status === 'open'
                                ? 'text-yellow-500'
                                : item.status === 'paid'
                                ? 'text-green-500'
                                : item.status === 'void'
                                ? 'text-pink-500'
                                : '',
                            ]}
                          >
                            {item.status === 'draft'
                              ? t('payment.invoiceDraft')
                              : item.status === 'open'
                              ? t('payment.invoiceOpen')
                              : item.status === 'paid'
                              ? t('payment.invoicePaid')
                              : item.status === 'void'
                              ? t('payment.invoiceVoid')
                              : item.status === 'uncollectible'
                              ? t('payment.invoiceUncollectible')
                              : item.status}
                          </td>
                          <td class="px-1">
                            {item.status === 'open' && (
                              <Btn
                                link
                                {...{ onClick: () => openInvoice(item) }}
                              >
                                {t('payment.invoicePay')}
                              </Btn>
                            )}
                          </td>
                          <td class="rounded-r-md px-4">
                            <Btn
                              link
                              href={item.invoice_pdf}
                              class="invisible group-hover:visible text-gray-200"
                              {...{ target: '_blank' }}
                            >
                              <Icon>{ziDownload}</Icon>
                            </Btn>
                          </td>
                        </tr>
                      )),
                  }}
                />
              </div>
            )}
          </div>
        </main>

        <Footer />
      </>
    )
  },
})
