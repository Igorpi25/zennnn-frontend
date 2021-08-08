import { defineComponent, ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Scroll, convertToUnit, isNumber } from 'vue-supp'
import { ziOpenInNew } from '@zennnn/icons'
import { Btn, Icon, Image, LoadingSpinner } from '@zennnn/core'
import { parseDate } from 'shared/utils/date'
import { DEFAULT_CURRENCY } from '@/config'
import { ProductStatus, SpecCurrency } from '@/graphql/types'
import CommentList from '@/components/comment/List'
import ProductImage from './ProductImage'

import type { PropType } from 'vue'
import type {
  GetPaperSpec_getPaperSpec_invoices,
  GetPaperSpec_getPaperSpec_invoices_products,
  GetPaperSpec_getPaperSpec_invoices_products_name,
} from '@/graphql/types'

export default defineComponent({
  directives: {
    Scroll,
  },

  props: {
    specId: {
      type: String,
      required: true,
    },
    item: {
      type: Object as PropType<GetPaperSpec_getPaperSpec_invoices>,
      default: () => ({}),
    },
    currency: {
      type: String as PropType<SpecCurrency>,
      default: DEFAULT_CURRENCY,
    },
    scrollInvoiceId: {
      type: String,
      default: '',
    },
    scrollLeft: {
      type: Number,
      default: 0,
    },
  },

  emits: ['change:scrollLeft', 'change:tab'],

  setup(props, { emit }) {
    const { t, te, n, d, locale } = useI18n()

    const productsTableRef = ref()
    const isScrollStart = ref(false)
    const scrollEndTimer = ref()
    const isMouseOver = ref(false)
    const lazyScrollLeft = ref(0)

    const profitForAll = computed(() => props.item.profitForAll)

    const headers = computed(() => [
      {
        text: t('paper.itemNo'),
        value: 'number',
        align: 'center' as const,
        width: 48,
      },
      {
        text: t('paper.photo'),
        value: 'photo',
        align: 'left' as const,
        width: 58,
      },
      {
        text: t('paper.name'),
        value: 'name',
        align: 'left' as const,
        width: 250,
      },
      {
        text: t('paper.status'),
        value: 'status',
        align: 'left' as const,
        width: 120,
      },
      {
        text: `${t('paper.price')}(${t(`currency.${props.currency}.symbol`)})`,
        align: 'right' as const,
        value: 'price',
        width: 96,
      },
      { text: t('paper.qty'), value: 'qty', align: 'right', width: 65 },
      {
        text: t('paper.unit'),
        value: 'unit',
        align: 'left' as const,
        width: 60,
      },
      {
        text: `${t('paper.cost')}(${t(`currency.${props.currency}.symbol`)})`,
        value: 'cost',
        align: 'right' as const,
        width: 116,
      },
      {
        text: t('paper.qtyOfPackages'),
        value: 'pkgQty',
        align: 'right' as const,
        width: 70,
      },
      {
        text: t('paper.packageNo'),
        value: 'pkgNo',
        align: 'right' as const,
        width: 70,
      },
      {
        text: t('paper.notes'),
        value: 'note',
        align: 'left' as const,
        width: 66,
      },
      { text: '', value: 'actions', width: 48 },
    ])

    const products = computed(() => props.item.products || [])

    watch(
      () => props.scrollLeft,
      () => {
        if (props.item.id === props.scrollInvoiceId) return
        if (isMouseOver.value || isScrollStart.value) return
        setScrollLeft()
      }
    )

    onMounted(() => {
      if (props.scrollLeft) {
        setScrollLeft()
      }
    })

    function getClientPrice(item: GetPaperSpec_getPaperSpec_invoices_products) {
      if (profitForAll.value) {
        return item.price
      }
      return isNumber(item.customPrice) ? item.customPrice : item.price
    }

    function getWordText(
      word: GetPaperSpec_getPaperSpec_invoices_products_name | null
    ) {
      const values = word?.values || []
      const result = {} as Record<string, string>
      values.forEach((el) => {
        const v = el.v || el.tr
        if (v) {
          result[el.k] = v
        }
      })
      return (
        result[locale.value] ||
        (word?.defaultLocale ? result[word.defaultLocale] : '')
      )
    }

    function emitScrollLeftChange() {
      emit('change:scrollLeft', lazyScrollLeft.value, props.item.id)
    }

    function setScrollLeft() {
      const target = productsTableRef.value
      if (target) {
        const scrollLeft = props.scrollLeft || 0
        target.scrollLeft = scrollLeft
      }
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
    }

    function clearScrollEndTimer() {
      clearTimeout(scrollEndTimer.value)
      scrollEndTimer.value = setTimeout(() => {
        isScrollStart.value = false
      }, 300)
    }

    return () => (
      <div
        v-scroll={onScroll}
        ref={productsTableRef}
        class="overflow-x-auto scrolling-touch border-t border-white dark:border-gray-900 bg-light-gray-100 dark:bg-gray-800 rounded-b-md"
        {...{
          onMouseenter: () => {
            isMouseOver.value = true
          },
          onMouseleave: () => {
            isMouseOver.value = false
          },
          onTouchstart: () => {
            isScrollStart.value = true
          },
          onTouchend: clearScrollEndTimer,
        }}
      >
        <table class="w-full table-fixed border-separate border-spacing-y-2 px-2">
          <thead class="text-sm text-gray-100">
            <tr>
              {headers.value.map((header) => (
                <th
                  key={header.value}
                  style={{
                    width: convertToUnit(header.width) || undefined,
                  }}
                  class={[
                    'font-normal leading-4 h-8',
                    header.value === 'qty'
                      ? 'pl-2 pr-1'
                      : header.value === 'unit'
                      ? 'pl-1 pr-2'
                      : 'px-2',
                    header.align === 'right'
                      ? 'text-right'
                      : header.align === 'left'
                      ? 'text-left'
                      : '',
                  ]}
                >
                  {header.text}
                </th>
              ))}
            </tr>
          </thead>
          <tbody class="text-gray-300 leading-5">
            {products.value.map((item, i) => (
              <tr key={item.id}>
                <td class="bg-white dark:bg-gray-900 pl-4 rounded-l-md">
                  {i + 1}
                </td>
                <td class="bg-white dark:bg-gray-900 pl-1 py-3">
                  {item.images && item.images.length > 0 ? (
                    <ProductImage
                      productId={item.id}
                      images={item.images}
                      upload={false}
                      removable={false}
                      caption={item.description}
                      v-slots={{
                        'menu-activator': () => (
                          <div class="relative h-12 w-12 cursor-pointer">
                            <div
                              class="absolute h-12 w-12"
                              style="top: 0.15rem; left: 0.15rem; border-radius: 5px; background: rgba(196, 196, 196, 0.4);"
                            >
                              <div
                                class="absolute h-12 w-12"
                                style="top: 0.15rem; left: 0.15rem; border-radius: 5px; background: rgba(196, 196, 196, 0.2);"
                              />
                            </div>
                            <div
                              class="absolute inset-0 overflow-hidden"
                              style="border-radius: 5px"
                            >
                              <Image
                                src={
                                  (item.images &&
                                    item.images[0] &&
                                    item.images[0].url) ||
                                  undefined
                                }
                                aspectRatio={1}
                                style="border-radius: 5px"
                                v-slots={{
                                  placeholder: () => (
                                    <div class="flex justify-center items-center w-full h-full">
                                      <LoadingSpinner />
                                    </div>
                                  ),
                                }}
                              />
                            </div>
                          </div>
                        ),
                      }}
                    />
                  ) : (
                    <div
                      class="h-12 w-12"
                      style="border-radius: 5px; background: rgba(196, 196, 196, 0.2)"
                    />
                  )}
                </td>
                <td class="bg-white dark:bg-gray-900 p-2">
                  <div
                    class="truncate pb-0.5"
                    style="min-width: 250px; min-height: 20px"
                  >
                    {getWordText(item.name)} {item.article}
                  </div>
                  <div class="text-gray-100 truncate" style="min-height: 20px">
                    {item.description}
                  </div>
                </td>
                <td class="bg-white dark:bg-gray-900 p-2">
                  <div
                    class={[
                      'text-sm',
                      item.productStatus === ProductStatus.IN_STOCK
                        ? 'text-green-500'
                        : item.productStatus === ProductStatus.IN_PRODUCTION
                        ? 'text-yellow-500'
                        : item.productStatus === ProductStatus.IN_PROCESSING
                        ? 'text-pink-500'
                        : 'text-gray-200',
                    ]}
                  >
                    {te(`productStatus.${item.productStatus}`)
                      ? t(`productStatus.${item.productStatus}`)
                      : ''}
                  </div>
                </td>
                <td class="bg-white dark:bg-gray-900 text-right p-2">
                  {n(getClientPrice(item) || 0, 'fixed')}
                </td>
                <td class="bg-white dark:bg-gray-900 text-right p-2 pr-1">
                  {n(item.qty || 0)}
                </td>
                <td class="bg-white dark:bg-gray-900 py-2 pl-1 pr-2">
                  {te(`unit.${item.unit}`) ? t(`unit.${item.unit}`) : ''}
                </td>
                <td class="bg-white dark:bg-gray-900 text-right p-2">
                  {n(item.amount || 0, 'fixed')}
                </td>
                <td class="bg-white dark:bg-gray-900 text-right p-2">
                  {n(item.pkgQty || 0)}
                </td>
                <td class="bg-white dark:bg-gray-900 text-right p-2">
                  {item.pkgNo || '-'}
                </td>
                <td class="bg-white dark:bg-gray-900 text-right px-1">
                  <CommentList
                    items={item.comments || []}
                    productId={item.id}
                    specId={props.specId}
                    isProduct
                    isPreview
                    placement="left-start"
                    class="text-gray-200"
                  />
                </td>
                <td class="bg-white dark:bg-gray-900 rounded-r-md text-center p-2">
                  <Btn icon mini text class="text-gray-200">
                    <Icon>{ziOpenInNew}</Icon>
                  </Btn>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr class="text-sm">
              <td colspan="5" class="text-gray-100 text-right py-2 pr-2">
                <div class="h-6">
                  <span>{t('paper.total')}</span>&nbsp;
                  <span class="pl-1">
                    {t(`currency.${props.currency}.symbol`)}:
                  </span>
                </div>
                <div class="h-6">
                  <span>{t('paper.discount')}</span>&nbsp;
                  <span class="pl-1">
                    {t(`currency.${props.currency}.symbol`)}:
                  </span>
                </div>
                <div class="h-6">
                  <span>{t('paper.prepay')}</span>&nbsp;
                  <span class="pl-1">
                    {t(`currency.${props.currency}.symbol`)}:
                  </span>
                </div>
                <div class="h-6">
                  <span>{t('paper.residue')}</span>&nbsp;
                  <span class="pl-1">
                    {t(`currency.${props.currency}.symbol`)}:
                  </span>
                </div>
              </td>
              <td colspan="3" class="py-2 pr-2">
                <div class="h-6 flex">
                  <div class="h-[1em] flex-grow border-dashed border-b border-gray-100" />
                  <div class="flex-shrink-0">
                    {n(props.item.totalClientAmount || 0, 'fixed')}
                  </div>
                </div>
                <div class="h-6 flex">
                  <div class="h-[1em] flex-grow border-dashed border-b border-gray-100" />
                  <div class="flex-shrink-0">
                    {n(props.item.discount || 0, 'fixed')}
                  </div>
                </div>
                <div class="h-6 flex">
                  <div class="h-[1em] flex-grow border-dashed border-b border-gray-100" />
                  <div class="flex-shrink-0">
                    {n(props.item.prepayment || 0, 'fixed')}
                  </div>
                </div>
                <div class="h-6 flex">
                  <div class="h-[1em] flex-grow border-dashed border-b border-gray-100" />
                  <div class="flex-shrink-0">
                    {n(props.item.clientDebt || 0, 'fixed')}
                  </div>
                </div>
              </td>
              <td colspan="4" class="text-gray-100 py-2 pl-5">
                <div class="h-6">
                  {!props.item.discount && (
                    <span>({t('paper.noDiscount')})</span>
                  )}
                </div>
                <div class="h-6" />
                <div class="h-6">
                  {props.item.prepaymentDate
                    ? d(parseDate(props.item.prepaymentDate), 'short')
                    : '--.--.--'}
                </div>
                <div class="h-6">
                  {props.item.clientDebtDate
                    ? d(parseDate(props.item.clientDebtDate), 'short')
                    : '--.--.--'}
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    )
  },
})
