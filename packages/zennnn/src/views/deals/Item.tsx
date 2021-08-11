import deepmerge from 'deepmerge'
import {
  defineComponent,
  computed,
  onMounted,
  Transition,
  ref,
  watch,
} from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter, RouterView } from 'vue-router'
import { useApolloClient, useQuery, useMutation } from '@vue/apollo-composable'
import {
  ziRefresh,
  ziQuestionSign,
  ziPlusOutline,
  ziChevronDown,
  ziCopy,
  ziDelete,
  ziFilter,
  ziExpand,
  ziCollapse,
} from '@zennnn/icons'
import {
  Autocomplete,
  Icon,
  Progress,
  Switch,
  Tooltip,
  Modal,
  TextArea,
  Btn,
  Checkbox,
  ExpandTransition,
} from '@zennnn/core'
import { useReactiveVar } from 'shared/composables/reactiveVar'
import { parseDate } from 'shared/utils/date'
import {
  RoleInProject,
  Operation,
  ClientType,
  ProductStatus,
} from '@/graphql/types'
import {
  SPEC_FRAGMENT,
  INVOICE_FRAGMENT,
  PRODUCT_FRAGMENT,
  SPEC_INVOICES_FRAGMENT,
  INVOICE_PRODUCTS_FRAGMENT,
  CLIENT_FRAGMENT,
} from '@/graphql/fragments'
import {
  GET_SPEC,
  LIST_ORG_REQUISITES,
  SEARCH_CLIENTS,
} from '@/graphql/queries'
import {
  UPDATE_SPEC,
  SET_SPEC_CLIENT,
  CREATE_CLIENT,
  UPDATE_INVOICE,
  CREATE_INVOICE,
} from '@/graphql/mutations'
import { SPEC_DELTA } from '@/graphql/subscriptions'
import { useRoleInProject } from '@/composables/roleInProject'
import CommentList from '@/components/comment/List'
import ClientForm from '@/components/client/Form'
import DealShipping from '@/components/deal/Shipping'
import DealCost from '@/components/deal/Cost'
import DealShipment from '@/components/deal/Shipment'
import DealCustoms from '@/components/deal/Customs'
import DealActions from '@/components/deal/Actions'
import InvoiceHeader from '@/components/deal/InvoiceHeader'
import InvoiceContent from '@/components/deal/InvoiceContent'
import {
  isDealSyncVar,
  isDealSimpleOffVar,
  setDealSimpleOff,
  getDealActiveTab,
  setDealActiveTab,
  getDealExpandedInvoices,
  setDealExpandedInvoices,
} from '@/plugins/apollo'
import { logger } from '@/plugins'
import { Typename } from '@/types'

import type {
  GetSpec,
  GetSpecVariables,
  GetSpec_getSpec,
  UpdateSpec,
  UpdateSpecVariables,
  SetSpecClient,
  SetSpecClientVariables,
  SpecInput,
  SearchClients,
  SearchClientsVariables,
  CreateClientInput,
  CreateClient,
  CreateClientVariables,
  UpdateInvoice,
  UpdateInvoiceVariables,
  UpdateInvoiceInput,
  CreateInvoice,
  CreateInvoiceVariables,
  CreateInvoiceInput,
  SpecCurrency,
} from '@/graphql/types'

export default defineComponent({
  setup() {
    const route = useRoute()
    const router = useRouter()
    const { t, d } = useI18n()

    const { resolveClient } = useApolloClient()
    const apolloClient = resolveClient()

    const { hasAccess } = useRoleInProject({
      specId: route.params.specId as string,
    })

    const isDealSync = useReactiveVar(isDealSyncVar)
    const isDealSimpleOff = useReactiveVar(isDealSimpleOffVar)

    const isBooted = ref(false)
    const expanded = ref<string[]>([])
    const invoiceActiveTab = ref(0)
    const invoiceScrollId = ref<string>()
    const invoiceScrollLeft = ref(0)
    const clientSearch = ref('')
    const createClientInput = ref<CreateClientInput>({
      clientType: ClientType.LEGAL,
    })
    const createClientDialog = ref(false)

    const {
      result: getSpecResult,
      loading: getSpecLoading,
      refetch: getSpecRefetch,
      onResult: onGetSpecResult,
    } = useQuery<GetSpec, GetSpecVariables>(
      GET_SPEC,
      () => ({
        id: route.params.specId as string,
      }),
      {
        fetchPolicy: 'cache-and-network',
      }
    )

    const { result: searchClientsResult } = useQuery<
      SearchClients,
      SearchClientsVariables
    >(
      SEARCH_CLIENTS,
      () => ({
        orgId: route.params.orgId as string,
        search: clientSearch.value,
      }),
      () => ({
        enabled: !!clientSearch.value,
        fetchPolicy: 'cache-and-network',
        debounce: 300,
      })
    )

    const { mutate: updateDealMutate } = useMutation<
      UpdateSpec,
      UpdateSpecVariables
    >(UPDATE_SPEC)

    const { mutate: setDealClientMutate } = useMutation<
      SetSpecClient,
      SetSpecClientVariables
    >(SET_SPEC_CLIENT)

    const { mutate: createClientMutate, loading: createClientLoading } =
      useMutation<CreateClient, CreateClientVariables>(CREATE_CLIENT)

    const { mutate: createInvoiceMutate } = useMutation<
      CreateInvoice,
      CreateInvoiceVariables
    >(CREATE_INVOICE, {
      fetchPolicy: 'no-cache',
    })

    const { mutate: updateInvoiceMutate } = useMutation<
      UpdateInvoice,
      UpdateInvoiceVariables
    >(UPDATE_INVOICE)

    const spec = computed(() => getSpecResult.value?.getSpec)

    const dataLoading = computed(
      () => !spec.value?.invoices && getSpecLoading.value
    )

    const isInvoiceSummaryVisible = computed(
      () =>
        isDealSimpleOff.value ||
        hasInvoiceShippingDate.value ||
        hasFilledProduct.value ||
        hasFilledProductQty.value
    )

    const isInfoVisible = computed(
      () =>
        isDealSimpleOff.value ||
        hasInvoiceShippingDate.value ||
        hasFilledProduct.value
    )

    const isCostVisible = computed(
      () => isDealSimpleOff.value || hasFilledProduct.value
    )

    const isSummaryVisible = computed(
      () =>
        isDealSimpleOff.value ||
        (hasInvoiceShippingDate.value && hasFilledProduct.value)
    )

    const hasInvoiceShippingDate = computed(() =>
      spec.value?.invoices?.some((el) => el.shippingDate)
    )

    const hasFilledProduct = computed(() =>
      spec.value?.invoices?.some((i) =>
        i.products?.some(
          (el) =>
            el.productStatus === ProductStatus.IN_PROCESSING ||
            el.productStatus === ProductStatus.IN_PRODUCTION ||
            el.productStatus === ProductStatus.IN_STOCK
        )
      )
    )

    const hasFilledProductQty = computed(() =>
      spec.value?.invoices?.some((i) => i.products?.some((el) => el.qty))
    )

    const isEmpty = computed(() => spec.value?.invoices?.length === 0)

    const specTitleText = computed(() =>
      spec.value
        ? `
          ${t('shipping.dealNo')}
          ${spec.value.specNo || '-'} ${t('preposition.from')}
          ${d(parseDate(spec.value.createdAt), 'short')}
        `
        : ''
    )

    const specTitleHtml = computed(() =>
      spec.value
        ? `
          ${t('shipping.dealNo')}
          &nbsp;${spec.value.specNo || '-'} ${t('preposition.from')}
          &nbsp;${d(parseDate(spec.value.createdAt), 'short')}
        `
        : ''
    )

    watch(
      () => spec.value?.invoices,
      (val, oldVal) => {
        const value = val || []
        const oldValue = oldVal || []
        // on invoice removed clear from expanded
        if (oldValue.length > value.length) {
          const removedIds = [] as string[]
          oldValue.forEach((v) => {
            if (!value.some((el) => el.id === v.id)) {
              removedIds.push(v.id)
            }
          })
          setDealExpandedInvoices(
            route.params.specId as string,
            expanded.value.filter((el) => !removedIds.includes(el))
          )
        }
      }
    )

    onMounted(() => {
      initInvoiceActiveTab()

      const commentsMerge = (target: any[], source: any[]) => {
        const destination = target.slice()
        source.forEach((s) => {
          const index = target.findIndex((el) => el.id === s.id)
          if (index === -1) {
            destination.push(s)
          } else {
            destination.splice(index, 1, Object.assign(target[index], s))
          }
        })
        return destination
      }

      const observer = apolloClient.subscribe({
        query: SPEC_DELTA,
        variables: {
          specId: route.params.specId,
        },
        fetchPolicy: 'no-cache',
      })

      observer.subscribe({
        next: ({ data }) => {
          const delta = data.specDelta
          const operation = delta.operation
          const typename = delta.payload.__typename

          logger.info(`[${typename}]: ${JSON.stringify(data)}`)

          // PRODUCT

          if (operation === Operation.INSERT_PRODUCT) {
            const parentInvoice = apolloClient.readFragment({
              id: `${Typename.INVOICE}:${delta.parentId}`,
              fragment: INVOICE_PRODUCTS_FRAGMENT,
              fragmentName: 'InvoiceProductsFragment',
            })

            if (
              !parentInvoice.products.some(
                (el: any) => el.id === delta.payload.id
              )
            ) {
              parentInvoice.products.push(delta.payload)

              setTimeout(() => {
                apolloClient.writeFragment({
                  id: `${Typename.INVOICE}:${delta.parentId}`,
                  fragment: INVOICE_PRODUCTS_FRAGMENT,
                  fragmentName: 'InvoiceProductsFragment',
                  data: parentInvoice,
                })
              }, 75)
            }
          }

          if (operation === Operation.UPDATE_PRODUCT) {
            const mergeOptions = {
              customMerge: (key: any) => {
                if (key === 'name') {
                  const merge = (_: any, source: any) => {
                    return source
                  }
                  return merge
                }
                if (key === 'comments') {
                  return commentsMerge
                }
                if (key === 'images') {
                  const merge = (_: any, source: any) => {
                    const images = source || []
                    return images.map((el: any) => {
                      return {
                        ...el,
                        __typename: 'AttachFile',
                      }
                    })
                  }
                  return merge
                }
              },
            }
            const cacheData = apolloClient.readFragment({
              id: `${Typename.PRODUCT}:${delta.payload.id}`,
              fragment: PRODUCT_FRAGMENT,
              fragmentName: 'ProductFragment',
            })
            const data = deepmerge(
              cacheData,
              delta.payload.fields,
              mergeOptions
            )
            apolloClient.writeFragment({
              id: `${Typename.PRODUCT}:${delta.payload.id}`,
              fragment: PRODUCT_FRAGMENT,
              fragmentName: 'ProductFragment',
              data,
            })
          }

          if (operation === Operation.DELETE_PRODUCT) {
            const parentInvoice = apolloClient.readFragment({
              id: `${Typename.INVOICE}:${delta.parentId}`,
              fragment: INVOICE_PRODUCTS_FRAGMENT,
              fragmentName: 'InvoiceProductsFragment',
            })

            const index = parentInvoice.products.findIndex(
              (p: any) => p.id === delta.payload.id
            )

            if (index !== -1) {
              parentInvoice.products.splice(index, 1)
              apolloClient.writeFragment({
                id: `${Typename.INVOICE}:${delta.parentId}`,
                fragment: INVOICE_PRODUCTS_FRAGMENT,
                fragmentName: 'InvoiceProductsFragment',
                data: parentInvoice,
              })
            }
          }

          // INVOICE

          if (operation === Operation.INSERT_INVOICE) {
            const parentSpec = apolloClient.readFragment({
              id: `${Typename.SPEC}:${delta.parentId}`,
              fragment: SPEC_INVOICES_FRAGMENT,
              fragmentName: 'SpecInvoicesFragment',
            })

            if (
              !parentSpec.invoices.some((el: any) => el.id === delta.payload.id)
            ) {
              if (parentSpec.invoices.length === 0) {
                expanded.value = [delta.payload.id]
                setDealExpandedInvoices(route.params.specId as string, [
                  delta.payload.id,
                ])
              }

              parentSpec.invoices.push(delta.payload)

              apolloClient.writeFragment({
                id: `${Typename.SPEC}:${delta.parentId}`,
                fragment: SPEC_INVOICES_FRAGMENT,
                fragmentName: 'SpecInvoicesFragment',
                data: parentSpec,
              })
            }
          }

          if (operation === Operation.UPDATE_INVOICE) {
            const cacheData = apolloClient.readFragment({
              id: `${Typename.INVOICE}:${delta.payload.id}`,
              fragment: INVOICE_FRAGMENT,
              fragmentName: 'InvoiceFragment',
            })
            const data =
              delta.payload.__typename === Typename.INVOICE
                ? Object.assign({}, cacheData, delta.payload)
                : Object.assign({}, cacheData, delta.payload.fields)
            apolloClient.writeFragment({
              id: `${Typename.INVOICE}:${delta.payload.id}`,
              fragment: INVOICE_FRAGMENT,
              fragmentName: 'InvoiceFragment',
              data,
            })
          }

          if (operation === Operation.DELETE_INVOICE) {
            const parentSpec = apolloClient.readFragment({
              id: `${Typename.SPEC}:${delta.parentId}`,
              fragment: SPEC_INVOICES_FRAGMENT,
              fragmentName: 'SpecInvoicesFragment',
            })

            const index = parentSpec.invoices.findIndex(
              (p: any) => p.id === delta.payload.id
            )

            if (index !== -1) {
              parentSpec.invoices.splice(index, 1)
              apolloClient.writeFragment({
                id: `${Typename.SPEC}:${delta.parentId}`,
                fragment: SPEC_INVOICES_FRAGMENT,
                fragmentName: 'SpecInvoicesFragment',
                data: parentSpec,
              })
            }
          }

          // SPEC

          if (operation === Operation.UPDATE_SPEC) {
            const mergeOptions = {
              customMerge: (key: any) => {
                if (key === 'comments') {
                  return commentsMerge
                }
                if (key === 'containers') {
                  const merge = (_: any, source: any) => {
                    return source || []
                  }
                  return merge
                }
              },
            }
            const cacheData = apolloClient.readFragment({
              id: `${Typename.SPEC}:${delta.payload.id}`,
              fragment: SPEC_FRAGMENT,
              fragmentName: 'SpecFragment',
            })
            const data =
              delta.payload.__typename === Typename.SPEC
                ? deepmerge(cacheData, delta.payload, mergeOptions)
                : deepmerge(cacheData, delta.payload.fields, mergeOptions)
            apolloClient.writeFragment({
              id: `${Typename.SPEC}:${delta.payload.id}`,
              fragment: SPEC_FRAGMENT,
              fragmentName: 'SpecFragment',
              data,
            })
          }

          // CLIENT

          if (operation === Operation.UPDATE_CLIENT) {
            const cacheData = apolloClient.readFragment({
              id: `${Typename.CLIENT}:${delta.payload.id}`,
              fragment: CLIENT_FRAGMENT,
              fragmentName: 'ClientFragment',
            })
            const data = deepmerge(cacheData, delta.payload)
            apolloClient.writeFragment({
              id: `${Typename.CLIENT}:${delta.payload.id}`,
              fragment: CLIENT_FRAGMENT,
              fragmentName: 'ClientFragment',
              data,
            })
          }

          // REQUISITE

          if (
            operation === Operation.SET_REQUISITES ||
            Operation.UPDATE_REQUISITES
          ) {
            let listOrgRequisites = null
            try {
              const data = apolloClient.readQuery({
                query: LIST_ORG_REQUISITES,
                variables: {
                  orgId: route.params.orgId,
                },
              })
              listOrgRequisites = data.listOrgRequisites
            } catch (error) {} // eslint-disable-line
            if (listOrgRequisites) {
              const items = delta.payload.items || []
              let cacheItems = listOrgRequisites
              if (operation === Operation.SET_REQUISITES) {
                cacheItems = items
              }
              if (operation === Operation.UPDATE_REQUISITES) {
                items.forEach((item: any) => {
                  const index = cacheItems.findIndex(
                    (el: any) => el.id === item.id
                  )
                  if (index === -1) {
                    cacheItems.push(item)
                  } else {
                    cacheItems.splice(index, 1, item)
                  }
                })
              }
              const data = {
                listOrgRequisites: cacheItems,
              }
              apolloClient.writeQuery({
                query: LIST_ORG_REQUISITES,
                variables: {
                  orgId: route.params.orgId,
                },
                data,
              })
            }
          }
        },
        error: (error) => {
          logger.warn('Error: ', error)
        },
      })
    })

    onGetSpecResult(({ data, loading }) => {
      if (!loading && !isBooted.value) {
        updateExpanded(data?.getSpec)
      }
    })

    const updateExpanded = async (spec: GetSpec_getSpec | null) => {
      const specId = spec && spec.id
      if (!specId || isBooted.value) return
      isBooted.value = true
      const _expanded = await getDealExpandedInvoices(specId)
      if (!_expanded) {
        const [invoice] = spec!.invoices || []
        if (invoice && invoice.id) {
          expanded.value = [invoice.id]
          await setDealExpandedInvoices(specId, [invoice.id])
        }
      } else {
        expanded.value = _expanded || []
      }
    }

    async function updateDeal(input: SpecInput) {
      try {
        await updateDealMutate({
          id: route.params.specId as string,
          input: input,
        })
      } catch (error) {
        if (
          error.message &&
          error.message.includes('GraphQL error: MongoError: WriteConflict')
        ) {
          getSpecRefetch()
          logger.debug('[UpdateSpec]: ', error)
        }
      }
    }

    async function createInvoice(input?: CreateInvoiceInput) {
      try {
        const response = await createInvoiceMutate({
          specId: route.params.specId as string,
          input: input,
        })
        const id = response?.data?.createInvoice?.id
        if (id) {
          expanded.value.push(id)
          setDealExpandedInvoices(route.params.specId as string, [
            ...expanded.value,
            id,
          ])
        }
      } catch (error) {
        logger.debug('[CreateInvoice]: ', error)
      }
    }

    async function updateInvoice(input: UpdateInvoiceInput, id: string) {
      try {
        await updateInvoiceMutate({
          id: id,
          input: input,
        })
      } catch (error) {
        if (
          error.message &&
          error.message.includes('GraphQL error: MongoError: WriteConflict')
        ) {
          getSpecRefetch()
          logger.debug('[UpdateInvoice]: ', error)
        }
      }
    }

    function setScrollLeft(scrollLeft: number, invoiceId: string) {
      invoiceScrollId.value = invoiceId
      invoiceScrollLeft.value = scrollLeft
    }

    async function initInvoiceActiveTab() {
      const tab = await getDealActiveTab(route.params.specId as string)
      invoiceActiveTab.value = tab || 1
    }

    function setInvoiceActiveTab(value: number) {
      invoiceActiveTab.value = value
      setDealActiveTab(route.params.specId as string, value)
    }

    function expand(id: string) {
      if (expanded.value.includes(id)) {
        const index = expanded.value.indexOf(id)
        expanded.value.splice(index, 1)
      } else {
        expanded.value.push(id)
      }
      setDealExpandedInvoices(
        route.params.specId as string,
        expanded.value.slice()
      )
    }

    function collapseAll() {
      expanded.value = []
      setDealExpandedInvoices(route.params.specId as string, [])
    }

    function expandAll() {
      const ids = spec.value?.invoices?.reduce(
        (acc, curr) => [...acc, curr.id],
        [] as string[]
      )
      if (ids) {
        expanded.value = ids
        setDealExpandedInvoices(route.params.specId as string, ids)
      }
    }

    return () => (
      <div class="container">
        {isDealSync.value && (
          <div class="fixed bottom-0 right-0 z-20 opacity-50 text-2xl mr-2 sm:mr-4 mb-6">
            <Icon class="animate-spin">{ziRefresh}</Icon>
          </div>
        )}

        <div class="py-10">
          <div class="flex flex-wrap items-center justify-between pb-4">
            <h1 class="text-2xl text-white font-semibold relative">
              <span class="pr-6">{t('shipping.title')}</span>
              <Transition name="fade-transition">
                {getSpecLoading.value && (
                  <div class="absolute top-0 right-0 text-gray-200">
                    <Progress indeterminate size="20" width="2" />
                  </div>
                )}
              </Transition>
            </h1>
            <div class="flex items-center text-white">
              <Switch
                modelValue={!isDealSimpleOff.value}
                class="inline-flex"
                {...{
                  onChange: (val: boolean) => {
                    setDealSimpleOff(!val)
                  },
                }}
              >
                <span class="mx-2">{t('shipping.simpleInterface')}</span>
              </Switch>
              <Tooltip
                placement="top-start"
                distance="2"
                skidding="-16"
                origin="24px 100%"
                maxWidth="320"
                v-slots={{
                  activator: () => (
                    <Icon class="text-blue-500 align-middle">
                      {ziQuestionSign}
                    </Icon>
                  ),
                }}
              >
                <span>{t('shipping.simpleInterfaceHint')}</span>
              </Tooltip>
            </div>
            <div class="flex items-center text-gray-300">
              {spec.value?.client ? (
                <>
                  <CommentList
                    items={spec.value?.comments || []}
                    specId={route.params.specId as string}
                    placement="left-start"
                    class="text-gray-300 focus:text-gray-100 hover:text-gray-100 transition-colors duration-100 ease-out mr-4"
                  />
                  <span>
                    {`${t('shipping.shippingClient')}: ${
                      spec.value.client.uid
                    } ${spec.value.client.fullName}`}
                  </span>
                </>
              ) : (
                <Autocomplete
                  v-model={[clientSearch.value, 'search']}
                  modelValue={spec.value?.client}
                  placeholder={t('shipping.shippingClientAdd')}
                  items={searchClientsResult.value?.searchClients?.items || []}
                  showArrow={false}
                  noFilter
                  itemValue="id"
                  itemText="fullName"
                  solo
                  class="inline-flex justify-end ml-2"
                  onSelect={(val: string) => {
                    setDealClientMutate({
                      specId: route.params.specId as string,
                      clientId: val,
                    })
                  }}
                  v-slots={{
                    prependItem: () => (
                      <span
                        class="flex items-center jusitfy-center text-blue-500"
                        onClick={() => {
                          createClientDialog.value = true
                        }}
                      >
                        <Icon class="mr-1">{ziPlusOutline}</Icon>
                        <span>{t('deals.createSpecDialogAddClient')}</span>
                      </span>
                    ),
                  }}
                />
              )}
            </div>
          </div>

          <div class="bg-gray-800 bg-opacity-90 rounded-md px-2.5 pb-2.5">
            <div class="h-12 flex items-center">
              <div class="flex items-center pl-5 sm:pr-2.5">
                <Checkbox disabled class="pt-0.5">
                  <button
                    disabled
                    class="flex text-blue-500 focus:outline-none cursor-not-allowed"
                  >
                    <Icon>{ziChevronDown}</Icon>
                  </button>
                </Checkbox>
              </div>
              <button
                disabled
                class="opacity-40 flex items-center text-gray-200 focus:outline-none select-none cursor-not-allowed px-1 sm:px-2.5"
              >
                <Icon>{ziCopy}</Icon>
              </button>
              <button
                disabled
                class="opacity-40 flex items-center text-gray-200 focus:outline-none select-none cursor-not-allowed px-1 sm:px-2.5"
              >
                <Icon>{ziDelete}</Icon>
              </button>
              <div class="w-px h-5 bg-gray-400 mx-2.5" />
              <button
                disabled
                class="opacity-40 flex items-center text-gray-200 focus:outline-none select-none cursor-not-allowed px-2.5"
              >
                <Icon>{ziFilter}</Icon>
              </button>
              <div class="flex-grow" />
              <div class="flex text-gray-200 text-lg overflow-hidden">
                <span
                  v-html={specTitleHtml.value}
                  title={specTitleText.value}
                  class="truncate"
                />
                <div class="inline-block text-2xl pl-2.5 pr-3 md:pr-3.5">
                  {expanded.value.length === 0 ? (
                    <button
                      disabled={dataLoading.value}
                      class="flex items-center text-gray-200 hover:text-gray-100 focus:text-gray-100 focus:outline-none select-none"
                      onClick={expandAll}
                      title={t('action.expandAll')}
                    >
                      <Icon>{ziExpand}</Icon>
                    </button>
                  ) : (
                    <button
                      disabled={dataLoading.value}
                      class="flex items-center text-gray-200 hover:text-gray-100 focus:text-gray-100 focus:outline-none select-none"
                      onClick={collapseAll}
                      title={t('action.collapseAll')}
                    >
                      <Icon>{ziCollapse}</Icon>
                    </button>
                  )}
                </div>
              </div>
            </div>
            {dataLoading.value ? (
              <div class="flex items-center justify-center h-12 text-gray-200 bg-gray-700 rounded">
                {`${t('action.loading')}...`}
              </div>
            ) : (
              <>
                {spec.value?.invoices?.map((item, i) => (
                  <div key={i} class="shadow-lg mb-1">
                    <InvoiceHeader
                      item={item}
                      isExpanded={expanded.value.includes(item.id)}
                      {...{
                        onUpdate: updateInvoice,
                        onClick: expand,
                      }}
                    />
                    <ExpandTransition>
                      {expanded.value.includes(item.id) && (
                        <InvoiceContent
                          currency={spec.value?.currency || undefined}
                          item={item}
                          activeTab={invoiceActiveTab.value}
                          scrollLeft={invoiceScrollLeft.value}
                          scrollInvoiceId={invoiceScrollId.value}
                          hideFooter={!isInvoiceSummaryVisible.value}
                          {...{
                            'onChange:tab': setInvoiceActiveTab,
                            'onChange:scrollLeft': setScrollLeft,
                            'onUpdate:currency': (val: SpecCurrency) =>
                              updateDeal({ currency: val }),
                          }}
                        />
                      )}
                    </ExpandTransition>
                  </div>
                ))}
                {hasAccess(RoleInProject.MANAGER) && (
                  <div class="shadow-xl">
                    <InvoiceHeader
                      class={{ 'mt-1': !isEmpty.value }}
                      isEmpty={isEmpty.value}
                      create
                      {...{
                        onUpdate: createInvoice,
                      }}
                    />
                    <ExpandTransition>
                      {isEmpty.value && (
                        <InvoiceContent
                          currency={spec.value?.currency || undefined}
                          activeTab={invoiceActiveTab.value}
                          scrollLeft={invoiceScrollLeft.value}
                          scrollInvoiceId={invoiceScrollId.value}
                          hideFooter={!isInvoiceSummaryVisible.value}
                          create
                          {...{
                            'onChange:tab': setInvoiceActiveTab,
                            'onChange:scrollLeft': setScrollLeft,
                            'onUpdate:currency': (val: SpecCurrency) =>
                              updateDeal({ currency: val }),
                          }}
                        />
                      )}
                    </ExpandTransition>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div class="flex flex-wrap lg:flex-nowrap pb-8">
          <div class="w-full lg:max-w-[746px] flex-grow lg:w-auto pb-8 lg:pb-0 lg:pr-3">
            <Transition
              name="slide-y-transition"
              onLeave={(el) => {
                ;(el as HTMLElement).style.display = 'none'
              }}
            >
              {hasAccess(RoleInProject.MANAGER, RoleInProject.WAREHOUSEMAN) &&
                isInfoVisible.value && (
                  <DealShipping
                    estimateShippingDate={spec.value?.estimateShippingDate}
                    totalVolume={spec.value?.totalVolume}
                    qtyOfPackages={spec.value?.qtyOfPackages}
                    totalWeight={spec.value?.totalWeight}
                    // TODO: remove any after typing fix
                    containers={spec.value?.containers as any}
                    shipped={!!spec.value?.shipped}
                    hideContainers={!isCostVisible.value}
                    actions={hasAccess(RoleInProject.MANAGER)}
                    specId={route.params.specId as string}
                    {...{
                      onUpdate: updateDeal,
                    }}
                  />
                )}
            </Transition>
          </div>
          <div class="w-full flex-shrink-0 text-base lg:max-w-sm lg:pl-3">
            <Transition
              name="slide-y-transition"
              onLeave={(el) => {
                ;(el as HTMLElement).style.display = 'none'
              }}
            >
              {hasAccess(RoleInProject.MANAGER, RoleInProject.ACCOUNTANT) &&
                isCostVisible.value && (
                  <DealCost
                    finalCost={spec.value?.finalCost}
                    finalObtainCost={spec.value?.finalObtainCost}
                    profit={spec.value?.profit}
                    totalPrepay={spec.value?.totalPrepay}
                    totalClientDebt={spec.value?.totalClientDebt}
                    currency={spec.value?.currency}
                    currencyRate={spec.value?.currencyRate}
                    specId={route.params.specId as string}
                    {...{
                      onUpdate: updateDeal,
                    }}
                  />
                )}
            </Transition>
          </div>
        </div>

        <Transition
          name="slide-y-transition"
          onLeave={(el) => {
            ;(el as HTMLElement).style.display = 'none'
          }}
        >
          {hasAccess(RoleInProject.MANAGER) && isSummaryVisible.value && (
            <div class="pb-8">
              <h4 class="text-white text-xl font-semibold leading-6 mb-4">
                <span class="mr-1">{t('shipping.extraTitle')}</span>
                <Tooltip
                  placement="top-start"
                  distance="2"
                  skidding="-16"
                  origin="24px 100%"
                  maxWidth="240"
                  v-slots={{
                    activator: () => (
                      <Icon class="text-blue-500 align-middle">
                        {ziQuestionSign}
                      </Icon>
                    ),
                  }}
                >
                  <span>{t('shipping.extraHint')}</span>
                </Tooltip>
              </h4>
              <div class="flex">
                <div class="w-full flex-grow lg:w-auto lg:pr-3">
                  <div class="rounded-md bg-gray-700 pt-2 px-2.5 pb-5">
                    {/* TODO: add note to spec model */}
                    <TextArea placeholder={t('shipping.extraPlaceholder')} />
                  </div>
                </div>
                <div class="hidden lg:block w-full flex-shrink-0 text-base lg:max-w-sm lg:pl-3" />
              </div>
            </div>
          )}
        </Transition>

        <Transition
          name="slide-y-transition"
          onLeave={(el) => {
            ;(el as HTMLElement).style.display = 'none'
          }}
        >
          {hasAccess(RoleInProject.MANAGER) && isSummaryVisible.value && (
            <div>
              <div class="flex flex-wrap lg:flex-nowrap pb-8">
                <DealShipment
                  item={spec.value?.shipment}
                  {...{
                    onUpdate: updateDeal,
                  }}
                />
                <DealCustoms
                  shipmentType={spec.value?.shipment?.activeType}
                  item={spec.value?.customs}
                  amount={spec.value?.total}
                  amountInWords={spec.value?.amountInWords}
                  amountInWordsClientLang={spec.value?.amountInWordsClientLang}
                  {...{
                    onUpdate: updateDeal,
                  }}
                />
              </div>

              <DealActions
                {...{
                  onDocument: () => {
                    //
                  },
                  onPrint: () => {
                    router.push({
                      name: 'deal-print',
                      params: {
                        orgId: route.params.orgId,
                        specId: route.params.specId,
                      },
                    })
                  },
                  onShare: () => {
                    router.push({
                      name: 'deal-share',
                      params: {
                        orgId: route.params.orgId,
                        specId: route.params.specId,
                      },
                    })
                  },
                }}
              />
            </div>
          )}
        </Transition>

        <RouterView />

        <Modal v-model={createClientDialog.value} maxWidth={1110}>
          <ClientForm
            orgId={route.params.orgId as string}
            create
            {...{
              onUpdate: (input: CreateClientInput) => {
                createClientInput.value = Object.assign(
                  {},
                  createClientInput.value,
                  input
                )
              },
              'onUpdate:clientType': (val: ClientType) => {
                createClientInput.value.clientType = val
              },
            }}
            v-slots={{
              actions: () => (
                <Btn
                  loading={createClientLoading.value}
                  outlined
                  class="w-40"
                  onClick={async () => {
                    const response = await createClientMutate({
                      orgId: route.params.orgId as string,
                      input: createClientInput.value,
                    })
                    // TODO: handle errors and no specId
                    if (response?.data?.createClient) {
                      await setDealClientMutate({
                        specId: route.params.specId as string,
                        clientId: response.data?.createClient.id,
                      })
                      createClientDialog.value = false
                    }
                  }}
                >
                  {t('client.save')}
                </Btn>
              ),
            }}
          />
        </Modal>
      </div>
    )
  },
})
