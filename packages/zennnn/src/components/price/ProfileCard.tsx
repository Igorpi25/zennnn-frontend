import { defineComponent, ref, computed, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ziUser, ziRocket, ziEmail } from '@zennnn/icons'
import { Icon, Btn } from '@zennnn/core'
import Avatar from 'shared/components/Avatar'
import Dialog from 'shared/components/Dialog'
import { parseDate } from 'shared/utils/date'
import ContactForm from '@/components/price/ContactForm'
import SubscriptionLabel from '@/components/core/SubscriptionLabel'
import { useProfile } from '@/composables/profile'
import { usePrices } from '@/composables/prices'
import { useSubscription } from '@/composables/subscription'
import { PaymentType } from '@/types'

export default defineComponent({
  props: {
    planSelect: Boolean,
  },

  setup(props) {
    const router = useRouter()
    const { t, d } = useI18n()
    const { profile, fullName } = useProfile()
    const { prices, products } = usePrices()
    const { status, productName, canChange, canSelect } = useSubscription()

    const changeDialog = ref(false)
    const contactDialog = ref(false)
    const contactFormRef = ref()
    const selectedProductId = ref<string>()

    const isAnnually = computed(() => {
      const priceId = profile.value?.account?.priceId
      if (!priceId) return false
      return prices.value.some(
        (el: any) => el.id === priceId && el.nickname.includes('Annual')
      )
    })

    watch(contactDialog, (val) => {
      if (val) {
        nextTick(() => {
          contactFormRef.value && contactFormRef.value.focus()
        })
      } else {
        nextTick(() => {
          contactFormRef.value && contactFormRef.value.reset()
        })
      }
    })

    watch(changeDialog, (val) => {
      if (val) {
        selectedProductId.value = profile.value?.account?.productId || undefined
      }
    })

    function goToPayment(productId: string) {
      router.push({
        name: 'payment',
        params: { type: PaymentType.CHANGE },
        query: { product: productId },
      })
    }

    return () => (
      <div class="flex flex-col md:flex-row items-center justify-between bg-white dark:bg-gray-800 rounded-lg py-4 px-6">
        <div class="flex md:flex-1 items-center w-full">
          <Avatar
            size={64}
            src={profile.value?.picture || undefined}
            class="bg-gray-100 dark:bg-gray-200 flex-shrink-0"
          >
            <Icon large class="text-light-gray-400 dark:text-gray-400">
              {ziUser}
            </Icon>
          </Avatar>
          <div class="pl-4">
            <div class="break-words md:break-normal md:truncate leading-6 text-lg font-medium">
              {fullName.value}
            </div>
            <div class="break-all md:break-normal md:truncate text-gray-100">
              {profile.value?.email}
            </div>
          </div>
        </div>
        <div class="md:flex-1 w-full md:max-w-xs border-t md:border-t-0 md:border-l border-light-gray-400 dark:border-gray-400 pt-4 mt-4 md:mt-0 md:pt-0 md:ml-6 md:pl-6">
          <div class="flex justify-between">
            <div>
              <div class="h-6 leading-6 text-lg font-semibold mb-0.5">
                {productName.value}
              </div>

              {props.planSelect && (canChange.value || canSelect.value) ? (
                <div>
                  <Dialog
                    v-model={changeDialog.value}
                    v-slots={{
                      activator: () => (
                        <Btn link>
                          {canChange.value
                            ? t('payment.changePlan')
                            : t('payment.selectPlan')}
                        </Btn>
                      ),
                    }}
                    icon={ziRocket}
                    title={
                      canChange.value
                        ? t('payment.changePlanTitle')
                        : t('payment.selectPlan')
                    }
                    bodyClass="space-y-2 p-6"
                  >
                    {products.value.map((item) => (
                      <div class="flex items-center w-full bg-light-gray-100 dark:bg-gray-700 rounded-md px-6 py-4">
                        <div class="w-1/2 sm:w-1/3 leading-tight">
                          <div class="text-gray-300 dark:text-gray-100 font-semibold pb-2">
                            {item.title}
                          </div>
                          {profile.value?.account?.productId === item.id ? (
                            <div class="text-sm text-green-500">
                              {t('payment.currentPlan')}
                            </div>
                          ) : (
                            <Btn link class="text-sm" to={{ name: 'pricing' }}>
                              {t('payment.more')}
                            </Btn>
                          )}
                        </div>
                        <div class="hidden sm:block w-1/3 text-sm text-gray-200 leading-tight self-start pt-1 pl-3">
                          {item.isCustomPrice ? (
                            item.annotation
                          ) : (
                            <>
                              {isAnnually.value ? item.aPrice : item.mPrice}
                              <br />
                              {item.annotation}
                            </>
                          )}
                        </div>
                        <div class="text-right w-1/2 sm:w-1/3 pl-3">
                          {item.isCustomPrice ? (
                            <Dialog
                              v-model={contactDialog.value}
                              icon={ziEmail}
                              title={t('pricing.contact')}
                              maxWidth={416}
                              v-slots={{
                                activator: () => (
                                  <Btn block outlined small>
                                    {t('pricing.contact')}
                                  </Btn>
                                ),
                              }}
                            >
                              <ContactForm
                                ref={contactFormRef}
                                hasCancel
                                {...{
                                  onCancel: () => {
                                    contactDialog.value = false
                                  },
                                  onSuccess: () => {
                                    contactDialog.value = false
                                  },
                                }}
                              />
                            </Dialog>
                          ) : (
                            <Btn
                              block
                              outlined
                              small
                              {...{
                                onClick: () => {
                                  if (item.isCustomPrice) return
                                  selectedProductId.value = item.id
                                  goToPayment(item.id)
                                },
                              }}
                            >
                              {t('payment.select')}
                            </Btn>
                          )}
                        </div>
                      </div>
                    ))}
                  </Dialog>
                </div>
              ) : (
                <div class="text-gray-100">{t('payment.tariffTitle')}</div>
              )}
            </div>
            {profile.value?.account && (
              <div class="text-right">
                {status.value && (
                  <SubscriptionLabel
                    status={status.value}
                    class="text-white font-semibold !rounded-md mb-0.5"
                  >
                    {t(`payment.${status.value}`)}
                  </SubscriptionLabel>
                )}
                {profile.value.account.periodEnd && (
                  <div>
                    {status.value !== 'expired' && (
                      <span class="mr-1">{t('payment.until')}</span>
                    )}
                    <span>
                      {d(
                        parseDate(
                          Number(profile.value.account.periodEnd) * 1000
                        )
                      )}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  },
})
