import { computed, defineComponent, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useApolloClient, useMutation } from '@vue/apollo-composable'
import { Switch, TextField, DatePicker, BtnToggle } from '@zennnn/core'
import { GET_SPEC } from '@/graphql/queries'
import { UPDATE_INVOICE } from '@/graphql/mutations'
import {
  RoleInProject,
  InvoiceProfitType,
  UpdateInvoice,
  UpdateInvoiceVariables,
  SpecCurrency,
} from '@/graphql/types'
import { DEFAULT_CURRENCY } from '@/config'
import { useRoleInProject } from '@/composables/roleInProject'
import { isDealSyncVar } from '@/plugins/apollo'

import type { PropType } from 'vue'
import type {
  GetSpec,
  GetSpecVariables,
  GetSpec_getSpec_invoices,
  UpdateInvoiceInput,
} from '@/graphql/types'
import type { EmptyNumber, EmptyString } from '@/types'

export default defineComponent({
  props: {
    currency: {
      type: String as PropType<SpecCurrency>,
      default: DEFAULT_CURRENCY,
    },
    item: {
      type: Object as PropType<GetSpec_getSpec_invoices | null>,
      default: () => ({}),
    },
  },

  setup(props) {
    const route = useRoute()

    const { t, n } = useI18n()
    const { hasAccess } = useRoleInProject({
      specId: route.params.specId as string,
    })

    const { resolveClient } = useApolloClient()
    const apolloClient = resolveClient()

    const { mutate: updateInvoiceMutate } = useMutation<
      UpdateInvoice,
      UpdateInvoiceVariables
    >(UPDATE_INVOICE)

    const internalProfitType = ref<InvoiceProfitType | null | undefined>(
      props.item?.profitType
    )

    const isOwnerOrManager = computed(() => hasAccess(RoleInProject.MANAGER))

    const isInvoiceProfitTypeMargin = computed(
      () => props.item?.profitType === InvoiceProfitType.MARGIN
    )

    const buttonGroupItems = computed(() => [
      {
        text: t('shipping.margin').toLowerCase(),
        value: InvoiceProfitType.MARGIN,
      },
      {
        text: t('shipping.commission').toLowerCase(),
        value: InvoiceProfitType.COMMISSION,
      },
    ])

    watch(
      () => props.item?.profitType,
      (val) => {
        internalProfitType.value = val
      }
    )

    async function updateInvoice(input: UpdateInvoiceInput) {
      try {
        if (props.item?.id) {
          await updateInvoiceMutate({
            id: props.item.id,
            input: input,
          })
        }
      } catch (error) {
        if (
          error.message &&
          error.message.includes('GraphQL error: MongoError: WriteConflict')
        ) {
          refetchSpec()
        } else {
          throw new Error(error)
        }
      }
    }

    async function refetchSpec() {
      try {
        isDealSyncVar(true)
        await apolloClient.query<GetSpec, GetSpecVariables>({
          query: GET_SPEC,
          variables: {
            id: route.params.specId as string,
          },
          fetchPolicy: 'network-only',
        })
      } catch (error) {
        throw new Error(error)
      } finally {
        isDealSyncVar(false)
      }
    }

    return () => (
      <div class="flex flex-wrap lg:flex-nowrap justify-between bg-gray-600 rounded-b py-2 px-3 md:px-5">
        {isOwnerOrManager.value && (
          <div class="w-full lg:max-w-xs">
            <div class="pt-2 pb-4">
              <BtnToggle
                v-model={internalProfitType.value}
                items={buttonGroupItems.value}
                {...{
                  'onUpdate:modelValue': (val: InvoiceProfitType) => {
                    updateInvoice({
                      profitType: val,
                    })
                  },
                }}
              />
            </div>
            <div class="flex items-center">
              <TextField
                modelValue={props.item?.profitPercent}
                debounce={600}
                placeholder={t('placeholder.emptyNumber')}
                solo
                number
                class="w-16 mr-2"
                onChange={(val: EmptyNumber) =>
                  updateInvoice({
                    profitPercent: val,
                  })
                }
                v-slots={{
                  append: () => (
                    <span class="text-base text-gray-100 pl-0.5 pr-2.5">%</span>
                  ),
                }}
              />
              <Switch
                modelValue={!!props.item?.profitForAll}
                onChange={(val: boolean) => {
                  updateInvoice({
                    profitForAll: val,
                  })
                }}
              >
                <span class="text-white">{t('shipping.forAll')}</span>
              </Switch>
            </div>
          </div>
        )}

        {isOwnerOrManager.value && (
          <div class="w-full lg:w-px h-px lg:h-auto bg-gray-900 lg:mx-4 my-3" />
        )}

        <div class="w-full md:w-2/5 lg:w-full lg:max-w-sm flex justify-end">
          <div
            class={[
              'flex-grow transition-opacity duration-75 ease-in-out sm:pr-4',
              { 'opacity-0': isInvoiceProfitTypeMargin.value },
            ]}
          >
            <label class="block leading-5 text-base text-gray-200 text-right whitespace-nowrap py-2 pr-2.5">
              {t('shipping.discount')}
            </label>
            {isOwnerOrManager.value ? (
              <TextField
                modelValue={props.item?.discount}
                debounce={600}
                placeholder={t('placeholder.emptyNumber')}
                solo
                number
                numberFormat="currency"
                onChange={(val: EmptyNumber) =>
                  updateInvoice({
                    discount: val,
                  })
                }
                v-slots={{
                  append: () => (
                    <span class="text-base text-gray-100 pl-0.5 pr-2.5">
                      {t(`currency.${props.currency}.symbol`)}
                    </span>
                  ),
                }}
              />
            ) : (
              <div class="h-8 flex items-center justify-end leading-none whitespace-nowrap text-white pr-2.5">
                <span class="text-white">
                  {n(props.item?.discount || 0, 'fixed')}
                </span>
                <span class="text-gray-100 pl-0.5">
                  {t(`currency.${props.currency}.symbol`)}
                </span>
              </div>
            )}
          </div>
          <div class="sm:pl-4">
            <label class="block leading-5 text-base text-gray-200 text-right whitespace-nowrap py-2 pr-2.5">
              {t('shipping.prepay')}
            </label>
            {isOwnerOrManager.value ? (
              <TextField
                modelValue={props.item?.prepayment}
                debounce={600}
                placeholder={t('placeholder.emptyNumber')}
                solo
                number
                numberFormat="currency"
                onChange={(val: EmptyNumber) =>
                  updateInvoice({
                    prepayment: val,
                  })
                }
                v-slots={{
                  append: () => (
                    <span class="text-base text-gray-100 pl-0.5 pr-2.5">
                      {t(`currency.${props.currency}.symbol`)}
                    </span>
                  ),
                }}
              />
            ) : (
              <div class="h-8 flex items-center justify-end leading-none whitespace-nowrap text-white pr-2.5">
                <span class="text-white">
                  {n(props.item?.prepayment || 0, 'fixed')}
                </span>
                <span class="text-gray-100 pl-0.5">
                  {t(`currency.${props.currency}.symbol`)}
                </span>
              </div>
            )}

            <DatePicker
              modelValue={props.item?.prepaymentDate}
              placeholder={t('placeholder.emptyDate')}
              {...{
                'onUpdate:modelValue': (val: EmptyString) => {
                  updateInvoice({ prepaymentDate: val })
                },
              }}
            />
          </div>
        </div>

        <div class="w-full md:w-px h-px md:h-auto bg-gray-900 lg:mx-4 xl:mx-12 my-3" />

        <div class="w-full md:w-auto lg:w-full lg:max-w-xs flex justify-end lg:pl-2.5">
          <div class="flex-grow sm:pr-4">
            <label class="block leading-5 text-base text-gray-200 text-right whitespace-nowrap py-2 pr-2.5">
              {t('shipping.obtainCost')}
            </label>
            <div class="h-8 flex items-center justify-end leading-none whitespace-nowrap text-white pr-2.5">
              <span class="text-white">
                {n(props.item?.obtainCost || 0, 'fixed')}
              </span>
              <span class="text-gray-100 pl-0.5">
                {t(`currency.${props.currency}.symbol`)}
              </span>
            </div>
            <DatePicker
              modelValue={props.item?.obtainCostDate}
              placeholder={t('placeholder.emptyDate')}
              {...{
                'onUpdate:modelValue': (val: EmptyString) => {
                  updateInvoice({ obtainCostDate: val })
                },
              }}
            />
          </div>
          <div class="sm:pl-4">
            <label class="block leading-5 text-base text-gray-200 text-right whitespace-nowrap py-2 pr-2.5">
              {t('shipping.clientDebt')}
            </label>
            <div class="h-8 flex items-center justify-end leading-none whitespace-nowrap text-white pr-2.5">
              <span class="text-white">
                {n(props.item?.clientDebt || 0, 'fixed')}
              </span>
              <span class="text-gray-100 pl-0.5">
                {t(`currency.${props.currency}.symbol`)}
              </span>
            </div>
            <DatePicker
              modelValue={props.item?.clientDebtDate}
              placeholder={t('placeholder.emptyDate')}
              {...{
                'onUpdate:modelValue': (val: EmptyString) => {
                  updateInvoice({ clientDebtDate: val })
                },
              }}
            />
          </div>
        </div>
      </div>
    )
  },
})
