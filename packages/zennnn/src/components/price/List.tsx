import { defineComponent, nextTick, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ziChecked, ziUsers, ziEmail } from '@zennnn/icons'
import { Btn, Icon } from '@zennnn/core'
import Dialog from 'shared/components/Dialog'
import { useReactiveVar } from 'shared/composables/reactiveVar'
import ContactForm from '@/components/price/ContactForm'
import { usePrices } from '@/composables/prices'
import { isLoggedInVar } from '@/plugins/apollo'
import { PaymentType } from '@/types'

export default defineComponent({
  setup() {
    const { t } = useI18n()
    const { products } = usePrices()

    const isLoggedIn = useReactiveVar(isLoggedInVar)

    const contactDialog = ref(false)
    const contactForm = ref()

    watch(contactDialog, (val) => {
      if (val) {
        nextTick(() => {
          contactForm.value && contactForm.value.focus()
        })
      } else {
        nextTick(() => {
          contactForm.value && contactForm.value.reset()
        })
      }
    })

    function closeContactDialog() {
      contactDialog.value = false
    }

    return () => (
      <div class="border border-light-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 leading-snug overflow-x-auto rounded-md grid sm:grid-cols-[repeat(4,minmax(282px,1fr))]">
        {products.value.map((item) => (
          <div
            class={{
              'border-b sm:border-b-0 sm:border-r border-light-gray-300 dark:border-gray-600 sm:last:border-r-0 flex flex-col px-8 pt-8':
                true,
              'bg-light-gray-100 dark:bg-gray-700': item.name === 'Advanced',
            }}
          >
            <div class="flex items-center justify-between font-semibold pb-[1.875rem]">
              <div class="text-xl">{item.title}</div>
              <div
                class={[
                  'h-9 flex items-center text-gray-200 rounded-[50px] px-2',
                  item.name === 'Advanced'
                    ? 'bg-white dark:bg-gray-800'
                    : 'bg-light-gray-100 dark:bg-gray-700',
                ]}
              >
                <Icon class="mr-2">{ziUsers}</Icon>
                <span>{item.team}</span>
              </div>
            </div>
            <div class="py-6">
              <div class="h-8">
                <span class="text-[2rem] font-semibold">{item.aPrice}</span>
                {item.aPriceInCurrency && (
                  <>
                    <span>~</span>
                    <span>{item.aPriceInCurrency}</span>
                  </>
                )}
              </div>
            </div>
            <div style="min-height: 164px">
              <div class="pb-4">
                {item.isCustomPrice ? (
                  <div v-html={t('pricing.premiumEcon')} />
                ) : (
                  <div>
                    {t('pricing.inMonth')}, &nbsp;
                    <span v-html={t('pricing.econ')} class="text-yellow-500" />
                  </div>
                )}
              </div>
              <div class="text-gray-200">{item.priceMonthly}</div>
            </div>
            <div class="pb-4">
              {item.isCustomPrice ? (
                <Dialog
                  v-model={contactDialog.value}
                  icon={ziEmail}
                  title={t('pricing.contact')}
                  v-slots={{
                    activator: () => (
                      <Btn block outlined>
                        {t('pricing.contact')}
                      </Btn>
                    ),
                  }}
                >
                  <ContactForm
                    ref={contactForm}
                    has-cancel
                    {...{
                      onSucces: closeContactDialog,
                      onCancel: closeContactDialog,
                    }}
                  />
                </Dialog>
              ) : (
                <Btn
                  to={
                    !isLoggedIn.value
                      ? { name: 'signup' }
                      : {
                          name: 'payment',
                          params: { type: PaymentType.CHANGE },
                          query: { product: item.id, interval: 'annual' },
                        }
                  }
                  block
                  outlined
                >
                  {t('pricing.select')}
                </Btn>
              )}
            </div>
            <div
              class="text-sm text-gray-200"
              style="min-height: 90px"
              v-html={item.description}
            />
            <div class="border-b border-light-gray-100 dark:border-gray-400 my-5" />
            {item.feats.map((feat) => (
              <div class="flex pb-6">
                <Icon class="text-blue-500 -ml-2 pr-2">{ziChecked}</Icon>
                <span v-html={feat} />
              </div>
            ))}
          </div>
        ))}
      </div>
    )
  },
})
