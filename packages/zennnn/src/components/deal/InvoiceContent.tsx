import { defineComponent, ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useMutation } from '@vue/apollo-composable'
import { Scroll } from 'vue-supp'
import { ziLink, ziChat, ziQr } from '@zennnn/icons'
import { Icon, DataTable, Select } from '@zennnn/core'
import { DEFAULT_CURRENCY } from '@/config'
import { SpecCurrency, InvoiceProfitType, RoleInProject } from '@/graphql/types'
import {
  CREATE_PRODUCT,
  CREATE_PRODUCT_WITH_INVOICE,
} from '@/graphql/mutations'
import { useRoleInProject } from '@/composables/roleInProject'
import InvoiceProduct from './InvoiceProduct'
import InvoiceFooter from './InvoiceFooter'

import type { PropType } from 'vue'
import type {
  CreateProduct,
  CreateProductVariables,
  CreateProductWithInvoice,
  CreateProductWithInvoiceVariables,
  GetSpec_getSpec_invoices,
  GetSpec_getSpec_invoices_products,
  ProductInput,
} from '@/graphql/types'
import type { EmptyNumber } from '@/types'

interface DataTableHeaderProp {
  text: string
  value: string
  width?: string | number
}

export default defineComponent({
  directives: {
    scroll: Scroll,
  },

  props: {
    currency: {
      type: String as PropType<SpecCurrency>,
      default: DEFAULT_CURRENCY,
    },
    activeTab: {
      type: Number,
      default: 1,
    },
    item: {
      type: Object as PropType<GetSpec_getSpec_invoices | null>,
      default: () => ({}),
    },
    create: Boolean,
    hideFooter: Boolean,
    // Scroll
    scrollInvoiceId: {
      type: String,
      default: '',
    },
    scrollLeft: {
      type: Number,
      default: 0,
    },
  },

  emits: ['update:currency', 'change:scrollLeft', 'change:tab'],

  setup(props, { emit }) {
    const route = useRoute()
    const { t, n } = useI18n()
    const { hasAccess } = useRoleInProject({
      specId: route.params.specId as string,
    })

    const isScrollStart = ref(false)
    const scrollEndTimer = ref()
    const isMouseOver = ref(false)
    const lazyScrollLeft = ref(0)
    // const scrollLeftDelay = ref(75)
    const scrollAnimationDuration = ref(75)

    const productsTableRef = ref()

    const { mutate: createProductMutate } = useMutation<
      CreateProduct,
      CreateProductVariables
    >(CREATE_PRODUCT, {
      fetchPolicy: 'no-cache',
    })

    const { mutate: createProductWithInvoiceMutate } = useMutation<
      CreateProductWithInvoice,
      CreateProductWithInvoiceVariables
    >(CREATE_PRODUCT_WITH_INVOICE, {
      fetchPolicy: 'no-cache',
    })

    const items = computed(() => props.item?.products)

    const fixedHeadersWidth = computed(() =>
      productHeaders.value.reduce((acc, curr) => {
        return acc + (curr.width || 0)
      }, 0)
    )

    const currencies = computed(() =>
      Object.values(SpecCurrency).map((el) => ({
        text: el,
        value: el,
      }))
    )

    const isInvoiceProfitTypeMargin = computed(
      () => props.item?.profitType === InvoiceProfitType.MARGIN
    )

    const hasNewComments = computed(() =>
      props.item?.products?.some((item) =>
        item.comments?.some((c) => !c?.viewed)
      )
    )

    const isAmountVisible = computed(
      () =>
        hasAccess(RoleInProject.MANAGER) || hasAccess(RoleInProject.ACCOUNTANT)
    )

    const isOwnerOrManager = computed(() => hasAccess(RoleInProject.MANAGER))

    const isAccountant = computed(() => hasAccess(RoleInProject.ACCOUNTANT))

    const isWarehouseman = computed(() => hasAccess(RoleInProject.WAREHOUSEMAN))

    const isFreelancer = computed(() => hasAccess(RoleInProject.FREELANCER))

    const tabs = computed(() =>
      isOwnerOrManager.value
        ? [
            {
              value: 1,
              text: t('shipping.prices'),
              width: 130,
              class: 'flex-1',
            },
            {
              value: 2,
              text: t('shipping.warehouse'),
              width: 130,
              class: 'flex-1',
            },
            {
              value: 3,
              text: t('shipping.description'),
              width: 130,
              class: 'flex-1',
            },
            {
              value: 4,
              title: t('shipping.link'),
              icon: ziLink,
              width: 46,
            },
            { value: 5, icon: ziChat, width: 46 },
            { value: 6, icon: ziQr, width: 46, disabled: true },
          ]
        : isAccountant.value
        ? [
            { value: 1, text: t('shipping.prices'), width: 130 },
            { value: 3, text: t('shipping.description'), width: 130 },
            {
              value: 4,
              title: t('shipping.link'),
              icon: ziLink,
              width: 46,
            },
          ]
        : isWarehouseman.value || isFreelancer.value
        ? [
            { value: 2, text: t('shipping.warehouse'), width: 130 },
            { value: 3, text: t('shipping.description'), width: 130 },
            {
              value: 4,
              title: t('shipping.link'),
              icon: ziLink,
              width: 46,
            },
          ]
        : []
    )

    const headers = computed(() => {
      switch (props.activeTab) {
        case 1:
          return [...productHeaders.value, ...costHeaders.value]
        case 2:
          return [...productHeaders.value, ...storeHeaders.value]
        case 3:
          return [...productHeaders.value, ...infoHeaders.value]
        case 4:
          return [...productHeaders.value, ...linkHeaders.value]
        case 5:
          return [...productHeaders.value, ...chatHeaders.value]
        default:
          return []
      }
    })

    const productHeaders = computed(() => [
      {
        text: '',
        value: 'status',
        align: 'left' as const,
        width: 16,
        minWidth: 16,
      },
      {
        text: t('shipping.productIndexNo'),
        value: 'index',
        align: 'left' as const,
        width: 48,
        minWidth: 48,
        class: 'pl-4',
      },
      {
        text: t('shipping.photo'),
        value: 'photo',
        align: 'left' as const,
        width: 48,
        minWidth: 48,
        class: 'pl-1 pr-0',
      },
      {
        text: t('shipping.name'),
        value: 'name',
        align: 'left' as const,
        width: 123,
        minWidth: 123,
        class: 'px-2.5',
      },
      {
        text: t('shipping.model'),
        value: 'model',
        align: 'left' as const,
        width: 200,
        minWidth: 200,
        class: 'px-2.5',
      },
      {
        text: t('shipping.qty'),
        value: 'qty',
        align: 'right' as const,
        width: 68,
        minWidth: 68,
        class: 'px-2.5',
      },
      {
        text: '',
        value: 'unit',
        align: 'right' as const,
        width: 57,
        minWidth: 57,
      },
    ])

    const costHeaders = computed(() => [
      {
        text: isInvoiceProfitTypeMargin.value
          ? t('shipping.costPrice')
          : t('shipping.purchaseCost'),
        value: 'purchasePrice',
        width: 138,
        class: 'bg-gray-600 relative z-1 px-2.5',
        align: 'right' as const,
      },
      {
        text: t('shipping.obtainAmount'),
        value: 'purchaseAmount',
        align: 'right' as const,
        width: '100%',
        minWidth: 300,
        class: 'bg-gray-600 relative z-1 px-2.5',
      },
      {
        text: t('shipping.clientCost'),
        value: 'clientPrice',
        align: 'right' as const,
        width: 138,
        class: 'bg-gray-600 relative z-1 px-2.5',
      },
      {
        text: t('shipping.obtainAmount'),
        value: 'clientAmount',
        align: 'right' as const,
        width: '100%',
        minWidth: 300,
        class: 'bg-gray-600 relative z-1 px-2.5',
      },
      {
        text: '',
        value: 'action',
        width: 48,
        class: 'bg-gray-600 relative z-1',
      },
    ])

    const storeHeaders = computed(() => [
      {
        text: `${t('shipping.net')} ${t('measure.unit')} ${t('measure.kg')}`,
        value: 'net',
        align: 'right' as const,
        width: 64,
        class: 'bg-gray-600 relative z-1 leading-none pr-2.5 py-0',
      },
      {
        text: `${t('shipping.gross')} ${t('measure.unit')} ${t('measure.kg')}`,
        value: 'gross',
        align: 'right' as const,
        width: 64,
        class: 'bg-gray-600 relative z-1 leading-none pr-2.5 py-0',
      },
      {
        text: `${t('shipping.packageSize')} (${t('measure.mm')})`,
        value: 'size',
        align: 'center' as const,
        width: '140%',
        class: 'bg-gray-600 relative z-1 leading-none pr-2.5 py-0',
      },
      {
        text: t('shipping.packageQty'),
        value: 'pkgQty',
        width: 62,
        align: 'right' as const,
        class: 'bg-gray-600 relative z-1 leading-none pr-2.5 pr-2.5 py-0',
      },
      {
        text: t('shipping.packageNo'),
        value: 'pkgNo',
        width: 62,
        align: 'right' as const,
        class: 'bg-gray-600 relative z-1 leading-none pr-2.5 py-0',
      },
      {
        text: t('shipping.atWhouse'),
        value: 'atWhouse',
        width: 32,
        align: 'right' as const,
        class:
          'bg-gray-600 relative z-2 leading-none whitespace-nowrap pr-2.5 py-0',
      },
      {
        text: '',
        value: 'action',
        width: 48,
        class: 'bg-gray-600 relative z-1',
      },
    ])

    const infoHeaders = computed(() => [
      {
        text: t('shipping.additionalPhoto'),
        value: 'images',
        width: '100%',
        align: 'left' as const,
        class: 'bg-gray-600 relative z-1 pl-6',
      },
      {
        text: t('shipping.additionalInfo'),
        value: 'description',
        width: 282,
        align: 'left' as const,
        class: 'bg-gray-600 relative z-1 pl-2.5',
      },
      {
        text: '',
        value: 'action',
        width: 48,
        class: 'bg-gray-600 relative z-1',
      },
    ])

    const linkHeaders = computed(() => [
      {
        text: t('shipping.linkAttachFile'),
        value: 'file',
        width: '100%',
        align: 'left' as const,
        class: 'bg-gray-600 relative z-1 pl-6 pr-3',
      },
      {
        text: t('shipping.linkSave'),
        value: 'url',
        align: 'left' as const,
        width: 264,
        class: 'bg-gray-600 relative z-1 pl-3',
      },
      {
        text: '',
        value: 'action',
        width: 48,
        class: 'bg-gray-600 relative z-1',
      },
    ])

    const chatHeaders = computed(() => [
      {
        text: t('shipping.chatMembers'),
        value: 'participants',
        width: '100%',
        align: 'left' as const,
        class: 'bg-gray-600 relative z-1 px-6',
      },
      {
        text: '',
        value: 'messages',
        width: 140,
        align: 'left' as const,
        class: 'bg-gray-600 relative z-1',
      },
      {
        text: '',
        value: 'startChat',
        width: 168,
        align: 'right' as const,
        class: 'bg-gray-600 relative z-1',
      },
    ])

    watch(
      () => props.scrollLeft,
      () => {
        if (props.item?.id === props.scrollInvoiceId) return
        if (isMouseOver.value || isScrollStart.value) return
        setScrollLeft()
      }
    )

    onMounted(() => {
      // this.debounceEmitScrollLeftChange = throttle(this.emitScrollLeftChange, this.scrollLeftDelay, { leading: true })
      if (props.scrollLeft) {
        setScrollLeft(false)
      }
    })

    function switchTab(value: number) {
      emit('change:tab', value)
    }

    function addProduct(input: ProductInput) {
      if (props.create) {
        createProductWithInvoice(input)
      } else {
        createProduct(input)
      }
    }

    function createProduct(input: ProductInput) {
      if (!props.item?.id) return

      const variables: CreateProductVariables = {
        invoiceId: props.item.id,
      }
      if (input) {
        variables.input = {
          name: input.name,
          article: input.article,
        }
      }
      createProductMutate(variables)
    }

    function createProductWithInvoice(input: ProductInput) {
      const variables: CreateProductWithInvoiceVariables = {
        specId: route.params.specId as string,
      }
      if (input) {
        variables.input = {
          name: input.name,
          article: input.article,
        }
      }
      createProductWithInvoiceMutate(variables)
    }

    // Scroll
    function emitScrollLeftChange() {
      emit('change:scrollLeft', lazyScrollLeft.value, props.item?.id)
    }

    function setScrollLeft(animate = true) {
      const target = productsTableRef.value
      if (target) {
        const scrollLeft = props.scrollLeft || 0
        if (animate) {
          target.scrollLeft = scrollLeft
          // scrollLeftWithAnimation(scrollLeft)
        } else {
          target.scrollLeft = scrollLeft
        }
      }
    }

    // eslint-disable-next-line
    function scrollLeftWithAnimation(scrollLeft: number) {
      const container = productsTableRef.value
      if (!container) return
      const targetLocation = scrollLeft
      const startLocation = container.scrollLeft
      if (targetLocation === startLocation) return
      const startTime = performance.now()
      const duration = scrollAnimationDuration.value
      const ease = (t: number) => t
      return new Promise((resolve) =>
        requestAnimationFrame(function step(currentTime) {
          const timeElapsed = currentTime - startTime
          const progress = Math.abs(
            duration ? Math.min(timeElapsed / duration, 1) : 1
          )

          container.scrollLeft = Math.floor(
            startLocation + (targetLocation - startLocation) * ease(progress)
          )

          const clientWidth = container.clientWidth
          if (
            progress === 1 ||
            clientWidth + container.scrollLeft === container.scrollWidth
          ) {
            return resolve(targetLocation)
          }

          requestAnimationFrame(step)
        })
      )
    }

    function onScroll(e: Event) {
      const target = e.target as HTMLElement
      const scrollLeft = target ? target.scrollLeft : 0
      lazyScrollLeft.value = scrollLeft < 0 ? 0 : scrollLeft
      if (!isMouseOver.value && !isScrollStart.value) return
      if (isScrollStart.value) {
        clearScrollEndTimer()
      }
      emitScrollLeftChange()
      // debounceEmitScrollLeftChange()
    }

    function clearScrollEndTimer() {
      clearTimeout(scrollEndTimer.value)
      scrollEndTimer.value = setTimeout(() => {
        isScrollStart.value = false
      }, 300)
    }

    return () => (
      <div>
        <div
          v-scroll={onScroll}
          ref={productsTableRef}
          class="overflow-x-auto scrolling-touch"
          onMouseenter={() => {
            isMouseOver.value = true
          }}
          onMouseleave={() => {
            isMouseOver.value = false
          }}
          onTouchstart={() => {
            isScrollStart.value = true
          }}
          onTouchend={clearScrollEndTimer}
        >
          <div class="flex pt-1">
            <DataTable
              headers={headers.value}
              items={items.value || []}
              scrollable={false}
              rounded={false}
              class="relative"
              tableClass="w-full table-fixed"
              // thead-class="text-sm"
              v-slots={{
                'header-content-atWhouse': ({
                  header,
                }: {
                  header: DataTableHeaderProp
                }) => (
                  <span
                    class="inline-block truncate align-middle"
                    style="max-width: 78px"
                  >
                    {header.text}
                  </span>
                ),
                top: () => (
                  <div class="flex">
                    <div
                      class="flex-shrink-0"
                      style={{
                        width: fixedHeadersWidth.value + 'px',
                      }}
                    />
                    <div class="h-11 flex-grow flex overflow-x-auto scrolling-touch relative z-1 -mb-px">
                      {tabs.value.map((item, i) => (
                        <button
                          aria-selected={props.activeTab === item.value}
                          key={item.value}
                          class={[
                            'flex items-center justify-center rounded-t bg-gray-600 px-2',
                            'select-none whitespace-nowrap cursor-pointer',
                            'transition-colors duration-100 ease-out',
                            { 'mr-1': i + 1 < tabs.value.length },
                            'focus:outline-none focus:text-white hover:text-white',
                            props.activeTab === item.value
                              ? 'text-white'
                              : 'bg-opacity-50 text-gray-200',
                          ]}
                          style={{ width: item.width + 'px' }}
                          title={item.title || undefined}
                          role="tab"
                          tabindex={0}
                          onClick={() => switchTab(item.value)}
                        >
                          {item.icon && (
                            <span class="relative">
                              {item.value === 5 && hasNewComments.value && (
                                <div
                                  class={[
                                    'absolute top-0 right-0 -mt-0.5 -mr-1 w-2.5 h-2.5 rounded-full border-2 bg-gray-600 border-gray-600 transition-colors duration-100 ease-out',
                                    props.activeTab === item.value
                                      ? 'bg-gray-600'
                                      : 'border-gray-700',
                                  ]}
                                >
                                  <div class="w-full h-full bg-purple-500 rounded-full" />
                                </div>
                              )}
                              <Icon>{item.icon}</Icon>
                            </span>
                          )}
                          <span>{item.text}</span>
                          {item.value === 1 && isOwnerOrManager.value && (
                            <Select
                              modelValue={props.currency}
                              items={currencies.value}
                              disabled={props.activeTab !== item.value}
                              controlClass="px-0"
                              inputClass="w-0 min-h-0 h-0 !m-0"
                              class="inline-flex"
                              solo
                              {...{
                                onClick: () => {
                                  if (props.activeTab !== item.value) {
                                    switchTab(item.value)
                                  }
                                },
                                'onUpdate:modelValue': (val: EmptyNumber) =>
                                  emit('update:currency', val),
                              }}
                              // TODO: in select replace input to div
                              v-slots={{
                                prepend: () => (
                                  <span class="text-sm pt-0.5 pl-1">
                                    {props.currency}
                                  </span>
                                ),
                                item: ({
                                  item,
                                }: {
                                  item: typeof currencies.value[0]
                                }) => (
                                  <span class="text-sm px-1">{item.text}</span>
                                ),
                              }}
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ),
                items: ({
                  items,
                }: {
                  items: GetSpec_getSpec_invoices_products[]
                }) => (
                  <>
                    {items.map((item, index) => (
                      <InvoiceProduct
                        item={item}
                        index={index + 1}
                        activeTab={props.activeTab}
                        profitType={props.item?.profitType}
                        profitForAll={!!props.item?.profitForAll}
                      />
                    ))}
                    {isOwnerOrManager.value && (
                      <InvoiceProduct
                        index={items.length}
                        activeTab={props.activeTab}
                        profitType={props.item?.profitType}
                        profitForAll={!!props.item?.profitForAll}
                        create
                        {...{
                          onCreate: addProduct,
                        }}
                      />
                    )}
                  </>
                ),
                footer: () =>
                  !props.create && (
                    <tr>
                      <td colspan="4">
                        <div
                          style="height: 88px"
                          class="absolute inset-x-0 top-0 pointer-events-none opacity-50 bg-gradient-to-b from-gray-900 to-gray-900/0 -mt-1"
                        />
                        <div class="h-12 absolute inset-x-0 bottom-0 pointer-events-none opacity-50 bg-gradient-to-t from-gray-900 to-gray-900/0" />
                      </td>
                      <td colspan={props.activeTab === 2 ? 2 : 3} />

                      {props.activeTab === 1 ? (
                        <>
                          <td class="text-gray-300 text-right px-2.5">
                            <span class="relative z-1">
                              {t('shipping.total')}
                            </span>
                          </td>
                          <td class="text-right px-2.5">
                            <span class="relative z-1">
                              {n(props.item?.totalPurchaseAmount || 0, 'fixed')}
                            </span>
                          </td>
                          <td class="text-gray-300 text-right px-2.5">
                            <span class="relative z-1">
                              {t('shipping.total')}
                            </span>
                          </td>
                          <td class="text-right px-2.5">
                            <span class="relative z-1">
                              {n(props.item?.totalClientAmount || 0, 'fixed')}
                            </span>
                          </td>
                          <td colspan="2"></td>
                        </>
                      ) : props.activeTab === 2 ? (
                        <>
                          <td class="text-gray-300 text-right">
                            <span class="relative z-1">
                              {t('shipping.total')}
                            </span>
                          </td>
                          <td class="text-right pr-2.5">
                            <span class="relative z-1">
                              <span>{n(props.item?.totalNet || 0)}</span>
                              <span class="text-gray-300 absolute right-0 translate-x-full pl-1">
                                {t('measure.kg')}
                              </span>
                            </span>
                          </td>
                          <td class="text-right pr-2.5">
                            <span class="relative z-1">
                              <span>{n(props.item?.totalGross || 0)}</span>
                              <span class="text-gray-300 absolute right-0 translate-x-full pl-1">
                                {t('measure.kg')}
                              </span>
                            </span>
                          </td>
                          <td class="text-center">
                            <span class="relative z-1">
                              {n(props.item?.totalVolume || 0)}
                              <span class="text-gray-300">
                                {t('measure.m3')}
                              </span>
                            </span>
                          </td>
                          <td class="text-right pr-2.5">
                            <span class="relative z-1">
                              {n(props.item?.totalPkgQty || 0)}
                            </span>
                          </td>
                          <td class="text-left" colspan="2">
                            <span class="relative whitespace-nowrap z-1">
                              <span class="text-gray-300">
                                {t('measure.pkg')}
                              </span>
                            </span>
                          </td>
                          <td></td>
                        </>
                      ) : (
                        <td colspan="4"></td>
                      )}
                    </tr>
                  ),
              }}
            />
          </div>
        </div>

        {isAmountVisible.value &&
          items &&
          !props.create &&
          !props.hideFooter && (
            <InvoiceFooter currency={props.currency} item={props.item} />
          )}
      </div>
    )
  },
})
