<template>
  <div
    v-scroll="onScroll"
    ref="productsTable"
    class="overflow-x-auto scrolling-touch border-t border-white bg-light-gray-100 rounded-b-md"
    @mouseenter="isMouseOver = true"
    @mouseleave="isMouseOver = false"
    @touchstart="isScrollStart = true"
    @touchend="clearScrollEndTimer"
  >
    <table
      width="100%"
      class="w-full table-fixed border-separate border-spacing-y-2 px-2"
    >
      <thead class="text-sm text-gray-100">
        <tr>
          <th
            v-for="header of headers"
            :key="header.value"
            :width="convertToUnit(header.width) || null"
            :style="{
              width: convertToUnit(header.width) || null,
              minWidth: convertToUnit(header.minWidth) || null
            }"
            :class="[
              header.value === 'qty' ? 'pl-2 pr-1' : header.value === 'unit' ? 'pl-1 pr-2' : 'px-2',
              header.align === 'right'
                ? 'text-right' : header.align === 'left'
                  ? 'text-left' : ''
            ]"
            class="font-normal leading-4 h-8"
          >
            {{ header.text }}
          </th>
        </tr>
      </thead>
      <tbody class="text-gray-300 leading-5">
        <tr
          v-for="(item, i) of products"
          :key="item.id"
        >
          <td class="bg-white pl-4 rounded-l-md">{{ i + 1 }}</td>
          <td class="bg-white pl-1 py-3">
            <ProductImage
              v-if="item.images.length > 0"
              :product-id="item.id"
              :images="item.images"
              :upload="false"
              :removable="false"
              :caption="item.description"
              light
            >
              <template v-slot:menu-activator>
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
                  <div class="absolute inset-0 overflow-hidden" style="border-radius: 5px;">
                    <Image
                      :src="item.images[0] && item.images[0].url"
                      aspect-ratio="1"
                      style="border-radius: 5px;"
                    >
                      <template v-slot:placeholder>
                        <div class="flex justify-center items-center w-full h-full">
                          <LoadingSpinner />
                        </div>
                      </template>
                    </Image>
                  </div>
                </div>
              </template>
            </ProductImage>
            <div v-else class="h-12 w-12" style="border-radius: 5px; background: rgba(196, 196, 196, 0.2);" />
          </td>
          <td class="bg-white p-2">
            <div class="truncate pb-xs" style="min-width: 250px; min-height: 20px;">
              {{ getWordText(item.name) }} {{ item.article }}
            </div>
            <div class="text-gray-100 truncate" style="min-height: 20px;">
              {{ item.description }}
            </div>
          </td>
          <td class="bg-white p-2">
            <div
              :class="[
                'text-sm',
                item.productStatus === ProductStatus.IN_STOCK
                  ? 'text-green-500' : item.productStatus === ProductStatus.IN_PRODUCTION
                    ? 'text-yellow-500' : item.productStatus === ProductStatus.IN_PROCESSING
                      ? 'text-pink-500' : 'text-gray-200'
              ]"
            >
              {{ $te(`productStatus.${item.productStatus}`) ? $t(`productStatus.${item.productStatus}`) : '' }}
            </div>
          </td>
          <td class="bg-white p-2 text-right">
            {{ $n(getClientPrice(item) || 0, 'fixed') }}
          </td>
          <td class="bg-white py-2 pl-2 pr-1 text-right">{{ $n(item.qty || 0) }}</td>
          <td class="bg-white py-2 pl-1 pr-2">
            {{ $te(`unit.${item.unit}`) ? $t(`unit.${item.unit}`) : '' }}
          </td>
          <td class="bg-white p-2 text-right">{{ $n(item.amount || 0, 'fixed') }}</td>
          <td class="bg-white p-2 text-right">{{ $n(item.pkgQty || 0) }}</td>
          <td class="bg-white p-2 text-right">{{ item.pkgNo || '-' }}</td>
          <td class="bg-white px-1 text-right">
            <Comments
              :items="item.comments"
              :product-id="item.id"
              :spec-id="specId"
              is-product
              is-paper
              placement="left-start"
              class="inline-block align-middle mr-sm text-gray-200 focus:text-gray-400 hover:text-gray-400 transition-colors duration-100 ease-out"
            />
          </td>
          <td class="bg-white p-2 rounded-r-md text-center">
            <Icon class="align-middle text-light-gray-400">
              {{ icons.ziOpenInNew }}
            </Icon>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr class="text-sm">
          <td colspan="5" class="py-2 pr-2 text-gray-100 text-right">
            <div class="h-6">
              <span>{{ $t('paper.total') }}</span>&nbsp;
              <span class="pl-1">{{ $t(`currency.${currency}.symbol`) }}:</span>
            </div>
            <div class="h-6">
              <span>{{ $t('paper.discount') }}</span>&nbsp;
              <span class="pl-1">{{ $t(`currency.${currency}.symbol`) }}:</span>
            </div>
            <div class="h-6">
              <span>{{ $t('paper.prepay') }}</span>&nbsp;
              <span class="pl-1">{{ $t(`currency.${currency}.symbol`) }}:</span>
            </div>
            <div class="h-6">
              <span>{{ $t('paper.residue') }}</span>&nbsp;
              <span class="pl-1">{{ $t(`currency.${currency}.symbol`) }}:</span>
            </div>
          </td>
          <td colspan="3" class="py-2 pr-2">
            <div class="h-6 flex">
              <div class="flex-grow text-gray-100 dots" />
              <div class="flex-shrink-0">
                {{ $n(invoice.totalClientAmount || 0, 'fixed') }}
              </div>
            </div>
            <div class="h-6 flex">
              <div class="flex-grow text-gray-100 dots" />
              <div class="flex-shrink-0">
                {{ $n(invoice.discount || 0, 'fixed') }}
              </div>
            </div>
            <div class="h-6 flex">
              <div class="flex-grow text-gray-100 dots" />
              <div class="flex-shrink-0">
                {{ $n(invoice.prepayment || 0, 'fixed') }}
              </div>
            </div>
            <div class="h-6 flex">
              <div class="flex-grow text-gray-100 dots" />
              <div class="flex-shrink-0">
                {{ $n(invoice.clientDebt || 0, 'fixed') }}
              </div>
            </div>
          </td>
          <td colspan="4" class="py-2 pl-5 text-gray-100">
            <div class="h-6">
              <span v-if="!invoice.discount">
                ({{ $t('paper.noDiscount') }})
              </span>
            </div>
            <div class="h-6" />
            <div class="h-6">
              {{ invoice.prepaymentDate ? $d($parseDate(invoice.prepaymentDate), 'short') : '--.--.--' }}
            </div>
            <div class="h-6">
              {{ invoice.clientDebtDate ? $d($parseDate(invoice.clientDebtDate), 'short') : '--.--.--' }}
            </div>
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
import { Scroll, convertToUnit, isNumber } from 'vue-supp'

import { ziOpenInNew } from '@zennnn/icons'
import { Icon, Image, LoadingSpinner } from '@zennnn/core'

import { ProductStatus } from '../graphql/enums'

import { DEFAULT_CURRENCY } from '../config/globals'

import ProductImage from './ProductImage.vue'
import Comments from './Comments.vue'

export default {
  name: 'PaperInvoice',
  components: {
    Icon,
    Image,
    LoadingSpinner,
    ProductImage,
    Comments,
  },
  directives: {
    Scroll,
  },
  props: {
    specId: {
      type: String,
      required: true,
    },
    invoice: {
      type: Object,
      default: () => ({}),
    },
    currency: {
      type: String,
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
  data () {
    return {
      icons: {
        ziOpenInNew,
      },
      isScrollStart: false,
      scrollEndTimer: null,
      isMouseOver: false,
      lazyScrollLeft: 0,
      scrollLeftDelay: 75,
      scrollAnimationDuration: 75,
      ProductStatus,
    }
  },
  computed: {
    profitForAll () {
      return this.invoice && this.invoice.profitForAll
    },
    headers () {
      return [
        { text: this.$t('paper.itemNo'), value: 'number', align: 'center', width: 48 },
        { text: this.$t('paper.photo'), value: 'photo', align: 'left', width: 58 },
        { text: this.$t('paper.name'), value: 'name', align: 'left', width: 250 },
        { text: this.$t('paper.status'), value: 'status', align: 'left', width: 120 },
        { text: `${this.$t('paper.price')}(${this.$t(`currency.${this.currency}.symbol`)})`, align: 'right', value: 'price', width: 96 },
        { text: this.$t('paper.qty'), value: 'qty', align: 'right', width: 65 },
        { text: this.$t('paper.unit'), value: 'unit', align: 'left', width: 60 },
        { text: `${this.$t('paper.cost')}(${this.$t(`currency.${this.currency}.symbol`)})`, value: 'cost', align: 'right', width: 116 },
        { text: this.$t('paper.qtyOfPackages'), value: 'pkgQty', align: 'right', width: 70 },
        { text: this.$t('paper.packageNo'), value: 'pkgNo', align: 'right', width: 70 },
        { text: this.$t('paper.notes'), value: 'note', align: 'left', width: 66 },
        { text: '', value: 'actions', width: 48 },
      ]
    },
    products () {
      return this.invoice.products || []
    },
  },
  watch: {
    scrollLeft () {
      if (this.invoice.id === this.scrollInvoiceId) return
      if (this.isMouseOver || this.isScrollStart) return
      this.setScrollLeft()
    },
  },
  mounted () {
    if (this.scrollLeft) {
      this.setScrollLeft()
    }
  },
  methods: {
    getClientPrice (item) {
      if (this.profitForAll) {
        return item.price
      }
      return isNumber(item.customPrice)
        ? item.customPrice
        : item.price
    },
    getWordText (item) {
      const word = item || {}
      const values = word.values || []
      const result = {}
      values.forEach(el => {
        const v = el.v || el.tr
        if (v) {
          result[el.k] = v
        }
      })
      return result[this.$i18n.locale] || result[word.defaultLocale]
    },
    convertToUnit (val) {
      return convertToUnit(val)
    },
    emitScrollLeftChange () {
      this.$emit('change:scrollLeft', this.lazyScrollLeft, this.invoice.id)
    },
    setScrollLeft () {
      const target = this.$refs.productsTable
      if (target) {
        const scrollLeft = this.scrollLeft || 0
        target.scrollLeft = scrollLeft
      }
    },
    onScroll (e) {
      const target = e.target
      const scrollLeft = target ? target.scrollLeft : 0
      this.lazyScrollLeft = scrollLeft < 0 ? 0 : scrollLeft
      if (!this.isMouseOver && !this.isScrollStart) return
      if (this.isScrollStart) {
        this.clearScrollEndTimer()
      }
      this.emitScrollLeftChange()
    },
    clearScrollEndTimer () {
      clearTimeout(this.scrollEndTimer)
      this.scrollEndTimer = setTimeout(() => {
        this.isScrollStart = false
      }, 300)
    },
  },
}
</script>
