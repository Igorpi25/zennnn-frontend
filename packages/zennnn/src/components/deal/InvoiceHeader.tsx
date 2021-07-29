import { computed, defineComponent, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useMutation, useQuery } from '@vue/apollo-composable'
import { ziCalendar, ziPlusOutline, ziChevronRight } from '@zennnn/icons'
import {
  Btn,
  Icon,
  Modal,
  Checkbox,
  TextField,
  DatePicker,
  Autocomplete,
} from '@zennnn/core'
import { parseDate } from 'shared/utils/date'
import { useDisplay } from 'shared/composables/display'
import { InvoiceStatus, RoleInProject } from '@/graphql/types'
import { SEARCH_SUPPLIERS } from '@/graphql/queries'
import { SET_INVOICE_SUPPLIER, CREATE_INVOICE } from '@/graphql/mutations'
import SupplierForm from '@/components/supplier/Form'
import { useRoleInProject } from '@/composables/roleInProject'

import type { PropType } from 'vue'
import type {
  SearchSuppliers,
  SearchSuppliersVariables,
  SetInvoiceSupplier,
  SetInvoiceSupplierVariables,
  GetSpec_getSpec_invoices,
  CreateSupplierInput,
  CreateSupplier,
  CreateSupplierVariables,
  UpdateInvoiceInput,
} from '@/graphql/types'
import type { EmptyString } from '@/types'

export default defineComponent({
  props: {
    item: {
      type: Object as PropType<GetSpec_getSpec_invoices | null>,
      default: () => ({}),
    },
    isExpanded: Boolean,
    create: Boolean,
    isEmpty: Boolean,
  },

  emits: ['update', 'click'],

  setup(props, { emit }) {
    const route = useRoute()
    const { t, d } = useI18n()
    const { hasAccess } = useRoleInProject({
      specId: route.params.specId as string,
    })
    const { mobile } = useDisplay()

    const rootRef = ref()
    const supplierSearch = ref('')
    const createSupplierDialog = ref(false)
    const createSupplierInput = ref<CreateSupplierInput>({})

    const { result: searchSuppliersResult, refetch: searchSuppliersRefetch } =
      useQuery<SearchSuppliers, SearchSuppliersVariables>(
        SEARCH_SUPPLIERS,
        () => ({
          orgId: route.params.orgId as string,
          search: supplierSearch.value,
        }),
        () => ({
          enabled: !!supplierSearch.value,
          fetchPolicy: 'cache-and-network',
          debounce: 300,
        })
      )

    const { mutate: setInvoiceSupplierMutate } = useMutation<
      SetInvoiceSupplier,
      SetInvoiceSupplierVariables
    >(SET_INVOICE_SUPPLIER)

    const { mutate: createSupplierMutate, loading: createSupplierLoading } =
      useMutation<CreateSupplier, CreateSupplierVariables>(CREATE_INVOICE)

    const isOwnerOrManager = computed(() => hasAccess(RoleInProject.MANAGER))

    const hasNewComments = computed(() => {
      if (!isOwnerOrManager.value && props.create && props.isEmpty) return false

      return props.item?.products?.some((item) =>
        item.comments?.some((c) => !c?.viewed)
      )
    })

    const invoiceStatusColor = computed(() => {
      const status = props.item?.invoiceStatus
      return status === InvoiceStatus.IN_STOCK
        ? 'bg-green-500'
        : status === InvoiceStatus.IN_PRODUCTION
        ? 'bg-yellow-500'
        : status === InvoiceStatus.IN_PROCESSING
        ? 'bg-pink-500'
        : 'bg-gray-800'
    })

    watch(createSupplierDialog, (val) => {
      if (val) {
        createSupplierInput.value = {}
      }
    })

    function setSupplier(supplierId: string) {
      if (props.create || props.isEmpty) {
        emit('update', { supplier: supplierId })
      } else if (props.item?.id) {
        setInvoiceSupplierMutate({
          invoiceId: props.item.id,
          supplierId: supplierId,
        })
      }
    }

    function updateInvoice(input: UpdateInvoiceInput) {
      if (props.item?.id) {
        emit('update', input, props.item.id)
      }
    }

    return () => (
      <div
        ref={rootRef}
        class={[
          'md:h-12 relative flex items-center mx-auto w-full select-none py-2 md:py-0 px-3 md:pl-5 md:pr-3.5',
          'rounded-t text-right',
          { 'rounded-b': !props.isExpanded },
          props.create && !props.isEmpty ? 'bg-gray-700' : 'bg-gray-500',
        ]}
      >
        {isOwnerOrManager.value && (
          <Checkbox disabled class="bg-gray-800 border-gray-800 mr-3 md:mr-5" />
        )}

        <div
          class={[
            'flex-shrink-0 w-3 h-3 rounded-full mr-3 md:mr-5',
            invoiceStatusColor.value,
          ]}
        />
        {isOwnerOrManager.value ? (
          <div class="flex flex-wrap md:flex-nowrap lg:flex-grow w-full md:w-auto">
            <TextField
              modelValue={props.item?.invoiceNo}
              debounce={250}
              placeholder={t('shipping.invoiceNo')}
              lazy={props.create}
              solo
              class="w-full sm:w-auto lg:w-32 lg:flex-shrink-0 sm:flex-grow md:flex-grow-0 mb-2 md:mb-0 mr-2"
              {...{
                'onUpdate:modelValue': (val: EmptyString) => {
                  updateInvoice({ invoiceNo: val })
                },
              }}
              // TODO: add icon to missed
              v-slots={{
                prepend: () => (
                  <svg
                    class="mr-2"
                    width="18"
                    height="14"
                    viewBox="0 0 18 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14.4974 1.06834C12.5574 1.06834 11.1174 2.38834 11.1174 4.60834C11.1174 6.80834 12.5574 8.04834 14.4574 8.04834C16.2174 8.04834 17.8174 7.00834 17.8174 4.50834C17.8174 2.46834 16.5574 1.06834 14.4974 1.06834ZM14.4574 2.34834C15.4574 2.34834 15.8774 3.48834 15.8774 4.56834C15.8774 5.84834 15.3774 6.78834 14.4774 6.78834C13.6774 6.78834 13.0574 5.84834 13.0574 4.60834C13.0574 3.54834 13.4974 2.34834 14.4574 2.34834ZM17.2774 10.1683V8.88834H11.6774V10.1683H17.2774ZM2.99736 13.7683V9.28834C2.99736 7.04834 2.95736 5.34834 2.87736 3.68834H2.93736C3.49736 5.14834 4.15736 6.72834 4.81736 8.12834L7.59736 13.7683H10.0774V0.76834H7.93736V5.16834C7.93736 7.22834 7.99736 8.90834 8.13736 10.6283L8.11736 10.6483C7.57736 9.26834 6.91736 7.70834 6.23736 6.28834L3.53736 0.76834H0.857356V13.7683H2.99736Z"
                      fill="#585858"
                    />
                  </svg>
                ),
              }}
            />
            <DatePicker
              modelValue={props.item?.purchaseDate}
              {...{
                'onUpdate:modelValue': (val: EmptyString) => {
                  updateInvoice({ purchaseDate: val })
                },
              }}
              v-slots={{
                activator: () => (
                  <div class="text-left">
                    <div>
                      <TextField
                        modelValue={
                          props.item?.purchaseDate
                            ? d(parseDate(props.item.purchaseDate), 'short')
                            : undefined
                        }
                        placeholder={t('shipping.purchaseDate')}
                        solo
                        readonly
                        class="w-full sm:w-36 mb-2 md:mb-0 mr-2"
                        v-slots={{
                          prepend: () => (
                            <Icon class="text-gray-300 mr-2">{ziCalendar}</Icon>
                          ),
                        }}
                      />
                    </div>
                  </div>
                ),
              }}
            />
            {/* <!-- TODO on real api, need send id --> */}
            <Autocomplete
              modelValue={props.item?.supplier?.id}
              placeholder={t('shipping.supplierName')}
              v-model={[supplierSearch.value, 'search']}
              items={searchSuppliersResult.value?.searchSuppliers?.items || []}
              showArrow={false}
              solo
              noFilter
              itemValue="id"
              itemText="companyName"
              class="w-full sm:w-auto xl:w-full lg:flex-shrink-0 sm:flex-grow md:flex-grow-0 lg:flex-grow xl:flex-grow-0 max-w-sm mb-2 md:mb-0 mr-2"
              {...{
                'onUpdate:modelValue': (val: string) => {
                  setSupplier(val)
                },
              }}
              v-slots={{
                prepend: () => (
                  <Btn
                    icon
                    mini
                    text
                    class="text-gray-300 mr-2"
                    {...{
                      onClick: () => {
                        createSupplierDialog.value = true
                      },
                    }}
                  >
                    <Icon>{ziPlusOutline}</Icon>
                  </Btn>
                ),
              }}
            />
            <DatePicker
              modelValue={props.item?.shippingDate}
              {...{
                'onUpdate:modelValue': (val: EmptyString) => {
                  updateInvoice({ shippingDate: val })
                },
              }}
              v-slots={{
                activator: () => (
                  <div class="text-left">
                    <div>
                      <TextField
                        modelValue={
                          props.item?.shippingDate
                            ? d(parseDate(props.item.shippingDate), 'short')
                            : undefined
                        }
                        placeholder={t('shipping.shippingDate')}
                        solo
                        readonly
                        class="lg:flex-shrink-0 w-full sm:w-36 mr-2"
                        v-slots={{
                          prepend: () => (
                            <Icon class="text-gray-300 mr-2">{ziCalendar}</Icon>
                          ),
                        }}
                      />
                    </div>
                  </div>
                ),
              }}
            />
          </div>
        ) : (
          <div class="text-gray-100">
            <span class="mr-1">{props.item?.invoiceNo || '-'}</span>
            <span class="mr-1">{t('preposition.from')}</span>&nbsp;
            <span class="mr-1">
              {props.item?.purchaseDate
                ? d(parseDate(props.item.purchaseDate), 'short')
                : '-'}
            </span>
            &nbsp;
            {props.item?.supplier ? (
              <span>
                <span> / </span>
                {props.item?.supplier?.companyName || ''}
              </span>
            ) : undefined}
          </div>
        )}
        <div class="flex-grow" />

        {hasNewComments.value && (
          <div class="px-2 lg:pl-4 lg:pr-6">
            <div class="w-2 h-2 rounded-full bg-purple-500" />
          </div>
        )}

        {!props.create ? (
          <Btn
            icon
            mini
            text
            {...{
              onClick: () => emit('click', props.item?.id),
            }}
          >
            <Icon
              // @ts-ignore
              title={
                props.isExpanded ? t('action.collapse') : t('action.expand')
              }
              class={[
                'transition-transform',
                { 'transform rotate-90': props.isExpanded },
              ]}
            >
              {ziChevronRight}
            </Icon>
          </Btn>
        ) : (
          <div class="w-6 h-6" />
        )}

        {isOwnerOrManager.value && (
          <Modal
            v-model={createSupplierDialog.value}
            fullscreen={mobile.value}
            maxWidth={1110}
            contentClass="bg-white dark:bg-gray-900 pt-8 pb-12 px-4 sm:px-5"
          >
            <SupplierForm
              orgId={route.params.orgId as string}
              create
              {...{
                onUpdate: (input: CreateSupplierInput) => {
                  createSupplierInput.value = Object.assign(
                    {},
                    createSupplierInput.value,
                    input
                  )
                },
              }}
              v-slots={{
                actions: () => (
                  <Btn
                    loading={createSupplierLoading.value}
                    outlined
                    class="w-40"
                    {...{
                      onClick: async () => {
                        const response = await createSupplierMutate({
                          orgId: route.params.orgId as string,
                          input: createSupplierInput.value,
                        })
                        if (response.data?.createSupplier) {
                          setSupplier(response.data.createSupplier.id)
                          createSupplierDialog.value = false
                          createSupplierInput.value = {}
                          searchSuppliersRefetch()
                        }
                      },
                    }}
                  >
                    {t('action.create')}
                  </Btn>
                ),
              }}
            />
          </Modal>
        )}
      </div>
    )
  },
})
