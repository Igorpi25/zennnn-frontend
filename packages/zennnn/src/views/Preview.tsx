import deepmerge from 'deepmerge'
import { defineComponent, ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useApolloClient, useQuery } from '@vue/apollo-composable'
import {
  ziUserPlus,
  ziPrint,
  ziExpand,
  ziCollapse,
  ziChevronRight,
  ziCalendar,
  ziVolume,
  ziBoxes,
  ziPlus,
  ziComment,
} from '@zennnn/icons'
import { Btn, Icon } from '@zennnn/core'
import { useNotify } from 'shared/composables/notify'
import { useDisplay } from 'shared/composables/display'
import { parseDate } from 'shared/utils/date'
import { PREVIEW_STORE_KEY_PREFIX, DEFAULT_CURRENCY } from '@/config'
import {
  Operation,
  InvoiceStatus,
  SpecCurrency,
  ContainerSize,
} from '@/graphql/types'
import { GET_PAPER_SPEC } from '@/graphql/queries'
import { PAPER_SPEC_DELTA } from '@/graphql/subscriptions'
import {
  PAPER_SPEC_FRAGMENT,
  PAPER_INVOICE_FRAGMENT,
  PAPER_PRODUCT_FRAGMENT,
  PAPER_SPEC_INVOICES_FRAGMENT,
  PAPER_INVOICE_PRODUCTS_FRAGMENT,
} from '@/graphql/fragments'
import {
  getDealExpandedInvoices,
  setDealExpandedInvoices,
} from '@/plugins/apollo'
import printInvoice from '@/components/print/printInvoice'
import ZAppBar from '@/components/core/ZAppBar'
import Copyright from '@/components/core/Copyright'
import CommentList from '@/components/comment/List'
import PreviewInvoice from '@/components/deal/PreviewInvoice'
import { logger } from '@/plugins'
import { Typename } from '@/types'

import type {
  GetPaperSpec,
  GetPaperSpec_getPaperSpec,
  GetPaperSpec_getPaperSpec_containers,
  GetPaperSpecVariables,
} from '@/graphql/types'

export default defineComponent({
  setup() {
    const { t, d, n } = useI18n()
    const route = useRoute()
    const notify = useNotify()
    const { lgAndUp } = useDisplay()

    const isBooted = ref(false)
    const expanded = ref<string[]>([])
    const printLoading = ref(false)
    const downloadLoading = ref(false)
    const invoiceScrollId = ref<string>()
    const invoiceScrollLeft = ref(0)

    const { resolveClient } = useApolloClient()
    const apolloClient = resolveClient()

    const { result: getPaperSpecResult, onResult: onGetPaperSpecResult } =
      useQuery<GetPaperSpec, GetPaperSpecVariables>(GET_PAPER_SPEC, () => ({
        id: route.params.specId as string,
      }))

    const hasNewComments = computed(() =>
      spec.value?.comments?.some((item) => !item?.clientViewed)
    )

    const spec = computed(() => getPaperSpecResult.value?.getPaperSpec)

    const currency = computed(() => spec.value?.currency || DEFAULT_CURRENCY)

    const items = computed(() => spec.value?.invoices || [])

    const containers = computed(
      () =>
        (spec.value?.containers || []) as GetPaperSpec_getPaperSpec_containers[]
    )

    watch(items, (val, oldVal) => {
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
          expanded.value.filter((el) => !removedIds.includes(el)),
          PREVIEW_STORE_KEY_PREFIX
        )
      }
    })

    onMounted(() => {
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
        query: PAPER_SPEC_DELTA,
        variables: {
          specId: route.params.specId,
        },
        fetchPolicy: 'no-cache',
      })

      observer.subscribe({
        next: ({ data }) => {
          const delta = data.paperSpecDelta
          const operation = delta.operation
          const typename = delta.payload.__typename

          logger.info(`[${typename}]: ${JSON.stringify(data)}`)

          // PRODUCT

          if (operation === Operation.INSERT_PRODUCT) {
            const parentInvoice = apolloClient.readFragment({
              id: `${Typename.PAPER_INVOICE}:${delta.parentId}`,
              fragment: PAPER_INVOICE_PRODUCTS_FRAGMENT,
              fragmentName: 'PaperInvoiceProductsFragment',
            })

            if (
              !parentInvoice.products.some(
                (el: any) => el.id === delta.payload.id
              )
            ) {
              parentInvoice.products.push(delta.payload)

              setTimeout(() => {
                apolloClient.writeFragment({
                  id: `${Typename.PAPER_INVOICE}:${delta.parentId}`,
                  fragment: PAPER_INVOICE_PRODUCTS_FRAGMENT,
                  fragmentName: 'PaperInvoiceProductsFragment',
                  data: parentInvoice,
                })
              }, 0)
            }
          }

          if (operation === Operation.UPDATE_PRODUCT) {
            const mergeOptions = {
              customMerge: (key: any) => {
                if (key === 'comments') {
                  return commentsMerge
                }
                if (key === 'images') {
                  const merge = (_: any, source: any) => {
                    return source || []
                  }
                  return merge
                }
              },
            }
            const cacheData = apolloClient.readFragment({
              id: `${Typename.PAPER_PRODUCT}:${delta.payload.id}`,
              fragment: PAPER_PRODUCT_FRAGMENT,
              fragmentName: 'PaperProductFragment',
            })
            const data =
              delta.payload.__typename === Typename.PAPER_PRODUCT
                ? deepmerge(cacheData, delta.payload, mergeOptions)
                : deepmerge(cacheData, delta.payload.fields, mergeOptions)
            apolloClient.writeFragment({
              id: `${Typename.PAPER_PRODUCT}:${delta.payload.id}`,
              fragment: PAPER_PRODUCT_FRAGMENT,
              fragmentName: 'PaperProductFragment',
              data,
            })
          }

          if (operation === Operation.DELETE_PRODUCT) {
            const parentInvoice = apolloClient.readFragment({
              id: `${Typename.PAPER_INVOICE}:${delta.parentId}`,
              fragment: PAPER_INVOICE_PRODUCTS_FRAGMENT,
              fragmentName: 'PaperInvoiceProductsFragment',
            })

            const index = parentInvoice.products.findIndex(
              (p: any) => p.id === delta.payload.id
            )

            if (index !== -1) {
              parentInvoice.products.splice(index, 1)
              apolloClient.writeFragment({
                id: `${Typename.PAPER_INVOICE}:${delta.parentId}`,
                fragment: PAPER_INVOICE_PRODUCTS_FRAGMENT,
                fragmentName: 'PaperInvoiceProductsFragment',
                data: parentInvoice,
              })
            }
          }

          // INVOICE

          if (operation === Operation.INSERT_INVOICE) {
            const parentSpec = apolloClient.readFragment({
              id: `${Typename.PAPER_SPEC}:${delta.parentId}`,
              fragment: PAPER_SPEC_INVOICES_FRAGMENT,
              fragmentName: 'PaperSpecInvoicesFragment',
            })

            if (
              !parentSpec.invoices.some((el: any) => el.id === delta.payload.id)
            ) {
              parentSpec.invoices.push(delta.payload)

              apolloClient.writeFragment({
                id: `${Typename.PAPER_SPEC}:${delta.parentId}`,
                fragment: PAPER_SPEC_INVOICES_FRAGMENT,
                fragmentName: 'PaperSpecInvoicesFragment',
                data: parentSpec,
              })
            }
          }

          if (operation === Operation.UPDATE_INVOICE) {
            const cacheData = apolloClient.readFragment({
              id: `${Typename.PAPER_INVOICE}:${delta.payload.id}`,
              fragment: PAPER_INVOICE_FRAGMENT,
              fragmentName: 'PaperInvoiceFragment',
            })
            const data =
              delta.payload.__typename === Typename.PAPER_INVOICE
                ? Object.assign({}, cacheData, delta.payload)
                : Object.assign({}, cacheData, delta.payload.fields)
            apolloClient.writeFragment({
              id: `${Typename.PAPER_INVOICE}:${delta.payload.id}`,
              fragment: PAPER_INVOICE_FRAGMENT,
              fragmentName: 'PaperInvoiceFragment',
              data,
            })
          }

          if (operation === Operation.DELETE_INVOICE) {
            const parentSpec = apolloClient.readFragment({
              id: `${Typename.PAPER_SPEC}:${delta.parentId}`,
              fragment: PAPER_SPEC_INVOICES_FRAGMENT,
              fragmentName: 'PaperSpecInvoicesFragment',
            })

            const index = parentSpec.invoices.findIndex(
              (p: any) => p.id === delta.payload.id
            )

            if (index !== -1) {
              parentSpec.invoices.splice(index, 1)
              apolloClient.writeFragment({
                id: `${Typename.PAPER_SPEC}:${delta.parentId}`,
                fragment: PAPER_SPEC_INVOICES_FRAGMENT,
                fragmentName: 'PaperSpecInvoicesFragment',
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
              id: `${Typename.PAPER_SPEC}:${delta.payload.id}`,
              fragment: PAPER_SPEC_FRAGMENT,
              fragmentName: 'PaperSpecFragment',
            })
            const data =
              delta.payload.__typename === Typename.PAPER_SPEC
                ? deepmerge(cacheData, delta.payload, mergeOptions)
                : deepmerge(cacheData, delta.payload.fields, mergeOptions)
            apolloClient.writeFragment({
              id: `${Typename.PAPER_SPEC}:${delta.payload.id}`,
              fragment: PAPER_SPEC_FRAGMENT,
              fragmentName: 'PaperSpecFragment',
              data,
            })
          }
        },
        error: (error) => {
          logger.warn('Error: ', error)
        },
      })
    })

    onGetPaperSpecResult(({ data, loading }) => {
      if (!loading && !isBooted.value) {
        updateExpanded(data?.getPaperSpec)
      }
    })

    const updateExpanded = async (spec: GetPaperSpec_getPaperSpec | null) => {
      const specId = spec && spec.id
      if (!specId || isBooted.value) return
      isBooted.value = true
      const _expanded = await getDealExpandedInvoices(
        specId,
        PREVIEW_STORE_KEY_PREFIX
      )
      if (!_expanded) {
        const ids = spec?.invoices?.map((el) => el.id) || []
        if (ids.length > 0) {
          expanded.value = ids
          await setDealExpandedInvoices(
            specId,
            expanded.value.slice(),
            PREVIEW_STORE_KEY_PREFIX
          )
        }
      } else {
        expanded.value = _expanded || []
      }
    }

    async function downloadPdf() {
      try {
        if (!spec.value) return
        if (!spec.value.requisite) return
        if (!spec.value.client) return
        if (!spec.value.shipment) return
        if (!spec.value.customs) return

        downloadLoading.value = true

        await printInvoice(
          spec.value,
          spec.value.requisite,
          spec.value.client,
          spec.value.shipment,
          spec.value.customs,
          'download',
          !spec.value.readyToPrint
        )
      } catch (error) {
        notify.error(`Error creating PDF: ${error.message}`)
        throw new Error(error)
      } finally {
        downloadLoading.value = false
      }
    }

    async function printPdf() {
      try {
        if (!spec.value) return
        if (!spec.value.requisite) return
        if (!spec.value.client) return
        if (!spec.value.shipment) return
        if (!spec.value.customs) return

        printLoading.value = true

        await printInvoice(
          spec.value,
          spec.value.requisite,
          spec.value.client,
          spec.value.shipment,
          spec.value.customs,
          'download',
          !spec.value.readyToPrint
        )
      } catch (error) {
        notify.error(`Error creating PDF: ${error.message}`)
        throw new Error(error)
      } finally {
        printLoading.value = false
      }
    }

    function setScrollLeft(scrollLeft: number, invoiceId: string) {
      invoiceScrollId.value = invoiceId
      invoiceScrollLeft.value = scrollLeft
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
        expanded.value.slice(),
        PREVIEW_STORE_KEY_PREFIX
      )
    }

    function toggleExpandAll() {
      if (expanded.value.length === 0) {
        expandAll()
      } else {
        collapseAll()
      }
    }

    function collapseAll() {
      expanded.value = []
      setDealExpandedInvoices(
        route.params.specId as string,
        [],
        PREVIEW_STORE_KEY_PREFIX
      )
    }

    function expandAll() {
      const ids = spec.value?.invoices?.reduce(
        (acc, curr) => [...acc, curr.id],
        [] as string[]
      )
      if (ids) {
        expanded.value = ids
        setDealExpandedInvoices(
          route.params.specId as string,
          ids,
          PREVIEW_STORE_KEY_PREFIX
        )
      }
    }

    return () => (
      <>
        <ZAppBar
          v-slots={{
            start: () => (
              <>
                <span class="hidden sm:flex w-px h-5 border-r border-light-gray-300 dark:border-gray-300 self-center" />
                <span class="hidden sm:flex text-lg text-gray-200 dark:text-white leading-none self-center">
                  {spec.value?.orgName}
                </span>
              </>
            ),
          }}
        />

        <main class="container flex-grow pt-8 pb-16">
          <div class="flex flex-col sm:flex-row items-center justify-between pb-6">
            {/* <!-- TODO: change tag to h1, need refactor base h1 style --> */}
            <div class="font-semibold leading-6 pr-2.5 py-2">
              <h2 class="text-2xl inline-block align-middle mr-2.5">
                <span>{t('paper.shippingTitle')}</span>&nbsp;{' '}
                <span>{spec.value?.specNo}</span>&nbsp;{' '}
                <span>{t('preposition.from')}</span>&nbsp;
                <span>
                  {spec.value?.createdAt
                    ? d(parseDate(spec.value.createdAt), 'short')
                    : undefined}
                </span>
              </h2>
              {spec.value?.shipped && (
                <div class="h-6 inline-flex items-center text-xs align-middle mr-2.5 px-2.5 bg-cold-blue-400 text-white rounded-[50px]">
                  {t('paper.shipped')}
                </div>
              )}
            </div>
            <div class="flex justify-end space-x-2">
              <Btn icon primary={false} disabled>
                <Icon>{ziUserPlus}</Icon>
              </Btn>
              <Btn
                icon
                loading={printLoading.value}
                class="bg-light-gray-100 dark:bg-gray-650 text-blue-500 dark:text-blue-500 hover:text-white dark:hover:text-white"
                {...{ onClick: printPdf }}
              >
                <Icon>{ziPrint}</Icon>
              </Btn>
              <Btn
                icon
                loading={downloadLoading.value}
                class="bg-light-gray-100 dark:bg-gray-650 text-blue-500 dark:text-blue-500 hover:text-white dark:hover:text-white"
                {...{ onClick: downloadPdf }}
              >
                {/* TODO: add icon to missing */}
                <i class="text-blue-500 text-2xl">
                  <svg
                    width="21"
                    height="21"
                    viewBox="0 0 21 21"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M3.1665 3.29161C3.1665 1.82275 4.37687 0.618042 5.84452 0.618042H12.95C13.1533 0.618042 13.3405 0.707819 13.473 0.847343L17.9666 5.56129C18.0758 5.68341 18.1665 5.85823 18.1665 6.05898V16.7281C18.1665 18.1971 16.9561 19.4018 15.4885 19.4018H5.84452C4.37686 19.4018 3.1665 18.1971 3.1665 16.7281V3.29161ZM5.84452 2.06718C5.17403 2.06718 4.61564 2.62666 4.61564 3.29161V16.7281C4.61564 17.3966 5.17741 17.9527 5.84452 17.9527H15.4885C16.1595 17.9527 16.7174 17.3971 16.7174 16.7281V6.7748H14.4458C13.2204 6.7748 12.2297 5.79025 12.2297 4.56315V2.06718H5.84452ZM13.1097 2.06718L16.7174 5.89486H14.4458C13.7095 5.89486 13.1097 5.30264 13.1097 4.56315V2.06718ZM9.94184 6.49025C9.94184 6.09093 10.2673 5.76568 10.6664 5.76568C11.0655 5.76568 11.391 6.09093 11.391 6.49025V10.572L12.7145 9.15242C12.9823 8.86313 13.4449 8.83872 13.7384 9.11593C14.0266 9.38382 14.0505 9.84554 13.7733 10.1388L13.7722 10.1399L11.194 12.9073C11.0603 13.048 10.8728 13.1367 10.6664 13.1367C10.46 13.1367 10.2727 13.048 10.139 12.9075L10.1368 12.9052L7.56515 10.14L7.56399 10.1388C7.28478 9.8436 7.31324 9.38731 7.59738 9.11732C7.89252 8.83686 8.34971 8.86501 8.62008 9.14954L8.62218 9.15175L9.94184 10.5707V6.49025ZM6.32103 14.7308C6.32103 14.3315 6.64653 14.0062 7.0456 14.0062H14.2874C14.6891 14.0062 15.0164 14.3296 15.0164 14.7308C15.0164 15.1299 14.691 15.4554 14.2919 15.4554H7.0456C6.64648 15.4554 6.32103 15.1299 6.32103 14.7308Z"
                      fill="currentColor"
                    />
                  </svg>
                </i>
              </Btn>
              <CommentList
                items={spec.value?.comments || []}
                specId={route.params.specId as string}
                placement={lgAndUp.value ? 'left-start' : 'right-start'}
                isPreview
                v-slots={{
                  activator: () => (
                    <Btn
                      icon
                      class="bg-light-gray-100 dark:bg-gray-650 text-blue-500 dark:text-blue-500 hover:text-white dark:hover:text-white"
                      contentClass="relative"
                    >
                      {hasNewComments.value && (
                        <div class="absolute top-0 right-0 w-2.5 h-2.5 rounded-full border-2 bg-light-gray-100 border-light-gray-100 transition-colors duration-100 ease-out -mt-0.5 -mr-1">
                          <div class="w-full h-full bg-purple-500 rounded-full" />
                        </div>
                      )}
                      <Icon>{ziComment}</Icon>
                    </Btn>
                  ),
                }}
              />
              <Btn
                icon
                class="bg-light-gray-100 dark:bg-gray-650 text-blue-500 dark:text-blue-500 hover:text-white dark:hover:text-white"
                {...{ onClick: toggleExpandAll }}
              >
                <Icon>
                  {expanded.value.length === 0 ? ziExpand : ziCollapse}
                </Icon>
              </Btn>
            </div>
          </div>

          <div class="pb-12 mb-1">
            {items.value.map((item) => (
              <div key={item.id} class="pb-1">
                <div
                  class={{
                    'h-12 flex items-center px-3 sm:px-5 rounded-t-md select-none cursor-pointer bg-light-gray-300 dark:bg-gray-650':
                      true,
                    'rounded-b-md': !expanded.value.includes(item.id),
                  }}
                  onClick={() => expand(item.id)}
                >
                  <div
                    class={[
                      'flex-shrink-0 w-3 h-3 mr-3 sm:mr-5 rounded-full',
                      item.invoiceStatus === InvoiceStatus.IN_STOCK
                        ? 'bg-green-500'
                        : item.invoiceStatus === InvoiceStatus.IN_PRODUCTION
                        ? 'bg-yellow-500'
                        : item.invoiceStatus === InvoiceStatus.IN_PROCESSING
                        ? 'bg-pink-500'
                        : 'bg-gray-100',
                    ]}
                  />
                  <div class="select-text">
                    <div class="text-gray-400 font-semibold leading-tight">
                      <span>{item.invoiceNo || '-'}</span>&nbsp;
                      <span class="text-sm">{t('preposition.from')}</span>
                      &nbsp;
                      <span>
                        {item.createdAt
                          ? d(parseDate(item.createdAt), 'short')
                          : '-'}
                      </span>
                      &nbsp; <span>/</span>&nbsp;
                      <span class="text-sm">
                        {t('paper.expectedShipment').toLowerCase()}
                      </span>
                      &nbsp;
                      <span>
                        {item.shippingDate
                          ? d(parseDate(item.shippingDate), 'short')
                          : '-'}
                      </span>
                    </div>
                  </div>
                  <div class="ml-auto">
                    <Btn icon mini text>
                      <Icon
                        class={{
                          'transition-transform': true,
                          'transform rotate-90': expanded.value.includes(
                            item.id
                          ),
                        }}
                      >
                        {ziChevronRight}
                      </Icon>
                    </Btn>
                  </div>
                </div>

                {expanded.value.includes(item.id) && (
                  <PreviewInvoice
                    specId={route.params.specId as string}
                    item={item}
                    currency={currency.value as SpecCurrency}
                    scrollLeft={invoiceScrollLeft.value}
                    scrollInvoiceId={invoiceScrollId.value}
                    {...{
                      'onChange:scrollLeft': setScrollLeft,
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* <!-- Info --> */}
          <div>
            <div class="flex flex-wrap lg:flex-nowrap pb-10">
              {/* <!-- Cargo Info --> */}
              <div class="w-full flex-grow lg:w-auto pb-10 lg:pb-0 lg:pr-3">
                <h4 class="text-xl font-semibold leading-6 mb-4">
                  {t('paper.cargoInfo')}
                </h4>

                {/* <!-- Summary --> */}
                <div class="flex flex-wrap sm:flex-nowrap -mx-2 pb-4">
                  <div class="w-1/2 pb-4 sm:pb-0 sm:w-1/4 px-2">
                    <div class="flex flex-col justify-between bg-light-gray-100 dark:bg-gray-800 rounded-md leading-6 h-full py-4 px-5">
                      <div class="flex text-gray-100 pb-2">
                        <Icon class="mr-2">{ziCalendar}</Icon>
                        <span>{t('paper.estimateDate')}</span>
                      </div>
                      <div class="text-lg text-center font-semibold">
                        {spec.value?.estimateShippingDate
                          ? d(
                              parseDate(spec.value.estimateShippingDate),
                              'short'
                            )
                          : t('placeholder.emptyDate')}
                      </div>
                    </div>
                  </div>
                  <div class="w-1/2 pb-4 sm:pb-0 sm:w-1/4 px-2">
                    <div class="flex flex-col justify-between bg-light-gray-100 dark:bg-gray-800 rounded-md leading-6 h-full py-4 px-5">
                      <div class="flex text-gray-100 pb-2">
                        <Icon class="mr-2">{ziVolume}</Icon>
                        <span>{t('paper.totalVolume')}</span>
                      </div>
                      <div class="text-lg text-center font-semibold">
                        {n(spec.value?.totalVolume || 0)} {t('measure.m3')}
                      </div>
                    </div>
                  </div>
                  <div class="w-1/2 sm:w-1/4 px-2">
                    <div class="flex flex-col justify-between bg-light-gray-100 dark:bg-gray-800 rounded-md leading-6 h-full py-4 px-5">
                      <div class="flex text-gray-100 pb-2">
                        <Icon class="mr-2">{ziBoxes}</Icon>
                        <span>{t('paper.totalPackages')}</span>
                      </div>
                      <div class="text-lg text-center font-semibold">
                        {n(spec.value?.qtyOfPackages || 0)}
                      </div>
                    </div>
                  </div>
                  <div class="w-1/2 sm:w-1/4 px-2">
                    <div class="flex flex-col justify-between bg-light-gray-100 dark:bg-gray-800 rounded-md leading-6 h-full py-4 px-5">
                      <div class="flex text-gray-100 pb-2">
                        <Icon class="mr-2">{ziVolume}</Icon>
                        <span>{t('paper.totalWeight')}</span>
                      </div>
                      <div class="text-lg text-center font-semibold">
                        {n(spec.value?.totalWeight || 0)} {t('measure.kg')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* <!-- Containers --> */}
                <div class="relative sm:flex bg-light-gray-100 dark:bg-gray-800 rounded-md overflow-hidden">
                  <div class="flex-grow py-[1.875rem] leading-4">
                    {containers.value.map((item, i) => (
                      <div
                        key={i}
                        class="flex flex-col xl:flex-row items-center justify-center"
                      >
                        {item.full ? (
                          <>
                            <div class="text-sm text-gray-200">
                              <div>
                                {`${t('paper.container', {
                                  n: item.full,
                                })} ${item.size?.replace(
                                  '_',
                                  ''
                                )}'${item.mode?.replace('_', '')}`}
                              </div>
                              <div
                                class={[
                                  'h-[56px] relative my-2',
                                  item.size === ContainerSize._40 ||
                                  item.size === ContainerSize._45
                                    ? 'w-[245px]'
                                    : 'w-[140px]',
                                ]}
                              >
                                <div class="py-[3px] px-[5px] w-full h-full">
                                  <div
                                    style={{
                                      width: '100%',
                                      willChange: 'width',
                                      transition:
                                        'width 0.4s cubic-bezier(0.61, 1, 0.88, 1)',
                                    }}
                                    class="relative w-0 h-full"
                                  >
                                    <div class="absolute top-0 left-0 bg-blue-500 w-full h-full" />
                                  </div>
                                </div>
                                <div class="absolute inset-0">
                                  {item.size === ContainerSize._20 ? (
                                    <img
                                      src={
                                        require('@/assets/img/containers/c20_2x.png')
                                          .default
                                      }
                                      alt="20'"
                                    />
                                  ) : (
                                    <img
                                      src={
                                        require('@/assets/img/containers/c40_2x.png')
                                          .default
                                      }
                                      alt="40'"
                                    />
                                  )}
                                </div>
                              </div>
                              <div>
                                <span>{t('paper.containerLoaded')}</span>
                                &nbsp;
                                <span class="inline-block w-10 font-bold">
                                  100%
                                </span>
                              </div>
                            </div>
                            <div class="flex items-center px-5 py-3">
                              <Icon class="text-gray-100">{ziPlus}</Icon>
                            </div>
                          </>
                        ) : undefined}

                        <div class="text-sm text-gray-200">
                          <div>
                            {`${item.size?.replace(
                              '_',
                              ''
                            )}'${item.mode?.replace('_', '')}`}
                          </div>
                          <div
                            class={[
                              'h-[56px] relative my-2',
                              item.size === ContainerSize._40 ||
                              item.size === ContainerSize._45
                                ? 'w-[245px]'
                                : 'w-[140px]',
                            ]}
                          >
                            <div class="py-[3px] px-[5px] h-full">
                              <div
                                style={{
                                  width: (item.loaded || 0) + '%',
                                  willChange: 'width',
                                  transition:
                                    'width 0.4s cubic-bezier(0.61, 1, 0.88, 1)',
                                }}
                                class="relative w-0 h-full"
                              >
                                <div class="absolute top-0 left-0 bg-blue-500 w-full h-full" />
                              </div>
                            </div>
                            <div class="absolute inset-0">
                              {item.size === ContainerSize._20 ? (
                                <img
                                  src={
                                    require('@/assets/img/containers/c20_2x.png')
                                      .default
                                  }
                                  alt="20'"
                                />
                              ) : (
                                <img
                                  src={
                                    require('@/assets/img/containers/c40_2x.png')
                                      .default
                                  }
                                  alt="40'"
                                />
                              )}
                            </div>
                          </div>
                          <div>
                            <span>{t('paper.containerLoaded')}</span>&nbsp;
                            <span class="inline-block w-10 font-bold">
                              {item.loaded || 0}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {spec.value?.shipped && (
                    <div class="w-full sm:w-[148px] flex-shrink-0 relative bg-light-gray-400 dark:bg-gray-400">
                      <div class="absolute inset-0 flex h-full items-center border-light-gray-100 dark:border-gray-700 pointer-events-none">
                        <div class="w-0 h-0 absolute top-0 left-1/2 pointer-events-none transform -translate-x-1/2 border-[15px] border-transparent border-b-0 sm:-translate-y-1/2 sm:top-1/2 sm:left-0 sm:border-b-[15px] sm:border-r-0" />
                      </div>
                      <div class="h-full flex items-center justify-center">
                        <div class="text-center py-2 sm:px-0">
                          <svg
                            class="mx-auto mt-5 mb-4 text-cold-blue-400"
                            width="57"
                            height="57"
                            viewBox="0 0 57 57"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M0.5 28.397C0.5 12.9331 13.036 0.397034 28.5 0.397034C43.964 0.397034 56.5 12.9331 56.5 28.397C56.5 43.861 43.964 56.397 28.5 56.397C13.036 56.397 0.5 43.861 0.5 28.397ZM28.5 4.54518C15.327 4.54518 4.64815 15.224 4.64815 28.397C4.64815 41.57 15.327 52.2489 28.5 52.2489C41.673 52.2489 52.3518 41.57 52.3518 28.397C52.3518 15.224 41.673 4.54518 28.5 4.54518Z"
                              fill="#2F80ED"
                            />
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M44.2118 19.9962L26.0712 37.6498L15.8184 27.5301L19.5063 23.7936L26.0972 30.2989L40.5504 16.2338L44.2118 19.9962Z"
                              fill="#2F80ED"
                            />
                          </svg>
                          <div class="text-sm">{t('paper.shipped')}</div>
                          <div class="text-sm text-gray-100">
                            {/* <!-- TODO: add shippingDate --> */}
                            {spec.value?.shippingDate
                              ? d(parseDate(spec.value.shippingDate), 'short')
                              : ''}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* <!-- Financial Info --> */}
              <div class="w-full flex-shrink-0 text-base lg:max-w-sm lg:pl-3">
                <h4 class="text-xl font-semibold leading-6 mb-4">
                  {t('paper.financialInfo')}
                </h4>
                <div class="bg-light-gray-100 dark:bg-gray-800 rounded-md leading-5 p-5">
                  <div class="flex rounded-md bg-white dark:bg-gray-900 pl-4 pr-3 py-3 mb-1">
                    <div class="flex-grow text-gray-100">
                      {t('paper.costOfGood')}
                    </div>
                    <div class="text-right">
                      {n(spec.value?.finalCost || 0, 'fixed')}
                      {t(`currency.${currency.value}.symbol`)}
                    </div>
                  </div>
                  <div class="flex rounded-md bg-white dark:bg-gray-900 pl-4 pr-3 py-3 mb-1">
                    <div class="flex-grow text-gray-100">
                      {t('paper.totalPrepay')}
                    </div>
                    <div class="text-right">
                      {n(spec.value?.totalPrepay || 0, 'fixed')}
                      {t(`currency.${currency.value}.symbol`)}
                    </div>
                  </div>
                  <div class="rounded-md bg-white dark:bg-gray-900 pl-4 pr-3 py-3 mb-1">
                    <div class="flex pb-2">
                      <div class="flex-grow text-gray-100">
                        {t('paper.finalToPay')}
                      </div>
                      <div
                        class={[
                          'text-right',
                          {
                            'text-red-500':
                              spec.value &&
                              spec.value.totalClientDebt &&
                              spec.value?.totalClientDebt > 0,
                          },
                        ]}
                      >
                        {n(spec.value?.totalClientDebt || 0, 'fixed')}
                        {t(`currency.${currency.value}.symbol`)}
                      </div>
                    </div>
                    <div class="flex">
                      <div class="flex-grow text-gray-100">
                        {t('paper.exchangeRate', {
                          currency: t(`currency.${currency.value}.iso-4217`),
                          exchange: t(`currency.USD.iso-4217`),
                        })}
                      </div>
                      <div class="text-right">
                        {n(spec.value?.currencyRate || 0)}
                        {t(`currency.USD.symbol`)}
                      </div>
                    </div>
                  </div>
                  <div class="flex rounded-md bg-white dark:bg-gray-900 pl-4 pr-3 py-3">
                    <div class="flex-grow text-gray-100">
                      {t('paper.totalToPay', {
                        currency: t('currency.USD.iso-4217'),
                      })}
                    </div>
                    <div class="text-right">
                      {n(spec.value?.total || 0, 'fixed')}
                      {t(`currency.USD.symbol`)}
                    </div>
                  </div>
                </div>
                {(spec.value?.terms || spec.value?.sentFrom) && (
                  <div class="bg-light-gray-100 dark:bg-gray-800 rounded-md text-center px-5 mt-4 py-6">
                    {spec.value?.terms && <span>{spec.value.terms}&nbsp;</span>}
                    <span>{spec.value?.sentFrom || ''}</span>
                  </div>
                )}
              </div>
            </div>

            {/* <!-- Actions --> */}
            <div class="flex flex-wrap md:flex-nowrap bg-light-gray-100 dark:bg-gray-800 rounded-md space-y-2 md:space-y-0 md:space-x-2 px-3 py-4">
              <Btn
                minWidth={85}
                disabled
                outlined
                class="w-full md:w-auto px-3"
              >
                <Icon class="mr-2">{ziUserPlus}</Icon>
                <span class="whitespace-nowrap leading-tight">
                  {t('paper.share')}
                </span>
              </Btn>
              <Btn
                loading={printLoading.value}
                minWidth={85}
                outlined
                darkIcon
                class="w-full md:w-auto px-3"
                {...{ onClick: printPdf }}
              >
                <Icon class="mr-2">{ziPrint}</Icon>
                <span>{t('paper.print')}</span>
              </Btn>
              <Btn
                loading={downloadLoading.value}
                minWidth={85}
                outlined
                darkIcon
                class="w-full md:w-auto px-3"
                {...{ onClick: downloadPdf }}
              >
                <i class="icon mr-2">
                  <svg
                    width="21"
                    height="21"
                    viewBox="0 0 21 21"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M3.1665 3.29161C3.1665 1.82275 4.37687 0.618042 5.84452 0.618042H12.95C13.1533 0.618042 13.3405 0.707819 13.473 0.847343L17.9666 5.56129C18.0758 5.68341 18.1665 5.85823 18.1665 6.05898V16.7281C18.1665 18.1971 16.9561 19.4018 15.4885 19.4018H5.84452C4.37686 19.4018 3.1665 18.1971 3.1665 16.7281V3.29161ZM5.84452 2.06718C5.17403 2.06718 4.61564 2.62666 4.61564 3.29161V16.7281C4.61564 17.3966 5.17741 17.9527 5.84452 17.9527H15.4885C16.1595 17.9527 16.7174 17.3971 16.7174 16.7281V6.7748H14.4458C13.2204 6.7748 12.2297 5.79025 12.2297 4.56315V2.06718H5.84452ZM13.1097 2.06718L16.7174 5.89486H14.4458C13.7095 5.89486 13.1097 5.30264 13.1097 4.56315V2.06718ZM9.94184 6.49025C9.94184 6.09093 10.2673 5.76568 10.6664 5.76568C11.0655 5.76568 11.391 6.09093 11.391 6.49025V10.572L12.7145 9.15242C12.9823 8.86313 13.4449 8.83872 13.7384 9.11593C14.0266 9.38382 14.0505 9.84554 13.7733 10.1388L13.7722 10.1399L11.194 12.9073C11.0603 13.048 10.8728 13.1367 10.6664 13.1367C10.46 13.1367 10.2727 13.048 10.139 12.9075L10.1368 12.9052L7.56515 10.14L7.56399 10.1388C7.28478 9.8436 7.31324 9.38731 7.59738 9.11732C7.89252 8.83686 8.34971 8.86501 8.62008 9.14954L8.62218 9.15175L9.94184 10.5707V6.49025ZM6.32103 14.7308C6.32103 14.3315 6.64653 14.0062 7.0456 14.0062H14.2874C14.6891 14.0062 15.0164 14.3296 15.0164 14.7308C15.0164 15.1299 14.691 15.4554 14.2919 15.4554H7.0456C6.64648 15.4554 6.32103 15.1299 6.32103 14.7308Z"
                      fill="currentColor"
                    />
                  </svg>
                </i>
                <span>{t('paper.download')}</span>
              </Btn>
              <CommentList
                items={spec.value?.comments || []}
                specId={route.params.specId as string}
                placement={lgAndUp.value ? 'left-start' : 'right-start'}
                isPreview
                class="w-full md:w-auto md:flex-grow flex justify-end"
                v-slots={{
                  activator: () => (
                    <Btn
                      minWidth={85}
                      outlined
                      darkIcon
                      class="w-full md:w-auto px-3"
                    >
                      {t('paper.comment')}
                    </Btn>
                  ),
                }}
              />
            </div>
          </div>
        </main>

        <footer class="container h-12 text-center">
          <Copyright />
        </footer>
      </>
    )
  },
})
