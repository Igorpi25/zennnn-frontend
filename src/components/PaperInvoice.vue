<template>
  <div
    v-scroll="onScroll"
    ref="productsTable"
    class="data-table-wrapper"
    @mouseenter="isMouseOver = true"
    @mouseleave="isMouseOver = false"
    @touchstart="isScrollStart = true"
    @touchend="clearScrollEndTimer"
  >
    <DataTable
      :headers="headers"
      :items="products"
      table-width="100%"
      table-class="table-fixed"
      thead-class="text-accent2 text-xs leading-tight"
      headers-whitespace-normal
    >
      <template v-slot:items="{ items }">
        <tr
          v-for="(item, index) in items"
          :key="item.id"
          class="items base-accent3 border-none"
        >
          <td class="text-gray-lighter text-right align-top">
            <div class="leading-none py-3">
              {{ index + 1 }}
            </div>
          </td>
          <td>
            <ProductImage
              :product-id="item.id"
              :images="getPreviewImage(item.images)"
              :upload="false"
              :removable="false"
              light
            />
          </td>
          <td>
            <div class="min-h-6">{{ item.name }} {{ item.article }}</div>
            <p class="text-gray-light leading-none min-h-4">
              {{ item.description }}
            </p>
            <div class="flex items-center">
              <img
                v-if="item.productStatus === ProductStatus.IN_STOCK"
                src="../assets/icons/in-stock.png"
              >
              <img
                v-else-if="item.productStatus === ProductStatus.IN_PRODUCTION"
                src="../assets/icons/factory-yellow.png"
                class="mb-2"
              >
              <img
                v-else-if="item.productStatus === ProductStatus.IN_PROCESSING"
                src="../assets/icons/in-processing.png"
              >
              <span
                class="text-orange"
                :class="[
                  'ml-2 text-sm',
                  item.productStatus === ProductStatus.IN_STOCK
                    ? 'status-stock' : item.productStatus === ProductStatus.IN_PRODUCTION
                      ? 'status-production' : item.productStatus === ProductStatus.IN_PROCESSING
                        ? 'status-processing' : ''
                ]"
              >
                <span>
                  {{ $te(`productStatus.${item.productStatus}`) ? $t(`productStatus.${item.productStatus}`) : '' }}
                </span>
              </span>
            </div>
          </td>
          <td class="text-center">
            <ProductImage
              v-if="item.images.length > 1"
              :product-id="item.id"
              :images="getAdditionImages(item.images)"
              :upload="false"
              :removable="false"
              light
            >
              <template v-slot:menu-activator>
                <div class="flex justify-center items-center">
                  <span class="mr-1 text-sm text-gray-lightest">
                  + {{ item.images.length - 1 }}
                  </span>
                  <img src="../assets/icons/pre-image.png">
                </div>
              </template>
            </ProductImage>
          </td>
          <td class="text-right">{{ $n(item.price || 0, 'decimal') }}</td>
          <td class="text-right">{{ $n(item.qty || 0) }}</td>
          <td class="text-right font-bold">{{ $n(item.amount || 0, 'decimal') }}</td>
          <td class="text-right">{{ $n(item.pkgQty || 0) }}</td>
          <td class="text-right">{{ item.pkgNo || '-' }}</td>
          <td class="text-center">
            <Comments
              :items="item.comments"
              :product-id="item.id"
              :spec-id="specId"
              is-product
              is-paper
              icon-size="24"
              left
              class="inline-block align-middle"
              style="color:#5a8199"
            />
          </td>
        </tr>
      </template>
      <template v-slot:footer>
        <tr class="bg-white">
          <td colspan="7">
            <div class="flex justify-end py-6">
              <div class="w-full max-w-xs">
                <div class="h-6 flex">
                  <div class="w-32 flex-shrink-0 text-right font-bold">
                    <span>{{ $t('preview.total') }}</span>&nbsp;
                    <span class="pl-1">{{ $t(`currency.${currency}.symbol`) }}</span>
                  </div>
                  <div class="flex-grow dots" />
                  <div class="font-bold">
                    {{ $n(invoice.totalClientAmount || 0, 'decimal') }}
                  </div>
                </div>
                <div class="h-6 flex text-gray-lightest">
                  <div class="w-32 flex-shrink-0 text-right">
                    <span>{{ $t('preview.discount') }}</span>&nbsp;
                    <span class="pl-1">{{ $t(`currency.${currency}.symbol`) }}</span>
                  </div>
                  <div class="flex-grow dots" />
                  <div class="font-bold">
                    {{ $n(invoice.discount || 0, 'decimal') }}
                  </div>
                </div>
                <div class="h-6 flex">
                  <div class="w-32 flex-shrink-0 text-right">
                    <span>{{ $t('preview.prepay') }}</span>&nbsp;
                    <span class="pl-1">{{ $t(`currency.${currency}.symbol`) }}</span>
                  </div>
                  <div class="flex-grow dots" />
                  <div class="font-bold">
                    {{ $n(invoice.prepayment || 0, 'decimal') }}
                  </div>
                </div>
                <div class="h-6 flex">
                  <div class="w-32 flex-shrink-0 text-right">
                    <span>{{ $t('preview.residue') }}</span>&nbsp;
                    <span class="pl-1">{{ $t(`currency.${currency}.symbol`) }}</span>
                  </div>
                  <div class="flex-grow dots" />
                  <div class="font-bold" style="color:#ff0000">
                    {{ $n(invoice.clientDebt || 0, 'decimal') }}
                  </div>
                </div>
              </div>
            </div>
          </td>
          <td colspan="3">
            <div class="py-6 px-5">
              <div class="text-sm">
                <div class="h-6 flex items-end">
                  <span v-if="!invoice.discount">
                    ({{ $t('preview.noDiscount') }})
                  </span>
                </div>
                <div class="h-6" />
                <div class="h-6 flex items-end">
                  {{ invoice.prepaymentDate ? $d($parseDate(invoice.prepaymentDate), 'short') : '--.--.--' }}
                </div>
                <div class="h-6 flex items-end">
                  {{ invoice.clientDebtDate ? $d($parseDate(invoice.clientDebtDate), 'short') : '--.--.--' }}
                </div>
              </div>
            </div>
          </td>
        </tr>
      </template>
    </DataTable>
  </div>
</template>

<script>
import ProductImage from '../components/ProductImage.vue'
import Comments from '../components/Comments'

import Scroll from '../directives/Scroll'

import { ProductStatus } from '../graphql/enums'
import { DEFAULT_CURRENCY } from '../config/globals'

export default {
  name: 'PaperInvoice',
  components: {
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
  data () {
    return {
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
    headers () {
      return [
        { text: '#', value: 'number', align: 'right', width: 20 },
        { text: this.$t('preview.photo'), value: 'photo', align: 'left', width: 62 },
        { text: this.$t('preview.name'), value: 'name', align: 'left', width: 260 },
        { text: this.$t('preview.additionalImages'), value: 'images', align: 'left', width: 85 },
        { text: `${this.$t('preview.price')}(${this.$t(`currency.${this.currency}.symbol`)})`, value: 'price', width: 80 },
        { text: this.$t('preview.qty'), value: 'qty', width: 70 },
        { text: `${this.$t('preview.cost')}(${this.$t(`currency.${this.currency}.symbol`)})`, value: 'cost', align: 'left', width: 90 },
        { text: this.$t('preview.qtyOfPackages'), value: 'pkgQty', align: 'left', width: 78 },
        { text: this.$t('preview.packageNo'), value: 'pkgNo', align: 'left', width: 78 },
        { text: this.$t('preview.leaveNote'), value: 'note', align: 'left', width: 78 },
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
    getPreviewImage (images) {
      return (images || []).slice(0, 1)
    },
    getAdditionImages (images) {
      return (images || []).slice(1)
    },
  },
}
</script>
